import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { 
  SubscriptionContextType, 
  SubscriptionPlan, 
  UserSubscription, 
  UsageLimit 
} from '../types/subscription';
import { subscriptionService } from '../services/subscriptionService';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageLimits, setUsageLimits] = useState<UsageLimit[]>([]);

  useEffect(() => {
    if (user) {
      initializeSubscription();
    } else {
      resetSubscriptionState();
    }
  }, [user]);

  const initializeSubscription = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize subscription service
      await subscriptionService.initialize(user.uid);
      
      // Check subscription status
      await checkSubscriptionStatus();
      
      // Load usage limits
      await getUsageLimits();
    } catch (err: any) {
      setError(err.message || 'Failed to initialize subscription service');
      console.error('Subscription initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    if (!user) return;
    
    try {
      const isActive = await subscriptionService.checkSubscriptionStatus(user.uid);
      setIsPremium(isActive);
      
      if (isActive) {
        const subscription = await subscriptionService.getUserSubscription(user.uid);
        setUserSubscription(subscription);
        
        if (subscription) {
          const plans = await subscriptionService.getAvailablePlans();
          const plan = plans.find(p => p.id === subscription.planId);
          setCurrentPlan(plan || null);
        }
      } else {
        setUserSubscription(null);
        setCurrentPlan(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check subscription status');
      console.error('Subscription status check error:', err);
    }
  };

  const subscribeToPlan = async (planId: string) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to subscribe');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await subscriptionService.subscribeToPlan(user.uid, planId);
      
      // Refresh subscription status
      await checkSubscriptionStatus();
      
      Alert.alert(
        'Subscription Successful!', 
        'Welcome to Study Buddy Pro! You now have access to all premium features.',
        [{ text: 'Great!', style: 'default' }]
      );
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to subscribe to plan';
      setError(errorMessage);
      
      Alert.alert(
        'Subscription Failed', 
        errorMessage,
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!user) return;
    
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        { 
          text: 'Cancel Subscription', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            setError(null);
            
            try {
              await subscriptionService.cancelSubscription(user.uid);
              await checkSubscriptionStatus();
              
              Alert.alert(
                'Subscription Cancelled',
                'Your subscription has been cancelled. You will retain access to premium features until the end of your billing period.',
                [{ text: 'OK', style: 'default' }]
              );
            } catch (err: any) {
              setError(err.message || 'Failed to cancel subscription');
              Alert.alert('Error', err.message || 'Failed to cancel subscription');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const restorePurchases = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await subscriptionService.restorePurchases(user.uid);
      await checkSubscriptionStatus();
      
      if (isPremium) {
        Alert.alert(
          'Purchases Restored!',
          'Your subscription has been restored successfully.',
          [{ text: 'Great!', style: 'default' }]
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'No active subscriptions were found to restore.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to restore purchases');
      Alert.alert('Error', err.message || 'Failed to restore purchases');
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailablePlans = async (): Promise<SubscriptionPlan[]> => {
    try {
      return await subscriptionService.getAvailablePlans();
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subscription plans');
      return [];
    }
  };

  const getUsageLimits = async (): Promise<UsageLimit[]> => {
    if (!user) return [];
    
    try {
      const limits = await subscriptionService.getUsageLimits(user.uid);
      setUsageLimits(limits);
      return limits;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch usage limits');
      return [];
    }
  };

  const canUseFeature = (featureId: string): boolean => {
    if (isPremium) return true;
    
    const limit = usageLimits.find(l => l.feature === featureId);
    return limit ? limit.current < limit.limit : true;
  };

  const incrementUsage = async (featureId: string): Promise<void> => {
    if (!user || isPremium) return;
    
    try {
      await subscriptionService.incrementUsage(user.uid, featureId);
      await getUsageLimits(); // Refresh usage limits
    } catch (err: any) {
      console.error('Failed to increment usage:', err);
    }
  };

  const resetSubscriptionState = () => {
    setCurrentPlan(null);
    setUserSubscription(null);
    setIsPremium(false);
    setUsageLimits([]);
    setError(null);
  };

  const value: SubscriptionContextType = {
    // State
    currentPlan,
    userSubscription,
    isPremium,
    isLoading,
    error,
    usageLimits,
    
    // Actions
    subscribeToPlan,
    cancelSubscription,
    restorePurchases,
    checkSubscriptionStatus,
    getAvailablePlans,
    getUsageLimits,
    canUseFeature,
    incrementUsage
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
