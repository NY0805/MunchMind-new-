import React, { useState } from 'react';
import { Sparkles, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Recipe {
  id: number;
  name: string;
  image: string;
  time: string;
  difficulty: string;
  ingredients: string[];
  steps: string[];
}

interface VirtualTastePreviewProps {
  recipe: Recipe;
}

const VirtualTastePreview: React.FC<VirtualTastePreviewProps> = ({ recipe }) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [actualTaste, setActualTaste] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [showThumbsUp, setShowThumbsUp] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const { theme } = useTheme();
  
  // Generate a taste description based on the recipe
  const generateTasteDescription = () => {
    if (recipe.name.includes('Spinach') && recipe.name.includes('Egg')) {
      return "The eggs provide a rich, creamy texture that complements the slight earthiness of the spinach. The sautéed onions add a sweet caramelized note that enhances the savory profile. Each bite delivers a satisfying combination of protein and vegetables with a balanced umami flavor.";
    } else if (recipe.name.includes('Chicken') && recipe.name.includes('Stir Fry')) {
      return "Juicy pieces of chicken coated in a savory-sweet sauce with aromatic ginger and garlic notes. The vegetables retain a pleasant crunch, creating a textural contrast with the tender meat. A harmonious balance of umami, subtle sweetness, and mild heat.";
    } else {
      return "A perfectly balanced dish with harmonious flavors that dance on your palate. The ingredients create layers of taste that unfold with each bite, from initial savory notes to subtle undertones of natural sweetness. The texture is satisfyingly complex yet comforting.";
    }
  };

  const handleAccurate = () => {
    setShowContent(false);
    setShowThumbsUp(true);
    setTimeout(() => {
      setShowThumbsUp(false);
      setShowThankYou(true);
    }, 1500);
  };

  const handleInaccurate = () => {
    setShowFeedbackForm(true);
  };

  const handleSubmitFeedback = () => {
    if (actualTaste.trim()) {
      setShowFeedbackForm(false);
      setShowThankYou(true);
      setActualTaste('');
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden shadow-md h-full ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <h3 className={`font-semibold text-base ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Virtual Taste Preview
          </h3>
          <div className={`p-1 rounded-full ${
            theme === 'synesthesia'
              ? 'bg-purple-100 text-purple-500'
              : theme === 'dark'
                ? 'bg-gray-700 text-orange-400'
                : 'bg-orange-100 text-orange-500'
          }`}>
            <Sparkles size={16} />
          </div>
        </div>
        
        {showContent && (
          <>
            <div className={`p-3 rounded-lg mb-3 ${
              theme === 'dark' 
                ? 'bg-indigo-900/20 border border-indigo-800/30' 
                : 'bg-indigo-50 border border-indigo-100'
            }`}>
              <p className={`italic text-xs leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {generateTasteDescription()}
              </p>
            </div>
            
            <div className={`text-xs mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>This virtual taste preview is generated based on the ingredients and cooking methods. Actual taste may vary.</p>
            </div>
          </>
        )}
        
        {showThumbsUp && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="animate-thumbs-up">
              <ThumbsUp size={48} className="text-green-500" />
            </div>
            <p className="text-xs mt-2 text-green-600 font-medium">Thank You!</p>
          </div>
        )}
        
        {showFeedbackForm ? (
          <div className="mt-3">
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-700'
            }`}>
              How did it actually taste?
            </label>
            <textarea
              value={actualTaste}
              onChange={(e) => setActualTaste(e.target.value)}
              placeholder="Describe the actual taste..."
              className={`w-full p-2 rounded-lg border text-xs ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-gray-50 text-gray-800 border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-orange-400`}
              rows={3}
            />
            <button
              onClick={handleSubmitFeedback}
              className={`mt-2 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                theme === 'synesthesia'
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              } transition-colors`}
            >
              <Send size={12} />
              Submit
            </button>
          </div>
        ) : showThankYou ? (
          <div className={`mt-3 p-2 rounded-lg text-center ${
            theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
          }`}>
            <p className="text-xs font-medium">Thank you! Your input has been submitted.</p>
          </div>
        ) : showContent && (
          <div className="mt-3 flex justify-center gap-3">
            <button 
              onClick={handleAccurate}
              className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 text-green-400 hover:bg-gray-600'
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
            >
              <ThumbsUp size={12} />
              <span>Accurate</span>
            </button>
            
            <button 
              onClick={handleInaccurate}
              className={`flex items-center gap-1 px-3 py-1 rounded text-xs ${
                theme === 'dark'
                  ? 'bg-gray-700 text-red-400 hover:bg-gray-600'
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              } transition-colors`}
            >
              <ThumbsDown size={12} />
              <span>Inaccurate</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualTastePreview;