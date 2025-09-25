import { clsx, type ClassValue } from 'clsx';
import { ViewStyle } from 'react-native';

// Utility function for conditional class names (adapted for React Native)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Helper to merge React Native style objects
export function mergeStyles<T>(...styles: (T | undefined | false | null)[]): T {
  return Object.assign({}, ...styles.filter(Boolean)) as T;
}

// Helper to create responsive dimensions
export function getResponsiveSize(base: number, scale: number = 1): number {
  return base * scale;
}

// Helper to create neumorphic gradient backgrounds
export function createNeumorphicGradient(
  startColor: string,
  endColor: string,
  direction: 'horizontal' | 'vertical' | 'diagonal' = 'diagonal'
) {
  const locations = [0, 1];
  
  switch (direction) {
    case 'horizontal':
      return {
        colors: [startColor, endColor],
        start: { x: 0, y: 0.5 },
        end: { x: 1, y: 0.5 },
        locations,
      };
    case 'vertical':
      return {
        colors: [startColor, endColor],
        start: { x: 0.5, y: 0 },
        end: { x: 0.5, y: 1 },
        locations,
      };
    case 'diagonal':
    default:
      return {
        colors: [startColor, endColor],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        locations,
      };
  }
}

// Helper to lighten/darken colors for neumorphic effects
export function adjustColorBrightness(color: string, percent: number): string {
  // Simple color adjustment - in a real app, you might want a more robust solution
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + 
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// Neumorphic shadow styles (Fixed for React Native Web compatibility)
export const createNeumorphicStyle = (
  backgroundColor: string = '#f0f0f3',
  size: 'sm' | 'md' | 'lg' = 'md'
) => {
  const shadowOffsets = {
    sm: 4,
    md: 8,
    lg: 12,
  };

  const offset = shadowOffsets[size];

  // Use boxShadow for web compatibility instead of shadow* properties
  return {
    backgroundColor,
    // @ts-ignore - boxShadow is web-compatible
    boxShadow: `${offset}px ${offset}px ${offset * 2}px rgba(0, 0, 0, 0.1), -${offset}px -${offset}px ${offset * 2}px rgba(255, 255, 255, 0.9)`,
  };
};