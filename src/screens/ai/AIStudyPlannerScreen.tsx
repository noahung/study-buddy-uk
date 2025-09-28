import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useCourse } from '../../contexts/CourseContext';
import { NeumorphicCard, NeumorphicButton, NeumorphicProgress } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';
import { 
  generateStudyPlan, 
  generateLearningInsights, 
  generatePersonalizedRecommendations,
  StudyPlan,
  LearningInsight
} from '../../services/aiStudyPlannerService';

interface AIStudyPlannerScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  onGoBack?: () => void;
}

const AIStudyPlannerScreen: React.FC<AIStudyPlannerScreenProps> = ({ 
  onNavigate, 
  onGoBack 
}) => {
  const { theme } = useTheme();
  const { selectedCourse, courses } = useCourse();
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  const [showCreatePlan, setShowCreatePlan] = useState(false);

  useEffect(() => {
    loadStudyData();
  }, []);

  const loadStudyData = async () => {
    try {
      setLoading(true);
      // TODO: Load study plans and insights from API
      await loadStudyPlans();
      await loadLearningInsights();
      await loadRecommendations();
    } catch (error) {
      console.error('Failed to load study data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudyPlans = async () => {
    // Mock data for now
    const mockPlans: StudyPlan[] = [
      {
        id: 'plan1',
        userId: 'user1',
        courseId: 'course1',
        courseName: 'Financial Planning Basics',
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-02-15T00:00:00Z',
        totalSessions: 20,
        completedSessions: 12,
        progress: 60,
        difficulty: 'intermediate',
        studyStyle: 'visual',
        availableTime: 60,
        sessions: [],
        recommendations: [
          'Focus on investment strategies this week',
          'Review risk management concepts daily',
          'Take practice quizzes every 3 days'
        ],
        lastUpdated: '2024-01-20T10:30:00Z'
      }
    ];
    setStudyPlans(mockPlans);
  };

  const loadLearningInsights = async () => {
    try {
      // Mock data for now
      const mockInsights: LearningInsight[] = [
        {
          id: 'insight1',
          type: 'strength',
          title: 'Strong Visual Learning',
          description: 'You perform 40% better with visual content like diagrams and charts.',
          confidence: 0.85,
          priority: 'high',
          actionable: true,
          suggestedActions: [
            'Use more visual flashcards',
            'Create mind maps for complex topics',
            'Watch video explanations'
          ],
          relatedTopics: ['Investment Planning', 'Risk Management'],
          createdAt: '2024-01-20T10:30:00Z'
        },
        {
          id: 'insight2',
          type: 'weakness',
          title: 'Math Concepts Need Work',
          description: 'You struggle with quantitative analysis and calculations.',
          confidence: 0.75,
          priority: 'high',
          actionable: true,
          suggestedActions: [
            'Practice calculation problems daily',
            'Use step-by-step problem solving',
            'Review basic math concepts'
          ],
          relatedTopics: ['Financial Calculations', 'Portfolio Analysis'],
          createdAt: '2024-01-20T10:30:00Z'
        }
      ];
      setInsights(mockInsights);
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      // Mock data for now
      const mockRecommendations = [
        'Study for 45 minutes in the morning when you\'re most focused',
        'Review flashcards for 15 minutes before bed for better retention',
        'Take a 5-minute break every 25 minutes to maintain concentration',
        'Focus on investment strategies this week - it\'s your weakest area',
        'Use the AI tutor to explain complex concepts in simpler terms'
      ];
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStudyData();
    setRefreshing(false);
  };

  const handleCreatePlan = async () => {
    if (!selectedCourse) {
      Alert.alert('Error', 'Please select a course first');
      return;
    }

    try {
      setLoading(true);
      const newPlan = await generateStudyPlan(
        'user1', // TODO: Get from auth context
        selectedCourse.id,
        selectedCourse.name,
        60, // 60 minutes per day
        'visual', // TODO: Get from user profile
        'intermediate', // TODO: Get from user profile
        '2024-01-20T00:00:00Z',
        '2024-02-20T00:00:00Z'
      );
      
      setStudyPlans(prev => [newPlan, ...prev]);
      setSelectedPlan(newPlan);
      setShowCreatePlan(false);
      Alert.alert('Success', 'New study plan created!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create study plan');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = (sessionId: string) => {
    const session = selectedPlan?.sessions.find(s => s.id === sessionId);
    if (!session) return;

    switch (session.type) {
      case 'flashcard':
        onNavigate?.('flashcard-study', { flashcardSetId: sessionId });
        break;
      case 'note':
        onNavigate?.('note-detail', { noteId: sessionId });
        break;
      case 'quiz':
        onNavigate?.('exam-detail', { examId: sessionId });
        break;
      case 'review':
        onNavigate?.('revision-hub');
        break;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return 'trending-up';
      case 'weakness': return 'trending-down';
      case 'recommendation': return 'bulb';
      case 'pattern': return 'analytics';
      default: return 'information-circle';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'strength': return theme.colors.success;
      case 'weakness': return theme.colors.error;
      case 'recommendation': return theme.colors.info;
      case 'pattern': return theme.colors.warning;
      default: return theme.colors.textSecondary;
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading AI Study Planner...
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
        <Text style={[styles.title, { color: theme.colors.text }]}>AI Study Planner</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Personalized study recommendations powered by AI
        </Text>
      </View>

      {/* Quick Stats */}
      <NeumorphicCard style={styles.statsCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Your Learning Overview
        </Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {studyPlans.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Active Plans
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {studyPlans.reduce((sum, plan) => sum + plan.completedSessions, 0)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Sessions Done
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.info }]}>
              {insights.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              AI Insights
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.warning }]}>
              {Math.round(studyPlans.reduce((sum, plan) => sum + plan.progress, 0) / studyPlans.length) || 0}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Avg Progress
            </Text>
          </View>
        </View>
      </NeumorphicCard>

      {/* Study Plans */}
      <NeumorphicCard style={styles.plansCard}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Study Plans
          </Text>
          <NeumorphicButton
            variant="primary"
            size="sm"
            onPress={() => setShowCreatePlan(true)}
          >
            <Ionicons name="add" size={16} color="white" />
            <Text style={styles.createButtonText}>Create</Text>
          </NeumorphicButton>
        </View>

        {studyPlans.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar" size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No Study Plans
            </Text>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Create your first AI-powered study plan
            </Text>
            <NeumorphicButton
              variant="primary"
              size="md"
              onPress={() => setShowCreatePlan(true)}
              style={styles.createPlanButton}
            >
              <Ionicons name="sparkles" size={20} color="white" />
              <Text style={styles.createPlanButtonText}>Create AI Study Plan</Text>
            </NeumorphicButton>
          </View>
        ) : (
          <View style={styles.plansList}>
            {studyPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planItem,
                  { backgroundColor: selectedPlan?.id === plan.id ? theme.colors.primary + '10' : theme.colors.surface }
                ]}
                onPress={() => setSelectedPlan(plan)}
              >
                <View style={styles.planHeader}>
                  <Text style={[styles.planTitle, { color: theme.colors.text }]}>
                    {plan.courseName}
                  </Text>
                  <Text style={[styles.planProgress, { color: theme.colors.textSecondary }]}>
                    {plan.completedSessions}/{plan.totalSessions} sessions
                  </Text>
                </View>
                
                <View style={styles.progressContainer}>
                  <NeumorphicProgress 
                    value={plan.progress} 
                    variant="primary"
                    style={styles.progressBar}
                  />
                  <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                    {plan.progress}%
                  </Text>
                </View>

                <View style={styles.planMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time" size={14} color={theme.colors.textSecondary} />
                    <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                      {plan.availableTime} min/day
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="person" size={14} color={theme.colors.textSecondary} />
                    <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                      {plan.studyStyle}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </NeumorphicCard>

      {/* AI Insights */}
      <NeumorphicCard style={styles.insightsCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          AI Learning Insights
        </Text>
        
        {insights.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No insights available yet. Keep studying to generate personalized insights!
          </Text>
        ) : (
          <View style={styles.insightsList}>
            {insights.map((insight) => (
              <View key={insight.id} style={styles.insightItem}>
                <View style={styles.insightHeader}>
                  <Ionicons 
                    name={getInsightIcon(insight.type) as any} 
                    size={20} 
                    color={getInsightColor(insight.type)} 
                  />
                  <Text style={[styles.insightTitle, { color: theme.colors.text }]}>
                    {insight.title}
                  </Text>
                  <View style={[
                    styles.priorityBadge,
                    { 
                      backgroundColor: insight.priority === 'high' 
                        ? theme.colors.error + '20' 
                        : insight.priority === 'medium'
                        ? theme.colors.warning + '20'
                        : theme.colors.success + '20'
                    }
                  ]}>
                    <Text style={[
                      styles.priorityText,
                      { 
                        color: insight.priority === 'high' 
                          ? theme.colors.error 
                          : insight.priority === 'medium'
                          ? theme.colors.warning
                          : theme.colors.success
                      }
                    ]}>
                      {insight.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                <Text style={[styles.insightDescription, { color: theme.colors.textSecondary }]}>
                  {insight.description}
                </Text>
                
                {insight.suggestedActions.length > 0 && (
                  <View style={styles.actionsContainer}>
                    <Text style={[styles.actionsTitle, { color: theme.colors.text }]}>
                      Suggested Actions:
                    </Text>
                    {insight.suggestedActions.map((action, index) => (
                      <Text key={index} style={[styles.actionItem, { color: theme.colors.textSecondary }]}>
                        • {action}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </NeumorphicCard>

      {/* Personalized Recommendations */}
      <NeumorphicCard style={styles.recommendationsCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Personalized Recommendations
        </Text>
        
        <View style={styles.recommendationsList}>
          {recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Ionicons name="bulb" size={16} color={theme.colors.warning} />
              <Text style={[styles.recommendationText, { color: theme.colors.text }]}>
                {recommendation}
              </Text>
            </View>
          ))}
        </View>
      </NeumorphicCard>

      {/* Create Plan Modal */}
      {showCreatePlan && (
        <View style={styles.modalOverlay}>
          <NeumorphicCard style={styles.modalCard}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Create AI Study Plan
            </Text>
            <Text style={[styles.modalDescription, { color: theme.colors.textSecondary }]}>
              AI will analyze your learning style and create a personalized study plan.
            </Text>
            
            <View style={styles.modalActions}>
              <NeumorphicButton
                variant="secondary"
                size="md"
                onPress={() => setShowCreatePlan(false)}
                style={styles.modalButton}
              >
                Cancel
              </NeumorphicButton>
              <NeumorphicButton
                variant="primary"
                size="md"
                onPress={handleCreatePlan}
                style={styles.modalButton}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={16} color="white" />
                    <Text style={styles.createButtonText}>Create Plan</Text>
                  </>
                )}
              </NeumorphicButton>
            </View>
          </NeumorphicCard>
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
  plansCard: {
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
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
    marginBottom: 24,
  },
  createPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  createPlanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  plansList: {
    gap: 12,
  },
  planItem: {
    padding: 16,
    borderRadius: 8,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  planProgress: {
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  planMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  insightsCard: {
    padding: 20,
    marginBottom: 20,
  },
  insightsList: {
    gap: 16,
  },
  insightItem: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  insightDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  actionsContainer: {
    marginTop: 8,
  },
  actionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionItem: {
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 8,
  },
  recommendationsCard: {
    padding: 20,
    marginBottom: 20,
  },
  recommendationsList: {
    gap: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalCard: {
    width: '90%',
    maxWidth: 400,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});

export default AIStudyPlannerScreen;
