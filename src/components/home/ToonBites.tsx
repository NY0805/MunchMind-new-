import React, { useState } from 'react';
import { Crown, Lock, RefreshCw, ChevronDown, ChevronUp, LogIn, Heart, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useFavourites } from '../../context/FavouritesContext';
import { getRandomFoodImage, getRealisticLocation } from '../../utils/foodImages';
import { supabase } from '../../lib/supabase';
import CustomPaywall from '../profile/CustomPaywall';

const allToonFoods = [
  {
    id: 3001, // Unique IDs to avoid conflicts with other sections
    name: 'Krabby Patty',
    description: 'The legendary burger from SpongeBob SquarePants',
    show: 'SpongeBob SquarePants',
    unlocked: true,
    category: 'burger'
  },
  {
    id: 3002,
    name: 'Scooby Snacks',
    description: 'The irresistible dog treats that solve mysteries',
    show: 'Scooby-Doo',
    unlocked: false,
    category: 'breakfast'
  },
  {
    id: 3003,
    name: 'Giant Turkey Leg',
    description: 'Fred Flintstone\'s prehistoric feast',
    show: 'The Flintstones',
    unlocked: false,
    category: 'meat'
  },
  {
    id: 3004,
    name: 'Duff Beer Pretzel',
    description: 'Homer\'s favorite snack from Moe\'s Tavern',
    show: 'The Simpsons',
    unlocked: false,
    category: 'drink'
  },
  {
    id: 3005,
    name: 'Teenage Mutant Ninja Pizza',
    description: 'Cowabunga! The turtles\' favorite fuel',
    show: 'TMNT',
    unlocked: false,
    category: 'burger'
  },
  {
    id: 3006,
    name: 'Popeye\'s Spinach Can',
    description: 'Strength-boosting leafy greens',
    show: 'Popeye',
    unlocked: false,
    category: 'salad'
  },
  {
    id: 3007,
    name: 'Garfield\'s Lasagna',
    description: 'The cat\'s obsession in cheesy layers',
    show: 'Garfield',
    unlocked: false,
    category: 'pasta'
  },
  {
    id: 3008,
    name: 'Bugs Bunny\'s Carrot',
    description: 'What\'s up, Doc? Crunchy orange perfection',
    show: 'Looney Tunes',
    unlocked: false,
    category: 'salad'
  }
];

