import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Bell,
  BellOff,
  Clock,
  Calendar,
  Trophy,
  Target,
  BookOpen,
  Users,
  MessageSquare,
  Zap,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  CheckCircle,
  XCircle,
  Info,
  Settings,
} from 'lucide-react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { theme, spacing, neumorphicShadow } from '../styles';

interface Props {
  onNavigate: (screen: string) => void;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ComponentType<{ size: number; color: string }>;
  category: 'study' | 'social' | 'system' | 'marketing';
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'study' | 'achievement' | 'reminder' | 'social' | 'system';
  read: boolean;
  icon: React.ComponentType<{ size: number; color: string }>;
}

const NotificationsScreen: React.FC<Props> = ({ onNavigate }) => {
  const [globalSettings, setGlobalSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: false,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'study-reminders',
      title: 'Study Reminders',
      description: 'Daily study goal and session reminders',
      enabled: true,
      icon: Clock,
      category: 'study',
    },
    {
      id: 'exam-alerts',
      title: 'Exam Alerts',
      description: 'Upcoming exam and deadline notifications',
      enabled: true,
      icon: Calendar,
      category: 'study',
    },
    {
      id: 'progress-updates',
      title: 'Progress Updates',
      description: 'Weekly progress reports and achievements',
      enabled: true,
      icon: Target,
      category: 'study',
    },
    {
      id: 'new-content',
      title: 'New Content',
      description: 'New courses, flashcards, and study materials',
      enabled: false,
      icon: BookOpen,
      category: 'study',
    },
    {
      id: 'achievements',
      title: 'Achievements',
      description: 'Badges, streaks, and milestone celebrations',
      enabled: true,
      icon: Trophy,
      category: 'social',
    },
    {
      id: 'study-groups',
      title: 'Study Groups',
      description: 'Group activities and collaboration updates',
      enabled: false,
      icon: Users,
      category: 'social',
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Direct messages and chat notifications',
      enabled: true,
      icon: MessageSquare,
      category: 'social',
    },
    {
      id: 'system-updates',
      title: 'System Updates',
      description: 'App updates and maintenance notifications',
      enabled: true,
      icon: Settings,
      category: 'system',
    },
    {
      id: 'tips-tricks',
      title: 'Tips & Tricks',
      description: 'Study tips and productivity suggestions',
      enabled: false,
      icon: Zap,
      category: 'marketing',
    },
  ]);

  const [recentNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Study Reminder',
      message: "It's time for your daily Biology study session!",
      time: '2 minutes ago',
      type: 'reminder',
      read: false,
      icon: Clock,
    },
    {
      id: '2',
      title: 'Achievement Unlocked!',
      message: 'You earned the "7-Day Streak" badge! Keep it up!',
      time: '1 hour ago',
      type: 'achievement',
      read: false,
      icon: Trophy,
    },
    {
      id: '3',
      title: 'Mock Test Available',
      message: 'New Chemistry mock test added to your course',
      time: '3 hours ago',
      type: 'study',
      read: true,
      icon: BookOpen,
    },
    {
      id: '4',
      title: 'Weekly Progress Report',
      message: 'You completed 5 study sessions this week - 25% above your goal!',
      time: 'Yesterday',
      type: 'study',
      read: true,
      icon: Target,
    },
    {
      id: '5',
      title: 'Exam Reminder',
      message: 'Physics exam is in 3 days. Good luck with your preparation!',
      time: '2 days ago',
      type: 'reminder',
      read: true,
      icon: Calendar,
    },
  ]);

  const updateGlobalSetting = (key: string, value: boolean) => {
    setGlobalSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateNotificationSetting = (id: string, enabled: boolean) => {
    setNotificationSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, enabled } : setting
      )
    );
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Clear Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'All notifications have been cleared.');
          }
        }
      ]
    );
  };

  const getNotificationTypeColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'achievement':
        return '#f59e0b';
      case 'reminder':
        return '#3b82f6';
      case 'study':
        return '#10b981';
      case 'social':
        return '#8b5cf6';
      case 'system':
        return '#6b7280';
      default:
        return theme.primary;
    }
  };

  const getCategorySettings = (category: NotificationSetting['category']) => {
    return notificationSettings.filter(setting => setting.category === category);
  };

  const categories = [
    { id: 'study', title: 'Study & Learning', icon: BookOpen },
    { id: 'social', title: 'Social & Community', icon: Users },
    { id: 'system', title: 'System & Updates', icon: Settings },
    { id: 'marketing', title: 'Tips & Promotions', icon: Zap },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate('settings')}
          style={[styles.headerButton, neumorphicShadow.sm]}
        >
          <ArrowLeft size={20} color={theme.text.primary} />
        </TouchableOpacity>
        
        <Text variant="h2" style={styles.headerTitle}>Notifications</Text>
        
        <TouchableOpacity
          onPress={clearAllNotifications}
          style={[styles.headerButton, neumorphicShadow.sm]}
        >
          <XCircle size={20} color={theme.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Global Settings */}
        <Card style={[styles.sectionCard, neumorphicShadow.md]}>
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              style={styles.sectionIcon}
            >
              <Bell size={16} color={theme.surface} />
            </LinearGradient>
            <Text variant="h3" style={styles.sectionTitle}>
              Global Settings
            </Text>
          </View>
          
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text variant="label" style={styles.settingLabel}>
                  Push Notifications
                </Text>
                <Text variant="caption" color="secondary">
                  Receive notifications on this device
                </Text>
              </View>
              <Switch
                value={globalSettings.pushNotifications}
                onValueChange={(value) => updateGlobalSetting('pushNotifications', value)}
                trackColor={{
                  false: '#e5e7eb',
                  true: theme.primary + '40',
                }}
                thumbColor={globalSettings.pushNotifications ? theme.primary : '#f3f4f6'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text variant="label" style={styles.settingLabel}>
                  Email Notifications
                </Text>
                <Text variant="caption" color="secondary">
                  Receive notifications via email
                </Text>
              </View>
              <Switch
                value={globalSettings.emailNotifications}
                onValueChange={(value) => updateGlobalSetting('emailNotifications', value)}
                trackColor={{
                  false: '#e5e7eb',
                  true: theme.primary + '40',
                }}
                thumbColor={globalSettings.emailNotifications ? theme.primary : '#f3f4f6'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text variant="label" style={styles.settingLabel}>
                  Sound
                </Text>
                <Text variant="caption" color="secondary">
                  Play sound for notifications
                </Text>
              </View>
              <Switch
                value={globalSettings.soundEnabled}
                onValueChange={(value) => updateGlobalSetting('soundEnabled', value)}
                trackColor={{
                  false: '#e5e7eb',
                  true: theme.primary + '40',
                }}
                thumbColor={globalSettings.soundEnabled ? theme.primary : '#f3f4f6'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text variant="label" style={styles.settingLabel}>
                  Vibration
                </Text>
                <Text variant="caption" color="secondary">
                  Vibrate for notifications
                </Text>
              </View>
              <Switch
                value={globalSettings.vibrationEnabled}
                onValueChange={(value) => updateGlobalSetting('vibrationEnabled', value)}
                trackColor={{
                  false: '#e5e7eb',
                  true: theme.primary + '40',
                }}
                thumbColor={globalSettings.vibrationEnabled ? theme.primary : '#f3f4f6'}
              />
            </View>
          </View>
        </Card>

        {/* Notification Categories */}
        {categories.map((category) => {
          const categorySettings = getCategorySettings(category.id as NotificationSetting['category']);
          
          return (
            <Card key={category.id} style={[styles.sectionCard, neumorphicShadow.md]}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={['#6b7280', '#4b5563']}
                  style={styles.sectionIcon}
                >
                  <category.icon size={16} color={theme.surface} />
                </LinearGradient>
                <Text variant="h3" style={styles.sectionTitle}>
                  {category.title}
                </Text>
              </View>
              
              <View style={styles.settingsList}>
                {categorySettings.map((setting, index) => (
                  <View key={setting.id}>
                    <View style={styles.settingItem}>
                      <View style={styles.settingInfo}>
                        <Text variant="label" style={styles.settingLabel}>
                          {setting.title}
                        </Text>
                        <Text variant="caption" color="secondary">
                          {setting.description}
                        </Text>
                      </View>
                      <Switch
                        value={setting.enabled}
                        onValueChange={(value) => updateNotificationSetting(setting.id, value)}
                        trackColor={{
                          false: '#e5e7eb',
                          true: theme.primary + '40',
                        }}
                        thumbColor={setting.enabled ? theme.primary : '#f3f4f6'}
                      />
                    </View>
                    {index < categorySettings.length - 1 && (
                      <View style={styles.settingDivider} />
                    )}
                  </View>
                ))}
              </View>
            </Card>
          );
        })}

        {/* Recent Notifications */}
        <Card style={[styles.sectionCard, neumorphicShadow.md]}>
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.sectionIcon}
            >
              <Bell size={16} color={theme.surface} />
            </LinearGradient>
            <Text variant="h3" style={styles.sectionTitle}>
              Recent Notifications
            </Text>
          </View>
          
          <View style={styles.notificationsList}>
            {recentNotifications.map((notification, index) => (
              <View key={notification.id}>
                <TouchableOpacity style={styles.notificationItem} activeOpacity={0.7}>
                  <View style={styles.notificationContent}>
                    <View
                      style={[
                        styles.notificationIcon,
                        { backgroundColor: getNotificationTypeColor(notification.type) + '20' }
                      ]}
                    >
                      <notification.icon
                        size={16}
                        color={getNotificationTypeColor(notification.type)}
                      />
                    </View>
                    
                    <View style={styles.notificationText}>
                      <Text
                        variant="label"
                        style={[
                          styles.notificationTitle,
                          !notification.read && styles.unreadTitle
                        ]}
                      >
                        {notification.title}
                      </Text>
                      <Text variant="caption" color="secondary" style={styles.notificationMessage}>
                        {notification.message}
                      </Text>
                      <Text variant="caption" color="secondary" style={styles.notificationTime}>
                        {notification.time}
                      </Text>
                    </View>
                  </View>
                  
                  {!notification.read && (
                    <View style={styles.unreadIndicator} />
                  )}
                </TouchableOpacity>
                
                {index < recentNotifications.length - 1 && (
                  <View style={styles.notificationDivider} />
                )}
              </View>
            ))}
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={[styles.actionCard, neumorphicShadow.md]}>
          <Text variant="h3" style={styles.actionTitle}>Quick Actions</Text>
          
          <View style={styles.actionButtons}>
            <Button
              variant="outline"
              size="sm"
              onPress={() => Alert.alert('Success', 'All notifications marked as read')}
              style={styles.actionButton}
            >
              <CheckCircle size={16} color={theme.primary} />
              <Text variant="caption" style={styles.actionButtonText}>
                Mark All Read
              </Text>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onPress={() => Alert.alert('Success', 'Test notification sent')}
              style={styles.actionButton}
            >
              <Bell size={16} color={theme.primary} />
              <Text variant="caption" style={styles.actionButtonText}>
                Test Notification
              </Text>
            </Button>
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
  sectionCard: {
    padding: spacing[5],
    marginBottom: spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  sectionTitle: {
    color: theme.text.primary,
    fontWeight: '600',
  },
  settingsList: {
    gap: spacing[1],
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[2],
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing[3],
  },
  settingLabel: {
    color: theme.text.primary,
    fontWeight: '500',
    marginBottom: spacing[1],
  },
  settingDivider: {
    height: 1,
    backgroundColor: theme.border,
    marginLeft: spacing[2],
  },
  notificationsList: {
    gap: spacing[1],
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[2],
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    color: theme.text.primary,
    fontWeight: '500',
    marginBottom: spacing[1],
  },
  unreadTitle: {
    fontWeight: '600',
  },
  notificationMessage: {
    lineHeight: 18,
    marginBottom: spacing[1],
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.primary,
    marginLeft: spacing[2],
  },
  notificationDivider: {
    height: 1,
    backgroundColor: theme.border,
    marginLeft: spacing[11],
  },
  actionCard: {
    padding: spacing[5],
    marginTop: spacing[2],
  },
  actionTitle: {
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: spacing[4],
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  actionButtonText: {
    color: theme.primary,
    fontWeight: '500',
  },
});

export default NotificationsScreen;