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
import { useCourse } from '../../contexts/CourseContext';
import { NeumorphicCard, NeumorphicButton } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';
import { Course, CourseCategory } from '../../types/course';

const CourseSelectionScreen: React.FC = () => {
  const { theme } = useTheme();
  const { 
    categories, 
    categoriesLoading, 
    courses, 
    coursesLoading, 
    loadCategories, 
    loadCourses,
    error,
    clearError 
  } = useCourse();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCategories();
    loadCourses();
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    loadCourses(categoryId === selectedCategory ? undefined : categoryId);
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'finance & banking': return 'card';
      case 'project management': return 'trending-up';
      case 'it & cybersecurity': return 'shield-checkmark';
      case 'hr & business': return 'people';
      case 'health & safety': return 'medical';
      default: return 'book';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return theme.colors.success;
      case 'intermediate': return theme.colors.warning;
      case 'advanced': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const renderCourseCard = (course: Course) => (
    <NeumorphicCard key={course.id} style={styles.courseCard} hoverable>
      <View style={styles.courseHeader}>
        <View style={styles.courseInfo}>
          <Text style={[styles.courseTitle, { color: theme.colors.text }]}>
            {course.name}
          </Text>
          <Text style={[styles.courseDescription, { color: theme.colors.textSecondary }]}>
            {course.description}
          </Text>
        </View>
        {course.isPremium && (
          <View style={[styles.premiumBadge, { backgroundColor: theme.colors.warning }]}>
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
      </View>

      <View style={styles.courseMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            {course.duration}h
          </Text>
        </View>
        <View style={styles.metaItem}>
          <View style={[
            styles.difficultyDot, 
            { backgroundColor: getDifficultyColor(course.difficulty) }
          ]} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            {course.difficulty}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="people" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            {course.tags.length} topics
          </Text>
        </View>
      </View>

      <View style={styles.courseTags}>
        {course.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={[styles.tag, { backgroundColor: theme.colors.muted }]}>
            <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>
              {tag}
            </Text>
          </View>
        ))}
        {course.tags.length > 3 && (
          <Text style={[styles.moreTags, { color: theme.colors.textSecondary }]}>
            +{course.tags.length - 3} more
          </Text>
        )}
      </View>

      <View style={styles.courseActions}>
        <NeumorphicButton
          variant="primary"
          size="sm"
          style={styles.enrollButton}
        >
          {course.isPremium ? 'Upgrade to Access' : 'Start Course'}
        </NeumorphicButton>
        <NeumorphicButton
          variant="secondary"
          size="sm"
          style={styles.infoButton}
        >
          <Ionicons name="information-circle" size={16} color={theme.colors.text} />
        </NeumorphicButton>
      </View>
    </NeumorphicCard>
  );

  if (categoriesLoading && categories.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading courses...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={categoriesLoading || coursesLoading}
          onRefresh={() => {
            loadCategories();
            loadCourses(selectedCategory || undefined);
          }}
          tintColor={theme.colors.primary}
        />
      }
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Choose Your Course
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Select a course to start your learning journey
      </Text>

      {error && (
        <NeumorphicCard style={styles.errorCard}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
          <NeumorphicButton 
            variant="secondary" 
            size="sm" 
            onPress={clearError}
            style={styles.errorButton}
          >
            Dismiss
          </NeumorphicButton>
        </NeumorphicCard>
      )}

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Categories
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoriesList}>
            <TouchableOpacity
              style={[
                styles.categoryCard,
                !selectedCategory && styles.selectedCategory,
                { backgroundColor: !selectedCategory ? theme.colors.primary : theme.colors.background }
              ]}
              onPress={() => handleCategorySelect('all')}
            >
              <Ionicons 
                name="grid" 
                size={20} 
                color={!selectedCategory ? theme.colors.background : theme.colors.text} 
              />
              <Text style={[
                styles.categoryText,
                { color: !selectedCategory ? theme.colors.background : theme.colors.text }
              ]}>
                All
              </Text>
            </TouchableOpacity>
            
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.selectedCategory,
                  { backgroundColor: selectedCategory === category.id ? theme.colors.primary : theme.colors.background }
                ]}
                onPress={() => handleCategorySelect(category.id)}
              >
                <Ionicons 
                  name={getCategoryIcon(category.name) as any} 
                  size={20} 
                  color={selectedCategory === category.id ? theme.colors.background : theme.colors.text} 
                />
                <Text style={[
                  styles.categoryText,
                  { color: selectedCategory === category.id ? theme.colors.background : theme.colors.text }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Courses */}
      <View style={styles.coursesContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {selectedCategory ? 
            categories.find(c => c.id === selectedCategory)?.name : 
            'All Courses'
          } ({filteredCourses.length})
        </Text>
        
        {coursesLoading ? (
          <View style={styles.loadingCourses}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Loading courses...
            </Text>
          </View>
        ) : (
          <View style={styles.coursesList}>
            {filteredCourses.map(renderCourseCard)}
          </View>
        )}
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
  categoriesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoriesList: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  selectedCategory: {
    // Additional styles for selected state
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  coursesContainer: {
    marginBottom: 24,
  },
  loadingCourses: {
    alignItems: 'center',
    padding: 32,
  },
  coursesList: {
    gap: 16,
  },
  courseCard: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseInfo: {
    flex: 1,
    marginRight: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  premiumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  premiumText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  courseMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  courseTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
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
  courseActions: {
    flexDirection: 'row',
    gap: 12,
  },
  enrollButton: {
    flex: 1,
  },
  infoButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CourseSelectionScreen;
