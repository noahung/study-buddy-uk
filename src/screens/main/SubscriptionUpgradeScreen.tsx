import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { NeumorphicCard, NeumorphicButton } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';
import { SubscriptionPlan } from '../../types/subscription';

interface SubscriptionUpgradeScreenProps {
  onNavigate?: (screen: string) => void;
  onGoBack?: () => void;
}

const SubscriptionUpgradeScreen: React.FC<SubscriptionUpgradeScreenProps> = ({ 
  onNavigate, 
  onGoBack 
}) => {
  const { theme } = useTheme();
  const { 
    isPremium, 
    currentPlan, 
    userSubscription, 
    isLoading, 
    error,
    subscribeToPlan, 
    restorePurchases,
    getAvailablePlans 
  } = useSubscription();
  
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime' | null>(null);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const plans = await getAvailablePlans();
      setAvailablePlans(plans);
    } catch (error) {
      console.error('Failed to load subscription plans:', error);
    } finally {
      setLoadingPlans(false);
    }
  };

  const features = {
    free: [
      'Access to basic courses',
      'Limited AI chat (10 messages/day)',
      'Basic flashcards',
      '3 mock tests per month',
      'Basic progress tracking'
    ],
    premium: [
      'Access to all courses',
      'Unlimited AI chat',
      'Advanced flashcards with spaced repetition',
      'Unlimited mock tests',
      'Detailed analytics & insights',
      'Offline mode',
      'Priority customer support',
      'Advanced study planning',
      'Export study data',
      'Ad-free experience'
    ]
  };

  const testimonials = [
    {
      name: "Sarah M.",
      role: "CPA Student",
      text: "Study Buddy Premium helped me pass my CPA exam on the first try. The AI tutor is incredibly helpful!",
      rating: 5
    },
    {
      name: "Mike T.",
      role: "Investment Advisor",
      text: "The advanced analytics feature helped me identify my weak areas and focus my study time effectively.",
      rating: 5
    },
    {
      name: "Jessica L.",
      role: "Finance Graduate",
      text: "Worth every penny. The unlimited practice tests and detailed explanations are game-changers.",
      rating: 5
    }
  ];

  const handleUpgrade = async (planId: string) => {
    if (isLoading) return;
    
    try {
      await subscribeToPlan(planId);
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

  const handleRestorePurchases = async () => {
    if (isLoading) return;
    
    try {
      await restorePurchases();
    } catch (error) {
      console.error('Restore purchases failed:', error);
    }
  };

  const renderFeature = (feature: string, index: number) => (
    <View key={index} style={styles.featureItem}>
      <Ionicons name="checkmark" size={16} color={theme.colors.success} />
      <Text style={[styles.featureText, { color: theme.colors.text }]}>
        {feature}
      </Text>
    </View>
  );

  const renderTestimonial = (testimonial: any, index: number) => (
    <NeumorphicCard key={index} style={styles.testimonialCard}>
      <View style={styles.testimonialRating}>
        {[...Array(testimonial.rating)].map((_, i) => (
          <Ionicons key={i} name="star" size={12} color={theme.colors.warning} />
        ))}
      </View>
      <Text style={[styles.testimonialText, { color: theme.colors.text }]}>
        "{testimonial.text}"
      </Text>
      <Text style={[styles.testimonialAuthor, { color: theme.colors.textSecondary }]}>
        <Text style={{ fontWeight: '600' }}>{testimonial.name}</Text> - {testimonial.role}
      </Text>
    </NeumorphicCard>
  );

  const renderPlanCard = (plan: SubscriptionPlan) => {
    const isSelected = selectedPlan === plan.id;
    const isYearly = plan.interval === 'yearly';
    const isLifetime = plan.interval === 'lifetime';
    
    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.planCard,
          isSelected && styles.selectedPlan,
          plan.popular && styles.popularPlan,
          { 
            borderColor: isSelected ? theme.colors.primary : theme.colors.border,
            backgroundColor: isSelected ? theme.colors.primary + '10' : theme.colors.background
          }
        ]}
        onPress={() => setSelectedPlan(plan.id as any)}
      >
        {plan.popular && (
          <View style={[styles.popularBadge, { backgroundColor: theme.colors.warning }]}>
            <Text style={styles.popularBadgeText}>Most Popular</Text>
          </View>
        )}
        
        {plan.savings && (
          <View style={[styles.savingsBadge, { backgroundColor: theme.colors.success }]}>
            <Ionicons name="star" size={12} color="white" />
            <Text style={styles.savingsBadgeText}>Save {plan.savings}%</Text>
          </View>
        )}

        <View style={styles.planHeader}>
          <Text style={[styles.planTitle, { color: theme.colors.text }]}>
            {plan.name}
          </Text>
          <View style={styles.planPricing}>
            <Text style={[styles.planPrice, { color: theme.colors.text }]}>
              £{plan.price.toFixed(2)}
            </Text>
            <Text style={[styles.planPeriod, { color: theme.colors.textSecondary }]}>
              /{plan.interval === 'lifetime' ? 'lifetime' : plan.interval === 'yearly' ? 'year' : 'month'}
            </Text>
            {isYearly && (
              <Text style={[styles.planSavings, { color: theme.colors.success }]}>
                £{(plan.price / 12).toFixed(2)}/month
              </Text>
            )}
          </View>
        </View>

        <NeumorphicButton
          variant={isLifetime ? "success" : isYearly ? "warning" : "primary"}
          size="lg"
          onPress={() => handleUpgrade(plan.id)}
          style={styles.upgradeButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            `Start ${isLifetime ? 'Lifetime' : 'Free Trial'}`
          )}
        </NeumorphicButton>

        <View style={styles.planFeatures}>
          {plan.features.slice(0, 5).map((feature, index) => renderFeature(feature, index))}
          {plan.features.length > 5 && (
            <Text style={[styles.moreFeatures, { color: theme.colors.textSecondary }]}>
              + {plan.features.length - 5} more features...
            </Text>
          )}
        </View>

        {plan.savings && (
          <View style={[styles.savingsHighlight, { backgroundColor: theme.colors.success + '20' }]}>
            <Text style={[styles.savingsText, { color: theme.colors.success }]}>
              🎯 Save £{(9.99 * 12 - plan.price).toFixed(2)} per year!
            </Text>
            <Text style={[styles.savingsSubtext, { color: theme.colors.textSecondary }]}>
              That's {Math.round(plan.savings / 100 * 12)} months free
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.warning + '20' }]}>
          <Ionicons name="crown" size={32} color={theme.colors.warning} />
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>Upgrade to Premium</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Unlock advanced features and accelerate your learning
        </Text>
      </View>

      {/* Current Plan */}
      <NeumorphicCard style={[styles.currentPlanCard, { borderColor: theme.colors.border }]}>
        <View style={styles.currentPlanHeader}>
          <Text style={[styles.currentPlanTitle, { color: theme.colors.text }]}>
            Current Plan: {isPremium ? currentPlan?.name || 'Premium' : 'Free'}
          </Text>
          <View style={[
            styles.currentPlanBadge, 
            { backgroundColor: isPremium ? theme.colors.success : theme.colors.muted }
          ]}>
            <Text style={[
              styles.currentPlanBadgeText, 
              { color: isPremium ? 'white' : theme.colors.textSecondary }
            ]}>
              {isPremium ? 'Active' : 'Free'}
            </Text>
          </View>
        </View>
        
        <View style={styles.currentPlanFeatures}>
          {(isPremium ? currentPlan?.features || features.premium : features.free).map(renderFeature)}
        </View>
        
        {isPremium && userSubscription && (
          <View style={styles.subscriptionDetails}>
            <Text style={[styles.subscriptionText, { color: theme.colors.textSecondary }]}>
              Next billing: {userSubscription.endDate?.toLocaleDateString() || 'N/A'}
            </Text>
            <Text style={[styles.subscriptionText, { color: theme.colors.textSecondary }]}>
              Auto-renew: {userSubscription.autoRenew ? 'Yes' : 'No'}
            </Text>
          </View>
        )}
      </NeumorphicCard>

      {/* Error Message */}
      {error && (
        <NeumorphicCard style={[styles.errorCard, { borderColor: theme.colors.error }]}>
          <View style={styles.errorContent}>
            <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          </View>
        </NeumorphicCard>
      )}

      {/* Premium Plans */}
      {!isPremium && (
        <View style={styles.plansContainer}>
          {loadingPlans ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                Loading subscription plans...
              </Text>
            </View>
          ) : (
            availablePlans.map(renderPlanCard)
          )}
        </View>
      )}

      {/* All Premium Features */}
      <NeumorphicCard style={styles.featuresCard}>
        <View style={styles.featuresHeader}>
          <Ionicons name="flash" size={20} color={theme.colors.warning} />
          <Text style={[styles.featuresTitle, { color: theme.colors.text }]}>
            All Premium Features
          </Text>
        </View>
        <View style={styles.allFeatures}>
          {features.premium.map(renderFeature)}
        </View>
      </NeumorphicCard>

      {/* Testimonials */}
      <NeumorphicCard style={styles.testimonialsCard}>
        <Text style={[styles.testimonialsTitle, { color: theme.colors.text }]}>
          What Our Students Say
        </Text>
        <View style={styles.testimonialsList}>
          {testimonials.map(renderTestimonial)}
        </View>
      </NeumorphicCard>

      {/* Feature Comparison */}
      <NeumorphicCard style={styles.comparisonCard}>
        <Text style={[styles.comparisonTitle, { color: theme.colors.text }]}>
          Feature Comparison
        </Text>
        <View style={styles.comparisonTable}>
          <View style={[styles.comparisonHeader, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.comparisonHeaderText, { color: theme.colors.text }]}>Feature</Text>
            <Text style={[styles.comparisonHeaderText, { color: theme.colors.text }]}>Free</Text>
            <Text style={[styles.comparisonHeaderText, { color: theme.colors.warning }]}>Premium</Text>
          </View>
          
          {[
            { feature: 'AI Chat Messages', free: '10/day', premium: 'Unlimited' },
            { feature: 'Mock Tests', free: '3/month', premium: 'Unlimited' },
            { feature: 'Course Access', free: 'Basic', premium: 'All Courses' },
            { feature: 'Offline Mode', free: '❌', premium: '✅' },
            { feature: 'Analytics', free: 'Basic', premium: 'Advanced' },
            { feature: 'Priority Support', free: '❌', premium: '✅' }
          ].map((row, index) => (
            <View key={index} style={styles.comparisonRow}>
              <Text style={[styles.comparisonFeature, { color: theme.colors.text }]}>
                {row.feature}
              </Text>
              <Text style={[styles.comparisonValue, { color: theme.colors.textSecondary }]}>
                {row.free}
              </Text>
              <Text style={[styles.comparisonValue, { color: theme.colors.warning, fontWeight: '600' }]}>
                {row.premium}
              </Text>
            </View>
          ))}
        </View>
      </NeumorphicCard>

      {/* Security & Trust */}
      <NeumorphicCard style={styles.securityCard}>
        <Ionicons name="shield-checkmark" size={24} color={theme.colors.success} />
        <Text style={[styles.securityTitle, { color: theme.colors.text }]}>
          Secure & Trusted
        </Text>
        <Text style={[styles.securityText, { color: theme.colors.textSecondary }]}>
          Your payment is protected by industry-standard encryption. Cancel anytime.
        </Text>
        <View style={styles.securityFeatures}>
          <Text style={[styles.securityFeature, { color: theme.colors.textSecondary }]}>
            🔒 SSL Encrypted
          </Text>
          <Text style={[styles.securityFeature, { color: theme.colors.textSecondary }]}>
            💳 Secure Payments
          </Text>
          <Text style={[styles.securityFeature, { color: theme.colors.textSecondary }]}>
            🔄 Easy Cancellation
          </Text>
        </View>
      </NeumorphicCard>

      {/* Restore Purchases */}
      <View style={styles.restoreContainer}>
        <NeumorphicButton variant="secondary" onPress={handleRestorePurchases}>
          Restore Purchases
        </NeumorphicButton>
        <Text style={[styles.restoreText, { color: theme.colors.textSecondary }]}>
          Already purchased? Restore your premium access
        </Text>
      </View>

      {/* Terms */}
      <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
        Free trial automatically renews. Cancel anytime.{' '}
        <Text style={[styles.termsLink, { color: theme.colors.primary }]}>Terms</Text> and{' '}
        <Text style={[styles.termsLink, { color: theme.colors.primary }]}>Privacy Policy</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  currentPlanCard: {
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
  },
  currentPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentPlanTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  currentPlanBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentPlanBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  currentPlanFeatures: {
    gap: 8,
  },
  subscriptionDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  subscriptionText: {
    fontSize: 12,
    marginBottom: 4,
  },
  errorCard: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 12,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 24,
  },
  planCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    position: 'relative',
  },
  selectedPlan: {
    // Additional styles for selected state
  },
  popularPlan: {
    // Additional styles for popular plan
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  savingsBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  planPricing: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  planPeriod: {
    fontSize: 14,
  },
  planSavings: {
    fontSize: 12,
  },
  upgradeButton: {
    marginBottom: 16,
  },
  planFeatures: {
    gap: 8,
  },
  moreFeatures: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  savingsHighlight: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  savingsSubtext: {
    fontSize: 12,
  },
  featuresCard: {
    padding: 20,
    marginBottom: 24,
  },
  featuresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  allFeatures: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  testimonialsCard: {
    padding: 20,
    marginBottom: 24,
  },
  testimonialsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  testimonialsList: {
    gap: 16,
  },
  testimonialCard: {
    padding: 16,
  },
  testimonialRating: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  testimonialText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 20,
  },
  testimonialAuthor: {
    fontSize: 12,
  },
  comparisonCard: {
    padding: 20,
    marginBottom: 24,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  comparisonTable: {
    gap: 12,
  },
  comparisonHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  comparisonHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonFeature: {
    flex: 1,
    fontSize: 14,
  },
  comparisonValue: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  securityCard: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 24,
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  securityFeatures: {
    flexDirection: 'row',
    gap: 16,
  },
  securityFeature: {
    fontSize: 12,
  },
  restoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  restoreText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
});

export default SubscriptionUpgradeScreen;
