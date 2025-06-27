import React, { useState } from 'react';
import { TrendingUp, Heart, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useFavourites } from '../../context/FavouritesContext';
import { useUser } from '../../context/UserContext';

const trendingDishes = [
  {
    id: 1,
    name: 'Birria Tacos',
    origin: 'Mexico',
    trend: 'Up 85% this month',
    image: 'https://images.pexels.com/photos/5737242/pexels-photo-5737242.jpeg',
    description: 'Juicy, slow-cooked beef tacos with rich consommé for dipping',
    badge: 'Viral',
    calories: 450,
    allergens: ['Gluten', 'Dairy'],
    flavorProfile: 'Rich, savory beef with aromatic spices and a hint of acidity from lime',
    restaurants: 12,
    relatedRestaurants: [
      { name: 'Birria Bros', distance: '0.8 miles', rating: 4.9 },
      { name: 'Taco Consommé', distance: '1.5 miles', rating: 4.5 },
      { name: 'El Birrieria', distance: '2.3 miles', rating: 4.7 }
    ]
  },
  {
    id: 2,
    name: 'Dalgona Coffee',
    origin: 'South Korea',
    trend: 'Up 120% this month',
    image: 'https://images.pexels.com/photos/4790070/pexels-photo-4790070.jpeg',
    description: 'Whipped coffee foam over milk that became a social media sensation',
    badge: 'Trending',
    calories: 180,
    allergens: ['Dairy'],
    flavorProfile: 'Sweet and creamy with intense coffee notes and a cloud-like texture',
    restaurants: 8,
    relatedRestaurants: [
      { name: 'Whipped Dreams Café', distance: '0.3 miles', rating: 4.6 },
      { name: 'Cloud Nine Coffee', distance: '1.1 miles', rating: 4.8 },
      { name: 'Foam & Bubbles', distance: '1.7 miles', rating: 4.4 }
    ]
  },
  {
    id: 3,
    name: 'Baked Feta Pasta',
    origin: 'Finland',
    trend: 'Up 75% this month',
    image: 'https://images.pexels.com/photos/6541191/pexels-photo-6541191.jpeg',
    description: 'Simple pasta dish with baked feta cheese and cherry tomatoes',
    badge: 'Rising',
    calories: 520,
    allergens: ['Gluten', 'Dairy'],
    flavorProfile: 'Creamy, tangy feta with sweet roasted tomatoes and aromatic herbs',
    restaurants: 5,
    relatedRestaurants: [
      { name: 'Nordic Bites', distance: '1.2 miles', rating: 4.7 },
      { name: 'Pasta Paradise', distance: '0.9 miles', rating: 4.3 },
      { name: 'Tomato & Cheese', distance: '2.1 miles', rating: 4.5 }
    ]
  }
];

const TrendingDishes = () => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { theme } = useTheme();
  const { addToFavourites, removeFromFavourites, isFavourite } = useFavourites();
  const { user, isValidUser } = useUser();
  const navigate = useNavigate();

  // Disable background scrolling when modal is open
  React.useEffect(() => {
    if (showLoginPrompt) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showLoginPrompt]);

  const handleDishClick = (dish: any) => {
    navigate(`/trending-dish/${dish.id}`, { state: { dish } });
  };

  const handleFavoriteToggle = (e: React.MouseEvent, dish: any) => {
    e.stopPropagation();
    
    if (!isValidUser()) {
      setShowLoginPrompt(true);
      return;
    }

    const foodItem = {
      id: dish.id,
      name: dish.name,
      image: dish.image,
      description: dish.description,
      nutrition: `Trending dish from ${dish.origin}`,
      mood: 'neutral'
    };

    if (isFavourite(dish.id)) {
      removeFromFavourites(dish.id);
    } else {
      // Store restaurant name as location for trending dishes
      localStorage.setItem(`location_${dish.id}`, dish.origin);
      addToFavourites(foodItem);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trendingDishes.map((dish) => (
          <div 
            key={dish.id} 
            className={`rounded-lg overflow-hidden shadow-md cursor-pointer ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={() => handleDishClick(dish)}
          >
            <div className="relative h-48">
              <img 
                src={dish.image} 
                alt={dish.name} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={(e) => handleFavoriteToggle(e, dish)}
                className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
                  isFavourite(dish.id)
                    ? 'bg-red-500 text-white scale-110'
                    : 'bg-white/70 text-gray-600 hover:bg-white'
                }`}
              >
                <Heart size={18} fill={isFavourite(dish.id) ? "white" : "none"} />
              </button>
            </div>
            
            <div className="p-4">
              <h3 className={`font-semibold text-lg ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {dish.name}
              </h3>
              
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {dish.origin}
              </p>
              
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
                theme === 'synesthesia' ? 'text-purple-500' : 'text-orange-500'
              }`}>
                <TrendingUp size={14} />
                <span>{dish.trend}</span>
              </div>
            </div>
          </div>
        ))}
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

export default TrendingDishes;