import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Menu,
  Edit3,
  Star,
  Award,
  Clock,
  BookOpen,
  TrendingUp,
  Target,
  Calendar,
  Settings,
  Share,
  Crown,
  Zap,
  Coffee,
  Brain,
} from 'lucide-react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { theme, spacing, neumorphicShadow } from '../styles';

interface Props {
  onNavigate: (screen: string) => void;
  onOpenSidebar: () => void;
}

const ProfileScreen: React.FC<Props> = ({ onNavigate, onOpenSidebar }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'activity'>('overview');

  const userProfile = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    joinedDate: 'September 2024',
    subscription: 'Premium',
    level: 12,
    xp: 8420,
    nextLevelXp: 10000,
    streak: 15,
    totalStudyTime: 156, // hours
    coursesCompleted: 8,
    averageScore: 87,
  };

  const achievements = [
    {
      id: 1,
      title: 'Study Streak Master',
      description: '15 days consecutive study',
      icon: '🔥',
      earned: true,
      date: '3 days ago',
      xp: 500,
    },
    {
      id: 2,
      title: 'Test Ace',
      description: 'Score 90%+ on 5 tests',
      icon: '🏆',
      earned: true,
      date: '1 week ago',
      xp: 750,
    },
    {
      id: 3,
      title: 'Knowledge Seeker',
      description: 'Complete 10 courses',
      icon: '📚',
      earned: false,
      progress: 8,
      total: 10,
      xp: 1000,
    },
    {
      id: 4,
      title: 'Speed Learner',
      description: 'Finish course in under 2 weeks',
      icon: '⚡',
      earned: true,
      date: '2 weeks ago',
      xp: 300,
    },
    {
      id: 5,
      title: 'AI Helper',
      description: 'Ask AI 50 questions',
      icon: '🤖',
      earned: false,
      progress: 23,
      total: 50,
      xp: 400,
    },
  ];

  const recentActivity = [
    {
      type: 'test',
      title: 'JavaScript Fundamentals Quiz',
      score: 92,
      date: '2 hours ago',
      icon: Award,
    },
    {
      type: 'study',
      title: 'React Hooks Session',
      duration: 45,
      date: '5 hours ago',
      icon: BookOpen,
    },
    {
      type: 'achievement',
      title: 'Study Streak Master',
      date: '3 days ago',
      icon: Star,
    },
    {
      type: 'course',
      title: 'Completed Advanced CSS',
      date: '1 week ago',
      icon: TrendingUp,
    },
  ];

  const stats = [
    {
      label: 'Study Time',
      value: `${userProfile.totalStudyTime}h`,
      icon: Clock,
      color: ['#3b82f6', '#2563eb'],
    },
    {
      label: 'Courses Done',
      value: userProfile.coursesCompleted,
      icon: BookOpen,
      color: ['#10b981', '#059669'],
    },
    {
      label: 'Avg Score',
      value: `${userProfile.averageScore}%`,
      icon: Target,
      color: ['#f59e0b', '#d97706'],
    },
    {
      label: 'Current Streak',
      value: `${userProfile.streak} days`,
      icon: TrendingUp,
      color: ['#ef4444', '#dc2626'],
    },
  ];

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card key={index} style={[styles.statCard, neumorphicShadow.md]}>
            <LinearGradient
              colors={stat.color}
              style={styles.statIcon}
            >
              <stat.icon size={20} color={theme.surface} />
            </LinearGradient>
            <Text variant="h3" style={styles.statValue}>{stat.value}</Text>
            <Text variant="caption" color="secondary">{stat.label}</Text>
          </Card>
        ))}
      </View>

      {/* Level Progress */}
      <Card style={[styles.levelCard, neumorphicShadow.lg]}>
        <View style={styles.levelHeader}>
          <View style={styles.levelInfo}>
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.levelBadge}
            >
              <Crown size={20} color={theme.surface} />
            </LinearGradient>
            <View>
              <Text variant="h3" style={styles.levelTitle}>Level {userProfile.level}</Text>
              <Text variant="caption" color="secondary">
                {userProfile.xp} / {userProfile.nextLevelXp} XP
              </Text>
            </View>
          </View>
          <Text variant="label" style={styles.xpRemaining}>
            {userProfile.nextLevelXp - userProfile.xp} XP to next level
          </Text>
        </View>
        <Progress 
          value={(userProfile.xp / userProfile.nextLevelXp) * 100} 
          style={styles.levelProgress}
        />
      </Card>

      {/* Recent Activity */}
      <View style={styles.activitySection}>
        <Text variant="h3" style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {recentActivity.slice(0, 4).map((activity, index) => (
            <Card key={index} style={[styles.activityItem, neumorphicShadow.sm]}>
              <View style={styles.activityContent}>
                <LinearGradient
                  colors={getActivityColor(activity.type)}
                  style={styles.activityIcon}
                >
                  <activity.icon size={16} color={theme.surface} />
                </LinearGradient>
                <View style={styles.activityDetails}>
                  <Text variant="label" style={styles.activityTitle}>
                    {activity.title}
                  </Text>
                  <Text variant="caption" color="secondary">
                    {activity.date}
                  </Text>
                </View>
                {'score' in activity && (
                  <Text variant="label" style={styles.activityScore}>
                    {activity.score}%
                  </Text>
                )}
                {'duration' in activity && (
                  <Text variant="label" style={styles.activityDuration}>
                    {activity.duration}m
                  </Text>
                )}
              </View>
            </Card>
          ))}
        </View>
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.tabContent}>
      <View style={styles.achievementsList}>
        {achievements.map((achievement) => (
          <Card key={achievement.id} style={[
            styles.achievementCard,
            neumorphicShadow.md,
            !achievement.earned && styles.achievementLocked
          ]}>
            <View style={styles.achievementContent}>
              <View style={[
                styles.achievementIcon,
                achievement.earned && styles.achievementEarned
              ]}>
                <Text style={styles.achievementEmoji}>🏆</Text>
              </View>
              <View style={styles.achievementDetails}>
                <Text variant="label" style={[
                  styles.achievementTitle,
                  !achievement.earned && { color: theme.text.secondary }
                ]}>
                  {achievement.title}
                </Text>
                <Text variant="caption" color="secondary" style={styles.achievementDesc}>
                  {achievement.description}
                </Text>
                {achievement.earned ? (
                  <Text variant="caption" style={styles.achievementDate}>
                    Earned {achievement.date}
                  </Text>
                ) : achievement.progress !== undefined ? (
                  <View style={styles.achievementProgress}>
                    <Progress 
                      value={(achievement.progress / achievement.total) * 100}
                      style={styles.progressBar}
                    />
                    <Text variant="caption" color="secondary">
                      {achievement.progress} / {achievement.total}
                    </Text>
                  </View>
                ) : (
                  <Text variant="caption" color="secondary">Locked</Text>
                )}
              </View>
              <View style={styles.achievementXp}>
                <Zap size={12} color={theme.primary} />
                <Text variant="caption" style={styles.xpText}>
                  +{achievement.xp} XP
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );

  const getActivityColor = (type: string): [string, string] => {
    switch (type) {
      case 'test': return ['#10b981', '#059669'];
      case 'study': return ['#3b82f6', '#2563eb'];
      case 'achievement': return ['#f59e0b', '#d97706'];
      case 'course': return ['#8b5cf6', '#7c3aed'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

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
        
        <Text variant="h2" style={styles.headerTitle}>Profile</Text>
        
        <TouchableOpacity
          onPress={() => onNavigate('settings')}
          style={[styles.headerButton, neumorphicShadow.sm]}
        >
          <Settings size={20} color={theme.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Card style={[styles.profileCard, neumorphicShadow.lg]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: userProfile.avatar }}
                style={styles.avatar}
              />
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.subscriptionBadge}
              >
                <Crown size={14} color={theme.surface} />
              </LinearGradient>
            </View>
            <View style={styles.profileInfo}>
              <Text variant="h2" style={styles.userName}>{userProfile.name}</Text>
              <Text variant="body" color="secondary">{userProfile.email}</Text>
              <View style={styles.profileMeta}>
                <Calendar size={14} color={theme.text.secondary} />
                <Text variant="caption" color="secondary" style={styles.joinDate}>
                  Joined {userProfile.joinedDate}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.editButton, neumorphicShadow.sm]}>
              <Edit3 size={16} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {/* Subscription Status */}
          <LinearGradient
            colors={['#f59e0b', '#d97706']}
            style={styles.subscriptionCard}
          >
            <Crown size={20} color={theme.surface} />
            <Text variant="label" style={styles.subscriptionText}>
              {userProfile.subscription} Member
            </Text>
            <TouchableOpacity>
              <Text variant="caption" style={styles.manageText}>
                Manage
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </Card>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(['overview', 'achievements', 'activity'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabButton,
                activeTab === tab ? styles.tabButtonActive : {},
                activeTab === tab ? neumorphicShadow.inset : neumorphicShadow.sm
              ]}
            >
              <Text 
                variant="label" 
                style={[
                  styles.tabButtonText,
                  activeTab === tab ? { color: theme.primary } : {}
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'activity' && renderOverview()} {/* Reuse overview for now */}

        {/* Quick Actions */}
        <Card style={[styles.actionsCard, neumorphicShadow.lg]}>
          <Text variant="h3" style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionButton, neumorphicShadow.sm]}
              onPress={() => onNavigate('settings')}
            >
              <LinearGradient
                colors={['#6b7280', '#4b5563']}
                style={styles.actionIcon}
              >
                <Settings size={20} color={theme.surface} />
              </LinearGradient>
              <Text variant="caption" style={styles.actionText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, neumorphicShadow.sm]}
            >
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                style={styles.actionIcon}
              >
                <Share size={20} color={theme.surface} />
              </LinearGradient>
              <Text variant="caption" style={styles.actionText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, neumorphicShadow.sm]}
              onPress={() => onNavigate('ai-chat')}
            >
              <LinearGradient
                colors={['#8b5cf6', '#7c3aed']}
                style={styles.actionIcon}
              >
                <Brain size={20} color={theme.surface} />
              </LinearGradient>
              <Text variant="caption" style={styles.actionText}>AI Chat</Text>
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
    justifyContent: 'space-between',
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
  profileCard: {
    padding: spacing[6],
    marginBottom: spacing[6],
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[5],
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing[4],
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  subscriptionBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.surface,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    color: theme.text.primary,
    marginBottom: spacing[1],
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[2],
  },
  joinDate: {
    marginLeft: spacing[1],
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: 12,
    gap: spacing[3],
  },
  subscriptionText: {
    color: theme.surface,
    flex: 1,
  },
  manageText: {
    color: theme.surface,
    textDecorationLine: 'underline',
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: theme.surface,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: theme.primary + '15',
  },
  tabButtonText: {
    fontWeight: '600',
  },
  tabContent: {
    marginBottom: spacing[6],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: spacing[4],
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  statValue: {
    color: theme.text.primary,
    fontWeight: '700',
    marginBottom: spacing[1],
  },
  levelCard: {
    padding: spacing[5],
    marginBottom: spacing[6],
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelTitle: {
    color: theme.text.primary,
  },
  xpRemaining: {
    color: theme.text.secondary,
  },
  levelProgress: {
    height: 8,
  },
  activitySection: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    color: theme.text.primary,
    marginBottom: spacing[4],
  },
  activityList: {
    gap: spacing[3],
  },
  activityItem: {
    padding: spacing[4],
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    color: theme.text.primary,
    marginBottom: spacing[1],
  },
  activityScore: {
    color: '#10b981',
    fontWeight: '600',
  },
  activityDuration: {
    color: theme.text.secondary,
    fontWeight: '600',
  },
  achievementsList: {
    gap: spacing[4],
  },
  achievementCard: {
    padding: spacing[4],
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[4],
  },
  achievementEarned: {
    backgroundColor: theme.primary + '20',
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementTitle: {
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  achievementDesc: {
    marginBottom: spacing[2],
  },
  achievementDate: {
    color: theme.primary,
    fontWeight: '500',
  },
  achievementProgress: {
    gap: spacing[2],
  },
  progressBar: {
    height: 4,
  },
  achievementXp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  xpText: {
    color: theme.primary,
    fontWeight: '600',
  },
  actionsCard: {
    padding: spacing[5],
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.surface,
    padding: spacing[4],
    borderRadius: 12,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  actionText: {
    color: theme.text.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default ProfileScreen;