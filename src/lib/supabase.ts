import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase environment variables. Check your .env.local file.');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Interfaces
export interface Profile {
  id: string;
  user_id: string;
  name: string;
  profile_image: string;
  diet_type: string;
  allergies: string[];
  dislikes: string[];
  created_at: string;
  updated_at: string;
}

export interface RecentMeal {
  id: string;
  user_id: string;
  food_id: number;
  food_name: string;
  food_image: string;
  timestamp: string;
}

export interface UserMood {
  id: string;
  user_id: string;
  mood: string;
  updated_at: string;
}

export interface Spin {
  id: string;
  user_id: string;
  meal_type?: string;
  cooking_time?: string;
  flavour?: string;
  surprise_me: boolean;
  results: any;
  created_at: string;
}

export interface UnlockedPremium {
  id: string;
  user_id: string;
  content_type: string;
  content_id: number;
  unlocked_at: string;
}

export interface SearchLog {
  id: string;
  user_id: string;
  search_query: string;
  searched_at: string;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  ingredient: string;
  quantity: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  recipe_id: number;
  recipe_name: string;
  difficulty?: string;
  tried_at: string;
}

export interface TasteFeedback {
  id: string;
  user_id: string;
  recipe_id: number;
  actual_taste: string;
  submitted_at: string;
}

export interface Favourite {
  id: string;
  user_id: string;
  food_id: number;
  food_name: string;
  image_url: string;
  description?: string;
  nutrition?: string;
  mood?: string;
  location: string;
  last_bite_date: string;
  date_saved: string;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  user_id?: string;
}