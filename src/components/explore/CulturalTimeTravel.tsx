import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const historicalDishes = [
  {
    id: 1,
    name: 'Roman Libum',
    era: 'Ancient Rome, 1st Century',
    description: 'A cheesecake-like offering to household gods.',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'
  },
  {
    id: 2,
    name: 'Medieval Pottage',
    era: 'Medieval Europe, 13th Century',
    description: 'A thick vegetable and grain soup, staple of peasant diet.',
    image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg'
  },
  {
    id: 3,
    name: 'Victorian Trifle',
    era: 'Victorian England, 19th Century',
    description: 'Elaborate layered dessert of sponge, custard, and fruits.',
    image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg'
  },
  {
    id: 4,
    name: 'Aztec Pozole',
    era: 'Pre-Columbian Mexico, 15th Century',
    description: 'Ancient hominy stew with ritual significance.',
    image: 'https://images.pexels.com/photos/5835353/pexels-photo-5835353.jpeg'
  },
  {
    id: 5,
    name: 'Tang Dynasty Dumplings',
    era: 'Tang Dynasty China, 8th Century',
    description: 'Ornate dumplings filled with spiced meats and vegetables.',
    image: 'https://images.pexels.com/photos/955137/pexels-photo-955137.jpeg'
  }
];

const CulturalTimeTravel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto hide-scrollbar gap-4 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {historicalDishes.map((dish) => (
          <div 
            key={dish.id} 
            className={`flex-none w-72 rounded-lg overflow-hidden shadow-md ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="h-40 relative">
              <img 
                src={dish.image} 
                alt={dish.name} 
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                theme === 'synesthesia' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-orange-500 text-white'
              }`}>
                <Clock size={12} />
                <span>{dish.era}</span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className={`font-semibold text-lg mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {dish.name}
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {dish.description}
              </p>
              
              <button 
                className={`mt-3 text-sm font-medium px-3 py-1 rounded-full ${
                  theme === 'synesthesia'
                    ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-orange-400 hover:bg-gray-600'
                      : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                } transition-colors`}
              >
                Time Travel
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white text-gray-800 shadow-md z-10"
      >
        <ChevronLeft size={20} />
      </button>
      
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white text-gray-800 shadow-md z-10"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default CulturalTimeTravel;