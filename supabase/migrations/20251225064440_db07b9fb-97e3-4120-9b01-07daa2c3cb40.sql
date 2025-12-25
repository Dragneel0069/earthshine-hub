-- Drop the existing public access policy
DROP POLICY IF EXISTS "Anyone can view carbon projects" ON public.carbon_projects;

-- Create new policy for authenticated users only
CREATE POLICY "Authenticated users can view carbon projects" 
ON public.carbon_projects 
FOR SELECT 
TO authenticated
USING (true);