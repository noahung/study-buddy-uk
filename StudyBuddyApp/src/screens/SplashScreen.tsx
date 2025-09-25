import React, { useEffect } from 'react';
import { View, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../components/ui/Text';
import { colors, theme, layout, spacing } from '../styles';
import { Book } from 'lucide-react-native';

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigate after 3 seconds
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, rotateAnim, onComplete]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={[colors.blue[50], colors.purple[50]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[layout.container, layout.centered]}
    >
      <StatusBar style="dark" />
      
      <Animated.View
        style={[
          layout.centered,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { rotate },
            ],
          },
        ]}
      >
        {/* Logo Container */}
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 30,
            backgroundColor: colors.white,
            marginBottom: spacing[8],
            justifyContent: 'center',
            alignItems: 'center',
            // Neumorphic shadow
            shadowColor: colors.gray[400],
            shadowOffset: {
              width: 10,
              height: 10,
            },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <Book size={60} color={theme.primary} />
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <Text
            variant="h1"
            style={{
              fontSize: 32,
              fontWeight: '700',
              color: theme.text.primary,
              marginBottom: spacing[2],
              textAlign: 'center',
            }}
          >
            Study Buddy
          </Text>
          
          <Text
            variant="body"
            style={{
              color: theme.text.secondary,
              textAlign: 'center',
              fontSize: 18,
            }}
          >
            Your AI-Powered Learning Companion
          </Text>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
};

export default SplashScreen;