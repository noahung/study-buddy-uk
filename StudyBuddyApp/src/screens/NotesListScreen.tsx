import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Plus,
  Calendar,
  Tag,
  MoreVertical,
  Edit,
  FileText,
} from 'lucide-react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { theme, spacing, neumorphicShadow } from '../styles';

interface Props {
  onNavigate: (screen: string) => void;
  onOpenSidebar: () => void;
}

interface Note {
  id: number;
  title: string;
  preview: string;
  content: string;
  lastModified: string;
  tags: string[];
  color: string;
}

const { width } = Dimensions.get('window');

const NotesListScreen: React.FC<Props> = ({ onNavigate, onOpenSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<number | null>(null);

  const notes: Note[] = [
    {
      id: 1,
      title: 'React Hooks Essentials',
      preview: 'useState and useEffect are the most commonly used hooks in React applications...',
      content: 'Full content about React hooks including examples and best practices.',
      lastModified: '2 hours ago',
      tags: ['React', 'JavaScript', 'Hooks'],
      color: '#3b82f6'
    },
    {
      id: 2,
      title: 'CSS Grid vs Flexbox',
      preview: 'Understanding when to use CSS Grid and when to use Flexbox for layouts...',
      content: 'Detailed comparison between CSS Grid and Flexbox with practical examples.',
      lastModified: '1 day ago',
      tags: ['CSS', 'Layout', 'Design'],
      color: '#8b5cf6'
    },
    {
      id: 3,
      title: 'JavaScript Async/Await',
      preview: 'Modern approach to handling asynchronous operations in JavaScript...',
      content: 'Complete guide to async/await including error handling and best practices.',
      lastModified: '3 days ago',
      tags: ['JavaScript', 'Async', 'Promises'],
      color: '#10b981'
    },
    {
      id: 4,
      title: 'Node.js Performance Tips',
      preview: 'Optimizing Node.js applications for better performance and scalability...',
      content: 'Performance optimization techniques for Node.js backend applications.',
      lastModified: '1 week ago',
      tags: ['Node.js', 'Performance', 'Backend'],
      color: '#f59e0b'
    },
    {
      id: 5,
      title: 'TypeScript Best Practices',
      preview: 'Essential TypeScript patterns and conventions for better code quality...',
      content: 'Comprehensive guide to writing maintainable TypeScript code with examples.',
      lastModified: '2 weeks ago',
      tags: ['TypeScript', 'Best Practices', 'Types'],
      color: '#ef4444'
    },
    {
      id: 6,
      title: 'React Native Navigation',
      preview: 'Complete guide to navigation in React Native applications using React Navigation...',
      content: 'Step-by-step tutorial on implementing navigation in React Native apps.',
      lastModified: '3 weeks ago',
      tags: ['React Native', 'Navigation', 'Mobile'],
      color: '#06b6d4'
    }
  ];

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderNoteCard = (note: Note) => (
    <TouchableOpacity
      key={note.id}
      style={styles.noteCard}
      onPress={() => onNavigate('note-detail')}
      activeOpacity={0.8}
    >
      <Card style={[styles.cardContent, neumorphicShadow.lg]}>
        {/* Color stripe */}
        <View style={[
          styles.colorStripe,
          { backgroundColor: note.color }
        ]} />
        
        {/* Note Header */}
        <View style={styles.noteHeader}>
          <View style={styles.noteInfo}>
            <Text variant="h3" style={styles.noteTitle} numberOfLines={2}>
              {note.title}
            </Text>
            <Text variant="caption" style={styles.lastModified}>
              <Calendar size={12} color={theme.text.secondary} />
              {' '}{note.lastModified}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={16} color={theme.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Note Preview */}
        <Text variant="body" style={styles.notePreview} numberOfLines={3}>
          {note.preview}
        </Text>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsScrollContent}
          >
            {note.tags.slice(0, 3).map((tag, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  { backgroundColor: note.color + '20' }
                ]}
              >
                <Text
                  variant="caption"
                  style={{
                    color: note.color,
                    fontSize: 10,
                    fontWeight: '600'
                  }}
                >
                  {tag}
                </Text>
              </View>
            ))}
            {note.tags.length > 3 && (
              <View style={[styles.tag, styles.moreTag]}>
                <Text variant="caption" style={styles.moreTagText}>
                  +{note.tags.length - 3}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, neumorphicShadow.sm]}
            onPress={() => onNavigate('note-detail')}
          >
            <Edit size={14} color={theme.primary} />
            <Text variant="caption" style={{
              color: theme.primary,
              marginLeft: 4,
              fontWeight: '600'
            }}>
              Edit
            </Text>
          </TouchableOpacity>
          
          <View style={styles.noteStats}>
            <FileText size={12} color={theme.text.secondary} />
            <Text variant="caption" style={{
              color: theme.text.secondary,
              marginLeft: 4
            }}>
              {Math.floor(note.content.length / 100)} min read
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate('dashboard')}
          style={[styles.backButton, neumorphicShadow.sm]}
        >
          <ArrowLeft size={20} color={theme.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerText}>
          <Text variant="h2" style={{ color: theme.text.primary }}>
            Notes
          </Text>
          <Text variant="caption" style={{ color: theme.text.secondary }}>
            {filteredNotes.length} notes
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.addButton, neumorphicShadow.sm]}
          onPress={() => onNavigate('note-detail')}
        >
          <Plus size={20} color={theme.surface} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, neumorphicShadow.md]}>
          <Search size={20} color={theme.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes and tags..."
            placeholderTextColor={theme.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Notes List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotes.length > 0 ? (
          <View style={styles.notesContainer}>
            {filteredNotes.map(renderNoteCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <FileText size={48} color={theme.text.secondary} style={{ opacity: 0.5 }} />
            <Text variant="h3" style={{
              color: theme.text.secondary,
              marginTop: spacing[4],
              marginBottom: spacing[2]
            }}>
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </Text>
            <Text variant="body" style={{
              color: theme.text.secondary,
              textAlign: 'center',
              marginBottom: spacing[6]
            }}>
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'Create your first note to get started'
              }
            </Text>
            {!searchQuery && (
              <Button
                onPress={() => onNavigate('note-detail')}
                style={styles.createFirstButton}
              >
                <Plus size={16} color={theme.surface} />
                <Text variant="label" style={{
                  color: theme.surface,
                  marginLeft: spacing[2]
                }}>
                  Create Note
                </Text>
              </Button>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[4],
  },
  headerText: {
    flex: 1,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 12,
    paddingHorizontal: spacing[4],
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing[3],
    fontSize: 16,
    color: theme.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[6],
    paddingTop: 0,
  },
  notesContainer: {
    gap: spacing[4],
  },
  noteCard: {
    marginBottom: spacing[2],
  },
  cardContent: {
    padding: spacing[5],
    position: 'relative',
  },
  colorStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
    paddingTop: spacing[2],
  },
  noteInfo: {
    flex: 1,
    marginRight: spacing[3],
  },
  noteTitle: {
    color: theme.text.primary,
    marginBottom: spacing[1],
    lineHeight: 20,
  },
  lastModified: {
    color: theme.text.secondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreButton: {
    padding: spacing[1],
  },
  notePreview: {
    color: theme.text.secondary,
    lineHeight: 20,
    marginBottom: spacing[4],
  },
  tagsContainer: {
    marginBottom: spacing[4],
    maxHeight: 24,
  },
  tagsScrollContent: {
    gap: spacing[2],
  },
  tag: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  moreTag: {
    backgroundColor: '#f3f4f6',
  },
  moreTagText: {
    color: theme.text.secondary,
    fontSize: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary + '10',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 8,
  },
  noteStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[16],
    paddingHorizontal: spacing[8],
  },
  createFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
  },
});

export default NotesListScreen;