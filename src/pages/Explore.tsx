import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Clock, Heart, ChevronDown, ChevronUp, RotateCcw, Navigation, Globe, TrendingUp, X, Utensils, Phone, ExternalLink, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useFavourites } from '../context/FavouritesContext';
import { useUser } from '../context/UserContext';
import GoogleMap from '../components/GoogleMap';

// Mock data for restaurants with realistic NYC coordinates
const mockRestaurants = [
  {
    id: 5001, // Unique ID range for Explore page restaurants
    name: "Mama's Italian Kitchen",
    cuisine: "Italian",
    rating: 4.5,
    distance: 0.8,
    isOpen: true,
    image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
    description: "Authentic Italian cuisine with fresh pasta made daily",
    address: "123 Main Street, Downtown",
    phone: "+1 (555) 123-4567",
    coordinates: { lat: 40.7589, lng: -73.9851 }, // Times Square area
    priceLevel: 2,
    specialDish: "Carbonara",
    menu: [
      { name: "Spaghetti Carbonara", price: 18, calories: 720, description: "Classic Roman pasta with eggs, cheese, and pancetta" },
      { name: "Margherita Pizza", price: 16, calories: 580, description: "Fresh mozzarella, tomato sauce, and basil" },
      { name: "Chicken Parmigiana", price: 22, calories: 850, description: "Breaded chicken with marinara and mozzarella" }
    ],
    reviews: [
      { author: "Sarah M.", rating: 5, text: "Best carbonara in the city! Authentic Italian flavors.", date: "2 days ago" },
      { author: "Mike R.", rating: 4, text: "Great atmosphere and delicious food. Will definitely return.", date: "1 week ago" }
    ]
  },
  {
    id: 5002,
    name: "Dragon Palace",
    cuisine: "Chinese",
    rating: 4.2,
    distance: 1.2,
    isOpen: true,
    image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg",
    description: "Traditional Chinese dishes with modern presentation",
    address: "456 Oak Avenue, Chinatown",
    phone: "+1 (555) 234-5678",
    coordinates: { lat: 40.7128, lng: -74.0060 }, // Lower Manhattan
    priceLevel: 2,
    specialDish: "Kung Pao Chicken",
    menu: [
      { name: "Kung Pao Chicken", price: 15, calories: 520, description: "Spicy stir-fried chicken with peanuts and vegetables" },
      { name: "Sweet & Sour Pork", price: 14, calories: 640, description: "Crispy pork with bell peppers in tangy sauce" },
      { name: "Beef Lo Mein", price: 13, calories: 580, description: "Soft noodles with tender beef and vegetables" }
    ],
    reviews: [
      { author: "Lisa K.", rating: 4, text: "Excellent kung pao chicken! Perfect spice level.", date: "3 days ago" },
      { author: "Tom W.", rating: 5, text: "Authentic flavors and generous portions.", date: "5 days ago" }
    ]
  },
  {
    id: 5003,
    name: "Green Garden Café",
    cuisine: "Vegan",
    rating: 4.7,
    distance: 0.5,
    isOpen: false,
    image: "https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg",
    description: "Plant-based cuisine with locally sourced ingredients",
    address: "789 Green Street, Eco District",
    phone: "+1 (555) 345-6789",
    coordinates: { lat: 40.7505, lng: -73.9934 }, // Midtown East
    priceLevel: 3,
    specialDish: "Buddha Bowl",
    menu: [
      { name: "Buddha Bowl", price: 14, calories: 380, description: "Quinoa, roasted vegetables, and tahini dressing" },
      { name: "Vegan Burger", price: 16, calories: 450, description: "Plant-based patty with avocado and sprouts" },
      { name: "Acai Bowl", price: 12, calories: 320, description: "Acai berries with granola and fresh fruits" }
    ],
    reviews: [
      { author: "Emma D.", rating: 5, text: "Amazing vegan options! The Buddha bowl is incredible.", date: "1 day ago" },
      { author: "Alex P.", rating: 4, text: "Fresh ingredients and creative dishes.", date: "4 days ago" }
    ]
  },
  {
    id: 5004,
    name: "Sakura Sushi",
    cuisine: "Japanese",
    rating: 4.6,
    distance: 2.1,
    isOpen: true,
    image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg",
    description: "Fresh sushi and traditional Japanese dishes",
    address: "321 Bamboo Lane, Little Tokyo",
    phone: "+1 (555) 456-7890",
    coordinates: { lat: 40.7282, lng: -74.0776 }, // West Village
    priceLevel: 3,
    specialDish: "Salmon Sashimi",
    menu: [
      { name: "Salmon Sashimi", price: 18, calories: 280, description: "Fresh Atlantic salmon, thinly sliced" },
      { name: "California Roll", price: 12, calories: 320, description: "Crab, avocado, and cucumber roll" },
      { name: "Chicken Teriyaki", price: 16, calories: 540, description: "Grilled chicken with teriyaki glaze" }
    ],
    reviews: [
      { author: "David L.", rating: 5, text: "Freshest sushi in town! Excellent quality.", date: "2 days ago" },
      { author: "Maria S.", rating: 4, text: "Great atmosphere and skilled chefs.", date: "1 week ago" }
    ]
  },
  {
    id: 5005,
    name: "Spice Route",
    cuisine: "Indian",
    rating: 4.3,
    distance: 1.8,
    isOpen: true,
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
    description: "Authentic Indian spices and traditional recipes",
    address: "654 Curry Street, Spice Quarter",
    phone: "+1 (555) 567-8901",
    coordinates: { lat: 40.7614, lng: -73.9776 }, // Upper West Side
    priceLevel: 2,
    specialDish: "Butter Chicken",
    menu: [
      { name: "Butter Chicken", price: 17, calories: 680, description: "Creamy tomato curry with tender chicken" },
      { name: "Vegetable Biryani", price: 15, calories: 620, description: "Fragrant basmati rice with mixed vegetables" },
      { name: "Lamb Vindaloo", price: 19, calories: 780, description: "Spicy Goan curry with tender lamb" }
    ],
    reviews: [
      { author: "Raj P.", rating: 5, text: "Authentic flavors that remind me of home!", date: "3 days ago" },
      { author: "Jennifer M.", rating: 4, text: "Excellent spice levels and generous portions.", date: "6 days ago" }
    ]
  }
];

