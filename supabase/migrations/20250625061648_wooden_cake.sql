/*
  # Fix Profiles RLS Policy

  1. Security Changes
    - Enable RLS on profiles table
    - Drop existing conflicting policy if it exists
    - Create new insert policy for profile creation
    - Ensure users can only create profiles for themselves

  2. Policy Details
    - Policy name: "Allow profile creation for new users"
    - Applies to: INSERT operations
    - Target: authenticated users only
    - Constraint: auth.uid() = user_id (users can only create their own profile)
*/

-- 1. Ensure Row Level Security is enabled on the "public.profiles" table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. If a policy named "Allow profile creation for new users" already exists, drop it
DROP POLICY IF EXISTS "Allow profile creation for new users" ON public.profiles;

-- 3. Create a new insert policy named "Allow profile creation for new users" on the "public.profiles" table
--    This policy should allow authenticated users to insert rows into the table
--    It should have a WITH CHECK expression that ensures "auth.uid() = user_id"
CREATE POLICY "Allow profile creation for new users"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);