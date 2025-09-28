import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { NeumorphicCard } from '../ui';
import { Ionicons } from '@expo/vector-icons';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onUpgrade: () => void;
  userName?: string;
  userEmail?: string;
  subscriptionPlan?: 'free' | 'premium';
}

const menuItems = [
  { id: 'profile', label: 'Profile', icon: 'person' as const },
  { id: 'revision-hub', label: 'Revision Hub', icon: 'calendar' as const },
  { id: 'test-history', label: 'Test History', icon: 'bar-chart' as const },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' as const },
  { id: 'subscription', label: 'Upgrade to Premium', icon: 'crown' as const, isPremium: true },
  { id: 'settings', label: 'Settings', icon: 'settings' as const },
  { id: 'help', label: 'Help & Support', icon: 'help-circle' as const },
];

const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onUpgrade,
  userName = 'John Doe',
  userEmail = 'john.doe@email.com',
  subscriptionPlan = 'free',
}) => {
  const { theme } = useTheme();

  const handleItemPress = (item: typeof menuItems[0]) => {
    if (item.id === 'subscription') {
      onUpgrade();
    } else {
      onNavigate(item.id);
    }
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={[styles.drawer, { backgroundColor: theme.colors.background }]}>
          <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Menu</Text>
                <NeumorphicCard style={styles.closeButton} onPress={onClose} hoverable>
                  <Ionicons name="close" size={20} color={theme.colors.text} />
                </NeumorphicCard>
              </View>

              {/* User Profile */}
              <NeumorphicCard style={styles.profileCard}>
                <View style={styles.profileContent}>
                  <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                    <Ionicons name="person" size={20} color={theme.colors.surface} />
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={[styles.userName, { color: theme.colors.text }]}>{userName}</Text>
                    <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
                      {userEmail}
                    </Text>
                    <View style={styles.planContainer}>
                      <View
                        style={[
                          styles.planBadge,
                          {
                            backgroundColor:
                              subscriptionPlan === 'premium'
                                ? theme.colors.warning
                                : theme.colors.textSecondary,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.planText,
                            {
                              color:
                                subscriptionPlan === 'premium'
                                  ? theme.colors.text
                                  : theme.colors.surface,
                            },
                          ]}
                        >
                          {subscriptionPlan === 'premium' ? 'Premium Plan' : 'Free Plan'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </NeumorphicCard>

              {/* Menu Items */}
              <View style={styles.menuContainer}>
                {menuItems.map((item) => (
                  <NeumorphicCard
                    key={item.id}
                    style={styles.menuItem}
                    onPress={() => handleItemPress(item)}
                    hoverable
                  >
                    <View style={styles.menuItemContent}>
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={item.isPremium ? theme.colors.warning : theme.colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.menuItemText,
                          {
                            color: item.isPremium ? theme.colors.warning : theme.colors.text,
                            fontWeight: item.isPremium ? '600' : '400',
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                      {item.isPremium && (
                        <Ionicons
                          name="crown"
                          size={16}
                          color={theme.colors.warning}
                          style={styles.crownIcon}
                        />
                      )}
                    </View>
                  </NeumorphicCard>
                ))}
              </View>

              {/* Logout */}
              <View style={styles.logoutSection}>
                <NeumorphicCard style={styles.logoutButton} onPress={() => onNavigate('logout')} hoverable>
                  <View style={styles.menuItemContent}>
                    <Ionicons name="log-out" size={20} color={theme.colors.error} />
                    <Text style={[styles.logoutText, { color: theme.colors.error }]}>Logout</Text>
                  </View>
                </NeumorphicCard>
              </View>

              {/* App Info */}
              <View style={styles.appInfo}>
                <Text style={[styles.appVersion, { color: theme.colors.textSecondary }]}>
                  Study Buddy v1.0.0
                </Text>
                <Text style={[styles.appCopyright, { color: theme.colors.textSecondary }]}>
                  © 2024 Study Buddy Inc.
                </Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  drawer: {
    width: 320,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  planContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planText: {
    fontSize: 12,
    fontWeight: '500',
  },
  menuContainer: {
    gap: 8,
  },
  menuItem: {
    marginBottom: 8,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  menuItemText: {
    fontSize: 16,
    flex: 1,
  },
  crownIcon: {
    marginLeft: 'auto',
  },
  logoutSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  logoutButton: {
    marginBottom: 8,
  },
  logoutText: {
    fontSize: 16,
    flex: 1,
  },
  appInfo: {
    marginTop: 24,
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 12,
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
  },
});

export default SideDrawer;
