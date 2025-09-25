import React from 'react';
import { View, ViewStyle, Animated } from 'react-native';
import { theme, colors } from '../../styles/colors';
import { borderRadius, neumorphicShadow } from '../../styles';
import { mergeStyles } from '../../styles/utils';

interface ProgressProps {
  value: number; // 0-100
  max?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  animated?: boolean;
  showGlow?: boolean;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  height = 12,
  color = theme.primary,
  backgroundColor = colors.gray[200],
  style,
  animated = true,
  showGlow = false,
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: percentage,
        duration: 800,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(percentage);
    }
  }, [percentage, animated, animatedValue]);

  // Container styles
  const containerStyle: ViewStyle = {
    height,
    backgroundColor,
    borderRadius: height / 2,
    overflow: 'hidden',
    ...neumorphicShadow.sm,
  };

  // Progress fill styles
  const progressStyle: ViewStyle = {
    height: '100%',
    backgroundColor: color,
    borderRadius: height / 2,
    ...(showGlow && {
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
    }),
  };

  return (
    <View style={mergeStyles(containerStyle, style)}>
      <Animated.View
        style={[
          progressStyle,
          {
            width: animatedValue.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            }),
          },
        ]}
      />
    </View>
  );
};

// Circular progress variant
interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  animated?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 80,
  strokeWidth = 8,
  color = theme.primary,
  backgroundColor = colors.gray[200],
  children,
  animated = true,
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const percentage = Math.min(Math.max(value, 0), 100);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: percentage,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(percentage);
    }
  }, [percentage, animated, animatedValue]);

  // For now, we'll create a simple circular progress using View
  // In a production app, you'd want to use react-native-svg for true circular progress
  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: strokeWidth,
    borderColor: backgroundColor,
    ...neumorphicShadow.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  };

  return (
    <View style={containerStyle}>
      {/* This is a simplified version - use react-native-svg for production */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: 'transparent',
          borderTopColor: color,
          transform: [
            {
              rotate: animatedValue.interpolate({
                inputRange: [0, 100],
                outputRange: ['0deg', '360deg'],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}
      />
      {children}
    </View>
  );
};

export { Progress, CircularProgress };
export type { ProgressProps, CircularProgressProps };