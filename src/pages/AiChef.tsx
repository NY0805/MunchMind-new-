import React, { useState, useEffect } from 'react';
import KitchenInventory from '../components/aichef/KitchenInventory';
import RecipeSuggestions from '../components/aichef/RecipeSuggestions';
import StepByStepGuide from '../components/aichef/StepByStepGuide';
import VirtualTastePreview from '../components/aichef/VirtualTastePreview';
import LiveChatAssistant from '../components/aichef/LiveChatAssistant';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from 'react-router-dom';

const AiChef = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<null | {
    id: number;
    name: string;
    image: string;
    time: string;
    difficulty: string;
    ingredients: string[];
    steps: string[];
  }>(null);
  const { theme } = useTheme();
  const location = useLocation();

  const handleSelectRecipe = (recipe: any) => {
    setSelectedRecipe(recipe);
    // Scroll to recipe section
    setTimeout(() => {
      const recipeSection = document.getElementById('recipe-section');
      if (recipeSection) {
        recipeSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Load recipe from sessionStorage or URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('loadRecipe') === 'true') {
      const storedRecipe = sessionStorage.getItem('selectedRecipe');
      if (storedRecipe) {
        const recipe = JSON.parse(storedRecipe);
        setSelectedRecipe(recipe);
        sessionStorage.removeItem('selectedRecipe');
        
        // Scroll to recipe section
        setTimeout(() => {
          const recipeSection = document.getElementById('recipe-section');
          if (recipeSection) {
            recipeSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    }
  }, [location]);

  return (
    <div className="responsive-container py-6">
      <h1 className={`responsive-title mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        AI Chef
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-1 space-y-4">
          <KitchenInventory />
          <RecipeSuggestions onSelectRecipe={handleSelectRecipe} />
        </div>
        
        <div className="lg:col-span-2" id="recipe-section">
          {selectedRecipe ? (
            <div className="space-y-4">
              <StepByStepGuide recipe={selectedRecipe} />
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <VirtualTastePreview recipe={selectedRecipe} />
                <LiveChatAssistant />
              </div>
            </div>
          ) : (
            <div className={`h-48 sm:h-64 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-md flex items-center justify-center responsive-card text-center`}>
              <div className="max-w-md">
                <p className={`text-base sm:text-lg font-medium mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-700'
                }`}>
                  Select a recipe from the suggestions
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Or add ingredients to your kitchen inventory to get personalized recommendations
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiChef;