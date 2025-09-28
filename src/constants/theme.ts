import { Theme } from '../types';

// Neumorphic Color Palette (matching your original design)
export const colors = {
  // Light Theme
  light: {
    primary: '#333333',
    secondary: '#F2F2F2',
    background: '#F2F2F2',
    surface: '#FFFFFF',
    text: '#333333',
    textSecondary: '#AAAAAA',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
    border: 'rgba(0, 0, 0, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowLight: 'rgba(255, 255, 255, 0.7)',
  },
  // Dark Theme
  dark: {
    primary: '#FFFFFF',
    secondary: '#1A1A1A',
    background: '#0F0F0F',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowLight: 'rgba(255, 255, 255, 0.1)',
  },
};

// Spacing System
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius System
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Typography System
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '500' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};

// Neumorphic Shadow System
export const neumorphicShadows = {
  // Light theme shadows
  light: {
    small: {
      shadowColor: colors.light.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    medium: {
      shadowColor: colors.light.shadow,
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 8,
    },
    large: {
      shadowColor: colors.light.shadow,
      shadowOffset: { width: 12, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 12,
    },
    inset: {
      shadowColor: colors.light.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: -4,
    },
  },
  // Dark theme shadows
  dark: {
    small: {
      shadowColor: colors.dark.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    medium: {
      shadowColor: colors.dark.shadow,
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    large: {
      shadowColor: colors.dark.shadow,
      shadowOffset: { width: 12, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 12,
    },
    inset: {
      shadowColor: colors.dark.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: -4,
    },
  },
};

// Create theme objects
export const lightTheme: Theme = {
  colors: colors.light,
  spacing,
  borderRadius,
  typography,
};

export const darkTheme: Theme = {
  colors: colors.dark,
  spacing,
  borderRadius,
  typography,
};

// Default theme
export const defaultTheme = lightTheme;
