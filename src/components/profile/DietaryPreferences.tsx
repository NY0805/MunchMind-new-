import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { supabase } from '../../lib/supabase';

const dietTypes = [
  { id: 'omnivore', label: 'Omnivore' },
  { id: 'flexitarian', label: 'Flexitarian' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
];

const DietaryPreferences = () => {
  const { dietaryPreferences, setDietaryPreferences, user, isValidUser } = useUser();
  const [newAllergy, setNewAllergy] = useState('');
  const [newDislike, setNewDislike] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { theme } = useTheme();
  
  const handleDietTypeChange = async (dietType: string) => {
    const newPreferences = { ...dietaryPreferences, dietType };
    setDietaryPreferences(newPreferences);
    await saveDietaryPreferences(newPreferences);
  };
  
  const addAllergy = async () => {
    if (newAllergy && !dietaryPreferences.allergies.includes(newAllergy)) {
      const newPreferences = {
        ...dietaryPreferences,
        allergies: [...dietaryPreferences.allergies, newAllergy]
      };
      setDietaryPreferences(newPreferences);
      await saveDietaryPreferences(newPreferences);
      setNewAllergy('');
    }
  };
  
  const removeAllergy = async (allergy: string) => {
    const newPreferences = {
      ...dietaryPreferences,
      allergies: dietaryPreferences.allergies.filter(a => a !== allergy)
    };
    setDietaryPreferences(newPreferences);
    await saveDietaryPreferences(newPreferences);
  };
  
  const addDislike = async () => {
    if (newDislike && !dietaryPreferences.dislikes.includes(newDislike)) {
      const newPreferences = {
        ...dietaryPreferences,
        dislikes: [...dietaryPreferences.dislikes, newDislike]
      };
      setDietaryPreferences(newPreferences);
      await saveDietaryPreferences(newPreferences);
      setNewDislike('');
    }
  };
  
  const removeDislike = async (dislike: string) => {
    const newPreferences = {
      ...dietaryPreferences,
      dislikes: dietaryPreferences.dislikes.filter(d => d !== dislike)
    };
    setDietaryPreferences(newPreferences);
    await saveDietaryPreferences(newPreferences);
  };

  const saveDietaryPreferences = async (preferences: any) => {
    if (!isValidUser()) {
      // Save to localStorage for guest users
      localStorage.setItem('guestDietaryPreferences', JSON.stringify(preferences));
      return;
    }

    setIsUpdating(true);
    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update({
            diet_type: preferences.dietType,
            allergies: preferences.allergies,
            dislikes: preferences.dislikes,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
            diet_type: preferences.dietType,
            allergies: preferences.allergies,
            dislikes: preferences.dislikes,
          });
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('Failed to save dietary preferences:', error);
      // Fallback to localStorage
      localStorage.setItem('guestDietaryPreferences', JSON.stringify(preferences));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden shadow-md ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold text-lg ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Dietary Preferences
          </h3>
          {isUpdating && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
          )}
        </div>
        
        <div className="mb-6">
          <h4 className={`text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Diet Type
          </h4>
          <div className="flex flex-wrap gap-2">
            {dietTypes.map((diet) => (
              <button
                key={diet.id}
                onClick={() => handleDietTypeChange(diet.id)}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  dietaryPreferences.dietType === diet.id
                    ? theme === 'synesthesia'
                      ? 'bg-purple-500 text-white'
                      : 'bg-orange-500 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {diet.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className={`text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          }`}>
            Allergies
          </h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {dietaryPreferences.allergies.map((allergy) => (
              <div
                key={allergy}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                  theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-600'
                }`}
              >
                <AlertCircle size={12} />
                <span>{allergy}</span>
                <button 
                  onClick={() => removeAllergy(allergy)}
                  className={`ml-1 hover:opacity-70 ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-0">
            <input
              type="text"
              placeholder="Add allergy..."
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
              className={`text-sm flex-1 px-3 py-2 rounded-l-lg border focus:outline-none ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white border-gray-600 focus:border-gray-500' 
                  : 'bg-gray-50 text-gray-800 border-gray-200 focus:border-gray-300'
              }`}
            />
            <button
              onClick={addAllergy}
              className={`px-3 py-2 rounded-r-lg flex items-center justify-center transition-colors ${
                theme === 'synesthesia'
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        
        <div>
          <h4 className={`text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          }`}>
            Dislikes
          </h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {dietaryPreferences.dislikes.map((dislike) => (
              <div
                key={dislike}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span>{dislike}</span>
                <button 
                  onClick={() => removeDislike(dislike)}
                  className={`ml-1 hover:opacity-70 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-0">
            <input
              type="text"
              placeholder="Add dislike..."
              value={newDislike}
              onChange={(e) => setNewDislike(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDislike()}
              className={`text-sm flex-1 px-3 py-2 rounded-l-lg border focus:outline-none ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white border-gray-600 focus:border-gray-500' 
                  : 'bg-gray-50 text-gray-800 border-gray-200 focus:border-gray-300'
              }`}
            />
            <button
              onClick={addDislike}
              className={`px-3 py-2 rounded-r-lg flex items-center justify-center transition-colors ${
                theme === 'synesthesia'
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietaryPreferences;