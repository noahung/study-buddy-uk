import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { NeumorphicCard, NeumorphicButton, NeumorphicProgress } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';

interface ProfileScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const userStats = [
    { label: 'Study Streak', value: '7 days', icon: 'flame', color: theme.colors.warning },
    { label: 'Tests Completed', value: '24', icon: 'trophy', color: theme.colors.success },
    { label: 'Average Score', value: '85%', icon: 'book', color: theme.colors.info },
    { label: 'Hours Studied', value: '48h', icon: 'time', color: theme.colors.error }
  ];

  const achievements = [
    { id: '1', title: 'First Test Passed', description: 'Completed your first exam', icon: '🎯', unlocked: true },
    { id: '2', title: 'Study Streak', description: '7 days in a row', icon: '🔥', unlocked: true },
    { id: '3', title: 'High Scorer', description: 'Scored 90% or higher', icon: '⭐', unlocked: true },
    { id: '4', title: 'Note Taker', description: 'Created 10 notes', icon: '📝', unlocked: false },
    { id: '5', title: 'Flashcard Master', description: 'Studied 100 flashcards', icon: '🃏', unlocked: false },
    { id: '6', title: 'Course Completer', description: 'Finished a full course', icon: '🎓', unlocked: false }
  ];

  const enrolledCourses = [
    { title: 'Financial Planning Basics', progress: 75, status: 'In Progress' },
    { title: 'Investment Strategies', progress: 45, status: 'In Progress' },
    { title: 'Risk Management', progress: 100, status: 'Completed' }
  ];

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleUpgrade = () => {
    onNavigate?.('subscription');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: signOut }
      ]
    );
  };

  const renderStatCard = (stat: any) => (
    <NeumorphicCard key={stat.label} style={styles.statCard}>
      <Ionicons name={stat.icon as any} size={24} color={stat.color} />
      <Text style={[styles.statValue, { color: theme.colors.text }]}>
        {stat.value}
      </Text>
      <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
        {stat.label}
      </Text>
    </NeumorphicCard>
  );

  const renderAchievement = (achievement: any) => (
    <NeumorphicCard 
      key={achievement.id} 
      style={[
        styles.achievementCard,
        !achievement.unlocked && styles.lockedAchievement
      ]}
    >
      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
      <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>
        {achievement.title}
      </Text>
      <Text style={[styles.achievementDescription, { color: theme.colors.textSecondary }]}>
        {achievement.description}
      </Text>
      {achievement.unlocked && (
        <View style={[styles.unlockedIndicator, { backgroundColor: theme.colors.success }]} />
      )}
    </NeumorphicCard>
  );

  const renderCourse = (course: any, index: number) => (
    <View key={index} style={styles.courseItem}>
      <View style={styles.courseHeader}>
        <Text style={[styles.courseTitle, { color: theme.colors.text }]}>
          {course.title}
        </Text>
        <View style={styles.courseStatus}>
          <Text style={[styles.courseProgressText, { color: theme.colors.text }]}>
            {course.progress}%
          </Text>
          <View style={[
            styles.statusBadge,
            { 
              backgroundColor: course.status === 'Completed' 
                ? theme.colors.success + '20' 
                : theme.colors.info + '20' 
            }
          ]}>
            <Text style={[
              styles.statusText,
              { 
                color: course.status === 'Completed' 
                  ? theme.colors.success 
                  : theme.colors.info 
              }
            ]}>
              {course.status}
            </Text>
          </View>
        </View>
      </View>
      <NeumorphicProgress 
        value={course.progress} 
        variant={course.progress === 100 ? "success" : "primary"}
        style={styles.courseProgress}
      />
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => setLoading(false)}
          tintColor={theme.colors.primary}
        />
      }
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Profile</Text>

      {/* Profile Header */}
      <NeumorphicCard style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="person" size={32} color="white" />
            </View>
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: theme.colors.background }]}
              onPress={handleEditProfile}
            >
              <Ionicons name="create" size={12} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user?.name || 'John Doe'}
            </Text>
            <View style={styles.emailContainer}>
              <Ionicons name="mail" size={14} color={theme.colors.textSecondary} />
              <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
                {user?.email || 'john.doe@email.com'}
              </Text>
            </View>
            <View style={styles.planContainer}>
              <View style={[styles.planBadge, { backgroundColor: theme.colors.warning + '20' }]}>
                <Text style={[styles.planText, { color: theme.colors.warning }]}>
                  Free Plan
                </Text>
              </View>
              <NeumorphicButton 
                size="sm" 
                onPress={handleUpgrade}
                style={styles.upgradeButton}
              >
                <Ionicons name="crown" size={12} color={theme.colors.text} />
                <Text style={[styles.upgradeText, { color: theme.colors.text }]}>
                  Upgrade
                </Text>
              </NeumorphicButton>
            </View>
          </View>
        </View>
      </NeumorphicCard>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        {userStats.map(renderStatCard)}
      </View>

      {/* Learning Progress */}
      <NeumorphicCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Learning Progress
        </Text>
        <View style={styles.coursesList}>
          {enrolledCourses.map(renderCourse)}
        </View>
      </NeumorphicCard>

      {/* Achievements */}
      <NeumorphicCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Achievements
        </Text>
        <View style={styles.achievementsGrid}>
          {achievements.map(renderAchievement)}
        </View>
        
        <View style={styles.achievementStats}>
          <Text style={[styles.achievementStatsText, { color: theme.colors.textSecondary }]}>
            {achievements.filter(a => a.unlocked).length} of {achievements.length} achievements unlocked
          </Text>
        </View>
      </NeumorphicCard>

      {/* Account Settings */}
      <NeumorphicCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Account
        </Text>
        <View style={styles.settingsList}>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => onNavigate?.('settings')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="settings" size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>
                Account Settings
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="book" size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>
                Learning Preferences
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="trophy" size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>
                View All Achievements
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </NeumorphicCard>

      {/* Study Goals */}
      <NeumorphicCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Weekly Goal
        </Text>
        <View style={styles.goalContainer}>
          <View style={styles.goalHeader}>
            <Text style={[styles.goalLabel, { color: theme.colors.text }]}>Study Time</Text>
            <Text style={[styles.goalValue, { color: theme.colors.text }]}>4 / 5 hours</Text>
          </View>
          <NeumorphicProgress value={80} variant="success" style={styles.goalProgress} />
          <Text style={[styles.goalDescription, { color: theme.colors.textSecondary }]}>
            You're doing great! Just 1 hour left to reach your weekly goal.
          </Text>
        </View>
      </NeumorphicCard>

      {/* Logout Button */}
      <NeumorphicButton
        variant="error"
        size="lg"
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        <Ionicons name="log-out" size={20} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </NeumorphicButton>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  profileCard: {
    padding: 20,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  email: {
    fontSize: 14,
  },
  planContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planText: {
    fontSize: 12,
    fontWeight: '600',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  upgradeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  sectionCard: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  coursesList: {
    gap: 16,
  },
  courseItem: {
    gap: 8,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  courseStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  courseProgressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  courseProgress: {
    height: 8,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  achievementCard: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    position: 'relative',
  },
  lockedAchievement: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
  unlockedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  achievementStats: {
    alignItems: 'center',
  },
  achievementStatsText: {
    fontSize: 12,
  },
  settingsList: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    fontSize: 16,
  },
  goalContainer: {
    gap: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  goalValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  goalProgress: {
    height: 12,
  },
  goalDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;