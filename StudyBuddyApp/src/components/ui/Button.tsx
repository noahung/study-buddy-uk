import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { colors, theme } from '../../styles/colors';
import { spacing, borderRadius, typography, fontWeight, neumorphicShadow } from '../../styles';
import { mergeStyles } from '../../styles/utils';

const buttonVariants = cva(
  '', // Base classes handled in React Native styles
  {
    variants: {
      variant: {
        default: 'default',
        destructive: 'destructive',
        outline: 'outline',
        secondary: 'secondary',
        ghost: 'ghost',
        link: 'link',
      },
      size: {
        default: 'default',
        sm: 'sm',
        lg: 'lg',
        icon: 'icon',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  // Base button styles
  const baseButtonStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    ...neumorphicShadow.md,
  };

  // Size variants
  const sizeStyles: Record<string, ViewStyle> = {
    sm: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      minHeight: 32,
      borderRadius: borderRadius.md,
    },
    default: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      minHeight: 36,
      borderRadius: borderRadius.md,
    },
    lg: {
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[3],
      minHeight: 40,
      borderRadius: borderRadius.md,
    },
    icon: {
      width: 36,
      height: 36,
      borderRadius: borderRadius.md,
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
  };

  // Variant styles
  const variantStyles: Record<string, ViewStyle> = {
    default: {
      backgroundColor: theme.primary,
      ...neumorphicShadow.md,
    },
    destructive: {
      backgroundColor: colors.red[500],
      ...neumorphicShadow.md,
    },
    outline: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      ...neumorphicShadow.sm,
    },
    secondary: {
      backgroundColor: colors.gray[100],
      ...neumorphicShadow.md,
    },
    ghost: {
      backgroundColor: 'transparent',
      shadowOpacity: 0,
      elevation: 0,
    },
    link: {
      backgroundColor: 'transparent',
      shadowOpacity: 0,
      elevation: 0,
    },
  };

  // Text color variants
  const textVariantStyles: Record<string, TextStyle> = {
    default: {
      color: colors.white,
      fontWeight: fontWeight.medium,
    },
    destructive: {
      color: colors.white,
      fontWeight: fontWeight.medium,
    },
    outline: {
      color: theme.text.primary,
      fontWeight: fontWeight.medium,
    },
    secondary: {
      color: theme.text.primary,
      fontWeight: fontWeight.medium,
    },
    ghost: {
      color: theme.text.primary,
      fontWeight: fontWeight.medium,
    },
    link: {
      color: theme.primary,
      fontWeight: fontWeight.medium,
      textDecorationLine: 'underline',
    },
  };

  // Size-based text styles
  const textSizeStyles: Record<string, TextStyle> = {
    sm: {
      ...typography.sm,
    },
    default: {
      ...typography.base,
    },
    lg: {
      ...typography.lg,
    },
    icon: {
      ...typography.base,
    },
  };

  // Disabled styles
  const disabledStyle: ViewStyle = {
    opacity: 0.5,
  };

  // Pressed state (using neumorphic inset effect)
  const pressedStyle: ViewStyle = {
    transform: [{ scale: 0.98 }],
    ...Platform.select({
      ios: {
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  };

  // Combine all styles
  const buttonStyle = mergeStyles(
    baseButtonStyle,
    sizeStyles[size || 'default'],
    variantStyles[variant || 'default'],
    disabled && disabledStyle,
    style
  );

  const finalTextStyle = mergeStyles(
    textSizeStyles[size || 'default'],
    textVariantStyles[variant || 'default'],
    textStyle
  );

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      // Add press animation using style transform
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'default' || variant === 'destructive'
              ? colors.white
              : theme.primary
          }
        />
      ) : (
        <Text style={finalTextStyle}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

export { Button, buttonVariants };
export type { ButtonProps };