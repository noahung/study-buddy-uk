import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useCourse } from '../../contexts/CourseContext';
import { NeumorphicCard, NeumorphicButton, NeumorphicInput } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';
import { Note, NoteStats } from '../../types/note';
import { 
  getNotes, 
  createNote, 
  updateNote,
  deleteNote,
  searchNotes,
  generateNoteSummary,
  generateNoteFromTopic,
  getNoteStats 
} from '../../services/noteService';

interface NotesScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const NotesScreen: React.FC<NotesScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const { courses, coursesLoading, loadCourses } = useCourse();
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteStats, setNoteStats] = useState<NoteStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadCourses();
    loadNotes();
    loadNoteStats();
  }, [selectedCourse]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Get actual user ID from auth context
      const userId = 'temp_user_id';
      const notesData = await getNotes(userId, selectedCourse || undefined);
      setNotes(notesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const loadNoteStats = async () => {
    try {
      // TODO: Get actual user ID from auth context
      const userId = 'temp_user_id';
      const stats = await getNoteStats(userId);
      setNoteStats(stats);
    } catch (err: any) {
      console.error('Failed to load note stats:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await loadNotes();
      return;
    }

    try {
      setLoading(true);
      // TODO: Get actual user ID from auth context
      const userId = 'temp_user_id';
      const searchResults = await searchNotes(userId, searchQuery, selectedCourse || undefined);
      setNotes(searchResults.map(result => result.note));
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      Alert.alert('Error', 'Please enter both title and content');
      return;
    }

    try {
      setGenerating(true);
      // TODO: Get actual user ID from auth context
      const userId = 'temp_user_id';
      
      const tags = newNoteTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await createNote(userId, {
        title: newNoteTitle,
        content: newNoteContent,
        courseId: selectedCourse || undefined,
        courseName: selectedCourse ? courses.find(c => c.id === selectedCourse)?.name : undefined,
        tags,
        isPublic: false,
        aiGenerated: false,
      });

      setNewNoteTitle('');
      setNewNoteContent('');
      setNewNoteTags('');
      setShowCreateModal(false);
      await loadNotes();
      await loadNoteStats();
      
      Alert.alert('Success', 'Note created successfully!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create note');
    } finally {
      setGenerating(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
    setNewNoteTags(note.tags.join(', '));
    setShowEditModal(true);
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !newNoteTitle.trim() || !newNoteContent.trim()) {
      Alert.alert('Error', 'Please enter both title and content');
      return;
    }

    try {
      setGenerating(true);
      const tags = newNoteTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await updateNote(editingNote.id, {
        title: newNoteTitle,
        content: newNoteContent,
        tags,
      });

      setShowEditModal(false);
      setEditingNote(null);
      setNewNoteTitle('');
      setNewNoteContent('');
      setNewNoteTags('');
      await loadNotes();
      await loadNoteStats();
      
      Alert.alert('Success', 'Note updated successfully!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update note');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
              await loadNotes();
              await loadNoteStats();
              Alert.alert('Success', 'Note deleted successfully!');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete note');
            }
          },
        },
      ]
    );
  };

  const handleGenerateSummary = async (noteId: string) => {
    try {
      setGenerating(true);
      const course = courses.find(c => c.id === selectedCourse);
      const summary = await generateNoteSummary(noteId, course?.name);
      Alert.alert('AI Summary', summary);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to generate summary');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateFromTopic = async () => {
    Alert.prompt(
      'Generate Note',
      'Enter a topic to generate AI-powered study notes:',
      async (topic) => {
        if (!topic?.trim()) return;

        try {
          setGenerating(true);
          // TODO: Get actual user ID from auth context
          const userId = 'temp_user_id';
          const course = courses.find(c => c.id === selectedCourse);
          
          await generateNoteFromTopic(userId, topic, selectedCourse || undefined, course?.name);
          await loadNotes();
          await loadNoteStats();
          
          Alert.alert('Success', 'AI-generated note created successfully!');
        } catch (err: any) {
          Alert.alert('Error', err.message || 'Failed to generate note');
        } finally {
          setGenerating(false);
        }
      }
    );
  };

  const renderNote = (note: Note) => (
    <NeumorphicCard key={note.id} style={styles.noteCard} hoverable>
      <View style={styles.noteHeader}>
        <View style={styles.noteInfo}>
          <Text style={[styles.noteTitle, { color: theme.colors.text }]}>
            {note.title}
          </Text>
          <Text style={[styles.noteMeta, { color: theme.colors.textSecondary }]}>
            {note.wordCount} words • {note.createdAt.toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.noteActions}>
          <TouchableOpacity
            onPress={() => handleEditNote(note)}
            style={styles.actionButton}
          >
            <Ionicons name="create" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteNote(note.id)}
            style={styles.actionButton}
          >
            <Ionicons name="trash" size={16} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.noteContent, { color: theme.colors.textSecondary }]} numberOfLines={3}>
        {note.content}
      </Text>

      {note.tags.length > 0 && (
        <View style={styles.noteTags}>
          {note.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: theme.colors.muted }]}>
              <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>
                {tag}
              </Text>
            </View>
          ))}
          {note.tags.length > 3 && (
            <Text style={[styles.moreTags, { color: theme.colors.textSecondary }]}>
              +{note.tags.length - 3} more
            </Text>
          )}
        </View>
      )}

      <View style={styles.noteFooter}>
        <View style={styles.footerLeft}>
          {note.aiGenerated && (
            <View style={[styles.aiBadge, { backgroundColor: theme.colors.info }]}>
              <Text style={styles.aiBadgeText}>AI</Text>
            </View>
          )}
          {note.courseName && (
            <Text style={[styles.courseName, { color: theme.colors.textSecondary }]}>
              {note.courseName}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleGenerateSummary(note.id)}
          style={styles.summaryButton}
        >
          <Ionicons name="sparkles" size={16} color={theme.colors.primary} />
          <Text style={[styles.summaryText, { color: theme.colors.primary }]}>
            Summarize
          </Text>
        </TouchableOpacity>
      </View>
    </NeumorphicCard>
  );

  if (loading && notes.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading notes...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadNotes}
            tintColor={theme.colors.primary}
          />
        }
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>My Notes</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Organize and study with your notes
        </Text>

        {error && (
          <NeumorphicCard style={styles.errorCard}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
            <NeumorphicButton 
              variant="secondary" 
              size="sm" 
              onPress={() => setError(null)}
              style={styles.errorButton}
            >
              Dismiss
            </NeumorphicButton>
          </NeumorphicCard>
        )}

        {/* Note Stats */}
        {noteStats && (
          <NeumorphicCard style={styles.statsCard}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Note Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.success }]}>
                  {noteStats.totalNotes}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Total Notes
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.info }]}>
                  {noteStats.totalWords}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Total Words
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.warning }]}>
                  {noteStats.averageWordsPerNote}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Avg Words
                </Text>
              </View>
            </View>
          </NeumorphicCard>
        )}

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <NeumorphicInput
            placeholder="Search notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            leftIcon="search"
            rightIcon="close"
            onRightIconPress={() => {
              setSearchQuery('');
              loadNotes();
            }}
          />
          <NeumorphicButton
            variant="secondary"
            size="md"
            onPress={handleSearch}
            style={styles.searchButton}
          >
            Search
          </NeumorphicButton>
        </View>

        {/* Course Filter */}
        <View style={styles.courseFilter}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Filter by Course
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.courseList}>
              <TouchableOpacity
                style={[
                  styles.courseCard,
                  !selectedCourse && styles.selectedCourse,
                  { backgroundColor: !selectedCourse ? theme.colors.primary : theme.colors.background }
                ]}
                onPress={() => setSelectedCourse(null)}
              >
                <Text style={[
                  styles.courseText,
                  { color: !selectedCourse ? theme.colors.background : theme.colors.text }
                ]}>
                  All Notes
                </Text>
              </TouchableOpacity>
              
              {courses.map((course) => (
                <TouchableOpacity
                  key={course.id}
                  style={[
                    styles.courseCard,
                    selectedCourse === course.id && styles.selectedCourse,
                    { backgroundColor: selectedCourse === course.id ? theme.colors.primary : theme.colors.background }
                  ]}
                  onPress={() => setSelectedCourse(course.id)}
                >
                  <Text style={[
                    styles.courseText,
                    { color: selectedCourse === course.id ? theme.colors.background : theme.colors.text }
                  ]}>
                    {course.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <NeumorphicButton
            variant="primary"
            size="lg"
            onPress={() => setShowCreateModal(true)}
            style={styles.createButton}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.createButtonText}>New Note</Text>
          </NeumorphicButton>
          
          <NeumorphicButton
            variant="info"
            size="lg"
            onPress={handleGenerateFromTopic}
            disabled={generating}
            style={styles.generateButton}
          >
            <Ionicons name="sparkles" size={20} color="white" />
            <Text style={styles.generateButtonText}>
              {generating ? 'Generating...' : 'AI Generate'}
            </Text>
          </NeumorphicButton>
        </View>

        {/* Notes List */}
        <View style={styles.notesContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {searchQuery ? `Search Results (${notes.length})` : `Your Notes (${notes.length})`}
          </Text>
          
          {notes.length === 0 ? (
            <NeumorphicCard style={styles.emptyCard}>
              <Ionicons name="document-text" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                {searchQuery ? 'No matching notes' : 'No Notes Yet'}
              </Text>
              <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
                {searchQuery ? 'Try a different search term' : 'Create your first note to get started'}
              </Text>
            </NeumorphicCard>
          ) : (
            <View style={styles.notesList}>
              {notes.map(renderNote)}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Create/Edit Note Modal */}
      <Modal
        visible={showCreateModal || showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          setEditingNote(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <NeumorphicCard style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {showEditModal ? 'Edit Note' : 'Create New Note'}
            </Text>
            
            <NeumorphicInput
              placeholder="Note Title"
              value={newNoteTitle}
              onChangeText={setNewNoteTitle}
              style={styles.modalInput}
            />
            
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border 
              }]}
              placeholder="Note Content"
              value={newNoteContent}
              onChangeText={setNewNoteContent}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
            
            <NeumorphicInput
              placeholder="Tags (comma separated)"
              value={newNoteTags}
              onChangeText={setNewNoteTags}
              style={styles.modalInput}
            />
            
            <View style={styles.modalActions}>
              <NeumorphicButton
                variant="secondary"
                size="md"
                onPress={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setEditingNote(null);
                  setNewNoteTitle('');
                  setNewNoteContent('');
                  setNewNoteTags('');
                }}
                style={styles.modalButton}
              >
                Cancel
              </NeumorphicButton>
              <NeumorphicButton
                variant="primary"
                size="md"
                onPress={showEditModal ? handleUpdateNote : handleCreateNote}
                disabled={generating}
                style={styles.modalButton}
              >
                {generating ? 'Saving...' : (showEditModal ? 'Update' : 'Create')}
              </NeumorphicButton>
            </View>
          </NeumorphicCard>
        </View>
      </Modal>
    </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  errorCard: {
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    marginRight: 12,
  },
  errorButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statsCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
  },
  searchButton: {
    paddingHorizontal: 16,
  },
  courseFilter: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  courseList: {
    flexDirection: 'row',
    gap: 12,
  },
  courseCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  selectedCourse: {
    // Additional styles for selected state
  },
  courseText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  createButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  generateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  notesContainer: {
    marginBottom: 24,
  },
  notesList: {
    gap: 16,
  },
  noteCard: {
    padding: 16,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noteInfo: {
    flex: 1,
    marginRight: 12,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  noteMeta: {
    fontSize: 12,
  },
  noteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  noteTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
  },
  moreTags: {
    fontSize: 10,
    alignSelf: 'center',
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aiBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  courseName: {
    fontSize: 12,
  },
  summaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    minHeight: 120,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
  },
});

export default NotesScreen;