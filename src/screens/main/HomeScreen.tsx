import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useCourse } from '../../contexts/CourseContext';
import { NeumorphicCard, NeumorphicButton, NeumorphicProgress } from '../../components/ui';

interface HomeScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const { 
    dashboardData, 
    dashboardLoading, 
    loadDashboardData, 
    error, 
    clearError 
  } = useCourse();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    loadDashboardData();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (dashboardLoading && !dashboardData) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading your dashboard...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={dashboardLoading}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
        />
      }
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Welcome to Study Buddy!
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Your AI Learning Companion
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
      
      <NeumorphicCard style={styles.statsCard}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {dashboardData?.completedCourses || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Completed
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.info }]}>
              {dashboardData?.averageScore ? Math.round(dashboardData.averageScore) : 0}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Avg Score
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.warning }]}>
              {dashboardData?.totalTimeSpent ? formatTime(dashboardData.totalTimeSpent) : '0m'}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Time Spent
            </Text>
          </View>
        </View>
      </NeumorphicCard>

      {dashboardData?.recentProgress && dashboardData.recentProgress.length > 0 && (
        <NeumorphicCard style={styles.progressCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Course Progress</Text>
          {dashboardData.recentProgress.slice(0, 3).map((progress: any, index: number) => (
            <View key={index} style={styles.progressItem}>
              <Text style={[styles.courseName, { color: theme.colors.text }]}>
                Course {index + 1}
              </Text>
              <NeumorphicProgress 
                value={progress.progress} 
                variant={progress.progress === 100 ? "success" : "primary"} 
                style={styles.progress} 
              />
              <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                {progress.progress}% Complete
              </Text>
            </View>
          ))}
        </NeumorphicCard>
      )}

      {dashboardData?.recentAttempts && dashboardData.recentAttempts.length > 0 && (
        <NeumorphicCard style={styles.activityCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Recent Activity</Text>
          {dashboardData.recentAttempts.slice(0, 3).map((attempt: any, index: number) => (
            <View key={index} style={styles.activityItem}>
              <View style={[
                styles.activityDot, 
                { backgroundColor: attempt.passed ? theme.colors.success : theme.colors.error }
              ]} />
              <View style={styles.activityContent}>
                <Text style={[styles.activityText, { color: theme.colors.text }]}>
                  Quiz: {attempt.quizId}
                </Text>
                <Text style={[styles.activityTime, { color: theme.colors.textSecondary }]}>
                  {formatDate(attempt.completedAt)}
                </Text>
              </View>
              <Text style={[
                styles.activityScore, 
                { color: attempt.passed ? theme.colors.success : theme.colors.error }
              ]}>
                {attempt.score}%
              </Text>
            </View>
          ))}
        </NeumorphicCard>
      )}

          <View style={styles.buttonContainer}>
            <NeumorphicButton
              variant="primary"
              size="lg"
              style={styles.primaryButton}
              onPress={() => onNavigate?.('course-selection')}
            >
              Start Studying
            </NeumorphicButton>
          </View>

          {/* AI Features Section */}
          <NeumorphicCard style={styles.aiSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              AI-Powered Features
            </Text>
            <Text style={[styles.sectionDescription, { color: theme.colors.textSecondary }]}>
              Get personalized study recommendations and insights
            </Text>
            
            <View style={styles.aiButtonsContainer}>
              <NeumorphicButton
                variant="secondary"
                size="md"
                style={styles.aiButton}
                onPress={() => onNavigate?.('ai-study-planner')}
              >
                <Ionicons name="calendar" size={20} color={theme.colors.primary} />
                <Text style={[styles.aiButtonText, { color: theme.colors.text }]}>
                  AI Study Planner
                </Text>
              </NeumorphicButton>
              
              <NeumorphicButton
                variant="secondary"
                size="md"
                style={styles.aiButton}
                onPress={() => onNavigate?.('ai-analytics')}
              >
                <Ionicons name="analytics" size={20} color={theme.colors.primary} />
                <Text style={[styles.aiButtonText, { color: theme.colors.text }]}>
                  Learning Analytics
                </Text>
              </NeumorphicButton>
            </View>
          </NeumorphicCard>
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
  statsCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  progressCard: {
    marginBottom: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  progress: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
  },
  activityCard: {
    marginBottom: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
  activityScore: {
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    minWidth: 200,
  },
  aiSection: {
    padding: 20,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  aiButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  aiButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  aiButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;
