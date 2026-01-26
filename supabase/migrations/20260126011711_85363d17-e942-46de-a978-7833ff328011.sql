-- Drop the orphaned trigger that references non-existent user_roles table
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;

-- Drop the orphaned function
DROP FUNCTION IF EXISTS public.handle_new_user_role();