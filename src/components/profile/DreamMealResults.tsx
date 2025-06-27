import React, { useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useFavourites } from '../../context/FavouritesContext';

interface DreamMeal {
  name: string;
  description: string;
  image: string;
}

interface DreamMealResultsProps {
  isOpen: boolean;
  onClose: () => void;
  meals: DreamMeal[];
  dreamDescription: string;
}

const DreamMealResults: React.FC<DreamMealResultsProps> = ({
  isOpen,
  onClose,
  meals,
  dreamDescription
}) => {
  const { theme } = useTheme();
  const { addToFavourites } = useFavourites();

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGetRecipe = (meal: DreamMeal, index: number) => {
    // Create a dream meal with location as "-"
    const dreamMealWithData = {
      id: Date.now() + index,
      name: meal.name,
      image: meal.image,
      description: meal.description,
      nutrition: 'Dream-inspired nutrition',
      mood: 'creative'
    };

    // Store location as "-" for Dream Food Generator items
    localStorage.setItem(`location_${dreamMealWithData.id}`, '-');
    
    addToFavourites(dreamMealWithData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-content modal-large animate-modal-in ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 ${
          theme === 'synesthesia'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
            : 'bg-gradient-to-r from-indigo-500 to-purple-500'
        } text-white`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <Sparkles size={24} />
            <div>
              <h2 className="text-xl font-bold">Your Dream Meals</h2>
              <p className="text-white/90 text-sm">Inspired by: "{dreamDescription}"</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meals.map((meal, index) => (
              <div key={index} className={`rounded-lg overflow-hidden shadow-md ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className={`font-semibold text-lg mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {meal.name}
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {meal.description}
                  </p>
                  <button 
                    onClick={() => handleGetRecipe(meal, index)}
                    className={`mt-3 px-4 py-2 rounded-full text-sm font-medium ${
                      theme === 'synesthesia'
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        : theme === 'dark'
                          ? 'bg-gray-600 text-white hover:bg-gray-500'
                          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    } transition-colors`}
                  >
                    Get Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={onClose}
              className={`px-6 py-3 rounded-full font-medium ${
                theme === 'synesthesia'
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              } transition-colors`}
            >
              Create Another Dream
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamMealResults;