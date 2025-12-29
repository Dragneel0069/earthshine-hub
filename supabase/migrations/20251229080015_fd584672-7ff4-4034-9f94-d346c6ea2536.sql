-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view carbon projects" ON public.carbon_projects;

-- Create a more restrictive policy - only users with a profile can view projects
-- This ensures users have completed registration before accessing marketplace data
CREATE POLICY "Registered users can view carbon projects" 
ON public.carbon_projects 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.user_id = auth.uid()
  )
);