const ToonBites = () => {
  const [showPaywall, setShowPaywall] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [currentFoods, setCurrentFoods] = useState(allToonFoods.slice(0, 4));
  const [showInfo, setShowInfo] = useState<number | null>(null);
  const { theme } = useTheme();
  const { isPro, isLoadingProStatus, checkProStatus, user, isAuthenticated, isValidUser } = useUser();
  const { addToFavourites, removeFromFavourites, isFavourite } = useFavourites();
  const navigate = useNavigate();

  // Check if user is guest or not logged in - lock all premium features
  const isGuest = !isAuthenticated || !user || user.is_guest;
  const hasAccess = !isGuest && isPro;

  const displayedFoods = showAll ? allToonFoods : currentFoods;

  const saveRecipeCompletion = async (food: any) => {
    if (isValidUser()) {
      try {
        await supabase
          .from('recipes')
          .insert({
            user_id: user.id,
            recipe_id: food.id,
            recipe_name: food.name,
            difficulty: 'Easy',
            tried_at: new Date().toISOString()
          });
        console.log('Recipe completion saved to database');
      } catch (error) {
        console.error('Failed to save recipe completion:', error);
      }
    }
  };

  const handleCardClick = async (food: any) => {
    if (!food.unlocked && (!hasAccess || isLoadingProStatus)) {
      if (isGuest) {
        setShowLoginPrompt(true);
        return;
      }
      setShowPaywall(true);
    } else if (food.unlocked || hasAccess) {
      // Save recipe completion to database
      await saveRecipeCompletion(food);

      // Navigate to AI Chef with recipe
      const recipe = {
        id: food.id,
        name: food.name,
        image: getRandomFoodImage(food.category),
        time: '15 min',
        difficulty: 'Easy',
        ingredients: ['Main ingredient based on ' + food.name, 'Supporting ingredients', 'Seasonings and spices', 'Cooking oil or butter'],
        steps: ['Prepare all ingredients', 'Heat cooking surface', 'Cook main ingredients', 'Add seasonings', 'Serve and enjoy']
      };
      
      sessionStorage.setItem('selectedRecipe', JSON.stringify(recipe));
      navigate('/ai-chef?loadRecipe=true');
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent, food: any) => {
    e.stopPropagation();
    
    if (!isValidUser()) {
      setShowLoginPrompt(true);
      return;
    }

    const foodItem = {
      id: food.id,
      name: food.name,
      image: getRandomFoodImage(food.category),
      description: food.description,
      nutrition: 'Cartoon-inspired nutrition',
      mood: 'happy'
    };

    if (isFavourite(food.id)) {
      removeFromFavourites(food.id);
    } else {
      // Store as AI Chef Recipe for Toon Bites (no location)
      localStorage.setItem(`location_${food.id}`, 'AI Chef Recipe');
      addToFavourites(foodItem);
    }
  };

  const handleInfoToggle = (e: React.MouseEvent, foodId: number) => {
    e.stopPropagation();
    setShowInfo(showInfo === foodId ? null : foodId);
  };

  const handleAnotherTaste = () => {
    // Shuffle and get new 4 items
    const shuffled = [...allToonFoods].sort(() => 0.5 - Math.random());
    setCurrentFoods(shuffled.slice(0, 4));
  };

  const handlePaywallSuccess = async () => {
    setShowPaywall(false);
    await checkProStatus();

    if (user && !user.is_guest && user.id) {
      const { data, error } = await supabase
        .from('unlocked_premium')
        .upsert({
          user_id: user.id,
          content_type: 'pro_access',
          content_id: 1,
          unlocked_at: new Date().toISOString()
        });
  
      if (error) {
        console.error('❌ Failed to save premium status to Supabase:', error);
      } else {
        console.log('✅ Premium access saved to Supabase:', data);
      }
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className={`text-lg md:text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
              Toon Bites
            </h2>
            <Crown size={18} className="text-amber-500" />
            {(!hasAccess || isGuest) && !isLoadingProStatus && <span className={`text-xs px-2 py-1 rounded-full ${
              theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'
            }`}>PRO</span>}
            {isLoadingProStatus && (
              <div className="w-4 h-4 border border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          
          <button
            onClick={handleAnotherTaste}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
              theme === 'synesthesia'
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            <RefreshCw size={14} />
            <span>Another Taste</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {displayedFoods.map(food => (
            <div 
              key={food.id}
              onClick={() => handleCardClick(food)}
              className={`relative rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } ${!food.unlocked && (!hasAccess || isGuest || isLoadingProStatus) ? 'opacity-75' : ''}`}
            >
              {!food.unlocked && (!hasAccess || isGuest || isLoadingProStatus) && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <Lock size={24} className="text-white" />
                </div>
              )}
              
              <div className="h-36 sm:h-40 relative">
                <img 
                  src={getRandomFoodImage(food.category)} 
                  alt={food.name} 
                  className="w-full h-full object-cover"
                />
                
                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={(e) => handleFavoriteToggle(e, food)}
                    className={`p-1.5 rounded-full transition-all duration-200 ${
                      isFavourite(food.id)
                        ? 'bg-red-500 text-white scale-110'
                        : 'bg-white/80 text-gray-700 hover:bg-white'
                    }`}
                  >
                    <Heart size={12} className="sm:w-3.5 sm:h-3.5" fill={isFavourite(food.id) ? "white" : "none"} />
                  </button>
                  <button
                    onClick={(e) => handleInfoToggle(e, food.id)}
                    className={`p-1.5 rounded-full ${
                      showInfo === food.id ? 'bg-blue-500 text-white' : 'bg-white/80 text-gray-700'
                    }`}
                  >
                    <Info size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              </div>
              
              <div className="p-3">
                <h3 className={`font-semibold text-sm mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  {food.name}
                </h3>
                
                {showInfo === food.id ? (
                  <>
                    <p className={`text-xs mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {food.description}
                    </p>
                    <div className={`text-xs font-medium ${
                      theme === 'synesthesia' ? 'text-purple-600' : 'text-orange-500'
                    }`}>
                      Cartoon-inspired nutrition
                    </div>
                  </>
                ) : (
                  <p className={`text-xs mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {food.description}
                  </p>
                )}
                
                <span className={`text-xs px-2 py-1 rounded-full ${
                  theme === 'synesthesia'
                    ? 'bg-purple-100 text-purple-600'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-orange-400'
                      : 'bg-orange-100 text-orange-600'
                }`}>
                  {food.show}
                </span>
              </div>
            </div>
          ))}
        </div>

        {!showAll && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowAll(true)}
              className={`flex items-center gap-2 mx-auto px-4 py-2 rounded-full text-sm transition-colors ${
                theme === 'synesthesia'
                  ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>Show More</span>
              <ChevronDown size={16} />
            </button>
          </div>
        )}

        {showAll && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowAll(false)}
              className={`flex items-center gap-2 mx-auto px-4 py-2 rounded-full text-sm transition-colors ${
                theme === 'synesthesia'
                  ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>Show Less</span>
              <ChevronUp size={16} />
            </button>
          </div>
        )}
      </section>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="modal-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div 
            className={`modal-content modal-small animate-modal-in ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <Crown size={32} className="mx-auto mb-4 text-amber-500" />
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Premium Feature
              </h3>
              <p className={`text-sm mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Please log in to access Toon Bites and other premium features.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className={`flex-1 py-2 rounded-full font-medium ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLoginRedirect}
                  className={`flex-1 py-2 rounded-full font-medium flex items-center justify-center gap-2 ${
                    theme === 'synesthesia'
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  } transition-colors`}
                >
                  <LogIn size={16} />
                  Log In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CustomPaywall 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)}
        onSuccess={handlePaywallSuccess}
      />
    </>
  );
};

export default ToonBites;