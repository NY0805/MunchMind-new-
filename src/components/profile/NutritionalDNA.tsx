import React, { useState, useEffect } from 'react';
import { Info, Crown, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { supabase } from '../../lib/supabase';
import CustomPaywall from './CustomPaywall';
import PersonalizedRecommendations from './PersonalizedRecommendations';
import InfoTooltip from './InfoTooltip';

const NutritionalDNA = () => {
  const [showPaywall, setShowPaywall] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [nutrients, setNutrients] = useState([
    { name: 'Protein', value: 0, goal: 100, color: 'from-blue-400 to-blue-500' },
    { name: 'Fiber', value: 0, goal: 100, color: 'from-green-400 to-green-500' },
    { name: 'Iron', value: 0, goal: 100, color: 'from-orange-400 to-orange-500' },
    { name: 'Calcium', value: 0, goal: 100, color: 'from-purple-400 to-purple-500' },
    { name: 'Vitamin C', value: 0, goal: 100, color: 'from-yellow-400 to-yellow-500' },
    { name: 'Omega-3', value: 0, goal: 100, color: 'from-cyan-400 to-cyan-500' }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const { isPro, isLoadingProStatus, checkProStatus, user, isAuthenticated, isValidUser } = useUser();
  const navigate = useNavigate();

  // Check if user is guest or not logged in - lock premium features
  const isGuest = !isAuthenticated || !user || user.is_guest;
  const hasAccess = !isGuest && isPro;

  // Load nutritional data based on recipe count
  useEffect(() => {
    const loadNutritionalData = async () => {
      setIsLoading(true);
      
      if (isValidUser()) {
        try {
          // Get recipe count from database
          const { data: recipes } = await supabase
            .from('recipes')
            .select('id')
            .eq('user_id', user.id);
          
          const recipeCount = recipes?.length || 0;
          
          // Calculate nutritional values based on recipe count
          const baseValues = [78, 65, 45, 82, 95, 30]; // Base percentages
          const updatedNutrients = nutrients.map((nutrient, index) => ({
            ...nutrient,
            value: Math.min(baseValues[index] + (recipeCount * 2), 100) // Increase by 2% per recipe, max 100%
          }));
          
          setNutrients(updatedNutrients);
        } catch (error) {
          console.error('Failed to load nutritional data:', error);
        }
      } else {
        // Guest user - all zeros
        const guestNutrients = nutrients.map(nutrient => ({
          ...nutrient,
          value: 0
        }));
        setNutrients(guestNutrients);
      }
      
      setIsLoading(false);
    };

    loadNutritionalData();
  }, [user, isAuthenticated, isValidUser]);

  const handleGetRecommendations = () => {
    if (isGuest) {
      // Show login prompt overlay instead of alert
      setShowLoginPrompt(true);
      return;
    }
    
    if (!hasAccess || isLoadingProStatus) {
      setShowPaywall(true);
    } else {
      setShowRecommendations(true);
    }
  };

  const handlePaywallSuccess = async () => {
    setShowPaywall(false);
    // Refresh pro status
    await checkProStatus();
    setShowRecommendations(true);
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className={`rounded-lg overflow-hidden shadow-md ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`rounded-lg overflow-hidden shadow-md ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold text-lg ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Nutritional DNA
              </h3>
              {(!hasAccess || isGuest) && !isLoadingProStatus && <Crown size={18} className="text-amber-500" />}
              {isLoadingProStatus && (
                <div className="w-4 h-4 border border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <button 
              onClick={() => setShowInfoTooltip(true)}
              className={`p-1 rounded-full transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Info size={18} />
            </button>
          </div>

          {/* Guest Mode Notice */}
          {isGuest && (
            <div className={`p-3 rounded-lg mb-4 ${
              theme === 'dark' ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'
            }`}>
              <p className="text-sm font-medium">Log in to track your nutritional DNA and get personalized insights!</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {nutrients.map((nutrient) => (
              <div key={nutrient.name} className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}>
                    {nutrient.name}
                  </span>
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {nutrient.value}%
                  </span>
                </div>
                
                <div className={`h-3 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${nutrient.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${nutrient.value}%` }}
                  ></div>
                </div>
                
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {nutrient.value === 0 ? 'Start cooking to track' : nutrient.value < nutrient.goal ? 'Try to increase' : 'Great level!'}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={handleGetRecommendations}
              disabled={isLoadingProStatus}
              className={`text-sm font-medium px-6 py-3 rounded-full transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 mx-auto ${
                isLoadingProStatus
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : theme === 'synesthesia'
                    ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg'
                    : theme === 'dark'
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg'
              }`}
            >
              {isLoadingProStatus && (
                <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              Get Personalized Recommendations
              {(!hasAccess || isGuest) && !isLoadingProStatus && <Crown size={16} className="text-amber-300" />}
            </button>
          </div>

          {/* Add bottom padding for layout balance */}
          <div className="pb-6"></div>
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
              <Crown size={32} className="mx-auto mb-4 text-amber-500" />
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Premium Feature
              </h3>
              <p className={`text-sm mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Please log in to access personalized recommendations and other premium features.
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
      
      <PersonalizedRecommendations
        isOpen={showRecommendations}
        onClose={() => setShowRecommendations(false)}
        nutrients={nutrients}
      />
      
      <InfoTooltip
        isOpen={showInfoTooltip}
        onClose={() => setShowInfoTooltip(false)}
      />
    </>
  );
};

export default NutritionalDNA;