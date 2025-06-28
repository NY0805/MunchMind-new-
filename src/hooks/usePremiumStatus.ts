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

  // Check entitlements
  const checkEntitlements = async () => {
    setIsLoading(true);
    
    try {
      // Check Supabase for premium status
      if (userId) {
        const { data: premiumData } = await supabase
          .from('unlocked_premium')
          .select('*')
          .eq('user_id', userId)
          .eq('content_type', 'pro_access')
          .limit(1);
          
        // if (premiumData && premiumData.length > 0) {
        //   setIsPremium(true);
        //   setIsLoading(false);
        //   return;
        // }
        if (premiumData && premiumData.length > 0) {
          console.log('✅ Premium detected in Supabase');
          setIsPremium(true);
          return true; // NEW
        }

      }
      
      // Default to not premium
      setIsPremium(false);
    } catch (error) {
      console.warn('❌ Premium status check failed:', error);
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
      // Simulate successful purchase
      setIsPremium(true);
      
      // Save to Supabase if user is valid
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
    } catch (error: any) {
      console.error('❌ Purchase failed:', error);
      return false;
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      // Simulate successful restore
      setIsPremium(true);
      
      // Save to Supabase if user is valid
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
    } catch (error) {
      console.error('❌ Restore failed:', error);
      return false;
    }
  };

  return {
    isPremium,
    isLoading,
    purchasePremium,
    restorePurchases,
    refetch: checkEntitlements
  };
};