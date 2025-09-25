import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../ui/Text';
import { colors, theme, spacing, borderRadius } from '../../styles';
import {
  Book,
  MessageCircle,
  CreditCard,
  FileText,
  TrendingUp,
} from 'lucide-react-native';

interface TabItem {
  id: string;
  label: string;
  icon: typeof Book;
}

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
  style?: any;
}

const tabs: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Book },
  { id: 'ai-chat', label: 'AI Chat', icon: MessageCircle },
  { id: 'flashcards', label: 'Flashcards', icon: CreditCard },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'revision', label: 'Revision', icon: TrendingUp },
];

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabPress,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const animatedValues = React.useRef(
    tabs.reduce((acc, tab) => {
      acc[tab.id] = new Animated.Value(activeTab === tab.id ? 1 : 0);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  React.useEffect(() => {
    tabs.forEach((tab) => {
      Animated.timing(animatedValues[tab.id], {
        toValue: activeTab === tab.id ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  }, [activeTab, animatedValues]);

  const renderTab = (tab: TabItem) => {
    const isActive = activeTab === tab.id;
    const Icon = tab.icon;
    const animatedValue = animatedValues[tab.id];

    // Animated styles
    const animatedBackgroundColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', colors.blue[50]],
    });

    const animatedScale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.05],
    });

    return (
      <TouchableOpacity
        key={tab.id}
        onPress={() => onTabPress(tab.id)}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: spacing[3],
        }}
        activeOpacity={0.7}
      >
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[2],
            borderRadius: borderRadius.lg,
            backgroundColor: animatedBackgroundColor,
            transform: [{ scale: animatedScale }],
            // Neumorphic effect for active state
            ...(isActive && {
              shadowColor: colors.blue[500],
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }),
          }}
        >
          <Icon
            size={20}
            color={isActive ? colors.blue[600] : colors.gray[500]}
          />
          <Text
            variant="caption"
            style={{
              marginTop: spacing[1],
              fontSize: 12,
              color: isActive ? colors.blue[600] : colors.gray[500],
              fontWeight: isActive ? '600' : '400',
            }}
          >
            {tab.label}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.white,
          paddingBottom: insets.bottom,
          borderTopWidth: 1,
          borderTopColor: colors.gray[200],
          // Neumorphic shadow effect
          shadowColor: colors.black,
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
          // Web compatibility
          // @ts-ignore - boxShadow is web-only
          boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)',
        },
        style,
      ]}
    >
      {/* Glassmorphism overlay effect */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          // @ts-ignore - backdrop-filter is web-only
          backdropFilter: 'blur(10px)',
        }}
      />
      
      {/* Tab Container */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingHorizontal: spacing[4],
          paddingTop: spacing[2],
          minHeight: 64,
        }}
      >
        {tabs.map(renderTab)}
      </View>
    </View>
  );
};

export default BottomNavigation;