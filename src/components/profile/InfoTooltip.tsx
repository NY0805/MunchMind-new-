import React from 'react';
import { X, Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface InfoTooltipProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={`relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`p-6 text-center ${
          theme === 'synesthesia'
            ? 'bg-gradient-to-br from-purple-500 to-indigo-500'
            : 'bg-gradient-to-br from-blue-500 to-indigo-500'
        } text-white`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="mb-4">
            <Info size={32} className="mx-auto mb-2" />
            <h2 className="text-xl font-bold">Nutritional DNA</h2>
          </div>
        </div>
        
        <div className="p-6">
          <p className={`text-sm leading-relaxed mb-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Your Nutritional DNA is a personalized guide to key nutrients your body needs. 
            Tap each segment to discover food rich in that nutrient and get tailored health tips.
          </p>
          
          <div className={`p-4 rounded-lg mb-4 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
          }`}>
            <h4 className={`font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-blue-800'
            }`}>
              How to use:
            </h4>
            <ul className={`text-sm space-y-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-blue-700'
            }`}>
              <li>• Each colored segment represents a different nutrient</li>
              <li>• The fill level shows your current intake vs. goal</li>
              <li>• Lower levels indicate areas for improvement</li>
              <li>• Get personalized food recommendations below</li>
            </ul>
          </div>
          
          <button 
            onClick={onClose}
            className={`w-full py-3 rounded-full font-medium ${
              theme === 'synesthesia'
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } transition-colors`}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoTooltip;