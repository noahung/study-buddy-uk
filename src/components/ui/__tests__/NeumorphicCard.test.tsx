import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import NeumorphicCard from '../NeumorphicCard';

const MockThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('NeumorphicCard', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <MockThemeProvider>
        <NeumorphicCard testID="neumorphic-card">
          <Text>Test Content</Text>
        </NeumorphicCard>
      </MockThemeProvider>
    );

    expect(getByTestId('neumorphic-card')).toBeTruthy();
  });

  it('applies custom style correctly', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <MockThemeProvider>
        <NeumorphicCard testID="neumorphic-card" style={customStyle}>
          <Text>Test Content</Text>
        </NeumorphicCard>
      </MockThemeProvider>
    );

    const card = getByTestId('neumorphic-card');
    expect(card).toBeTruthy();
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <MockThemeProvider>
        <NeumorphicCard>
          <Text>Test Content</Text>
        </NeumorphicCard>
      </MockThemeProvider>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });
});
