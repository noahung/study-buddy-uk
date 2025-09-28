import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { NeumorphicCard } from '../components/ui';
import { Ionicons } from '@expo/vector-icons';

// Import tab screens
import HomeScreen from '../screens/main/HomeScreen';
import ChatScreen from '../screens/main/ChatScreen';
import TestsScreen from '../screens/main/TestsScreen';
import FlashcardsScreen from '../screens/main/FlashcardsScreen';
import NotesScreen from '../screens/main/NotesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

const navItems = [
  { id: 'home', label: 'Home', icon: 'home' as const },
  { id: 'chat', label: 'AI Chat', icon: 'chatbubbles' as const },
  { id: 'tests', label: 'Tests', icon: 'brain' as const },
  { id: 'flashcards', label: 'Cards', icon: 'document-text' as const },
  { id: 'notes', label: 'Notes', icon: 'book' as const },
  { id: 'profile', label: 'Profile', icon: 'person' as const },
];

const MainTabs: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none', // We'll use custom bottom navigation
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Tests" component={TestsScreen} />
      <Tab.Screen name="Flashcards" component={FlashcardsScreen} />
      <Tab.Screen name="Notes" component={NotesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Custom Bottom Navigation Component
interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.bottomNav, { backgroundColor: theme.colors.background }]}>
      <View style={styles.navContainer}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.navItem}
              onPress={() => onTabChange(item.id)}
              activeOpacity={0.8}
            >
              <NeumorphicCard
                style={[
                  styles.navButton,
                  isActive && styles.activeNavButton,
                ]}
                variant={isActive ? 'inset' : 'small'}
                hoverable
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={isActive ? theme.colors.primary : theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.navLabel,
                    {
                      color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </NeumorphicCard>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    minWidth: 60,
  },
  activeNavButton: {
    // Additional styles for active state if needed
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default MainTabs;
