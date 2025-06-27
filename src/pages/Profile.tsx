import React from 'react';
import UserProfile from '../components/profile/UserProfile';
import NutritionalDNA from '../components/profile/NutritionalDNA';
import FoodKarmaTracker from '../components/profile/FoodKarmaTracker';
import DietaryPreferences from '../components/profile/DietaryPreferences';
import DreamMealGenerator from '../components/profile/DreamMealGenerator';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const { theme } = useTheme();

  return (
    <div className="responsive-container py-6">
      <h1 className={`responsive-title mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        My Profile
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-1 space-y-4">
          <UserProfile />
          <div className="hidden lg:block">
            <DietaryPreferences />
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-4">
          {/* Show dietary preferences on mobile/tablet above nutritional DNA */}
          <div className="lg:hidden">
            <DietaryPreferences />
          </div>
          
          <NutritionalDNA />
          <FoodKarmaTracker />
          <DreamMealGenerator />
        </div>
      </div>
    </div>
  );
};

export default Profile;