import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from './UserContext';

interface Food {
  id: number;
  name: string;
  image: string;
  description: string;
  nutrition: string;
  mood: string;
}

interface FavouritesContextType {
  favourites: Food[];
  addToFavourites: (food: Food) => void;
  removeFromFavourites: (foodId: number) => void;
  isFavourite: (foodId: number) => boolean;
  updateLastBite: (foodId: number, date: string) => void;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export const FavouritesProvider = ({ children }: { children: ReactNode }) => {
  const [favourites, setFavourites] = useState<Food[]>([]);
  const { user, isAuthenticated, isValidUser } = useUser();

  // Load favourites from Supabase or localStorage
  const loadFavourites = async () => {
    if (isValidUser()) {
      try {
        const { data, error } = await supabase
          .from('favourites')
          .select('*')
          .eq('user_id', user.id)
          .order('date_saved', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedFavourites = data.map(fav => ({
            id: fav.food_id,
            name: fav.food_name,
            image: fav.image_url,
            description: fav.description || '',
            nutrition: fav.nutrition || '',
            mood: fav.mood || 'neutral'
          }));
          setFavourites(formattedFavourites);
        }
      } catch (error) {
        console.error('Failed to load favourites from Supabase:', error);
        // Fallback to localStorage
        loadLocalFavourites();
      }
    } else {
      // Load from localStorage for guest users
      loadLocalFavourites();
    }
  };

  const loadLocalFavourites = () => {
    try {
      const saved = localStorage.getItem('favourites');
      if (saved) {
        setFavourites(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load local favourites:', error);
    }
  };

  const saveLocalFavourites = (newFavourites: Food[]) => {
    try {
      localStorage.setItem('favourites', JSON.stringify(newFavourites));
    } catch (error) {
      console.error('Failed to save local favourites:', error);
    }
  };

  const addToFavourites = async (food: Food) => {
    // Check if user is valid for Supabase operations
    if (isValidUser()) {
      try {
        // Check if already exists
        const { data: existing } = await supabase
          .from('favourites')
          .select('id')
          .eq('user_id', user.id)
          .eq('food_id', food.id)
          .maybeSingle();

        if (existing) return; // Already in favourites

        // Get location from localStorage or use default
        const location = localStorage.getItem(`location_${food.id}`) || 'Local Restaurant';

        const { error } = await supabase
          .from('favourites')
          .insert({
            user_id: user.id,
            food_id: food.id,
            food_name: food.name,
            image_url: food.image,
            description: food.description,
            nutrition: food.nutrition,
            mood: food.mood,
            location: location,
            last_bite_date: '-'
          });

        if (error) throw error;

        setFavourites(prev => {
          if (prev.find(f => f.id === food.id)) return prev;
          const newFavourites = [food, ...prev];
          saveLocalFavourites(newFavourites);
          return newFavourites;
        });
      } catch (error) {
        console.error('Failed to add to favourites in Supabase:', error);
        // Fallback to localStorage
        addToLocalFavourites(food);
      }
    } else {
      // Guest user or invalid user ID - use localStorage only
      addToLocalFavourites(food);
    }
  };

  const addToLocalFavourites = (food: Food) => {
    setFavourites(prev => {
      if (prev.find(f => f.id === food.id)) return prev;
      const newFavourites = [food, ...prev];
      saveLocalFavourites(newFavourites);
      return newFavourites;
    });
  };

  const removeFromFavourites = async (foodId: number) => {
    if (isValidUser()) {
      try {
        const { error } = await supabase
          .from('favourites')
          .delete()
          .eq('user_id', user.id)
          .eq('food_id', foodId);

        if (error) throw error;

        setFavourites(prev => {
          const newFavourites = prev.filter(f => f.id !== foodId);
          saveLocalFavourites(newFavourites);
          return newFavourites;
        });
      } catch (error) {
        console.error('Failed to remove from favourites in Supabase:', error);
        // Fallback to localStorage
        removeFromLocalFavourites(foodId);
      }
    } else {
      // Guest user - use localStorage only
      removeFromLocalFavourites(foodId);
    }
  };

  const removeFromLocalFavourites = (foodId: number) => {
    setFavourites(prev => {
      const newFavourites = prev.filter(f => f.id !== foodId);
      saveLocalFavourites(newFavourites);
      return newFavourites;
    });
  };

  const updateLastBite = async (foodId: number, date: string) => {
    if (isValidUser()) {
      try {
        const { error } = await supabase
          .from('favourites')
          .update({ last_bite_date: date })
          .eq('user_id', user.id)
          .eq('food_id', foodId);

        if (error) throw error;
      } catch (error) {
        console.error('Failed to update last bite in Supabase:', error);
      }
    }
    
    // Always update localStorage as well
    localStorage.setItem(`lastBite_${foodId}`, date);
  };

  const isFavourite = (foodId: number) => {
    return favourites.some(f => f.id === foodId);
  };

  // Load favourites when user changes
  useEffect(() => {
    loadFavourites();
  }, [user, isAuthenticated]);

  return (
    <FavouritesContext.Provider value={{
      favourites,
      addToFavourites,
      removeFromFavourites,
      isFavourite,
      updateLastBite
    }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (context === undefined) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
};