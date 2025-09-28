import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { NeumorphicCard, NeumorphicButton, NeumorphicInput } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';

interface NoteEditorScreenProps {
  noteId?: string;
  mode: 'create' | 'edit';
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
}

const NoteEditorScreen: React.FC<NoteEditorScreenProps> = ({ 
  noteId, 
  mode,
  onNavigate, 
  onGoBack 
}) => {
  const { theme } = useTheme();
  const [note, setNote] = useState<Note>({
    id: noteId || '',
    title: '',
    content: '',
    courseId: 'course1',
    courseName: 'Financial Planning Basics',
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && noteId) {
      loadNote();
    }
  }, [mode, noteId]);

  const loadNote = async () => {
    try {
      setLoading(true);
      // TODO: Load note from API
      const mockNote: Note = {
        id: noteId!,
        title: 'Financial Planning Fundamentals',
        content: '# Financial Planning Fundamentals\n\n## Introduction\nFinancial planning is the process...',
        courseId: 'course1',
        courseName: 'Financial Planning Basics',
        tags: ['financial-planning', 'budgeting']
      };
      setNote(mockNote);
    } catch (error) {
      Alert.alert('Error', 'Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    try {
      setSaving(true);
      // TODO: Save note to API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      Alert.alert('Success', 'Note saved successfully!', [
        { text: 'OK', onPress: onGoBack }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!note.title.trim()) {
      Alert.alert('Error', 'Please enter a title first');
      return;
    }

    try {
      setIsGenerating(true);
      // TODO: Generate content using AI
      const mockContent = `# ${note.title}

## Overview
This note covers the key concepts and principles related to ${note.title.toLowerCase()}.

## Key Points
- Important concept 1
- Important concept 2
- Important concept 3

## Detailed Explanation
[AI-generated content would appear here based on the title and course context]

## Summary
[AI-generated summary would appear here]`;
      
      setNote(prev => ({ ...prev, content: mockContent }));
    } catch (error) {
      Alert.alert('Error', 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !note.tags.includes(newTag.trim())) {
      setNote(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNote(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleDiscard = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: onGoBack }
      ]
    );
  };

  const getWordCount = () => {
    return note.content.split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadingTime = () => {
    const wordsPerMinute = 200;
    const wordCount = getWordCount();
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
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

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <NeumorphicCard style={styles.headerCard}>
          <View style={styles.headerTop}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {mode === 'create' ? 'Create Note' : 'Edit Note'}
            </Text>
            <Text style={[styles.courseName, { color: theme.colors.textSecondary }]}>
              {note.courseName}
            </Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {getWordCount()}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Words
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.info }]}>
                {getReadingTime()}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Min Read
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.success }]}>
                {note.tags.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Tags
              </Text>
            </View>
          </View>
        </NeumorphicCard>

        {/* Title Input */}
        <NeumorphicCard style={styles.inputCard}>
          <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
            Note Title
          </Text>
          <NeumorphicInput
            placeholder="Enter note title..."
            value={note.title}
            onChangeText={(text) => setNote(prev => ({ ...prev, title: text }))}
            style={styles.titleInput}
          />
        </NeumorphicCard>

        {/* Tags */}
        <NeumorphicCard style={styles.tagsCard}>
          <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
            Tags
          </Text>
          
          <View style={styles.tagsContainer}>
            {note.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: theme.colors.primary + '20' }]}>
                <Text style={[styles.tagText, { color: theme.colors.primary }]}>
                  #{tag}
                </Text>
                <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                  <Ionicons name="close" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.addTagContainer}>
            <NeumorphicInput
              placeholder="Add tag..."
              value={newTag}
              onChangeText={setNewTag}
              style={styles.tagInput}
              onSubmitEditing={handleAddTag}
            />
            <NeumorphicButton
              variant="secondary"
              size="sm"
              onPress={handleAddTag}
              style={styles.addTagButton}
            >
              <Ionicons name="add" size={16} color={theme.colors.text} />
            </NeumorphicButton>
          </View>
        </NeumorphicCard>

        {/* Content Input */}
        <NeumorphicCard style={styles.contentCard}>
          <View style={styles.contentHeader}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              Note Content
            </Text>
            <NeumorphicButton
              variant="secondary"
              size="sm"
              onPress={handleGenerateContent}
              style={styles.generateButton}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <ActivityIndicator size="small" color={theme.colors.text} />
              ) : (
                <Ionicons name="sparkles" size={16} color={theme.colors.text} />
              )}
              <Text style={[styles.generateText, { color: theme.colors.text }]}>
                {isGenerating ? 'Generating...' : 'AI Generate'}
              </Text>
            </NeumorphicButton>
          </View>
          
          <NeumorphicInput
            placeholder="Write your note content here...\n\nYou can use Markdown formatting:\n# Headers\n**Bold text**\n*Italic text*\n- Bullet points\n1. Numbered lists"
            value={note.content}
            onChangeText={(text) => setNote(prev => ({ ...prev, content: text }))}
            style={styles.contentInput}
            multiline
            textAlignVertical="top"
          />
        </NeumorphicCard>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <NeumorphicButton
            variant="secondary"
            size="lg"
            onPress={handleDiscard}
            style={styles.actionButton}
          >
            <Ionicons name="close" size={20} color={theme.colors.text} />
            <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
              Discard
            </Text>
          </NeumorphicButton>

          <NeumorphicButton
            variant="primary"
            size="lg"
            onPress={handleSave}
            style={styles.actionButton}
            disabled={saving || !note.title.trim() || !note.content.trim()}
          >
            {saving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="save" size={20} color="white" />
            )}
            <Text style={styles.actionButtonText}>
              {saving ? 'Saving...' : 'Save Note'}
            </Text>
          </NeumorphicButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
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
  headerCard: {
    padding: 20,
    marginBottom: 16,
  },
  headerTop: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  courseName: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  inputCard: {
    padding: 20,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  titleInput: {
    fontSize: 18,
  },
  tagsCard: {
    padding: 20,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addTagContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tagInput: {
    flex: 1,
  },
  addTagButton: {
    paddingHorizontal: 12,
  },
  contentCard: {
    padding: 20,
    marginBottom: 24,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  generateText: {
    fontSize: 12,
    fontWeight: '600',
  },
  contentInput: {
    minHeight: 300,
    fontSize: 16,
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
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

export default NoteEditorScreen;
