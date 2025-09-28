import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Animated
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { NeumorphicCard, NeumorphicButton } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';

interface FlashcardStudyScreenProps {
  flashcardSetId: string;
  onNavigate?: (screen: string, params?: any) => void;
  onGoBack?: () => void;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const FlashcardStudyScreen: React.FC<FlashcardStudyScreenProps> = ({ 
  flashcardSetId, 
  onNavigate, 
  onGoBack 
}) => {
  const { theme } = useTheme();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<'learn' | 'review' | 'test'>('learn');
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [studySession, setStudySession] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const flipAnimation = new Animated.Value(0);

  useEffect(() => {
    loadFlashcards();
  }, [flashcardSetId]);

  const loadFlashcards = async () => {
    // TODO: Load flashcards from API
    const mockFlashcards: Flashcard[] = [
      {
        id: '1',
        front: 'What is the primary purpose of diversification in investment portfolios?',
        back: 'To minimize risk by spreading investments across different assets, sectors, and geographic regions.',
        category: 'Investment Planning',
        difficulty: 'medium'
      },
      {
        id: '2',
        front: 'Define compound interest.',
        back: 'Interest calculated on the initial principal and the accumulated interest of previous periods.',
        category: 'Financial Mathematics',
        difficulty: 'easy'
      },
      {
        id: '3',
        front: 'What is the difference between systematic and unsystematic risk?',
        back: 'Systematic risk affects the entire market and cannot be diversified away, while unsystematic risk affects individual companies and can be reduced through diversification.',
        category: 'Risk Management',
        difficulty: 'hard'
      }
    ];

    setFlashcards(mockFlashcards);
    setStudySession({
      id: Date.now().toString(),
      startTime: new Date(),
      totalCards: mockFlashcards.length,
      correctAnswers: 0,
      incorrectAnswers: 0
    });
  };

  const flipCard = () => {
    if (isFlipped) return;

    Animated.timing(flipAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(true);
    });
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setIncorrectCount(prev => prev + 1);
    }

    // Move to next card
    if (currentIndex < flashcards.length - 1) {
      nextCard();
    } else {
      completeStudy();
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    flipAnimation.setValue(0);
    setCurrentIndex(prev => prev + 1);
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      flipAnimation.setValue(0);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const completeStudy = () => {
    setIsCompleted(true);
    // TODO: Save study session results
  };

  const restartStudy = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsCompleted(false);
    flipAnimation.setValue(0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return theme.colors.success;
      case 'medium': return theme.colors.warning;
      case 'hard': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const getProgressPercentage = () => {
    return ((currentIndex + 1) / flashcards.length) * 100;
  };

  if (flashcards.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading flashcards...
        </Text>
      </View>
    );
  }

  if (isCompleted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.completionContainer}>
          <NeumorphicCard style={styles.completionCard}>
            <Ionicons name="trophy" size={64} color={theme.colors.success} />
            <Text style={[styles.completionTitle, { color: theme.colors.text }]}>
              Study Complete!
            </Text>
            <Text style={[styles.completionSubtitle, { color: theme.colors.textSecondary }]}>
              Great job studying your flashcards
            </Text>
            
            <View style={styles.resultsContainer}>
              <View style={styles.resultItem}>
                <Text style={[styles.resultValue, { color: theme.colors.success }]}>
                  {correctCount}
                </Text>
                <Text style={[styles.resultLabel, { color: theme.colors.textSecondary }]}>
                  Correct
                </Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={[styles.resultValue, { color: theme.colors.error }]}>
                  {incorrectCount}
                </Text>
                <Text style={[styles.resultLabel, { color: theme.colors.textSecondary }]}>
                  Incorrect
                </Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={[styles.resultValue, { color: theme.colors.info }]}>
                  {Math.round((correctCount / flashcards.length) * 100)}%
                </Text>
                <Text style={[styles.resultLabel, { color: theme.colors.textSecondary }]}>
                  Accuracy
                </Text>
              </View>
            </View>
            
            <View style={styles.completionActions}>
              <NeumorphicButton
                variant="primary"
                size="lg"
                onPress={restartStudy}
                style={styles.actionButton}
              >
                <Ionicons name="refresh" size={20} color="white" />
                <Text style={styles.actionButtonText}>Study Again</Text>
              </NeumorphicButton>
              
              <NeumorphicButton
                variant="secondary"
                size="lg"
                onPress={onGoBack}
                style={styles.actionButton}
              >
                <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
                <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
                  Back to Flashcards
                </Text>
              </NeumorphicButton>
            </View>
          </NeumorphicCard>
        </View>
      </View>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <NeumorphicCard style={styles.headerCard}>
        <View style={styles.headerTop}>
          <Text style={[styles.cardCounter, { color: theme.colors.text }]}>
            {currentIndex + 1} of {flashcards.length}
          </Text>
          <View style={[styles.difficultyBadge, { 
            backgroundColor: getDifficultyColor(currentCard.difficulty) + '20' 
          }]}>
            <Text style={[styles.difficultyText, { 
              color: getDifficultyColor(currentCard.difficulty) 
            }]}>
              {currentCard.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.surface }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: theme.colors.primary,
                  width: `${getProgressPercentage()}%`
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            {Math.round(getProgressPercentage())}% Complete
          </Text>
        </View>
      </NeumorphicCard>

      {/* Flashcard */}
      <View style={styles.cardContainer}>
        <TouchableOpacity onPress={flipCard} activeOpacity={0.9}>
          <Animated.View
            style={[
              styles.card,
              {
                transform: [
                  {
                    rotateY: flipAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <NeumorphicCard style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={[styles.categoryText, { color: theme.colors.textSecondary }]}>
                  {currentCard.category}
                </Text>
                {!isFlipped && (
                  <TouchableOpacity onPress={flipCard} style={styles.flipButton}>
                    <Ionicons name="refresh" size={20} color={theme.colors.primary} />
                    <Text style={[styles.flipText, { color: theme.colors.primary }]}>
                      Tap to reveal
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.cardBody}>
                <Text style={[styles.cardText, { color: theme.colors.text }]}>
                  {isFlipped ? currentCard.back : currentCard.front}
                </Text>
              </View>
              
              {isFlipped && (
                <View style={styles.cardFooter}>
                  <Text style={[styles.answerLabel, { color: theme.colors.textSecondary }]}>
                    {isFlipped ? 'Answer' : 'Question'}
                  </Text>
                </View>
              )}
            </NeumorphicCard>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Answer Buttons (only when flipped) */}
      {isFlipped && (
        <View style={styles.answerButtons}>
          <NeumorphicButton
            variant="error"
            size="lg"
            onPress={() => handleAnswer(false)}
            style={styles.answerButton}
          >
            <Ionicons name="close" size={20} color="white" />
            <Text style={styles.answerButtonText}>Incorrect</Text>
          </NeumorphicButton>
          
          <NeumorphicButton
            variant="success"
            size="lg"
            onPress={() => handleAnswer(true)}
            style={styles.answerButton}
          >
            <Ionicons name="checkmark" size={20} color="white" />
            <Text style={styles.answerButtonText}>Correct</Text>
          </NeumorphicButton>
        </View>
      )}

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <NeumorphicButton
          variant="secondary"
          size="md"
          onPress={previousCard}
          disabled={currentIndex === 0}
          style={styles.navButton}
        >
          <Ionicons name="chevron-back" size={16} color={theme.colors.text} />
          <Text style={[styles.navButtonText, { color: theme.colors.text }]}>
            Previous
          </Text>
        </NeumorphicButton>

        <View style={styles.navCenter}>
          <Text style={[styles.navCounter, { color: theme.colors.textSecondary }]}>
            {currentIndex + 1} / {flashcards.length}
          </Text>
        </View>

        <NeumorphicButton
          variant="secondary"
          size="md"
          onPress={nextCard}
          disabled={currentIndex === flashcards.length - 1}
          style={styles.navButton}
        >
          <Text style={[styles.navButtonText, { color: theme.colors.text }]}>
            Next
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.text} />
        </NeumorphicButton>
      </View>

      {/* Study Stats */}
      <NeumorphicCard style={styles.statsCard}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {correctCount}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Correct
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.error }]}>
              {incorrectCount}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Incorrect
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.info }]}>
              {Math.round(((correctCount + incorrectCount) / flashcards.length) * 100)}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Progress
            </Text>
          </View>
        </View>
      </NeumorphicCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
  },
  headerCard: {
    padding: 16,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardCounter: {
    fontSize: 16,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    height: 300,
  },
  cardContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  flipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
  },
  cardFooter: {
    alignItems: 'center',
    marginTop: 16,
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  answerButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  answerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  answerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 100,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  navCenter: {
    flex: 1,
    alignItems: 'center',
  },
  navCounter: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsCard: {
    padding: 16,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionCard: {
    padding: 32,
    alignItems: 'center',
    maxWidth: 400,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  completionSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  resultsContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 32,
  },
  resultItem: {
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultLabel: {
    fontSize: 12,
  },
  completionActions: {
    gap: 12,
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FlashcardStudyScreen;
