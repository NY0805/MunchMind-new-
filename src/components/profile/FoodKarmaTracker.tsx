import React, { useState, useEffect } from 'react';
import { TrendingUp, Droplets, Leaf, Award } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { supabase } from '../../lib/supabase';
import DateRangeSelector from './DateRangeSelector';

const FoodKarmaTracker = () => {
  const [selectedRange, setSelectedRange] = useState('thisWeek');
  const [karmaData, setKarmaData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const { user, isAuthenticated, isValidUser } = useUser();
  
  // Check if user is guest or not logged in - set all data to 0
  const isGuest = !isAuthenticated || !user || user.is_guest;

  useEffect(() => {
    const loadKarmaData = async () => {
      setIsLoading(true);
      
      if (isValidUser()) {
        try {
          // Get recipe count from database
          const { data: recipes } = await supabase
            .from('recipes')
            .select('tried_at')
            .eq('user_id', user.id)
            .order('tried_at', { ascending: true });
          
          const recipeCount = recipes?.length || 0;
          
          // Generate karma data based on actual recipes
          if (recipeCount > 0) {
            // Create realistic data based on recipe count
            const baseData = generateDataFromRecipes(recipeCount, selectedRange);
            setKarmaData(baseData);
          } else {
            // No recipes yet - all zeros
            setKarmaData(generateEmptyData(selectedRange));
          }
        } catch (error) {
          console.error('Failed to load karma data:', error);
          setKarmaData(generateEmptyData(selectedRange));
        }
      } else {
        // Guest user - all zeros
        setKarmaData(generateEmptyData(selectedRange));
      }
      
      setIsLoading(false);
    };

    loadKarmaData();
  }, [user, isAuthenticated, selectedRange, isValidUser]);

  const generateEmptyData = (range: string) => {
    const ranges = {
      thisWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      lastWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      thisMonth: ['W1', 'W2', 'W3', 'W4'],
      lastMonth: ['W1', 'W2', 'W3', 'W4'],
      last3Months: ['M1', 'M2', 'M3'],
      custom: ['D1', 'D2', 'D3', 'D4', 'D5']
    };

    const days = ranges[range as keyof typeof ranges] || ranges.thisWeek;
    
    return days.map(day => ({
      day,
      value: 0,
      meals: 0,
      plantBased: 0
    }));
  };

  const generateDataFromRecipes = (recipeCount: number, range: string) => {
    const ranges = {
      thisWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      lastWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      thisMonth: ['W1', 'W2', 'W3', 'W4'],
      lastMonth: ['W1', 'W2', 'W3', 'W4'],
      last3Months: ['M1', 'M2', 'M3'],
      custom: ['D1', 'D2', 'D3', 'D4', 'D5']
    };

    const days = ranges[range as keyof typeof ranges] || ranges.thisWeek;
    
    // Distribute recipes across days with some randomness
    return days.map((day, index) => {
      const recipesForDay = Math.floor(recipeCount / days.length) + (index < recipeCount % days.length ? 1 : 0);
      const meals = Math.max(recipesForDay, 0);
      const plantBased = Math.floor(meals * 0.6); // Assume 60% plant-based
      const value = Math.min(meals * 15, 100); // 15 points per meal, max 100
      
      return {
        day,
        value,
        meals,
        plantBased
      };
    });
  };
  
  const currentData = karmaData;
  const averageScore = currentData.length > 0 ? Math.round(currentData.reduce((sum, day) => sum + day.value, 0) / currentData.length) : 0;
  const totalMeals = currentData.reduce((sum, day) => sum + day.meals, 0);
  const totalPlantBased = currentData.reduce((sum, day) => sum + day.plantBased, 0);
  const plantBasedPercentage = totalMeals > 0 ? Math.round((totalPlantBased / totalMeals) * 100) : 0;
  
  // Calculate water saved based on plant-based meals (rough estimate: 1000L per plant-based meal)
  const waterSaved = Math.round(totalPlantBased * 1000);
  
  // Calculate CO2 reduction (rough estimate: 2.5kg CO2 per plant-based meal)
  const co2Reduced = Math.round(totalPlantBased * 2.5 * 10) / 10; // Round to 1 decimal

  const getBarColor = (value: number) => {
    if (theme === 'synesthesia') {
      if (value >= 80) return 'from-pink-400 to-purple-500';
      if (value >= 60) return 'from-blue-400 to-indigo-500';
      return 'from-gray-400 to-gray-500';
    } else if (theme === 'dark') {
      if (value >= 80) return 'from-green-500 to-emerald-600';
      if (value >= 60) return 'from-blue-500 to-cyan-600';
      return 'from-gray-500 to-gray-600';
    } else {
      if (value >= 80) return 'from-green-300 to-green-400';
      if (value >= 60) return 'from-blue-300 to-blue-400';
      return 'from-gray-300 to-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (theme === 'synesthesia') {
      if (score >= 80) return 'text-pink-500';
      if (score >= 60) return 'text-purple-500';
      return 'text-gray-500';
    } else if (theme === 'dark') {
      if (score >= 80) return 'text-emerald-400';
      if (score >= 60) return 'text-cyan-400';
      return 'text-gray-400';
    } else {
      if (score >= 80) return 'text-emerald-500';
      if (score >= 60) return 'text-blue-500';
      return 'text-slate-500';
    }
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score === 0) return 'Get Started';
    return 'Needs Improvement';
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
    <div className={`rounded-lg overflow-hidden shadow-md ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className={`font-semibold text-lg ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Food Karma Tracker
            </h3>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Your sustainability impact
            </p>
          </div>
          
          <DateRangeSelector 
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
        </div>

        {/* Guest Mode Notice */}
        {isGuest && (
          <div className={`p-3 rounded-lg mb-4 ${
            theme === 'dark' ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'
          }`}>
            <p className="text-sm font-medium">Log in to track your food karma and sustainability impact!</p>
          </div>
        )}

        {/* Main Score Display */}
        <div className={`p-4 rounded-lg mb-6 text-center ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className={`text-3xl font-bold mb-1 ${getScoreColor(averageScore)}`}>
            {averageScore}
          </div>
          <div className={`text-sm font-medium ${getScoreColor(averageScore)}`}>
            {getScoreLabel(averageScore)}
          </div>
          <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Your Sustainability Score
          </div>
        </div>
        
        {/* Visual Chart */}
        <div className="mb-6">
          <div className="flex items-end justify-between h-40 mb-4 px-2">
            {currentData.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1 mx-1 group">
                {/* Chart Bar Container */}
                <div className="flex-1 w-full flex items-end justify-center relative" style={{ minHeight: '120px' }}>
                  {/* Background bar for reference */}
                  <div className={`absolute bottom-0 w-full rounded-t-md ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`} style={{ height: '100%', opacity: 0.3 }}></div>
                  
                  {/* Actual score bar */}
                  <div 
                    className={`w-full rounded-t-md bg-gradient-to-t ${getBarColor(day.value)} transition-all duration-1000 ease-out relative z-10`}
                    style={{ 
                      height: `${Math.max((day.value / 100) * 100, 8)}%`,
                      animationDelay: `${index * 150}ms`,
                      minHeight: day.value > 0 ? '8px' : '2px'
                    }}
                  >
                    {/* Hover tooltip */}
                    <div className={`absolute -top-16 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 ${
                      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-800 text-white'
                    } whitespace-nowrap shadow-lg`}>
                      <div className="font-semibold text-center">{day.value} points</div>
                      <div className="text-center">{day.meals} meals</div>
                      <div className="text-center">{day.plantBased} plant-based</div>
                      {/* Tooltip arrow */}
                      <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                        theme === 'dark' ? 'border-t-gray-900' : 'border-t-gray-800'
                      }`}></div>
                    </div>
                  </div>
                </div>
                
                {/* Day label and score */}
                <div className="mt-3 text-center">
                  <p className={`text-xs font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {day.day}
                  </p>
                  <p className={`text-xs font-semibold ${getScoreColor(day.value)}`}>
                    {day.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Chart scale reference */}
          <div className="flex justify-between text-xs text-gray-400 px-2">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-emerald-100'
            }`}>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Avg Score
              </p>
              <p className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {averageScore}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-blue-100'
            }`}>
              <Droplets size={16} className="text-blue-500" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Water Saved
              </p>
              <p className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {waterSaved > 1000 ? `${Math.round(waterSaved/1000)}k L` : `${waterSaved} L`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-emerald-100'
            }`}>
              <Leaf size={16} className="text-emerald-500" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Plant-Based
              </p>
              <p className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {plantBasedPercentage}%
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-slate-100'
            }`}>
              <Award size={16} className="text-slate-500" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                CO₂ Reduced
              </p>
              <p className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {co2Reduced} kg
              </p>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className={`p-3 rounded-lg ${
          theme === 'synesthesia'
            ? 'bg-purple-100 text-purple-800'
            : theme === 'dark'
              ? 'bg-gray-700 text-gray-300'
              : 'bg-emerald-50 text-emerald-800'
        }`}>
          <p className="text-sm">
            {isGuest 
              ? "🌱 Log in to start tracking your sustainable food choices and make a real impact!"
              : averageScore === 0
                ? "🌱 Start cooking recipes to build your food karma! Try a recipe from AI Chef to get started."
                : averageScore >= 80 
                  ? "🌟 Excellent work! Your sustainable food choices are making a real impact."
                  : averageScore >= 60
                    ? "👍 Good progress! Try adding more plant-based meals to boost your score."
                    : "🌱 Every sustainable choice counts! Consider trying more plant-based options."
            }
          </p>
        </div>

        {/* Add padding below for layout balance */}
        <div className="pb-4"></div>
      </div>
    </div>
  );
};

export default FoodKarmaTracker;