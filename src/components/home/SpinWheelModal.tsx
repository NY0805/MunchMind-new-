import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Crown, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import CustomPaywall from '../profile/CustomPaywall';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpin: (filters: any) => void;
}

const SpinWheelModal: React.FC<SpinWheelModalProps> = ({ isOpen, onClose, onSpin }) => {
  const [mealType, setMealType] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [flavour, setFlavour] = useState('');
  const [surpriseMe, setSurpriseMe] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const { theme } = useTheme();
  const { isPro, isLoadingProStatus, checkProStatus, user, isAuthenticated } = useUser();
  const navigate = useNavigate();

  // Check if user is guest or not logged in - lock premium features
  const isGuest = !isAuthenticated || !user || user.is_guest;
  const hasAccess = !isGuest && isPro;

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Clear previous selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setMealType('');
      setCookingTime('');
      setFlavour('');
      setSurpriseMe(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSurpriseMeToggle = () => {
    if (isGuest) {
      // Show login required message and redirect
      alert('Please log in to subscribe and access premium features.');
      onClose();
      navigate('/login');
      return;
    }
    
    if (!hasAccess || isLoadingProStatus) {
      setShowPaywall(true);
      return;
    }
    setSurpriseMe(!surpriseMe);
  };

  const handleSpin = () => {
    setIsSpinning(true);
    
    setTimeout(() => {
      onSpin({
        mealType,
        cookingTime,
        flavour,
        surpriseMe: hasAccess ? surpriseMe : false
      });
      setIsSpinning(false);
      onClose();
    }, 2000);
  };

  const handlePaywallSuccess = async () => {
    setShowPaywall(false);
    // Refresh pro status
    await checkProStatus();
    setSurpriseMe(true);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div 
          className={`modal-content modal-small animate-modal-in ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`p-4 text-center ${
            theme === 'synesthesia'
              ? 'bg-gradient-to-br from-purple-500 to-pink-500'
              : 'bg-gradient-to-br from-orange-500 to-amber-500'
          } text-white`}>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X size={18} />
            </button>
            
            <RotateCcw size={28} className="mx-auto mb-2" />
            <h2 className="text-lg font-bold">Spin the Flavor Wheel</h2>
            <p className="text-white/90 text-sm">Customize your food discovery</p>
          </div>
          
          <div className="p-4">
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-700'
                }`}>
                  Meal Type
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className={`w-full p-2 rounded-lg border text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-gray-50 text-gray-800 border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-orange-400`}
                >
                  <option value="">Any</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-700'
                }`}>
                  Cooking Time
                </label>
                <select
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  className={`w-full p-2 rounded-lg border text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-gray-50 text-gray-800 border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-orange-400`}
                >
                  <option value="">Any</option>
                  <option value="quick">Quick (Under 15 min)</option>
                  <option value="medium">Medium (15-30 min)</option>
                  <option value="long">Long (30+ min)</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-700'
                }`}>
                  Flavour Profile
                </label>
                <select
                  value={flavour}
                  onChange={(e) => setFlavour(e.target.value)}
                  className={`w-full p-2 rounded-lg border text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-gray-50 text-gray-800 border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-orange-400`}
                >
                  <option value="">Any</option>
                  <option value="sweet">Sweet</option>
                  <option value="savory">Savory</option>
                  <option value="spicy">Spicy</option>
                  <option value="fresh">Fresh</option>
                  <option value="comfort">Comfort</option>
                </select>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } ${(!hasAccess || isGuest) ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}>
                    Surprise Me
                  </span>
                  {(!hasAccess || isGuest) && !isLoadingProStatus && <Crown size={14} className="text-amber-500" />}
                  {isLoadingProStatus && (
                    <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
                
                <div 
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                    surpriseMe && hasAccess
                      ? theme === 'synesthesia' ? 'bg-purple-500' : 'bg-orange-500'
                      : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                  } ${(!hasAccess || isGuest || isLoadingProStatus) ? 'opacity-50' : ''}`}
                  onClick={handleSurpriseMeToggle}
                >
                  <div 
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                      surpriseMe && hasAccess ? 'left-5' : 'left-0.5'
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSpin}
              disabled={isSpinning}
              className={`mt-4 w-full py-2 rounded-full font-semibold transition-all duration-200 text-sm ${
                isSpinning
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : theme === 'synesthesia'
                    ? 'bg-purple-500 hover:bg-purple-600 text-white transform hover:scale-105'
                    : 'bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-105'
              }`}
            >
              {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
            </button>
          </div>
        </div>
      </div>

      <CustomPaywall 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)}
        onSuccess={handlePaywallSuccess}
      />
    </>
  );
};

export default SpinWheelModal;