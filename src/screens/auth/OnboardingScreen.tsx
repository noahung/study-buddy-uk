import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { NeumorphicCard, NeumorphicButton } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    title: "Learn with AI Tutor",
    description: "Get personalized explanations and instant answers to your questions with our advanced AI assistant.",
    illustration: "🤖",
    bgColor: "info",
  },
  {
    id: 2,
    title: "Practice Mock Tests",
    description: "Test your knowledge with realistic exam simulations and track your progress over time.",
    illustration: "📝",
    bgColor: "warning",
  },
  {
    id: 3,
    title: "Track Progress & Notes",
    description: "Monitor your learning journey and organize your study materials in one place.",
    illustration: "📊",
    bgColor: "success",
  }
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = new Animated.Value(1);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      setCurrentSlide(currentSlide - 1);
    }
  };

  const current = slides[currentSlide];

  const getBgColor = () => {
    switch (current.bgColor) {
      case 'info': return theme.colors.info + '20';
      case 'warning': return theme.colors.warning + '20';
      case 'success': return theme.colors.success + '20';
      default: return theme.colors.primary + '20';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Skip Button */}
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={onComplete} style={styles.skipButton}>
          <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Illustration */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <NeumorphicCard style={[styles.illustrationCard, { backgroundColor: getBgColor() }]}>
            <Text style={styles.illustration}>{current.illustration}</Text>
          </NeumorphicCard>
        </Animated.View>

        {/* Text Content */}
        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{current.title}</Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {current.description}
          </Text>
        </Animated.View>

        {/* Progress Dots */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentSlide ? theme.colors.primary : theme.colors.muted,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <NeumorphicCard 
          style={[
            styles.navButton,
            currentSlide === 0 && styles.disabledButton,
          ]}
          onPress={currentSlide > 0 ? prevSlide : undefined}
          hoverable={currentSlide > 0}
        >
          <Ionicons 
            name="chevron-back" 
            size={20} 
            color={currentSlide === 0 ? theme.colors.textSecondary : theme.colors.text} 
          />
        </NeumorphicCard>

        <NeumorphicButton onPress={nextSlide} style={styles.nextButton}>
          <Text style={[styles.nextButtonText, { color: theme.colors.text }]}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          {currentSlide < slides.length - 1 && (
            <Ionicons name="chevron-forward" size={16} color={theme.colors.text} />
          )}
        </NeumorphicButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  illustrationCard: {
    width: 256,
    height: 256,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  illustration: {
    fontSize: 128,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
    maxWidth: 300,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  navButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;