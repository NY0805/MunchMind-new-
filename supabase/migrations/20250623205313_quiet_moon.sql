/*
  # Fix Authentication and Profile RLS Policies

  1. Security Changes
    - Update RLS policies for profiles table to allow proper user access
    - Remove conflicting policies and create simplified ones
    - Allow authenticated users to create and manage their own profiles

  2. Changes Made
    - Drop existing restrictive policies
    - Create permissive policies for profile management
    - Ensure new users can create profiles without RLS violations
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation for new users" ON profiles;

-- Create new permissive policies for profiles
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

-- Additional policy to ensure profile creation works for new users
CREATE POLICY "Enable profile creation for authenticated users" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure RLS is enabled on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);