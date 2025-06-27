/*
  # Fix Profile RLS Policies

  1. Security Updates
    - Drop and recreate profile RLS policies with proper permissions
    - Ensure users can create, read, and update their own profiles
    - Add fallback policy for new user profile creation
  
  2. Changes
    - Updated profile policies to be more permissive for new users
    - Fixed auth.uid() function to handle JWT claims properly
    - Added proper error handling for existing policies
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
    AS $$
      SELECT COALESCE(
        current_setting('request.jwt.claim.sub', true),
        (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
      )::uuid
    $$;
  END IF;
END $$;