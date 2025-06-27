import React, { useState, useEffect } from 'react';
import { Lock, Eye, Database, Server, Download, Trash2, LogOut, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useFavourites } from '../../context/FavouritesContext';
import { exportUserDataToPDF } from '../../utils/dataExport';
import { supabase } from '../../lib/supabase';

const initialSettings = [
  { id: 1, name: 'Share Usage Analytics', enabled: true, icon: <Database size={18} /> },
  { id: 2, name: 'Personal Data Collection', enabled: true, icon: <Server size={18} /> },
  { id: 3, name: 'Food Preferences Tracking', enabled: true, icon: <Eye size={18} /> }
];

const PrivacyControls = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { theme } = useTheme();
  const { dietaryPreferences, user, signOut, isAuthenticated } = useUser();
  const { favourites } = useFavourites();
  const navigate = useNavigate();
  
  // Disable background scrolling when modal is open
  useEffect(() => {
    if (showDeleteConfirm || showLogoutConfirm) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showDeleteConfirm, showLogoutConfirm]);

  const toggleSetting = (id: number) => {
    setSettings(settings.map(setting => 
      setting.id === id 
        ? { ...setting, enabled: !setting.enabled } 
        : setting
    ));
  };

  const handleExportData = async () => {
    setIsExporting(true);
    
    try {
      // Collect user data
      const userData = {
        name: user?.user_metadata?.name || 'Guest User',
        email: user?.email || 'guest@example.com',
        dietaryPreferences
      };

      // Get favourites with additional data
      const favouritesData = favourites.map(fav => ({
        ...fav,
        lastBite: localStorage.getItem(`lastBite_${fav.id}`) || undefined,
        location: localStorage.getItem(`location_${fav.id}`) || undefined
      }));

      // Get recent meals from localStorage or mock data
      const recentMealsData = [
        { id: 1, name: 'Quinoa Bowl', date: '2 days ago' },
        { id: 2, name: 'Grilled Salmon', date: '3 days ago' },
        { id: 3, name: 'Avocado Toast', date: '5 days ago' },
        { id: 4, name: 'Vegetable Curry', date: 'Last week' }
      ];

      // Get kitchen inventory from localStorage or mock data
      const kitchenInventoryData = JSON.parse(localStorage.getItem('kitchenInventory') || '[]');
      
      // If no inventory data, use default
      const defaultInventory = [
        { id: 1, name: 'Eggs', quantity: 6, unit: 'pcs' },
        { id: 2, name: 'Milk', quantity: 1, unit: 'L' },
        { id: 3, name: 'Chicken Breast', quantity: 300, unit: 'g' },
        { id: 4, name: 'Spinach', quantity: 1, unit: 'bunch' },
        { id: 5, name: 'Onions', quantity: 2, unit: 'pcs' }
      ];

      const inventoryToExport = kitchenInventoryData.length > 0 ? kitchenInventoryData : defaultInventory;

      // Generate and download PDF
      exportUserDataToPDF(userData, favouritesData, recentMealsData, inventoryToExport);
      
      // Show success message
      setTimeout(() => {
        alert('Data exported successfully! Check your Downloads folder for "my_food_data.pdf"');
        setIsExporting(false);
      }, 1000);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
      setIsExporting(false);
    }
  };

  const handleDeleteAllData = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAllData = async () => {
    try {
      // Get current user info before clearing data
      const currentUser = user;
      
      if (currentUser && !currentUser.is_guest) {
        // Clear user data from Supabase (except profile name and image)
        await Promise.all([
          supabase.from('favourites').delete().eq('user_id', currentUser.id),
          supabase.from('inventory').delete().eq('user_id', currentUser.id),
          supabase.from('recipes').delete().eq('user_id', currentUser.id),
          supabase.from('recent_meals').delete().eq('user_id', currentUser.id),
          supabase.from('spins').delete().eq('user_id', currentUser.id),
          supabase.from('search_logs').delete().eq('user_id', currentUser.id),
          supabase.from('taste_feedback').delete().eq('user_id', currentUser.id),
          supabase.from('unlocked_premium').delete().eq('user_id', currentUser.id)
        ]);
      }
      
      // Reset RevenueCat if available (but keep subscription status)
      if (window.Purchases && !currentUser?.is_guest) {
        try {
          // Just log out and log back in to refresh state
          await window.Purchases.logOut();
          if (currentUser?.id) {
            await window.Purchases.identify(currentUser.id);
          }
        } catch (error) {
          console.error('Failed to reset RevenueCat state:', error);
        }
      }
      
      // Clear localStorage data except essential auth data
      const keysToKeep = [
        'rememberMe',
        'user_id', 
        'session_token',
        'session_expires',
        'userRegistrationDate'
      ];
      
      // Get all localStorage keys
      const allKeys = Object.keys(localStorage);
      
      // Remove all keys except the ones we want to keep
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear sessionStorage except essential auth data
      const sessionKeysToKeep = ['user_id', 'session_token', 'userRegistrationDate'];
      const allSessionKeys = Object.keys(sessionStorage);
      
      allSessionKeys.forEach(key => {
        if (!sessionKeysToKeep.includes(key)) {
          sessionStorage.removeItem(key);
        }
      });
      
      setShowDeleteConfirm(false);
      alert('All data has been deleted. The app will now refresh.');
      
      // Refresh the page to reset the app state
      window.location.reload();
      
    } catch (error) {
      console.error('Failed to delete data:', error);
      alert('Failed to delete some data. Please try again.');
      setShowDeleteConfirm(false);
    }
  };

  const handleLogOut = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogOut = async () => {
    setShowLogoutConfirm(false);
    
    // Reset RevenueCat if available
    if (window.Purchases) {
      try {
        await window.Purchases.logOut();
        console.log('RevenueCat logged out');
      } catch (error) {
        console.error('Failed to log out from RevenueCat:', error);
      }
    }
    
    await signOut();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Check if user is guest or not authenticated
  const isGuest = !isAuthenticated || !user || user.is_guest;

  return (
    <>
      <div className={`rounded-lg overflow-hidden shadow-md ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={20} className={theme === 'synesthesia' ? 'text-purple-500' : 'text-orange-500'} />
            <h3 className={`font-semibold text-lg ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Privacy Controls
            </h3>
          </div>
          
          <div className="space-y-4 mb-6">
            {settings.map((setting) => (
              <div 
                key={setting.id} 
                className={`flex justify-between items-center p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    {setting.icon}
                  </div>
                  <div>
                    <p className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
                      {setting.name}
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {setting.enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
                
                <div 
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    setting.enabled 
                      ? theme === 'synesthesia' ? 'bg-purple-500' : 'bg-orange-500'
                      : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                  } cursor-pointer`}
                  onClick={() => toggleSetting(setting.id)}
                >
                  <div 
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      setting.enabled ? 'left-7' : 'left-1'
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`p-3 rounded-lg mb-4 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <h4 className={`font-medium mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-700'
            }`}>
              Data Management
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleExportData}
                disabled={isExporting}
                className={`flex items-center justify-center gap-2 text-sm p-2 rounded transition-colors ${
                  isExporting
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : theme === 'dark' 
                      ? 'bg-gray-600 text-white hover:bg-gray-500' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Download size={16} />
                {isExporting ? 'Exporting...' : 'Export My Data'}
              </button>
              
              <button 
                onClick={handleDeleteAllData}
                className={`flex items-center justify-center gap-2 text-sm p-2 rounded ${
                  theme === 'dark' 
                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                } transition-colors`}
              >
                <Trash2 size={16} />
                Delete All Data
              </button>
            </div>
            
            <p className={`mt-3 text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              You can request a copy of all your data or permanently delete your information at any time.
            </p>
          </div>

          {/* Authentication Buttons - Login OR Log Out (never both) */}
          <div className="text-center">
            {isGuest ? (
              // Show Login button for guests
              <button 
                onClick={handleLogin}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors font-medium"
                title="Log In"
              >
                <LogIn size={18} />
                Log In
              </button>
            ) : (
              // Show Log Out button for authenticated users
              <button 
                onClick={handleLogOut}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors font-medium"
                title="Log Out"
              >
                <LogOut size={18} />
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className={`modal-content modal-small animate-modal-in ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`} onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Delete All Data?
              </h3>
              <p className={`text-sm mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Are you sure you want to delete all data? This will remove all your favourites, recipes, and activity history.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className={`flex-1 py-2 rounded-full font-medium ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAllData}
                  className="flex-1 py-2 rounded-full font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Out Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className={`modal-content modal-small animate-modal-in ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`} onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                <LogOut size={24} className="text-orange-600" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Log Out?
              </h3>
              <p className={`text-sm mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Are you sure you want to log out? You'll need to sign in again to access your saved data.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`flex-1 py-2 rounded-full font-medium ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogOut}
                  className="flex-1 py-2 rounded-full font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrivacyControls;