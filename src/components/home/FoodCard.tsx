import React, { useState, useEffect } from 'react';
import { Heart, Info, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useFavourites } from '../../context/FavouritesContext';
import { useUser } from '../../context/UserContext';

interface Food {
  id: number;
  name: string;
  image: string;
  description: string;
  nutrition: string;
  mood: string;
}

interface FoodCardProps {
  food: Food;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { theme } = useTheme();
  const { addToFavourites, removeFromFavourites, isFavourite } = useFavourites();
  const { user, isAuthenticated, isValidUser } = useUser();
  const navigate = useNavigate();
  
  const isInFavourites = isFavourite(food.id);
  
  // Disable background scrolling when modal is open
  useEffect(() => {
    if (showLoginPrompt) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showLoginPrompt]);
  
  const toggleFavorite = () => {
    // Check if user is valid for Supabase operations
    if (!isValidUser()) {
      setShowLoginPrompt(true);
      return;
    }

    if (isInFavourites) {
      removeFromFavourites(food.id);
    } else {
      // Store as "AI Chef Recipe" for homepage recipes - NO LOCATION
      localStorage.setItem(`location_${food.id}`, 'AI Chef Recipe');
      
      addToFavourites(food);
    }
  };
  
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleTryRecipe = () => {
    // Create a recipe object based on the food
    const recipe = {
      id: food.id,
      name: food.name,
      image: food.image,
      time: '20 min',
      difficulty: 'Medium',
      ingredients: [
        'Main ingredient based on ' + food.name,
        'Supporting ingredients',
        'Seasonings and spices',
        'Cooking oil or butter'
      ],
      steps: [
        'Prepare all ingredients',
        'Heat cooking surface',
        'Cook main ingredients',
        'Add seasonings',
        'Serve and enjoy'
      ]
    };
    
    // Store the recipe and navigate to AI Chef
    sessionStorage.setItem('selectedRecipe', JSON.stringify(recipe));
    navigate('/ai-chef?loadRecipe=true');
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  return (
    <>
      <div 
        className={`rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="relative h-32 sm:h-36 md:h-40">
          <img 
            src={food.image} 
            alt={food.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <button 
              onClick={toggleFavorite} 
              className={`p-1.5 rounded-full transition-all duration-200 ${
                isInFavourites 
                  ? 'bg-red-500 text-white scale-110' 
                  : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              <Heart size={12} className="sm:w-3.5 sm:h-3.5" fill={isInFavourites ? "white" : "none"} />
            </button>
            <button 
              onClick={toggleInfo} 
              className={`p-1.5 rounded-full ${
                showInfo ? 'bg-blue-500 text-white' : 'bg-white/80 text-gray-700'
              }`}
            >
              <Info size={12} className="sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className={`font-semibold text-sm mb-1 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          } line-clamp-1`}>
            {food.name}
          </h3>
          
          {showInfo ? (
            <>
              <p className={`text-xs mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              } line-clamp-2`}>
                {food.description}
              </p>
              <div className={`text-xs font-medium ${
                theme === 'synesthesia' ? 'text-purple-600' : 'text-orange-500'
              } line-clamp-1`}>
                {food.nutrition}
              </div>
            </>
          ) : (
            <p className={`text-xs line-clamp-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {food.description}
            </p>
          )}
          
          <button 
            onClick={handleTryRecipe}
            className={`mt-2 text-xs font-medium px-3 py-1 rounded-full transition-colors w-full sm:w-auto ${
              theme === 'synesthesia'
                ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                : theme === 'dark'
                  ? 'bg-gray-700 text-orange-400 hover:bg-gray-600'
                  : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
            }`}
          >
            Try Recipe
          </button>
        </div>
      </div>

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
              <Heart size={32} className="mx-auto mb-4 text-red-500" />
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Save to Favourites
              </h3>
              <p className={`text-sm mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Please log in to save your favourite foods and sync across devices.
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
    </>
  );
};

export default FoodCard;