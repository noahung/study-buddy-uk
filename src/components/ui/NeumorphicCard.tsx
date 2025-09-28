import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { neumorphicShadows } from '../../constants/theme';

interface NeumorphicCardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'inset' | 'small';
  hoverable?: boolean;
  disabled?: boolean;
}

const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  hoverable = false,
  disabled = false,
}) => {
  const { theme, isDark } = useTheme();

  const getShadowStyle = () => {
    const shadows = isDark ? neumorphicShadows.dark : neumorphicShadows.light;
    
    switch (variant) {
      case 'small':
        return shadows.small;
      case 'inset':
        return shadows.inset;
      default:
        return shadows.medium;
    }
  };

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      ...getShadowStyle(),
    },
    hoverable && styles.hoverable,
    disabled && styles.disabled,
    style,
  ];

  if (onPress && !disabled) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  hoverable: {
    // Additional hover effects can be added here
  },
  disabled: {
    opacity: 0.5,
  },
});

export default NeumorphicCard;
