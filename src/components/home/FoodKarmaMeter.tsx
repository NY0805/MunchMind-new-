import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { supabase } from '../../lib/supabase';

interface FoodKarmaMeterProps {
  points: number;
}

const FoodKarmaMeter: React.FC<FoodKarmaMeterProps> = ({ points }) => {
  const { theme } = useTheme();
  const { user, isAuthenticated, isValidUser } = useUser();
  const navigate = useNavigate();
  
  // Check if user is guest or not logged in
  const isGuest = !isAuthenticated || !user || user.is_guest;
  
  // For new users, always start with 0 points
  const [actualPoints, setActualPoints] = React.useState(0);
  
  React.useEffect(() => {
    const loadKarmaPoints = async () => {
      if (isValidUser()) {
        try {
          // Get recipe count from database
          const { data: recipes } = await supabase
            .from('recipes')
            .select('id')
            .eq('user_id', user.id);
          
          const recipeCount = recipes?.length || 0;
          // Calculate karma points: 15 points per recipe, max 100
          const calculatedPoints = Math.min(recipeCount * 15, 100);
          setActualPoints(calculatedPoints);
        } catch (error) {
          console.error('Failed to load karma points:', error);
          setActualPoints(0);
        }
      } else {
        setActualPoints(0);
      }
    };

    loadKarmaPoints();
  }, [user, isAuthenticated, isValidUser]);

  const displayPoints = isGuest ? 0 : actualPoints;
  
  // Determine color based on points
  const getColor = () => {
    if (displayPoints < 30) return 'from-red-500 to-red-300';
    if (displayPoints < 60) return 'from-yellow-500 to-yellow-300';
    return 'from-green-500 to-green-300';
  };
  
  const getTextColor = () => {
    return theme === 'dark' ? 'text-white' : 'text-gray-700';
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`font-medium ${getTextColor()}`}>Daily Sustainability Score</h3>
        <span className={`font-bold ${getTextColor()}`}>{displayPoints}/100</span>
      </div>
      
      <div className={`h-4 rounded-full overflow-hidden bg-gray-200 ${theme === 'dark' ? 'bg-gray-700' : ''}`}>
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${getColor()}`}
          style={{ 
            width: `${displayPoints}%`, 
            transition: 'width 1s ease-in-out' 
          }}
        ></div>
      </div>
      
      <div className="mt-3 flex justify-between text-xs text-gray-500">
        <span>Low Impact</span>
        <span>Medium Impact</span>
        <span>High Impact</span>
      </div>
      
      <div className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        {isGuest ? (
          <div>
            <p className="font-medium text-orange-500">Log in to track your food karma!</p>
            <p className="mt-1">Sign up to monitor your sustainability impact and get personalized tips.</p>
            <button
              onClick={handleLoginRedirect}
              className={`mt-2 text-xs px-3 py-1 rounded-full ${
                theme === 'synesthesia'
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              } transition-colors`}
            >
              Log In Now
            </button>
          </div>
        ) : displayPoints === 0 ? (
          <div>
            <p>Start cooking recipes to build your food karma!</p>
            <p className="mt-1">Tip: Try a recipe from AI Chef to earn your first sustainability points.</p>
          </div>
        ) : (
          <div>
            <p>Your food choices today are <span className="font-medium text-green-500">good</span> for the planet!</p>
            <p className="mt-1">Tip: Try a plant-based meal tomorrow to increase your score.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodKarmaMeter;