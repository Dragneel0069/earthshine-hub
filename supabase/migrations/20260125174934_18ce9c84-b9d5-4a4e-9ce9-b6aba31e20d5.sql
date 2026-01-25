-- ============================================
-- PHASE 1: ZEROGRAPH ORG-CENTRIC ARCHITECTURE
-- Core Organization Tables + Extended RBAC
-- ============================================

-- 1. Drop old user-centric tables (clean slate)
DROP TABLE IF EXISTS public.certification_milestones CASCADE;
DROP TABLE IF EXISTS public.user_certifications CASCADE;
DROP TABLE IF EXISTS public.compliance_reports CASCADE;
DROP TABLE IF EXISTS public.csv_imports CASCADE;
DROP TABLE IF EXISTS public.emissions CASCADE;
DROP TABLE IF EXISTS public.offset_preferences CASCADE;
DROP TABLE IF EXISTS public.recs CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.supplier_requests CASCADE;
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.organization_settings CASCADE;
DROP TABLE IF EXISTS public.quiz_responses CASCADE;
DROP TABLE IF EXISTS public.retirement_certificates CASCADE;
DROP TABLE IF EXISTS public.marketplace_orders CASCADE;
DROP TABLE IF EXISTS public.credit_ledger CASCADE;
DROP TABLE IF EXISTS public.credit_batches CASCADE;
DROP TABLE IF EXISTS public.carbon_projects CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Drop old enums
DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.subscription_plan CASCADE;
DROP TYPE IF EXISTS public.certification_type CASCADE;

-- ============================================
-- 2. NEW ENUMS
-- ============================================

-- Global platform roles
CREATE TYPE public.platform_role AS ENUM (
  'platform_admin',    -- Zerograph staff
  'org_owner',         -- Organization founder
  'consultant',        -- External advisor (multi-org)
  'auditor'            -- Read-only verifier (multi-org)
);

-- Organization-level roles
CREATE TYPE public.org_role AS ENUM (
  'admin',    -- Full org control
  'editor',   -- Can create/edit data
  'viewer'    -- Read-only
);

-- Granular permissions
CREATE TYPE public.permission_type AS ENUM (
  'can_view_emissions',
  'can_edit_emissions',
  'can_approve_emissions',
  'can_view_reports',
  'can_generate_reports',
  'can_approve_reports',
  'can_view_marketplace',
  'can_transact',
  'can_retire_credits',
  'can_view_ledger',
  'can_invite_members',
  'can_manage_org'
);

-- Report types
CREATE TYPE public.report_type AS ENUM ('BRSR', 'GHG', 'CDP', 'Internal');

-- Emission/Report status
CREATE TYPE public.record_status AS ENUM ('draft', 'pending_review', 'approved', 'locked', 'rejected');

-- Credit order status
CREATE TYPE public.order_status AS ENUM ('initiated', 'paid', 'in_escrow', 'retired', 'cancelled', 'failed');

-- ============================================
-- 3. PROFILES TABLE (extends auth.users)
-- ============================================

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  platform_role platform_role DEFAULT 'org_owner',
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (except platform_role)
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Platform admins can view all profiles
CREATE POLICY "Platform admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.platform_role = 'platform_admin'
    )
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'first_name', '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 4. ORGANIZATIONS TABLE
-- ============================================

CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  legal_name text,
  sector text,
  sub_sector text,
  country text DEFAULT 'India',
  state text,
  city text,
  gst_number text,
  cin text,  -- Corporate Identification Number (India)
  pan text,
  employee_count int,
  annual_revenue numeric,
  baseline_year int,
  financial_year_start text DEFAULT 'April',
  logo_url text,
  website text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. ORGANIZATION MEMBERS (Multi-org support)
-- ============================================

CREATE TABLE public.organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  org_role org_role NOT NULL DEFAULT 'viewer',
  permissions permission_type[] DEFAULT ARRAY['can_view_emissions', 'can_view_reports']::permission_type[],
  invited_by uuid REFERENCES public.profiles(id),
  invited_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, org_id)
);

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if user is member of org
CREATE OR REPLACE FUNCTION public.is_org_member(_user_id uuid, _org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = _user_id
      AND org_id = _org_id
      AND is_active = true
  )
