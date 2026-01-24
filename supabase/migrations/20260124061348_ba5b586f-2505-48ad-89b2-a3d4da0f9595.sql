-- Fix Security Finding 1: users table - Remove overly permissive policy
-- The "Deny anonymous access to users" policy allows any authenticated user to read all records
-- We only need the "Users can view their own profile" policy
DROP POLICY IF EXISTS "Deny anonymous access to users" ON public.users;

-- Fix Security Finding 2: recs table - Same issue
DROP POLICY IF EXISTS "Deny anonymous access to recs" ON public.recs;

-- Verify users table has correct SELECT policy (should already exist)
-- If not, create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile" 
    ON public.users 
    FOR SELECT 
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Verify recs table has correct SELECT policy (should already exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'recs' 
    AND policyname = 'Users can view their own RECs'
  ) THEN
    CREATE POLICY "Users can view their own RECs" 
    ON public.recs 
    FOR SELECT 
    USING (user_id IN (SELECT id FROM users WHERE users.user_id = auth.uid()));
  END IF;
END $$;