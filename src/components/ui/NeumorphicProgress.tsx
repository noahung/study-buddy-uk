import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { neumorphicShadows } from '../../constants/theme';

interface NeumorphicProgressProps {
  value: number; // 0-100
  max?: number;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'info';
  style?: ViewStyle;
}

const NeumorphicProgress: React.FC<NeumorphicProgressProps> = ({
  value,
  max = 100,
  showPercentage = true,
  size = 'md',
  variant = 'default',
  style,
}) => {
  const { theme, isDark } = useTheme();
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          height: 8,
          borderRadius: 4,
        };
      case 'lg':
        return {
          height: 16,
          borderRadius: 8,
        };
      default: // md
        return {
          height: 12,
          borderRadius: 6,
        };
    }
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.primary;
    }
  };

  const sizeStyles = getSizeStyles();
  const variantColor = getVariantColor();
  const shadows = isDark ? neumorphicShadows.dark : neumorphicShadows.light;

  const trackStyle = [
    styles.track,
    {
      backgroundColor: theme.colors.surface,
      height: sizeStyles.height,
      borderRadius: sizeStyles.borderRadius,
      ...shadows.inset,
    },
    style,
  ];

  const fillStyle = [
    styles.fill,
    {
      backgroundColor: variantColor,
      width: `${percentage}%`,
      height: sizeStyles.height,
      borderRadius: sizeStyles.borderRadius,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={trackStyle}>
        <View style={fillStyle} />
      </View>
      {showPercentage && (
        <Text style={[styles.percentage, { color: theme.colors.textSecondary }]}>
          {Math.round(percentage)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  track: {
    flex: 1,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  percentage: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default NeumorphicProgress;
