import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Filter, Heart, Navigation, RotateCcw, Globe, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useFavourites } from '../context/FavouritesContext';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabase';
import GoogleMap from '../components/GoogleMap';
import TrendingDishes from '../components/explore/TrendingDishes';
import CulturalTimeTravel from '../components/explore/CulturalTimeTravel';
import FoodPuzzleChallenge from '../components/explore/FoodPuzzleChallenge';
import GlobalStreetFoodRoulette from '../components/explore/GlobalStreetFoodRoulette';
import { getRandomFoodImage, categorizeFoodByName } from '../utils/foodImages';

// Mock restaurant data with proper images
const mockRestaurants = [
  {
    id: 1,
    name: 'Bella Vista',
    cuisine: 'Italian',
    rating: 4.8,
    distance: 0.5,
    isOpen: true,
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    description: 'Authentic Italian cuisine with fresh pasta and wood-fired pizzas',
    address: '123 Main Street, Downtown',
    phone: '+1 (555) 123-4567',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    averageCalories: 650,
    specialDish: 'Truffle Pasta',
    priceLevel: 3
  },
  {
    id: 2,
    name: 'Sakura Sushi',
    cuisine: 'Japanese',
    rating: 4.9,
    distance: 1.2,
    isOpen: true,
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg',
    description: 'Fresh sushi and traditional Japanese dishes',
    address: '456 Oak Avenue, Midtown',
    phone: '+1 (555) 234-5678',
    coordinates: { lat: 40.7282, lng: -74.0776 },
    averageCalories: 420,
    specialDish: 'Dragon Roll',
    priceLevel: 4
  },
  {
    id: 3,
    name: 'Spice Garden',
    cuisine: 'Indian',
    rating: 4.6,
    distance: 2.1,
    isOpen: false,
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
    description: 'Aromatic Indian curries and tandoor specialties',
    address: '789 Spice Lane, Little India',
    phone: '+1 (555) 345-6789',
    coordinates: { lat: 40.7614, lng: -73.9776 },
    averageCalories: 580,
    specialDish: 'Butter Chicken',
    priceLevel: 2
  },
  {
    id: 4,
    name: 'Green Leaf Café',
    cuisine: 'Healthy',
    rating: 4.7,
    distance: 0.8,
    isOpen: true,
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    description: 'Fresh salads, smoothie bowls, and organic dishes',
    address: '321 Health Street, Wellness District',
    phone: '+1 (555) 456-7890',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    averageCalories: 350,
    specialDish: 'Quinoa Power Bowl',
    priceLevel: 2
  },
  {
    id: 5,
    name: 'Taco Fiesta',
    cuisine: 'Mexican',
    rating: 4.5,
    distance: 1.5,
    isOpen: true,
    image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg',
    description: 'Authentic Mexican street food and margaritas',
    address: '654 Fiesta Boulevard, Mexican Quarter',
    phone: '+1 (555) 567-8901',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    averageCalories: 520,
    specialDish: 'Carnitas Tacos',
    priceLevel: 2
  },
  {
    id: 6,
    name: 'Le Petit Bistro',
    cuisine: 'French',
    rating: 4.9,
    distance: 3.2,
    isOpen: true,
    image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
    description: 'Classic French cuisine in an intimate setting',
    address: '987 Rue de Paris, French Quarter',
    phone: '+1 (555) 678-9012',
    coordinates: { lat: 40.7831, lng: -73.9712 },
    averageCalories: 720,
    specialDish: 'Coq au Vin',
    priceLevel: 4
  }
];

