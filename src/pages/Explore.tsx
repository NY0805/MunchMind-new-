import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Filter, Navigation, Heart, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useFavourites } from '../context/FavouritesContext';
import { useUser } from '../context/UserContext';
import TrendingDishes from '../components/explore/TrendingDishes';
import CulturalTimeTravel from '../components/explore/CulturalTimeTravel';
import FoodPuzzleChallenge from '../components/explore/FoodPuzzleChallenge';
import GlobalStreetFoodRoulette from '../components/explore/GlobalStreetFoodRoulette';
import { getRandomFoodImage, categorizeFoodByName } from '../utils/foodImages';

// Mock restaurant data with generated images
const mockRestaurants = [
  {
    id: 1,
    name: "Bella Vista Italian",
    cuisine: "Italian",
    rating: 4.5,
    distance: 0.3,
    isOpen: true,
    description: "Authentic Italian cuisine with fresh pasta and wood-fired pizza",
    address: "123 Main Street, Downtown",
    phone: "+1 (555) 123-4567",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    priceLevel: 3,
    specialDish: "Truffle Pasta",
    photos: [
      getRandomFoodImage('pasta'),
      getRandomFoodImage('pasta'),
      getRandomFoodImage('pasta')
    ],
    reviews: [
      { author: "Maria R.", rating: 5, text: "Amazing pasta! Best Italian food in the city.", date: "2 days ago", profilePhoto: null },
      { author: "John D.", rating: 4, text: "Great atmosphere and delicious food.", date: "1 week ago", profilePhoto: null }
    ],
    openingHours: [
      "Sunday: 12:00 PM – 10:00 PM",
      "Monday: 11:00 AM – 10:00 PM", 
      "Tuesday: 11:00 AM – 10:00 PM",
      "Wednesday: 11:00 AM – 10:00 PM",
      "Thursday: 11:00 AM – 10:00 PM",
      "Friday: 11:00 AM – 11:00 PM",
      "Saturday: 11:00 AM – 11:00 PM"
    ],
    userRatingsTotal: 127
  },
  {
    id: 2,
    name: "Sakura Sushi",
    cuisine: "Japanese",
    rating: 4.8,
    distance: 0.7,
    isOpen: true,
    description: "Fresh sushi and traditional Japanese dishes",
    address: "456 Oak Avenue, Midtown",
    phone: "+1 (555) 234-5678",
    coordinates: { lat: 40.7282, lng: -74.0776 },
    priceLevel: 4,
    specialDish: "Omakase Set",
    photos: [
      getRandomFoodImage('seafood'),
      getRandomFoodImage('seafood'),
      getRandomFoodImage('seafood')
    ],
    reviews: [
      { author: "Yuki T.", rating: 5, text: "Exceptional sushi quality. Worth every penny!", date: "1 day ago", profilePhoto: null },
      { author: "Mike S.", rating: 5, text: "Best sushi in town, fresh fish daily.", date: "3 days ago", profilePhoto: null }
    ],
    openingHours: [
      "Sunday: Closed",
      "Monday: 5:00 PM – 10:00 PM",
      "Tuesday: 5:00 PM – 10:00 PM", 
      "Wednesday: 5:00 PM – 10:00 PM",
      "Thursday: 5:00 PM – 10:00 PM",
      "Friday: 5:00 PM – 11:00 PM",
      "Saturday: 5:00 PM – 11:00 PM"
    ],
    userRatingsTotal: 89
  },
  {
    id: 3,
    name: "Spice Garden",
    cuisine: "Indian",
    rating: 4.3,
    distance: 1.2,
    isOpen: false,
    description: "Authentic Indian spices and traditional curry dishes",
    address: "789 Spice Lane, Little India",
    phone: "+1 (555) 345-6789",
    coordinates: { lat: 40.7505, lng: -73.9934 },
    priceLevel: 2,
    specialDish: "Butter Chicken",
    photos: [
      getRandomFoodImage('curry'),
      getRandomFoodImage('curry'),
      getRandomFoodImage('curry')
    ],
    reviews: [
      { author: "Priya K.", rating: 4, text: "Authentic flavors that remind me of home.", date: "5 days ago", profilePhoto: null },
      { author: "Alex M.", rating: 4, text: "Great curry selection and reasonable prices.", date: "1 week ago", profilePhoto: null }
    ],
    openingHours: [
      "Sunday: 12:00 PM – 9:00 PM",
      "Monday: 11:00 AM – 9:00 PM",
      "Tuesday: 11:00 AM – 9:00 PM",
      "Wednesday: 11:00 AM – 9:00 PM", 
      "Thursday: 11:00 AM – 9:00 PM",
      "Friday: 11:00 AM – 10:00 PM",
      "Saturday: 11:00 AM – 10:00 PM"
    ],
    userRatingsTotal: 156
  },
  {
    id: 4,
    name: "Green Leaf Café",
    cuisine: "Vegetarian",
    rating: 4.6,
    distance: 0.5,
    isOpen: true,
    description: "Fresh vegetarian and vegan options with organic ingredients",
    address: "321 Green Street, Eco District",
    phone: "+1 (555) 456-7890",
    coordinates: { lat: 40.7614, lng: -73.9776 },
    priceLevel: 2,
    specialDish: "Quinoa Power Bowl",
    photos: [
      getRandomFoodImage('salad'),
      getRandomFoodImage('salad'),
      getRandomFoodImage('salad')
    ],
    reviews: [
      { author: "Emma G.", rating: 5, text: "Love the fresh ingredients and creative dishes!", date: "1 day ago", profilePhoto: null },
      { author: "David L.", rating: 4, text: "Great healthy options, perfect for lunch.", date: "4 days ago", profilePhoto: null }
    ],
    openingHours: [
      "Sunday: 8:00 AM – 8:00 PM",
      "Monday: 7:00 AM – 8:00 PM",
      "Tuesday: 7:00 AM – 8:00 PM",
      "Wednesday: 7:00 AM – 8:00 PM",
      "Thursday: 7:00 AM – 8:00 PM",
      "Friday: 7:00 AM – 9:00 PM",
      "Saturday: 8:00 AM – 9:00 PM"
    ],
    userRatingsTotal: 203
  },
  {
    id: 5,
    name: "Burger Junction",
    cuisine: "American",
    rating: 4.2,
    distance: 0.9,
    isOpen: true,
    description: "Gourmet burgers and classic American comfort food",
    address: "654 Burger Ave, Food Court",
    phone: "+1 (555) 567-8901",
    coordinates: { lat: 40.7282, lng: -74.0776 },
    priceLevel: 2,
    specialDish: "Signature Beef Burger",
    photos: [
      getRandomFoodImage('burger'),
      getRandomFoodImage('burger'),
      getRandomFoodImage('burger')
    ],
    reviews: [
      { author: "Jake P.", rating: 4, text: "Juicy burgers and great fries!", date: "2 days ago", profilePhoto: null },
      { author: "Lisa W.", rating: 4, text: "Classic American diner experience.", date: "6 days ago", profilePhoto: null }
    ],
    openingHours: [
      "Sunday: 11:00 AM – 10:00 PM",
      "Monday: 11:00 AM – 10:00 PM",
      "Tuesday: 11:00 AM – 10:00 PM",
      "Wednesday: 11:00 AM – 10:00 PM",
      "Thursday: 11:00 AM – 10:00 PM",
      "Friday: 11:00 AM – 11:00 PM",
      "Saturday: 11:00 AM – 11:00 PM"
    ],
    userRatingsTotal: 98
  },
  {
    id: 6,
    name: "Café Mocha",
    cuisine: "Coffee & Desserts",
    rating: 4.4,
    distance: 0.4,
    isOpen: true,
    description: "Artisan coffee and homemade pastries",
    address: "987 Coffee Street, Arts Quarter",
    phone: "+1 (555) 678-9012",
    coordinates: { lat: 40.7505, lng: -73.9934 },
    priceLevel: 2,
    specialDish: "Signature Latte",
    photos: [
      getRandomFoodImage('drink'),
      getRandomFoodImage('dessert'),
      getRandomFoodImage('breakfast')
    ],
    reviews: [
      { author: "Sophie B.", rating: 5, text: "Best coffee in the neighborhood!", date: "1 day ago", profilePhoto: null },
      { author: "Mark T.", rating: 4, text: "Cozy atmosphere and great pastries.", date: "3 days ago", profilePhoto: null }
    ],
    openingHours: [
      "Sunday: 7:00 AM – 7:00 PM",
      "Monday: 6:00 AM – 8:00 PM",
      "Tuesday: 6:00 AM – 8:00 PM",
      "Wednesday: 6:00 AM – 8:00 PM",
      "Thursday: 6:00 AM – 8:00 PM",
      "Friday: 6:00 AM – 9:00 PM",
      "Saturday: 7:00 AM – 9:00 PM"
    ],
    userRatingsTotal: 145
  }
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { theme } = useTheme();
  const { addToFavourites, removeFromFavourites, isFavourite } = useFavourites();
  const { isValidUser } = useUser();
  const navigate = useNavigate();

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

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         restaurant.cuisine.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleRestaurantClick = (restaurant: any) => {
    // Add generated image to restaurant object
    const restaurantWithImage = {
      ...restaurant,
      image: getRandomFoodImage(categorizeFoodByName(restaurant.specialDish))
    };
    
    navigate(`/restaurant/${restaurant.id}`, { 
      state: { restaurant: restaurantWithImage } 
    });
  };

  const handleFavoriteToggle = (restaurant: any) => {
    if (!isValidUser()) {
      setShowLoginPrompt(true);
      return;
    }

    const foodItem = {
      id: restaurant.id,
      name: restaurant.name,
      image: getRandomFoodImage(categorizeFoodByName(restaurant.specialDish)),
      description: restaurant.description,
      nutrition: `${getPriceLevelDisplay(restaurant.priceLevel)} price range`,
      mood: 'neutral'
    };

    if (isFavourite(restaurant.id)) {
      removeFromFavourites(restaurant.id);
    } else {
      // Store restaurant location
      localStorage.setItem(`location_${restaurant.id}`, restaurant.address);
      addToFavourites(foodItem);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  const getPriceLevelDisplay = (level: number): string => {
    return '$'.repeat(level || 2);
  };

  return (
    <>
      <div className="responsive-container py-6">
        <h1 className={`responsive-title mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Explore Food
        </h1>
        
        {/* Search and Filter */}
        <div className="responsive-section">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={18} className={`absolute left-3 top-3 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search restaurants or cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white border-gray-600'
                    : 'bg-white text-gray-800 border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-400`}
              />
            </div>
            
            <div className="relative">
              <Filter size={18} className={`absolute left-3 top-3 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className={`pl-10 pr-8 py-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white border-gray-600'
                    : 'bg-white text-gray-800 border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-400`}
              >
                <option value="all">All Cuisines</option>
                <option value="italian">Italian</option>
                <option value="japanese">Japanese</option>
                <option value="indian">Indian</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="american">American</option>
                <option value="coffee & desserts">Coffee & Desserts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trending Dishes */}
        <section className="responsive-section">
          <h2 className={`responsive-subtitle mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
            Trending Dishes
          </h2>
          <TrendingDishes />
        </section>

        {/* Restaurants List */}
        <section className="responsive-section">
          <h2 className={`responsive-subtitle mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
            Nearby Restaurants ({filteredRestaurants.length})
          </h2>
          
          {filteredRestaurants.length === 0 ? (
            <div className={`text-center py-8 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-md`}>
              <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                No restaurants found
              </p>
              <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRestaurants.map((restaurant) => (
                <div 
                  key={restaurant.id}
                  className={`rounded-lg overflow-hidden shadow-md ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } hover:shadow-lg transition-shadow cursor-pointer`}
                >
                  <div className="flex h-32 sm:h-40">
                    <div 
                      className="w-1/3 relative"
                      onClick={() => handleRestaurantClick(restaurant)}
                    >
                      <img 
                        src={getRandomFoodImage(categorizeFoodByName(restaurant.specialDish))}
                        alt={restaurant.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="w-2/3 p-4 flex flex-col justify-between">
                      <div onClick={() => handleRestaurantClick(restaurant)}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className={`font-semibold text-lg ${
                            theme === 'dark' ? 'text-white' : 'text-gray-800'
                          }`}>
                            {restaurant.name}
                          </h3>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavoriteToggle(restaurant);
                            }}
                            className={`p-1 rounded-full transition-colors ${
                              isFavourite(restaurant.id)
                                ? 'text-red-500'
                                : theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            <Heart size={18} fill={isFavourite(restaurant.id) ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                        
                        <p className={`text-sm mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {restaurant.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-500 fill-current" />
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                              {restaurant.rating.toFixed(1)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <MapPin size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                              {restaurant.distance}km
                            </span>
                          </div>
                          
                          <div className={`flex items-center gap-1 ${
                            restaurant.isOpen ? 'text-green-500' : 'text-red-500'
                          }`}>
                            <Clock size={14} />
                            <span>{restaurant.isOpen ? 'Open' : 'Closed'}</span>
                          </div>
                          
                          <span className={`text-xs px-2 py-1 rounded ${
                            theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {getPriceLevelDisplay(restaurant.priceLevel)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Cultural Time Travel */}
        <section className="responsive-section">
          <h2 className={`responsive-subtitle mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
            Cultural Time Travel
          </h2>
          <CulturalTimeTravel />
        </section>

        {/* Food Puzzle Challenges */}
        <section className="responsive-section">
          <h2 className={`responsive-subtitle mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
            Food Puzzle Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FoodPuzzleChallenge
              title="Guess the Spice"
              description="Can you identify these exotic spices from around the world?"
              difficulty="Medium"
              image="https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg"
            />
            <FoodPuzzleChallenge
              title="Recipe Reconstruction"
              description="Rebuild this classic dish from scattered ingredients."
              difficulty="Hard"
              image="https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg"
            />
          </div>
        </section>

        {/* Global Street Food Roulette */}
        <section className="responsive-section">
          <h2 className={`responsive-subtitle mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
            Global Street Food Roulette
          </h2>
          <div className="text-center">
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Discover random street food from around the world!
            </p>
            <GlobalStreetFoodRoulette />
          </div>
        </section>
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
                Please log in to save your favourite restaurants and sync across devices.
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