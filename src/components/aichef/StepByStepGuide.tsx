import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, AlarmClock, Heart, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useFavourites } from '../../context/FavouritesContext';
import { useUser } from '../../context/UserContext';
import { supabase } from '../../lib/supabase';

interface Recipe {
  id: number;
  name: string;
  image: string;
  time: string;
  difficulty: string;
  ingredients: string[];
  steps: string[];
}

interface StepByStepGuideProps {
  recipe: Recipe;
}

const StepByStepGuide: React.FC<StepByStepGuideProps> = ({ recipe }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { theme } = useTheme();
  const { addToFavourites, removeFromFavourites, isFavourite } = useFavourites();
  const { user, isAuthenticated, isValidUser } = useUser();
  const navigate = useNavigate();
  
  // Set timer based on recipe time
  useEffect(() => {
    const timeMatch = recipe.time.match(/(\d+)/);
    if (timeMatch) {
      const minutes = parseInt(timeMatch[1]);
      setTimerSeconds(minutes * 60);
    }
  }, [recipe.time]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

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
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const startTimer = () => {
    setTimerRunning(true);
  };
  
  const pauseTimer = () => {
    setTimerRunning(false);
  };
  
  const resetTimer = () => {
    setTimerRunning(false);
    const timeMatch = recipe.time.match(/(\d+)/);
    if (timeMatch) {
      const minutes = parseInt(timeMatch[1]);
      setTimerSeconds(minutes * 60);
    }
  };
  
  const nextStep = async () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === recipe.steps.length - 1) {
      // Recipe completed - save to database
      await saveRecipeCompletion();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveRecipeCompletion = async () => {
    if (isValidUser()) {
      try {
        await supabase
          .from('recipes')
          .insert({
            user_id: user.id,
            recipe_id: recipe.id,
            recipe_name: recipe.name,
            difficulty: recipe.difficulty,
            tried_at: new Date().toISOString()
          });
        console.log('Recipe completion saved to database');
      } catch (error) {
        console.error('Failed to save recipe completion:', error);
      }
    }
  };

  const handleFavoriteToggle = () => {
    if (!isValidUser()) {
      setShowLoginPrompt(true);
      return;
    }

    const foodItem = {
      id: recipe.id,
      name: recipe.name,
      image: recipe.image,
      description: `${recipe.difficulty} recipe that takes ${recipe.time}`,
      nutrition: 'Recipe nutrition varies by ingredients',
      mood: 'creative'
    };

    if (isFavourite(recipe.id)) {
      removeFromFavourites(recipe.id);
    } else {
      // Store location as "AI Chef Recipe" for recipes
      localStorage.setItem(`location_${recipe.id}`, 'AI Chef Recipe');
      addToFavourites(foodItem);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  return (
    <>
      {/* Fixed Timer Display */}
      {timerRunning && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
          theme === 'synesthesia'
            ? 'bg-purple-500 text-white'
            : 'bg-orange-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            <AlarmClock size={16} />
            <span className="font-mono text-lg">{formatTime(timerSeconds)}</span>
          </div>
        </div>
      )}

      <div className={`rounded-lg overflow-hidden shadow-md ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="relative h-48 md:h-64">
          <img 
            src={recipe.image} 
            alt={recipe.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-white">{recipe.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-white/90">
                    <AlarmClock size={16} />
                    <span>{recipe.time}</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                    recipe.difficulty === 'Easy' 
                      ? 'bg-green-500/20 text-green-300' 
                      : recipe.difficulty === 'Medium'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-red-500/20 text-red-300'
                  }`}>
                    {recipe.difficulty}
                  </div>
                </div>
              </div>
              
              {/* Favorite Button - Same style as Restaurant Details */}
              <button
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isFavourite(recipe.id)
                    ? 'bg-red-500 text-white scale-110'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart size={18} fill={isFavourite(recipe.id) ? "white" : "none"} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <h3 className={`font-semibold text-lg mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Ingredients
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li 
                  key={index} 
                  className={`flex items-center gap-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    theme === 'synesthesia' ? 'bg-purple-500' : 'bg-orange-500'
                  }`}></div>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className={`font-semibold text-lg mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Step {currentStep + 1} of {recipe.steps.length}
            </h3>
            
            <div className={`p-4 rounded-lg mb-4 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-orange-50'
            }`}>
              <p className={theme === 'dark' ? 'text-white' : 'text-gray-700'}>
                {recipe.steps[currentStep]}
              </p>
            </div>
            
            <div className="flex justify-between mb-6">
              <button 
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded ${
                  currentStep === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors`}
              >
                Previous
              </button>
              
              <button 
                onClick={nextStep}
                className={`px-4 py-2 rounded ${
                  theme === 'synesthesia'
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                } transition-colors`}
              >
                {currentStep === recipe.steps.length - 1 ? 'Complete Recipe' : 'Next'}
              </button>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-700'
                }`}>
                  Cooking Timer
                </h4>
                <div className={`text-xl font-mono ${
                  timerRunning 
                    ? theme === 'synesthesia' ? 'text-purple-400' : 'text-orange-500'
                    : theme === 'dark' ? 'text-white' : 'text-gray-700'
                }`}>
                  {formatTime(timerSeconds)}
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                {!timerRunning ? (
                  <button 
                    onClick={startTimer}
                    className={`p-3 rounded-full ${
                      theme === 'synesthesia'
                        ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        : theme === 'dark'
                          ? 'bg-gray-600 text-green-400 hover:bg-gray-500'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                    } transition-colors`}
                  >
                    <Play size={20} />
                  </button>
                ) : (
                  <button 
                    onClick={pauseTimer}
                    className={`p-3 rounded-full ${
                      theme === 'synesthesia'
                        ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        : theme === 'dark'
                          ? 'bg-gray-600 text-orange-400 hover:bg-gray-500'
                          : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    } transition-colors`}
                  >
                    <Pause size={20} />
                  </button>
                )}
                
                <button 
                  onClick={resetTimer}
                  className={`p-3 rounded-full ${
                    theme === 'dark'
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  } transition-colors`}
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
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
                Please log in to save your favourite recipes and sync across devices.
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

export default StepByStepGuide;