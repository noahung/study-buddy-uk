import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { NeumorphicButton, NeumorphicInput, NeumorphicCard } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const AuthScreen: React.FC = () => {
  const { theme } = useTheme();
  const { signIn, signUp, signInWithGoogle, signInWithApple, isLoading } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert('Error', 'Google Sign-In failed. Please try again.');
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
    } catch (error) {
      Alert.alert('Error', 'Apple Sign-In failed. Please try again.');
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password || (isSignUp && !name)) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed. Please try again.');
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Logo */}
          <NeumorphicCard style={styles.logoCard}>
            <Ionicons name="book" size={36} color={theme.colors.primary} />
          </NeumorphicCard>

          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {isSignUp ? 'Join Study Buddy' : 'Welcome Back!'}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {isSignUp 
                ? 'Create your account to start learning' 
                : 'Sign in to continue your learning journey'
              }
            </Text>
          </View>

          {/* Email/Password Form */}
          <View style={styles.formContainer}>
            {isSignUp && (
              <NeumorphicInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                leftIcon="person"
              />
            )}
            
            <NeumorphicInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              leftIcon="mail"
            />
            
            <NeumorphicInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              leftIcon="lock-closed"
              rightIcon={showPassword ? "eye-off" : "eye"}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />
          </View>

          {/* Auth Button */}
          <NeumorphicButton
            variant="primary"
            size="lg"
            onPress={handleEmailAuth}
            style={styles.authButton}
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </NeumorphicButton>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>or</Text>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          </View>

          {/* Social Sign-In Options */}
          <View style={styles.socialContainer}>
            <NeumorphicButton
              variant="secondary"
              size="lg"
              onPress={handleGoogleSignIn}
              style={styles.socialButton}
              disabled={isLoading}
            >
              <View style={styles.socialIcon}>
                <Text style={styles.googleIcon}>G</Text>
              </View>
              Continue with Google
            </NeumorphicButton>

            <NeumorphicButton
              variant="primary"
              size="lg"
              onPress={handleAppleSignIn}
              style={styles.socialButton}
              disabled={isLoading}
            >
              <View style={styles.socialIcon}>
                <Text style={styles.appleIcon}>🍎</Text>
              </View>
              Continue with Apple
            </NeumorphicButton>
          </View>

          {/* Toggle Auth Mode */}
          <TouchableOpacity onPress={toggleAuthMode} style={styles.toggleButton}>
            <Text style={[styles.toggleText, { color: theme.colors.textSecondary }]}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <Text style={[styles.toggleLink, { color: theme.colors.primary }]}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={[styles.terms, { color: theme.colors.textSecondary }]}>
            By continuing, you agree to our{' '}
            <Text style={[styles.link, { color: theme.colors.primary }]}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={[styles.link, { color: theme.colors.primary }]}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  logoCard: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  authButton: {
    width: '100%',
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialContainer: {
    width: '100%',
    marginBottom: 24,
  },
  socialButton: {
    width: '100%',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  googleIcon: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  appleIcon: {
    fontSize: 12,
  },
  toggleButton: {
    marginBottom: 24,
  },
  toggleText: {
    fontSize: 14,
    textAlign: 'center',
  },
  toggleLink: {
    fontWeight: '600',
  },
  terms: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    textDecorationLine: 'underline',
  },
});

export default AuthScreen;