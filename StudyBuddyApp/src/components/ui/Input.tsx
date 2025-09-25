import React, { useState, useRef } from 'react';
import {
  TextInput,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Animated,
  TextInputProps,
} from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { Search, Eye, EyeOff } from 'lucide-react-native';
import { colors, theme } from '../../styles/colors';
import { spacing, borderRadius, typography, neumorphicShadow } from '../../styles';
import { mergeStyles } from '../../styles/utils';
import { Text } from './Text';

const inputVariants = cva(
  '', // Base classes handled in React Native styles
  {
    variants: {
      variant: {
        default: 'default',
        search: 'search',
        password: 'password',
      },
      size: {
        sm: 'sm',
        default: 'default',
        lg: 'lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface InputProps extends Omit<TextInputProps, 'style'>, VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  variant = 'default',
  size = 'default',
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Animate focus state
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, animatedValue]);

  // Base container styles
  const baseContainerStyle: ViewStyle = {
    marginBottom: spacing[4],
  };

  // Input container styles
  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: error ? colors.red[500] : isFocused ? theme.primary : theme.border,
    ...neumorphicShadow.sm,
  };

  // Size variants
  const sizeStyles: Record<string, ViewStyle & TextStyle> = {
    sm: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      minHeight: 36,
      fontSize: typography.sm.fontSize,
    },
    default: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      minHeight: 44,
      fontSize: typography.base.fontSize,
    },
    lg: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[4],
      minHeight: 52,
      fontSize: typography.lg.fontSize,
    },
  };

  // Base input styles
  const baseInputStyle: TextStyle = {
    flex: 1,
    color: theme.text.primary,
    ...sizeStyles[size || 'default'],
    paddingVertical: sizeStyles[size || 'default'].paddingVertical,
  };

  // Handle password variant
  const isPasswordType = variant === 'password' || textInputProps.secureTextEntry;
  const finalSecureTextEntry = isPasswordType && !showPassword;

  // Handle search variant
  const isSearchType = variant === 'search';
  const searchIcon = isSearchType && !leftIcon ? <Search size={20} color={theme.text.tertiary} /> : leftIcon;

  // Password toggle icon
  const passwordToggleIcon = isPasswordType ? (
    <TouchableOpacity
      onPress={() => setShowPassword(!showPassword)}
      style={{ padding: spacing[1] }}
    >
      {showPassword ? (
        <EyeOff size={20} color={theme.text.tertiary} />
      ) : (
        <Eye size={20} color={theme.text.tertiary} />
      )}
    </TouchableOpacity>
  ) : rightIcon;

  // Animated border color
  const animatedBorderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.border, theme.primary],
  });

  return (
    <View style={mergeStyles(baseContainerStyle, containerStyle)}>
      {/* Label */}
      {label && (
        <Text
          variant="label"
          size="sm"
          style={{ marginBottom: spacing[2], color: error ? colors.red[600] : theme.text.primary }}
        >
          {label}
        </Text>
      )}

      {/* Input Container */}
      <Animated.View
        style={[
          inputContainerStyle,
          {
            borderColor: error ? colors.red[500] : animatedBorderColor,
            shadowOpacity: isFocused ? 0.15 : 0.1,
          },
        ]}
      >
        {/* Left Icon */}
        {searchIcon && (
          <View style={{ paddingLeft: spacing[3] }}>
            {searchIcon}
          </View>
        )}

        {/* Text Input */}
        <TextInput
          style={mergeStyles(baseInputStyle, inputStyle)}
          placeholderTextColor={theme.text.tertiary}
          secureTextEntry={finalSecureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />

        {/* Right Icon */}
        {passwordToggleIcon && (
          <View style={{ paddingRight: spacing[3] }}>
            {passwordToggleIcon}
          </View>
        )}
      </Animated.View>

      {/* Error Message */}
      {error && (
        <Text
          size="xs"
          color="red"
          style={{ marginTop: spacing[1], paddingLeft: spacing[1] }}
        >
          {error}
        </Text>
      )}

      {/* Hint Text */}
      {hint && !error && (
        <Text
          size="xs"
          color="tertiary"
          style={{ marginTop: spacing[1], paddingLeft: spacing[1] }}
        >
          {hint}
        </Text>
      )}
    </View>
  );
};

// Specialized input components
const SearchInput: React.FC<Omit<InputProps, 'variant'>> = (props) => (
  <Input variant="search" placeholder="Search..." {...props} />
);

const PasswordInput: React.FC<Omit<InputProps, 'variant'>> = (props) => (
  <Input variant="password" {...props} />
);

export { Input, SearchInput, PasswordInput, inputVariants };
export type { InputProps };