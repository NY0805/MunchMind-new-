import React from 'react';
import { Smile, Frown, Zap, Coffee, ThumbsUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface MoodDetectorProps {
  onMoodChange: (mood: string) => void;
  currentMood: string;
}

const MoodDetector: React.FC<MoodDetectorProps> = ({ onMoodChange, currentMood }) => {
  const { theme } = useTheme();
  
  const moods = [
    { id: 'happy', icon: <Smile size={18} className="sm:w-5 sm:h-5" />, label: 'Happy' },
    { id: 'sad', icon: <Frown size={18} className="sm:w-5 sm:h-5" />, label: 'Comfort' },
    { id: 'energetic', icon: <Zap size={18} className="sm:w-5 sm:h-5" />, label: 'Energetic' },
    { id: 'tired', icon: <Coffee size={18} className="sm:w-5 sm:h-5" />, label: 'Tired' },
    { id: 'neutral', icon: <ThumbsUp size={18} className="sm:w-5 sm:h-5" />, label: 'Anything' }
  ];

  return (
    <div className={`responsive-card rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <h3 className={`text-base sm:text-lg font-medium mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
        How are you feeling today?
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onMoodChange(mood.id)}
            className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full transition-all duration-300 text-sm ${
              currentMood === mood.id
                ? theme === 'synesthesia'
                  ? 'bg-primary-500 text-white scale-105'
                  : 'bg-secondary-500 text-white scale-105'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {mood.icon}
            <span className="text-xs sm:text-sm">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodDetector;