import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { NeumorphicCard } from '../ui';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  showSearch?: boolean;
  showNotifications?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onMenuClick,
  showSearch = false,
  showNotifications = true,
  showBack = false,
  onBack,
  onSearchClick,
  onNotificationClick,
}) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.leftSection}>
          <NeumorphicCard
            style={styles.iconButton}
            onPress={showBack ? onBack : onMenuClick}
            hoverable
          >
            <Ionicons
              name={showBack ? 'arrow-back' : 'menu'}
              size={20}
              color={theme.colors.text}
            />
          </NeumorphicCard>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        </View>

        <View style={styles.rightSection}>
          {showSearch && (
            <NeumorphicCard style={styles.iconButton} onPress={onSearchClick} hoverable>
              <Ionicons name="search" size={20} color={theme.colors.text} />
            </NeumorphicCard>
          )}
          {showNotifications && (
            <View style={styles.notificationContainer}>
              <NeumorphicCard style={styles.iconButton} onPress={onNotificationClick} hoverable>
                <Ionicons name="notifications" size={20} color={theme.colors.text} />
              </NeumorphicCard>
              <View style={[styles.notificationBadge, { backgroundColor: theme.colors.error }]} />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    zIndex: 50,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default Header;
