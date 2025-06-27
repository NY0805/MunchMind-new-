import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import BottomNavigation from './BottomNavigation';
import Footer from './Footer';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  return (
    <div className={`min-h-screen flex flex-col ${
      theme === 'synesthesia' 
        ? 'bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100' 
        : theme === 'dark' 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50'
    }`}>
      <button
        onClick={() => navigate('/settings')}
        className={`fixed top-4 right-4 z-40 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
          theme === 'dark'
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Settings size={20} />
      </button>
      
      <main className="flex-1 overflow-auto pb-32">
        <div className="pb-6">
          <Outlet />
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Layout;