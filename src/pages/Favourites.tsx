import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Utensils, ArrowUpDown, Trash2, Navigation, ChefHat, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useFavourites } from '../context/FavouritesContext';

const Favourites = () => {
  const [sortOrder, setSortOrder] = useState('A-Z');
  const [showConfirmDelete, setShowConfirmDelete] = useState<number | null>(null);
  const [showYumAgainModal, setShowYumAgainModal] = useState<any>(null);
  const [showLocationUnavailable, setShowLocationUnavailable] = useState(false);
  const [activeTab, setActiveTab] = useState<'restaurants' | 'recipes'>('restaurants');
  const { theme } = useTheme();
  const { favourites, removeFromFavourites } = useFavourites();
  const navigate = useNavigate();

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (showConfirmDelete || showYumAgainModal || showLocationUnavailable) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showConfirmDelete, showYumAgainModal, showLocationUnavailable]);

  // Separate favourites into restaurants and recipes
  const restaurants = favourites.filter(fav => {
    const location = localStorage.getItem(`location_${fav.id}`) || '';
    return location !== 'AI Chef Recipe' && location !== '-';
  });

  const recipes = favourites.filter(fav => {
    const location = localStorage.getItem(`location_${fav.id}`) || '';
    return location === 'AI Chef Recipe' || location === '-';
  });

  const currentFavourites = activeTab === 'restaurants' ? restaurants : recipes;

  const sortedFavourites = [...currentFavourites].sort((a, b) => {
    if (sortOrder === 'A-Z') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const handleYumAgainClick = (food: any) => {
    setShowYumAgainModal(food);
  };

  const handleGoToLocation = (food: any) => {
    const location = localStorage.getItem(`location_${food.id}`) || 'Restaurant location';
    
    // Check if location is unavailable (for Toon Bites and Cinematic Cravings)
    if (location === '-') {
      setShowLocationUnavailable(true);
      setShowYumAgainModal(null);
      return;
    }
    
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank');
    
    // Update last bite date with dd/mm/yyyy format
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    
    localStorage.setItem(`lastBite_${food.id}`, formattedDate);
    setShowYumAgainModal(null);
  };

  const handleCookMyself = (food: any) => {
    // Create a recipe object and navigate to AI Chef
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
    
    sessionStorage.setItem('selectedRecipe', JSON.stringify(recipe));
    
    // Update last bite date with dd/mm/yyyy format
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    
    localStorage.setItem(`lastBite_${food.id}`, formattedDate);
    setShowYumAgainModal(null);
    navigate('/ai-chef?loadRecipe=true');
  };

  const handleSwipeDelete = (foodId: number) => {
    setShowConfirmDelete(foodId);
  };

  const confirmDelete = () => {
    if (showConfirmDelete) {
      removeFromFavourites(showConfirmDelete);
      setShowConfirmDelete(null);
    }
  };

  const getItemType = (food: any) => {
    const location = localStorage.getItem(`location_${food.id}`) || '';
    return location === 'AI Chef Recipe' || location === '-' ? 'recipe' : 'restaurant';
  };

  return (
    <>
      <div className="responsive-container py-6">
        <h1 className={`responsive-title mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          My Favourites
        </h1>
        
        {/* Tab Navigation */}
        <div className={`flex rounded-lg mb-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-md overflow-hidden`}>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'restaurants'
                ? theme === 'synesthesia'
                  ? 'bg-purple-500 text-white'
                  : 'bg-orange-500 text-white'
                : theme === 'dark'
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Star size={18} />
              <span>Restaurants ({restaurants.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'recipes'
                ? theme === 'synesthesia'
                  ? 'bg-purple-500 text-white'
                  : 'bg-orange-500 text-white'
                : theme === 'dark'
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ChefHat size={18} />
              <span>Recipes ({recipes.length})</span>
            </div>
          </button>
        </div>
        
        {currentFavourites.length === 0 ? (
          <div className={`text-center py-8 sm:py-12 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-md responsive-card`}>
            <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
              theme === 'synesthesia' ? 'bg-purple-100' : 'bg-orange-100'
            }`}>
              {activeTab === 'restaurants' ? (
                <Star size={20} className={`sm:w-6 sm:h-6 ${
                  theme === 'synesthesia' ? 'text-purple-500' : 'text-orange-500'
                }`} />
              ) : (
                <ChefHat size={20} className={`sm:w-6 sm:h-6 ${
                  theme === 'synesthesia' ? 'text-purple-500' : 'text-orange-500'
                }`} />
              )}
            </div>
            <h3 className={`text-base sm:text-lg font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              No {activeTab} yet
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {activeTab === 'restaurants' 
                ? 'Start exploring restaurants and tap the heart icon on places you love!'
                : 'Start cooking recipes and tap the heart icon on dishes you love!'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {currentFavourites.length} {activeTab === 'restaurants' ? 'restaurant' : 'recipe'}{currentFavourites.length !== 1 ? 's' : ''}
              </p>
              
              <div className="flex items-center gap-2">
                <ArrowUpDown size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className={`text-sm px-2 py-1 rounded border ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-700 border-gray-200'
                  } focus:outline-none`}
                >
                  <option value="A-Z">A-Z</option>
                  <option value="Z-A">Z-A</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              {sortedFavourites.map(food => {
                const location = localStorage.getItem(`location_${food.id}`) || '-';
                const lastBite = localStorage.getItem(`lastBite_${food.id}`) || '-';
                const itemType = getItemType(food);
                
                return (
                  <div 
                    key={food.id}
                    className={`rounded-lg overflow-hidden shadow-md ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } relative group`}
                  >
                    {/* Hover delete icon - positioned to not block other elements */}
                    <div 
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20 p-2 rounded-full bg-red-500 hover:bg-red-600"
                      onClick={() => handleSwipeDelete(food.id)}
                    >
                      <Trash2 size={14} className="text-white" />
                    </div>

                    <div className="flex responsive-card">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                        <img 
                          src={food.image} 
                          alt={food.name} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 ml-3 min-w-0 pr-12">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-bold text-sm sm:text-base ${
                            theme === 'dark' ? 'text-white' : 'text-gray-800'
                          } truncate`}>
                            {food.name}
                          </h3>
                        </div>
                        
                        <p className={`text-xs sm:text-sm mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        } line-clamp-2`}>
                          {food.description}
                        </p>
                        
                        {/* Show location only for restaurants */}
                        {activeTab === 'restaurants' && (
                          <div className="flex items-center gap-1 mb-1">
                            <MapPin size={10} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} truncate`}>
                              {location}
                            </span>
                          </div>
                        )}
                        
                        {/* Last Bites on separate row */}
                        <div className="flex items-center gap-1 mb-2">
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            Last Bites: {lastBite}
                          </span>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleYumAgainClick(food)}
                            className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                              theme === 'synesthesia'
                                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                : theme === 'dark'
                                  ? 'bg-gray-700 text-orange-400 hover:bg-gray-600'
                                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            } transition-colors`}
                          >
                            <Utensils size={12} />
                            <span className="hidden sm:inline">Yum Again</span>
                            <span className="sm:hidden">Yum</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Yum Again Modal */}
      {showYumAgainModal && (
        <div className="modal-overlay" onClick={() => setShowYumAgainModal(null)}>
          <div 
            className={`modal-content modal-small animate-modal-in ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="responsive-card text-center">
              <h3 className={`text-base font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              } truncate`}>
                {showYumAgainModal.name}
              </h3>
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                How would you like to enjoy this again?
              </p>
              
              <div className="space-y-2">
                {activeTab === 'restaurants' && (
                  <button
                    onClick={() => handleGoToLocation(showYumAgainModal)}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-full font-medium text-sm ${
                      theme === 'synesthesia'
                        ? 'bg-purple-500 hover:bg-purple-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } transition-colors`}
                  >
                    <Navigation size={16} />
                    Go to Location
                  </button>
                )}
                
                <button
                  onClick={() => handleCookMyself(showYumAgainModal)}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-full font-medium text-sm ${
                    theme === 'synesthesia'
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-orange-400 hover:bg-gray-600'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  } transition-colors`}
                >
                  <ChefHat size={16} />
                  Cook Myself
                </button>
                
                <button
                  onClick={() => setShowYumAgainModal(null)}
                  className={`w-full py-2 rounded-full font-medium text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } transition-colors`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Unavailable Modal */}
      {showLocationUnavailable && (
        <div className="modal-overlay" onClick={() => setShowLocationUnavailable(false)}>
          <div 
            className={`modal-content modal-small animate-modal-in ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="responsive-card text-center">
              <MapPin size={32} className="mx-auto mb-4 text-gray-500" />
              <h3 className={`text-base font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Location Unavailable
              </h3>
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                This is a fictional food item from movies or cartoons. The location is not available for navigation.
              </p>
              
              <button
                onClick={() => setShowLocationUnavailable(false)}
                className={`w-full py-2 rounded-full font-medium text-sm ${
                  theme === 'synesthesia'
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                } transition-colors`}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="modal-overlay" onClick={() => setShowConfirmDelete(null)}>
          <div 
            className={`modal-content modal-small animate-modal-in ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="responsive-card text-center">
              <h3 className={`text-base font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Remove from Favourites?
              </h3>
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Are you sure you want to remove {favourites.find(f => f.id === showConfirmDelete)?.name}?
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmDelete(null)}
                  className={`flex-1 py-2 rounded-full font-medium text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2 rounded-full font-medium text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Favourites;