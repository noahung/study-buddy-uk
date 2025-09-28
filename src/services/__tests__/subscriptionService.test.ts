import { subscriptionService, SUBSCRIPTION_PLANS } from '../subscriptionService';

// Mock Firebase
jest.mock('../firebase', () => ({
  db: {},
}));

// Mock RevenueCat
jest.mock('react-native-purchases', () => ({
  configure: jest.fn(),
  logIn: jest.fn(),
  logOut: jest.fn(),
  purchasePackage: jest.fn(),
  restorePurchases: jest.fn(),
}));

// Mock Expo In-App Purchases
jest.mock('expo-in-app-purchases', () => ({
  connectAsync: jest.fn(),
  disconnectAsync: jest.fn(),
}));

describe('SubscriptionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAvailablePlans', () => {
    it('returns default subscription plans', async () => {
      const plans = await subscriptionService.getAvailablePlans();
      
      expect(plans).toHaveLength(3);
      expect(plans[0].id).toBe('monthly');
      expect(plans[1].id).toBe('yearly');
      expect(plans[2].id).toBe('lifetime');
    });

    it('returns plans with correct pricing', async () => {
      const plans = await subscriptionService.getAvailablePlans();
      
      expect(plans[0].price).toBe(9.99);
      expect(plans[1].price).toBe(59.99);
      expect(plans[2].price).toBe(199.99);
    });

    it('returns plans with correct currency', async () => {
      const plans = await subscriptionService.getAvailablePlans();
      
      plans.forEach(plan => {
        expect(plan.currency).toBe('GBP');
      });
    });
  });

  describe('canUseFeature', () => {
    it('returns true for premium users', async () => {
      // Mock premium user
      jest.spyOn(subscriptionService, 'checkSubscriptionStatus').mockResolvedValue(true);
      
      const canUse = await subscriptionService.canUseFeature('user1', 'aiChatSessions');
      
      expect(canUse).toBe(true);
    });

    it('returns false when usage limit is reached', async () => {
      // Mock free user with usage limit reached
      jest.spyOn(subscriptionService, 'checkSubscriptionStatus').mockResolvedValue(false);
      jest.spyOn(subscriptionService, 'getUsageLimits').mockResolvedValue([
        { feature: 'aiChatSessions', current: 10, limit: 10 }
      ]);
      
      const canUse = await subscriptionService.canUseFeature('user1', 'aiChatSessions');
      
      expect(canUse).toBe(false);
    });
  });
});
