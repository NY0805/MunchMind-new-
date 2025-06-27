import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Utensils, Info, Flame } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabase';

// Mock restaurant data that matches the restaurant names in trending dishes
const mockRestaurants = [
  {
    id: 101,
    name: "Seoul Street Food",
    cuisine: "Korean",
    rating: 4.8,
    distance: 0.5,
    isOpen: true,
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
    description: "Authentic Korean street food and modern Korean cuisine",
    address: "456 K-Town Avenue, Korean District",
    phone: "+1 (555) 789-0123",
    coordinates: { lat: 40.7505, lng: -73.9934 },
    priceLevel: 2,
    specialDish: "Korean Corn Dogs",
    menu: [
      { name: "Korean Corn Dogs", price: 8, calories: 450, description: "Crispy Korean-style corn dogs with various coatings" },
      { name: "Kimchi Fried Rice", price: 12, calories: 380, description: "Spicy kimchi fried rice with egg and vegetables" },
      { name: "Korean BBQ Tacos", price: 14, calories: 520, description: "Fusion tacos with Korean BBQ beef" }
    ],
    reviews: [
      { author: "Jenny K.", rating: 5, text: "Best Korean corn dogs in the city! So crispy and delicious.", date: "1 day ago" },
      { author: "Mike L.", rating: 5, text: "Authentic Korean flavors, feels like Seoul!", date: "3 days ago" }
    ]
  },
  {
    id: 102,
    name: "K-Dog Palace",
    cuisine: "Korean",
    rating: 4.6,
    distance: 1.2,
    isOpen: true,
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
    description: "Specialized Korean corn dog restaurant with creative variations",
    address: "789 Seoul Street, Downtown",
    phone: "+1 (555) 890-1234",
    coordinates: { lat: 40.7282, lng: -74.0776 },
    priceLevel: 2,
    specialDish: "Mozzarella Corn Dogs",
    menu: [
      { name: "Mozzarella Corn Dogs", price: 9, calories: 480, description: "Corn dogs filled with stretchy mozzarella cheese" },
      { name: "Potato Corn Dogs", price: 10, calories: 520, description: "Corn dogs coated with crispy potato cubes" },
      { name: "Squid Corn Dogs", price: 11, calories: 450, description: "Unique corn dogs with squid filling" }
    ],
    reviews: [
      { author: "Sarah P.", rating: 4, text: "Creative corn dog variations! The mozzarella one is amazing.", date: "2 days ago" },
      { author: "David R.", rating: 5, text: "Instagram-worthy food that actually tastes great too.", date: "1 week ago" }
    ]
  },
  {
    id: 103,
    name: "Gangnam Bites",
    cuisine: "Korean",
    rating: 4.7,
    distance: 2.1,
    isOpen: false,
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
    description: "Upscale Korean dining with traditional and modern dishes",
    address: "321 Gangnam Plaza, Uptown",
    phone: "+1 (555) 901-2345",
    coordinates: { lat: 40.7614, lng: -73.9776 },
    priceLevel: 3,
    specialDish: "Premium Korean Corn Dogs",
    menu: [
      { name: "Premium Korean Corn Dogs", price: 15, calories: 580, description: "Gourmet corn dogs with premium ingredients" },
      { name: "Korean Fried Chicken", price: 18, calories: 650, description: "Crispy Korean fried chicken with special sauce" },
      { name: "Bulgogi Bowl", price: 16, calories: 520, description: "Marinated beef bulgogi over rice" }
    ],
    reviews: [
      { author: "Lisa M.", rating: 5, text: "Upscale Korean food with excellent presentation.", date: "4 days ago" },
      { author: "Tom W.", rating: 4, text: "Great atmosphere and authentic Korean flavors.", date: "1 week ago" }
    ]
  },
  {
    id: 104,
    name: "Birria Bros",
    cuisine: "Mexican",
    rating: 4.9,
    distance: 0.8,
    isOpen: true,
    image: "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg",
    description: "Authentic Mexican birria tacos and traditional dishes",
    address: "123 Taco Street, Mexican Quarter",
    phone: "+1 (555) 234-5678",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    priceLevel: 2,
    specialDish: "Birria Tacos",
    menu: [
      { name: "Birria Tacos", price: 12, calories: 380, description: "Traditional birria beef tacos with consommé" },
      { name: "Quesabirria", price: 14, calories: 450, description: "Cheesy birria quesadilla with dipping broth" },
      { name: "Birria Ramen", price: 16, calories: 520, description: "Fusion ramen with birria broth and beef" }
    ],
    reviews: [
      { author: "Carlos R.", rating: 5, text: "Best birria in the city! Authentic Mexican flavors.", date: "1 day ago" },
      { author: "Maria S.", rating: 5, text: "The consommé is incredible, so rich and flavorful.", date: "2 days ago" }
    ]
  },
  {
    id: 105,
    name: "Taco Consommé",
    cuisine: "Mexican",
    rating: 4.5,
    distance: 1.5,
    isOpen: true,
    image: "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg",
    description: "Specialized birria restaurant with various birria dishes",
    address: "456 Birria Boulevard, Taco Town",
    phone: "+1 (555) 345-6789",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    priceLevel: 2,
    specialDish: "Birria Consommé",
    menu: [
      { name: "Classic Birria Tacos", price: 10, calories: 350, description: "Traditional birria tacos with rich broth" },
      { name: "Birria Pizza", price: 18, calories: 580, description: "Fusion pizza topped with birria beef" },
      { name: "Birria Burrito", price: 15, calories: 620, description: "Large burrito filled with birria and cheese" }
    ],
    reviews: [
      { author: "Jose M.", rating: 4, text: "Great birria, though not as authentic as some places.", date: "3 days ago" },
      { author: "Ana L.", rating: 5, text: "Love the birria pizza - so creative and delicious!", date: "5 days ago" }
    ]
  },
  {
    id: 106,
    name: "El Birrieria",
    cuisine: "Mexican",
    rating: 4.7,
    distance: 2.3,
    isOpen: true,
    image: "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg",
    description: "Family-owned birria restaurant with traditional recipes",
    address: "789 Heritage Lane, Old Town",
    phone: "+1 (555) 456-7890",
    coordinates: { lat: 40.7505, lng: -73.9934 },
    priceLevel: 2,
    specialDish: "Abuela's Birria",
    menu: [
      { name: "Abuela's Birria Tacos", price: 11, calories: 380, description: "Family recipe birria tacos passed down generations" },
      { name: "Birria Torta", price: 13, calories: 480, description: "Mexican sandwich with birria beef and fixings" },
      { name: "Birria Soup", price: 9, calories: 320, description: "Pure birria consommé with tender beef pieces" }
    ],
    reviews: [
      { author: "Roberto F.", rating: 5, text: "Authentic family recipes, tastes like home!", date: "2 days ago" },
      { author: "Elena G.", rating: 4, text: "Traditional birria done right, very flavorful.", date: "1 week ago" }
    ]
  },
  {
    id: 107,
    name: "Whipped Dreams Café",
    cuisine: "Coffee & Desserts",
    rating: 4.6,
    distance: 0.3,
    isOpen: true,
    image: "https://images.pexels.com/photos/4790070/pexels-photo-4790070.jpeg",
    description: "Specialty coffee shop famous for whipped coffee creations",
    address: "123 Coffee Lane, Café District",
    phone: "+1 (555) 567-8901",
    coordinates: { lat: 40.7282, lng: -74.0776 },
    priceLevel: 2,
    specialDish: "Dalgona Coffee",
    menu: [
      { name: "Classic Dalgona Coffee", price: 6, calories: 120, description: "Original whipped coffee with milk" },
      { name: "Chocolate Dalgona", price: 7, calories: 150, description: "Chocolate version of whipped coffee" },
      { name: "Matcha Dalgona", price: 8, calories: 140, description: "Green tea whipped coffee variation" }
    ],
    reviews: [
      { author: "Emma T.", rating: 5, text: "Perfect dalgona coffee! So Instagram-worthy and delicious.", date: "1 day ago" },
      { author: "Alex K.", rating: 4, text: "Great coffee and cozy atmosphere for working.", date: "3 days ago" }
    ]
  },
  {
    id: 108,
    name: "Cloud Nine Coffee",
    cuisine: "Coffee & Desserts",
    rating: 4.8,
    distance: 1.1,
    isOpen: true,
    image: "https://images.pexels.com/photos/4790070/pexels-photo-4790070.jpeg",
    description: "Artisan coffee roastery with creative coffee drinks",
    address: "456 Roast Avenue, Bean Town",
    phone: "+1 (555) 678-9012",
    coordinates: { lat: 40.7614, lng: -73.9776 },
    priceLevel: 3,
    specialDish: "Cloud Dalgona",
    menu: [
      { name: "Cloud Dalgona Latte", price: 8, calories: 160, description: "Premium dalgona with single-origin coffee" },
      { name: "Iced Dalgona Frappe", price: 9, calories: 180, description: "Refreshing iced version with whipped cream" },
      { name: "Dalgona Affogato", price: 10, calories: 200, description: "Dalgona coffee poured over vanilla ice cream" }
    ],
    reviews: [
      { author: "Coffee_Lover23", rating: 5, text: "Best coffee in town! The cloud dalgona is heavenly.", date: "2 days ago" },
      { author: "Barista_Pro", rating: 5, text: "Excellent coffee quality and perfect foam texture.", date: "4 days ago" }
    ]
  },
  {
    id: 109,
    name: "Foam & Bubbles",
    cuisine: "Coffee & Desserts",
    rating: 4.4,
    distance: 1.7,
    isOpen: false,
    image: "https://images.pexels.com/photos/4790070/pexels-photo-4790070.jpeg",
    description: "Trendy café specializing in foam art and bubble drinks",
    address: "789 Foam Street, Trendy District",
    phone: "+1 (555) 789-0123",
    coordinates: { lat: 40.7505, lng: -73.9934 },
    priceLevel: 2,
    specialDish: "Bubble Dalgona",
    menu: [
      { name: "Bubble Dalgona Tea", price: 7, calories: 180, description: "Dalgona coffee with tapioca pearls" },
      { name: "Foam Art Dalgona", price: 9, calories: 140, description: "Artistic dalgona with custom foam designs" },
      { name: "Dalgona Smoothie", price: 8, calories: 220, description: "Blended dalgona coffee smoothie" }
    ],
    reviews: [
      { author: "Trendy_Foodie", rating: 4, text: "Fun atmosphere and creative drinks, though a bit pricey.", date: "5 days ago" },
      { author: "Bubble_Fan", rating: 5, text: "Love the bubble dalgona! So unique and tasty.", date: "1 week ago" }
    ]
  }
];

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
    // Save recipe completion to database
    await saveRecipeCompletion();

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

  const handleViewMenu = (restaurantName: string) => {
    // Find the exact restaurant by name from our comprehensive mock data
    const restaurant = mockRestaurants.find(r => r.name === restaurantName);
    
    if (restaurant) {
      // Navigate to the specific restaurant details page
      navigate(`/restaurant/${restaurant.id}`, { state: { restaurant } });
    } else {
      // If restaurant not found, show error or fallback
      console.error(`Restaurant "${restaurantName}" not found in mock data`);
      alert(`Restaurant "${restaurantName}" details not available. Please try another restaurant.`);
    }
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
              <span>{dish.restaurants} restaurants nearby</span>
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

        {/* Related Restaurants */}
        {/* <div className={`rounded-xl mb-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg overflow-hidden`}>
          <div className="p-6">
            <h2 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Restaurants Serving This Dish
            </h2>
            
            <div className="space-y-4">
              {dish.relatedRestaurants.map((restaurant: any, index: number) => (
                <div key={index} className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>
                        {restaurant.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-gray-500" />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {restaurant.distance} away
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {restaurant.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleViewMenu(restaurant.name)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        theme === 'synesthesia'
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      }`}
                    >
                      View Menu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

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