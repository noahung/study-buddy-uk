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
import { useCourse } from '../../contexts/CourseContext';
import { NeumorphicCard, NeumorphicButton, NeumorphicProgress } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';
import { Quiz, UserQuizAttempt } from '../../types/course';

interface TestsScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const TestsScreen: React.FC<TestsScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const { 
    courses, 
    coursesLoading, 
    loadCourses,
    quizzes,
    quizzesLoading,
    loadCourseQuizzes,
    error,
    clearError 
  } = useCourse();
  
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<UserQuizAttempt[]>([]);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadCourseQuizzes(selectedCourse);
    }
  }, [selectedCourse]);

  const handleStartQuiz = (quizId: string) => {
    onNavigate?.('exam-detail', { examId: quizId });
  };

  const getQuizStatus = (quiz: Quiz) => {
    const attempts = recentAttempts.filter(a => a.quizId === quiz.id);
    if (attempts.length === 0) return 'not-started';
    const latestAttempt = attempts[attempts.length - 1];
    return latestAttempt.passed ? 'passed' : 'failed';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return theme.colors.success;
      case 'failed': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return 'checkmark-circle';
      case 'failed': return 'close-circle';
      default: return 'play-circle';
    }
  };

  const renderQuizCard = (quiz: Quiz) => {
    const status = getQuizStatus(quiz);
    const attempts = recentAttempts.filter(a => a.quizId === quiz.id);
    const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0;

    return (
      <NeumorphicCard key={quiz.id} style={styles.quizCard} hoverable>
        <View style={styles.quizHeader}>
          <View style={styles.quizInfo}>
            <Text style={[styles.quizTitle, { color: theme.colors.text }]}>
              {quiz.title}
            </Text>
            <Text style={[styles.quizDescription, { color: theme.colors.textSecondary }]}>
              {quiz.description}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
            <Ionicons 
              name={getStatusIcon(status) as any} 
              size={16} 
              color="white" 
            />
          </View>
        </View>

        <View style={styles.quizMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
              {quiz.timeLimit} min
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="help-circle" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
              {quiz.questions.length} questions
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="trophy" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
              {quiz.passingScore}% to pass
            </Text>
          </View>
        </View>

        {attempts.length > 0 && (
          <View style={styles.quizProgress}>
            <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
              Best Score: {bestScore}%
            </Text>
            <NeumorphicProgress 
              value={bestScore} 
              variant={bestScore >= quiz.passingScore ? "success" : "warning"}
              style={styles.progress}
            />
            <Text style={[styles.attemptsText, { color: theme.colors.textSecondary }]}>
              {attempts.length} attempt{attempts.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        <View style={styles.quizActions}>
          <NeumorphicButton
            variant="primary"
            size="sm"
            onPress={() => handleStartQuiz(quiz.id)}
            style={styles.startButton}
          >
            {status === 'not-started' ? 'Start Quiz' : 'Retake Quiz'}
          </NeumorphicButton>
          <NeumorphicButton
            variant="secondary"
            size="sm"
            style={styles.infoButton}
          >
            <Ionicons name="information-circle" size={16} color={theme.colors.text} />
          </NeumorphicButton>
        </View>
      </NeumorphicCard>
    );
  };

  if (coursesLoading && courses.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading tests...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={coursesLoading || quizzesLoading}
          onRefresh={() => {
            loadCourses();
            if (selectedCourse) {
              loadCourseQuizzes(selectedCourse);
            }
          }}
          tintColor={theme.colors.primary}
        />
      }
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Mock Tests</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Practice with realistic exam simulations
      </Text>

      {error && (
        <NeumorphicCard style={styles.errorCard}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
          <NeumorphicButton 
            variant="secondary" 
            size="sm" 
            onPress={clearError}
            style={styles.errorButton}
          >
            Dismiss
          </NeumorphicButton>
        </NeumorphicCard>
      )}

      {/* Course Selection */}
      <View style={styles.courseSelection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Select Course
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.courseList}>
            <TouchableOpacity
              style={[
                styles.courseCard,
                !selectedCourse && styles.selectedCourse,
                { backgroundColor: !selectedCourse ? theme.colors.primary : theme.colors.background }
              ]}
              onPress={() => setSelectedCourse(null)}
            >
              <Text style={[
                styles.courseText,
                { color: !selectedCourse ? theme.colors.background : theme.colors.text }
              ]}>
                All Tests
              </Text>
            </TouchableOpacity>
            
            {courses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={[
                  styles.courseCard,
                  selectedCourse === course.id && styles.selectedCourse,
                  { backgroundColor: selectedCourse === course.id ? theme.colors.primary : theme.colors.background }
                ]}
                onPress={() => setSelectedCourse(course.id)}
              >
                <Text style={[
                  styles.courseText,
                  { color: selectedCourse === course.id ? theme.colors.background : theme.colors.text }
                ]}>
                  {course.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Quizzes */}
      <View style={styles.quizzesContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Available Tests ({quizzes.length})
        </Text>
        
        {quizzesLoading ? (
          <View style={styles.loadingQuizzes}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Loading quizzes...
            </Text>
          </View>
        ) : quizzes.length === 0 ? (
          <NeumorphicCard style={styles.emptyCard}>
            <Ionicons name="document-text" size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No Tests Available
            </Text>
            <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
              {selectedCourse ? 
                'No tests available for this course yet.' : 
                'Select a course to view available tests.'
              }
            </Text>
          </NeumorphicCard>
        ) : (
          <View style={styles.quizzesList}>
            {quizzes.map(renderQuizCard)}
          </View>
        )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  errorCard: {
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    marginRight: 12,
  },
  errorButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  courseSelection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  courseList: {
    flexDirection: 'row',
    gap: 12,
  },
  courseCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  selectedCourse: {
    // Additional styles for selected state
  },
  courseText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  quizzesContainer: {
    marginBottom: 24,
  },
  loadingQuizzes: {
    alignItems: 'center',
    padding: 32,
  },
  quizzesList: {
    gap: 16,
  },
  quizCard: {
    padding: 16,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  quizInfo: {
    flex: 1,
    marginRight: 12,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  quizDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  quizProgress: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  progress: {
    marginBottom: 4,
  },
  attemptsText: {
    fontSize: 10,
  },
  quizActions: {
    flexDirection: 'row',
    gap: 12,
  },
  startButton: {
    flex: 1,
  },
  infoButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default TestsScreen;