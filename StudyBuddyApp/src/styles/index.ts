import { ViewStyle, TextStyle, Platform } from 'react-native';
import { colors, theme } from './colors';

// Re-export colors and theme
export { colors, theme };

// Spacing system (matching Tailwind's 4px base)
export const spacing = {
  0: 0,
  1: 4,
  2: 8, 
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};

// Border radius system
export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

// Typography system matching web app
export const typography = {
  xs: {
    fontSize: 12,
    lineHeight: 16,
  },
  sm: {
    fontSize: 14,
    lineHeight: 20,
  },
  base: {
    fontSize: 16,
    lineHeight: 24,
  },
  lg: {
    fontSize: 18,
    lineHeight: 28,
  },
  xl: {
    fontSize: 20,
    lineHeight: 28,
  },
  '2xl': {
    fontSize: 24,
    lineHeight: 32,
  },
  '3xl': {
    fontSize: 30,
    lineHeight: 36,
  },
  '4xl': {
    fontSize: 36,
    lineHeight: 40,
  },
  '6xl': {
    fontSize: 60,
    lineHeight: 60,
  },
};

// Font weights
export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  bold: '700' as const,
};

// Neumorphism shadow system
// Note: React Native shadows work differently on iOS vs Android vs Web
export const neumorphicShadow = {
  // Small neumorphic effect
  sm: Platform.select({
    ios: {
      shadowColor: theme.shadow.dark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
    web: {
      shadowColor: '#000000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
  }) as ViewStyle,
  
  // Medium neumorphic effect (default)
  md: Platform.select({
    ios: {
      shadowColor: theme.shadow.dark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
    web: {
      shadowColor: '#000000',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
  }) as ViewStyle,
  
  // Large neumorphic effect
  lg: Platform.select({
    ios: {
      shadowColor: theme.shadow.dark,
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    android: {
      elevation: 6,
    },
    web: {
      shadowColor: '#000000',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
  }) as ViewStyle,
  
  // Extra large for cards
  xl: Platform.select({
    ios: {
      shadowColor: theme.shadow.dark,
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
    },
    android: {
      elevation: 8,
    },
    web: {
      shadowColor: '#000000',
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
    },
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
    },
  }) as ViewStyle,
};

// Common neumorphic container style
export const neumorphicContainer: ViewStyle = {
  backgroundColor: theme.surface,
  borderRadius: borderRadius.xl,
  ...neumorphicShadow.md,
};

// Inset neumorphic style (for pressed states)
export const neumorphicInset: ViewStyle = {
  backgroundColor: theme.surface,
  borderRadius: borderRadius.xl,
  // For inset effect, we'd typically use a different library like react-native-neomorph-shadows
  // For now, we'll simulate with border and reduced shadow
  borderWidth: 1,
  borderColor: colors.gray[200],
};

// Common layout styles
export const layout = {
  container: {
    flex: 1,
    backgroundColor: theme.background,
  } as ViewStyle,
  
  centered: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as ViewStyle,
  
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  } as ViewStyle,
  
  spaceBetween: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  } as ViewStyle,
};

// Text styles matching the web app
export const textStyles = {
  h1: {
    ...typography['2xl'],
    fontWeight: fontWeight.medium,
    color: theme.text.primary,
  } as TextStyle,
  
  h2: {
    ...typography.xl,
    fontWeight: fontWeight.medium,
    color: theme.text.primary,
  } as TextStyle,
  
  h3: {
    ...typography.lg,
    fontWeight: fontWeight.medium,
    color: theme.text.primary,
  } as TextStyle,
  
  body: {
    ...typography.base,
    fontWeight: fontWeight.normal,
    color: theme.text.primary,
  } as TextStyle,
  
  caption: {
    ...typography.sm,
    color: theme.text.secondary,
  } as TextStyle,
  
  label: {
    ...typography.sm,
    fontWeight: fontWeight.medium,
    color: theme.text.primary,
  } as TextStyle,
};