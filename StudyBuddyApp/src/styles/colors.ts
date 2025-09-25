// Color system matching the web app
export const colors = {
  // Base colors
  white: '#ffffff',
  black: '#000000',
  
  // Gray scale
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6', 
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Primary colors
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  
  // Secondary colors  
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
  },
  
  // Accent colors
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0', 
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  
  orange: {
    100: '#fed7aa',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
  },
  
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  
  yellow: {
    50: '#fefce8',
    100: '#fef3c7',
    200: '#fde68a',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
  },
  
  // Gradient colors (for LinearGradient)
  gradients: {
    blueToGray: ['#f9fafb', '#f3f4f6'],
    blueToCyan: ['#3b82f6', '#06b6d4'],
    purpleToPink: ['#8b5cf6', '#ec4899'],
    greenToEmerald: ['#22c55e', '#10b981'],
    orangeToRed: ['#f97316', '#ef4444'],
    indigoToPurple: ['#6366f1', '#8b5cf6'],
  }
};

// Theme-based colors (light mode for now, can extend for dark mode)
export const theme = {
  background: colors.gray[50],
  surface: colors.white,
  primary: colors.blue[500],
  secondary: colors.purple[500],
  accent: colors.green[500],
  text: {
    primary: colors.gray[900],
    secondary: colors.gray[600],
    tertiary: colors.gray[500],
  },
  border: colors.gray[200],
  shadow: {
    light: colors.white,
    dark: 'rgba(0, 0, 0, 0.1)',
  }
};