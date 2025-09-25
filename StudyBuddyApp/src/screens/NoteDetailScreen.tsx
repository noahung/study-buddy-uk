import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Edit3,
  Save,
  Share,
  MoreVertical,
  Tag,
  Calendar,
  Eye,
  Trash2,
  BookmarkPlus,
} from 'lucide-react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { theme, spacing, neumorphicShadow } from '../styles';

interface Props {
  onNavigate: (screen: string) => void;
}

const NoteDetailScreen: React.FC<Props> = ({ onNavigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [noteTitle, setNoteTitle] = useState('React State Management Patterns');
  const [noteContent, setNoteContent] = useState(`# React State Management Patterns

## Introduction
State management is one of the most crucial aspects of building scalable React applications. As applications grow in complexity, managing state becomes increasingly challenging.

## Key Patterns

### 1. Local Component State
- Use \`useState\` for simple, component-specific state
- Best for form inputs, toggles, and UI state
- Example:
\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

### 2. Lifting State Up
- Move state to the lowest common ancestor
- Useful when multiple components need the same state
- Pass down as props and pass up as callbacks

### 3. Context API
- Provides a way to pass data through component tree
- Avoids prop drilling
- Good for themes, user authentication, locale settings

### 4. Custom Hooks
- Extract stateful logic into reusable functions
- Promotes code reuse and separation of concerns
- Example:
\`\`\`jsx
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  return { count, increment, decrement };
}
\`\`\``);

  const [tags, setTags] = useState(['React', 'State Management', 'JavaScript']);
  const [newTag, setNewTag] = useState('');
  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to your backend/storage
    Alert.alert('Success', 'Note saved successfully!');
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Focus on title input when editing starts
    setTimeout(() => titleInputRef.current?.focus(), 100);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onNavigate('notes')
        }
      ]
    );
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimateReadingTime = () => {
    const wordsPerMinute = 200;
    const wordCount = noteContent.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => onNavigate('notes')}
            style={[styles.headerButton, neumorphicShadow.sm]}
          >
            <ArrowLeft size={20} color={theme.text.primary} />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            {isEditing ? (
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.saveButton, neumorphicShadow.sm]}
              >
                <Save size={18} color={theme.surface} />
                <Text variant="label" style={{
                  color: theme.surface,
                  marginLeft: spacing[2]
                }}>
                  Save
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.headerButton, neumorphicShadow.sm]}
                >
                  <Share size={18} color={theme.text.primary} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleEdit}
                  style={[styles.editButton, neumorphicShadow.sm]}
                >
                  <Edit3 size={18} color={theme.surface} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.headerButton, neumorphicShadow.sm]}
                >
                  <MoreVertical size={18} color={theme.text.primary} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Note Metadata */}
          <Card style={{
            ...styles.metadataCard,
            ...neumorphicShadow.md
          }}>
            <View style={styles.metadataRow}>
              <View style={styles.metadataItem}>
                <Calendar size={14} color={theme.text.secondary} />
                <Text variant="caption" style={styles.metadataText}>
                  {formatDate()}
                </Text>
              </View>
              
              <View style={styles.metadataItem}>
                <Eye size={14} color={theme.text.secondary} />
                <Text variant="caption" style={styles.metadataText}>
                  {estimateReadingTime()} min read
                </Text>
              </View>
            </View>
          </Card>

          {/* Title */}
          <Card style={{
            ...styles.titleCard,
            ...neumorphicShadow.lg
          }}>
            {isEditing ? (
              <TextInput
                ref={titleInputRef}
                style={styles.titleInput}
                value={noteTitle}
                onChangeText={setNoteTitle}
                placeholder="Note title..."
                placeholderTextColor={theme.text.secondary}
                multiline
              />
            ) : (
              <Text variant="h1" style={styles.titleText}>
                {noteTitle}
              </Text>
            )}
          </Card>

          {/* Tags */}
          <Card style={{
            ...styles.tagsCard,
            ...neumorphicShadow.md
          }}>
            <View style={styles.tagsHeader}>
              <View style={styles.tagsHeaderLeft}>
                <Tag size={16} color={theme.text.primary} />
                <Text variant="label" style={styles.tagsTitle}>
                  Tags
                </Text>
              </View>
              
              {isEditing && (
                <TouchableOpacity
                  onPress={() => setNewTag('')}
                  style={styles.addTagButton}
                >
                  <Text variant="caption" style={{ color: theme.primary }}>
                    Add Tag
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tag,
                    { backgroundColor: theme.primary + '15' }
                  ]}
                  onLongPress={isEditing ? () => removeTag(tag) : undefined}
                >
                  <Text
                    variant="caption"
                    style={{
                      color: theme.primary,
                      fontWeight: '600'
                    }}
                  >
                    #{tag}
                  </Text>
                  {isEditing && (
                    <TouchableOpacity
                      onPress={() => removeTag(tag)}
                      style={styles.removeTagButton}
                    >
                      <Text style={styles.removeTagText}>×</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
              
              {isEditing && (
                <View style={styles.addTagContainer}>
                  <TextInput
                    style={styles.tagInput}
                    value={newTag}
                    onChangeText={setNewTag}
                    placeholder="Add tag..."
                    placeholderTextColor={theme.text.secondary}
                    onSubmitEditing={addTag}
                    returnKeyType="done"
                  />
                </View>
              )}
            </View>
          </Card>

          {/* Content */}
          <Card style={{
            ...styles.contentCard,
            ...neumorphicShadow.lg
          }}>
            {isEditing ? (
              <TextInput
                ref={contentInputRef}
                style={styles.contentInput}
                value={noteContent}
                onChangeText={setNoteContent}
                placeholder="Start writing your note..."
                placeholderTextColor={theme.text.secondary}
                multiline
                textAlignVertical="top"
              />
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text variant="body" style={styles.contentText}>
                  {noteContent}
                </Text>
              </ScrollView>
            )}
          </Card>

          {/* Actions - only show when not editing */}
          {!isEditing && (
            <View style={styles.actionsContainer}>
              <Button
                onPress={() => {/* Add bookmark functionality */}}
                variant="secondary"
                style={styles.actionButton}
              >
                <BookmarkPlus size={16} color={theme.text.primary} />
                <Text variant="label" style={{
                  color: theme.text.primary,
                  marginLeft: spacing[2]
                }}>
                  Bookmark
                </Text>
              </Button>
              
              <Button
                onPress={handleDelete}
                style={{
                  ...styles.actionButton,
                  backgroundColor: '#ef4444'
                }}
              >
                <Trash2 size={16} color={theme.surface} />
                <Text variant="label" style={{
                  color: theme.surface,
                  marginLeft: spacing[2]
                }}>
                  Delete
                </Text>
              </Button>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[6],
    paddingTop: 0,
    paddingBottom: spacing[12],
  },
  metadataCard: {
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataText: {
    color: theme.text.secondary,
    marginLeft: spacing[2],
  },
  titleCard: {
    padding: spacing[6],
    marginBottom: spacing[4],
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.text.primary,
    textAlignVertical: 'top',
    minHeight: 60,
  },
  titleText: {
    color: theme.text.primary,
    lineHeight: 32,
  },
  tagsCard: {
    padding: spacing[5],
    marginBottom: spacing[4],
  },
  tagsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  tagsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagsTitle: {
    color: theme.text.primary,
    marginLeft: spacing[2],
  },
  addTagButton: {
    padding: spacing[1],
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 16,
  },
  removeTagButton: {
    marginLeft: spacing[2],
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeTagText: {
    color: theme.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  addTagContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  tagInput: {
    fontSize: 12,
    color: theme.text.primary,
    minWidth: 80,
  },
  contentCard: {
    padding: spacing[6],
    marginBottom: spacing[6],
    minHeight: 400,
  },
  contentInput: {
    fontSize: 16,
    color: theme.text.primary,
    lineHeight: 24,
    textAlignVertical: 'top',
    flex: 1,
    minHeight: 300,
  },
  contentText: {
    color: theme.text.primary,
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
  },
});

export default NoteDetailScreen;