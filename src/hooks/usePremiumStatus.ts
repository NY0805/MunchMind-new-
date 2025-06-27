import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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

const ENTITLEMENT_ID = 'pro_access';

export const usePremiumStatus = (userId?: string) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Configure RevenueCat when hook initializes
  useEffect(() => {
    const configureRevenueCat = async () => {
      // Wait for RevenueCat to be available with timeout
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      
      while (!window.Purchases && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (window.Purchases) {
        try {
          console.log('🔧 Configuring RevenueCat...');
          
          // Configure with API key and user ID
          window.Purchases.configure({
            apiKey: 'goog_psfhogJjumWVqcNbdCOVVhSVhzZ',
            appUserID: userId
          });

          // Set debug logs for development
          if (import.meta.env.DEV) {
            window.Purchases.setDebugLogsEnabled(true);
          }

          console.log('✅ RevenueCat configured successfully');
        } catch (error) {
          console.error('❌ Failed to configure RevenueCat:', error);
        }
      } else {
        console.warn('⚠️ RevenueCat SDK not available after waiting');
      }
    };

    configureRevenueCat();
  }, [userId]);

  const checkEntitlements = async () => {
    setIsLoading(true);
    
    try {
      if (window.Purchases) {
        const customerInfo = await window.Purchases.getCustomerInfo();
        const premiumActive = customerInfo.entitlements?.active?.[ENTITLEMENT_ID];
        const hasEntitlement = !!premiumActive;
        
        setIsPremium(hasEntitlement);
        console.log('🔍 RevenueCat entitlement check:', hasEntitlement);

        // Save to Supabase if user is valid and has premium
        if (userId && hasEntitlement) {
          try {
            await supabase
              .from('unlocked_premium')
              .upsert({
                user_id: userId,
                content_type: 'pro_access',
                content_id: 1,
                unlocked_at: new Date().toISOString()
              });
          } catch (error) {
            console.error('Failed to save premium status to Supabase:', error);
          }
        }
      } else {
        console.warn('⚠️ RevenueCat SDK not loaded, defaulting to free tier');
        setIsPremium(false);
      }
    } catch (error) {
      console.warn('❌ RevenueCat check failed:', error);
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check entitlements when user changes
  useEffect(() => {
    if (userId) {
      checkEntitlements();
    } else {
      setIsPremium(false);
      setIsLoading(false);
    }
  }, [userId]);

  const purchasePremium = async (): Promise<boolean> => {
    try {
      if (!window.Purchases) {
        throw new Error('RevenueCat SDK not available');
      }

      console.log('🛒 Starting purchase flow...');

      // Get available offerings
      const offerings = await window.Purchases.getOfferings();
      const currentOffering = offerings.current;

      if (!currentOffering?.availablePackages?.length) {
        throw new Error('No packages available for purchase');
      }

      // Purchase the first available package
      const packageToPurchase = currentOffering.availablePackages[0];
      console.log('📦 Purchasing package:', packageToPurchase.identifier);

      const purchaseResult = await window.Purchases.purchasePackage(packageToPurchase);
      
      // Check if the entitlement is now active
      const premiumActive = purchaseResult.customerInfo.entitlements.active[ENTITLEMENT_ID];
      
      if (premiumActive) {
        setIsPremium(true);
        console.log('✅ Purchase successful, premium unlocked');
        
        // Save to Supabase
        if (userId) {
          try {
            await supabase
              .from('unlocked_premium')
              .upsert({
                user_id: userId,
                content_type: 'pro_access',
                content_id: 1,
                unlocked_at: new Date().toISOString()
              });
          } catch (error) {
            console.error('Failed to save subscription to Supabase:', error);
          }
        }
        
        return true;
      } else {
        throw new Error('Purchase completed but entitlement not active');
      }
    } catch (error: any) {
      console.error('❌ Purchase failed:', error);
      
      // Handle user cancellation gracefully
      if (error.message?.includes('cancelled') || error.message?.includes('canceled')) {
        console.log('🚫 Purchase cancelled by user');
        return false;
      }
      
      throw error;
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      if (!window.Purchases) {
        throw new Error('RevenueCat SDK not available');
      }

      console.log('🔄 Restoring purchases...');
      
      const customerInfo = await window.Purchases.restorePurchases();
      const premiumActive = customerInfo.entitlements?.active?.[ENTITLEMENT_ID];
      const hasEntitlement = !!premiumActive;
      
      setIsPremium(hasEntitlement);
      
      if (hasEntitlement) {
        console.log('✅ Purchases restored successfully');
        
        // Save to Supabase
        if (userId) {
          try {
            await supabase
              .from('unlocked_premium')
              .upsert({
                user_id: userId,
                content_type: 'pro_access',
                content_id: 1,
                unlocked_at: new Date().toISOString()
              });
          } catch (error) {
            console.error('Failed to save restored subscription to Supabase:', error);
          }
        }
        
        return true;
      } else {
        console.log('ℹ️ No active purchases found to restore');
        return false;
      }
    } catch (error) {
      console.error('❌ Restore failed:', error);
      return false;
    }
  };

  return {
    isPremium,
    isLoading,
    purchasePremium,
    restorePurchases
  };
};