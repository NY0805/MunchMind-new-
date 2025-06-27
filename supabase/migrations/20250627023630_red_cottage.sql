/*
  # Fix profiles table RLS policies

  1. Security Updates
    - Drop existing RLS policies on profiles table
    - Create new permissive policies for profile management
    - Ensure auth.uid() function exists and works properly

  2. Policy Changes
    - Allow users to insert their own profiles
    - Allow users to read their own profiles  
    - Allow users to update their own profiles
    - Handle new user profile creation properly
*/

-- Update profiles table RLS policies
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation for new users" ON profiles;

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
  WITH CHECK (auth.uid() = user_id);

-- Ensure the auth.uid() function works properly (only create if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'uid' 
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'auth')
  ) THEN
    CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $function$
      SELECT COALESCE(
        current_setting('request.jwt.claim.sub', true),
        (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
      )::uuid
    $function$;
  END IF;
END $$;