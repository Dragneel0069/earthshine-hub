-- Fix the overly permissive audit_logs INSERT policy
-- The trigger runs as SECURITY DEFINER, so this policy can be more restrictive
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

-- Only allow inserts via the trigger function (which uses SECURITY DEFINER)
-- Regular users cannot directly insert to audit_logs
CREATE POLICY "Only system can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (false);

-- The SECURITY DEFINER trigger function bypasses RLS, so it can still insert