// Food items for recommended section
const allFoodItems = [
  {
    id: 5001,
    name: 'Truffle Pasta',
    description: 'Rich pasta with black truffle and parmesan',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    restaurant: 'Bella Vista',
    rating: 4.8,
    category: 'pasta'
  },
  {
    id: 5002,
    name: 'Dragon Roll',
    description: 'Premium sushi roll with eel and avocado',
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg',
    restaurant: 'Sakura Sushi',
    rating: 4.9,
    category: 'seafood'
  },
  {
    id: 5003,
    name: 'Butter Chicken',
    description: 'Creamy tomato curry with tender chicken',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
    restaurant: 'Spice Garden',
    rating: 4.6,
    category: 'curry'
  },
  {
    id: 5004,
    name: 'Quinoa Power Bowl',
    description: 'Nutritious bowl with quinoa, vegetables, and tahini',
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    restaurant: 'Green Leaf Café',
    rating: 4.7,
    category: 'salad'
  },
  {
    id: 5005,
    name: 'Carnitas Tacos',
    description: 'Slow-cooked pork tacos with fresh salsa',
    image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg',
    restaurant: 'Taco Fiesta',
    rating: 4.5,
    category: 'meat'
  },
  {
    id: 5006,
    name: 'Coq au Vin',
    description: 'Classic French chicken braised in wine',
    image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
    restaurant: 'Le Petit Bistro',
    rating: 4.9,
    category: 'meat'
  }
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showSpinModal, setShowSpinModal] = useState(false);
  const [showGlobeModal, setShowGlobeModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { theme } = useTheme();
  const { addToFavourites, removeFromFavourites, isFavourite } = useFavourites();
  const { user, isValidUser } = useUser();
  const navigate = useNavigate();

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to NYC coordinates
          setUserLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    } else {
      // Fallback to NYC coordinates
      setUserLocation({ lat: 40.7128, lng: -74.0060 });
    }
  }, []);

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (showSpinModal || showGlobeModal || showLoginPrompt) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showSpinModal, showGlobeModal, showLoginPrompt]);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         restaurant.cuisine.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Get top 3 recommended foods (rating > 4.5)
  const recommendedFoods = allFoodItems
    .filter(food => food.rating > 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const handleRestaurantSelect = (restaurant: any) => {
    navigate(`/restaurant/${restaurant.id}`, { state: { restaurant } });
  };

  const handleRestaurantsUpdate = (newRestaurants: any[]) => {
    setRestaurants(newRestaurants);
  };

  const saveRecipeCompletion = async (food: any) => {
    if (isValidUser()) {
      try {
        await supabase
          .from('recipes')
          .insert({
            user_id: user.id,
            recipe_id: food.id,
            recipe_name: food.name,
            difficulty: 'Medium',
            tried_at: new Date().toISOString()
          });
        console.log('Recipe completion saved to database');
      } catch (error) {
        console.error('Failed to save recipe completion:', error);
      }
    }
  };

  const handleLearnRecipe = async (food: any) => {
    // Save recipe completion first
    await saveRecipeCompletion(food);

    // Update last bite date with dd/mm/yyyy format
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    
    localStorage.setItem(`lastBite_${food.id}`, formattedDate);

    const recipe = {
      id: food.id,
      name: food.name,
      image: food.image,
      time: '25 min',
      difficulty: 'Medium',
      ingredients: ['Main ingredients for ' + food.name, 'Supporting spices', 'Fresh herbs', 'Cooking oil'],
      steps: ['Prepare ingredients', 'Heat cooking surface', 'Cook main components', 'Add seasonings', 'Serve hot']
    };
    
    sessionStorage.setItem('selectedRecipe', JSON.stringify(recipe));
    navigate('/ai-chef?loadRecipe=true');
  };

  const handleFoodFavorite = (food: any) => {
    if (!isValidUser()) {
      setShowLoginPrompt(true);
      return;
    }

    const foodItem = {
      id: food.id,
      name: food.name,
      image: food.image,
      description: food.description,
      nutrition: `From ${food.restaurant}`,
      mood: 'neutral'
    };

    if (isFavourite(food.id)) {
      removeFromFavourites(food.id);
    } else {
      // Store restaurant name as location for explore page foods
      localStorage.setItem(`location_${food.id}`, food.restaurant);
      addToFavourites(foodItem);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  return (
    <>
      <div className="responsive-container py-6">
        <h1 className={`responsive-title mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Explore
        </h1>
        
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search size={20} className={`absolute left-3 top-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-800 border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-orange-400`}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white border border-gray-700'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
            
            <button
              onClick={() => setShowSpinModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                theme === 'synesthesia'
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              } transition-colors`}
            >
              <RotateCcw size={18} />
              <span>Spin Wheel</span>
            </button>
            
            <button
              onClick={() => setShowGlobeModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                theme === 'synesthesia'
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              } transition-colors`}
            >
              <Globe size={18} />
              <span>Spin Globe</span>
            </button>
          </div>
          
          {showFilters && (
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-wrap gap-2">
                {['all', 'italian', 'japanese', 'indian', 'healthy', 'mexican', 'french'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedFilter === filter
                        ? theme === 'synesthesia'
                          ? 'bg-purple-500 text-white'
                          : 'bg-orange-500 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Nearby Restaurants
          </h2>
          <GoogleMap
            restaurants={filteredRestaurants}
            onRestaurantSelect={handleRestaurantSelect}
            userLocation={userLocation}
            onRestaurantsUpdate={handleRestaurantsUpdate}
          />
        </div>

        {/* Recommended for You */}
        <section className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Recommended for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedFoods.map((food) => (
              <div 
                key={food.id} 
                className={`rounded-lg overflow-hidden shadow-md ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="relative h-48">
                  <img 
                    src={food.image} 
                    alt={food.name} 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={() => handleFoodFavorite(food)}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
                      isFavourite(food.id)
                        ? 'bg-red-500 text-white scale-110'
                        : 'bg-white/80 text-gray-700 hover:bg-white'
                    }`}
                  >
                    <Heart size={18} fill={isFavourite(food.id) ? "white" : "none"} />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className={`font-semibold text-lg ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {food.name}
                  </h3>
                  
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {food.restaurant}
                  </p>
                  
                  <p className={`text-sm mb-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {food.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {food.rating.toFixed(1)}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => handleLearnRecipe(food)}
                      className={`text-sm px-3 py-1 rounded-full ${
                        theme === 'synesthesia'
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          : theme === 'dark'
                            ? 'bg-gray-700 text-orange-400 hover:bg-gray-600'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      } transition-colors`}
                    >
                      Learn Recipe
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Dishes */}
        <section className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Trending Dishes
          </h2>
          <TrendingDishes />
        </section>

        {/* Cultural Time Travel */}
        <section className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Cultural Time Travel
          </h2>
          <CulturalTimeTravel />
        </section>

        {/* Food Puzzle Challenge */}
        <section className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Food Puzzle Challenge
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FoodPuzzleChallenge
              title="Guess the Cuisine"
              description="Identify the cuisine from ingredient clues"
              difficulty="Easy"
              image="https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg"
            />
            <FoodPuzzleChallenge
              title="Recipe Reconstruction"
              description="Rebuild a classic recipe from scattered steps"
              difficulty="Hard"
              image="https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg"
            />
          </div>
        </section>

        {/* Global Street Food Roulette */}
        <section className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Global Street Food Roulette
          </h2>
          <div className="text-center">
            <GlobalStreetFoodRoulette />
          </div>
        </section>
      </div>

      {/* Spin Wheel Modal */}
      {showSpinModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50" style={{ 
          height: '100vh', 
          width: '100vw', 
          top: 0, 
          left: 0,
          padding: '1rem'
        }}>
          <div 
            className={`relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 text-center ${
              theme === 'synesthesia'
                ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                : 'bg-gradient-to-br from-orange-500 to-amber-500'
            } text-white`}>
              <RotateCcw size={28} className="mx-auto mb-2" />
              <h2 className="text-lg font-bold">Spin the Flavor Wheel</h2>
              <p className="text-white/90 text-sm">Discover new flavors</p>
            </div>
            
            <div className="p-6 text-center">
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                This feature is coming soon! Get ready to discover amazing new flavors.
              </p>
              <button
                onClick={() => setShowSpinModal(false)}
                className={`px-6 py-2 rounded-full font-medium ${
                  theme === 'synesthesia'
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                } transition-colors`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spin Globe Modal */}
      {showGlobeModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50" style={{ 
          height: '100vh', 
          width: '100vw', 
          top: 0, 
          left: 0,
          padding: '1rem'
        }}>
          <div 
            className={`relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 text-center ${
              theme === 'synesthesia'
                ? 'bg-gradient-to-br from-purple-500 to-indigo-500'
                : 'bg-gradient-to-br from-blue-500 to-cyan-500'
            } text-white`}>
              <Globe size={28} className="mx-auto mb-2" />
              <h2 className="text-lg font-bold">Global Food Roulette</h2>
              <p className="text-white/90 text-sm">Explore world cuisines</p>
            </div>
            
            <div className="p-6 text-center">
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                This feature is coming soon! Get ready to explore cuisines from around the world.
              </p>
              <button
                onClick={() => setShowGlobeModal(false)}
                className={`px-6 py-2 rounded-full font-medium ${
                  theme === 'synesthesia'
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                } transition-colors`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Explore;