import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, User, ChefHat, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { theme } = useTheme();
  
  // Scroll to top when navigating between pages
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  const getActiveStyles = (path: string) => {
    const isActive = location.pathname === path;
    let baseClasses = 'nav-link flex-1 flex flex-col items-center justify-center';
    
    if (theme === 'synesthesia') {
      return `${baseClasses} ${isActive ? 'text-primary-600 scale-110' : 'text-gray-500 hover:text-primary-400'}`;
    } else if (theme === 'dark') {
      return `${baseClasses} ${isActive ? 'text-primary-400 scale-110' : 'text-gray-400 hover:text-gray-300'}`;
    } else {
      return `${baseClasses} ${isActive ? 'text-primary-500 scale-110' : 'text-gray-500 hover:text-primary-400'}`;
    }
  };

  return (
    <nav className={`fixed bottom-8 w-full h-14 sm:h-16 flex items-center border-t ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } shadow-lg z-40`}>
      <NavLink to="/home" className={getActiveStyles('/home')}>
        <Home size={18} className={`sm:w-5 sm:h-5 ${location.pathname === '/home' ? 'animate-bounce-slow' : ''}`} />
        <span className="mt-1 text-xs sm:text-sm">Home</span>
      </NavLink>
      
      <NavLink to="/explore" className={getActiveStyles('/explore')}>
        <Compass size={18} className={`sm:w-5 sm:h-5 ${location.pathname === '/explore' ? 'animate-spin-slow' : ''}`} />
        <span className="mt-1 text-xs sm:text-sm">Explore</span>
      </NavLink>
      
      <NavLink to="/ai-chef" className={getActiveStyles('/ai-chef')}>
        <ChefHat size={18} className={`sm:w-5 sm:h-5 ${location.pathname === '/ai-chef' ? 'animate-bounce-slow' : ''}`} />
        <span className="mt-1 text-xs sm:text-sm">AI Chef</span>
      </NavLink>
      
      <NavLink to="/favourites" className={getActiveStyles('/favourites')}>
        <Heart size={18} className={`sm:w-5 sm:h-5 ${location.pathname === '/favourites' ? 'animate-bounce-slow' : ''}`} />
        <span className="mt-1 text-xs sm:text-sm">Favourites</span>
      </NavLink>
      
      <NavLink to="/profile" className={getActiveStyles('/profile')}>
        <User size={18} className={`sm:w-5 sm:h-5 ${location.pathname === '/profile' ? 'animate-bounce-slow' : ''}`} />
        <span className="mt-1 text-xs sm:text-sm">Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNavigation;