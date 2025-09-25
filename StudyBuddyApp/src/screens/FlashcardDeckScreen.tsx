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
  Grid,
  List,
  Play,
  Star,
  Lock,
  TrendingUp,
} from 'lucide-react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { theme, spacing, neumorphicShadow } from '../styles';

interface Props {
  onNavigate: (screen: string) => void;
  onOpenSidebar: () => void;
}

interface FlashcardDeck {
  id: number;
  title: string;
  description: string;
  cardCount: number;
  studyStreak: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isPremium: boolean;
  progress: number;
  color: string;
}

const { width } = Dimensions.get('window');

const FlashcardDeckScreen: React.FC<Props> = ({ onNavigate, onOpenSidebar }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const flashcardDecks: FlashcardDeck[] = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      description: 'Variables, functions, and basic concepts',
      cardCount: 45,
      studyStreak: 7,
      difficulty: 'Beginner',
      isPremium: false,
      progress: 78,
      color: '#f59e0b'
    },
    {
      id: 2,
      title: 'React Hooks Deep Dive',
      description: 'useState, useEffect, custom hooks',
      cardCount: 32,
      studyStreak: 3,
      difficulty: 'Intermediate',
      isPremium: false,
      progress: 45,
      color: '#3b82f6'
    },
    {
      id: 3,
      title: 'Advanced CSS Techniques',
      description: 'Grid, Flexbox, animations, and more',
      cardCount: 28,
      studyStreak: 0,
      difficulty: 'Advanced',
      isPremium: true,
      progress: 0,
      color: '#8b5cf6'
    },
    {
      id: 4,
      title: 'Node.js Backend Essentials',
      description: 'Express, middleware, database integration',
      cardCount: 56,
      studyStreak: 0,
      difficulty: 'Intermediate',
      isPremium: true,
      progress: 0,
      color: '#10b981'
    },
    {
      id: 5,
      title: 'TypeScript Essentials',
      description: 'Types, interfaces, and advanced features',
      cardCount: 38,
      studyStreak: 12,
      difficulty: 'Intermediate',
      isPremium: false,
      progress: 92,
      color: '#06b6d4'
    },
    {
      id: 6,
      title: 'React Native Components',
      description: 'Mobile app development fundamentals',
      cardCount: 41,
      studyStreak: 5,
      difficulty: 'Intermediate',
      isPremium: false,
      progress: 63,
      color: '#ef4444'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return { bg: '#dcfce7', text: '#166534' };
      case 'Intermediate': return { bg: '#fed7aa', text: '#9a3412' };
      case 'Advanced': return { bg: '#fecaca', text: '#991b1b' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const filteredDecks = flashcardDecks.filter(deck =>
    deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDeckCard = (deck: FlashcardDeck) => {
    const difficultyColors = getDifficultyColor(deck.difficulty);
    
    return (
      <TouchableOpacity
        key={deck.id}
        style={[
          styles.deckCard,
          viewMode === 'list' && styles.listCard,
          neumorphicShadow.lg
        ]}
        onPress={() => onNavigate('flashcard-study')}
        activeOpacity={0.8}
      >
        <Card style={styles.cardContent}>
          {/* Header with play button and premium badge */}
          <View style={styles.cardHeader}>
            <View style={[
              styles.colorStripe,
              { backgroundColor: deck.color }
            ]} />
            
            <View style={styles.headerContent}>
              <TouchableOpacity
                style={[
                  styles.playButton,
                  { backgroundColor: deck.color },
                  neumorphicShadow.sm
                ]}
                onPress={() => onNavigate('flashcard-study')}
              >
                <Play size={16} color={theme.surface} />
              </TouchableOpacity>
              
              {deck.isPremium && (
                <View style={styles.premiumBadge}>
                  <Lock size={12} color="#f59e0b" />
                </View>
              )}
            </View>
          </View>

          {/* Title and Description */}
          <View style={styles.cardBody}>
            <Text variant="h3" style={styles.deckTitle} numberOfLines={2}>
              {deck.title}
            </Text>
            <Text variant="body" style={styles.deckDescription} numberOfLines={2}>
              {deck.description}
            </Text>
          </View>

          {/* Progress Bar */}
          {deck.progress > 0 && (
            <View style={styles.progressContainer}>
              <Progress
                value={deck.progress}
                style={styles.progressBar}
              />
              <Text variant="caption" style={styles.progressText}>
                {deck.progress}% complete
              </Text>
            </View>
          )}

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="label" style={{ color: theme.text.primary }}>
                {deck.cardCount}
              </Text>
              <Text variant="caption" style={{ color: theme.text.secondary }}>
                cards
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.streakContainer}>
                <TrendingUp size={12} color="#f59e0b" />
                <Text variant="label" style={{ color: '#f59e0b', marginLeft: 4 }}>
                  {deck.studyStreak}
                </Text>
              </View>
              <Text variant="caption" style={{ color: theme.text.secondary }}>
                day streak
              </Text>
            </View>
            
            <View style={[
              styles.difficultyBadge,
              {
                backgroundColor: difficultyColors.bg,
              }
            ]}>
              <Text
                variant="caption"
                style={{
                  color: difficultyColors.text,
                  fontWeight: '600'
                }}
              >
                {deck.difficulty}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

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
            Flashcards
          </Text>
          <Text variant="caption" style={{ color: theme.text.secondary }}>
            Master concepts with spaced repetition
          </Text>
        </View>
      </View>

      {/* Search and Controls */}
      <View style={styles.controlsContainer}>
        {/* Search Bar */}
        <View style={[styles.searchContainer, neumorphicShadow.md]}>
          <Search size={20} color={theme.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search decks..."
            placeholderTextColor={theme.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* View Mode Toggle */}
        <View style={[styles.viewToggle, neumorphicShadow.sm]}>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === 'grid' && styles.activeViewButton
            ]}
            onPress={() => setViewMode('grid')}
          >
            <Grid
              size={16}
              color={viewMode === 'grid' ? theme.surface : theme.text.secondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === 'list' && styles.activeViewButton
            ]}
            onPress={() => setViewMode('list')}
          >
            <List
              size={16}
              color={viewMode === 'list' ? theme.surface : theme.text.secondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Deck Grid/List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          styles.decksContainer,
          viewMode === 'list' && styles.listContainer
        ]}>
          {filteredDecks.map(renderDeckCard)}
        </View>
        
        {/* Empty State */}
        {filteredDecks.length === 0 && (
          <View style={styles.emptyState}>
            <Text variant="h3" style={{ color: theme.text.secondary, marginBottom: spacing[2] }}>
              No decks found
            </Text>
            <Text variant="body" style={{ color: theme.text.secondary, textAlign: 'center' }}>
              Try adjusting your search criteria
            </Text>
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
  controlsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
    gap: spacing[4],
  },
  searchContainer: {
    flex: 1,
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
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 4,
  },
  viewButton: {
    padding: spacing[2],
    borderRadius: 8,
  },
  activeViewButton: {
    backgroundColor: theme.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[6],
    paddingTop: 0,
  },
  decksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
  },
  listContainer: {
    flexDirection: 'column',
  },
  deckCard: {
    width: (width - spacing[6] * 2 - spacing[4]) / 2,
    marginBottom: spacing[4],
  },
  listCard: {
    width: '100%',
  },
  cardContent: {
    padding: spacing[4],
  },
  cardHeader: {
    position: 'relative',
    marginBottom: spacing[3],
  },
  colorStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[3],
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumBadge: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 6,
  },
  cardBody: {
    marginBottom: spacing[4],
  },
  deckTitle: {
    color: theme.text.primary,
    marginBottom: spacing[2],
    lineHeight: 20,
  },
  deckDescription: {
    color: theme.text.secondary,
    lineHeight: 18,
  },
  progressContainer: {
    marginBottom: spacing[4],
  },
  progressBar: {
    height: 6,
    marginBottom: spacing[1],
  },
  progressText: {
    color: theme.text.secondary,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
  },
});

export default FlashcardDeckScreen;