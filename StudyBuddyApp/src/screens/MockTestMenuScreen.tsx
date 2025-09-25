import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Menu,
  Play,
  Target,
  Clock,
  TrendingUp,
  Award,
  CheckCircle,
  FileText,
} from 'lucide-react-native';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { theme, spacing, neumorphicShadow } from '../styles';

interface Props {
  onNavigate: (screen: string) => void;
  onOpenSidebar: () => void;
}

interface TestType {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  stats: string;
  targetScreen: string;
}

interface RecentResult {
  title: string;
  score: number;
  date: string;
  questions: number;
  type: string;
}

const { width } = Dimensions.get('window');

const MockTestMenuScreen: React.FC<Props> = ({ onNavigate, onOpenSidebar }) => {
  const handleTestStart = (targetScreen: string) => {
    onNavigate(targetScreen);
  };

  const testTypes: TestType[] = [
    {
      id: 'exam-bank',
      title: 'Exam Bank',
      description: 'Practice with real exam questions',
      icon: FileText,
      color: '#8b5cf6',
      stats: '500+ questions',
      targetScreen: 'mock-test'
    },
    {
      id: 'practice',
      title: 'Quick Practice',
      description: 'Unlimited time, instant feedback',
      icon: Target,
      color: '#3b82f6',
      stats: '25 questions',
      targetScreen: 'mock-test'
    },
    {
      id: 'timed',
      title: 'Timed Test',
      description: 'Real exam conditions',
      icon: Clock,
      color: '#ef4444',
      stats: '60 minutes',
      targetScreen: 'mock-test'
    }
  ];

  const recentResults: RecentResult[] = [
    {
      title: 'JavaScript Fundamentals',
      score: 85,
      date: '2 days ago',
      questions: 30,
      type: 'practice'
    },
    {
      title: 'React Hooks Quiz',
      score: 92,
      date: '5 days ago',
      questions: 20,
      type: 'timed'
    },
    {
      title: 'CSS Flexbox Test',
      score: 78,
      date: '1 week ago',
      questions: 15,
      type: 'practice'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'linear-gradient(135deg, #10B981, #059669)';
    if (score >= 60) return 'linear-gradient(135deg, #F59E0B, #D97706)';
    return 'linear-gradient(135deg, #EF4444, #DC2626)';
  };

  const renderTestType = (test: TestType, index: number) => {
    const Icon = test.icon;

    return (
      <TouchableOpacity
        key={test.id}
        style={[styles.testCard, neumorphicShadow.lg]}
        onPress={() => handleTestStart(test.targetScreen)}
        activeOpacity={0.8}
      >
        <View style={styles.testCardHeader}>
          <View style={[
            styles.iconContainer,
            {
              backgroundColor: test.color,
              ...neumorphicShadow.md,
            }
          ]}>
            <Icon size={24} color={theme.surface} />
          </View>
          
          <View
            style={[styles.startButton, neumorphicShadow.sm]}
          >
            <Play size={16} color={theme.surface} style={styles.playIcon} />
            <Text variant="label" style={{ color: theme.surface }}>
              {test.id === 'exam-bank' ? 'Browse' : 'Start'}
            </Text>
          </View>
        </View>

        <Text variant="h3" style={styles.testTitle}>
          {test.title}
        </Text>
        <Text variant="body" style={styles.testDescription}>
          {test.description}
        </Text>
        <Text variant="caption" style={styles.testStats}>
          {test.stats}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRecentResult = (result: RecentResult, index: number) => {
    const scoreColor = getScoreColor(result.score);
    
    return (
      <View key={index} style={[styles.resultCard, neumorphicShadow.md]}>
        <View style={styles.resultHeader}>
          <View style={styles.resultLeft}>
            <View style={[
              styles.scoreIcon,
              {
                backgroundColor: scoreColor,
                ...neumorphicShadow.sm,
              }
            ]}>
              {result.score >= 80 ? (
                <Award size={16} color={theme.surface} />
              ) : (
                <CheckCircle size={16} color={theme.surface} />
              )}
            </View>
            
            <View style={styles.resultInfo}>
              <Text variant="label" style={{ color: theme.text.primary }}>
                {result.title}
              </Text>
              <Text variant="caption" style={{ color: theme.text.secondary }}>
                {result.questions} questions • {result.date}
              </Text>
            </View>
          </View>
          
          <View style={styles.resultRight}>
            <Text variant="h3" style={{ color: scoreColor }}>
              {result.score}%
            </Text>
            <Text variant="caption" style={{ 
              color: theme.text.secondary,
              textTransform: 'capitalize'
            }}>
              {result.type}
            </Text>
          </View>
        </View>
        
        {/* Score progress bar */}
        <View style={styles.scoreBarContainer}>
          <View style={styles.scoreBarBackground} />
          <View
            style={[
              styles.scoreBar,
              {
                width: `${result.score}%`,
                backgroundColor: scoreColor,
              }
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h1" style={{ color: theme.text.primary }}>
            Mock Tests
          </Text>
          <Text variant="body" style={{ 
            color: theme.text.secondary,
            marginTop: spacing[2]
          }}>
            Practice and improve your skills
          </Text>
        </View>

        {/* Test Types Section */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Choose Test Type
          </Text>
          
          {testTypes.map((test, index) => renderTestType(test, index))}
        </View>

        {/* Recent Results Section */}
        <View style={styles.section}>
          <View style={styles.resultsHeader}>
            <Text variant="h3" style={{ color: theme.text.primary }}>
              Recent Results
            </Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <TrendingUp size={16} color={theme.primary} />
              <Text variant="caption" style={{ 
                color: theme.primary,
                marginLeft: spacing[1]
              }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          {recentResults.map((result, index) => renderRecentResult(result, index))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
  },
  header: {
    marginBottom: spacing[8],
  },
  section: {
    marginBottom: spacing[8],
  },
  sectionTitle: {
    color: theme.text.primary,
    marginBottom: spacing[4],
  },
  testCard: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: spacing[6],
    marginBottom: spacing[4],
  },
  testCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[2],
    borderRadius: 12,
    gap: spacing[2],
  },
  playIcon: {
    marginRight: spacing[2],
  },
  testTitle: {
    color: theme.text.primary,
    marginBottom: spacing[2],
  },
  testDescription: {
    color: theme.text.secondary,
    marginBottom: spacing[3],
  },
  testStats: {
    color: theme.text.secondary,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultCard: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scoreIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  resultInfo: {
    flex: 1,
  },
  resultRight: {
    alignItems: 'flex-end',
  },
  scoreBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginTop: spacing[3],
    overflow: 'hidden',
  },
  scoreBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  scoreBar: {
    height: '100%',
    borderRadius: 4,
  },
  bottomPadding: {
    height: spacing[12],
  },
});

export default MockTestMenuScreen;