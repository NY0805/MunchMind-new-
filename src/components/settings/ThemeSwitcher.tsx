import React from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`rounded-lg overflow-hidden shadow-md ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="p-4">
        <h3 className={`font-semibold text-lg mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Theme Settings
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <button 
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center justify-center p-4 rounded-lg ${
              theme === 'light'
                ? 'bg-orange-100 border-2 border-orange-500'
                : theme === 'dark'
                  ? 'bg-gray-700 border-2 border-transparent'
                  : 'bg-gray-100 border-2 border-transparent'
            } transition-all`}
          >
            <Sun size={24} className="mb-2 text-orange-500" />
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>Light</span>
          </button>
          
          <button 
            onClick={() => setTheme('dark')}
            className={`flex flex-col items-center justify-center p-4 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 border-2 border-orange-500'
                : 'bg-gray-100 border-2 border-transparent'
            } transition-all`}
          >
            <Moon size={24} className="mb-2 text-gray-500" />
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>Dark</span>
          </button>
          
          <button 
            onClick={() => setTheme('synesthesia')}
            className={`flex flex-col items-center justify-center p-4 rounded-lg ${
              theme === 'synesthesia'
                ? 'bg-purple-100 border-2 border-purple-500'
                : theme === 'dark'
                  ? 'bg-gray-700 border-2 border-transparent'
                  : 'bg-gray-100 border-2 border-transparent'
            } transition-all`}
          >
            <Palette size={24} className="mb-2 text-purple-500" />
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>Synesthesia</span>
          </button>
        </div>
        
        <div className={`mt-4 p-3 rounded-lg ${
          theme === 'synesthesia'
            ? 'bg-purple-100 text-purple-800'
            : theme === 'dark'
              ? 'bg-gray-700 text-gray-300'
              : 'bg-orange-50 text-orange-800'
        }`}>
          <p className="text-sm">
            {theme === 'synesthesia' 
              ? 'Synesthesia Mode enabled: Experience a multi-sensory interface where colors enhance flavors.'
              : theme === 'dark'
                ? 'Dark Mode enabled: Easier on the eyes in low-light environments.'
                : 'Light Mode enabled: Classic, clean interface for everyday use.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;