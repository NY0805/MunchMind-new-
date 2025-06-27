import React, { useState } from 'react';
import { Bell, Clock, Utensils, Calendar, Crown, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import CustomPaywall from '../profile/CustomPaywall';

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState([
    { id: 1, type: 'Meal Reminders', enabled: true, icon: <Clock size={18} />, premium: false },
    { id: 2, type: 'New Recipe Suggestions', enabled: true, icon: <Utensils size={18} />, premium: false },
    { id: 3, type: 'Weekly Nutrition Reports', enabled: false, icon: <Calendar size={18} />, premium: true }
  ]);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { theme } = useTheme();
  const { isPro, isLoadingProStatus, checkProStatus, user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  
  // Check if user is guest or not logged in
  const isGuest = !isAuthenticated || !user || user.is_guest;
  
  const togglePreference = (id: number) => {
    const pref = preferences.find(p => p.id === id);
    
    if (pref?.premium) {
      if (isGuest) {
        // Show login prompt for guests
        setShowLoginPrompt(true);
        return;
      }
      
      if (!isPro && !isLoadingProStatus) {
        setShowPaywall(true);
        return;
      }
    }

    setPreferences(preferences.map(pref => 
      pref.id === id 
        ? { ...pref, enabled: !pref.enabled } 
        : pref
    ));
  };

  const handlePaywallSuccess = async () => {
    setShowPaywall(false);
    // Refresh pro status
    await checkProStatus();
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  return (
    <>
      <div className={`rounded-lg overflow-hidden shadow-md ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={20} className={theme === 'synesthesia' ? 'text-purple-500' : 'text-orange-500'} />
            <h3 className={`font-semibold text-lg ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Notification Preferences
            </h3>
          </div>
          
          <div className="space-y-4">
            {preferences.map((pref) => (
              <div 
                key={pref.id} 
                className={`flex justify-between items-center p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                } ${pref.premium && !isPro && !isLoadingProStatus ? 'opacity-75' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    {pref.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
                      {pref.type}
                    </span>
                    {pref.premium && (
                      <>
                        <Crown size={16} className="text-amber-500" />
                        {isLoadingProStatus && (
                          <div className="w-3 h-3 border border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                <div 
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    pref.enabled && (pref.premium ? isPro : true)
                      ? theme === 'synesthesia' ? 'bg-purple-500' : 'bg-orange-500'
                      : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                  onClick={() => togglePreference(pref.id)}
                >
                  <div 
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      pref.enabled && (pref.premium ? isPro : true) ? 'left-7' : 'left-1'
                    }`}
                  ></div>
                </div>
              </div>
            ))}
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
              <Crown size={32} className="mx-auto mb-4 text-amber-500" />
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Premium Feature
              </h3>
              <p className={`text-sm mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Please log in to access weekly nutrition reports and other premium features.
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
    </>
  );
};

export default NotificationPreferences;