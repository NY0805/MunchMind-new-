import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { loadGoogleMapsAPI } from './utils/googleMapsLoader.ts';

// Load Google Maps API once globally
loadGoogleMapsAPI().catch(console.error);

// RevenueCat Web SDK types
declare global {
  interface Window {
    Purchases?: {
      configure: (config: { apiKey: string; appUserID?: string }) => void;
      setDebugLogsEnabled: (enabled: boolean) => void;
      getOfferings: () => Promise<any>;
      purchasePackage: (packageObj: any) => Promise<any>;
      restorePurchases: () => Promise<any>;
      getCustomerInfo: () => Promise<any>;
      identify: (userId: string) => Promise<void>;
      logIn: (userId: string) => Promise<any>;
      logOut: () => Promise<any>;
    };
  }
}

// Load RevenueCat SDK v5 with proper error handling
const loadRevenueCatSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.Purchases) {
      console.log('✅ RevenueCat SDK already loaded');
      resolve();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="revenuecat-web"]');
    if (existingScript) {
      console.log('⏳ RevenueCat SDK already loading...');
      existingScript.addEventListener('load', () => {
        console.log('✅ RevenueCat SDK loaded from existing script');
        resolve();
      });
      existingScript.addEventListener('error', (error) => {
        console.error('❌ RevenueCat SDK loading error from existing script:', error);
        reject(new Error('Failed to load RevenueCat SDK'));
      });
      return;
    }

    try {
      console.log('🔄 Loading RevenueCat Web SDK v5...');
      const script = document.createElement('script');
      script.src = 'https://js.revenuecat.com/v5/revenuecat-web.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('✅ RevenueCat SDK loaded successfully');
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('❌ RevenueCat SDK loading error:', error);
        console.error('This might be due to CORS restrictions in the preview environment');
        console.error('The SDK should work correctly in the deployed version');
        reject(new Error('Failed to load RevenueCat SDK'));
      };
      
      // Add script to head
      document.head.appendChild(script);
      console.log('📝 RevenueCat script added to document head');
      
    } catch (error) {
      console.error('❌ Error creating RevenueCat script:', error);
      reject(error);
    }
  });
};

// Initialize app
const initializeApp = async () => {
  try {
    // Load RevenueCat SDK first
    console.log('🚀 Initializing RevenueCat SDK...');
    await loadRevenueCatSDK();
    console.log('✅ RevenueCat SDK initialization complete');
  } catch (error) {
    console.error('❌ RevenueCat SDK loading error:', error);
    console.warn('⚠️ Continuing without RevenueCat - app should still work');
    console.warn('Note: This is expected in preview environments due to CORS restrictions');
  }
  
  // Render the app regardless of RevenueCat status
  console.log('🎨 Rendering React app...');
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('✅ App initialization complete');
};

// Start the app
initializeApp();