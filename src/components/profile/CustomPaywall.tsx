import React, { useState, useEffect } from 'react';
import { X, Crown, Check, CreditCard } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';

interface CustomPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CustomPaywall: React.FC<CustomPaywallProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const { theme } = useTheme();
  const { setIsPro } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowSuccess(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    
    // Simulate subscription process
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      setIsPro(true);
      
      // Auto close after showing success message
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="modal-overlay">
        <div 
          className={`modal-content modal-medium animate-modal-in ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={32} className="text-green-600" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Successfully Subscribed!
            </h2>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              All premium features are now unlocked.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div 
        className={`w-full max-w-md rounded-lg shadow-lg animate-modal-in ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 text-center relative ${
          theme === 'synesthesia'
            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
            : 'bg-gradient-to-br from-orange-500 to-amber-500'
        } text-white`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            disabled={isProcessing}
          >
            <X size={20} />
          </button>
          
          <Crown size={48} className="mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Unlock Premium</h2>
          <p className="text-white/90 text-sm">Get access to all premium features</p>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Features List */}
          <div className="mb-6">
            <h3 className={`font-semibold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Premium Features:
            </h3>
            <div className="space-y-2">
              {[
                'Toon Bites - Cartoon-inspired recipes',
                'Cinematic Cravings - Movie food experiences', 
                'Dream Meal Generator - AI-powered meal creation',
                'Advanced Nutritional DNA insights',
                'Weekly nutrition reports',
                'Surprise Me feature in Flavor Wheel'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`p-1 rounded-full ${
                    theme === 'synesthesia' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    <Check size={14} className={
                      theme === 'synesthesia' ? 'text-purple-600' : 'text-orange-600'
                    } />
                  </div>
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              id="subscribeButton"
              onClick={handleSubscribe}
              disabled={isProcessing}
              className={`w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 ${
                isProcessing
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : theme === 'synesthesia'
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
              } transition-colors`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  Subscribe Now - $4.99/month
                </>
              )}
            </button>
            
            <button 
              onClick={onClose}
              disabled={isProcessing}
              className={`w-full py-3 rounded-full font-medium ${
                isProcessing
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              } transition-colors`}
            >
              Maybe Later
            </button>
          </div>
          
          {/* Footer note */}
          <p className={`text-xs text-center mt-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Cancel anytime. No commitment required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomPaywall;