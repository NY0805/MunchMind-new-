import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { usePremiumStatus } from '../hooks/usePremiumStatus';

interface UserContextType {
  user: any;
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
  isLoadingProStatus: boolean;
  checkProStatus: () => Promise<void>;
  showPaywall: () => Promise<boolean>;
  dietaryPreferences: {
    dietType: string;
    allergies: string[];
    dislikes: string[];
  };
  setDietaryPreferences: (preferences: any) => void;
  connectedDevices: Array<{
    id: number;
    name: string;
    connected: boolean;
  }>;
  setConnectedDevices: (devices: any) => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isValidUser: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children, initialUser }: { children: ReactNode; initialUser?: any }) => {
  const [user, setUser] = useState<any>(initialUser || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialUser);
  const [dietaryPreferences, setDietaryPreferences] = useState({
    dietType: 'flexitarian',
    allergies: [] as string[],
    dislikes: [] as string[],
  });
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 1, name: 'Smart Refrigerator', connected: true },
    { id: 2, name: 'Mood Sensor Band', connected: true },
    { id: 3, name: 'Smart Body Weight Scale', connected: false }
  ]);

  // Use the RevenueCat premium status hook
  const { isPremium, isLoading: isLoadingProStatus, refetch: refetchPremiumStatus } = usePremiumStatus(user?.id);
  const [isPro, setIsPro] = useState(isPremium);

  // Update isPro when premium status changes
  useEffect(() => {
    setIsPro(isPremium);
  }, [isPremium]);

  // Check if user is valid for Supabase operations
  const isValidUser = (): boolean => {
    return !!(user && !user.is_guest && isAuthenticated && user.id && !user.id.startsWith('guest-'));
  };

  // Check if session is expired (for remember me functionality)
  const isSessionExpired = (): boolean => {
    const sessionExpires = localStorage.getItem('session_expires');
    if (!sessionExpires) return false;
    return Date.now() > parseInt(sessionExpires);
  };

  const createGuestUser = () => {
    const guestUser = {
      id: 'guest-' + Date.now(),
      email: 'guest@example.com',
      user_metadata: { name: 'Guest' },
      created_at: new Date().toISOString(),
      is_guest: true
    };
    return guestUser;
  };

  const checkRememberMe = () => {
    const rememberMe = localStorage.getItem('rememberMe');
    const sessionToken = localStorage.getItem('session_token') || sessionStorage.getItem('session_token');
    const userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
    
    return {
      shouldRemember: rememberMe === 'true',
      hasValidSession: !!(sessionToken && userId && !isSessionExpired()),
      sessionToken,
      userId
    };
  };

  const identifyWithRevenueCat = async (userId: string) => {
    // Wait for RevenueCat to be available
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds max wait
    
    while (!window.Purchases && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (window.Purchases) {
      try {
        await window.Purchases.identify(userId);
        console.log('✅ RevenueCat user identified:', userId);
      } catch (error) {
        console.error('❌ Failed to identify RevenueCat user:', error);
      }
    } else {
      console.warn('⚠️ RevenueCat not available for user identification');
    }
  };

  const signIn = async () => {
    try {
      // Check for existing session first
      const { shouldRemember, hasValidSession, sessionToken, userId } = checkRememberMe();
      
      if (hasValidSession && shouldRemember) {
        // Try to restore session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Accept user regardless of email confirmation status
          setUser(session.user);
          setIsAuthenticated(true);
          await loadUserProfile(session.user.id);
          
          // Initialize RevenueCat with user ID
          await identifyWithRevenueCat(session.user.id);
          
          return;
        }
      }

      // If no valid session, create a guest user
      const guestUser = createGuestUser();
      setUser(guestUser);
      setIsAuthenticated(true);
      loadGuestPreferences();
    } catch (error) {
      console.error('Sign in failed:', error);
      
      // Fallback to guest user
      const guestUser = createGuestUser();
      setUser(guestUser);
      setIsAuthenticated(true);
      loadGuestPreferences();
    }
  };

  const signOut = async () => {
    try {
      // Only sign out from Supabase if user is valid
      if (isValidUser()) {
        await supabase.auth.signOut();
      }
      
      // Clear all session data
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('user_id');
      localStorage.removeItem('session_token');
      localStorage.removeItem('session_expires');
      sessionStorage.removeItem('user_id');
      sessionStorage.removeItem('session_token');
      sessionStorage.removeItem('userRegistrationDate');
      
      setUser(null);
      setIsAuthenticated(false);
      setIsPro(false);
      
      // Reset to defaults for new users
      setDietaryPreferences({
        dietType: 'flexitarian',
        allergies: [],
        dislikes: [],
      });
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      // Use select() with limit(1) to handle multiple rows efficiently
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .limit(1); // ✅ Prevents 406 error and optimizes query

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      if (profiles && profiles.length > 0) {
        const profile = profiles[0];
        setDietaryPreferences({
          dietType: profile.diet_type || 'flexitarian',
          allergies: profile.allergies || [],
          dislikes: profile.dislikes || [],
        });
      } else {
        // For new users, keep empty defaults
        setDietaryPreferences({
          dietType: 'flexitarian',
          allergies: [],
          dislikes: [],
        });
      }
      
      // Check for premium status in Supabase
      const { data: premiumData } = await supabase
        .from('unlocked_premium')
        .select('*')
        .eq('user_id', userId)
        .eq('content_type', 'pro_access')
        .limit(1);
        
      if (premiumData && premiumData.length > 0) {
        setIsPro(true);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const loadGuestPreferences = () => {
    try {
      const savedPreferences = localStorage.getItem('guestDietaryPreferences');
      if (savedPreferences) {
        setDietaryPreferences(JSON.parse(savedPreferences));
      } else {
        // For new guest users, keep empty defaults
        setDietaryPreferences({
          dietType: 'flexitarian',
          allergies: [],
          dislikes: [],
        });
      }
    } catch (error) {
      console.error('Failed to load guest preferences:', error);
    }
  };

  const saveGuestPreferences = (preferences: any) => {
    try {
      localStorage.setItem('guestDietaryPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save guest preferences:', error);
    }
  };

  const checkProStatus = async () => {
    // await refetchPremiumStatus();
    // setIsPro(isPremium);
    const result = await refetchPremiumStatus(); 
    setIsPro(result);
  };

  const showPaywall = async (): Promise<boolean> => {
    try {
      // Simulate successful purchase
      setIsPro(true);
      
      // Save to Supabase if user is valid
      if (isValidUser()) {
        try {
          await supabase
            .from('unlocked_premium')
            .upsert({
              user_id: user.id,
              content_type: 'pro_access',
              content_id: 1,
              unlocked_at: new Date().toISOString()
            });
        } catch (error) {
          console.error('Failed to save premium status to Supabase:', error);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Failed to show paywall:', error);
      return false;
    }
  };

  // Initialize on app start
  useEffect(() => {
    const initializeUser = async () => {
      // If we have an initial user from session, use it
      if (initialUser) {
        // Accept user regardless of email confirmation status
        setUser(initialUser);
        setIsAuthenticated(true);
        await loadUserProfile(initialUser.id);
        
        // Store registration date if not already stored
        if (!localStorage.getItem('userRegistrationDate')) {
          localStorage.setItem('userRegistrationDate', initialUser.created_at);
        }
      } else {
        const { shouldRemember, hasValidSession } = checkRememberMe();
        
        if (hasValidSession && shouldRemember) {
          // Check for existing session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // Accept user regardless of email confirmation status
            setUser(session.user);
            setIsAuthenticated(true);
            await loadUserProfile(session.user.id);
          } else {
            // Create guest user if no valid session
            await signIn();
          }
        } else {
          // Create guest user for new visitors
          await signIn();
        }
      }
    };

    initializeUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Accept user regardless of email confirmation status
          setUser(session.user);
          setIsAuthenticated(true);
          await loadUserProfile(session.user.id);
          
          // Store registration date for new users
          if (!localStorage.getItem('userRegistrationDate')) {
            localStorage.setItem('userRegistrationDate', session.user.created_at);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
          setIsPro(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [initialUser]);

  return (
    <UserContext.Provider value={{
      user,
      isPro,
      setIsPro,
      isLoadingProStatus,
      checkProStatus,
      showPaywall,
      dietaryPreferences,
      setDietaryPreferences,
      connectedDevices,
      setConnectedDevices,
      signIn,
      signOut,
      isAuthenticated,
      isValidUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};