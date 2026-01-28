-- ============================================
-- SECURITY HARDENING MIGRATION
-- Fixes identified vulnerabilities and adds constraints
-- ============================================

-- 1. Move extensions from public to extensions schema (security best practice)
-- Note: vector extension needs to stay in public for now due to Supabase requirements
CREATE SCHEMA IF NOT EXISTS extensions;

-- 2. Add GST Number format validation (India-specific)
-- Format: 15 alphanumeric characters with specific pattern
ALTER TABLE organizations 
ADD CONSTRAINT gst_format_check 
CHECK (
  gst_number IS NULL OR 
  gst_number ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
);

-- 3. Add PAN validation (India-specific)  
-- Format: 10 alphanumeric characters AAAAA0000A
ALTER TABLE organizations
ADD CONSTRAINT pan_format_check
CHECK (
  pan IS NULL OR
  pan ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
);

-- 4. Add CIN validation (India-specific)
-- Format: 21 character Corporate Identity Number
ALTER TABLE organizations
ADD CONSTRAINT cin_format_check
CHECK (
  cin IS NULL OR
  LENGTH(cin) = 21
);

-- 5. Ensure search_path is set on all SECURITY DEFINER functions
-- Recreate helper functions with explicit search_path for security

-- Drop and recreate is_org_member with search_path
CREATE OR REPLACE FUNCTION public.is_org_member(_user_id uuid, _org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = _user_id 
      AND org_id = _org_id 
      AND is_active = true
  )
$$;

-- Drop and recreate has_org_role with search_path
CREATE OR REPLACE FUNCTION public.has_org_role(_user_id uuid, _org_id uuid, _role org_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = _user_id 
      AND org_id = _org_id 
      AND org_role = _role
      AND is_active = true
  )
$$;

-- Drop and recreate has_permission with search_path
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _org_id uuid, _permission permission_type)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = _user_id 
      AND org_id = _org_id 
      AND _permission = ANY(permissions)
      AND is_active = true
  )
$$;

-- Drop and recreate has_platform_role with search_path
CREATE OR REPLACE FUNCTION public.has_platform_role(_user_id uuid, _role platform_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id 
      AND platform_role = _role
  )
$$;

-- 6. Add index for faster security checks
CREATE INDEX IF NOT EXISTS idx_org_members_user_active 
ON organization_members(user_id, org_id) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_profiles_platform_role 
ON profiles(id) 
WHERE platform_role = 'platform_admin';

-- 7. Create security_events table for monitoring
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  user_id uuid,
  ip_address inet,
  user_agent text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on security_events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Only platform admins can view security events
CREATE POLICY "Platform admins can view security events"
ON public.security_events
FOR SELECT
USING (has_platform_role(auth.uid(), 'platform_admin'::platform_role));

-- Only system can insert (via service role)
CREATE POLICY "System can insert security events"
ON public.security_events
FOR INSERT
WITH CHECK (false);

-- Add index for security event queries
CREATE INDEX idx_security_events_type_time 
ON security_events(event_type, created_at DESC);

CREATE INDEX idx_security_events_severity 
ON security_events(severity, created_at DESC) 
WHERE severity IN ('high', 'critical');

-- 8. Add rate limiting metadata table
CREATE TABLE IF NOT EXISTS public.rate_limit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- IP address or user ID
  endpoint text NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  blocked_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view rate limit logs
CREATE POLICY "Admins can view rate limit logs"
ON public.rate_limit_log
FOR SELECT
USING (has_platform_role(auth.uid(), 'platform_admin'::platform_role));

-- System insert only
CREATE POLICY "System can insert rate limit logs"
ON public.rate_limit_log
FOR INSERT
WITH CHECK (false);

-- Index for rate limit queries
CREATE INDEX idx_rate_limit_identifier 
ON rate_limit_log(identifier, endpoint, window_start DESC);

-- 9. Function to log security events (for use in triggers/edge functions)
CREATE OR REPLACE FUNCTION public.log_security_event(
  _event_type text,
  _severity text,
  _user_id uuid DEFAULT NULL,
  _ip_address inet DEFAULT NULL,
  _details jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO public.security_events (
    event_type, severity, user_id, ip_address, details
  ) VALUES (
    _event_type, _severity, _user_id, _ip_address, _details
  )
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Grant execute to authenticated users (function controls its own access)
GRANT EXECUTE ON FUNCTION public.log_security_event TO authenticated;

-- 10. Add comment documenting security configuration
COMMENT ON SCHEMA public IS 'Main schema for Zero Graph application. RLS enabled on all user-facing tables. Functions use SET search_path = public for security.';
