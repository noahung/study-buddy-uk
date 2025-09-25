import React from 'react';
import { Text as RNText, TextStyle, TextProps as RNTextProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { textStyles, typography, fontWeight } from '../../styles';
import { theme } from '../../styles/colors';
import { mergeStyles } from '../../styles/utils';

const textVariants = cva(
  '', // Base classes handled in React Native styles
  {
    variants: {
      variant: {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        body: 'body',
        caption: 'caption',
        label: 'label',
      },
      size: {
        xs: 'xs',
        sm: 'sm',
        base: 'base',
        lg: 'lg',
        xl: 'xl',
        '2xl': '2xl',
        '3xl': '3xl',
        '4xl': '4xl',
        '6xl': '6xl',
      },
      weight: {
        normal: 'normal',
        medium: 'medium',
        bold: 'bold',
      },
      color: {
        primary: 'primary',
        secondary: 'secondary',
        tertiary: 'tertiary',
        white: 'white',
        blue: 'blue',
        red: 'red',
        green: 'green',
        yellow: 'yellow',
      },
    },
    defaultVariants: {
      variant: 'body',
      size: 'base',
      weight: 'normal',
      color: 'primary',
    },
  }
);

interface TextProps extends RNTextProps, VariantProps<typeof textVariants> {
  children: React.ReactNode;
  style?: TextStyle;
}

const Text: React.FC<TextProps> = ({
  children,
  variant,
  size,
  weight,
  color = 'primary',
  style,
  ...props
}) => {
  // Get base style from variant
  let baseStyle: TextStyle = {};
  
  if (variant) {
    baseStyle = textStyles[variant] || {};
  }

  // Size styles
  const sizeStyles: Record<string, TextStyle> = {
    xs: typography.xs,
    sm: typography.sm,
    base: typography.base,
    lg: typography.lg,
    xl: typography.xl,
    '2xl': typography['2xl'],
    '3xl': typography['3xl'],
    '4xl': typography['4xl'],
    '6xl': typography['6xl'],
  };

  // Weight styles
  const weightStyles: Record<string, TextStyle> = {
    normal: { fontWeight: fontWeight.normal },
    medium: { fontWeight: fontWeight.medium },
    bold: { fontWeight: fontWeight.bold },
  };

  // Color styles
  const colorStyles: Record<string, TextStyle> = {
    primary: { color: theme.text.primary },
    secondary: { color: theme.text.secondary },
    tertiary: { color: theme.text.tertiary },
    white: { color: '#ffffff' },
    blue: { color: theme.primary },
    red: { color: '#ef4444' },
    green: { color: '#22c55e' },
    yellow: { color: '#eab308' },
  };

  // Combine all styles
  const finalStyle = mergeStyles(
    baseStyle,
    size && sizeStyles[size],
    weight && weightStyles[weight],
    color && colorStyles[color],
    style
  );

  return (
    <RNText style={finalStyle} {...props}>
      {children}
    </RNText>
  );
};

export { Text, textVariants };
export type { TextProps };