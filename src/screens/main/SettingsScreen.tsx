import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { NeumorphicCard, NeumorphicButton } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  
  const [notifications, setNotifications] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const settingSections = [
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          description: 'Receive study reminders and updates',
          icon: 'notifications',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications
        },
        {
          id: 'darkMode',
          label: 'Dark Mode',
          description: 'Switch to dark theme',
          icon: theme.isDark ? 'moon' : 'sunny',
          type: 'toggle',
          value: theme.isDark,
          onChange: toggleTheme
        },
        {
          id: 'studyReminders',
          label: 'Study Reminders',
          description: 'Daily study goal notifications',
          icon: 'alarm',
          type: 'toggle',
          value: studyReminders,
          onChange: setStudyReminders
        },
        {
          id: 'autoSync',
          label: 'Auto Sync',
          description: 'Automatically sync your progress',
          icon: 'cloud-upload',
          type: 'toggle',
          value: autoSync,
          onChange: setAutoSync
        }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          id: 'privacy',
          label: 'Privacy Settings',
          description: 'Manage your data and privacy',
          icon: 'shield-checkmark',
          type: 'button'
        },
        {
          id: 'dataExport',
          label: 'Export Data',
          description: 'Download your study data',
          icon: 'download',
          type: 'button'
        },
        {
          id: 'deleteAccount',
          label: 'Delete Account',
          description: 'Permanently delete your account',
          icon: 'trash',
          type: 'button',
          destructive: true
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          label: 'Help & Support',
          description: 'Get help and contact support',
          icon: 'help-circle',
          type: 'button'
        },
        {
          id: 'logout',
          label: 'Logout',
          description: 'Sign out of your account',
          icon: 'log-out',
          type: 'button',
          destructive: true,
          action: () => {
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: signOut }
              ]
            );
          }
        }
      ]
    }
  ];

  const handleSettingPress = (item: any) => {
    switch (item.id) {
      case 'privacy':
        Alert.alert('Privacy Settings', 'Privacy settings feature coming soon!');
        break;
      case 'dataExport':
        Alert.alert('Export Data', 'Data export feature coming soon!');
        break;
      case 'deleteAccount':
        Alert.alert(
          'Delete Account',
          'This action cannot be undone. Are you sure you want to delete your account?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
              Alert.alert('Delete Account', 'Account deletion feature coming soon!');
            }}
          ]
        );
        break;
      case 'help':
        Alert.alert('Help & Support', 'Help and support feature coming soon!');
        break;
      default:
        if (item.action) {
          item.action();
        }
        break;
    }
  };

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={() => item.type === 'button' ? handleSettingPress(item) : null}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.muted }]}>
          <Ionicons 
            name={item.icon as any} 
            size={20} 
            color={item.destructive ? theme.colors.error : theme.colors.textSecondary} 
          />
        </View>
        <View style={styles.settingInfo}>
          <Text style={[
            styles.settingLabel, 
            { color: item.destructive ? theme.colors.error : theme.colors.text }
          ]}>
            {item.label}
          </Text>
          <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>
      </View>

      {item.type === 'toggle' ? (
        <Switch 
          value={item.value}
          onValueChange={item.onChange}
          trackColor={{ false: theme.colors.muted, true: theme.colors.primary + '40' }}
          thumbColor={item.value ? theme.colors.primary : theme.colors.textSecondary}
        />
      ) : (
        <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const renderSection = (section: any) => (
    <NeumorphicCard key={section.title} style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {section.title}
      </Text>
      <View style={styles.settingsList}>
        {section.items.map(renderSettingItem)}
      </View>
    </NeumorphicCard>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>

      {settingSections.map(renderSection)}

      {/* Storage Usage */}
      <NeumorphicCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Storage</Text>
        <View style={styles.storageContainer}>
          <View style={styles.storageHeader}>
            <Text style={[styles.storageLabel, { color: theme.colors.text }]}>Used Storage</Text>
            <Text style={[styles.storageValue, { color: theme.colors.textSecondary }]}>
              248 MB of 1 GB
            </Text>
          </View>
          <View style={[styles.storageBar, { backgroundColor: theme.colors.muted }]}>
            <View style={[styles.storageProgress, { 
              backgroundColor: theme.colors.info,
              width: '25%'
            }]} />
          </View>
          <Text style={[styles.storageBreakdown, { color: theme.colors.textSecondary }]}>
            Notes: 45 MB • Flashcards: 123 MB • Test Data: 80 MB
          </Text>
        </View>
      </NeumorphicCard>

      {/* App Info */}
      <NeumorphicCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About</Text>
        <View style={styles.infoList}>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.colors.text }]}>Version</Text>
            <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>1.0.0</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.colors.text }]}>Last Updated</Text>
            <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
              January 15, 2024
            </Text>
          </View>
          <TouchableOpacity style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.colors.text }]}>Terms of Service</Text>
            <Text style={[styles.infoLink, { color: theme.colors.primary }]}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.colors.text }]}>Privacy Policy</Text>
            <Text style={[styles.infoLink, { color: theme.colors.primary }]}>View</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  storageContainer: {
    gap: 12,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storageLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  storageValue: {
    fontSize: 14,
  },
  storageBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  storageProgress: {
    height: '100%',
    borderRadius: 4,
  },
  storageBreakdown: {
    fontSize: 12,
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 14,
  },
  infoLink: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default SettingsScreen;
