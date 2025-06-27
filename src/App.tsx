import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Explore from './pages/Explore';
import RestaurantDetails from './pages/RestaurantDetails';

import TrendingDishDetails from './pages/TrendingDishDetails';
import Profile from './pages/Profile';
import AiChef from './pages/AiChef';
import Favourites from './pages/Favourites';
import Settings from './pages/Settings';
import TodoList from './components/TodoList';
import { ThemeProvider } from './context/ThemeContext';
import { FavouritesProvider } from './context/FavouritesContext';
import { UserProvider, useUser } from './context/UserContext';
import { supabase } from './lib/supabase';

// Loading Screen Component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">MunchMind</h2>
      <p className="text-gray-600">Loading your food journey...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for valid session
    const checkSession = () => {
      const rememberMe = localStorage.getItem('rememberMe');
      const sessionToken = localStorage.getItem('session_token') || sessionStorage.getItem('session_token');
      
      if (rememberMe === 'true' && sessionToken) {
        setIsLoading(false);
        return;
      }
      
      // If no valid session, allow guest access
      setIsLoading(false);
    };

    checkSession();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

// App Content Component
const AppContent = () => {
  const { isAuthenticated } = useUser();
  const [shouldShowLogin, setShouldShowLogin] = useState(true);

  useEffect(() => {
    // Check if user should skip login
    const checkLoginStatus = () => {
      const rememberMe = localStorage.getItem('rememberMe');
      const sessionToken = localStorage.getItem('session_token') || sessionStorage.getItem('session_token');
      
      if (rememberMe === 'true' && sessionToken) {
        setShouldShowLogin(false);
      } else {
        // Allow guest access without forcing login
        setShouldShowLogin(false);
      }
    };

    checkLoginStatus();
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/trending-dish/:id" element={<TrendingDishDetails />} />
        <Route path="/todos" element={
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
              <TodoList />
            </div>
          </div>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="ai-chef" element={<AiChef />} />
          <Route path="favourites" element={<Favourites />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [initialUser, setInitialUser] = useState<any>(null);

  useEffect(() => {
    // Sync Supabase session before rendering app
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (session?.user) {
          setInitialUser(session.user);
          console.log('Session found for user:', session.user.id);
        } else {
          console.log('No active session found');
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, []);

  // Show loading screen while checking session
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <UserProvider initialUser={initialUser}>
        <FavouritesProvider>
          <AppContent />
        </FavouritesProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;