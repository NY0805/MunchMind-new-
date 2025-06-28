import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { loadGoogleMapsAPI } from './utils/googleMapsLoader.ts';

// Load Google Maps API once globally
loadGoogleMapsAPI().catch(console.error);

// RevenueCat SDK types
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

// Initialize app
const initializeApp = async () => {
  // Render the app
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