import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { NeumorphicCard } from '../ui';
import { Ionicons } from '@expo/vector-icons';

interface UsageIndicatorProps {
  feature: string;
  limit: number;
  current: number;
  onUpgrade?: () => void;
  showUpgradeButton?: boolean;
}

const UsageIndicator: React.FC<UsageIndicatorProps> = ({
  feature,
  limit,
  current,
  onUpgrade,
  showUpgradeButton = true
}) => {
  const { theme } = useTheme();
  const { isPremium } = useSubscription();

  const percentage = (current / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  if (isPremium) {
    return null; // Don't show usage indicator for premium users
  }

  return (
    <NeumorphicCard style={[
      styles.container,
      { 
        borderColor: isAtLimit ? theme.colors.error : isNearLimit ? theme.colors.warning : theme.colors.border 
      }
    ]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={isAtLimit ? "lock-closed" : isNearLimit ? "warning" : "checkmark-circle"} 
              size={16} 
              color={isAtLimit ? theme.colors.error : isNearLimit ? theme.colors.warning : theme.colors.success} 
            />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: isAtLimit ? theme.colors.error : isNearLimit ? theme.colors.warning : theme.colors.success
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            {current} / {limit}
          </Text>
        </View>

        {isNearLimit && showUpgradeButton && (
          <TouchableOpacity 
            style={[styles.upgradeButton, { backgroundColor: theme.colors.primary + '20' }]}
            onPress={onUpgrade}
          >
            <Ionicons name="crown" size={14} color={theme.colors.primary} />
            <Text style={[styles.upgradeText, { color: theme.colors.primary }]}>
              Upgrade for unlimited
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </NeumorphicCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
  },
  content: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'right',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  upgradeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default UsageIndicator;
