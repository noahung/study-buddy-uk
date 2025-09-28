import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { NeumorphicCard, NeumorphicButton } from '../ui';
import { Ionicons } from '@expo/vector-icons';

interface PremiumGateProps {
  feature: string;
  children: React.ReactNode;
  onUpgrade?: () => void;
  fallback?: React.ReactNode;
}

const PremiumGate: React.FC<PremiumGateProps> = ({ 
  feature, 
  children, 
  onUpgrade,
  fallback 
}) => {
  const { theme } = useTheme();
  const { isPremium, canUseFeature } = useSubscription();

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    }
  };

  // If premium user or can use feature, show content
  if (isPremium || canUseFeature(feature)) {
    return <>{children}</>;
  }

  // Show fallback or default premium gate
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <View style={styles.container}>
      <NeumorphicCard style={[styles.gateCard, { backgroundColor: theme.colors.background }]}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed" size={32} color={theme.colors.warning} />
        </View>
        
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Premium Feature
        </Text>
        
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          This feature is available with Study Buddy Pro. Upgrade now to unlock unlimited access to all premium features.
        </Text>
        
        <NeumorphicButton
          variant="warning"
          size="lg"
          onPress={handleUpgrade}
          style={styles.upgradeButton}
        >
          <Ionicons name="crown" size={20} color="white" />
          <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
        </NeumorphicButton>
        
        <View style={styles.featuresList}>
          <Text style={[styles.featuresTitle, { color: theme.colors.text }]}>
            Premium includes:
          </Text>
          {[
            'Unlimited AI chat sessions',
            'Advanced study analytics',
            'AI-generated flashcards',
            'Priority support',
            'Offline mode'
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </NeumorphicCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gateCard: {
    padding: 24,
    alignItems: 'center',
    margin: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresList: {
    width: '100%',
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
});

export default PremiumGate;
