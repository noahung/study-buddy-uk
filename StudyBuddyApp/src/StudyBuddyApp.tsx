import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from './components/ui/Text';

// Screens
import SplashScreen from './screens/SplashScreen';
import CourseSelection from './screens/CourseSelection';
import CourseDashboard from './screens/CourseDashboard';
import AIChatScreen from './screens/AIChatScreen';
import MockTestMenuScreen from './screens/MockTestMenuScreen';
import MockTestScreen from './screens/MockTestScreen';
import TestResultScreen from './screens/TestResultScreen';
import FlashcardDeckScreen from './screens/FlashcardDeckScreen';
import FlashcardStudyScreen from './screens/FlashcardStudyScreen';

// Navigation Components
import BottomNavigation from './components/navigation/BottomNavigation';
import Sidebar from './components/navigation/Sidebar';

// Styles
import { theme, layout } from './styles';

// Types
interface Course {
  id: string;
  name: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  students: number;
  rating: number;
}

type AppScreen = 
  | 'splash'
  | 'course-selection' 
  | 'dashboard'
  | 'ai-chat'
  | 'mock-test-menu'
  | 'mock-test'
  | 'test-results'
  | 'flashcards'
  | 'flashcard-study'
  | 'notes'
  | 'revision'
  | 'profile'
  | 'settings'
  | 'notifications'
  | 'subscription'
  | 'help';

const StudyBuddyApp: React.FC = () => {
  // App State
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auto-advance from splash screen (matches web app behavior)
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        if (!hasCompletedOnboarding) {
          // In a real app, this would go to onboarding first
          setCurrentScreen('course-selection');
          setHasCompletedOnboarding(true);
        } else if (!isAuthenticated) {
          // In a real app, this would go to sign-in
          setCurrentScreen('course-selection');
        } else {
          setCurrentScreen('course-selection');
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, isAuthenticated, hasCompletedOnboarding]);

  // Navigation handlers
  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setIsAuthenticated(true);
    setCurrentScreen('dashboard');
  };

  const handleBottomNavigation = (tabId: string) => {
    setCurrentScreen(tabId as AppScreen);
    setIsSidebarOpen(false);
  };

  const handleSidebarNavigation = (itemId: string) => {
    setCurrentScreen(itemId as AppScreen);
    setIsSidebarOpen(false);
  };

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
  };

  // Screen rendering
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      
      case 'course-selection':
        return <CourseSelection onCourseSelect={handleCourseSelect} />;
      
      case 'dashboard':
        return (
          <CourseDashboard 
            onNavigate={handleBottomNavigation}
            onOpenSidebar={handleOpenSidebar}
          />
        );
      
      case 'ai-chat':
        return (
          <AIChatScreen 
            onNavigate={handleBottomNavigation}
            onOpenSidebar={handleOpenSidebar}
          />
        );
      
      case 'mock-test-menu':
        return (
          <MockTestMenuScreen 
            onNavigate={handleBottomNavigation}
            onOpenSidebar={handleOpenSidebar}
          />
        );
      
      case 'mock-test':
        return (
          <MockTestScreen 
            onNavigate={handleBottomNavigation}
            onOpenSidebar={handleOpenSidebar}
          />
        );
      
      case 'test-results':
        return (
          <TestResultScreen 
            onNavigate={handleBottomNavigation}
          />
        );
      
      case 'flashcards':
        return (
          <FlashcardDeckScreen 
            onNavigate={handleBottomNavigation}
            onOpenSidebar={handleOpenSidebar}
          />
        );
      
      case 'flashcard-study':
        return (
          <FlashcardStudyScreen 
            onNavigate={handleBottomNavigation}
          />
        );
      
      case 'notes':
        return (
          <View style={[layout.container, layout.centered]}>
            <StatusBar style="dark" />
            {/* Placeholder for Notes Screen */}
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text variant="h2" style={{ marginBottom: 10 }}>📝 Notes Screen</Text>
              <Text variant="body" color="secondary">Coming soon...</Text>
            </View>
          </View>
        );
      
      case 'revision':
        return (
          <View style={[layout.container, layout.centered]}>
            <StatusBar style="dark" />
            {/* Placeholder for Revision Screen */}
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text variant="h2" style={{ marginBottom: 10 }}>📈 Revision Hub</Text>
              <Text variant="body" color="secondary">Coming soon...</Text>
            </View>
          </View>
        );
      
      case 'profile':
        return (
          <View style={[layout.container, layout.centered]}>
            <StatusBar style="dark" />
            {/* Placeholder for Profile Screen */}
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text variant="h2" style={{ marginBottom: 10 }}>👤 Profile Screen</Text>
              <Text variant="body" color="secondary">Coming soon...</Text>
            </View>
          </View>
        );
      
      case 'settings':
        return (
          <View style={[layout.container, layout.centered]}>
            <StatusBar style="dark" />
            {/* Placeholder for Settings Screen */}
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text variant="h2" style={{ marginBottom: 10 }}>⚙️ Settings Screen</Text>
              <Text variant="body" color="secondary">Coming soon...</Text>
            </View>
          </View>
        );
      
      default:
        return (
          <CourseDashboard 
            onNavigate={handleBottomNavigation}
            onOpenSidebar={handleOpenSidebar}
          />
        );
    }
  };

  // Determine if bottom navigation should be shown
  const showBottomNavigation = isAuthenticated && !['splash', 'course-selection'].includes(currentScreen);

  return (
    <SafeAreaProvider>
      <View style={[layout.container, { backgroundColor: theme.background }]}>
        {/* Main Screen Content */}
        <View style={{ flex: 1, paddingBottom: showBottomNavigation ? 80 : 0 }}>
          {renderScreen()}
        </View>

        {/* Bottom Navigation */}
        {showBottomNavigation && (
          <BottomNavigation
            activeTab={currentScreen}
            onTabPress={handleBottomNavigation}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          isVisible={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onItemPress={handleSidebarNavigation}
          activeItem={currentScreen}
        />
      </View>
    </SafeAreaProvider>
  );
};

export default StudyBuddyApp;