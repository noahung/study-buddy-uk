import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { NeumorphicCard, NeumorphicButton, NeumorphicProgress } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';

interface RevisionHubScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  onGoBack?: () => void;
}

interface RevisionItem {
  id: string;
  type: 'flashcard' | 'note' | 'quiz' | 'summary';
  title: string;
  courseName: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  completed: boolean;
  progress: number;
  lastReviewed?: string;
}

const RevisionHubScreen: React.FC<RevisionHubScreenProps> = ({ 
  onNavigate, 
  onGoBack 
}) => {
  const { theme } = useTheme();
  const [revisionItems, setRevisionItems] = useState<RevisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'due' | 'completed'>('all');

  useEffect(() => {
    loadRevisionItems();
  }, []);

  const loadRevisionItems = async () => {
    try {
      setLoading(true);
      // TODO: Load revision items from API
      const mockItems: RevisionItem[] = [
        {
          id: '1',
          type: 'flashcard',
          title: 'Financial Planning Terms',
          courseName: 'Financial Planning Basics',
          priority: 'high',
          dueDate: '2024-01-20T09:00:00Z',
          completed: false,
          progress: 60,
          lastReviewed: '2024-01-18T14:30:00Z'
        },
        {
          id: '2',
          type: 'note',
          title: 'Investment Strategies Summary',
          courseName: 'Investment Planning',
          priority: 'medium',
          dueDate: '2024-01-22T10:00:00Z',
          completed: false,
          progress: 30,
          lastReviewed: '2024-01-17T16:45:00Z'
        },
        {
          id: '3',
          type: 'quiz',
          title: 'Risk Management Practice Test',
          courseName: 'Risk Management',
          priority: 'high',
          dueDate: '2024-01-19T15:00:00Z',
          completed: false,
          progress: 0
        },
        {
          id: '4',
          type: 'summary',
          title: 'Tax Planning Concepts',
          courseName: 'Tax Planning',
          priority: 'low',
          dueDate: '2024-01-25T11:00:00Z',
          completed: true,
          progress: 100,
          lastReviewed: '2024-01-16T09:15:00Z'
        }
      ];

      setRevisionItems(mockItems);
    } catch (error) {
      console.error('Failed to load revision items:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRevisionItems();
    setRefreshing(false);
  };

  const handleStartRevision = (item: RevisionItem) => {
    switch (item.type) {
      case 'flashcard':
        onNavigate?.('flashcard-study', { flashcardSetId: item.id });
        break;
      case 'note':
        onNavigate?.('note-detail', { noteId: item.id });
        break;
      case 'quiz':
        onNavigate?.('exam-detail', { examId: item.id });
        break;
      case 'summary':
        onNavigate?.('note-detail', { noteId: item.id });
        break;
    }
  };

  const handleMarkComplete = (itemId: string) => {
    setRevisionItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, completed: true, progress: 100 }
          : item
      )
    );
  };

  const getFilteredItems = () => {
    switch (filter) {
      case 'due':
        return revisionItems.filter(item => !item.completed);
      case 'completed':
        return revisionItems.filter(item => item.completed);
      default:
        return revisionItems;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.colors.error;
      case 'medium': return theme.colors.warning;
      case 'low': return theme.colors.success;
      default: return theme.colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flashcard': return 'layers';
      case 'note': return 'document-text';
      case 'quiz': return 'help-circle';
      case 'summary': return 'bulb';
      default: return 'book';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  const getStats = () => {
    const total = revisionItems.length;
    const completed = revisionItems.filter(item => item.completed).length;
    const overdue = revisionItems.filter(item => 
      !item.completed && item.dueDate && new Date(item.dueDate) < new Date()
    ).length;
    const dueToday = revisionItems.filter(item => 
      !item.completed && item.dueDate && 
      new Date(item.dueDate).toDateString() === new Date().toDateString()
    ).length;

    return { total, completed, overdue, dueToday };
  };

  const stats = getStats();
  const filteredItems = getFilteredItems();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading revision hub...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Revision Hub</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Smart study recommendations
        </Text>
      </View>

      {/* Stats Overview */}
      <NeumorphicCard style={styles.statsCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Study Overview
        </Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {stats.total}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Total Items
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {stats.completed}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Completed
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.warning }]}>
              {stats.dueToday}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Due Today
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.error }]}>
              {stats.overdue}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Overdue
            </Text>
          </View>
        </View>
      </NeumorphicCard>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {(['all', 'due', 'completed'] as const).map((filterType) => (
          <NeumorphicButton
            key={filterType}
            variant={filter === filterType ? 'primary' : 'secondary'}
            size="sm"
            onPress={() => setFilter(filterType)}
            style={styles.filterButton}
          >
            <Text style={[
              styles.filterText,
              { color: filter === filterType ? 'white' : theme.colors.text }
            ]}>
              {filterType === 'all' ? 'All' : filterType === 'due' ? 'Due' : 'Completed'}
            </Text>
          </NeumorphicButton>
        ))}
      </View>

      {/* Revision Items */}
      {filteredItems.length === 0 ? (
        <NeumorphicCard style={styles.emptyCard}>
          <Ionicons name="checkmark-circle" size={48} color={theme.colors.success} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            {filter === 'all' ? 'No revision items' : `No ${filter} items`}
          </Text>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            {filter === 'all' 
              ? 'Create some study materials to see them here!'
              : `No ${filter} items in your revision hub.`
            }
          </Text>
        </NeumorphicCard>
      ) : (
        <View style={styles.itemsList}>
          {filteredItems.map((item) => (
            <NeumorphicCard key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <View style={styles.itemTitleRow}>
                    <Ionicons 
                      name={getTypeIcon(item.type) as any} 
                      size={20} 
                      color={theme.colors.primary} 
                    />
                    <Text style={[styles.itemTitle, { color: theme.colors.text }]}>
                      {item.title}
                    </Text>
                    <View style={[
                      styles.priorityBadge,
                      { backgroundColor: getPriorityColor(item.priority) + '20' }
                    ]}>
                      <Text style={[
                        styles.priorityText,
                        { color: getPriorityColor(item.priority) }
                      ]}>
                        {item.priority.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.courseName, { color: theme.colors.textSecondary }]}>
                    {item.courseName}
                  </Text>
                </View>
                {item.completed && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
                )}
              </View>

              <View style={styles.itemContent}>
                <View style={styles.progressContainer}>
                  <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
                    Progress
                  </Text>
                  <NeumorphicProgress 
                    value={item.progress} 
                    variant={item.progress === 100 ? "success" : "primary"}
                    style={styles.progressBar}
                  />
                  <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                    {item.progress}%
                  </Text>
                </View>

                {item.dueDate && (
                  <View style={styles.dueDateContainer}>
                    <Ionicons name="time" size={14} color={theme.colors.textSecondary} />
                    <Text style={[styles.dueDateText, { color: theme.colors.textSecondary }]}>
                      Due: {formatDate(item.dueDate)}
                    </Text>
                  </View>
                )}

                {item.lastReviewed && (
                  <View style={styles.lastReviewedContainer}>
                    <Ionicons name="refresh" size={14} color={theme.colors.textSecondary} />
                    <Text style={[styles.lastReviewedText, { color: theme.colors.textSecondary }]}>
                      Last reviewed: {new Date(item.lastReviewed).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.itemActions}>
                {!item.completed ? (
                  <>
                    <NeumorphicButton
                      variant="primary"
                      size="sm"
                      onPress={() => handleStartRevision(item)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="play" size={16} color="white" />
                      <Text style={styles.actionButtonText}>Start</Text>
                    </NeumorphicButton>
                    <NeumorphicButton
                      variant="secondary"
                      size="sm"
                      onPress={() => handleMarkComplete(item.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="checkmark" size={16} color={theme.colors.text} />
                      <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
                        Mark Done
                      </Text>
                    </NeumorphicButton>
                  </>
                ) : (
                  <NeumorphicButton
                    variant="secondary"
                    size="sm"
                    onPress={() => handleStartRevision(item)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="refresh" size={16} color={theme.colors.text} />
                    <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
                      Review Again
                    </Text>
                  </NeumorphicButton>
                )}
              </View>
            </NeumorphicCard>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  statsCard: {
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  itemsList: {
    gap: 16,
  },
  itemCard: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  courseName: {
    fontSize: 12,
  },
  itemContent: {
    gap: 12,
    marginBottom: 16,
  },
  progressContainer: {
    gap: 4,
  },
  progressLabel: {
    fontSize: 12,
  },
  progressBar: {
    height: 6,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
  },
  lastReviewedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastReviewedText: {
    fontSize: 12,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default RevisionHubScreen;
