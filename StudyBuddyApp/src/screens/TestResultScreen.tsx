import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Flag,
  RotateCcw,
  Share,
  TrendingUp,
  Award,
} from 'lucide-react-native';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { theme, spacing, neumorphicShadow } from '../styles';

interface Props {
  onNavigate: (screen: string) => void;
}

const { width } = Dimensions.get('window');

const TestResultScreen: React.FC<Props> = ({ onNavigate }) => {
  // Mock results data - in real app this would come from props/context
  const results = {
    score: 80,
    correctAnswers: 4,
    totalQuestions: 5,
    timeSpent: 1680, // 28 minutes in seconds
    answers: {
      "1": "To improve performance by minimizing direct DOM manipulation",
      "2": "useEffect",
      "3": "Controlled components are managed by React state, uncontrolled store their own state",
      "4": "When you have simple boolean state", // Incorrect answer
      "5": "Passing props through multiple component levels; avoid with Context API or state management libraries"
    } as { [key: string]: string },
    questions: [
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
        explanation: "The Virtual DOM is a JavaScript representation of the actual DOM that helps React batch updates and minimize expensive DOM operations.",
        isCorrect: true
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
        explanation: "useEffect is the hook used for side effects like data fetching, subscriptions, or manually changing the DOM in functional components.",
        isCorrect: true
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
        explanation: "Controlled components have their form data handled by React component state, while uncontrolled components store form data in the DOM itself.",
        isCorrect: true
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
        explanation: "useReducer is preferable when you have complex state logic, multiple sub-values, or when the next state depends on the previous one.",
        isCorrect: false
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
        explanation: "Prop drilling occurs when you pass data through many component levels. It can be avoided using Context API, Redux, or other state management solutions.",
        isCorrect: true
      }
    ],
    performance: {
      accuracy: 80,
      speed: 'Average',
      strengths: ['Component Architecture', 'State Management'],
      weaknesses: ['Advanced Hooks']
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'F';
  };

  const renderScoreOverview = () => (
    <Card style={styles.scoreCard}>
      <View style={styles.scoreHeader}>
        <View style={[
          styles.gradeCircle,
          { backgroundColor: getScoreColor(results.score) }
        ]}>
          <Award size={32} color={theme.surface} />
        </View>
        <View style={styles.scoreDetails}>
          <Text variant="h1" style={{ 
            color: getScoreColor(results.score),
            fontSize: 48,
            fontWeight: '700'
          }}>
            {results.score}%
          </Text>
          <Text variant="h3" style={{ color: theme.text.primary }}>
            Grade {getGrade(results.score)}
          </Text>
        </View>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <CheckCircle size={20} color="#10b981" />
          <Text variant="body" style={styles.statValue}>
            {results.correctAnswers}/{results.totalQuestions}
          </Text>
          <Text variant="caption" style={styles.statLabel}>
            Correct
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Clock size={20} color={theme.primary} />
          <Text variant="body" style={styles.statValue}>
            {formatTime(results.timeSpent)}
          </Text>
          <Text variant="caption" style={styles.statLabel}>
            Time Taken
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Target size={20} color="#f59e0b" />
          <Text variant="body" style={styles.statValue}>
            {results.performance.accuracy}%
          </Text>
          <Text variant="caption" style={styles.statLabel}>
            Accuracy
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <TrendingUp size={20} color="#8b5cf6" />
          <Text variant="body" style={styles.statValue}>
            {results.performance.speed}
          </Text>
          <Text variant="caption" style={styles.statLabel}>
            Speed
          </Text>
        </View>
      </View>
    </Card>
  );

  const renderPerformanceAnalysis = () => (
    <Card style={styles.analysisCard}>
      <Text variant="h3" style={styles.sectionTitle}>
        Performance Analysis
      </Text>
      
      <View style={styles.performanceSection}>
        <View style={styles.strengthsSection}>
          <Text variant="body" style={styles.performanceLabel}>
            Strengths
          </Text>
          <View style={styles.tagContainer}>
            {results.performance.strengths.map((strength, index) => (
              <View key={index} style={[styles.tag, styles.strengthTag]}>
                <Text variant="caption" style={styles.strengthText}>
                  {strength}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.weaknessSection}>
          <Text variant="body" style={styles.performanceLabel}>
            Areas for Improvement
          </Text>
          <View style={styles.tagContainer}>
            {results.performance.weaknesses.map((weakness, index) => (
              <View key={index} style={[styles.tag, styles.weaknessTag]}>
                <Text variant="caption" style={styles.weaknessText}>
                  {weakness}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Card>
  );

  const renderQuestionReview = () => (
    <Card style={styles.reviewCard}>
      <Text variant="h3" style={styles.sectionTitle}>
        Question Review
      </Text>
      
      <View style={styles.reviewList}>
        {results.questions.map((question, index) => {
          const userAnswer = results.answers[question.id];
          const isCorrect = question.isCorrect;
          
          return (
            <View key={question.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <View style={styles.questionNumber}>
                  <Text variant="label" style={{ color: theme.surface }}>
                    {index + 1}
                  </Text>
                </View>
                
                <View style={styles.reviewContent}>
                  <Text variant="body" style={styles.reviewQuestion}>
                    {question.question}
                  </Text>
                  
                  <View style={styles.answerSection}>
                    <View style={[
                      styles.answerRow,
                      { backgroundColor: isCorrect ? '#f0fdf4' : '#fef2f2' }
                    ]}>
                      {isCorrect ? (
                        <CheckCircle size={16} color="#10b981" />
                      ) : (
                        <XCircle size={16} color="#ef4444" />
                      )}
                      <Text variant="caption" style={{
                        color: isCorrect ? '#10b981' : '#ef4444',
                        marginLeft: spacing[2],
                        fontWeight: '600'
                      }}>
                        Your answer: {userAnswer}
                      </Text>
                    </View>
                    
                    {!isCorrect && (
                      <View style={[styles.answerRow, { backgroundColor: '#f0fdf4' }]}>
                        <CheckCircle size={16} color="#10b981" />
                        <Text variant="caption" style={{
                          color: '#10b981',
                          marginLeft: spacing[2],
                          fontWeight: '600'
                        }}>
                          Correct answer: {question.correctAnswer}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <Text variant="caption" style={styles.explanation}>
                    {question.explanation}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate('mock-test-menu')}
          style={[styles.backButton, neumorphicShadow.sm]}
        >
          <ArrowLeft size={20} color={theme.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerText}>
          <Text variant="h3" style={{ color: theme.text.primary }}>
            Test Results
          </Text>
          <Text variant="caption" style={{ color: theme.text.secondary }}>
            React Advanced Patterns
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.shareButton, neumorphicShadow.sm]}
        >
          <Share size={20} color={theme.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderScoreOverview()}
        {renderPerformanceAnalysis()}
        {renderQuestionReview()}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          onPress={() => onNavigate('mock-test-menu')}
          variant="secondary"
          style={styles.actionButton}
        >
          <RotateCcw size={16} color={theme.text.primary} />
          <Text variant="label" style={{ 
            color: theme.text.primary,
            marginLeft: spacing[2] 
          }}>
            Retake Test
          </Text>
        </Button>
        
        <Button
          onPress={() => onNavigate('course-dashboard')}
          style={styles.actionButton}
        >
          <Text variant="label" style={{ color: theme.surface }}>
            Continue Learning
          </Text>
        </Button>
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
    marginRight: spacing[4],
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[6],
    paddingBottom: spacing[24],
  },
  scoreCard: {
    marginBottom: spacing[6],
    padding: spacing[8],
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  gradeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[6],
  },
  scoreDetails: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: spacing[4],
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  statValue: {
    color: theme.text.primary,
    fontWeight: '600',
    marginTop: spacing[2],
  },
  statLabel: {
    color: theme.text.secondary,
    marginTop: spacing[1],
  },
  analysisCard: {
    marginBottom: spacing[6],
    padding: spacing[6],
  },
  sectionTitle: {
    color: theme.text.primary,
    marginBottom: spacing[6],
  },
  performanceSection: {
    gap: spacing[6],
  },
  strengthsSection: {
    marginBottom: spacing[4],
  },
  weaknessSection: {
    marginBottom: spacing[4],
  },
  performanceLabel: {
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: spacing[3],
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  tag: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 16,
  },
  strengthTag: {
    backgroundColor: '#dcfce7',
  },
  strengthText: {
    color: '#166534',
  },
  weaknessTag: {
    backgroundColor: '#fef2f2',
  },
  weaknessText: {
    color: '#dc2626',
  },
  reviewCard: {
    padding: spacing[6],
  },
  reviewList: {
    gap: spacing[6],
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: spacing[6],
  },
  reviewHeader: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewContent: {
    flex: 1,
  },
  reviewQuestion: {
    color: theme.text.primary,
    marginBottom: spacing[3],
    lineHeight: 20,
  },
  answerSection: {
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: 8,
  },
  explanation: {
    color: theme.text.secondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing[4],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    backgroundColor: theme.surface,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
  },
});

export default TestResultScreen;