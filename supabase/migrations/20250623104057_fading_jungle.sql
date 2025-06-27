/*
  # Create todos table for TodoList functionality

  1. New Tables
    - `todos` - User's todo items with title, completion status, and timestamps

  2. Security
    - Enable RLS on todos table
    - Add policies for authenticated users to manage their own todos
*/

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policies for todos
CREATE POLICY "Users can read own todos"
  ON todos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own todos"
  ON todos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos"
  ON todos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos"
  ON todos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow anonymous access for demo purposes (optional)
CREATE POLICY "Allow anonymous read todos"
  ON todos
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert todos"
  ON todos
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update todos"
  ON todos
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous delete todos"
  ON todos
  FOR DELETE
  TO anon
  USING (true);