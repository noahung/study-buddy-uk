import React from 'react';
import {
  View,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../styles/colors';
import { spacing, borderRadius, neumorphicShadow } from '../../styles';
import { mergeStyles } from '../../styles/utils';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  gradient?: {
    colors: [string, string, ...string[]];
    start?: [number, number];
    end?: [number, number];
  };
  variant?: 'default' | 'elevated' | 'inset';
  padding?: keyof typeof spacing;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  gradient,
  variant = 'default',
  padding = 4,
}) => {
  // Base card styles
  const baseCardStyle: ViewStyle = {
    backgroundColor: theme.surface,
    borderRadius: borderRadius.xl,
    padding: spacing[padding],
  };

  // Variant styles
  const variantStyles: Record<string, ViewStyle> = {
    default: {
      ...neumorphicShadow.md,
    },
    elevated: {
      ...neumorphicShadow.lg,
    },
    inset: {
      borderWidth: 1,
      borderColor: theme.border,
      ...neumorphicShadow.sm,
    },
  };

  const cardStyle = mergeStyles(
    baseCardStyle,
    variantStyles[variant],
    style
  );

  // If we have a gradient, wrap in LinearGradient
  const CardContent = () => (
    <View style={cardStyle}>
      {children}
    </View>
  );

  const GradientCardContent = () => (
    <LinearGradient
      colors={gradient?.colors as [string, string, ...string[]] || [theme.surface, theme.surface]}
      start={gradient?.start || [0, 0]}
      end={gradient?.end || [1, 1]}
      style={cardStyle}
    >
      {children}
    </LinearGradient>
  );

  // If onPress is provided, make it touchable
  if (onPress) {
    const TouchableCard = gradient ? GradientCardContent : CardContent;
    
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.95}
        style={{
          transform: [{ scale: 1 }], // Will be animated on press
        }}
      >
        <TouchableCard />
      </TouchableOpacity>
    );
  }

  // Static card
  return gradient ? <GradientCardContent /> : <CardContent />;
};

// Specialized card components
const CardHeader: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => (
  <View style={mergeStyles({ marginBottom: spacing[3] }, style)}>
    {children}
  </View>
);

const CardContent: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => (
  <View style={mergeStyles({ flex: 1 }, style)}>
    {children}
  </View>
);

const CardFooter: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => (
  <View style={mergeStyles({ marginTop: spacing[3] }, style)}>
    {children}
  </View>
);

export { Card, CardHeader, CardContent, CardFooter };
export type { CardProps };