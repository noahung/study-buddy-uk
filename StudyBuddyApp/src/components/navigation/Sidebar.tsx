import React from 'react';
import { View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Text } from '../ui/Text';
import { colors, theme, spacing, borderRadius } from '../../styles';
import {
  Book,
  User,
  Settings,
  Bell,
  CreditCard,
  HelpCircle,
  X,
  ChevronRight,
} from 'lucide-react-native';

interface SidebarItem {
  id: string;
  label: string;
  icon: typeof Book;
  badge?: string;
}

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  onItemPress: (itemId: string) => void;
  activeItem?: string;
}

const sidebarItems: SidebarItem[] = [
  { id: 'course-selection', label: 'Course Selection', icon: Book },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3' },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

const { width: screenWidth } = Dimensions.get('window');
const SIDEBAR_WIDTH = 320;

const Sidebar: React.FC<SidebarProps> = ({
  isVisible,
  onClose,
  onItemPress,
  activeItem,
}) => {
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isVisible) {
      // Open sidebar
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Close sidebar
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, slideAnim, overlayAnim]);

  const renderSidebarItem = (item: SidebarItem) => {
    const isActive = activeItem === item.id;
    const Icon = item.icon;

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => {
          onItemPress(item.id);
          onClose();
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[4],
          marginHorizontal: spacing[3],
          marginBottom: spacing[2],
          borderRadius: borderRadius.lg,
          backgroundColor: isActive ? colors.blue[50] : 'transparent',
          // Neumorphic effect for active items
          ...(isActive && {
            shadowColor: colors.blue[500],
            shadowOffset: {
              width: 2,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }),
        }}
        activeOpacity={0.7}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isActive ? colors.blue[100] : colors.gray[100],
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: spacing[3],
          }}
        >
          <Icon
            size={20}
            color={isActive ? colors.blue[600] : colors.gray[600]}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            variant="label"
            style={{
              color: isActive ? colors.blue[700] : colors.gray[900],
              fontWeight: isActive ? '600' : '500',
            }}
          >
            {item.label}
          </Text>
        </View>

        {/* Badge */}
        {item.badge && (
          <View
            style={{
              backgroundColor: colors.red[500],
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: spacing[2],
            }}
          >
            <Text
              variant="caption"
              style={{
                color: colors.white,
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              {item.badge}
            </Text>
          </View>
        )}

        {/* Arrow */}
        <ChevronRight size={16} color={colors.gray[400]} />
      </TouchableOpacity>
    );
  };

  if (!isVisible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      {/* Overlay */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.black,
          opacity: overlayAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
          }),
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          backgroundColor: colors.white,
          transform: [{ translateX: slideAnim }],
          // Neumorphic shadow
          shadowColor: colors.black,
          shadowOffset: {
            width: 4,
            height: 0,
          },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 16,
          // Web compatibility
          // @ts-ignore - boxShadow is web-only
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="dark" />
          
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: spacing[6],
              borderBottomWidth: 1,
              borderBottomColor: colors.gray[200],
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: colors.blue[500],
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: spacing[3],
                  // Neumorphic gradient effect
                  shadowColor: colors.blue[700],
                  shadowOffset: {
                    width: 2,
                    height: 2,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 4,
                }}
              >
                <Book size={24} color={colors.white} />
              </View>
              
              <View>
                <Text variant="label" style={{ fontSize: 16, marginBottom: spacing[1] }}>
                  Study Buddy
                </Text>
                <Text variant="caption" color="secondary">
                  Premium User
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={{
                padding: spacing[2],
                borderRadius: borderRadius.md,
                backgroundColor: colors.gray[100],
              }}
            >
              <X size={20} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={{ flex: 1, paddingTop: spacing[4] }}>
            {sidebarItems.map(renderSidebarItem)}
          </View>

          {/* Footer */}
          <View
            style={{
              padding: spacing[6],
              borderTopWidth: 1,
              borderTopColor: colors.gray[200],
            }}
          >
            <View
              style={{
                backgroundColor: colors.blue[50],
                borderRadius: borderRadius.lg,
                padding: spacing[4],
                // Subtle neumorphic inset effect
                borderWidth: 1,
                borderColor: colors.blue[100],
              }}
            >
              <Text variant="label" style={{ color: colors.blue[700], marginBottom: spacing[1] }}>
                🎓 Premium Features
              </Text>
              <Text variant="caption" color="secondary" style={{ fontSize: 12 }}>
                Unlimited AI chat, mock tests, and flashcards
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

export default Sidebar;