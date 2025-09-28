import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { NeumorphicCard, NeumorphicButton } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';

interface NoteDetailScreenProps {
  noteId: string;
  onNavigate?: (screen: string, params?: any) => void;
  onGoBack?: () => void;
}

interface Note {
  id: string;
  title: string;
  content: string;
  courseId: string;
  courseName: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  wordCount: number;
  readingTime: number; // in minutes
}

const NoteDetailScreen: React.FC<NoteDetailScreenProps> = ({ 
  noteId, 
  onNavigate, 
  onGoBack 
}) => {
  const { theme } = useTheme();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string>('');

  useEffect(() => {
    loadNote();
  }, [noteId]);

  const loadNote = async () => {
    try {
      setLoading(true);
      // TODO: Load note from API
      const mockNote: Note = {
        id: noteId,
        title: 'Financial Planning Fundamentals',
        content: `# Financial Planning Fundamentals

## Introduction
Financial planning is the process of creating a comprehensive strategy to manage your financial resources to achieve your life goals. It involves analyzing your current financial situation, setting realistic goals, and developing a roadmap to reach those goals.

## Key Components

### 1. Budgeting and Cash Flow Management
- Track income and expenses
- Create a realistic budget
- Build an emergency fund (3-6 months of expenses)
- Monitor cash flow regularly

### 2. Investment Planning
- Asset allocation strategies
- Risk tolerance assessment
- Diversification principles
- Long-term vs short-term investments

### 3. Retirement Planning
- 401(k) and IRA contributions
- Social Security optimization
- Pension planning
- Healthcare costs in retirement

### 4. Insurance Planning
- Life insurance needs
- Disability insurance
- Health insurance
- Property and casualty insurance

### 5. Tax Planning
- Tax-efficient investment strategies
- Retirement account contributions
- Tax-loss harvesting
- Estate planning considerations

## Best Practices
- Review and update your plan annually
- Work with qualified professionals
- Stay informed about tax law changes
- Maintain adequate emergency funds
- Diversify your investments

## Conclusion
A well-structured financial plan provides a roadmap for achieving your financial goals while managing risks and optimizing tax efficiency.`,
        courseId: 'course1',
        courseName: 'Financial Planning Basics',
        tags: ['financial-planning', 'budgeting', 'investments', 'retirement'],
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        isFavorite: false,
        wordCount: 245,
        readingTime: 2
      };

      setNote(mockNote);
    } catch (error) {
      Alert.alert('Error', 'Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNote = () => {
    onNavigate?.('note-editor', { noteId, mode: 'edit' });
  };

  const handleDeleteNote = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          // TODO: Delete note
          onGoBack?.();
        }}
      ]
    );
  };

  const handleToggleFavorite = () => {
    if (note) {
      setNote(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
      // TODO: Update favorite status in API
    }
  };

  const handleGenerateSummary = async () => {
    if (!note) return;
    
    setIsSummarizing(true);
    try {
      // TODO: Generate summary using AI
      const mockSummary = "This note covers the fundamentals of financial planning, including budgeting, investment planning, retirement planning, insurance, and tax strategies. It emphasizes the importance of creating a comprehensive financial roadmap, diversifying investments, and regularly reviewing your plan. Key takeaways include building emergency funds, working with professionals, and staying informed about tax changes.";
      setSummary(mockSummary);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate summary');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleShareNote = () => {
    // TODO: Implement sharing functionality
    Alert.alert('Share', 'Note sharing feature coming soon!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading note...
        </Text>
      </View>
    );
  }

  if (!note) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="document-text" size={48} color={theme.colors.error} />
        <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
          Note Not Found
        </Text>
        <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
          The requested note could not be found.
        </Text>
        <NeumorphicButton onPress={onGoBack} style={styles.backButton}>
          Go Back
        </NeumorphicButton>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <NeumorphicCard style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View style={styles.titleContainer}>
            <Text style={[styles.noteTitle, { color: theme.colors.text }]}>
              {note.title}
            </Text>
            <Text style={[styles.courseName, { color: theme.colors.textSecondary }]}>
              {note.courseName}
            </Text>
          </View>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
            <Ionicons 
              name={note.isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={note.isFavorite ? theme.colors.error : theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={14} color={theme.colors.textSecondary} />
            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
              {note.readingTime} min read
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="document" size={14} color={theme.colors.textSecondary} />
            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
              {note.wordCount} words
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="calendar" size={14} color={theme.colors.textSecondary} />
            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
              {formatDate(note.updatedAt)}
            </Text>
          </View>
        </View>

        {note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {note.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        )}
      </NeumorphicCard>

      {/* AI Summary */}
      {summary && (
        <NeumorphicCard style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="bulb" size={20} color={theme.colors.info} />
            <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>
              AI Summary
            </Text>
          </View>
          <Text style={[styles.summaryText, { color: theme.colors.text }]}>
            {summary}
          </Text>
        </NeumorphicCard>
      )}

      {/* Note Content */}
      <NeumorphicCard style={styles.contentCard}>
        <Text style={[styles.contentText, { color: theme.colors.text }]}>
          {note.content}
        </Text>
      </NeumorphicCard>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <NeumorphicButton
          variant="primary"
          size="lg"
          onPress={handleEditNote}
          style={styles.actionButton}
        >
          <Ionicons name="create" size={20} color="white" />
          <Text style={styles.actionButtonText}>Edit Note</Text>
        </NeumorphicButton>

        <NeumorphicButton
          variant="secondary"
          size="lg"
          onPress={handleGenerateSummary}
          style={styles.actionButton}
          disabled={isSummarizing}
        >
          {isSummarizing ? (
            <ActivityIndicator size="small" color={theme.colors.text} />
          ) : (
            <Ionicons name="bulb" size={20} color={theme.colors.text} />
          )}
          <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
            {isSummarizing ? 'Generating...' : 'AI Summary'}
          </Text>
        </NeumorphicButton>

        <NeumorphicButton
          variant="secondary"
          size="lg"
          onPress={handleShareNote}
          style={styles.actionButton}
        >
          <Ionicons name="share" size={20} color={theme.colors.text} />
          <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
            Share
          </Text>
        </NeumorphicButton>

        <NeumorphicButton
          variant="error"
          size="lg"
          onPress={handleDeleteNote}
          style={styles.actionButton}
        >
          <Ionicons name="trash" size={20} color="white" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </NeumorphicButton>
      </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  headerCard: {
    padding: 20,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  noteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  courseName: {
    fontSize: 14,
  },
  favoriteButton: {
    padding: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
  },
  summaryCard: {
    padding: 20,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
  },
  contentCard: {
    padding: 20,
    marginBottom: 24,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 26,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NoteDetailScreen;
