/*
  # Initial Schema for MunchMind Food App

  1. New Tables
    - `profiles` - User profile information
    - `recent_meals` - User's recent meal selections
    - `user_moods` - User's current mood selections
    - `spins` - Flavor wheel spin results
    - `unlocked_premium` - Premium content unlock status
    - `search_logs` - User search history
    - `inventory` - Kitchen inventory items
    - `recipes` - Recipes tried by users
    - `taste_feedback` - Virtual taste preview feedback
    - `favourites` - User's favorite foods
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text DEFAULT 'Guest',
  profile_image text DEFAULT 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
  diet_type text DEFAULT 'flexitarian',
  allergies text[] DEFAULT ARRAY['peanuts'],
  dislikes text[] DEFAULT ARRAY['mushrooms', 'olives'],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recent meals table
CREATE TABLE IF NOT EXISTS recent_meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  food_id integer NOT NULL,
  food_name text NOT NULL,
  food_image text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- User moods table
CREATE TABLE IF NOT EXISTS user_moods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  mood text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Spins table
CREATE TABLE IF NOT EXISTS spins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_type text,
  cooking_time text,
  flavour text,
  surprise_me boolean DEFAULT false,
  results jsonb,
  created_at timestamptz DEFAULT now()
);

-- Unlocked premium table
CREATE TABLE IF NOT EXISTS unlocked_premium (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type text NOT NULL, -- 'toon_bites' or 'cinematic_cravings'
  content_id integer NOT NULL,
  unlocked_at timestamptz DEFAULT now()
);

-- Search logs table
CREATE TABLE IF NOT EXISTS search_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  search_query text NOT NULL,
  searched_at timestamptz DEFAULT now()
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'pcs',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id integer NOT NULL,
  recipe_name text NOT NULL,
  difficulty text,
  tried_at timestamptz DEFAULT now()
);

-- Taste feedback table
CREATE TABLE IF NOT EXISTS taste_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id integer NOT NULL,
  actual_taste text NOT NULL,
  submitted_at timestamptz DEFAULT now()
);

-- Favourites table
CREATE TABLE IF NOT EXISTS favourites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  food_id integer NOT NULL,
  food_name text NOT NULL,
  image_url text NOT NULL,
  description text,
  nutrition text,
  mood text,
  location text DEFAULT 'Local Restaurant',
  last_bite_date text DEFAULT '-',
  date_saved timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE spins ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlocked_premium ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE taste_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for recent_meals
CREATE POLICY "Users can read own recent meals"
  ON recent_meals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recent meals"
  ON recent_meals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recent meals"
  ON recent_meals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for user_moods
CREATE POLICY "Users can read own mood"
  ON user_moods
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood"
  ON user_moods
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood"
  ON user_moods
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for spins
CREATE POLICY "Users can read own spins"
  ON spins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spins"
  ON spins
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for unlocked_premium
CREATE POLICY "Users can read own unlocked premium"
  ON unlocked_premium
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own unlocked premium"
  ON unlocked_premium
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for search_logs
CREATE POLICY "Users can read own search logs"
  ON search_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search logs"
  ON search_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for inventory
CREATE POLICY "Users can read own inventory"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory"
  ON inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory"
  ON inventory
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory"
  ON inventory
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for recipes
CREATE POLICY "Users can read own recipes"
  ON recipes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes"
  ON recipes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for taste_feedback
CREATE POLICY "Users can read own taste feedback"
  ON taste_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own taste feedback"
  ON taste_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for favourites
CREATE POLICY "Users can read own favourites"
  ON favourites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favourites"
  ON favourites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favourites"
  ON favourites
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own favourites"
  ON favourites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);