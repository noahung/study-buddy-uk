import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Menu,
  TrendingUp,
  Target,
  Calendar,
  Clock,
  Award,
  Flame,
  Brain,
  CheckCircle,
  RotateCcw,
  AlertCircle,
  BookOpen,
  Zap,
  Star,
} from 'lucide-react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { theme, spacing, neumorphicShadow } from '../styles';

const { width } = Dimensions.get('window');

interface Props {
  onNavigate: (screen: string) => void;
  onOpenSidebar: () => void;
}

interface StudyPlanItem {
  id: number;
  topic: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  dueDate: string;
  progress: number;
  type: 'review' | 'completed' | 'in-progress' | 'new';
}

const RevisionHubScreen: React.FC<Props> = ({ onNavigate, onOpenSidebar }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'due' | 'completed'>('all');

  const studyStats = {
    dailyStreak: 12,
    weeklyGoal: 75,
    weeklyProgress: 60,
    totalStudyTime: 45,
    topicsCompleted: 8,
    topicsRemaining: 3,
  };

  const studyPlan: StudyPlanItem[] = [
    {
      id: 1,
      topic: 'React State Management',
      priority: 'high',
      estimatedTime: 30,
      dueDate: 'Today',
      progress: 0,
      type: 'review',
    },
    {
      id: 2,
      topic: 'JavaScript Promises',
      priority: 'medium',
      estimatedTime: 20,
      dueDate: 'Tomorrow',
      progress: 100,
      type: 'completed',
    },
    {
      id: 3,
      topic: 'CSS Grid Layout',
      priority: 'high',
      estimatedTime: 25,
      dueDate: 'Today',
      progress: 45,
      type: 'in-progress',
    },
    {
      id: 4,
      topic: 'Node.js Fundamentals',
      priority: 'low',
      estimatedTime: 40,
      dueDate: 'Next Week',
      progress: 0,
      type: 'new',
    },
    {
      id: 5,
      topic: 'Database Design Principles',
      priority: 'medium',
      estimatedTime: 35,
      dueDate: 'Tomorrow',
      progress: 80,
      type: 'in-progress',
    },
  ];

  const filteredStudyPlan = studyPlan.filter(item => {
    if (selectedFilter === 'due') return item.dueDate === 'Today';
    if (selectedFilter === 'completed') return item.type === 'completed';
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'review': return AlertCircle;
      case 'completed': return CheckCircle;
      case 'in-progress': return RotateCcw;
      case 'new': return BookOpen;
      default: return AlertCircle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'review': return ['#ef4444', '#dc2626'];
      case 'completed': return ['#10b981', '#059669'];
      case 'in-progress': return ['#f59e0b', '#d97706'];
      case 'new': return ['#3b82f6', '#2563eb'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle: string;
    colors: string[];
    icon: React.ComponentType<{ size: number; color: string }>;
  }> = ({ title, value, subtitle, colors, icon: IconComponent }) => (
    <Card style={[styles.statCard, neumorphicShadow.lg]}>
      <View style={styles.statCardHeader}>
        <LinearGradient
          colors={colors}
          style={styles.statIconContainer}
        >
          <IconComponent size={20} color={theme.surface} />
        </LinearGradient>
        <View>
          <Text variant="h2" style={styles.statValue}>{value}</Text>
          <Text variant="caption" style={styles.statSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onOpenSidebar}
          style={[styles.headerButton, neumorphicShadow.sm]}
        >
          <Menu size={20} color={theme.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text variant="h1" style={styles.headerTitle}>Revision Hub</Text>
          <Text variant="body" color="secondary">AI-powered study planning</Text>
        </View>
        
        <TouchableOpacity style={[styles.headerButton, neumorphicShadow.sm]}>
          <Brain size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Study Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Daily Streak"
            value={studyStats.dailyStreak}
            subtitle="Day Streak"
            colors={['#f97316', '#ea580c']}
            icon={Flame}
          />
          
          <StatCard
            title="Weekly Goal"
            value={`${studyStats.weeklyProgress}%`}
            subtitle="Weekly Goal"
            colors={['#3b82f6', '#2563eb']}
            icon={Target}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Study Time"
            value={`${studyStats.totalStudyTime}h`}
            subtitle="Total Hours"
            colors={['#10b981', '#059669']}
            icon={Clock}
          />
          
          <StatCard
            title="Completed"
            value={studyStats.topicsCompleted}
            subtitle="Topics Done"
            colors={['#8b5cf6', '#7c3aed']}
            icon={Award}
          />
        </View>

        {/* Weekly Progress */}
        <Card style={[styles.progressCard, neumorphicShadow.lg]}>
          <View style={styles.progressHeader}>
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              style={styles.progressIcon}
            >
              <Target size={20} color={theme.surface} />
            </LinearGradient>
            <View>
              <Text variant="h3" style={styles.progressTitle}>Weekly Goal</Text>
              <Text variant="label" style={styles.progressValue}>
                {studyStats.weeklyProgress}% complete
              </Text>
            </View>
          </View>
          <Progress 
            value={studyStats.weeklyProgress} 
            style={styles.progressBar}
          />
        </Card>

        {/* Progress Overview */}
        <View style={styles.overviewGrid}>
          <Card style={[styles.overviewCard, neumorphicShadow.md]}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.overviewIcon}
            >
              <CheckCircle size={24} color={theme.surface} />
            </LinearGradient>
            <Text variant="h2" style={styles.overviewValue}>{studyStats.topicsCompleted}</Text>
            <Text variant="caption" color="secondary">Completed</Text>
          </Card>

          <Card style={[styles.overviewCard, neumorphicShadow.md]}>
            <LinearGradient
              colors={['#f97316', '#ea580c']}
              style={styles.overviewIcon}
            >
              <TrendingUp size={24} color={theme.surface} />
            </LinearGradient>
            <Text variant="h2" style={styles.overviewValue}>{studyStats.topicsRemaining}</Text>
            <Text variant="caption" color="secondary">Remaining</Text>
          </Card>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {(['all', 'due', 'completed'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[
                styles.filterButton,
                selectedFilter === filter ? styles.filterButtonActive : {},
                selectedFilter === filter ? neumorphicShadow.inset : neumorphicShadow.sm
              ]}
            >
              <Text 
                variant="label" 
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter ? { color: theme.primary } : {}
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Study Plan */}
        <View style={styles.studyPlanHeader}>
          <View style={styles.studyPlanTitleContainer}>
            <Text variant="h3" style={styles.studyPlanTitle}>AI Study Plan</Text>
            <Text variant="caption" color="secondary">
              {filteredStudyPlan.length} topics
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.regenerateButton, neumorphicShadow.sm]}
          >
            <Brain size={16} color={theme.primary} />
            <Text variant="caption" style={{ 
              color: theme.primary, 
              marginLeft: spacing[2] 
            }}>
              Regenerate
            </Text>
          </TouchableOpacity>
        </View>

        {/* Study Plan Items */}
        <View style={styles.studyPlanList}>
          {filteredStudyPlan.map((item, index) => {
            const TypeIcon = getTypeIcon(item.type);
            const typeColors = getTypeColor(item.type);
            
            return (
              <Card 
                key={item.id} 
                style={[
                  styles.studyPlanItem,
                  neumorphicShadow.md,
                  item.type === 'completed' && styles.completedItem
                ]}
              >
                <View style={styles.studyPlanItemContent}>
                  <View style={styles.studyPlanItemLeft}>
                    <LinearGradient
                      colors={typeColors}
                      style={styles.studyPlanIcon}
                    >
                      <TypeIcon size={16} color={theme.surface} />
                    </LinearGradient>
                    
                    <View style={styles.studyPlanInfo}>
                      <Text variant="label" style={styles.studyPlanTopic}>
                        {item.topic}
                      </Text>
                      <View style={styles.studyPlanMeta}>
                        <View style={[
                          styles.priorityBadge,
                          { backgroundColor: getPriorityColor(item.priority) + '20' }
                        ]}>
                          <Text style={[
                            styles.priorityText,
                            { color: getPriorityColor(item.priority) }
                          ]}>
                            {item.priority}
                          </Text>
                        </View>
                        
                        <View style={styles.metaItem}>
                          <Clock size={12} color={theme.text.secondary} />
                          <Text variant="caption" style={styles.metaText}>
                            {item.estimatedTime} min
                          </Text>
                        </View>
                        
                        <View style={styles.metaItem}>
                          <Calendar size={12} color={theme.text.secondary} />
                          <Text variant="caption" style={styles.metaText}>
                            {item.dueDate}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      item.type === 'completed' ? styles.completedButton : {},
                      item.type === 'completed' ? neumorphicShadow.inset : neumorphicShadow.sm
                    ]}
                    onPress={() => item.type !== 'completed' && onNavigate('revision-study')}
                    disabled={item.type === 'completed'}
                  >
                    <Text 
                      variant="caption" 
                      style={[
                        styles.actionButtonText,
                        item.type === 'completed' && { color: theme.text.secondary }
                      ]}
                    >
                      {item.type === 'completed' ? '✓ Done' :
                       item.type === 'in-progress' ? 'Continue' :
                       item.type === 'review' ? 'Review' : 'Start'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {item.progress > 0 && (
                  <Progress 
                    value={item.progress} 
                    style={styles.itemProgress}
                  />
                )}
              </Card>
            );
          })}
        </View>

        {/* Quick Actions */}
        <Card style={[styles.quickActionsCard, neumorphicShadow.lg]}>
          <Text variant="h3" style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.quickAction, neumorphicShadow.sm]}
              onPress={() => onNavigate('flashcards')}
            >
              <LinearGradient
                colors={['#8b5cf6', '#7c3aed']}
                style={styles.quickActionIcon}
              >
                <Zap size={20} color={theme.surface} />
              </LinearGradient>
              <Text variant="caption" style={styles.quickActionText}>
                Quick Review
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickAction, neumorphicShadow.sm]}
              onPress={() => onNavigate('mock-test-menu')}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.quickActionIcon}
              >
                <CheckCircle size={20} color={theme.surface} />
              </LinearGradient>
              <Text variant="caption" style={styles.quickActionText}>
                Practice Test
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickAction, neumorphicShadow.sm]}
              onPress={() => onNavigate('ai-chat')}
            >
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                style={styles.quickActionIcon}
              >
                <Brain size={20} color={theme.surface} />
              </LinearGradient>
              <Text variant="caption" style={styles.quickActionText}>
                Ask AI
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
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
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: theme.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[6],
    paddingTop: 0,
    paddingBottom: spacing[12],
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  statCard: {
    flex: 1,
    padding: spacing[4],
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: theme.text.primary,
    fontWeight: '700',
  },
  statSubtitle: {
    color: theme.text.secondary,
  },
  progressCard: {
    padding: spacing[5],
    marginBottom: spacing[6],
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  progressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTitle: {
    color: theme.text.primary,
  },
  progressValue: {
    color: theme.text.secondary,
  },
  progressBar: {
    height: 8,
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  overviewCard: {
    flex: 1,
    padding: spacing[4],
    alignItems: 'center',
  },
  overviewIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  overviewValue: {
    color: theme.text.primary,
    fontWeight: '700',
    marginBottom: spacing[1],
  },
  filterContainer: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: theme.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: theme.primary + '15',
  },
  filterButtonText: {
    fontWeight: '600',
  },
  studyPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  studyPlanTitleContainer: {
    flex: 1,
  },
  studyPlanTitle: {
    color: theme.text.primary,
    marginBottom: spacing[1],
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 8,
  },
  studyPlanList: {
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  studyPlanItem: {
    padding: spacing[4],
  },
  completedItem: {
    opacity: 0.7,
  },
  studyPlanItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  studyPlanItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing[3],
  },
  studyPlanIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studyPlanInfo: {
    flex: 1,
  },
  studyPlanTopic: {
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: spacing[2],
  },
  studyPlanMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  priorityBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  metaText: {
    color: theme.text.secondary,
  },
  actionButton: {
    backgroundColor: theme.surface,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 8,
  },
  completedButton: {
    backgroundColor: theme.primary + '15',
  },
  actionButtonText: {
    color: theme.text.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  itemProgress: {
    height: 4,
  },
  quickActionsCard: {
    padding: spacing[5],
  },
  quickActionsTitle: {
    color: theme.text.primary,
    marginBottom: spacing[4],
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  quickAction: {
    flex: 1,
    backgroundColor: theme.surface,
    padding: spacing[4],
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  quickActionText: {
    color: theme.text.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default RevisionHubScreen;