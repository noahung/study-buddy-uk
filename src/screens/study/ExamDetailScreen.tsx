import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { NeumorphicCard, NeumorphicButton, NeumorphicProgress } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';

interface ExamDetailScreenProps {
  examId: string;
  onNavigate?: (screen: string, params?: any) => void;
  onGoBack?: () => void;
}

const ExamDetailScreen: React.FC<ExamDetailScreenProps> = ({ 
  examId, 
  onNavigate, 
  onGoBack 
}) => {
  const { theme } = useTheme();
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    loadExamDetails();
  }, [examId]);

  const loadExamDetails = async () => {
    try {
      setLoading(true);
      // TODO: Load exam details from API
      // Mock data for now
      const mockExam = {
        id: examId,
        title: 'Financial Planning Fundamentals',
        description: 'Comprehensive exam covering all aspects of financial planning including investment strategies, risk management, and regulatory compliance.',
        duration: 120, // minutes
        questions: 50,
        passScore: 70,
        difficulty: 'Intermediate',
        category: 'Finance & Banking',
        topics: [
          'Investment Planning',
          'Risk Management',
          'Tax Planning',
          'Estate Planning',
          'Retirement Planning'
        ],
        instructions: [
          'Read each question carefully before selecting your answer',
          'You have 120 minutes to complete the exam',
          'You can review and change answers before submitting',
          'A score of 70% or higher is required to pass',
          'The exam will auto-submit when time expires'
        ]
      };
      
      const mockAttempts = [
        {
          id: '1',
          score: 85,
          passed: true,
          completedAt: '2024-01-15T10:30:00Z',
          duration: 95
        },
        {
          id: '2',
          score: 65,
          passed: false,
          completedAt: '2024-01-10T14:20:00Z',
          duration: 120
        }
      ];

      setExam(mockExam);
      setAttempts(mockAttempts);
    } catch (error) {
      Alert.alert('Error', 'Failed to load exam details');
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = () => {
    onNavigate?.('exam', { examId });
  };

  const handleViewResults = (attemptId: string) => {
    onNavigate?.('test-results', { attemptId });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading exam details...
        </Text>
      </View>
    );
  }

  if (!exam) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
        <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
          Exam Not Found
        </Text>
        <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
          The requested exam could not be found.
        </Text>
        <NeumorphicButton onPress={onGoBack} style={styles.backButton}>
          Go Back
        </NeumorphicButton>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <NeumorphicCard style={styles.headerCard}>
        <Text style={[styles.examTitle, { color: theme.colors.text }]}>
          {exam.title}
        </Text>
        <Text style={[styles.examDescription, { color: theme.colors.textSecondary }]}>
          {exam.description}
        </Text>
        
        <View style={styles.examMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
              {exam.duration} minutes
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="help-circle" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
              {exam.questions} questions
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="trophy" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
              {exam.passScore}% to pass
            </Text>
          </View>
        </View>
      </NeumorphicCard>

      {/* Exam Stats */}
      <NeumorphicCard style={styles.statsCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Your Performance
        </Text>
        
        {attempts.length > 0 ? (
          <View style={styles.performanceStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.success }]}>
                {attempts.filter(a => a.passed).length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Passed
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.info }]}>
                {Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)}%
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Avg Score
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.warning }]}>
                {attempts.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Attempts
              </Text>
            </View>
          </View>
        ) : (
          <Text style={[styles.noAttemptsText, { color: theme.colors.textSecondary }]}>
            No attempts yet. Take your first exam!
          </Text>
        )}
      </NeumorphicCard>

      {/* Topics Covered */}
      <NeumorphicCard style={styles.topicsCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Topics Covered
        </Text>
        <View style={styles.topicsList}>
          {exam.topics.map((topic: string, index: number) => (
            <View key={index} style={[styles.topicItem, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={[styles.topicText, { color: theme.colors.text }]}>
                {topic}
              </Text>
            </View>
          ))}
        </View>
      </NeumorphicCard>

      {/* Instructions */}
      <NeumorphicCard style={styles.instructionsCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Exam Instructions
        </Text>
        <View style={styles.instructionsList}>
          {exam.instructions.map((instruction: string, index: number) => (
            <View key={index} style={styles.instructionItem}>
              <Text style={[styles.instructionNumber, { color: theme.colors.primary }]}>
                {index + 1}.
              </Text>
              <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
                {instruction}
              </Text>
            </View>
          ))}
        </View>
      </NeumorphicCard>

      {/* Previous Attempts */}
      {attempts.length > 0 && (
        <NeumorphicCard style={styles.attemptsCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Previous Attempts
          </Text>
          <View style={styles.attemptsList}>
            {attempts.map((attempt) => (
              <TouchableOpacity
                key={attempt.id}
                style={[styles.attemptItem, { backgroundColor: theme.colors.surface }]}
                onPress={() => handleViewResults(attempt.id)}
              >
                <View style={styles.attemptInfo}>
                  <Text style={[styles.attemptScore, { 
                    color: attempt.passed ? theme.colors.success : theme.colors.error 
                  }]}>
                    {attempt.score}%
                  </Text>
                  <Text style={[styles.attemptDate, { color: theme.colors.textSecondary }]}>
                    {new Date(attempt.completedAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.attemptMeta}>
                  <Text style={[styles.attemptStatus, { 
                    color: attempt.passed ? theme.colors.success : theme.colors.error 
                  }]}>
                    {attempt.passed ? 'Passed' : 'Failed'}
                  </Text>
                  <Text style={[styles.attemptDuration, { color: theme.colors.textSecondary }]}>
                    {attempt.duration} min
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </NeumorphicCard>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <NeumorphicButton
          variant="primary"
          size="lg"
          onPress={handleStartExam}
          style={styles.startButton}
        >
          <Ionicons name="play" size={20} color="white" />
          <Text style={styles.startButtonText}>
            {attempts.length > 0 ? 'Retake Exam' : 'Start Exam'}
          </Text>
        </NeumorphicButton>
        
        <NeumorphicButton
          variant="secondary"
          size="lg"
          onPress={onGoBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
          <Text style={[styles.backButtonText, { color: theme.colors.text }]}>
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
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  headerCard: {
    padding: 20,
    marginBottom: 16,
  },
  examTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  examDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  examMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
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
  performanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  noAttemptsText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  topicsCard: {
    padding: 20,
    marginBottom: 16,
  },
  topicsList: {
    gap: 8,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  topicText: {
    fontSize: 14,
    flex: 1,
  },
  instructionsCard: {
    padding: 20,
    marginBottom: 16,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: 8,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 20,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  attemptsCard: {
    padding: 20,
    marginBottom: 16,
  },
  attemptsList: {
    gap: 12,
  },
  attemptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  attemptInfo: {
    flex: 1,
  },
  attemptScore: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  attemptDate: {
    fontSize: 12,
  },
  attemptMeta: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  attemptStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  attemptDuration: {
    fontSize: 12,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExamDetailScreen;
