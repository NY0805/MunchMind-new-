import React, { useState, useMemo } from 'react';
import MoodDetector from '../components/home/MoodDetector';
import FoodCard from '../components/home/FoodCard';
import FlavorWheel from '../components/home/FlavorWheel';
import FoodKarmaMeter from '../components/home/FoodKarmaMeter';
import RecentMealsCarousel from '../components/home/RecentMealsCarousel';
import SpinWheelModal from '../components/home/SpinWheelModal';
import ToonBites from '../components/home/ToonBites';
import CinematicCravings from '../components/home/CinematicCravings';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { getRandomFoodImage, categorizeFoodByName } from '../utils/foodImages';

const allFoodSuggestions = [
  {
    id: 1001, // Unique ID to avoid conflicts with other sections
    name: 'Creamy Pasta Primavera',
    description: 'A light pasta with fresh vegetables and creamy sauce.',
    nutrition: 'High in fiber, vitamins A and C',
    mood: 'happy',
    mealType: 'lunch',
    cookingTime: 'medium',
    flavour: 'savory'
  },
  {
    id: 1002,
    name: 'Spicy Thai Curry',
    description: 'Bold flavors with a spicy kick to energize your day.',
    nutrition: 'Rich in protein, antioxidants',
    mood: 'energetic',
    mealType: 'dinner',
    cookingTime: 'medium',
    flavour: 'spicy'
  },
  {
    id: 1003,
    name: 'Chocolate Avocado Pudding',
    description: 'Creamy, rich chocolate pudding made with avocados for a healthy twist.',
    nutrition: 'Good fats, antioxidants',
    mood: 'sad',
    mealType: 'dessert',
    cookingTime: 'quick',
    flavour: 'sweet'
  },
  {
    id: 1004,
    name: 'Mediterranean Bowl',
    description: 'Fresh vegetables, hummus, and grilled chicken in a balanced bowl.',
    nutrition: 'Balanced protein, fiber, and healthy fats',
    mood: 'neutral',
    mealType: 'lunch',
    cookingTime: 'quick',
    flavour: 'fresh'
  },
  {
    id: 1005,
    name: 'Quinoa Power Salad',
    description: 'Nutrient-packed salad with quinoa, nuts, and fresh greens.',
    nutrition: 'Complete protein, fiber, minerals',
    mood: 'energetic',
    mealType: 'lunch',
    cookingTime: 'quick',
    flavour: 'fresh'
  },
  {
    id: 1006,
    name: 'Comfort Mac & Cheese',
    description: 'Classic comfort food with a gourmet twist.',
    nutrition: 'Calcium, protein',
    mood: 'sad',
    mealType: 'dinner',
    cookingTime: 'medium',
    flavour: 'comfort'
  },
  {
    id: 1007,
    name: 'Green Smoothie Bowl',
    description: 'Refreshing blend of spinach, banana, and tropical fruits.',
    nutrition: 'Vitamins, minerals, antioxidants',
    mood: 'happy',
    mealType: 'breakfast',
    cookingTime: 'quick',
    flavour: 'fresh'
  },
  {
    id: 1008,
    name: 'Hearty Beef Stew',
    description: 'Warming stew perfect for cold days and comfort.',
    nutrition: 'Iron, protein, B vitamins',
    mood: 'sad',
    mealType: 'dinner',
    cookingTime: 'long',
    flavour: 'comfort'
  },
  {
    id: 1009,
    name: 'Energizing Acai Bowl',
    description: 'Antioxidant-rich acai with fresh berries and granola.',
    nutrition: 'Antioxidants, fiber, natural sugars',
    mood: 'energetic',
    mealType: 'breakfast',
    cookingTime: 'quick',
    flavour: 'sweet'
  },
  {
    id: 1010,
    name: 'Classic Caesar Salad',
    description: 'Crisp romaine with parmesan and homemade dressing.',
    nutrition: 'Calcium, vitamins A and K',
    mood: 'neutral',
    mealType: 'lunch',
    cookingTime: 'quick',
    flavour: 'savory'
  },
  {
    id: 1011,
    name: 'Teriyaki Salmon Bowl',
    description: 'Glazed salmon with steamed rice and vegetables.',
    nutrition: 'Omega-3, protein, vitamins',
    mood: 'happy',
    mealType: 'dinner',
    cookingTime: 'medium',
    flavour: 'savory'
  },
  {
    id: 1012,
    name: 'Spicy Ramen',
    description: 'Rich broth with noodles, egg, and vegetables.',
    nutrition: 'Protein, carbohydrates, vitamins',
    mood: 'energetic',
    mealType: 'dinner',
    cookingTime: 'medium',
    flavour: 'spicy'
  },
  {
    id: 1013,
    name: 'Chicken Tikka Masala',
    description: 'Creamy tomato curry with tender chicken pieces.',
    nutrition: 'Protein, antioxidants, spices',
    mood: 'neutral',
    mealType: 'dinner',
    cookingTime: 'medium',
    flavour: 'spicy'
  },
  {
    id: 1014,
    name: 'Veggie Stir Fry',
    description: 'Colorful vegetables tossed in savory sauce.',
    nutrition: 'Fiber, vitamins, minerals',
    mood: 'energetic',
    mealType: 'lunch',
    cookingTime: 'quick',
    flavour: 'fresh'
  },
  {
    id: 1015,
    name: 'Banana Pancakes',
    description: 'Fluffy pancakes with fresh banana slices.',
    nutrition: 'Carbohydrates, potassium, fiber',
    mood: 'happy',
    mealType: 'breakfast',
    cookingTime: 'medium',
    flavour: 'sweet'
  },
  {
    id: 1016,
    name: 'Mushroom Risotto',
    description: 'Creamy rice dish with wild mushrooms.',
    nutrition: 'Carbohydrates, protein, umami',
    mood: 'sad',
    mealType: 'dinner',
    cookingTime: 'long',
    flavour: 'comfort'
  }
];

