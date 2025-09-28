import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { NeumorphicCard, NeumorphicButton } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';

interface TestHistoryScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  onGoBack?: () => void;
}

interface TestAttempt {
  id: string;
  examId: string;
  examTitle: string;
  score: number;
  passed: boolean;
  completedAt: string;
  duration: number; // in minutes
  totalQuestions: number;
  correctAnswers: number;
  category: string;
}

const TestHistoryScreen: React.FC<TestHistoryScreenProps> = ({ 
  onNavigate, 
  onGoBack 
}) => {
  const { theme } = useTheme();
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'passed' | 'failed'>('all');

  useEffect(() => {
    loadTestHistory();
  }, []);

  const loadTestHistory = async () => {
    try {
      setLoading(true);
      // TODO: Load test history from API
      const mockAttempts: TestAttempt[] = [
        {
          id: '1',
          examId: 'exam1',
          examTitle: 'Financial Planning Fundamentals',
          score: 85,
          passed: true,
          completedAt: '2024-01-15T10:30:00Z',
          duration: 95,
          totalQuestions: 50,
          correctAnswers: 42,
          category: 'Finance & Banking'
        },
        {
          id: '2',
          examId: 'exam1',
          examTitle: 'Financial Planning Fundamentals',
          score: 65,
          passed: false,
          completedAt: '2024-01-10T14:20:00Z',
          duration: 120,
          totalQuestions: 50,
          correctAnswers: 32,
          category: 'Finance & Banking'
        },
        {
          id: '3',
          examId: 'exam2',
          examTitle: 'Investment Strategies',
          score: 92,
          passed: true,
          completedAt: '2024-01-12T09:15:00Z',
          duration: 88,
          totalQuestions: 40,
          correctAnswers: 37,
          category: 'Investment'
        },
        {
          id: '4',
          examId: 'exam3',
          examTitle: 'Risk Management',
          score: 78,
          passed: true,
          completedAt: '2024-01-08T16:45:00Z',
          duration: 105,
          totalQuestions: 45,
          correctAnswers: 35,
          category: 'Risk Management'
        }
      ];

      setAttempts(mockAttempts);
    } catch (error) {
      console.error('Failed to load test history:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTestHistory();
    setRefreshing(false);
  };

  const handleViewResults = (attempt: TestAttempt) => {
    onNavigate?.('test-results', { 
      attemptId: attempt.id,
      examId: attempt.examId,
      score: attempt.score,
      passed: attempt.passed
    });
  };

  const handleRetakeExam = (attempt: TestAttempt) => {
    onNavigate?.('exam-detail', { examId: attempt.examId });
  };

  const getFilteredAttempts = () => {
    switch (filter) {
      case 'passed':
        return attempts.filter(attempt => attempt.passed);
      case 'failed':
        return attempts.filter(attempt => !attempt.passed);
      default:
        return attempts;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return theme.colors.success;
    if (score >= 70) return theme.colors.info;
    if (score >= 50) return theme.colors.warning;
    return theme.colors.error;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getStats = () => {
    const totalAttempts = attempts.length;
    const passedAttempts = attempts.filter(a => a.passed).length;
    const averageScore = attempts.length > 0 
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
      : 0;
    const totalTime = attempts.reduce((sum, a) => sum + a.duration, 0);

    return { totalAttempts, passedAttempts, averageScore, totalTime };
  };

  const stats = getStats();
  const filteredAttempts = getFilteredAttempts();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading test history...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Test History</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {attempts.length} total attempts
        </Text>
      </View>

      {/* Stats Overview */}
      <NeumorphicCard style={styles.statsCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Your Performance
        </Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {stats.totalAttempts}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Total Tests
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {stats.passedAttempts}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Passed
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.info }]}>
              {stats.averageScore}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Avg Score
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.warning }]}>
              {formatDuration(stats.totalTime)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Study Time
            </Text>
          </View>
        </View>
      </NeumorphicCard>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {(['all', 'passed', 'failed'] as const).map((filterType) => (
          <NeumorphicButton
            key={filterType}
            variant={filter === filterType ? 'primary' : 'secondary'}
            size="sm"
            onPress={() => setFilter(filterType)}
            style={styles.filterButton}
          >
            <Text style={[
              styles.filterText,
              { color: filter === filterType ? 'white' : theme.colors.text }
            ]}>
              {filterType === 'all' ? 'All' : filterType === 'passed' ? 'Passed' : 'Failed'}
            </Text>
          </NeumorphicButton>
        ))}
      </View>

      {/* Test Attempts List */}
      {filteredAttempts.length === 0 ? (
        <NeumorphicCard style={styles.emptyCard}>
          <Ionicons name="document-text" size={48} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No {filter === 'all' ? '' : filter} tests found
          </Text>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            {filter === 'all' 
              ? 'Take your first test to see it here!'
              : `No ${filter} tests in your history.`
            }
          </Text>
        </NeumorphicCard>
      ) : (
        <View style={styles.attemptsList}>
          {filteredAttempts.map((attempt) => (
            <NeumorphicCard key={attempt.id} style={styles.attemptCard}>
              <View style={styles.attemptHeader}>
                <View style={styles.attemptInfo}>
                  <Text style={[styles.examTitle, { color: theme.colors.text }]}>
                    {attempt.examTitle}
                  </Text>
                  <Text style={[styles.categoryText, { color: theme.colors.textSecondary }]}>
                    {attempt.category}
                  </Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={[styles.scoreValue, { color: getScoreColor(attempt.score) }]}>
                    {attempt.score}%
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { 
                      backgroundColor: attempt.passed 
                        ? theme.colors.success + '20' 
                        : theme.colors.error + '20' 
                    }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { 
                        color: attempt.passed 
                          ? theme.colors.success 
                          : theme.colors.error 
                      }
                    ]}>
                      {attempt.passed ? 'PASSED' : 'FAILED'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.attemptDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="time" size={14} color={theme.colors.textSecondary} />
                  <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                    {formatDate(attempt.completedAt)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="hourglass" size={14} color={theme.colors.textSecondary} />
                  <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                    {formatDuration(attempt.duration)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="help-circle" size={14} color={theme.colors.textSecondary} />
                  <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                    {attempt.correctAnswers}/{attempt.totalQuestions} correct
                  </Text>
                </View>
              </View>

              <View style={styles.attemptActions}>
                <NeumorphicButton
                  variant="secondary"
                  size="sm"
                  onPress={() => handleViewResults(attempt)}
                  style={styles.actionButton}
                >
                  <Ionicons name="eye" size={16} color={theme.colors.text} />
                  <Text style={[styles.actionText, { color: theme.colors.text }]}>
                    View Results
                  </Text>
                </NeumorphicButton>
                
                <NeumorphicButton
                  variant="primary"
                  size="sm"
                  onPress={() => handleRetakeExam(attempt)}
                  style={styles.actionButton}
                >
                  <Ionicons name="refresh" size={16} color="white" />
                  <Text style={styles.actionText}>Retake</Text>
                </NeumorphicButton>
              </View>
            </NeumorphicCard>
          ))}
        </View>
      )}
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  statsCard: {
    padding: 20,
    marginBottom: 20,
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
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  attemptsList: {
    gap: 16,
  },
  attemptCard: {
    padding: 16,
  },
  attemptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  attemptInfo: {
    flex: 1,
    marginRight: 12,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  attemptDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
  },
  attemptActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TestHistoryScreen;
