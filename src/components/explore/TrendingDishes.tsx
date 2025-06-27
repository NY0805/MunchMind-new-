import React from 'react';
import { TrendingUp, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const trendingDishes = [
  {
    id: 1,
    name: 'Birria Tacos',
    origin: 'Mexico',
    trend: 'Up 85% this month',
    image: 'https://images.pexels.com/photos/5737242/pexels-photo-5737242.jpeg'
  },
  {
    id: 2,
    name: 'Dalgona Coffee',
    origin: 'South Korea',
    trend: 'Up 120% this month',
    image: 'https://images.pexels.com/photos/4790070/pexels-photo-4790070.jpeg'
  },
  {
    id: 3,
    name: 'Baked Feta Pasta',
    origin: 'Finland',
    trend: 'Up 75% this month',
    image: 'https://images.pexels.com/photos/6541191/pexels-photo-6541191.jpeg'
  }
];

const TrendingDishes = () => {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {trendingDishes.map((dish) => (
        <div 
          key={dish.id} 
          className={`rounded-lg overflow-hidden shadow-md ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="relative h-48">
            <img 
              src={dish.image} 
              alt={dish.name} 
              className="w-full h-full object-cover"
            />
            <button 
              className={`absolute top-2 right-2 p-2 rounded-full ${
                theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/70'
              }`}
            >
              <Heart size={18} className="text-gray-600" />
            </button>
          </div>
          
          <div className="p-4">
            <h3 className={`font-semibold text-lg ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              {dish.name}
            </h3>
            
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {dish.origin}
            </p>
            
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
              theme === 'synesthesia' ? 'text-purple-500' : 'text-orange-500'
            }`}>
              <TrendingUp size={14} />
              <span>{dish.trend}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingDishes;