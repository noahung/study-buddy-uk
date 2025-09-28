import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { Platform } from 'react-native';
import { db } from './firebase';
import { 
  SubscriptionPlan, 
  UserSubscription, 
  UsageLimit, 
  BillingHistory,
  SubscriptionAnalytics 
} from '../types/subscription';
import * as InAppPurchases from 'expo-in-app-purchases';
import Purchases from 'react-native-purchases';

// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Study Buddy Pro Monthly',
    description: 'Unlimited access to all premium features',
    price: 9.99,
    currency: 'GBP',
    interval: 'monthly',
    features: [
      'Unlimited AI chat sessions',
      'Advanced study analytics',
      'AI-generated flashcards',
      'AI note summarisation',
      'Priority support',
      'Unlimited storage',
      'Advanced revision tools',
      'Personalised study plans'
    ],
    productId: 'study_buddy_pro_monthly'
  },
  {
    id: 'yearly',
    name: 'Study Buddy Pro Yearly',
    description: 'Best value - Save 50% with yearly subscription',
    price: 59.99,
    currency: 'GBP',
    interval: 'yearly',
    savings: 50,
    popular: true,
    features: [
      'Everything in Monthly',
      '50% savings',
      'Priority feature access',
      'Exclusive content',
      'Advanced analytics dashboard',
      'Export capabilities',
      'Study streak tracking',
      'Achievement badges'
    ],
    productId: 'study_buddy_pro_yearly'
  },
  {
    id: 'lifetime',
    name: 'Study Buddy Pro Lifetime',
    description: 'One-time payment, lifetime access',
    price: 199.99,
    currency: 'GBP',
    interval: 'lifetime',
    features: [
      'Everything in Yearly',
      'One-time payment',
      'Lifetime updates',
      'Premium support',
      'Early access to new features',
      'Custom study themes',
      'Advanced export options',
      'Priority bug fixes'
    ],
    productId: 'study_buddy_pro_lifetime'
  }
];

// Usage Limits for Free Users
export const FREE_USAGE_LIMITS = {
  aiChatSessions: { limit: 10, resetPeriod: 'daily' },
  aiFlashcards: { limit: 5, resetPeriod: 'daily' },
  aiNoteSummaries: { limit: 3, resetPeriod: 'daily' },
  studyPlans: { limit: 1, resetPeriod: 'weekly' },
  analyticsViews: { limit: 5, resetPeriod: 'daily' },
  storage: { limit: 100, resetPeriod: 'monthly' } // MB
};

class SubscriptionService {
  private isInitialized = false;

  async initialize(userId: string): Promise<void> {
    try {
      // Initialize RevenueCat (for cross-platform purchases)
      await Purchases.configure({
        apiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || 'your_revenue_cat_api_key'
      });
      
      // Set user ID for RevenueCat
      await Purchases.logIn(userId);
      
      // Initialize Expo In-App Purchases as fallback
      await InAppPurchases.connectAsync();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize subscription service:', error);
      throw error;
    }
  }

  async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    try {
      const plansRef = collection(db, 'subscriptionPlans');
      const snapshot = await getDocs(plansRef);
      
      if (snapshot.empty) {
        // Return default plans if none in database
        return SUBSCRIPTION_PLANS;
      }
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SubscriptionPlan[];
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return SUBSCRIPTION_PLANS;
    }
  }

  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const subscriptionRef = doc(db, 'userSubscriptions', userId);
      const snapshot = await getDoc(subscriptionRef);
      
      if (!snapshot.exists()) {
        return null;
      }
      
      const data = snapshot.data();
      return {
        id: snapshot.id,
        ...data,
        startDate: data.startDate.toDate(),
        endDate: data.endDate?.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as UserSubscription;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }

  async subscribeToPlan(userId: string, planId: string): Promise<void> {
    try {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Invalid subscription plan');
      }

      // Purchase through RevenueCat
      const { customerInfo } = await Purchases.purchasePackage(plan.productId);
      
      if (customerInfo.entitlements.active[plan.productId]) {
        // Purchase successful, update user subscription
        await this.updateUserSubscription(userId, plan, customerInfo.originalPurchaseDate);
      } else {
        throw new Error('Purchase failed');
      }
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      throw error;
    }
  }

  private async updateUserSubscription(
    userId: string, 
    plan: SubscriptionPlan, 
    purchaseDate: string
  ): Promise<void> {
    try {
      const startDate = new Date(purchaseDate);
      const endDate = this.calculateEndDate(startDate, plan.interval);
      
      const subscriptionData: Partial<UserSubscription> = {
        userId,
        planId: plan.id,
        status: 'active',
        startDate,
        endDate,
        autoRenew: plan.interval !== 'lifetime',
        platform: Platform.OS as 'ios' | 'android',
        transactionId: `${Date.now()}_${userId}`,
        updatedAt: serverTimestamp()
      };

      const subscriptionRef = doc(db, 'userSubscriptions', userId);
      await setDoc(subscriptionRef, subscriptionData, { merge: true });

      // Record billing history
      await this.recordBillingHistory(userId, plan, purchaseDate);
    } catch (error) {
      console.error('Error updating user subscription:', error);
      throw error;
    }
  }

  private calculateEndDate(startDate: Date, interval: string): Date | undefined {
    if (interval === 'lifetime') {
      return undefined;
    }
    
    const endDate = new Date(startDate);
    if (interval === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (interval === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    return endDate;
  }

  async cancelSubscription(userId: string): Promise<void> {
    try {
      // Cancel through RevenueCat
      await Purchases.logOut();
      
      // Update subscription status in Firestore
      const subscriptionRef = doc(db, 'userSubscriptions', userId);
      await updateDoc(subscriptionRef, {
        status: 'cancelled',
        autoRenew: false,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  async restorePurchases(userId: string): Promise<void> {
    try {
      const { customerInfo } = await Purchases.restorePurchases();
      
      // Check for active entitlements and update subscription
      for (const plan of SUBSCRIPTION_PLANS) {
        if (customerInfo.entitlements.active[plan.productId]) {
          await this.updateUserSubscription(userId, plan, customerInfo.originalPurchaseDate);
          break;
        }
      }
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  }

  async checkSubscriptionStatus(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) {
        return false;
      }

      // Check if subscription is still valid
      if (subscription.status === 'active') {
        if (subscription.endDate && new Date() > subscription.endDate) {
          // Subscription expired
          await this.expireSubscription(userId);
          return false;
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  private async expireSubscription(userId: string): Promise<void> {
    try {
      const subscriptionRef = doc(db, 'userSubscriptions', userId);
      await updateDoc(subscriptionRef, {
        status: 'expired',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error expiring subscription:', error);
    }
  }

  async getUsageLimits(userId: string): Promise<UsageLimit[]> {
    try {
      const limitsRef = collection(db, 'userUsageLimits');
      const q = query(
        limitsRef,
        where('userId', '==', userId),
        orderBy('resetDate', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const limits: UsageLimit[] = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        limits.push({
          feature: data.feature,
          current: data.current,
          limit: data.limit,
          resetDate: data.resetDate?.toDate()
        });
      });
      
      return limits;
    } catch (error) {
      console.error('Error fetching usage limits:', error);
      return [];
    }
  }

  async canUseFeature(userId: string, featureId: string): Promise<boolean> {
    try {
      const isPremium = await this.checkSubscriptionStatus(userId);
      if (isPremium) {
        return true; // Premium users have unlimited access
      }

      const limits = await this.getUsageLimits(userId);
      const featureLimit = limits.find(l => l.feature === featureId);
      
      if (!featureLimit) {
        return true; // No limit set
      }
      
      return featureLimit.current < featureLimit.limit;
    } catch (error) {
      console.error('Error checking feature usage:', error);
      return false;
    }
  }

  async incrementUsage(userId: string, featureId: string): Promise<void> {
    try {
      const isPremium = await this.checkSubscriptionStatus(userId);
      if (isPremium) {
        return; // Premium users don't have usage limits
      }

      const limitsRef = collection(db, 'userUsageLimits');
      const limitDocRef = doc(limitsRef, `${userId}_${featureId}`);
      
      const limitDoc = await getDoc(limitDocRef);
      if (limitDoc.exists()) {
        const data = limitDoc.data();
        await updateDoc(limitDocRef, {
          current: data.current + 1,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new usage limit
        const freeLimit = FREE_USAGE_LIMITS[featureId as keyof typeof FREE_USAGE_LIMITS];
        if (freeLimit) {
          await setDoc(limitDocRef, {
            userId,
            feature: featureId,
            current: 1,
            limit: freeLimit.limit,
            resetDate: this.getNextResetDate(freeLimit.resetPeriod),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  }

  private getNextResetDate(resetPeriod: string): Date {
    const now = new Date();
    const resetDate = new Date(now);
    
    switch (resetPeriod) {
      case 'daily':
        resetDate.setDate(now.getDate() + 1);
        resetDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        resetDate.setDate(now.getDate() + 7);
        resetDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        resetDate.setMonth(now.getMonth() + 1);
        resetDate.setHours(0, 0, 0, 0);
        break;
    }
    
    return resetDate;
  }

  private async recordBillingHistory(
    userId: string, 
    plan: SubscriptionPlan, 
    purchaseDate: string
  ): Promise<void> {
    try {
      const billingRef = doc(collection(db, 'billingHistory'));
      await setDoc(billingRef, {
        userId,
        amount: plan.price,
        currency: plan.currency,
        description: `Subscription: ${plan.name}`,
        date: new Date(purchaseDate),
        status: 'completed',
        transactionId: `${Date.now()}_${userId}`,
        subscriptionId: plan.id,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error recording billing history:', error);
    }
  }

  async getSubscriptionAnalytics(): Promise<SubscriptionAnalytics> {
    try {
      // This would typically be calculated from your analytics data
      // For now, return mock data
      return {
        totalRevenue: 0,
        monthlyRecurringRevenue: 0,
        activeSubscribers: 0,
        conversionRate: 0,
        churnRate: 0,
        averageRevenuePerUser: 0
      };
    } catch (error) {
      console.error('Error fetching subscription analytics:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    try {
      if (this.isInitialized) {
        await InAppPurchases.disconnectAsync();
      }
    } catch (error) {
      console.error('Error cleaning up subscription service:', error);
    }
  }
}

export const subscriptionService = new SubscriptionService();
