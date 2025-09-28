import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import screens
import SplashScreen from './auth/SplashScreen';
import OnboardingScreen from './auth/OnboardingScreen';
import AuthScreen from './auth/AuthScreen';
import MainLayout from './MainLayout';

// Import contexts
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { CourseProvider } from '../contexts/CourseContext';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';

// Import main screens
import HomeScreen from './main/HomeScreen';
import ChatScreen from './main/ChatScreen';
import TestsScreen from './main/TestsScreen';
import FlashcardsScreen from './main/FlashcardsScreen';
import NotesScreen from './main/NotesScreen';
import ProfileScreen from './main/ProfileScreen';
import SettingsScreen from './main/SettingsScreen';
import SubscriptionUpgradeScreen from './main/SubscriptionUpgradeScreen';
import CourseSelectionScreen from './main/CourseSelectionScreen';
import ExamDetailScreen from './study/ExamDetailScreen';
import ExamScreen from './study/ExamScreen';
import TestResultsScreen from './study/TestResultsScreen';
import FlashcardStudyScreen from './study/FlashcardStudyScreen';
import TestHistoryScreen from './study/TestHistoryScreen';
import NoteDetailScreen from './study/NoteDetailScreen';
import NoteEditorScreen from './study/NoteEditorScreen';
import RevisionHubScreen from './study/RevisionHubScreen';
import AIStudyPlannerScreen from './ai/AIStudyPlannerScreen';
import AILearningAnalyticsScreen from './ai/AILearningAnalyticsScreen';

// Main App Component
const MainAppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('main');
  const [screenParams, setScreenParams] = useState<any>({});

  // Check if user has completed onboarding
  useEffect(() => {
    // TODO: Check onboarding status from storage
    // For now, we'll show onboarding for new users
    if (user && !user.name) {
      setShowOnboarding(true);
    }
  }, [user]);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  // Navigation functions
  const navigateToScreen = (screen: string, params: any = {}) => {
    setCurrentScreen(screen);
    setScreenParams(params);
  };

  const goBack = () => {
    setCurrentScreen('main');
    setScreenParams({});
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'main':
        switch (activeTab) {
          case 'home':
            return <HomeScreen onNavigate={navigateToScreen} />;
          case 'chat':
            return <ChatScreen onNavigate={navigateToScreen} />;
          case 'tests':
            return <TestsScreen onNavigate={navigateToScreen} />;
          case 'flashcards':
            return <FlashcardsScreen onNavigate={navigateToScreen} />;
          case 'notes':
            return <NotesScreen onNavigate={navigateToScreen} />;
          case 'profile':
            return <ProfileScreen onNavigate={navigateToScreen} />;
          default:
            return <HomeScreen onNavigate={navigateToScreen} />;
        }
      case 'settings':
        return <SettingsScreen onNavigate={navigateToScreen} onGoBack={goBack} />;
      case 'subscription':
        return <SubscriptionUpgradeScreen onNavigate={navigateToScreen} onGoBack={goBack} />;
      case 'course-selection':
        return <CourseSelectionScreen onNavigate={navigateToScreen} onGoBack={goBack} />;
      case 'exam-detail':
        return <ExamDetailScreen examId={screenParams.examId} onNavigate={navigateToScreen} onGoBack={goBack} />;
      case 'exam':
        return <ExamScreen examId={screenParams.examId} onNavigate={navigateToScreen} onGoBack={goBack} />;
      case 'test-results':
        return <TestResultsScreen 
          attemptId={screenParams.attemptId}
          examId={screenParams.examId}
          score={screenParams.score}
          passed={screenParams.passed}
          answers={screenParams.answers}
          questions={screenParams.questions}
          timeSpent={screenParams.timeSpent}
          onNavigate={navigateToScreen} 
          onGoBack={goBack} 
        />;
      case 'flashcard-study':
        return <FlashcardStudyScreen flashcardSetId={screenParams.flashcardSetId} onNavigate={navigateToScreen} onGoBack={goBack} />;
      case 'test-history':
        return <TestHistoryScreen onNavigate={navigateToScreen} onGoBack={goBack} />;
      case 'note-detail':
        return <NoteDetailScreen noteId={screenParams.noteId} onNavigate={navigateToScreen} onGoBack={goBack} />;
      case 'note-editor':
        return <NoteEditorScreen noteId={screenParams.noteId} mode={screenParams.mode} onNavigate={navigateToScreen} onGoBack={goBack} />;
      case 'revision-hub':
        return <RevisionHubScreen onNavigate={navigateToScreen} onGoBack={goBack} />;
      case 'ai-study-planner':
        return <AIStudyPlannerScreen onNavigate={navigateToScreen} onGoBack={goBack} />;
      case 'ai-analytics':
        return <AILearningAnalyticsScreen onNavigate={navigateToScreen} onGoBack={goBack} />;
      default:
        return <HomeScreen onNavigate={navigateToScreen} />;
    }
  };

  const getTitle = () => {
    switch (currentScreen) {
      case 'settings':
        return 'Settings';
      case 'subscription':
        return 'Upgrade to Premium';
      case 'course-selection':
        return 'Select Course';
      case 'exam-detail':
        return 'Exam Details';
      case 'exam':
        return 'Taking Exam';
      case 'test-results':
        return 'Test Results';
      case 'flashcard-study':
        return 'Study Flashcards';
      case 'test-history':
        return 'Test History';
      case 'note-detail':
        return 'Note Details';
      case 'note-editor':
        return screenParams.mode === 'create' ? 'Create Note' : 'Edit Note';
      case 'revision-hub':
        return 'Revision Hub';
      case 'ai-study-planner':
        return 'AI Study Planner';
      case 'ai-analytics':
        return 'AI Learning Analytics';
      default:
        switch (activeTab) {
          case 'home':
            return 'Dashboard';
          case 'chat':
            return 'AI Study Buddy';
          case 'tests':
            return 'Mock Tests';
          case 'flashcards':
            return 'Flashcards';
          case 'notes':
            return 'My Notes';
          case 'profile':
            return 'Profile';
          default:
            return 'Study Buddy';
        }
    }
  };

  const showBackButton = currentScreen !== 'main';
  const showBottomNav = currentScreen === 'main';

  return (
    <MainLayout
      title={getTitle()}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showSearch={activeTab === 'notes' || activeTab === 'flashcards'}
      showBackButton={showBackButton}
      onBackPress={goBack}
      showBottomNavigation={showBottomNav}
    >
      {renderActiveScreen()}
    </MainLayout>
  );
};

// Main App with Providers
const MainApp: React.FC = () => {
  return (
    <AuthProvider>
      <CourseProvider>
        <SubscriptionProvider>
          <MainAppContent />
        </SubscriptionProvider>
      </CourseProvider>
    </AuthProvider>
  );
};

export default MainApp;
