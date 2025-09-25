import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  RotateCcw,
  Check,
  X,
  Eye,
  EyeOff,
  SkipForward,
  Star,
  Volume2,
} from 'lucide-react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { theme, spacing, neumorphicShadow } from '../styles';

interface Props {
  onNavigate: (screen: string) => void;
}

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - spacing[6] * 2;
const CARD_HEIGHT = height * 0.5;

const FlashcardStudyScreen: React.FC<Props> = ({ onNavigate }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studiedCards, setStudiedCards] = useState<number[]>([]);
  const [correctCards, setCorrectCards] = useState<number[]>([]);
  const [incorrectCards, setIncorrectCards] = useState<number[]>([]);

  // Animation values
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const flashcards: Flashcard[] = [
    {
      id: 1,
      question: "What is the primary purpose of React's useEffect hook?",
      answer: "useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM. It runs after the render is committed to the screen.",
      difficulty: "Medium",
      category: "React Hooks"
    },
    {
      id: 2,
      question: "Explain the difference between controlled and uncontrolled components in React.",
      answer: "Controlled components have their form data handled by React component state, while uncontrolled components store their form data in the DOM itself. Controlled components use onChange handlers and value props.",
      difficulty: "Easy",
      category: "React Forms"
    },
    {
      id: 3,
      question: "What is Redux and when would you use it?",
      answer: "Redux is a predictable state container for JavaScript apps. It helps manage application state in a centralized store. Use it when you have complex state logic, many components need access to the same state, or you need predictable state updates.",
      difficulty: "Hard",
      category: "State Management"
    },
    {
      id: 4,
      question: "What is the Virtual DOM and how does it work?",
      answer: "The Virtual DOM is a JavaScript representation of the actual DOM. React uses it to improve performance by batching updates, comparing changes (diffing), and only updating the parts of the real DOM that have changed.",
      difficulty: "Medium",
      category: "React Concepts"
    },
    {
      id: 5,
      question: "Explain React's component lifecycle methods.",
      answer: "Lifecycle methods are hooks that allow you to tap into different phases of a component's life: mounting (componentDidMount), updating (componentDidUpdate), and unmounting (componentWillUnmount). In functional components, useEffect handles these phases.",
      difficulty: "Hard",
      category: "React Lifecycle"
    }
  ];

  const currentCard = flashcards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / flashcards.length) * 100;
  const studiedCount = studiedCards.length;
  const correctCount = correctCards.length;
  const incorrectCount = incorrectCards.length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return theme.text.secondary;
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);

    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const markCard = (isCorrect: boolean) => {
    const cardId = currentCard.id;
    
    if (!studiedCards.includes(cardId)) {
      setStudiedCards([...studiedCards, cardId]);
    }
    
    if (isCorrect) {
      setCorrectCards([...correctCards.filter(id => id !== cardId), cardId]);
      setIncorrectCards(incorrectCards.filter(id => id !== cardId));
    } else {
      setIncorrectCards([...incorrectCards.filter(id => id !== cardId), cardId]);
      setCorrectCards(correctCards.filter(id => id !== cardId));
    }

    // Scale animation for feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto advance to next card
    setTimeout(nextCard, 300);
  };

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowAnswer(false);
      flipAnim.setValue(0);
      
      // Slide animation
      slideAnim.setValue(1);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Study session complete
      onNavigate('flashcard-results');
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false);
      flipAnim.setValue(0);
    }
  };

  const resetSession = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    setStudiedCards([]);
    setCorrectCards([]);
    setIncorrectCards([]);
    flipAnim.setValue(0);
    slideAnim.setValue(0);
  };

  const renderCard = () => {
    const frontOpacity = flipAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    const backOpacity = flipAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const rotateY = flipAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [
              { scale: scaleAnim },
              { translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -20],
              })},
              { perspective: 1000 },
              { rotateY },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={flipCard}
          activeOpacity={0.95}
        >
          <Card style={{
            ...styles.flashcard,
            ...neumorphicShadow.xl
          }}>
            {/* Front of card (Question) */}
            <Animated.View
              style={[
                styles.cardSide,
                styles.cardFront,
                { opacity: frontOpacity }
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[
                  styles.categoryBadge,
                  { backgroundColor: getDifficultyColor(currentCard.difficulty) + '20' }
                ]}>
                  <Text
                    variant="caption"
                    style={{
                      color: getDifficultyColor(currentCard.difficulty),
                      fontWeight: '600'
                    }}
                  >
                    {currentCard.category}
                  </Text>
                </View>
                
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(currentCard.difficulty) }
                ]}>
                  <Text variant="caption" style={{ color: theme.surface, fontWeight: '600' }}>
                    {currentCard.difficulty}
                  </Text>
                </View>
              </View>
              
              <View style={styles.cardContent}>
                <Text variant="h3" style={styles.questionText}>
                  {currentCard.question}
                </Text>
                
                <View style={styles.tapHint}>
                  <Eye size={16} color={theme.text.secondary} />
                  <Text variant="caption" style={styles.hintText}>
                    Tap to reveal answer
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Back of card (Answer) */}
            <Animated.View
              style={[
                styles.cardSide,
                styles.cardBack,
                { opacity: backOpacity }
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[
                  styles.categoryBadge,
                  { backgroundColor: getDifficultyColor(currentCard.difficulty) + '20' }
                ]}>
                  <Text
                    variant="caption"
                    style={{
                      color: getDifficultyColor(currentCard.difficulty),
                      fontWeight: '600'
                    }}
                  >
                    Answer
                  </Text>
                </View>
                
                <TouchableOpacity style={styles.speakButton}>
                  <Volume2 size={16} color={theme.text.secondary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.cardContent}>
                <Text variant="body" style={styles.answerText}>
                  {currentCard.answer}
                </Text>
                
                <View style={styles.tapHint}>
                  <EyeOff size={16} color={theme.text.secondary} />
                  <Text variant="caption" style={styles.hintText}>
                    Tap to hide answer
                  </Text>
                </View>
              </View>
            </Animated.View>
          </Card>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate('flashcards')}
          style={[styles.backButton, neumorphicShadow.sm]}
        >
          <ArrowLeft size={20} color={theme.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text variant="h3" style={{ color: theme.text.primary }}>
            JavaScript Fundamentals
          </Text>
          <Text variant="caption" style={{ color: theme.text.secondary }}>
            Card {currentCardIndex + 1} of {flashcards.length}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={resetSession}
          style={[styles.resetButton, neumorphicShadow.sm]}
        >
          <RotateCcw size={20} color={theme.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Progress value={progress} style={styles.progressBar} />
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text variant="caption" style={{ color: '#10b981' }}>
              ✓ {correctCount}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="caption" style={{ color: theme.text.secondary }}>
              {studiedCount} studied
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="caption" style={{ color: '#ef4444' }}>
              ✗ {incorrectCount}
            </Text>
          </View>
        </View>
      </View>

      {/* Flashcard */}
      <View style={styles.cardArea}>
        {renderCard()}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Navigation Buttons */}
        <View style={styles.navigationRow}>
          <Button
            onPress={previousCard}
            disabled={currentCardIndex === 0}
            variant="secondary"
            style={{
              ...styles.navButton,
              opacity: currentCardIndex === 0 ? 0.5 : 1
            }}
          >
            <Text variant="label" style={{ color: theme.text.primary }}>
              Previous
            </Text>
          </Button>
          
          <TouchableOpacity
            onPress={() => nextCard()}
            style={[styles.skipButton, neumorphicShadow.sm]}
          >
            <SkipForward size={20} color={theme.text.secondary} />
          </TouchableOpacity>
          
          <Button
            onPress={nextCard}
            disabled={currentCardIndex === flashcards.length - 1}
            style={{
              ...styles.navButton,
              opacity: currentCardIndex === flashcards.length - 1 ? 0.5 : 1
            }}
          >
            <Text variant="label" style={{ color: theme.surface }}>
              Next
            </Text>
          </Button>
        </View>

        {/* Answer Buttons - only show when answer is revealed */}
        {showAnswer && (
          <View style={styles.answerButtons}>
            <Button
              onPress={() => markCard(false)}
              style={{
                ...styles.answerButton,
                backgroundColor: '#ef4444'
              }}
            >
              <X size={20} color={theme.surface} />
              <Text variant="label" style={{ 
                color: theme.surface,
                marginLeft: spacing[2] 
              }}>
                Incorrect
              </Text>
            </Button>
            
            <Button
              onPress={() => markCard(true)}
              style={{
                ...styles.answerButton,
                backgroundColor: '#10b981'
              }}
            >
              <Check size={20} color={theme.surface} />
              <Text variant="label" style={{ 
                color: theme.surface,
                marginLeft: spacing[2] 
              }}>
                Correct
              </Text>
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  progressContainer: {
    paddingHorizontal: spacing[6],
    marginBottom: spacing[6],
  },
  progressBar: {
    height: 8,
    marginBottom: spacing[3],
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  cardTouchable: {
    flex: 1,
  },
  flashcard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardSide: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    padding: spacing[6],
  },
  cardFront: {
    backgroundColor: theme.surface,
  },
  cardBack: {
    backgroundColor: theme.surface,
    transform: [{ rotateY: '180deg' }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  categoryBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 12,
  },
  difficultyBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 12,
  },
  speakButton: {
    padding: spacing[2],
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  questionText: {
    color: theme.text.primary,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: spacing[8],
  },
  answerText: {
    color: theme.text.primary,
    lineHeight: 24,
    textAlign: 'left',
    marginBottom: spacing[6],
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  hintText: {
    color: theme.text.secondary,
    marginLeft: spacing[2],
  },
  controls: {
    padding: spacing[6],
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  navButton: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
  },
  skipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerButtons: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  answerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
  },
});

export default FlashcardStudyScreen;