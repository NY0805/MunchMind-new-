import React, { useState, useEffect } from 'react';
import { Globe, MapPin } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const streetFoods = [
  {
    id: 1,
    name: 'Takoyaki',
    origin: 'Japan',
    description: 'Ball-shaped snack filled with octopus pieces',
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg'
  },
  {
    id: 2,
    name: 'Pad Thai',
    origin: 'Thailand',
    description: 'Stir-fried rice noodle dish with tofu, eggs, and bean sprouts',
    image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg'
  },
  {
    id: 3,
    name: 'Tacos al Pastor',
    origin: 'Mexico',
    description: 'Spit-grilled pork tacos with pineapple and cilantro',
    image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg'
  },
  {
    id: 4,
    name: 'Falafel',
    origin: 'Middle East',
    description: 'Deep-fried patty made from ground chickpeas',
    image: 'https://images.pexels.com/photos/1618901/pexels-photo-1618901.jpeg'
  }
];

const GlobalStreetFoodRoulette = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFood, setSelectedFood] = useState<typeof streetFoods[0] | null>(null);
  const { theme } = useTheme();
  
  // Disable background scrolling when modal is open
  useEffect(() => {
    if (selectedFood) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedFood]);
  
  const spinGlobe = () => {
    setIsSpinning(true);
    setSelectedFood(null);
    
    // Simulate spinning the globe
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * streetFoods.length);
      setSelectedFood(streetFoods[randomIndex]);
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <div>
      <button
        onClick={spinGlobe}
        disabled={isSpinning}
        className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          theme === 'synesthesia'
            ? 'bg-purple-500 hover:bg-purple-600 text-white'
            : 'bg-orange-500 hover:bg-orange-600 text-white'
        } transition-colors disabled:opacity-50`}
      >
        <Globe size={20} className={isSpinning ? 'animate-spin' : ''} />
        <span>{isSpinning ? 'Spinning...' : 'Spin the Globe'}</span>
      </button>
      
      {selectedFood && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50" style={{ 
          height: '100vh', 
          width: '100vw', 
          top: 0, 
          left: 0,
          padding: '1rem'
        }}>
          <div 
            className={`modal-content modal-medium animate-modal-in ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedFood.image} 
              alt={selectedFood.name} 
              className="w-full h-48 object-cover"
            />
            
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={18} className="text-red-500" />
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {selectedFood.origin}
                </span>
              </div>
              
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {selectedFood.name}
              </h3>
              
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {selectedFood.description}
              </p>
              
              <div className="flex justify-end gap-2">
                <button 
                  className={`px-4 py-2 rounded-full text-sm ${
                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                  onClick={() => setSelectedFood(null)}
                >
                  Close
                </button>
                <button 
                  className={`px-4 py-2 rounded-full text-sm ${
                    theme === 'synesthesia'
                      ? 'bg-purple-500 text-white'
                      : 'bg-orange-500 text-white'
                  }`}
                >
                  Learn Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalStreetFoodRoulette;