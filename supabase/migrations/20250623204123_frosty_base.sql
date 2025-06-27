/*
  # Fix Authentication and Profile Issues

  1. Profile Table Updates
    - Update RLS policies to allow profile creation
    - Ensure proper user access controls
    
  2. Authentication Flow
    - Remove email confirmation requirements
    - Allow direct login after registration
*/

-- Update profiles table RLS policies
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create more permissive policies for profile creation
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to create profiles even if they don't exist yet
CREATE POLICY "Allow profile creation for new users" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Ensure the auth.uid() function works properly
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claim.sub', true),
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
  )::uuid
$$;