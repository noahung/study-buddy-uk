import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock Firebase
jest.mock('../../services/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  },
}));

const TestComponent = () => {
  const { user, isLoading } = useAuth();
  return (
    <Text>
      {isLoading ? 'Loading...' : user ? `User: ${user.email}` : 'No user'}
    </Text>
  );
};

describe('AuthContext', () => {
  it('provides initial state correctly', () => {
    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });
});
