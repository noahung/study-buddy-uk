import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/common/Header';
import SideDrawer from '../components/common/SideDrawer';
import { BottomNavigation } from '../navigation/MainTabs';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  showSearch?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  showBottomNavigation?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  showSearch = false,
  showBackButton = false,
  onBackPress,
  activeTab,
  onTabChange,
  showBottomNavigation = true,
}) => {
  const { theme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleMenuClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleDrawerNavigate = (view: string) => {
    console.log('Navigate to:', view);
    // TODO: Implement navigation logic
  };

  const handleUpgrade = () => {
    console.log('Upgrade to premium');
    // TODO: Implement upgrade logic
  };

  const handleSearchClick = () => {
    console.log('Search clicked');
    // TODO: Implement search logic
  };

  const handleNotificationClick = () => {
    console.log('Notifications clicked');
    // TODO: Implement notifications logic
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title={title}
        onMenuClick={handleMenuClick}
        showSearch={showSearch}
        showBack={showBackButton}
        onBack={onBackPress}
        onSearchClick={handleSearchClick}
        onNotificationClick={handleNotificationClick}
      />
      
      <View style={[styles.content, !showBottomNavigation && styles.contentFullHeight]}>
        {children}
      </View>

      {showBottomNavigation && (
        <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
      )}

      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onNavigate={handleDrawerNavigate}
        onUpgrade={handleUpgrade}
        userName="John Doe"
        userEmail="john.doe@email.com"
        subscriptionPlan="free"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 80, // Space for bottom navigation
  },
  contentFullHeight: {
    paddingBottom: 0, // No padding when bottom nav is hidden
  },
});

export default MainLayout;
