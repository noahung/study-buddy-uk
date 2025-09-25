import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Crown,
  Check,
  X,
  Star,
  Zap,
  BookOpen,
  Users,
  Download,
  Shield,
  Smartphone,
  Clock,
  Trophy,
  Target,
  Infinity,
  CreditCard,
  Gift,
  RefreshCw,
} from 'lucide-react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { theme, spacing, neumorphicShadow } from '../styles';

const { width } = Dimensions.get('window');

interface Props {
  onNavigate: (screen: string) => void;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  originalPrice?: string;
  discount?: string;
  popular?: boolean;
  features: {
    text: string;
    included: boolean;
  }[];
  color: string[];
}

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  free: boolean;
  premium: boolean;
  pro: boolean;
}

const SubscriptionScreen: React.FC<Props> = ({ onNavigate }) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [currentPlan] = useState('free'); // Current user plan

  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: '£0',
      period: 'Forever',
      features: [
        { text: 'Basic study materials', included: true },
        { text: 'Limited flashcards (50)', included: true },
        { text: '2 mock tests per month', included: true },
        { text: 'Basic progress tracking', included: true },
        { text: 'AI chat (10 messages/day)', included: true },
        { text: 'Offline access', included: false },
        { text: 'Unlimited flashcards', included: false },
        { text: 'Advanced analytics', included: false },
        { text: 'Priority support', included: false },
      ],
      color: ['#6b7280', '#4b5563'],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: billingPeriod === 'monthly' ? '£9.99' : '£79.99',
      period: billingPeriod === 'monthly' ? '/month' : '/year',
      originalPrice: billingPeriod === 'yearly' ? '£119.88' : undefined,
      discount: billingPeriod === 'yearly' ? '33% OFF' : undefined,
      popular: true,
      features: [
        { text: 'Everything in Free', included: true },
        { text: 'Unlimited flashcards', included: true },
        { text: 'Unlimited mock tests', included: true },
        { text: 'Offline access', included: true },
        { text: 'AI chat (100 messages/day)', included: true },
        { text: 'Advanced progress analytics', included: true },
        { text: 'Study reminders', included: true },
        { text: 'Export study materials', included: true },
        { text: 'Priority support', included: false },
      ],
      color: ['#3b82f6', '#2563eb'],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingPeriod === 'monthly' ? '£19.99' : '£159.99',
      period: billingPeriod === 'monthly' ? '/month' : '/year',
      originalPrice: billingPeriod === 'yearly' ? '£239.88' : undefined,
      discount: billingPeriod === 'yearly' ? '33% OFF' : undefined,
      features: [
        { text: 'Everything in Premium', included: true },
        { text: 'Unlimited AI chat', included: true },
        { text: 'Advanced study insights', included: true },
        { text: 'Custom study plans', included: true },
        { text: 'Group study features', included: true },
        { text: '24/7 priority support', included: true },
        { text: 'Early access to features', included: true },
        { text: 'Personal study coach', included: true },
        { text: 'White-label materials', included: true },
      ],
      color: ['#f59e0b', '#d97706'],
    },
  ];

  const features: Feature[] = [
    {
      id: 'flashcards',
      name: 'Flashcards',
      description: 'Create and study with digital flashcards',
      icon: BookOpen,
      free: true,
      premium: true,
      pro: true,
    },
    {
      id: 'mock-tests',
      name: 'Mock Tests',
      description: 'Practice with realistic exam simulations',
      icon: Target,
      free: true,
      premium: true,
      pro: true,
    },
    {
      id: 'ai-chat',
      name: 'AI Study Assistant',
      description: 'Get personalized help from AI tutor',
      icon: Zap,
      free: true,
      premium: true,
      pro: true,
    },
    {
      id: 'offline-access',
      name: 'Offline Access',
      description: 'Study anywhere without internet',
      icon: Download,
      free: false,
      premium: true,
      pro: true,
    },
    {
      id: 'analytics',
      name: 'Advanced Analytics',
      description: 'Detailed progress tracking and insights',
      icon: Trophy,
      free: false,
      premium: true,
      pro: true,
    },
    {
      id: 'study-groups',
      name: 'Study Groups',
      description: 'Collaborate with other students',
      icon: Users,
      free: false,
      premium: false,
      pro: true,
    },
    {
      id: 'priority-support',
      name: 'Priority Support',
      description: '24/7 customer support access',
      icon: Shield,
      free: false,
      premium: false,
      pro: true,
    },
  ];

  const handleSubscribe = (planId: string) => {
    if (planId === currentPlan) {
      Alert.alert('Current Plan', 'This is your current active plan.');
      return;
    }

    if (planId === 'free') {
      Alert.alert(
        'Downgrade Plan',
        'Are you sure you want to downgrade to the free plan? You will lose access to premium features.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Downgrade', style: 'destructive' }
        ]
      );
    } else {
      Alert.alert(
        'Subscribe',
        `Subscribe to ${plans.find(p => p.id === planId)?.name} plan?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Subscribe', onPress: () => {
            Alert.alert('Success', 'Subscription activated successfully!');
          }}
        ]
      );
    }
  };

  const handleManageSubscription = () => {
    Alert.alert(
      'Manage Subscription',
      'This will open your app store subscription management.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => {
          // In real app, this would open platform-specific subscription management
          Alert.alert('Info', 'Opening subscription management...');
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate('profile')}
          style={[styles.headerButton, neumorphicShadow.sm]}
        >
          <ArrowLeft size={20} color={theme.text.primary} />
        </TouchableOpacity>
        
        <Text variant="h2" style={styles.headerTitle}>Subscription</Text>
        
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Plan Status */}
        <Card style={[styles.statusCard, neumorphicShadow.lg]}>
          <LinearGradient
            colors={currentPlan === 'free' ? ['#6b7280', '#4b5563'] : ['#3b82f6', '#2563eb']}
            style={styles.statusGradient}
          >
            <View style={styles.statusContent}>
              <Crown size={24} color={theme.surface} />
              <View style={styles.statusText}>
                <Text variant="h3" style={styles.statusTitle}>
                  {currentPlan === 'free' ? 'Free Plan' : 'Premium Plan'}
                </Text>
                <Text variant="caption" style={styles.statusSubtitle}>
                  {currentPlan === 'free' 
                    ? 'Upgrade to unlock premium features' 
                    : 'Expires on March 15, 2024'
                  }
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Card>

        {/* Billing Period Toggle */}
        <Card style={[styles.billingCard, neumorphicShadow.md]}>
          <Text variant="h3" style={styles.billingTitle}>Choose Billing Period</Text>
          
          <View style={styles.billingToggle}>
            <TouchableOpacity
              style={[
                styles.billingOption,
                billingPeriod === 'monthly' && styles.billingOptionActive
              ]}
              onPress={() => setBillingPeriod('monthly')}
              activeOpacity={0.7}
            >
              <Text
                variant="label"
                style={[
                  styles.billingOptionText,
                  billingPeriod === 'monthly' && styles.billingOptionTextActive
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.billingOption,
                billingPeriod === 'yearly' && styles.billingOptionActive
              ]}
              onPress={() => setBillingPeriod('yearly')}
              activeOpacity={0.7}
            >
              <Text
                variant="label"
                style={[
                  styles.billingOptionText,
                  billingPeriod === 'yearly' && styles.billingOptionTextActive
                ]}
              >
                Yearly
              </Text>
              {billingPeriod === 'yearly' && (
                <View style={styles.discountBadge}>
                  <Text variant="caption" style={styles.discountText}>SAVE 33%</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </Card>

        {/* Subscription Plans */}
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
                plan.popular && styles.planCardPopular,
                neumorphicShadow.md
              ]}
              onPress={() => setSelectedPlan(plan.id)}
              activeOpacity={0.7}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Star size={12} color={theme.surface} />
                  <Text variant="caption" style={styles.popularText}>MOST POPULAR</Text>
                </View>
              )}
              
              <LinearGradient
                colors={plan.color}
                style={styles.planHeader}
              >
                <Text variant="h3" style={styles.planName}>{plan.name}</Text>
                <View style={styles.planPricing}>
                  <Text variant="h1" style={styles.planPrice}>{plan.price}</Text>
                  <Text variant="caption" style={styles.planPeriod}>{plan.period}</Text>
                </View>
                {plan.originalPrice && (
                  <View style={styles.originalPricing}>
                    <Text variant="caption" style={styles.originalPrice}>
                      {plan.originalPrice}
                    </Text>
                    <Text variant="caption" style={styles.discount}>
                      {plan.discount}
                    </Text>
                  </View>
                )}
              </LinearGradient>
              
              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.planFeature}>
                    <View style={styles.featureIcon}>
                      {feature.included ? (
                        <Check size={16} color="#10b981" />
                      ) : (
                        <X size={16} color="#ef4444" />
                      )}
                    </View>
                    <Text
                      variant="caption"
                      style={[
                        styles.featureText,
                        !feature.included && styles.featureTextDisabled
                      ]}
                    >
                      {feature.text}
                    </Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.planAction}>
                <Button
                  variant={plan.id === currentPlan ? 'outline' : 'primary'}
                  size="sm"
                  onPress={() => handleSubscribe(plan.id)}
                  style={styles.planButton}
                  disabled={plan.id === currentPlan}
                >
                  <Text
                    variant="label"
                    style={[
                      styles.planButtonText,
                      plan.id === currentPlan && styles.planButtonTextDisabled
                    ]}
                  >
                    {plan.id === currentPlan ? 'Current Plan' : 
                     plan.id === 'free' ? 'Downgrade' : 'Subscribe'}
                  </Text>
                </Button>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feature Comparison */}
        <Card style={[styles.comparisonCard, neumorphicShadow.md]}>
          <Text variant="h3" style={styles.comparisonTitle}>Feature Comparison</Text>
          
          <View style={styles.comparisonTable}>
            <View style={styles.comparisonHeader}>
              <View style={styles.featureColumn}>
                <Text variant="label" style={styles.comparisonHeaderText}>Feature</Text>
              </View>
              <View style={styles.planColumn}>
                <Text variant="label" style={styles.comparisonHeaderText}>Free</Text>
              </View>
              <View style={styles.planColumn}>
                <Text variant="label" style={styles.comparisonHeaderText}>Premium</Text>
              </View>
              <View style={styles.planColumn}>
                <Text variant="label" style={styles.comparisonHeaderText}>Pro</Text>
              </View>
            </View>
            
            {features.map((feature) => (
              <View key={feature.id} style={styles.comparisonRow}>
                <View style={styles.featureColumn}>
                  <View style={styles.featureInfo}>
                    <feature.icon size={16} color={theme.primary} />
                    <View style={styles.featureDetails}>
                      <Text variant="caption" style={styles.featureName}>
                        {feature.name}
                      </Text>
                      <Text variant="caption" color="secondary" style={styles.featureDescription}>
                        {feature.description}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.planColumn}>
                  {feature.free ? (
                    <Check size={16} color="#10b981" />
                  ) : (
                    <X size={16} color="#ef4444" />
                  )}
                </View>
                
                <View style={styles.planColumn}>
                  {feature.premium ? (
                    <Check size={16} color="#10b981" />
                  ) : (
                    <X size={16} color="#ef4444" />
                  )}
                </View>
                
                <View style={styles.planColumn}>
                  {feature.pro ? (
                    <Check size={16} color="#10b981" />
                  ) : (
                    <X size={16} color="#ef4444" />
                  )}
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Subscription Management */}
        {currentPlan !== 'free' && (
          <Card style={[styles.managementCard, neumorphicShadow.md]}>
            <Text variant="h3" style={styles.managementTitle}>Manage Subscription</Text>
            
            <View style={styles.managementActions}>
              <Button
                variant="outline"
                size="sm"
                onPress={handleManageSubscription}
                style={styles.managementButton}
              >
                <RefreshCw size={16} color={theme.primary} />
                <Text variant="label" style={styles.managementButtonText}>
                  Manage Billing
                </Text>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onPress={() => Alert.alert('Info', 'Cancel subscription feature coming soon')}
                style={styles.managementButton}
              >
                <X size={16} color="#ef4444" />
                <Text variant="label" style={[styles.managementButtonText, { color: '#ef4444' }]}>
                  Cancel
                </Text>
              </Button>
            </View>
          </Card>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text variant="caption" color="secondary" style={styles.footerText}>
            Subscriptions auto-renew. Cancel anytime in your account settings.
          </Text>
          <Text variant="caption" color="secondary" style={styles.footerText}>
            All prices shown are in GBP and include applicable taxes.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: theme.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[6],
    paddingTop: 0,
    paddingBottom: spacing[12],
  },
  statusCard: {
    marginBottom: spacing[6],
    overflow: 'hidden',
  },
  statusGradient: {
    padding: spacing[6],
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    flex: 1,
    marginLeft: spacing[4],
  },
  statusTitle: {
    color: theme.surface,
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  statusSubtitle: {
    color: theme.surface + 'CC',
  },
  billingCard: {
    padding: spacing[5],
    marginBottom: spacing[6],
  },
  billingTitle: {
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: spacing[4],
    textAlign: 'center',
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: spacing[1],
  },
  billingOption: {
    flex: 1,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: 8,
    alignItems: 'center',
    position: 'relative',
  },
  billingOptionActive: {
    backgroundColor: theme.surface,
    ...neumorphicShadow.sm,
  },
  billingOptionText: {
    color: theme.text.secondary,
    fontWeight: '500',
  },
  billingOptionTextActive: {
    color: theme.text.primary,
  },
  discountBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  discountText: {
    color: theme.surface,
    fontWeight: '600',
    fontSize: 10,
  },
  plansContainer: {
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  planCard: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardSelected: {
    borderColor: theme.primary,
  },
  planCardPopular: {
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f59e0b',
    paddingVertical: spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    zIndex: 1,
  },
  popularText: {
    color: theme.surface,
    fontWeight: '600',
    fontSize: 10,
  },
  planHeader: {
    padding: spacing[6],
    paddingTop: spacing[8], // Extra space for popular badge
    alignItems: 'center',
  },
  planName: {
    color: theme.surface,
    fontWeight: '600',
    marginBottom: spacing[2],
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing[2],
  },
  planPrice: {
    color: theme.surface,
    fontWeight: 'bold',
    fontSize: 32,
  },
  planPeriod: {
    color: theme.surface + 'CC',
    marginLeft: spacing[1],
  },
  originalPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  originalPrice: {
    color: theme.surface + 'AA',
    textDecorationLine: 'line-through',
  },
  discount: {
    color: theme.surface,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 4,
  },
  planFeatures: {
    padding: spacing[5],
    gap: spacing[3],
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: spacing[2],
  },
  featureText: {
    flex: 1,
    color: theme.text.primary,
  },
  featureTextDisabled: {
    color: theme.text.secondary,
    opacity: 0.6,
  },
  planAction: {
    padding: spacing[5],
    paddingTop: 0,
  },
  planButton: {
    width: '100%',
  },
  planButtonText: {
    fontWeight: '600',
  },
  planButtonTextDisabled: {
    color: theme.text.secondary,
  },
  comparisonCard: {
    padding: spacing[5],
    marginBottom: spacing[6],
  },
  comparisonTitle: {
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: spacing[4],
    textAlign: 'center',
  },
  comparisonTable: {
    gap: spacing[1],
  },
  comparisonHeader: {
    flexDirection: 'row',
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    marginBottom: spacing[2],
  },
  comparisonRow: {
    flexDirection: 'row',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.border + '40',
  },
  featureColumn: {
    flex: 2,
    paddingRight: spacing[2],
  },
  planColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comparisonHeaderText: {
    color: theme.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  featureInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureDetails: {
    flex: 1,
    marginLeft: spacing[2],
  },
  featureName: {
    color: theme.text.primary,
    fontWeight: '500',
  },
  featureDescription: {
    fontSize: 11,
    lineHeight: 16,
  },
  managementCard: {
    padding: spacing[5],
    marginBottom: spacing[6],
  },
  managementTitle: {
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: spacing[4],
    textAlign: 'center',
  },
  managementActions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  managementButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  managementButtonText: {
    color: theme.primary,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    gap: spacing[2],
    paddingTop: spacing[4],
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
  },
});

export default SubscriptionScreen;