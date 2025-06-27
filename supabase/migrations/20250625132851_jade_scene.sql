/*
  # Fix profiles table RLS and policies

  1. Security Updates
    - Enable RLS on profiles table
    - Drop existing conflicting policy if it exists
    - Create proper insert policy for profile creation
    - Ensure policy uses correct column reference (user_id, not id)

  2. Policy Details
    - Allow authenticated users to insert their own profile
    - WITH CHECK ensures user can only create profile for themselves
    - Uses auth.uid() = user_id for proper user matching
*/

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop the existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Allow profile creation for new users" ON profiles;

-- Create new insert policy for profile creation
CREATE POLICY "Allow profile creation for new users"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Ensure other essential policies exist for profiles table
-- Drop and recreate read policy
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop and recreate update policy  
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);