// Mock search suggestions
const searchSuggestions = [
  "Carbonara", "Sushi", "Butter Chicken", "Buddha Bowl", "Pizza Margherita",
  "Kung Pao Chicken", "Beef Noodles", "Vegan Burger", "Salmon Sashimi", "Biryani"
];

// Cuisine types for filters
// const cuisineTypes = ["Italian", "Chinese", "Japanese", "Indian", "Vegan", "Mexican", "Thai", "American"];

// Street foods for roulette
const streetFoods = [
  {
    id: 6001, // Unique ID range for street foods
    name: "Takoyaki",
    description: "Japanese octopus balls with savory sauce and bonito flakes",
    origin: "Osaka, Japan",
    image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg"
  },
  {
    id: 6002,
    name: "Tacos al Pastor",
    description: "Mexican pork tacos with pineapple and cilantro",
    origin: "Mexico City, Mexico",
    image: "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg"
  },
  {
    id: 6003,
    name: "Pad Thai",
    description: "Thai stir-fried noodles with shrimp, tofu, and peanuts",
    origin: "Bangkok, Thailand",
    image: "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg"
  },
  {
    id: 6004,
    name: "Banh Mi",
    description: "Vietnamese sandwich with pork, pâté, and pickled vegetables",
    origin: "Ho Chi Minh City, Vietnam",
    image: "https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg"
  }
];

