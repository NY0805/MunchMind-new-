import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Utensils, Info, Flame } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabase';

const TrendingDishDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, isValidUser } = useUser();
  
  // Get dish data from navigation state
  const dish = location.state?.dish;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!dish) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Dish not found
          </h2>
          <button
            onClick={() => navigate('/explore')}
            className={`px-4 py-2 rounded-lg ${
              theme === 'synesthesia'
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            } transition-colors`}
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const saveRecipeCompletion = async () => {
    if (isValidUser()) {
      try {
        await supabase
          .from('recipes')
          .insert({
            user_id: user.id,
            recipe_id: dish.id,
            recipe_name: dish.name,
            difficulty: 'Medium',
            tried_at: new Date().toISOString()
          });
        console.log('Recipe completion saved to database');
      } catch (error) {
        console.error('Failed to save recipe completion:', error);
      }
    }
  };

  const handleLearnRecipe = async () => {
    // Save recipe completion first
    await saveRecipeCompletion();

    // Update last bite date with dd/mm/yyyy format
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    
    localStorage.setItem(`lastBite_${dish.id}`, formattedDate);

    const recipe = {
      id: dish.id,
      name: dish.name,
      image: dish.image,
      time: '25 min',
      difficulty: 'Medium',
      ingredients: ['Main ingredients for ' + dish.name, 'Supporting spices', 'Fresh herbs', 'Cooking oil'],
      steps: ['Prepare ingredients', 'Heat cooking surface', 'Cook main components', 'Add seasonings', 'Serve hot']
    };
    
    sessionStorage.setItem('selectedRecipe', JSON.stringify(recipe));
    navigate('/ai-chef?loadRecipe=true');
  };

  return (
    <div className={`min-h-screen ${
      theme === 'synesthesia' 
        ? 'bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100' 
        : theme === 'dark' 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50'
    }`}>
      {/* Header Image */}
      <div className="relative h-64 md:h-80">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/explore')}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Trending Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
          dish.badge === 'Viral' ? 'bg-red-500 text-white' :
          dish.badge === 'Trending' ? 'bg-orange-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <Flame size={14} className="inline mr-1" />
          {dish.badge}
        </div>

        {/* Dish Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{dish.name}</h1>
          <p className="text-white/90 mb-2">{dish.description}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>From {dish.origin}</span>
            </div>
            <div className="flex items-center gap-1">
              <Utensils size={16} />
              <span>Trending worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="responsive-container py-6">
        {/* Dish Information */}
        <div className={`rounded-xl mb-6 p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Dish Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`font-medium mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Origin
              </h3>
              <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {dish.origin}
              </p>

              <h3 className={`font-medium mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Nutritional Info
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Calories</span>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{dish.calories} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Allergens</span>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{dish.allergens.join(', ')}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`font-medium mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Flavor Profile
              </h3>
              <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {dish.flavorProfile}
              </p>

              <h3 className={`font-medium mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Trending Status
              </h3>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                dish.badge === 'Viral' ? 'bg-red-100 text-red-700' :
                dish.badge === 'Trending' ? 'bg-orange-100 text-orange-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                <Flame size={14} />
                {dish.badge} on social media
              </div>
            </div>
          </div>
        </div>

        {/* Learn Recipe Button */}
        <div className="text-center">
          <button
            onClick={handleLearnRecipe}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
              theme === 'synesthesia'
                ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg'
            }`}
          >
            Learn Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingDishDetails;