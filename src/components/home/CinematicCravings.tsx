import React, { useState } from 'react';
import { Crown, Lock, Film, RefreshCw, ChevronDown, ChevronUp, LogIn, Heart, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useFavourites } from '../../context/FavouritesContext';
import { getRandomFoodImage, getRealisticLocation } from '../../utils/foodImages';
import { supabase } from '../../lib/supabase';
import CustomPaywall from '../profile/CustomPaywall';

const allMovieFoods = [
  {
    id: 4001, // Unique IDs to avoid conflicts with other sections
    name: 'Butterbeer',
    description: 'The magical drink from Harry Potter\'s wizarding world',
    movie: 'Harry Potter',
    unlocked: true,
    category: 'drink'
  },
  {
    id: 4002,
    name: 'Giant Pancakes',
    description: 'Matilda\'s telekinetic breakfast masterpiece',
    movie: 'Matilda',
    unlocked: false,
    category: 'breakfast'
  },
  {
    id: 4003,
    name: 'Ratatouille',
    description: 'Remy\'s peasant dish that wowed the critic',
    movie: 'Ratatouille',
    unlocked: false,
    category: 'salad'
  },
  {
    id: 4004,
    name: 'Chocolate Factory Feast',
    description: 'Wonka\'s edible wonderland delights',
    movie: 'Charlie and the Chocolate Factory',
    unlocked: false,
    category: 'dessert'
  },
  {
    id: 4005,
    name: 'Big Kahuna Burger',
    description: 'That\'s a tasty burger from Pulp Fiction',
    movie: 'Pulp Fiction',
    unlocked: false,
    category: 'burger'
  },
  {
    id: 4006,
    name: 'Dumplings',
    description: 'Kung Fu Panda\'s favorite comfort food',
    movie: 'Kung Fu Panda',
    unlocked: false,
    category: 'meat'
  },
  {
    id: 4007,
    name: 'Turkish Delight',
    description: 'The White Witch\'s tempting treat from Narnia',
    movie: 'Chronicles of Narnia',
    unlocked: false,
    category: 'dessert'
  },
  {
    id: 4008,
    name: 'Spaghetti & Meatballs',
    description: 'Lady and the Tramp\'s romantic dinner',
    movie: 'Lady and the Tramp',
    unlocked: false,
    category: 'pasta'
  }
];

const CinematicCravings = () => {
  const [showPaywall, setShowPaywall] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [currentFoods, setCurrentFoods] = useState(allMovieFoods.slice(0, 4));
  const [showInfo, setShowInfo] = useState<number | null>(null);
  const { theme } = useTheme();
  const { isPro, isLoadingProStatus, checkProStatus, user, isAuthenticated, isValidUser } = useUser();
  const { addToFavourites, removeFromFavourites, isFavourite } = useFavourites();
  const navigate = useNavigate();

  // Check if user is guest or not logged in - lock all premium features
  const isGuest = !isAuthenticated || !user || user.is_guest;
  const hasAccess = !isGuest && isPro;

  const displayedFoods = showAll ? allMovieFoods : currentFoods;

  
  const handleCardClick = async (food: any) => {
    if (!food.unlocked && (!hasAccess || isLoadingProStatus)) {
      if (isGuest) {
        setShowLoginPrompt(true);
        return;
      }
      setShowPaywall(true);
    } else if (food.unlocked || hasAccess) {

      // Navigate to AI Chef with recipe
      const recipe = {
        id: food.id,
        name: food.name,
        image: getRandomFoodImage(food.category),
        time: '20 min',
        difficulty: 'Medium',
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
      nutrition: 'Movie-inspired nutrition',
      mood: 'creative'
    };

    if (isFavourite(food.id)) {
      removeFromFavourites(food.id);
    } else {
      // Store as AI Chef Recipe for Cinematic Cravings (no location)
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
    const shuffled = [...allMovieFoods].sort(() => 0.5 - Math.random());
    setCurrentFoods(shuffled.slice(0, 4));
  };

  const handlePaywallSuccess = async () => {
    setShowPaywall(false);
    await checkProStatus();
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
              Cinematic Cravings
            </h2>
            <Film size={18} className="text-purple-500" />
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
                      Movie-inspired nutrition
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
                      ? 'bg-gray-700 text-purple-400'
                      : 'bg-purple-100 text-purple-600'
                }`}>
                  {food.movie}
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
                Please log in to access Cinematic Cravings and other premium features.
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

export default CinematicCravings;