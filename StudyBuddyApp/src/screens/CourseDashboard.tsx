import React from 'react';
import { View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { colors, theme, layout, spacing, borderRadius, neumorphicShadow } from '../styles';
import {
  MessageCircle,
  CreditCard,
  CheckSquare,
  FileText,
  TrendingUp,
  Menu,
  Bell,
  Search,
  Award,
  Calendar,
  Play,
} from 'lucide-react-native';

interface CourseDashboardProps {
  onNavigate: (screen: string) => void;
  onOpenSidebar: () => void;
}

const CourseDashboard: React.FC<CourseDashboardProps> = ({ onNavigate, onOpenSidebar }) => {
  const dashboardCards = [
    {
      id: 'ai-chat',
      title: 'AI Chat',
      description: 'Get instant answers',
      icon: MessageCircle,
      color: ['#3B82F6', '#06B6D4'],
      stats: '24/7 available',
    },
    {
      id: 'flashcards',
      title: 'Flashcards',
      description: 'Study smart',
      icon: CreditCard,
      color: ['#8B5CF6', '#EC4899'],
      stats: '127 cards',
    },
    {
      id: 'mock-test-menu',
      title: 'Mock Tests',
      description: 'Practice exams',
      icon: CheckSquare,
      color: ['#10B981', '#059669'],
      stats: '12 available',
    },
    {
      id: 'notes',
      title: 'Notes',
      description: 'Your study notes',
      icon: FileText,
      color: ['#F59E0B', '#EF4444'],
      stats: '8 notes',
    },
    {
      id: 'revision',
      title: 'Revision Hub',
      description: 'Smart review',
      icon: TrendingUp,
      color: ['#6366F1', '#8B5CF6'],
      stats: '3 topics due',
    },
  ];

  const recentActivity = [
    {
      type: 'test',
      title: 'JavaScript Fundamentals Quiz',
      score: 85,
      time: '2 hours ago',
      icon: CheckSquare,
      color: colors.green[500],
    },
    {
      type: 'study',
      title: 'React Hooks Flashcards',
      progress: 67,
      time: '5 hours ago',
      icon: CreditCard,
      color: colors.purple[500],
    },
    {
      type: 'note',
      title: 'Redux State Management',
      time: '1 day ago',
      icon: FileText,
      color: colors.orange[500],
    },
  ];

  const renderDashboardCard = ({ item, index }: { item: typeof dashboardCards[0], index: number }) => (
    <TouchableOpacity
      style={{
        flex: 1,
        marginRight: index % 2 === 0 ? spacing[2] : 0,
        marginLeft: index % 2 === 1 ? spacing[2] : 0,
        marginBottom: spacing[4],
      }}
      onPress={() => onNavigate(item.id)}
      activeOpacity={0.95}
    >
      <Card
        gradient={{
          colors: item.color as [string, string],
          start: [0, 0],
          end: [1, 1],
        }}
        style={{
          padding: spacing[4],
          minHeight: 120,
        }}
      >
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.3)',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing[3],
              }}
            >
              <item.icon size={20} color={colors.white} />
            </View>
            <Text variant="label" color="white" style={{ marginBottom: spacing[1] }}>
              {item.title}
            </Text>
            <Text variant="caption" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: spacing[2] }}>
              {item.description}
            </Text>
          </View>
          <Text variant="caption" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
            {item.stats}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderActivityItem = ({ item }: { item: typeof recentActivity[0] }) => (
    <Card style={{ marginBottom: spacing[3], padding: spacing[4] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: item.color,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: spacing[3],
            }}
          >
            <item.icon size={16} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="label" style={{ marginBottom: spacing[1] }}>
              {item.title}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Calendar size={12} color={theme.text.tertiary} />
              <Text variant="caption" color="tertiary" style={{ marginLeft: spacing[1] }}>
                {item.time}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={{ alignItems: 'flex-end' }}>
          {item.score && (
            <Text variant="label" style={{ color: colors.green[600], fontSize: 16 }}>
              {item.score}%
            </Text>
          )}
          {item.progress && (
            <Text variant="label" style={{ color: colors.purple[600], fontSize: 16 }}>
              {item.progress}%
            </Text>
          )}
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[layout.container, { backgroundColor: theme.background }]}>
      <StatusBar style="dark" />
      
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing[24] }}
      >
        {/* Header */}
        <View style={{ padding: spacing[6], paddingBottom: spacing[4] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[6] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={onOpenSidebar}
                style={{
                  padding: spacing[2],
                  backgroundColor: colors.white,
                  borderRadius: borderRadius.lg,
                  marginRight: spacing[4],
                  ...neumorphicShadow.sm,
                }}
              >
                <Menu size={20} color={theme.text.primary} />
              </TouchableOpacity>
              <View>
                <Text variant="h2" style={{ marginBottom: spacing[1] }}>
                  Good morning, Alex!
                </Text>
                <Text variant="body" color="secondary">
                  Ready to continue learning?
                </Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', gap: spacing[2] }}>
              <TouchableOpacity
                style={{
                  padding: spacing[2],
                  backgroundColor: colors.white,
                  borderRadius: borderRadius.lg,
                  ...neumorphicShadow.sm,
                }}
              >
                <Search size={20} color={theme.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: spacing[2],
                  backgroundColor: colors.white,
                  borderRadius: borderRadius.lg,
                  ...neumorphicShadow.sm,
                }}
              >
                <Bell size={20} color={theme.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Overview */}
          <Card style={{ padding: spacing[5], marginBottom: spacing[6] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
              <View>
                <Text variant="label" style={{ marginBottom: spacing[1] }}>
                  Course Progress
                </Text>
                <Text variant="caption" color="secondary">
                  React Advanced Patterns
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text variant="h2" style={{ fontSize: 24 }}>
                  67%
                </Text>
                <Text variant="caption" color="secondary">
                  Complete
                </Text>
              </View>
            </View>
            
            <Progress value={67} style={{ marginBottom: spacing[3] }} />
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="caption" color="secondary">
                12 of 18 modules completed
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Award size={14} color={colors.yellow[500]} />
                <Text variant="caption" color="secondary" style={{ marginLeft: spacing[1] }}>
                  Next: State Management
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Study Tools */}
        <View style={{ paddingHorizontal: spacing[6] }}>
          <Text variant="h3" style={{ marginBottom: spacing[4] }}>
            Study Tools
          </Text>
          
          <FlatList
            data={dashboardCards}
            renderItem={renderDashboardCard}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* Recent Activity */}
        <View style={{ paddingHorizontal: spacing[6], paddingTop: spacing[2] }}>
          <Text variant="h3" style={{ marginBottom: spacing[4] }}>
            Recent Activity
          </Text>
          
          <FlatList
            data={recentActivity}
            renderItem={renderActivityItem}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CourseDashboard;