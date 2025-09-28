import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { NeumorphicCard, NeumorphicButton } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';

const SubscriptionUpgradeScreen: React.FC = () => {
  const { theme } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);

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

  const handleUpgrade = (plan: 'monthly' | 'yearly') => {
    Alert.alert(
      'Upgrade to Premium',
      `You selected the ${plan} plan. Payment integration coming soon!`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => {
          Alert.alert('Success', 'Subscription upgrade feature coming soon!');
        }}
      ]
    );
  };

  const handleRestorePurchases = () => {
    Alert.alert('Restore Purchases', 'Restore purchases feature coming soon!');
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

  const renderPlanCard = (plan: 'monthly' | 'yearly', isPopular: boolean = false) => {
    const isSelected = selectedPlan === plan;
    const isYearly = plan === 'yearly';
    
    return (
      <TouchableOpacity
        style={[
          styles.planCard,
          isSelected && styles.selectedPlan,
          isPopular && styles.popularPlan,
          { 
            borderColor: isSelected ? theme.colors.primary : theme.colors.border,
            backgroundColor: isSelected ? theme.colors.primary + '10' : theme.colors.background
          }
        ]}
        onPress={() => setSelectedPlan(plan)}
      >
        {isPopular && (
          <View style={[styles.popularBadge, { backgroundColor: theme.colors.warning }]}>
            <Text style={styles.popularBadgeText}>Most Popular</Text>
          </View>
        )}
        
        {isYearly && (
          <View style={[styles.savingsBadge, { backgroundColor: theme.colors.success }]}>
            <Ionicons name="star" size={12} color="white" />
            <Text style={styles.savingsBadgeText}>Best Value - Save 40%</Text>
          </View>
        )}

        <View style={styles.planHeader}>
          <Text style={[styles.planTitle, { color: theme.colors.text }]}>
            Premium {isYearly ? 'Yearly' : 'Monthly'}
          </Text>
          <View style={styles.planPricing}>
            <Text style={[styles.planPrice, { color: theme.colors.text }]}>
              ${isYearly ? '59.99' : '9.99'}
            </Text>
            <Text style={[styles.planPeriod, { color: theme.colors.textSecondary }]}>
              /{isYearly ? 'year' : 'month'}
            </Text>
            {isYearly && (
              <Text style={[styles.planSavings, { color: theme.colors.success }]}>
                $5.00/month
              </Text>
            )}
          </View>
        </View>

        <NeumorphicButton
          variant={isYearly ? "success" : "warning"}
          size="lg"
          onPress={() => handleUpgrade(plan)}
          style={styles.upgradeButton}
        >
          Start Free Trial (7 days)
        </NeumorphicButton>

        <View style={styles.planFeatures}>
          {features.premium.slice(0, 5).map(renderFeature)}
          <Text style={[styles.moreFeatures, { color: theme.colors.textSecondary }]}>
            + 5 more features...
          </Text>
        </View>

        {isYearly && (
          <View style={[styles.savingsHighlight, { backgroundColor: theme.colors.success + '20' }]}>
            <Text style={[styles.savingsText, { color: theme.colors.success }]}>
              🎯 Save $60 per year!
            </Text>
            <Text style={[styles.savingsSubtext, { color: theme.colors.textSecondary }]}>
              That's 2 months free
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
            Current Plan: Free
          </Text>
          <View style={[styles.currentPlanBadge, { backgroundColor: theme.colors.muted }]}>
            <Text style={[styles.currentPlanBadgeText, { color: theme.colors.textSecondary }]}>
              Active
            </Text>
          </View>
        </View>
        
        <View style={styles.currentPlanFeatures}>
          {features.free.map(renderFeature)}
        </View>
      </NeumorphicCard>

      {/* Premium Plans */}
      <View style={styles.plansContainer}>
        {renderPlanCard('monthly', true)}
        {renderPlanCard('yearly')}
      </View>

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
