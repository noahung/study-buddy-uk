import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, MessageCircle, CreditCard, FileText, TrendingUp, User, Settings, Bell, CreditCard as SubscriptionIcon, HelpCircle, Menu, X } from 'lucide-react';

// Import screens
import SplashScreen from './components/SplashScreen';
import OnboardingFlow from './components/OnboardingFlow';
import GoogleSignIn from './components/GoogleSignIn';
import CourseSelection from './components/CourseSelection';
import CourseDashboard from './components/CourseDashboard';
import AIChatInterface from './components/AIChatInterface';
import MockTestMenu from './components/MockTestMenu';
import FlashcardDeckSelection from './components/FlashcardDeckSelection';
import NotesListView from './components/NotesListView';
import RevisionHub from './components/RevisionHub';
import ProfileScreen from './components/ProfileScreen';
import SettingsScreen from './components/SettingsScreen';
import NotificationsScreen from './components/NotificationsScreen';
import SubscriptionScreen from './components/SubscriptionScreen';
import HelpSupportScreen from './components/HelpSupportScreen';

// Import detailed screens
import FlashcardStudyScreen from './components/FlashcardStudyScreen';
import NoteDetailScreen from './components/NoteDetailScreen';
import MockTestScreen from './components/MockTestScreen';
import TestResultScreen from './components/TestResultScreen';
import ExamBankScreen from './components/ExamBankScreen';
import RevisionStudyScreen from './components/RevisionStudyScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [testResults, setTestResults] = useState(null);

  // Auto-advance from splash screen
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        if (!hasCompletedOnboarding) {
          setCurrentScreen('onboarding');
        } else if (!isAuthenticated) {
          setCurrentScreen('signin');
        } else {
          setCurrentScreen('course-selection');
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, isAuthenticated, hasCompletedOnboarding]);

  const handleSignIn = () => {
    setIsAuthenticated(true);
    setCurrentScreen('course-selection');
  };

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    setCurrentScreen('signin');
  };

  const handleCourseSelect = () => {
    setCurrentScreen('dashboard');
  };

  const handleTestComplete = (results: any) => {
    setTestResults(results);
    setCurrentScreen('test-results');
  };

  // Bottom navigation items
  const bottomNavItems = [
    { id: 'dashboard', icon: Book, label: 'Dashboard' },
    { id: 'ai-chat', icon: MessageCircle, label: 'AI Chat' },
    { id: 'flashcards', icon: CreditCard, label: 'Flashcards' },
    { id: 'notes', icon: FileText, label: 'Notes' },
    { id: 'revision', icon: TrendingUp, label: 'Revision' },
  ];

  // Side drawer items
  const sideDrawerItems = [
    { id: 'course-selection', icon: Book, label: 'Course Selection' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'subscription', icon: SubscriptionIcon, label: 'Subscription' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support' },
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;
      case 'signin':
        return <GoogleSignIn onSignIn={handleSignIn} />;
      case 'course-selection':
        return <CourseSelection onCourseSelect={handleCourseSelect} />;
      case 'dashboard':
        return <CourseDashboard setCurrentScreen={setCurrentScreen} setIsSidebarOpen={setIsSidebarOpen} />;
      case 'ai-chat':
        return <AIChatInterface />;
      case 'mock-test':
        return <MockTestMenu setCurrentScreen={setCurrentScreen} />;
      case 'exam-bank':
        return <ExamBankScreen onBack={() => setCurrentScreen('mock-test')} setCurrentScreen={setCurrentScreen} />;
      case 'flashcard-study':
        return <FlashcardStudyScreen onBack={() => setCurrentScreen('flashcards')} />;
      case 'flashcards':
        return <FlashcardDeckSelection setCurrentScreen={setCurrentScreen} />;
      case 'note-detail':
        return <NoteDetailScreen onBack={() => setCurrentScreen('notes')} />;
      case 'notes':
        return <NotesListView setCurrentScreen={setCurrentScreen} />;
      case 'test-taking':
        return <MockTestScreen onBack={() => setCurrentScreen('exam-bank')} onComplete={handleTestComplete} />;
      case 'test-results':
        return <TestResultScreen 
          onBack={() => setCurrentScreen('dashboard')} 
          onRetakeTest={() => setCurrentScreen('test-taking')}
          results={testResults}
        />;
      case 'revision':
        return <RevisionHub setCurrentScreen={setCurrentScreen} />;
      case 'revision-study':
        return <RevisionStudyScreen onBack={() => setCurrentScreen('revision')} />;
      case 'profile':
        return <ProfileScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'subscription':
        return <SubscriptionScreen />;
      case 'help':
        return <HelpSupportScreen />;
      default:
        return <CourseDashboard setCurrentScreen={setCurrentScreen} setIsSidebarOpen={setIsSidebarOpen} />;
    }
  };

  const showBottomNav = isAuthenticated && !['splash', 'onboarding', 'signin', 'course-selection'].includes(currentScreen);
  const showSidebar = isAuthenticated && !['splash', 'onboarding', 'signin', 'course-selection'].includes(currentScreen);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Main Content */}
      <div className={`h-full ${showBottomNav ? 'pb-20' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-gray-200/50"
          style={{
            boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          }}
        >
          <div className="flex items-center justify-around h-full px-4">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow: isActive 
                      ? 'inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.8)'
                      : 'none'
                  }}
                >
                  <Icon size={20} />
                  <span className="text-xs mt-1">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Side Drawer */}
      {showSidebar && (
        <>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
          </AnimatePresence>

          <motion.div
            initial={{ x: -300 }}
            animate={{ x: isSidebarOpen ? 0 : -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white z-50"
            style={{
              boxShadow: '20px 0 40px rgba(0, 0, 0, 0.15), inset -1px 0 0 rgba(255, 255, 255, 0.8)'
            }}
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
                    style={{
                      boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.15), inset 1px 1px 0 rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <Book className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Master Study</h3>
                    <p className="text-sm text-gray-500">Premium User</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Drawer Items */}
            <div className="p-4 space-y-2">
              {sideDrawerItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setCurrentScreen(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 p-4 rounded-xl text-left transition-all duration-200 ${
                      isActive 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      boxShadow: isActive 
                        ? 'inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.8)'
                        : '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}