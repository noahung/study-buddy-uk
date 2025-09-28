export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  popular?: boolean;
  productId: string; // For in-app purchases
  savings?: number; // Percentage savings for yearly plans
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired' | 'trial';
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  platform: 'ios' | 'android' | 'web';
  transactionId?: string;
  receiptData?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'ai' | 'analytics' | 'content' | 'support' | 'storage';
  premiumOnly: boolean;
}

export interface UsageLimit {
  feature: string;
  current: number;
  limit: number;
  resetDate?: Date;
}

export interface PremiumBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

export interface SubscriptionAnalytics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  activeSubscribers: number;
  conversionRate: number;
  churnRate: number;
  averageRevenuePerUser: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface BillingHistory {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transactionId: string;
  subscriptionId?: string;
}

export interface SubscriptionContextType {
  // State
  currentPlan: SubscriptionPlan | null;
  userSubscription: UserSubscription | null;
  isPremium: boolean;
  isLoading: boolean;
  error: string | null;
  usageLimits: UsageLimit[];
  
  // Actions
  subscribeToPlan: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  checkSubscriptionStatus: () => Promise<void>;
  getAvailablePlans: () => Promise<SubscriptionPlan[]>;
  getUsageLimits: () => Promise<UsageLimit[]>;
  canUseFeature: (featureId: string) => boolean;
  incrementUsage: (featureId: string) => Promise<void>;
}
