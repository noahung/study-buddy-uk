import React, { useState, useEffect } from 'react';
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
import { NeumorphicCard, NeumorphicButton, NeumorphicProgress } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';
import { 
  analyzeLearningPatterns,
  generateLearningInsights,
  predictPerformance,
  generatePersonalizedRecommendations,
  LearningPattern,
  LearningInsight,
  PerformancePrediction
} from '../../services/aiAnalyticsService';

interface AILearningAnalyticsScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  onGoBack?: () => void;
}

const AILearningAnalyticsScreen: React.FC<AILearningAnalyticsScreenProps> = ({ 
  onNavigate, 
  onGoBack 
}) => {
  const { theme } = useTheme();
  const [patterns, setPatterns] = useState<LearningPattern[]>([]);
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [predictions, setPredictions] = useState<PerformancePrediction[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'patterns' | 'insights' | 'predictions' | 'recommendations'>('patterns');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      await loadLearningPatterns();
      await loadLearningInsights();
      await loadPerformancePredictions();
      await loadRecommendations();
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLearningPatterns = async () => {
    try {
      // Mock data for now
      const mockPatterns: LearningPattern[] = [
        {
          id: 'pattern1',
          type: 'time',
          title: 'Morning Study Effectiveness',
          description: 'You perform 25% better when studying in the morning (8-10 AM) compared to evening sessions.',
          confidence: 0.85,
          impact: 'positive',
          recommendations: [
            'Schedule important study sessions in the morning',
            'Use evening time for lighter review activities',
            'Set morning study reminders'
          ],
          data: { timeSlots: ['8-10 AM', '2-4 PM', '7-9 PM'], effectiveness: [85, 60, 45] }
        },
        {
          id: 'pattern2',
          type: 'difficulty',
          title: 'Progressive Learning Success',
          description: 'You learn best when starting with easy concepts and gradually increasing difficulty.',
          confidence: 0.78,
          impact: 'positive',
          recommendations: [
            'Always start with basic concepts',
            'Use spaced repetition for difficult topics',
            'Take breaks between difficulty levels'
          ],
          data: { progression: 'easy-medium-hard', successRate: 0.78 }
        },
        {
          id: 'pattern3',
          type: 'method',
          title: 'Visual Learning Preference',
          description: 'You retain information 40% better with visual aids like diagrams and charts.',
          confidence: 0.92,
          impact: 'positive',
          recommendations: [
            'Use more visual flashcards',
            'Create mind maps for complex topics',
            'Watch video explanations'
          ],
          data: { visualRetention: 0.85, textRetention: 0.45 }
        }
      ];
      setPatterns(mockPatterns);
    } catch (error) {
      console.error('Failed to load learning patterns:', error);
    }
  };

  const loadLearningInsights = async () => {
    try {
      // Mock data for now
      const mockInsights: LearningInsight[] = [
        {
          id: 'insight1',
          type: 'strength',
          title: 'Consistent Study Habits',
          description: 'You maintain excellent study consistency with 85% of planned sessions completed.',
          confidence: 0.88,
          priority: 'high',
          actionable: true,
          suggestedActions: [
            'Continue your current study schedule',
            'Consider adding 15 minutes to each session',
            'Share your study techniques with others'
          ],
          relatedData: { consistency: 0.85, sessionsCompleted: 34, totalSessions: 40 },
          createdAt: '2024-01-20T10:30:00Z'
        },
        {
          id: 'insight2',
          type: 'weakness',
          title: 'Math Problem Solving',
          description: 'You struggle with quantitative analysis, scoring 20% below average on math-heavy topics.',
          confidence: 0.75,
          priority: 'high',
          actionable: true,
          suggestedActions: [
            'Practice calculation problems daily',
            'Use step-by-step problem solving approach',
            'Review basic math concepts',
            'Seek additional help for complex calculations'
          ],
          relatedData: { mathScore: 0.45, averageScore: 0.65, weakTopics: ['calculations', 'formulas'] },
          createdAt: '2024-01-20T10:30:00Z'
        },
        {
          id: 'insight3',
          type: 'opportunity',
          title: 'Peer Learning Potential',
          description: 'You could benefit from study groups or peer discussions to improve understanding.',
          confidence: 0.65,
          priority: 'medium',
          actionable: true,
          suggestedActions: [
            'Join a study group',
            'Participate in online discussions',
            'Teach concepts to others',
            'Use the AI chat for interactive learning'
          ],
          relatedData: { socialLearning: 0.3, individualLearning: 0.7 },
          createdAt: '2024-01-20T10:30:00Z'
        }
      ];
      setInsights(mockInsights);
    } catch (error) {
      console.error('Failed to load learning insights:', error);
    }
  };

  const loadPerformancePredictions = async () => {
    try {
      // Mock data for now
      const mockPredictions: PerformancePrediction[] = [
        {
          id: 'prediction1',
          metric: 'test_score',
          currentValue: 75,
          predictedValue: 82,
          confidence: 0.78,
          timeframe: '1 week',
          factors: ['Consistent study habits', 'Morning study sessions', 'Visual learning methods'],
          recommendations: [
            'Continue current study schedule',
            'Focus on weak areas identified',
            'Take practice tests regularly'
          ]
        },
        {
          id: 'prediction2',
          metric: 'completion_time',
          currentValue: 45,
          predictedValue: 38,
          confidence: 0.65,
          timeframe: '2 weeks',
          factors: ['Improved familiarity with topics', 'Better study techniques', 'Reduced confusion'],
          recommendations: [
            'Practice time management',
            'Use study timers',
            'Break down complex topics'
          ]
        }
      ];
      setPredictions(mockPredictions);
    } catch (error) {
      console.error('Failed to load performance predictions:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      // Mock data for now
      const mockRecommendations = [
        'Study for 45 minutes in the morning when you\'re most focused',
        'Use visual aids like diagrams and charts for better retention',
        'Practice math problems for 20 minutes daily to improve quantitative skills',
        'Join a study group to enhance understanding through discussion',
        'Take a 5-minute break every 25 minutes to maintain concentration',
        'Review flashcards for 15 minutes before bed for better retention',
        'Focus on investment strategies this week - it\'s your weakest area'
      ];
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'time': return 'time';
      case 'difficulty': return 'trending-up';
      case 'topic': return 'book';
      case 'method': return 'bulb';
      case 'performance': return 'analytics';
      default: return 'information-circle';
    }
  };

  const getPatternColor = (impact: string) => {
    switch (impact) {
      case 'positive': return theme.colors.success;
      case 'negative': return theme.colors.error;
      case 'neutral': return theme.colors.info;
      default: return theme.colors.textSecondary;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return 'trending-up';
      case 'weakness': return 'trending-down';
      case 'opportunity': return 'bulb';
      case 'trend': return 'analytics';
      case 'anomaly': return 'warning';
      default: return 'information-circle';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'strength': return theme.colors.success;
      case 'weakness': return theme.colors.error;
      case 'opportunity': return theme.colors.info;
      case 'trend': return theme.colors.warning;
      case 'anomaly': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const getPredictionIcon = (metric: string) => {
    switch (metric) {
      case 'test_score': return 'school';
      case 'completion_time': return 'time';
      case 'retention_rate': return 'brain';
      case 'engagement': return 'heart';
      default: return 'analytics';
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading AI Analytics...
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
        <Text style={[styles.title, { color: theme.colors.text }]}>AI Learning Analytics</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Personalized insights powered by AI
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {(['patterns', 'insights', 'predictions', 'recommendations'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              { 
                backgroundColor: selectedTab === tab 
                  ? theme.colors.primary 
                  : theme.colors.surface 
              }
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[
              styles.tabText,
              { 
                color: selectedTab === tab 
                  ? 'white' 
                  : theme.colors.text 
              }
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content based on selected tab */}
      {selectedTab === 'patterns' && (
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Learning Patterns
          </Text>
          {patterns.length === 0 ? (
            <NeumorphicCard style={styles.emptyCard}>
              <Ionicons name="analytics" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No Patterns Yet
              </Text>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                Keep studying to discover your learning patterns
              </Text>
            </NeumorphicCard>
          ) : (
            <View style={styles.patternsList}>
              {patterns.map((pattern) => (
                <NeumorphicCard key={pattern.id} style={styles.patternCard}>
                  <View style={styles.patternHeader}>
                    <Ionicons 
                      name={getPatternIcon(pattern.type) as any} 
                      size={24} 
                      color={getPatternColor(pattern.impact)} 
                    />
                    <View style={styles.patternTitleContainer}>
                      <Text style={[styles.patternTitle, { color: theme.colors.text }]}>
                        {pattern.title}
                      </Text>
                      <Text style={[styles.patternConfidence, { color: theme.colors.textSecondary }]}>
                        {Math.round(pattern.confidence * 100)}% confidence
                      </Text>
                    </View>
                    <View style={[
                      styles.impactBadge,
                      { backgroundColor: getPatternColor(pattern.impact) + '20' }
                    ]}>
                      <Text style={[
                        styles.impactText,
                        { color: getPatternColor(pattern.impact) }
                      ]}>
                        {pattern.impact.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={[styles.patternDescription, { color: theme.colors.textSecondary }]}>
                    {pattern.description}
                  </Text>
                  
                  <View style={styles.recommendationsContainer}>
                    <Text style={[styles.recommendationsTitle, { color: theme.colors.text }]}>
                      Recommendations:
                    </Text>
                    {pattern.recommendations.map((rec, index) => (
                      <Text key={index} style={[styles.recommendationItem, { color: theme.colors.textSecondary }]}>
                        • {rec}
                      </Text>
                    ))}
                  </View>
                </NeumorphicCard>
              ))}
            </View>
          )}
        </View>
      )}

      {selectedTab === 'insights' && (
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Learning Insights
          </Text>
          {insights.length === 0 ? (
            <NeumorphicCard style={styles.emptyCard}>
              <Ionicons name="bulb" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No Insights Yet
              </Text>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                Keep studying to generate personalized insights
              </Text>
            </NeumorphicCard>
          ) : (
            <View style={styles.insightsList}>
              {insights.map((insight) => (
                <NeumorphicCard key={insight.id} style={styles.insightCard}>
                  <View style={styles.insightHeader}>
                    <Ionicons 
                      name={getInsightIcon(insight.type) as any} 
                      size={24} 
                      color={getInsightColor(insight.type)} 
                    />
                    <View style={styles.insightTitleContainer}>
                      <Text style={[styles.insightTitle, { color: theme.colors.text }]}>
                        {insight.title}
                      </Text>
                      <Text style={[styles.insightConfidence, { color: theme.colors.textSecondary }]}>
                        {Math.round(insight.confidence * 100)}% confidence
                      </Text>
                    </View>
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
                </NeumorphicCard>
              ))}
            </View>
          )}
        </View>
      )}

      {selectedTab === 'predictions' && (
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Performance Predictions
          </Text>
          {predictions.length === 0 ? (
            <NeumorphicCard style={styles.emptyCard}>
              <Ionicons name="trending-up" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No Predictions Yet
              </Text>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                Keep studying to generate performance predictions
              </Text>
            </NeumorphicCard>
          ) : (
            <View style={styles.predictionsList}>
              {predictions.map((prediction) => (
                <NeumorphicCard key={prediction.id} style={styles.predictionCard}>
                  <View style={styles.predictionHeader}>
                    <Ionicons 
                      name={getPredictionIcon(prediction.metric) as any} 
                      size={24} 
                      color={theme.colors.primary} 
                    />
                    <Text style={[styles.predictionTitle, { color: theme.colors.text }]}>
                      {prediction.metric.replace('_', ' ').toUpperCase()}
                    </Text>
                    <Text style={[styles.predictionTimeframe, { color: theme.colors.textSecondary }]}>
                      {prediction.timeframe}
                    </Text>
                  </View>
                  
                  <View style={styles.predictionValues}>
                    <View style={styles.valueContainer}>
                      <Text style={[styles.valueLabel, { color: theme.colors.textSecondary }]}>
                        Current
                      </Text>
                      <Text style={[styles.valueNumber, { color: theme.colors.text }]}>
                        {prediction.currentValue}
                      </Text>
                    </View>
                    <View style={styles.arrowContainer}>
                      <Ionicons name="arrow-forward" size={20} color={theme.colors.textSecondary} />
                    </View>
                    <View style={styles.valueContainer}>
                      <Text style={[styles.valueLabel, { color: theme.colors.textSecondary }]}>
                        Predicted
                      </Text>
                      <Text style={[styles.valueNumber, { color: theme.colors.success }]}>
                        {prediction.predictedValue}
                      </Text>
                    </View>
                    <View style={styles.confidenceContainer}>
                      <Text style={[styles.confidenceLabel, { color: theme.colors.textSecondary }]}>
                        Confidence
                      </Text>
                      <Text style={[styles.confidenceValue, { color: theme.colors.info }]}>
                        {Math.round(prediction.confidence * 100)}%
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.factorsContainer}>
                    <Text style={[styles.factorsTitle, { color: theme.colors.text }]}>
                      Key Factors:
                    </Text>
                    {prediction.factors.map((factor, index) => (
                      <Text key={index} style={[styles.factorItem, { color: theme.colors.textSecondary }]}>
                        • {factor}
                      </Text>
                    ))}
                  </View>
                </NeumorphicCard>
              ))}
            </View>
          )}
        </View>
      )}

      {selectedTab === 'recommendations' && (
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Personalized Recommendations
          </Text>
          {recommendations.length === 0 ? (
            <NeumorphicCard style={styles.emptyCard}>
              <Ionicons name="bulb" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No Recommendations Yet
              </Text>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                Keep studying to get personalized recommendations
              </Text>
            </NeumorphicCard>
          ) : (
            <View style={styles.recommendationsList}>
              {recommendations.map((recommendation, index) => (
                <NeumorphicCard key={index} style={styles.recommendationCard}>
                  <View style={styles.recommendationItem}>
                    <Ionicons name="bulb" size={20} color={theme.colors.warning} />
                    <Text style={[styles.recommendationText, { color: theme.colors.text }]}>
                      {recommendation}
                    </Text>
                  </View>
                </NeumorphicCard>
              ))}
            </View>
          )}
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
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
  patternsList: {
    gap: 16,
  },
  patternCard: {
    padding: 16,
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  patternTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  patternTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  patternConfidence: {
    fontSize: 12,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  impactText: {
    fontSize: 10,
    fontWeight: '600',
  },
  patternDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  recommendationsContainer: {
    marginTop: 8,
  },
  recommendationsTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendationItem: {
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 8,
  },
  insightsList: {
    gap: 16,
  },
  insightCard: {
    padding: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  insightConfidence: {
    fontSize: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
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
  predictionsList: {
    gap: 16,
  },
  predictionCard: {
    padding: 16,
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  predictionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
  },
  predictionTimeframe: {
    fontSize: 12,
  },
  predictionValues: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  valueContainer: {
    flex: 1,
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  valueNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  arrowContainer: {
    marginHorizontal: 16,
  },
  confidenceContainer: {
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  factorsContainer: {
    marginTop: 8,
  },
  factorsTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  factorItem: {
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 8,
  },
  recommendationsList: {
    gap: 12,
  },
  recommendationCard: {
    padding: 16,
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
});

export default AILearningAnalyticsScreen;
