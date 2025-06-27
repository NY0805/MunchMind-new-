import React, { useState } from 'react';
import { Moon, PenLine, ChevronDown, Sparkles, Crown, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import CustomPaywall from './CustomPaywall';
import DreamMealResults from './DreamMealResults';

const DreamMealGenerator = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dreamInput, setDreamInput] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [generatedMeals, setGeneratedMeals] = useState<Array<{
    name: string;
    description: string;
    image: string;
  }>>([]);
  const { theme } = useTheme();
  const { isPro, isLoadingProStatus, checkProStatus, user, isAuthenticated } = useUser();
  const navigate = useNavigate();

  // Check if user is guest or not logged in - lock premium features
  const isGuest = !isAuthenticated || !user || user.is_guest;
  const hasAccess = !isGuest && isPro;

  const handleExpand = () => {
    if (isGuest) {
      // Show login prompt overlay instead of alert
      setShowLoginPrompt(true);
      return;
    }
    
    if (!hasAccess || isLoadingProStatus) {
      setShowPaywall(true);
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const generateDreamMeals = () => {
    if (!dreamInput.trim()) return;

    // Analyze the dream description for mood/theme
    const input = dreamInput.toLowerCase();
    let meals: Array<{ name: string; description: string; image: string; }> = [];

    if (input.includes('sea') || input.includes('ocean') || input.includes('beach')) {
      meals = [
        {
          name: 'Ocean Breeze Seafood Pasta',
          description: 'Delicate linguine with fresh clams and sea salt, capturing the essence of coastal dining',
          image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg'
        },
        {
          name: 'Sunset Grilled Fish Tacos',
          description: 'Warm corn tortillas with grilled mahi-mahi and tropical mango salsa',
          image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg'
        },
        {
          name: 'Seaside Coconut Rice Bowl',
          description: 'Fragrant coconut rice with grilled shrimp and seaweed salad',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
        }
      ];
    } else if (input.includes('cloud') || input.includes('float') || input.includes('sky')) {
      meals = [
        {
          name: 'Cloud Nine Soufflé',
          description: 'Light-as-air cheese soufflé that melts on your tongue like morning mist',
          image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg'
        },
        {
          name: 'Floating Island Dessert',
          description: 'Ethereal meringue islands floating on vanilla custard sea',
          image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg'
        },
        {
          name: 'Heavenly Cotton Candy Pancakes',
          description: 'Fluffy pancakes so light they seem to defy gravity, topped with whipped cream clouds',
          image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg'
        }
      ];
    } else if (input.includes('warm') || input.includes('cozy') || input.includes('comfort')) {
      meals = [
        {
          name: 'Grandmother\'s Embrace Stew',
          description: 'Hearty beef stew that wraps you in warmth with every spoonful',
          image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg'
        },
        {
          name: 'Cozy Fireplace Mac & Cheese',
          description: 'Creamy, golden mac and cheese with a crispy breadcrumb topping',
          image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg'
        },
        {
          name: 'Snuggle Weather Soup',
          description: 'Velvety tomato soup with grilled cheese croutons for the perfect comfort meal',
          image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg'
        }
      ];
    } else if (input.includes('magic') || input.includes('fantasy') || input.includes('enchant')) {
      meals = [
        {
          name: 'Enchanted Forest Mushroom Risotto',
          description: 'Mystical risotto with wild mushrooms that seem to glow with forest magic',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
        },
        {
          name: 'Fairy Tale Rainbow Salad',
          description: 'Colorful salad with edible flowers that sparkle like fairy dust',
          image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg'
        },
        {
          name: 'Wizard\'s Potion Smoothie Bowl',
          description: 'Purple smoothie bowl with magical toppings that change color as you eat',
          image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg'
        }
      ];
    } else {
      // Default creative meals
      meals = [
        {
          name: 'Dream Fusion Delight',
          description: 'A creative blend of flavors inspired by your unique vision',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
        },
        {
          name: 'Imagination Plate',
          description: 'Artfully crafted dish that brings your dreams to life',
          image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg'
        },
        {
          name: 'Whimsical Wonder Bowl',
          description: 'A playful combination of ingredients that dance on your palate',
          image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg'
        },
        {
          name: 'Dreamer\'s Special',
          description: 'A mysterious and delightful creation born from your imagination',
          image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg'
        }
      ];
    }

    setGeneratedMeals(meals);
    setShowResults(true);
  };

  const handlePaywallSuccess = async () => {
    setShowPaywall(false);
    await checkProStatus();
    setIsExpanded(true);
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  const isButtonDisabled = !dreamInput.trim();

  return (
    <>
      <div className={`rounded-lg overflow-hidden shadow-md ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div 
          className="flex justify-between items-center p-4 cursor-pointer"
          onClick={handleExpand}
        >
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-100'
            }`}>
              <Moon size={20} className="text-indigo-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  Dream Meal Generator
                </h3>
                {(!hasAccess || isGuest) && !isLoadingProStatus && <Crown size={16} className="text-amber-500" />}
                {isLoadingProStatus && (
                  <div className="w-3 h-3 border border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Turn your food dreams into real recipes
              </p>
            </div>
          </div>
          <ChevronDown 
            size={20} 
            className={`transition-transform ${
              isExpanded ? 'rotate-180' : ''
            } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} 
          />
        </div>
        
        {isExpanded && (
          <div className="p-4 pt-0">
            <div className={`p-3 rounded-lg mb-4 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-50'
            }`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-indigo-700'}`}>
                Describe a meal you dreamed about, or a fantasy dish you've imagined. Our AI will generate real recipes from your dream!
              </p>
            </div>
            
            <div className={`rounded-lg border ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className={`flex items-center p-2 border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <PenLine size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                <span className={`text-sm ml-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Describe your dream meal
                </span>
              </div>
              <textarea
                value={dreamInput}
                onChange={(e) => setDreamInput(e.target.value)}
                placeholder="Last night I dreamed of floating clouds that tasted like vanilla and cinnamon..."
                className={`w-full p-3 h-24 resize-none focus:outline-none ${
                  theme === 'dark' 
                    ? 'bg-gray-800 text-white placeholder-gray-500' 
                    : 'bg-white text-gray-800 placeholder-gray-400'
                }`}
              />
            </div>
            
            {isButtonDisabled && (
              <p className={`text-xs mt-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Please enter a dream description to generate meals
              </p>
            )}
            
            <button 
              onClick={generateDreamMeals}
              disabled={isButtonDisabled}
              className={`mt-4 w-full py-2 rounded-full flex items-center justify-center gap-2 transition-all duration-200 ${
                isButtonDisabled
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : theme === 'synesthesia'
                    ? 'bg-purple-500 hover:bg-purple-600 text-white transform hover:scale-105'
                    : 'bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-105'
              }`}
            >
              <Sparkles size={18} />
              <span>Generate Dream Meal</span>
            </button>
          </div>
        )}
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
              <Crown size={32} className="mx-auto mb-4 text-amber-500" />
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Premium Feature
              </h3>
              <p className={`text-sm mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Please log in to access Dream Meal Generator and other premium features.
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

      <CustomPaywall 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)}
        onSuccess={handlePaywallSuccess}
      />

      <DreamMealResults
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        meals={generatedMeals}
        dreamDescription={dreamInput}
      />
    </>
  );
};

export default DreamMealGenerator;