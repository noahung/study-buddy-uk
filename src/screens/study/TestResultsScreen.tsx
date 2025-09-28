import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { NeumorphicCard, NeumorphicButton, NeumorphicProgress } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';

interface TestResultsScreenProps {
  attemptId?: string;
  examId?: string;
  score?: number;
  passed?: boolean;
  answers?: Record<string, string>;
  questions?: any[];
  timeSpent?: number;
  onNavigate?: (screen: string, params?: any) => void;
  onGoBack?: () => void;
}

const TestResultsScreen: React.FC<TestResultsScreenProps> = ({ 
  attemptId,
  examId,
  score = 0,
  passed = false,
  answers = {},
  questions = [],
  timeSpent = 0,
  onNavigate,
  onGoBack
}) => {
  const { theme } = useTheme();
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (attemptId) {
      loadAttemptDetails();
    } else {
      // Use passed props for immediate results
      setExam({
        id: examId,
        title: 'Financial Planning Fundamentals',
        duration: 120
      });
    }
  }, [attemptId, examId]);

  const loadAttemptDetails = async () => {
    try {
      setLoading(true);
      // TODO: Load attempt details from API
      // For now, use mock data
      setExam({
        id: examId,
        title: 'Financial Planning Fundamentals',
        duration: 120
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load test results');
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeExam = () => {
    onNavigate?.('exam-detail', { examId: exam?.id });
  };

  const handleViewAnswers = () => {
    onNavigate?.('test-review', { 
      examId: exam?.id, 
      answers, 
      questions,
      score,
      passed
    });
  };

  const handleBackToTests = () => {
    onNavigate?.('tests');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getScoreColor = () => {
    if (score >= 90) return theme.colors.success;
    if (score >= 70) return theme.colors.info;
    if (score >= 50) return theme.colors.warning;
    return theme.colors.error;
  };

  const getScoreMessage = () => {
    if (score >= 90) return "Excellent work! You've mastered this material.";
    if (score >= 70) return "Well done! You've passed the exam.";
    if (score >= 50) return "Good effort! Review the material and try again.";
    return "Don't give up! Study more and retake the exam.";
  };

  const getPerformanceStats = () => {
    const totalQuestions = questions.length;
    const correctAnswers = Object.keys(answers).filter(
      questionId => answers[questionId] === questions.find(q => q.id === questionId)?.correctAnswer
    ).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const unansweredQuestions = totalQuestions - Object.keys(answers).length;

    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      unansweredQuestions,
      accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    };
  };

  const stats = getPerformanceStats();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading results...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <NeumorphicCard style={styles.headerCard}>
        <View style={styles.headerContent}>
          <View style={[styles.resultIcon, { 
            backgroundColor: passed ? theme.colors.success + '20' : theme.colors.error + '20' 
          }]}>
            <Ionicons 
              name={passed ? 'checkmark-circle' : 'close-circle'} 
              size={48} 
              color={passed ? theme.colors.success : theme.colors.error} 
            />
          </View>
          
          <View style={styles.resultInfo}>
            <Text style={[styles.examTitle, { color: theme.colors.text }]}>
              {exam?.title || 'Exam Results'}
            </Text>
            <Text style={[styles.resultStatus, { 
              color: passed ? theme.colors.success : theme.colors.error 
            }]}>
              {passed ? 'PASSED' : 'FAILED'}
            </Text>
          </View>
        </View>
      </NeumorphicCard>

      {/* Score Display */}
      <NeumorphicCard style={styles.scoreCard}>
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreLabel, { color: theme.colors.textSecondary }]}>
            Your Score
          </Text>
          <Text style={[styles.scoreValue, { color: getScoreColor() }]}>
            {score}%
          </Text>
          <Text style={[styles.scoreMessage, { color: theme.colors.textSecondary }]}>
            {getScoreMessage()}
          </Text>
        </View>
        
        <View style={styles.scoreProgress}>
          <NeumorphicProgress 
            value={score} 
            variant={passed ? "success" : "error"}
            style={styles.progressBar}
          />
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            {score}% out of 100%
          </Text>
        </View>
      </NeumorphicCard>

      {/* Performance Stats */}
      <NeumorphicCard style={styles.statsCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Performance Breakdown
        </Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {stats.correctAnswers}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Correct
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.error }]}>
              {stats.incorrectAnswers}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Incorrect
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.warning }]}>
              {stats.unansweredQuestions}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Unanswered
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.info }]}>
              {stats.accuracy}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Accuracy
            </Text>
          </View>
        </View>
      </NeumorphicCard>

      {/* Time and Details */}
      <NeumorphicCard style={styles.detailsCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Exam Details
        </Text>
        
        <View style={styles.detailsList}>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
              Time Spent
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textSecondary }]}>
              {formatTime(timeSpent)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="help-circle" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
              Total Questions
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textSecondary }]}>
              {stats.totalQuestions}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="trophy" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
              Pass Score
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textSecondary }]}>
              70%
            </Text>
          </View>
        </View>
      </NeumorphicCard>

      {/* Recommendations */}
      <NeumorphicCard style={styles.recommendationsCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Recommendations
        </Text>
        
        <View style={styles.recommendationsList}>
          {!passed && (
            <View style={styles.recommendationItem}>
              <Ionicons name="book" size={16} color={theme.colors.info} />
              <Text style={[styles.recommendationText, { color: theme.colors.text }]}>
                Review the study materials and focus on weak areas
              </Text>
            </View>
          )}
          
          <View style={styles.recommendationItem}>
            <Ionicons name="refresh" size={16} color={theme.colors.warning} />
            <Text style={[styles.recommendationText, { color: theme.colors.text }]}>
              Take practice quizzes to reinforce your knowledge
            </Text>
          </View>
          
          <View style={styles.recommendationItem}>
            <Ionicons name="chatbubbles" size={16} color={theme.colors.success} />
            <Text style={[styles.recommendationText, { color: theme.colors.text }]}>
              Use AI Study Buddy for personalized help
            </Text>
          </View>
        </View>
      </NeumorphicCard>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <NeumorphicButton
          variant="primary"
          size="lg"
          onPress={handleRetakeExam}
          style={styles.primaryButton}
        >
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.primaryButtonText}>
            {passed ? 'Retake Exam' : 'Try Again'}
          </Text>
        </NeumorphicButton>
        
        <NeumorphicButton
          variant="secondary"
          size="lg"
          onPress={handleViewAnswers}
          style={styles.secondaryButton}
        >
          <Ionicons name="eye" size={20} color={theme.colors.text} />
          <Text style={[styles.secondaryButtonText, { color: theme.colors.text }]}>
            Review Answers
          </Text>
        </NeumorphicButton>
        
        <NeumorphicButton
          variant="secondary"
          size="lg"
          onPress={handleBackToTests}
          style={styles.secondaryButton}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
          <Text style={[styles.secondaryButtonText, { color: theme.colors.text }]}>
            Back to Tests
          </Text>
        </NeumorphicButton>
      </View>
    </ScrollView>
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
    padding: 20,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  resultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultInfo: {
    flex: 1,
  },
  examTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  scoreCard: {
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  scoreProgress: {
    width: '100%',
    gap: 8,
  },
  progressBar: {
    height: 12,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  statsCard: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  detailsCard: {
    padding: 20,
    marginBottom: 16,
  },
  detailsList: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  recommendationsCard: {
    padding: 20,
    marginBottom: 16,
  },
  recommendationsList: {
    gap: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TestResultsScreen;
