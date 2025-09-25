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
  Moon,
  Volume2,
  Wifi,
  Shield,
  HelpCircle,
  User,
  Palette,
  Download,
  Trash2,
  Settings as SettingsIcon,
  Smartphone,
  Globe,
  Lock,
  Eye,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { theme, spacing, neumorphicShadow } from '../styles';

interface Props {
  onNavigate: (screen: string) => void;
}

interface SettingItem {
  id: string;
  label: string;
  description?: string;
  type: 'switch' | 'navigation' | 'info';
  value?: boolean;
  onPress?: () => void;
  icon?: React.ComponentType<{ size: number; color: string }>;
}

interface SettingSection {
  title: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  items: SettingItem[];
}

const SettingsScreen: React.FC<Props> = ({ onNavigate }) => {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    studyReminders: true,
    soundEffects: true,
    autoSync: true,
    downloadOverWifi: true,
    analyticsTracking: false,
    autoDownload: true,
    offlineMode: false,
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your study progress, notes, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            // Handle data deletion
            Alert.alert('Success', 'All data has been cleared.');
          }
        }
      ]
    );
  };

  const settingsSections: SettingSection[] = [
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        {
          id: 'darkMode',
          label: 'Dark Mode',
          description: 'Switch to dark theme',
          type: 'switch',
          value: settings.darkMode,
        },
        {
          id: 'theme',
          label: 'Color Theme',
          description: 'Customize app colors',
          type: 'navigation',
          icon: Palette,
        },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          description: 'Receive app notifications',
          type: 'switch',
          value: settings.notifications,
        },
        {
          id: 'studyReminders',
          label: 'Study Reminders',
          description: 'Daily study goal reminders',
          type: 'switch',
          value: settings.studyReminders,
        },
        {
          id: 'notificationSettings',
          label: 'Notification Settings',
          description: 'Customize notification preferences',
          type: 'navigation',
          icon: Bell,
          onPress: () => onNavigate('notifications'),
        },
      ],
    },
    {
      title: 'Audio & Media',
      icon: Volume2,
      items: [
        {
          id: 'soundEffects',
          label: 'Sound Effects',
          description: 'Play sounds for interactions',
          type: 'switch',
          value: settings.soundEffects,
        },
        {
          id: 'autoDownload',
          label: 'Auto Download Media',
          description: 'Download images and videos',
          type: 'switch',
          value: settings.autoDownload,
        },
      ],
    },
    {
      title: 'Data & Storage',
      icon: Download,
      items: [
        {
          id: 'autoSync',
          label: 'Auto Sync',
          description: 'Sync data across devices',
          type: 'switch',
          value: settings.autoSync,
        },
        {
          id: 'downloadOverWifi',
          label: 'Download over Wi-Fi Only',
          description: 'Save mobile data',
          type: 'switch',
          value: settings.downloadOverWifi,
        },
        {
          id: 'offlineMode',
          label: 'Offline Mode',
          description: 'Access content without internet',
          type: 'switch',
          value: settings.offlineMode,
        },
        {
          id: 'clearCache',
          label: 'Clear Cache',
          description: 'Free up storage space',
          type: 'navigation',
          icon: Trash2,
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        {
          id: 'analyticsTracking',
          label: 'Analytics & Tracking',
          description: 'Help improve the app',
          type: 'switch',
          value: settings.analyticsTracking,
        },
        {
          id: 'privacy',
          label: 'Privacy Policy',
          description: 'View our privacy policy',
          type: 'navigation',
          icon: Eye,
        },
        {
          id: 'security',
          label: 'Security Settings',
          description: 'Manage account security',
          type: 'navigation',
          icon: Lock,
        },
      ],
    },
    {
      title: 'Account',
      icon: User,
      items: [
        {
          id: 'profile',
          label: 'Edit Profile',
          description: 'Update your information',
          type: 'navigation',
          icon: User,
          onPress: () => onNavigate('profile'),
        },
        {
          id: 'subscription',
          label: 'Subscription',
          description: 'Manage your plan',
          type: 'navigation',
          icon: Info,
          onPress: () => onNavigate('subscription'),
        },
        {
          id: 'deleteData',
          label: 'Clear All Data',
          description: 'Delete all app data',
          type: 'navigation',
          icon: Trash2,
          onPress: handleDeleteData,
        },
      ],
    },
    {
      title: 'Support',
      icon: HelpCircle,
      items: [
        {
          id: 'help',
          label: 'Help & Support',
          description: 'Get help with the app',
          type: 'navigation',
          icon: HelpCircle,
          onPress: () => onNavigate('help'),
        },
        {
          id: 'feedback',
          label: 'Send Feedback',
          description: 'Report bugs or suggestions',
          type: 'navigation',
          icon: Info,
        },
        {
          id: 'about',
          label: 'About',
          description: 'App version and info',
          type: 'navigation',
          icon: Info,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    switch (item.type) {
      case 'switch':
        return (
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text variant="label" style={styles.settingLabel}>
                {item.label}
              </Text>
              {item.description && (
                <Text variant="caption" color="secondary" style={styles.settingDescription}>
                  {item.description}
                </Text>
              )}
            </View>
            <Switch
              value={item.value}
              onValueChange={(value) => updateSetting(item.id, value)}
              trackColor={{
                false: '#e5e7eb',
                true: theme.primary + '40',
              }}
              thumbColor={item.value ? theme.primary : '#f3f4f6'}
              style={styles.switch}
            />
          </View>
        );
      
      case 'navigation':
        return (
          <TouchableOpacity
            style={styles.settingItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.settingInfo}>
              <Text variant="label" style={styles.settingLabel}>
                {item.label}
              </Text>
              {item.description && (
                <Text variant="caption" color="secondary" style={styles.settingDescription}>
                  {item.description}
                </Text>
              )}
            </View>
            <ChevronRight size={20} color={theme.text.secondary} />
          </TouchableOpacity>
        );
      
      case 'info':
        return (
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text variant="label" style={styles.settingLabel}>
                {item.label}
              </Text>
              {item.description && (
                <Text variant="caption" color="secondary" style={styles.settingDescription}>
                  {item.description}
                </Text>
              )}
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate('profile')}
          style={[styles.headerButton, neumorphicShadow.sm]}
        >
          <ArrowLeft size={20} color={theme.text.primary} />
        </TouchableOpacity>
        
        <Text variant="h2" style={styles.headerTitle}>Settings</Text>
        
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info */}
        <Card style={[styles.appInfoCard, neumorphicShadow.lg]}>
          <View style={styles.appInfoContent}>
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              style={styles.appIcon}
            >
              <SettingsIcon size={24} color={theme.surface} />
            </LinearGradient>
            <View style={styles.appDetails}>
              <Text variant="h3" style={styles.appName}>Study Buddy</Text>
              <Text variant="caption" color="secondary">Version 1.0.0</Text>
            </View>
          </View>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <Card key={section.title} style={[styles.sectionCard, neumorphicShadow.md]}>
            <View style={styles.sectionHeader}>
              <LinearGradient
                colors={['#6b7280', '#4b5563']}
                style={styles.sectionIcon}
              >
                <section.icon size={16} color={theme.surface} />
              </LinearGradient>
              <Text variant="h3" style={styles.sectionTitle}>
                {section.title}
              </Text>
            </View>
            
            <View style={styles.settingsList}>
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  {renderSettingItem(item)}
                  {itemIndex < section.items.length - 1 && (
                    <View style={styles.settingDivider} />
                  )}
                </View>
              ))}
            </View>
          </Card>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text variant="caption" color="secondary" style={styles.footerText}>
            Made with ❤️ for better learning
          </Text>
          <Text variant="caption" color="secondary" style={styles.footerText}>
            © 2024 Study Buddy. All rights reserved.
          </Text>
        </View>
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
  appInfoCard: {
    padding: spacing[6],
    marginBottom: spacing[6],
  },
  appInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[4],
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: spacing[1],
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
  settingDescription: {
    lineHeight: 18,
  },
  settingDivider: {
    height: 1,
    backgroundColor: theme.border,
    marginLeft: spacing[2],
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing[8],
    gap: spacing[2],
  },
  footerText: {
    textAlign: 'center',
  },
});

export default SettingsScreen;