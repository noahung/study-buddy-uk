import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  RotateCcw,
  XCircle,
  PlayCircle,
  PauseCircle,
  Lightbulb,
  BookOpen,
  Volume2,
  VolumeX,
  Target,
  Zap,
} from 'lucide-react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { theme, spacing, neumorphicShadow } from '../styles';

interface Props {
  onNavigate: (screen: string) => void;
}

interface StudyCard {
  id: number;
  topic: string;
  question: string;
  answer: string;
  hints: string[];
  examples: string[];
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const RevisionStudyScreen: React.FC<Props> = ({ onNavigate }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyProgress, setStudyProgress] = useState<{ [key: number]: 'easy' | 'medium' | 'hard' | null }>({});
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    needsReview: 0,
    timeSpent: 0,
  });
  const [studyMode, setStudyMode] = useState<'review' | 'test' | 'focus'>('review');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showHints, setShowHints] = useState(false);
  
  // Animation values
  const flipAnimation = new Animated.Value(0);
  const scaleAnimation = new Animated.Value(1);

  // Sample study content
  const studyCards: StudyCard[] = [
    {
      id: 1,
      topic: 'React State Management',
      question: 'What are the different ways to manage state in React applications?',
      answer: 'React provides several state management options: useState for local component state, useReducer for complex state logic, Context API for sharing state across components, and external libraries like Redux, Zustand, or Recoil for global state management.',
      hints: [
        'Think about local vs global state',
        'Consider built-in React hooks',
        'External libraries can help with complex scenarios'
      ],
      examples: [
        'const [count, setCount] = useState(0);',
        'const { state, dispatch } = useReducer(reducer, initialState);',
        'const value = useContext(MyContext);'
      ],
      tags: ['React', 'State', 'Hooks'],
      difficulty: 'medium'
    },
    {
      id: 2,
      topic: 'JavaScript Promises',
      question: 'How do JavaScript Promises work and what are their three states?',
      answer: 'Promises represent the eventual completion or failure of an asynchronous operation. They have three states: Pending (initial state), Fulfilled (operation completed successfully), and Rejected (operation failed). Promises provide .then(), .catch(), and .finally() methods for handling results.',
      hints: [
        'Promises handle asynchronous operations',
        'There are exactly three states',
        'Think about success and error scenarios'
      ],
      examples: [
        'new Promise((resolve, reject) => { /* async operation */ })',
        'promise.then(result => console.log(result))',
        'promise.catch(error => console.error(error))'
      ],
      tags: ['JavaScript', 'Async', 'Promises'],
      difficulty: 'hard'
    },
    {
      id: 3,
      topic: 'CSS Grid Layout',
      question: 'What are the key properties for creating a CSS Grid layout?',
      answer: 'Key CSS Grid properties include: display: grid (creates grid container), grid-template-columns and grid-template-rows (define grid structure), gap (sets spacing), grid-area (places items), and grid-auto-flow (controls auto-placement algorithm).',
      hints: [
        'Start with the display property',
        'Define rows and columns',
        'Consider spacing between items'
      ],
      examples: [
        'display: grid;',
        'grid-template-columns: 1fr 2fr 1fr;',
        'gap: 20px;'
      ],
      tags: ['CSS', 'Layout', 'Grid'],
      difficulty: 'easy'
    },
  ];

  const currentCard = studyCards[currentCardIndex];
  const progress = ((currentCardIndex) / studyCards.length) * 100;
  const completedCards = Object.keys(studyProgress).length;
  const remainingCards = studyCards.length - completedCards;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
        setSessionStats(prev => ({ ...prev, timeSpent: prev.timeSpent + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCardResponse = (difficulty: 'easy' | 'medium' | 'hard') => {
    setStudyProgress(prev => ({ ...prev, [currentCard.id]: difficulty }));
    
    if (difficulty === 'easy') {
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else if (difficulty === 'hard') {
      setSessionStats(prev => ({ ...prev, needsReview: prev.needsReview + 1 }));
    }

    // Animate card completion
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Move to next card or complete session
    setTimeout(() => {
      if (currentCardIndex < studyCards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
        setIsFlipped(false);
        setShowHints(false);
        // Reset flip animation
        flipAnimation.setValue(0);
      } else {
        // Session complete
        handleSessionComplete();
      }
    }, 300);
  };

  const handleFlipCard = () => {
    if (isFlipped) {
      Animated.timing(flipAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsFlipped(false));
    } else {
      setIsFlipped(true);
      Animated.timing(flipAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSkipCard = () => {
    setStudyProgress(prev => ({ ...prev, [currentCard.id]: null }));
    
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
      setShowHints(false);
      flipAnimation.setValue(0);
    } else {
      handleSessionComplete();
    }
  };

  const handleSessionComplete = () => {
    setIsSessionActive(false);
    
    const correctCount = Object.values(studyProgress).filter(rating => rating === 'easy').length;
    const reviewCount = Object.values(studyProgress).filter(rating => rating === 'hard').length;
    
    Alert.alert(
      'Session Complete! 🎉',
      `Great work! You completed ${completedCards} cards.\n\n✅ Mastered: ${correctCount}\n🔄 Need Review: ${reviewCount}\n⏱️ Time: ${formatTime(sessionTimer)}`,
      [
        { text: 'Review Again', onPress: () => resetSession() },
        { text: 'Done', onPress: () => onNavigate('revision') }
      ]
    );
  };

  const resetSession = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudyProgress({});
    setSessionStats({ correct: 0, needsReview: 0, timeSpent: 0 });
    setSessionTimer(0);
    setShowHints(false);
    flipAnimation.setValue(0);
    scaleAnimation.setValue(1);
  };

  const toggleSession = () => {
    setIsSessionActive(!isSessionActive);
  };

  const flipInterpolation = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate('revision')}
          style={[styles.headerButton, neumorphicShadow.sm]}
        >
          <ArrowLeft size={20} color={theme.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text variant="h2" style={styles.headerTitle}>Revision Study</Text>
          <Text variant="caption" color="secondary">{currentCard.topic}</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={toggleSession}
            style={[
              styles.headerButton,
              isSessionActive ? styles.activeButton : {},
              neumorphicShadow.sm
            ]}
          >
            {isSessionActive ? (
              <PauseCircle size={20} color={isSessionActive ? theme.surface : theme.text.primary} />
            ) : (
              <PlayCircle size={20} color={theme.text.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setIsSoundEnabled(!isSoundEnabled)}
            style={[styles.headerButton, neumorphicShadow.sm]}
          >
            {isSoundEnabled ? (
              <Volume2 size={20} color={theme.text.primary} />
            ) : (
              <VolumeX size={20} color={theme.text.secondary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Section */}
        <Card style={[styles.progressCard, neumorphicShadow.md]}>
          <View style={styles.progressHeader}>
            <View style={styles.progressInfo}>
              <Text variant="label" style={styles.progressText}>
                Card {currentCardIndex + 1} of {studyCards.length}
              </Text>
              <View style={styles.timerContainer}>
                <Clock size={14} color={theme.text.secondary} />
                <Text variant="caption" style={styles.timerText}>
                  {formatTime(sessionTimer)}
                </Text>
              </View>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <CheckCircle size={14} color="#10b981" />
                <Text variant="caption" style={[styles.statText, { color: '#10b981' }]}>
                  {sessionStats.correct}
                </Text>
              </View>
              <View style={styles.statItem}>
                <RotateCcw size={14} color="#f59e0b" />
                <Text variant="caption" style={[styles.statText, { color: '#f59e0b' }]}>
                  {sessionStats.needsReview}
                </Text>
              </View>
            </View>
          </View>
          <Progress value={progress} style={styles.progressBar} />
        </Card>

        {/* Study Card */}
        <Animated.View
          style={[
            styles.cardContainer,
            {
              transform: [{ scale: scaleAnimation }]
            }
          ]}
        >
          <TouchableOpacity
            onPress={handleFlipCard}
            style={styles.cardTouchable}
            activeOpacity={0.9}
          >
            <Animated.View
              style={[
                styles.studyCard,
                neumorphicShadow.xl,
                {
                  transform: [{ rotateY: flipInterpolation }]
                }
              ]}
            >
              <Card style={styles.cardContent}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardTags}>
                    {currentCard.tags.map((tag, index) => (
                      <View key={index} style={[
                        styles.tag,
                        { backgroundColor: theme.primary + '20' }
                      ]}>
                        <Text variant="caption" style={[
                          styles.tagText,
                          { color: theme.primary }
                        ]}>
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                  
                  <View style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(currentCard.difficulty) + '20' }
                  ]}>
                    <Text style={[
                      styles.difficultyText,
                      { color: getDifficultyColor(currentCard.difficulty) }
                    ]}>
                      {currentCard.difficulty}
                    </Text>
                  </View>
                </View>

                {/* Card Content */}
                <View style={styles.cardMainContent}>
                  {!isFlipped ? (
                    // Question Side
                    <View style={styles.questionSide}>
                      <Text variant="h3" style={styles.questionText}>
                        {currentCard.question}
                      </Text>
                      
                      <TouchableOpacity
                        onPress={() => setShowHints(!showHints)}
                        style={[styles.hintsButton, neumorphicShadow.sm]}
                      >
                        <Lightbulb size={16} color={theme.primary} />
                        <Text variant="label" style={styles.hintsButtonText}>
                          {showHints ? 'Hide Hints' : 'Show Hints'}
                        </Text>
                      </TouchableOpacity>
                      
                      {showHints && (
                        <View style={styles.hintsContainer}>
                          {currentCard.hints.map((hint, index) => (
                            <View key={index} style={styles.hintItem}>
                              <Text variant="body" style={styles.hintText}>
                                💡 {hint}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  ) : (
                    // Answer Side
                    <View style={styles.answerSide}>
                      <Text variant="body" style={styles.answerText}>
                        {currentCard.answer}
                      </Text>
                      
                      {currentCard.examples.length > 0 && (
                        <View style={styles.examplesContainer}>
                          <View style={styles.examplesHeader}>
                            <BookOpen size={16} color={theme.primary} />
                            <Text variant="label" style={styles.examplesTitle}>
                              Code Examples
                            </Text>
                          </View>
                          {currentCard.examples.map((example, index) => (
                            <View key={index} style={styles.exampleItem}>
                              <Text variant="caption" style={styles.exampleText}>
                                {example}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </View>

                {/* Flip Indicator */}
                <View style={styles.flipIndicator}>
                  <Text variant="caption" color="secondary">
                    {isFlipped ? 'Tap to see question' : 'Tap to reveal answer'}
                  </Text>
                </View>
              </Card>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        {/* Response Buttons */}
        {isFlipped && (
          <View style={styles.responseContainer}>
            <Text variant="label" style={styles.responseTitle}>
              How well did you know this?
            </Text>
            
            <View style={styles.responseButtons}>
              <Button
                onPress={() => handleCardResponse('hard')}
                style={[styles.responseButton, styles.hardButton]}
              >
                <XCircle size={16} color={theme.surface} />
                <Text variant="caption" style={styles.responseButtonText}>
                  Need Review
                </Text>
              </Button>
              
              <Button
                onPress={() => handleCardResponse('medium')}
                style={[styles.responseButton, styles.mediumButton]}
              >
                <RotateCcw size={16} color={theme.surface} />
                <Text variant="caption" style={styles.responseButtonText}>
                  Okay
                </Text>
              </Button>
              
              <Button
                onPress={() => handleCardResponse('easy')}
                style={[styles.responseButton, styles.easyButton]}
              >
                <CheckCircle size={16} color={theme.surface} />
                <Text variant="caption" style={styles.responseButtonText}>
                  Easy
                </Text>
              </Button>
            </View>
            
            <TouchableOpacity
              onPress={handleSkipCard}
              style={[styles.skipButton, neumorphicShadow.sm]}
            >
              <Text variant="caption" style={styles.skipButtonText}>
                Skip Card
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Study Mode Selector */}
        <Card style={[styles.modeCard, neumorphicShadow.md]}>
          <Text variant="label" style={styles.modeTitle}>Study Mode</Text>
          <View style={styles.modeButtons}>
            {(['review', 'test', 'focus'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => setStudyMode(mode)}
                style={[
                  styles.modeButton,
                  studyMode === mode ? styles.modeButtonActive : {},
                  studyMode === mode ? neumorphicShadow.inset : neumorphicShadow.sm
                ]}
              >
                <Text 
                  variant="caption" 
                  style={[
                    styles.modeButtonText,
                    studyMode === mode ? { color: theme.primary } : {}
                  ]}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );

  function getDifficultyColor(difficulty: 'easy' | 'medium' | 'hard') {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: theme.primary,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing[4],
  },
  headerTitle: {
    color: theme.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[6],
    paddingTop: 0,
    paddingBottom: spacing[12],
  },
  progressCard: {
    padding: spacing[4],
    marginBottom: spacing[6],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  progressInfo: {
    flex: 1,
  },
  progressText: {
    color: theme.text.primary,
    fontWeight: '600',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[1],
  },
  timerText: {
    color: theme.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  statText: {
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
  },
  cardContainer: {
    marginBottom: spacing[6],
  },
  cardTouchable: {
    borderRadius: 20,
  },
  studyCard: {
    borderRadius: 20,
    minHeight: 400,
  },
  cardContent: {
    padding: spacing[6],
    borderRadius: 20,
    minHeight: 400,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[6],
  },
  cardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    flex: 1,
  },
  tag: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardMainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  questionSide: {
    alignItems: 'center',
  },
  questionText: {
    color: theme.text.primary,
    textAlign: 'center',
    marginBottom: spacing[6],
    lineHeight: 28,
  },
  hintsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 12,
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  hintsButtonText: {
    color: theme.primary,
    fontWeight: '600',
  },
  hintsContainer: {
    width: '100%',
    gap: spacing[3],
  },
  hintItem: {
    backgroundColor: theme.primary + '10',
    padding: spacing[4],
    borderRadius: 12,
  },
  hintText: {
    color: theme.text.primary,
  },
  answerSide: {
    flex: 1,
  },
  answerText: {
    color: theme.text.primary,
    lineHeight: 24,
    marginBottom: spacing[6],
  },
  examplesContainer: {
    backgroundColor: '#f8fafc',
    padding: spacing[4],
    borderRadius: 12,
  },
  examplesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  examplesTitle: {
    color: theme.primary,
    fontWeight: '600',
  },
  exampleItem: {
    backgroundColor: '#e2e8f0',
    padding: spacing[3],
    borderRadius: 8,
    marginBottom: spacing[2],
  },
  exampleText: {
    color: theme.text.primary,
    fontFamily: 'monospace',
  },
  flipIndicator: {
    alignItems: 'center',
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.border,
    marginTop: 'auto',
  },
  responseContainer: {
    marginBottom: spacing[6],
  },
  responseTitle: {
    color: theme.text.primary,
    textAlign: 'center',
    marginBottom: spacing[4],
    fontWeight: '600',
  },
  responseButtons: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  responseButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
    borderRadius: 12,
    gap: spacing[2],
  },
  hardButton: {
    backgroundColor: '#ef4444',
  },
  mediumButton: {
    backgroundColor: '#f59e0b',
  },
  easyButton: {
    backgroundColor: '#10b981',
  },
  responseButtonText: {
    color: theme.surface,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: theme.surface,
    paddingVertical: spacing[3],
    borderRadius: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    color: theme.text.secondary,
  },
  modeCard: {
    padding: spacing[4],
  },
  modeTitle: {
    color: theme.text.primary,
    marginBottom: spacing[3],
    fontWeight: '600',
  },
  modeButtons: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  modeButton: {
    flex: 1,
    backgroundColor: theme.surface,
    paddingVertical: spacing[3],
    borderRadius: 8,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: theme.primary + '15',
  },
  modeButtonText: {
    fontWeight: '600',
  },
});

export default RevisionStudyScreen;