export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  courseId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // userId
}

export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  courseId?: string;
  flashcards: Flashcard[];
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  studyCount: number;
  averageScore: number;
}

export interface FlashcardStudySession {
  id: string;
  userId: string;
  flashcardSetId: string;
  flashcards: Flashcard[];
  currentIndex: number;
  correctAnswers: number;
  incorrectAnswers: number;
  startTime: Date;
  endTime?: Date;
  isCompleted: boolean;
  studyMode: 'review' | 'learn' | 'test';
}

export interface FlashcardProgress {
  id: string;
  userId: string;
  flashcardId: string;
  timesStudied: number;
  correctCount: number;
  incorrectCount: number;
  lastStudied: Date;
  nextReview: Date;
  easeFactor: number; // For spaced repetition
  interval: number; // Days until next review
  isMastered: boolean;
}

export interface StudyStats {
  totalCards: number;
  masteredCards: number;
  cardsToReview: number;
  averageScore: number;
  studyStreak: number;
  totalStudyTime: number; // in minutes
  lastStudyDate?: Date;
}