// Creative "Surprise Me" meals for Pro users
const surpriseMeCreativeMeals = [
  {
    id: 2001, // Different ID range to avoid conflicts
    name: 'Rainbow Unicorn Bowl',
    description: 'Magical smoothie bowl with colorful superfoods and edible glitter.',
    nutrition: 'Antioxidants, vitamins, minerals, magic',
    mood: 'happy',
    mealType: 'breakfast',
    cookingTime: 'quick',
    flavour: 'sweet'
  },
  {
    id: 2002,
    name: 'Galaxy Pasta',
    description: 'Black squid ink pasta with edible stars and cosmic flavors.',
    nutrition: 'Protein, iron, unique flavors',
    mood: 'energetic',
    mealType: 'dinner',
    cookingTime: 'medium',
    flavour: 'savory'
  },
  {
    id: 2003,
    name: 'Cloud Eggs Benedict',
    description: 'Fluffy whipped egg whites with golden yolk center floating on toast.',
    nutrition: 'High protein, vitamins, ethereal essence',
    mood: 'neutral',
    mealType: 'breakfast',
    cookingTime: 'medium',
    flavour: 'savory'
  },
  {
    id: 2004,
    name: 'Levitating Latte',
    description: 'Coffee that defies gravity with molecular gastronomy magic.',
    nutrition: 'Caffeine, antioxidants, wonder',
    mood: 'energetic',
    mealType: 'snack',
    cookingTime: 'quick',
    flavour: 'sweet'
  },
  {
    id: 2005,
    name: 'Dragon Fruit Sushi',
    description: 'Vibrant pink dragon fruit wrapped in nori with exotic fillings.',
    nutrition: 'Vitamin C, fiber, mystical properties',
    mood: 'happy',
    mealType: 'lunch',
    cookingTime: 'medium',
    flavour: 'fresh'
  },
  {
    id: 2006,
    name: 'Mermaid Toast',
    description: 'Iridescent blue spirulina toast topped with pearl-like chia seeds.',
    nutrition: 'Omega-3, protein, ocean vibes',
    mood: 'neutral',
    mealType: 'breakfast',
    cookingTime: 'quick',
    flavour: 'fresh'
  },
  {
    id: 2007,
    name: 'Phoenix Fire Curry',
    description: 'Spicy curry that changes color as you eat, with heat that builds and fades.',
    nutrition: 'Capsaicin, antioxidants, rebirth energy',
    mood: 'energetic',
    mealType: 'dinner',
    cookingTime: 'long',
    flavour: 'spicy'
  },
  {
    id: 2008,
    name: 'Fairy Garden Salad',
    description: 'Miniature vegetables and edible flowers arranged like a magical garden.',
    nutrition: 'Micronutrients, fiber, enchantment',
    mood: 'happy',
    mealType: 'lunch',
    cookingTime: 'quick',
    flavour: 'fresh'
  }
];

const Home = () => {
  const [currentMood, setCurrentMood] = useState('neutral');
  const [showSpinModal, setShowSpinModal] = useState(false);
  const [suggestions, setSuggestions] = useState(allFoodSuggestions.slice(0, 4));
  const [karmaPoints, setKarmaPoints] = useState(65);
  const [lastFilters, setLastFilters] = useState<any>(null);
  const [showNoFoodMessage, setShowNoFoodMessage] = useState(false);
  const { theme } = useTheme();
  const { dietaryPreferences, user, isAuthenticated } = useUser();

  // Check if user is guest or not logged in
  const isGuest = !isAuthenticated || !user || user.is_guest;
  const displayKarmaPoints = isGuest ? 0 : karmaPoints;

  // Add images to suggestions
  const suggestionsWithImages = suggestions.map(food => ({
    ...food,
    image: getRandomFoodImage(categorizeFoodByName(food.name))
  }));

  // Filter suggestions based on mood and dietary preferences
  const filteredSuggestions = useMemo(() => {
    let filtered = allFoodSuggestions.filter(food => {
      // Filter by mood
      const moodMatch = food.mood === currentMood || food.mood === 'neutral';
      
      // Filter by dietary preferences
      const dietMatch = !dietaryPreferences.dislikes.some(dislike => 
        food.name.toLowerCase().includes(dislike.toLowerCase()) ||
        food.description.toLowerCase().includes(dislike.toLowerCase())
      );
      
      return moodMatch && dietMatch;
    });

    return filtered.length > 0 ? filtered.slice(0, 4) : allFoodSuggestions.slice(0, 4);
  }, [currentMood, dietaryPreferences]);

  const handleMoodChange = (mood: string) => {
    setCurrentMood(mood);
    const newSuggestions = filteredSuggestions.map(food => ({
      ...food,
      image: getRandomFoodImage(categorizeFoodByName(food.name))
    }));
    setSuggestions(newSuggestions);
    setShowNoFoodMessage(false);
  };

  const handleSpinWheel = (filters: any) => {
    setLastFilters(filters);
    let newSuggestions = [];
    
    if (filters.surpriseMe) {
      // Use creative, premium suggestions for Pro users
      newSuggestions = [...surpriseMeCreativeMeals]
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
    } else {
      // Filter by regular criteria
      let filtered = [...allFoodSuggestions];
      
      if (filters.mealType) {
        filtered = filtered.filter(food => 
          food.mealType === filters.mealType
        );
      }
      
      if (filters.cookingTime) {
        filtered = filtered.filter(food => 
          food.cookingTime === filters.cookingTime
        );
      }
      
      if (filters.flavour) {
        filtered = filtered.filter(food => 
          food.flavour === filters.flavour
        );
      }
      
      // Check if any food matches the filters
      if (filtered.length === 0) {
        // No food available, show message and display previous suggestions
        setShowNoFoodMessage(true);
        setTimeout(() => {
          setShowNoFoodMessage(false);
          // Display the food before filtering
          const previousSuggestions = suggestions.length > 0 ? suggestions : allFoodSuggestions.slice(0, 4);
          setSuggestions(previousSuggestions);
        }, 3000);
        return;
      }
      
      // Randomize and take first 4
      newSuggestions = filtered
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
    }
    
    // Add images to new suggestions
    const suggestionsWithImages = newSuggestions.map(food => ({
      ...food,
      image: getRandomFoodImage(categorizeFoodByName(food.name))
    }));
    
    setSuggestions(suggestionsWithImages);
    setShowNoFoodMessage(false);
  };

  return (
    <div className="responsive-container py-6">
      <h1 className={`responsive-title mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        Food Mood
      </h1>
      
      <div className="responsive-section">
        <MoodDetector onMoodChange={handleMoodChange} currentMood={currentMood} />
      </div>
      
      <section className="responsive-section">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`responsive-subtitle ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
            Flavor Mood Sync
          </h2>
          <button 
            onClick={() => setShowSpinModal(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors text-sm ${
              theme === 'synesthesia'
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            <FlavorWheel />
            <span>Spin Flavor Wheel</span>
          </button>
        </div>
        
        {/* No Food Available Message */}
        {showNoFoodMessage && (
          <div className={`mb-4 p-4 rounded-lg text-center ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } shadow-md`}>
            <h3 className={`font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              No Food Available
            </h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              No food matches your current filters. Showing previous suggestions...
            </p>
          </div>
        )}
        
        <div className="responsive-grid-4">
          {suggestionsWithImages.map(food => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      <div className="responsive-section">
        <ToonBites />
      </div>
      
      <div className="responsive-section">
        <CinematicCravings />
      </div>
      
      <section className="responsive-section">
        <h2 className={`responsive-subtitle mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
          Food Karma Meter
        </h2>
        <FoodKarmaMeter points={displayKarmaPoints} />
      </section>
      
      <section className="responsive-section">
        <h2 className={`responsive-subtitle mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
          Recent Meals
        </h2>
        <RecentMealsCarousel />
      </section>

      <SpinWheelModal
        isOpen={showSpinModal}
        onClose={() => setShowSpinModal(false)}
        onSpin={handleSpinWheel}
      />
    </div>
  );
};

export default Home;