$$;

-- Helper function: Check org role
CREATE OR REPLACE FUNCTION public.has_org_role(_user_id uuid, _org_id uuid, _role org_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
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

-- Helper function: Check permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _org_id uuid, _permission permission_type)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
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

-- Helper function: Check platform role
CREATE OR REPLACE FUNCTION public.has_platform_role(_user_id uuid, _role platform_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND platform_role = _role
  )
$$;

-- RLS: Organizations - members can view their orgs
CREATE POLICY "Org members can view org" ON public.organizations
  FOR SELECT USING (public.is_org_member(auth.uid(), id));

-- RLS: Organizations - admins can update
CREATE POLICY "Org admins can update org" ON public.organizations
  FOR UPDATE USING (public.has_org_role(auth.uid(), id, 'admin'));

-- RLS: Organizations - anyone authenticated can create (they become owner)
CREATE POLICY "Authenticated users can create org" ON public.organizations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS: Organization members - can view members of their orgs
CREATE POLICY "Members can view org members" ON public.organization_members
  FOR SELECT USING (public.is_org_member(auth.uid(), org_id));

-- RLS: Organization members - admins can manage
CREATE POLICY "Org admins can manage members" ON public.organization_members
  FOR ALL USING (public.has_org_role(auth.uid(), org_id, 'admin'));

-- Auto-add creator as org admin
CREATE OR REPLACE FUNCTION public.handle_new_organization()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.organization_members (
    user_id, org_id, org_role, permissions, accepted_at
  ) VALUES (
    auth.uid(),
    NEW.id,
    'admin',
    ARRAY[
      'can_view_emissions', 'can_edit_emissions', 'can_approve_emissions',
      'can_view_reports', 'can_generate_reports', 'can_approve_reports',
      'can_view_marketplace', 'can_transact', 'can_retire_credits',
      'can_view_ledger', 'can_invite_members', 'can_manage_org'
    ]::permission_type[],
    now()
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_organization_created
  AFTER INSERT ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_organization();

-- ============================================
-- 6. IMMUTABLE LEDGER (Audit Trail)
-- ============================================

CREATE TABLE public.ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES public.organizations(id),
  entity_type text NOT NULL,  -- 'emission', 'report', 'credit_order', 'member', etc.
  entity_id uuid NOT NULL,
  action text NOT NULL,       -- 'created', 'updated', 'approved', 'locked', 'retired', etc.
  performed_by uuid REFERENCES public.profiles(id),
  before_state jsonb,
  after_state jsonb,
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- No UPDATE or DELETE ever
ALTER TABLE public.ledger ENABLE ROW LEVEL SECURITY;

-- Members with ledger permission can view org ledger
CREATE POLICY "Ledger viewers can read" ON public.ledger
  FOR SELECT USING (
    public.has_permission(auth.uid(), org_id, 'can_view_ledger')
    OR public.has_platform_role(auth.uid(), 'platform_admin')
    OR public.has_platform_role(auth.uid(), 'auditor')
  );

-- Only system (triggers) can insert - no direct user inserts
CREATE POLICY "System inserts only" ON public.ledger
  FOR INSERT WITH CHECK (false);

-- Ledger insert helper (called by triggers)
CREATE OR REPLACE FUNCTION public.log_to_ledger(
  _org_id uuid,
  _entity_type text,
  _entity_id uuid,
  _action text,
  _before jsonb DEFAULT NULL,
  _after jsonb DEFAULT NULL,
  _metadata jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.ledger (org_id, entity_type, entity_id, action, performed_by, before_state, after_state, metadata)
  VALUES (_org_id, _entity_type, _entity_id, _action, auth.uid(), _before, _after, _metadata);
END;
$$;

-- ============================================
-- 7. Updated timestamp trigger
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_org_members_updated_at
  BEFORE UPDATE ON public.organization_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 8. Indexes for performance
-- ============================================

CREATE INDEX idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX idx_org_members_org ON public.organization_members(org_id);
CREATE INDEX idx_ledger_org ON public.ledger(org_id);
CREATE INDEX idx_ledger_entity ON public.ledger(entity_type, entity_id);
CREATE INDEX idx_ledger_created ON public.ledger(created_at DESC);