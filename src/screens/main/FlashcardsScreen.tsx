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
  Modal
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useCourse } from '../../contexts/CourseContext';
import { NeumorphicCard, NeumorphicButton, NeumorphicInput } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';
import { FlashcardSet, Flashcard, StudyStats } from '../../types/flashcard';
import { 
  getFlashcardSets, 
  createFlashcardSet, 
  getFlashcardsBySet,
  generateFlashcards,
  getStudyStats 
} from '../../services/flashcardService';

interface FlashcardsScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const FlashcardsScreen: React.FC<FlashcardsScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const { courses, coursesLoading, loadCourses } = useCourse();
  
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [studyStats, setStudyStats] = useState<StudyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetDescription, setNewSetDescription] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadCourses();
    loadFlashcardSets();
    loadStudyStats();
  }, []);

  const loadFlashcardSets = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Get actual user ID from auth context
      const userId = 'temp_user_id';
      const sets = await getFlashcardSets(userId, selectedCourse || undefined);
      setFlashcardSets(sets);
    } catch (err: any) {
      setError(err.message || 'Failed to load flashcard sets');
    } finally {
      setLoading(false);
    }
  };

  const loadStudyStats = async () => {
    try {
      // TODO: Get actual user ID from auth context
      const userId = 'temp_user_id';
      const stats = await getStudyStats(userId);
      setStudyStats(stats);
    } catch (err: any) {
      console.error('Failed to load study stats:', err);
    }
  };

  const handleCreateSet = async () => {
    if (!newSetName.trim()) {
      Alert.alert('Error', 'Please enter a set name');
      return;
    }

    try {
      setGenerating(true);
      // TODO: Get actual user ID from auth context
      const userId = 'temp_user_id';
      
      const setId = await createFlashcardSet(userId, {
        name: newSetName,
        description: newSetDescription,
        courseId: selectedCourse || undefined,
        flashcards: [],
        isPublic: false,
        createdBy: userId,
      });

      // Generate AI flashcards for the new set
      const course = courses.find(c => c.id === selectedCourse);
      const topic = newSetName;
      const aiFlashcards = await generateFlashcards(topic, 10, selectedCourse || undefined, course?.name);

      // TODO: Save AI-generated flashcards to the set
      console.log('Generated flashcards:', aiFlashcards);

      setNewSetName('');
      setNewSetDescription('');
      setShowCreateModal(false);
      await loadFlashcardSets();
      
      Alert.alert('Success', 'Flashcard set created successfully!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create flashcard set');
    } finally {
      setGenerating(false);
    }
  };

  const handleStartStudy = (setId: string) => {
    onNavigate?.('flashcard-study', { flashcardSetId: setId });
  };

  const renderFlashcardSet = (set: FlashcardSet) => (
    <NeumorphicCard key={set.id} style={styles.setCard} hoverable>
      <View style={styles.setHeader}>
        <View style={styles.setInfo}>
          <Text style={[styles.setTitle, { color: theme.colors.text }]}>
            {set.name}
          </Text>
          <Text style={[styles.setDescription, { color: theme.colors.textSecondary }]}>
            {set.description}
          </Text>
        </View>
        <View style={[styles.setStats, { backgroundColor: theme.colors.muted }]}>
          <Text style={[styles.statText, { color: theme.colors.text }]}>
            {set.flashcards.length} cards
          </Text>
        </View>
      </View>

      <View style={styles.setMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="book" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            {set.courseId ? courses.find(c => c.id === set.courseId)?.name || 'Unknown Course' : 'General'}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="people" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            {set.studyCount} studies
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="trophy" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            {set.averageScore}% avg
          </Text>
        </View>
      </View>

      <View style={styles.setActions}>
        <NeumorphicButton
          variant="primary"
          size="sm"
          onPress={() => handleStartStudy(set.id)}
          style={styles.studyButton}
        >
          <Ionicons name="play" size={16} color="white" />
          <Text style={styles.studyButtonText}>Study</Text>
        </NeumorphicButton>
        <NeumorphicButton
          variant="secondary"
          size="sm"
          style={styles.editButton}
        >
          <Ionicons name="create" size={16} color={theme.colors.text} />
        </NeumorphicButton>
      </View>
    </NeumorphicCard>
  );

  if (loading && flashcardSets.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading flashcards...
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
            onRefresh={loadFlashcardSets}
            tintColor={theme.colors.primary}
          />
        }
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>Flashcards</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Study with AI-generated flashcards
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

        {/* Study Stats */}
        {studyStats && (
          <NeumorphicCard style={styles.statsCard}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Study Progress</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.success }]}>
                  {studyStats.totalCards}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Total Cards
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.info }]}>
                  {studyStats.masteredCards}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Mastered
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.warning }]}>
                  {studyStats.cardsToReview}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  To Review
                </Text>
              </View>
            </View>
          </NeumorphicCard>
        )}

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
                  All Sets
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

        {/* Create New Set Button */}
        <NeumorphicButton
          variant="primary"
          size="lg"
          onPress={() => setShowCreateModal(true)}
          style={styles.createButton}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.createButtonText}>Create New Set</Text>
        </NeumorphicButton>

        {/* Flashcard Sets */}
        <View style={styles.setsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Your Sets ({flashcardSets.length})
          </Text>
          
          {flashcardSets.length === 0 ? (
            <NeumorphicCard style={styles.emptyCard}>
              <Ionicons name="library" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No Flashcard Sets
              </Text>
              <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
                Create your first flashcard set to start studying
              </Text>
            </NeumorphicCard>
          ) : (
            <View style={styles.setsList}>
              {flashcardSets.map(renderFlashcardSet)}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Create Set Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <NeumorphicCard style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Create New Flashcard Set
            </Text>
            
            <NeumorphicInput
              placeholder="Set Name"
              value={newSetName}
              onChangeText={setNewSetName}
              style={styles.modalInput}
            />
            
            <NeumorphicInput
              placeholder="Description (optional)"
              value={newSetDescription}
              onChangeText={setNewSetDescription}
              style={styles.modalInput}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.modalActions}>
              <NeumorphicButton
                variant="secondary"
                size="md"
                onPress={() => setShowCreateModal(false)}
                style={styles.modalButton}
              >
                Cancel
              </NeumorphicButton>
              <NeumorphicButton
                variant="primary"
                size="md"
                onPress={handleCreateSet}
                disabled={generating}
                style={styles.modalButton}
              >
                {generating ? 'Creating...' : 'Create Set'}
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
  createButton: {
    marginBottom: 24,
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
  setsContainer: {
    marginBottom: 24,
  },
  setsList: {
    gap: 16,
  },
  setCard: {
    padding: 16,
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  setInfo: {
    flex: 1,
    marginRight: 12,
  },
  setTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  setDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  setStats: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
  },
  setMeta: {
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
  setActions: {
    flexDirection: 'row',
    gap: 12,
  },
  studyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  studyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
    maxWidth: 400,
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
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
  },
});

export default FlashcardsScreen;