// Trending dishes
const trendingDishes = [
  {
    id: 7001, // Unique ID range for trending dishes
    name: "Korean Corn Dogs",
    badge: "Viral",
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
    restaurants: 12,
    description: "Crispy Korean-style corn dogs with various coatings and fillings",
    origin: "Seoul, South Korea",
    calories: 450,
    allergens: ["Gluten", "Dairy"],
    flavorProfile: "Savory, Crispy, Sweet",
    relatedRestaurants: [
      { name: "Seoul Street Food", distance: "0.5km", rating: 4.8 },
      { name: "K-Dog Palace", distance: "1.2km", rating: 4.6 },
      { name: "Gangnam Bites", distance: "2.1km", rating: 4.7 }
    ]
  },
  {
    id: 7002,
    name: "Birria Tacos",
    badge: "Trending",
    image: "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg",
    restaurants: 8,
    description: "Mexican beef stew tacos served with rich consommé for dipping",
    origin: "Jalisco, Mexico",
    calories: 380,
    allergens: ["Gluten"],
    flavorProfile: "Rich, Savory, Spicy",
    relatedRestaurants: [
      { name: "Birria Bros", distance: "0.8km", rating: 4.9 },
      { name: "Taco Consommé", distance: "1.5km", rating: 4.5 },
      { name: "El Birrieria", distance: "2.3km", rating: 4.7 }
    ]
  },
  {
    id: 7003,
    name: "Dalgona Coffee",
    badge: "Popular",
    image: "https://images.pexels.com/photos/4790070/pexels-photo-4790070.jpeg",
    restaurants: 15,
    description: "Whipped coffee drink that became a viral sensation",
    origin: "South Korea",
    calories: 120,
    allergens: ["Dairy"],
    flavorProfile: "Sweet, Creamy, Caffeinated",
    relatedRestaurants: [
      { name: "Whipped Dreams Café", distance: "0.3km", rating: 4.6 },
      { name: "Cloud Nine Coffee", distance: "1.1km", rating: 4.8 },
      { name: "Foam & Bubbles", distance: "1.7km", rating: 4.4 }
    ]
  }
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  // const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedDistance, setSelectedDistance] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [openNow, setOpenNow] = useState(false);
  const [filteredRestaurants, setFilteredRestaurants] = useState(mockRestaurants);
  const [allRestaurants, setAllRestaurants] = useState(mockRestaurants);
  const [mapRestaurants, setMapRestaurants] = useState<any[]>([]);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<any>(null);
  const [showStreetFoodRoulette, setShowStreetFoodRoulette] = useState(false);
  const [streetFoodResult, setStreetFoodResult] = useState<any>(null);
  const [isGlobeSpinning, setIsGlobeSpinning] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMore, setShowMore] = useState(false);
  
  const { theme } = useTheme();
  const { addToFavourites, removeFromFavourites, isFavourite } = useFavourites();
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();

  // Check if user is guest or not logged in
  const isGuest = !isAuthenticated || !user || user.is_guest;

  // Get user's current location
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
          console.warn('Geolocation error:', error);
          // Default to NYC if geolocation fails
          setUserLocation({ lat: 40.7128, lng: -74.0060 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      // Default to NYC if geolocation is not supported
      setUserLocation({ lat: 40.7128, lng: -74.0060 });
    }
  }, []);

  // Scroll to top when component mounts (when navigating to Explore tab)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Filter suggestions based on search query
  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Apply filters to restaurants - now only shows restaurants visible on map
  const applyFilters = () => {
    let filtered = [...mapRestaurants]; // Use map restaurants instead of all restaurants

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.specialDish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.menu?.some((item: any) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Cuisine filter
    // if (selectedCuisines.length > 0) {
    //   filtered = filtered.filter(restaurant =>
    //     selectedCuisines.includes(restaurant.cuisine)
    //   );
    // }

    // Rating filter
    if (selectedRating) {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter(restaurant => restaurant.rating >= minRating);
    }

    // Distance filter
    if (selectedDistance) {
      const maxDistance = parseFloat(selectedDistance);
      filtered = filtered.filter(restaurant => restaurant.distance <= maxDistance);
    }

    // Price range filter
    if (selectedPriceRange) {
      const priceLevel = selectedPriceRange.length; // Number of $ symbols
      filtered = filtered.filter(restaurant => restaurant.priceLevel === priceLevel);
    }

    // Open now filter
    if (openNow) {
      filtered = filtered.filter(restaurant => restaurant.isOpen);
    }

    setFilteredRestaurants(filtered);
  };

  // Auto-scroll to restaurant results
  const scrollToResults = () => {
    setTimeout(() => {
      const restaurantSection = document.getElementById('restaurant-results');
      if (restaurantSection) {
        restaurantSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Handle search form submission (Enter key)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    applyFilters();
    // Auto-scroll only when user submits search
    scrollToResults();
  };

  // Handle suggestion click (NO auto-scroll)
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    // Apply filters with the selected suggestion but don't auto-scroll
    setTimeout(applyFilters, 0);
  };

  // Toggle cuisine selection
  // const toggleCuisine = (cuisine: string) => {
  //   setSelectedCuisines(prev =>
  //     prev.includes(cuisine)
  //       ? prev.filter(c => c !== cuisine)
  //       : [...prev, cuisine]
  //   );
  // };

  // Handle restaurant selection
  const handleRestaurantSelect = (restaurant: any) => {
    navigate(`/restaurant/${restaurant.id}`, { state: { restaurant } });
  };

  // Handle favorite toggle with login prompt overlay
  const handleFavoriteToggle = (restaurant: any) => {
    // Check if user is authenticated and has valid UUID
    if (isGuest) {
      setShowLoginPrompt(true);
      return;
    }

    const foodItem = {
      id: restaurant.id,
      name: restaurant.name,
      image: restaurant.image,
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

  // Get price level display
  const getPriceLevelDisplay = (level: number): string => {
    return '$'.repeat(level || 2);
  };

  // Handle navigation
  const handleNavigate = (restaurant: any) => {
    const { lat, lng } = restaurant.coordinates;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  // Handle spin wheel
  const handleSpinWheel = () => {
    if (filteredRestaurants.length === 0) return;
    
    setShowSpinWheel(true);
    setIsSpinning(true);
    setSpinResult(null);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
      setSpinResult(filteredRestaurants[randomIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  // Handle street food roulette
  const handleStreetFoodRoulette = () => {
    setShowStreetFoodRoulette(true);
    setIsGlobeSpinning(true);
    setStreetFoodResult(null);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * streetFoods.length);
      setStreetFoodResult(streetFoods[randomIndex]);
      setIsGlobeSpinning(false);
    }, 3000);
  };

  // Handle learn recipe
  const handleLearnRecipe = (dish: any) => {
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
    setShowStreetFoodRoulette(false);
    setStreetFoodResult(null);
    navigate('/ai-chef?loadRecipe=true');
  };

  // Handle dish details navigation
  const handleDishDetails = (dish: any) => {
    navigate(`/trending-dish/${dish.id}`, { state: { dish } });
  };

  // Close modals
  const closeSpinWheel = () => {
    setShowSpinWheel(false);
    setSpinResult(null);
    setIsSpinning(false);
  };

  const closeStreetFoodRoulette = () => {
    setShowStreetFoodRoulette(false);
    setStreetFoodResult(null);
    setIsGlobeSpinning(false);
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  // Handle restaurants update from map
  const handleRestaurantsUpdate = (restaurants: any[]) => {
    setMapRestaurants(restaurants);
    setAllRestaurants([...mockRestaurants, ...restaurants]);
  };

  // Apply filters when dependencies change (NO auto-scroll)
  useEffect(() => {
    applyFilters();
  }, [/*selectedCuisines, */selectedRating, selectedDistance, selectedPriceRange, openNow, mapRestaurants]);

  // Handle Go button click (with auto-scroll)
  const handleGoButtonClick = () => {
    applyFilters();
    // Auto-scroll only when user clicks Go button
    scrollToResults();
  };

  // Display restaurants for list view
  const displayedRestaurants = showMore ? filteredRestaurants : filteredRestaurants.slice(0, 10);

  return (
    <>
      <div className="responsive-container py-6">
        {/* Page Title */}
        <h1 className={`responsive-title mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Explore
        </h1>

        {/* Search Bar */}
        <div className="relative mb-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                className={`w-full p-4 pl-12 pr-4 rounded-xl text-base ${
                  theme === 'dark' 
                    ? 'bg-gray-800 text-white border-gray-700' 
                    : 'bg-white text-gray-800 border-gray-200'
                } border-2 shadow-lg focus:outline-none focus:ring-2 ${
                  theme === 'synesthesia' ? 'focus:ring-purple-400' : 'focus:ring-orange-400'
                }`}
              />
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </form>

          {/* Search Suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl border z-50 ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-4 py-3 hover:bg-opacity-50 transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-800'
                  } ${index === 0 ? 'rounded-t-xl' : ''} ${index === filteredSuggestions.slice(0, 5).length - 1 ? 'rounded-b-xl' : ''}`}
                >
                  <Search size={16} className="inline mr-3 text-gray-400" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters - Vertical Layout */}
        <div className={`rounded-xl mb-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg overflow-hidden`}>
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setFiltersExpanded(!filtersExpanded)}
          >
            <div className="flex items-center gap-2">
              <Filter size={20} className={theme === 'synesthesia' ? 'text-purple-500' : 'text-orange-500'} />
              <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Filters
              </h3>
            </div>
            {filtersExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {filtersExpanded && (
            <div className="px-4 pb-4">
              

              {/* Vertical Filter Layout */}
              <div className="space-y-4">
                {/* Rating */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Rating
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['', '4.0', '4.5'].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(rating)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedRating === rating
                            ? theme === 'synesthesia'
                              ? 'bg-purple-500 text-white'
                              : 'bg-orange-500 text-white'
                            : theme === 'dark'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {rating ? `${rating}+ Stars` : 'Any Rating'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Distance */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Distance
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['', '3', '5', '10'].map(distance => (
                      <button
                        key={distance}
                        onClick={() => setSelectedDistance(distance)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedDistance === distance
                            ? theme === 'synesthesia'
                              ? 'bg-purple-500 text-white'
                              : 'bg-orange-500 text-white'
                            : theme === 'dark'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {distance ? `≤ ${distance}km` : 'Any Distance'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Price Range
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['', '$', '$$', '$$$', '$$$$'].map(price => (
                      <button
                        key={price}
                        onClick={() => setSelectedPriceRange(price)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedPriceRange === price
                            ? theme === 'synesthesia'
                              ? 'bg-purple-500 text-white'
                              : 'bg-orange-500 text-white'
                            : theme === 'dark'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {price || 'Any Price'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opening Status */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Opening Status
                  </label>
                  <div className="flex items-center gap-3">
                    <div 
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                        openNow
                          ? theme === 'synesthesia' ? 'bg-purple-500' : 'bg-orange-500'
                          : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                      onClick={() => setOpenNow(!openNow)}
                    >
                      <div 
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                          openNow ? 'left-7' : 'left-1'
                        }`}
                      ></div>
                    </div>
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Open Now
                    </span>
                  </div>
                </div>
              </div>

              {/* Go Button */}
              <button
                onClick={handleGoButtonClick}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-colors mt-4 ${
                  theme === 'synesthesia'
                    ? 'bg-purple-500 hover:bg-purple-600'
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                Go - Find Restaurants
              </button>
            </div>
          )}
        </div>

        {/* Google Map Integration */}
        <div className="mb-6">
          <GoogleMap 
            restaurants={filteredRestaurants}
            onRestaurantSelect={handleRestaurantSelect}
            userLocation={userLocation}
            onRestaurantsUpdate={handleRestaurantsUpdate}
          />
        </div>

        {/* Restaurant Results Header */}
        <div id="restaurant-results" className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Restaurants ({filteredRestaurants.length})
          </h3>
          <button
            onClick={handleSpinWheel}
            disabled={filteredRestaurants.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filteredRestaurants.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : theme === 'synesthesia'
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            <RotateCcw size={16} />
            Spin Wheel
          </button>
        </div>

        {/* Restaurant List - Single Column Table Style with Grey Borders */}
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              No restaurants found
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Try adjusting your filters or wait for the map to load nearby restaurants
            </p>
          </div>
        ) : (
          <>
            <div className={`rounded-xl overflow-hidden shadow-lg mb-8 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              {displayedRestaurants.map((restaurant, index) => (
                <div
                  key={restaurant.id}
                  onClick={() => handleRestaurantSelect(restaurant)}
                  className={`flex items-center p-4 cursor-pointer transition-colors hover:bg-opacity-50 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  } ${index !== displayedRestaurants.length - 1 ? 'border-b border-gray-300' : ''}`}
                >
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-16 h-16 rounded-lg object-cover mr-4"
                  />
                  
                  <div className="flex-1">
                    <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      {restaurant.name}
                    </h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {restaurant.cuisine} • {restaurant.distance}km • {getPriceLevelDisplay(restaurant.priceLevel)}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {restaurant.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 ${
                        restaurant.isOpen ? 'text-green-500' : 'text-red-500'
                      }`}>
                        <Clock size={14} />
                        <span className="text-sm">
                          {restaurant.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteToggle(restaurant);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      isFavourite(restaurant.id)
                        ? 'text-red-500'
                        : theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart size={18} fill={isFavourite(restaurant.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              ))}
            </div>

            {/* Show More / Show Less Button */}
            {filteredRestaurants.length > 10 && (
              <div className="text-center mb-8">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className={`flex items-center gap-2 mx-auto px-4 py-2 rounded-full text-sm transition-colors ${
                    theme === 'synesthesia'
                      ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{showMore ? 'Show Less' : `Show More (${filteredRestaurants.length - 10} more)`}</span>
                  {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            )}
          </>
        )}

        {/* Recommended Restaurants */}
        <div className="mb-8">
          <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Recommended for You
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRestaurants.slice(0, 3).map(restaurant => (
              <div
                key={`rec-${restaurant.id}`}
                onClick={() => handleRestaurantSelect(restaurant)}
                className={`rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        {restaurant.name}
                      </h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {restaurant.cuisine} • {getPriceLevelDisplay(restaurant.priceLevel)}
                      </p>
                    </div>
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
                      <Heart size={16} fill={isFavourite(restaurant.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Street Food */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Global Street Food
            </h3>
            <button
              onClick={handleStreetFoodRoulette}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                theme === 'synesthesia'
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              <Globe size={20} />
              Spin the Globe
            </button>
          </div>
          <div className={`p-6 rounded-xl text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <Globe size={48} className={`mx-auto mb-4 ${
              theme === 'synesthesia' ? 'text-purple-500' : 'text-orange-500'
            }`} />
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Discover street foods from around the world and learn to cook them!
            </p>
          </div>
        </div>

        {/* Trending Dishes */}
        <div>
          <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Trending Dishes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingDishes.map(dish => (
              <div
                key={dish.id}
                onClick={() => handleDishDetails(dish)}
                className={`rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="relative">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                    dish.badge === 'Viral' ? 'bg-red-500 text-white' :
                    dish.badge === 'Trending' ? 'bg-orange-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    <TrendingUp size={12} className="inline mr-1" />
                    {dish.badge}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {dish.name}
                  </h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {dish.restaurants} restaurants nearby
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Login Prompt Modal for Favorites */}
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

      {/* Normal Spinning Wheel Modal - Cross Icon Outside */}
      {showSpinWheel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" style={{ paddingBottom: '80px' }}>
          {/* Cross Icon - Outside the modal box */}
          <button
            onClick={closeSpinWheel}
            className="absolute top-8 right-8 z-20 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>

          <div className={`w-full max-w-md rounded-2xl overflow-hidden shadow-2xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            {isSpinning ? (
              <div className="p-8 text-center">
                {/* Simple spinning wheel without restaurant names */}
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <div className={`w-full h-full rounded-full border-8 animate-spin ${
                    theme === 'synesthesia' ? 'border-purple-500 border-t-purple-200' : 'border-orange-500 border-t-orange-200'
                  }`} style={{ animationDuration: '1s' }}>
                  </div>
                  {/* Center dot */}
                  <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${
                    theme === 'synesthesia' ? 'bg-purple-500' : 'bg-orange-500'
                  }`}></div>
                </div>
                <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  Spinning the wheel...
                </p>
              </div>
            ) : spinResult ? (
              <div className="p-6">
                <div className="text-center mb-4">
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    Your Random Pick!
                  </h3>
                </div>
                <img
                  src={spinResult.image}
                  alt={spinResult.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {spinResult.name}
                </h4>
                <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {spinResult.description}
                </p>
                <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  📍 {spinResult.address}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {spinResult.rating.toFixed(1)} rating
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSpinResult(null);
                      handleSpinWheel();
                    }}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    Spin Again
                  </button>
                  <button
                    onClick={() => {
                      closeSpinWheel();
                      handleRestaurantSelect(spinResult);
                    }}
                    className={`flex-1 py-2 rounded-lg font-medium text-white transition-colors ${
                      theme === 'synesthesia'
                        ? 'bg-purple-500 hover:bg-purple-600'
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    Let's Go
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Street Food Roulette Modal - Cross Icon Outside */}
      {showStreetFoodRoulette && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" style={{ paddingBottom: '80px' }}>
          {/* Cross Icon - Outside the modal box */}
          <button
            onClick={closeStreetFoodRoulette}
            className="absolute top-8 right-8 z-20 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>

          <div className={`w-full max-w-md rounded-2xl overflow-hidden shadow-2xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            {isGlobeSpinning ? (
              <div className="p-8 text-center">
                <Globe size={128} className={`mx-auto mb-4 animate-spin ${
                  theme === 'synesthesia' ? 'text-purple-500' : 'text-orange-500'
                }`} style={{ animationDuration: '2s' }} />
                <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  Spinning the globe...
                </p>
              </div>
            ) : streetFoodResult ? (
              <div className="p-6">
                <div className="text-center mb-4">
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    Street Food Discovery!
                  </h3>
                </div>
                <img
                  src={streetFoodResult.image}
                  alt={streetFoodResult.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {streetFoodResult.name}
                </h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                  {streetFoodResult.description}
                </p>
                <p className={`text-sm font-medium ${
                  theme === 'synesthesia' ? 'text-purple-500' : 'text-orange-500'
                }`}>
                  From: {streetFoodResult.origin}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      setStreetFoodResult(null);
                      handleStreetFoodRoulette();
                    }}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    Spin Again
                  </button>
                  <button
                    onClick={() => handleLearnRecipe(streetFoodResult)}
                    className={`flex-1 py-2 rounded-lg font-medium text-white transition-colors ${
                      theme === 'synesthesia'
                        ? 'bg-purple-500 hover:bg-purple-600'
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    Learn Recipe
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default Explore;