import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Modal
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { NeumorphicCard, NeumorphicButton } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';

interface ExamScreenProps {
  examId: string;
  onNavigate?: (screen: string, params?: any) => void;
  onGoBack?: () => void;
}

interface Question {
  id: string;
  questionText: string;
  type: 'multiple-choice' | 'true-false';
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

const ExamScreen: React.FC<ExamScreenProps> = ({ 
  examId, 
  onNavigate, 
  onGoBack 
}) => {
  const { theme } = useTheme();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [exam, setExam] = useState<any>(null);

  useEffect(() => {
    loadExam();
  }, [examId]);

  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmitExam();
    }
  }, [timeRemaining, isSubmitted]);

  const loadExam = async () => {
    // TODO: Load exam from API
    const mockExam = {
      id: examId,
      title: 'Financial Planning Fundamentals',
      duration: 120, // minutes
      questions: 50
    };

    const mockQuestions: Question[] = [
      {
        id: '1',
        questionText: 'What is the primary purpose of diversification in investment portfolios?',
        type: 'multiple-choice',
        options: [
          'To maximize returns',
          'To minimize risk',
          'To reduce taxes',
          'To increase liquidity'
        ],
        correctAnswer: 'To minimize risk',
        explanation: 'Diversification spreads risk across different investments to reduce overall portfolio risk.'
      },
      {
        id: '2',
        questionText: 'A higher risk tolerance generally leads to higher potential returns.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Higher risk investments typically offer higher potential returns to compensate for the increased risk.'
      }
      // Add more mock questions...
    ];

    setExam(mockExam);
    setQuestions(mockQuestions);
    setTimeRemaining(mockExam.duration * 60); // Convert to seconds
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitExam = () => {
    setShowSubmitModal(true);
  };

  const confirmSubmit = () => {
    setIsSubmitted(true);
    setShowSubmitModal(false);
    
    // Calculate score
    let correctAnswers = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= 70;
    
    // Navigate to results
    onNavigate?.('test-results', { 
      examId, 
      score, 
      passed, 
      answers, 
      questions,
      timeSpent: (exam?.duration * 60) - timeRemaining
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / questions.length) * 100;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (!exam || questions.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading exam...
        </Text>
      </View>
    );
  }

  const currentQ = questions[currentQuestion];
  const isAnswered = answers[currentQ?.id] !== undefined;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <NeumorphicCard style={styles.headerCard}>
        <View style={styles.headerTop}>
          <Text style={[styles.examTitle, { color: theme.colors.text }]}>
            {exam.title}
          </Text>
          <View style={[styles.timerContainer, { 
            backgroundColor: timeRemaining < 300 ? theme.colors.error + '20' : theme.colors.surface 
          }]}>
            <Ionicons 
              name="time" 
              size={16} 
              color={timeRemaining < 300 ? theme.colors.error : theme.colors.textSecondary} 
            />
            <Text style={[styles.timerText, { 
              color: timeRemaining < 300 ? theme.colors.error : theme.colors.text 
            }]}>
              {formatTime(timeRemaining)}
            </Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
              Question {currentQuestion + 1} of {questions.length}
            </Text>
            <Text style={[styles.answeredText, { color: theme.colors.textSecondary }]}>
              {getAnsweredCount()} answered
            </Text>
          </View>
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
        </View>
      </NeumorphicCard>

      {/* Question */}
      <ScrollView style={styles.questionContainer}>
        <NeumorphicCard style={styles.questionCard}>
          <Text style={[styles.questionNumber, { color: theme.colors.primary }]}>
            Question {currentQuestion + 1}
          </Text>
          <Text style={[styles.questionText, { color: theme.colors.text }]}>
            {currentQ.questionText}
          </Text>
          
          <View style={styles.optionsContainer}>
            {currentQ.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  { 
                    backgroundColor: answers[currentQ.id] === option 
                      ? theme.colors.primary + '20' 
                      : theme.colors.surface,
                    borderColor: answers[currentQ.id] === option 
                      ? theme.colors.primary 
                      : theme.colors.border
                  }
                ]}
                onPress={() => handleAnswerSelect(currentQ.id, option)}
              >
                <View style={[
                  styles.optionIndicator,
                  { 
                    backgroundColor: answers[currentQ.id] === option 
                      ? theme.colors.primary 
                      : 'transparent',
                    borderColor: answers[currentQ.id] === option 
                      ? theme.colors.primary 
                      : theme.colors.border
                  }
                ]}>
                  {answers[currentQ.id] === option && (
                    <Ionicons name="checkmark" size={12} color="white" />
                  )}
                </View>
                <Text style={[styles.optionText, { color: theme.colors.text }]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </NeumorphicCard>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <NeumorphicButton
          variant="secondary"
          size="md"
          onPress={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          style={styles.navButton}
        >
          <Ionicons name="chevron-back" size={16} color={theme.colors.text} />
          <Text style={[styles.navButtonText, { color: theme.colors.text }]}>
            Previous
          </Text>
        </NeumorphicButton>

        <View style={styles.navCenter}>
          <Text style={[styles.questionCounter, { color: theme.colors.textSecondary }]}>
            {currentQuestion + 1} / {questions.length}
          </Text>
        </View>

        {currentQuestion === questions.length - 1 ? (
          <NeumorphicButton
            variant="primary"
            size="md"
            onPress={handleSubmitExam}
            style={styles.navButton}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
            <Ionicons name="checkmark" size={16} color="white" />
          </NeumorphicButton>
        ) : (
          <NeumorphicButton
            variant="primary"
            size="md"
            onPress={handleNextQuestion}
            style={styles.navButton}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="chevron-forward" size={16} color="white" />
          </NeumorphicButton>
        )}
      </View>

      {/* Submit Confirmation Modal */}
      <Modal
        visible={showSubmitModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSubmitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <NeumorphicCard style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Submit Exam?
            </Text>
            <Text style={[styles.modalText, { color: theme.colors.textSecondary }]}>
              You have answered {getAnsweredCount()} out of {questions.length} questions.
              Are you sure you want to submit your exam?
            </Text>
            
            <View style={styles.modalActions}>
              <NeumorphicButton
                variant="secondary"
                size="md"
                onPress={() => setShowSubmitModal(false)}
                style={styles.modalButton}
              >
                Continue
              </NeumorphicButton>
              <NeumorphicButton
                variant="primary"
                size="md"
                onPress={confirmSubmit}
                style={styles.modalButton}
              >
                Submit
              </NeumorphicButton>
            </View>
          </NeumorphicCard>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    margin: 16,
    marginBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 16,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    gap: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
  },
  answeredText: {
    fontSize: 12,
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
  questionContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  questionCard: {
    padding: 20,
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionText: {
    fontSize: 14,
    flex: 1,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  questionCounter: {
    fontSize: 14,
    fontWeight: '600',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

export default ExamScreen;
