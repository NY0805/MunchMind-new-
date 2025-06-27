import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const recentMeals = [
  {
    id: 1,
    name: 'Quinoa Bowl',
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    date: '2 days ago',
    recipe: {
      id: 1,
      name: 'Mediterranean Quinoa Bowl',
      image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
      time: '30 min',
      difficulty: 'Medium',
      ingredients: ['1 cup quinoa', 'Cherry tomatoes', 'Cucumber', 'Feta cheese', 'Olive oil', 'Lemon juice'],
      steps: ['Cook quinoa according to package instructions', 'Let quinoa cool completely', 'Dice tomatoes and cucumber', 'Crumble feta cheese', 'Mix all ingredients with olive oil and lemon juice', 'Season with salt and pepper']
    }
  },
  {
    id: 2,
    name: 'Grilled Salmon',
    image: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg',
    date: '3 days ago',
    recipe: {
      id: 2,
      name: 'Herb-Crusted Grilled Salmon',
      image: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg',
      time: '25 min',
      difficulty: 'Medium',
      ingredients: ['4 salmon fillets', 'Fresh herbs', 'Lemon', 'Olive oil', 'Garlic', 'Salt and pepper'],
      steps: ['Preheat grill to medium-high heat', 'Mix herbs, garlic, and olive oil', 'Season salmon with salt and pepper', 'Brush with herb mixture', 'Grill for 4-5 minutes per side', 'Serve with lemon wedges']
    }
  },
  {
    id: 3,
    name: 'Avocado Toast',
    image: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg',
    date: '5 days ago',
    recipe: {
      id: 3,
      name: 'Gourmet Avocado Toast',
      image: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg',
      time: '10 min',
      difficulty: 'Easy',
      ingredients: ['2 slices sourdough bread', '1 ripe avocado', 'Cherry tomatoes', 'Feta cheese', 'Balsamic glaze', 'Everything bagel seasoning'],
      steps: ['Toast bread until golden brown', 'Mash avocado with salt and pepper', 'Spread avocado on toast', 'Top with sliced tomatoes and feta', 'Drizzle with balsamic glaze', 'Sprinkle with everything seasoning']
    }
  },
  {
    id: 4,
    name: 'Vegetable Curry',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
    date: 'Last week',
    recipe: {
      id: 4,
      name: 'Coconut Vegetable Curry',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
      time: '35 min',
      difficulty: 'Medium',
      ingredients: ['Mixed vegetables', 'Coconut milk', 'Curry paste', 'Onion', 'Garlic', 'Ginger', 'Rice'],
      steps: ['Sauté onion, garlic, and ginger', 'Add curry paste and cook until fragrant', 'Add vegetables and coconut milk', 'Simmer until vegetables are tender', 'Season with salt and pepper', 'Serve over rice']
    }
  }
];

const RecentMealsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const next = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === recentMeals.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? recentMeals.length - 1 : prevIndex - 1
    );
  };

  const handleMealClick = () => {
    const selectedMeal = recentMeals[activeIndex];
    // Store the recipe in sessionStorage to load in AI Chef
    sessionStorage.setItem('selectedRecipe', JSON.stringify(selectedMeal.recipe));
    navigate('/ai-chef?loadRecipe=true');
  };

  return (
    <div className={`relative rounded-lg overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-md`}>
      <div className="relative h-48 sm:h-56">
        <div 
          className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {recentMeals.map((meal) => (
            <div 
              key={meal.id} 
              className="min-w-full h-full relative cursor-pointer"
              onClick={handleMealClick}
            >
              <img 
                src={meal.image} 
                alt={meal.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                <h3 className="font-semibold text-base sm:text-lg">{meal.name}</h3>
                <span className="text-sm opacity-80">{meal.date}</span>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={prev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white text-gray-800 focus:outline-none z-10"
        >
          <ChevronLeft size={18} />
        </button>
        
        <button 
          onClick={next}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white text-gray-800 focus:outline-none z-10"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      
      <div className="flex justify-center gap-1 p-2">
        {recentMeals.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === activeIndex 
                ? theme === 'synesthesia' ? 'bg-purple-500' : 'bg-orange-500'
                : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default RecentMealsCarousel;