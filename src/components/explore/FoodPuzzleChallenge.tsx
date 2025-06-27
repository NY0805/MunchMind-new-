import React from 'react';
import { Brain, Award } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface FoodPuzzleChallengeProps {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
}

const FoodPuzzleChallenge: React.FC<FoodPuzzleChallengeProps> = ({
  title,
  description,
  difficulty,
  image
}) => {
  const { theme } = useTheme();
  
  const getDifficultyColor = () => {
    if (difficulty === 'Easy') return 'bg-green-100 text-green-600';
    if (difficulty === 'Medium') return 'bg-yellow-100 text-yellow-600';
    return 'bg-red-100 text-red-600';
  };
  
  const getDarkDifficultyColor = () => {
    if (difficulty === 'Easy') return 'bg-green-900/30 text-green-400';
    if (difficulty === 'Medium') return 'bg-yellow-900/30 text-yellow-400';
    return 'bg-red-900/30 text-red-400';
  };

  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-md ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className="flex h-32 md:h-40">
        <div className="w-1/3 relative">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="w-2/3 p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {title}
              </h3>
              
              <span className={`text-xs px-2 py-1 rounded-full ${
                theme === 'dark' ? getDarkDifficultyColor() : getDifficultyColor()
              }`}>
                {difficulty}
              </span>
            </div>
            
            <p className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {description}
            </p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Brain size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
              <span className="text-xs text-gray-500">10 mins</span>
            </div>
            
            <button 
              className={`text-xs px-3 py-1 rounded-full ${
                theme === 'synesthesia'
                  ? 'bg-purple-500 text-white'
                  : theme === 'dark'
                    ? 'bg-orange-500/80 text-white'
                    : 'bg-orange-500 text-white'
              }`}
            >
              Play Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPuzzleChallenge;