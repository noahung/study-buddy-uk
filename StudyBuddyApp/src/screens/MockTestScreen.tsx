import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Clock,
  Flag,
  CheckCircle,
  Circle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { theme, spacing, neumorphicShadow } from '../styles';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Props {
  onNavigate: (screen: string) => void;
  onOpenSidebar: () => void;
}

const { width } = Dimensions.get('window');

const MockTestScreen: React.FC<Props> = ({ onNavigate, onOpenSidebar }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const questions: Question[] = [
    {
      id: 1,
      question: "What is the primary purpose of React's Virtual DOM?",
      options: [
        "To directly manipulate the browser's DOM",
        "To improve performance by minimizing direct DOM manipulation",
        "To store application state",
        "To handle user input events"
      ],
      correctAnswer: "To improve performance by minimizing direct DOM manipulation",
      explanation: "The Virtual DOM is a JavaScript representation of the actual DOM that helps React batch updates and minimize expensive DOM operations."
    },
    {
      id: 2,
      question: "Which hook would you use to perform side effects in a functional component?",
      options: [
        "useState",
        "useContext",
        "useEffect",
        "useReducer"
      ],
      correctAnswer: "useEffect",
      explanation: "useEffect is the hook used for side effects like data fetching, subscriptions, or manually changing the DOM in functional components."
    },
    {
      id: 3,
      question: "What is the difference between controlled and uncontrolled components?",
      options: [
        "Controlled components use refs, uncontrolled use state",
        "Controlled components are managed by React state, uncontrolled store their own state",
        "There is no difference",
        "Controlled components are faster than uncontrolled"
      ],
      correctAnswer: "Controlled components are managed by React state, uncontrolled store their own state",
      explanation: "Controlled components have their form data handled by React component state, while uncontrolled components store form data in the DOM itself."
    },
    {
      id: 4,
      question: "When should you use useReducer instead of useState?",
      options: [
        "When you have simple boolean state",
        "When you have complex state logic or multiple related state variables",
        "When you need to store strings",
        "Never, useState is always better"
      ],
      correctAnswer: "When you have complex state logic or multiple related state variables",
      explanation: "useReducer is preferable when you have complex state logic, multiple sub-values, or when the next state depends on the previous one."
    },
    {
      id: 5,
      question: "What is prop drilling and how can you avoid it?",
      options: [
        "Passing props through multiple component levels; avoid with global variables",
        "Passing props through multiple component levels; avoid with Context API or state management libraries",
        "A way to optimize component performance; cannot be avoided",
        "A method to pass functions as props; avoid with arrow functions"
      ],
      correctAnswer: "Passing props through multiple component levels; avoid with Context API or state management libraries",
      explanation: "Prop drilling occurs when you pass data through many component levels. It can be avoided using Context API, Redux, or other state management solutions."
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto-submit when time runs out
      handleSubmit();
    }
  }, [timeRemaining]);

  // Animation for question transitions
  useEffect(() => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentQuestionIndex]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer
    });

    // Scale animation for selection
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
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const toggleFlag = () => {
    if (flaggedQuestions.includes(currentQuestion.id)) {
      setFlaggedQuestions(flaggedQuestions.filter(id => id !== currentQuestion.id));
    } else {
      setFlaggedQuestions([...flaggedQuestions, currentQuestion.id]);
    }
  };

  const handleSubmit = () => {
    const results = {
      answers,
      questions,
      score: calculateScore(),
      timeSpent: 3600 - timeRemaining,
      flaggedQuestions
    };
    
    // Navigate to results screen
    onNavigate('test-results');
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const confirmSubmit = () => {
    Alert.alert(
      'Submit Test?',
      `You have answered ${answeredCount} out of ${questions.length} questions. ${
        questions.length - answeredCount > 0 
          ? `${questions.length - answeredCount} questions remain unanswered.`
          : 'All questions have been answered.'
      }`,
      [
        {
          text: 'Continue Test',
          style: 'cancel',
        },
        {
          text: 'Submit Now',
          style: 'default',
          onPress: handleSubmit,
        },
      ],
      { cancelable: true }
    );
  };

  const renderQuestionNavigation = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.questionNavContainer}
      contentContainerStyle={styles.questionNavContent}
    >
      {questions.map((_, index) => {
        const isAnswered = answers[questions[index].id];
        const isFlagged = flaggedQuestions.includes(questions[index].id);
        const isCurrent = index === currentQuestionIndex;
        
        return (
          <TouchableOpacity
            key={index}
            onPress={() => jumpToQuestion(index)}
            style={[
              styles.questionNavButton,
              {
                backgroundColor: isCurrent 
                  ? theme.primary 
                  : isAnswered 
                    ? '#10b981' 
                    : theme.surface,
                ...neumorphicShadow.sm,
              }
            ]}
            activeOpacity={0.8}
          >
            <Text 
              variant="label" 
              style={{ 
                color: isCurrent || isAnswered ? theme.surface : theme.text.primary 
              }}
            >
              {index + 1}
            </Text>
            {isFlagged && <View style={styles.flagIndicator} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderQuestion = () => (
    <Animated.View
      style={[
        styles.questionContainer,
        neumorphicShadow.lg,
        {
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 10],
              }),
            },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      {/* Question Header */}
      <View style={styles.questionHeader}>
        <Text variant="h3" style={{ color: theme.text.primary }}>
          Question {currentQuestionIndex + 1}
        </Text>
        <TouchableOpacity
          onPress={toggleFlag}
          style={[
            styles.flagButton,
            { opacity: flaggedQuestions.includes(currentQuestion.id) ? 1 : 0.5 }
          ]}
        >
          <Flag 
            size={20} 
            color={flaggedQuestions.includes(currentQuestion.id) ? '#f59e0b' : theme.text.secondary} 
          />
        </TouchableOpacity>
      </View>

      {/* Question Text */}
      <Text variant="body" style={styles.questionText}>
        {currentQuestion.question}
      </Text>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          const isSelected = answers[currentQuestion.id] === option;
          
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleAnswerSelect(option)}
              style={[
                styles.optionButton,
                {
                  backgroundColor: isSelected ? '#eff6ff' : theme.surface,
                  borderColor: isSelected ? theme.primary : 'transparent',
                  borderWidth: isSelected ? 2 : 0,
                  ...(isSelected ? neumorphicShadow.sm : neumorphicShadow.md),
                }
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                {isSelected ? (
                  <CheckCircle size={20} color={theme.primary} />
                ) : (
                  <Circle size={20} color={theme.text.secondary} />
                )}
                <Text 
                  variant="body" 
                  style={{
                    ...styles.optionText,
                    color: isSelected ? theme.primary : theme.text.primary
                  }}
                >
                  {option}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => onNavigate('mock-test-menu')}
            style={[styles.backButton, neumorphicShadow.sm]}
          >
            <ArrowLeft size={20} color={theme.text.primary} />
          </TouchableOpacity>
          
          <View style={styles.headerText}>
            <Text variant="h3" style={{ color: theme.text.primary }}>
              React Advanced Patterns
            </Text>
            <Text variant="caption" style={{ color: theme.text.secondary }}>
              Mock Test - {questions.length} Questions
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.timerContainer,
          {
            backgroundColor: timeRemaining < 300 ? '#fef2f2' : theme.surface,
            ...neumorphicShadow.sm,
          }
        ]}>
          <Clock 
            size={16} 
            color={timeRemaining < 300 ? '#dc2626' : theme.text.primary} 
          />
          <Text 
            variant="label" 
            style={{ 
              color: timeRemaining < 300 ? '#dc2626' : theme.text.primary,
              marginLeft: spacing[2]
            }}
          >
            {formatTime(timeRemaining)}
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text variant="caption" style={{ color: theme.text.secondary }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <Text variant="caption" style={{ color: theme.text.secondary }}>
            {answeredCount} answered
          </Text>
        </View>
        <Progress value={progress} style={styles.progressBar} />
      </View>

      {/* Question Navigation */}
      <View style={[styles.navigationCard, neumorphicShadow.md]}>
        {renderQuestionNavigation()}
      </View>

      {/* Question */}
      <ScrollView
        style={styles.questionScrollView}
        contentContainerStyle={styles.questionScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderQuestion()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <Button
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="secondary"
          style={{
            ...styles.navButton,
            opacity: currentQuestionIndex === 0 ? 0.5 : 1
          }}
        >
          <ChevronLeft size={16} color={theme.text.primary} />
          <Text variant="label" style={{ color: theme.text.primary, marginLeft: spacing[1] }}>
            Previous
          </Text>
        </Button>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            onPress={confirmSubmit}
            style={{
              ...styles.navButton,
              backgroundColor: '#10b981'
            }}
          >
            <Text variant="label" style={{ color: theme.surface }}>
              Submit Test
            </Text>
          </Button>
        ) : (
          <Button
            onPress={handleNext}
            style={styles.navButton}
          >
            <Text variant="label" style={{ color: theme.surface, marginRight: spacing[1] }}>
              Next
            </Text>
            <ChevronRight size={16} color={theme.surface} />
          </Button>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[4],
  },
  headerText: {
    flex: 1,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 12,
  },
  progressContainer: {
    paddingHorizontal: spacing[6],
    marginBottom: spacing[4],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  progressBar: {
    height: 8,
  },
  navigationCard: {
    backgroundColor: theme.surface,
    marginHorizontal: spacing[6],
    borderRadius: 12,
    paddingVertical: spacing[4],
    marginBottom: spacing[4],
  },
  questionNavContainer: {
    paddingHorizontal: spacing[4],
  },
  questionNavContent: {
    gap: spacing[2],
  },
  questionNavButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  flagIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    backgroundColor: '#f59e0b',
    borderRadius: 6,
  },
  questionScrollView: {
    flex: 1,
    paddingHorizontal: spacing[6],
  },
  questionScrollContent: {
    paddingBottom: spacing[4],
  },
  questionContainer: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: spacing[6],
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[6],
  },
  flagButton: {
    padding: spacing[2],
  },
  questionText: {
    color: theme.text.primary,
    marginBottom: spacing[6],
    lineHeight: 24,
  },
  optionsContainer: {
    gap: spacing[3],
  },
  optionButton: {
    borderRadius: 12,
    padding: spacing[4],
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    marginLeft: spacing[3],
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    backgroundColor: theme.surface,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
  },
});

export default MockTestScreen;