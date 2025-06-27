import React, { useState, useEffect } from 'react';
import { Edit, CheckCircle, Camera, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { supabase } from '../../lib/supabase';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showImageLoginPrompt, setShowImageLoginPrompt] = useState(false);
  const [profileImage, setProfileImage] = useState('/image copy copy copy copy copy copy.png');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [recipeCount, setRecipeCount] = useState(0);
  const [karmaPoints, setKarmaPoints] = useState(0);
  const { theme } = useTheme();
  const { user, isAuthenticated, isValidUser } = useUser();
  const navigate = useNavigate();

  // Determine if user is guest
  const isGuest = !isAuthenticated || !user || user.is_guest;
  const displayName = isGuest ? 'Guest' : (user?.user_metadata?.name || user?.email?.split('@')[0] || 'User');

  // Load profile data from Supabase on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      if (isValidUser()) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, profile_image')
            .eq('user_id', user.id)
            .single();

          if (profile) {
            if (profile.name) {
              setName(profile.name);
            }
            if (profile.profile_image && profile.profile_image !== '/image copy copy copy copy copy copy.png') {
              setProfileImage(profile.profile_image);
            }
          }

          // Load recipe count from recipes table
          const { data: recipes } = await supabase
            .from('recipes')
            .select('id')
            .eq('user_id', user.id);

          const recipeCount = recipes?.length || 0;
          setRecipeCount(recipeCount);

          // Calculate karma points based on recipes (15 points per recipe, max 100)
          const points = Math.min(recipeCount * 15, 100);
          setKarmaPoints(points);

        } catch (error) {
          console.error('Failed to load profile data:', error);
        }
      } else {
        // Reset all stats for guest users
        setRecipeCount(0);
        setKarmaPoints(0);
      }
    };

    loadProfileData();
  }, [user, isValidUser]);

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (showLoginPrompt || showImageLoginPrompt) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showLoginPrompt, showImageLoginPrompt]);

  // Get user registration date
  const getUserRegistrationDate = () => {
    if (isGuest) return null;
    
    // Try to get from user metadata first
    if (user?.created_at) {
      const date = new Date(user.created_at);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    
    // Fallback to localStorage for demo
    const storedDate = localStorage.getItem('userRegistrationDate');
    if (storedDate) {
      const date = new Date(storedDate);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    
    return 'May 2025'; // Default fallback
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isGuest) {
      setShowImageLoginPrompt(true);
      return;
    }
    
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        
        // Check if the new image is different from current
        if (result === profileImage) {
          setIsUploadingImage(false);
          return;
        }
        
        setProfileImage(result);
        
        // Save to Supabase for authenticated users
        if (isValidUser()) {
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
                  profile_image: result,
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
                  profile_image: result,
                  diet_type: 'flexitarian',
                  allergies: ['peanuts'],
                  dislikes: ['mushrooms', 'olives'],
                });

              if (error) throw error;
            }

            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
          } catch (error) {
            console.error('Failed to save profile image:', error);
            // Revert on error
            setProfileImage('/image copy copy copy copy copy copy.png');
          }
        }
        
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameEdit = async () => {
    if (isGuest) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (isEditing && name.trim()) {
      // Check if the new name is different from current
      const currentName = user?.user_metadata?.name || user?.email?.split('@')[0] || '';
      if (name.trim() === currentName) {
        setIsEditing(false);
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
              name: name.trim(),
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
              name: name.trim(),
              profile_image: profileImage,
              diet_type: 'flexitarian',
              allergies: ['peanuts'],
              dislikes: ['mushrooms', 'olives'],
            });
          
          if (error) throw error;
        }

        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } catch (error) {
        console.error('Failed to update name:', error);
      } finally {
        setIsUpdating(false);
      }
    }
    
    setIsEditing(!isEditing);
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    setShowImageLoginPrompt(false);
    navigate('/login');
  };

  return (
    <>
      <div className={`rounded-lg overflow-hidden shadow-md ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`h-32 relative ${
          theme === 'synesthesia' 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
            : 'bg-gradient-to-r from-orange-500 to-amber-500'
        }`}>
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-white object-cover transition-all duration-300"
              />
              <label className={`absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 ${
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
              } shadow-md ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {isUploadingImage ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                ) : (
                  <Camera size={16} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploadingImage}
                />
              </label>
            </div>
          </div>
        </div>
        
        <div className="pt-20 p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            {isEditing && !isGuest ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={displayName}
                className={`text-xl font-bold text-center border-b-2 ${
                  theme === 'dark' 
                    ? 'bg-transparent text-white border-gray-600' 
                    : 'bg-transparent text-gray-800 border-gray-300'
                } focus:outline-none`}
              />
            ) : (
              <h2 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {name || displayName}
              </h2>
            )}
            
            <button 
              onClick={handleNameEdit} 
              disabled={isUpdating}
              className={`transition-colors ${
                theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUpdating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
              ) : isEditing ? (
                <CheckCircle size={18} />
              ) : (
                <Edit size={18} />
              )}
            </button>
          </div>
          
          {!isGuest && (
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Food Explorer since {getUserRegistrationDate()}
            </p>
          )}
          
          <div className="flex justify-center gap-4 mt-4">
            <div className="text-center">
              <p className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {recipeCount}
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Recipes
              </p>
            </div>
            
            <div className="text-center">
              <p className={`text-lg font-semibold ${
                theme === 'synesthesia' ? 'text-purple-500' : 'text-orange-500'
              }`}>
                {karmaPoints}
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Karma Points
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
          theme === 'synesthesia'
            ? 'bg-purple-500 text-white'
            : 'bg-green-500 text-white'
        } animate-fade-in`}>
          Profile updated successfully!
        </div>
      )}

      {/* Name Edit Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="modal-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div 
            className={`modal-content modal-small animate-modal-in ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <Edit size={32} className="mx-auto mb-4 text-orange-500" />
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Login Required
              </h3>
              <p className={`text-sm mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Please log in to update your name.
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

      {/* Profile Picture Login Prompt Modal */}
      {showImageLoginPrompt && (
        <div className="modal-overlay" onClick={() => setShowImageLoginPrompt(false)}>
          <div 
            className={`modal-content modal-small animate-modal-in ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <Camera size={32} className="mx-auto mb-4 text-orange-500" />
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Login Required
              </h3>
              <p className={`text-sm mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Please log in to update your profile picture.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowImageLoginPrompt(false)}
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
    </>
  );
};

export default UserProfile;