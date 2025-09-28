// Core App Types
export interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'premium';
  createdAt: Date;
  lastActive: Date;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in hours
  progress: number; // 0-100
  isEnrolled: boolean;
  thumbnail?: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  description: string;
  courses: Course[];
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Chat: undefined;
  Tests: undefined;
  Flashcards: undefined;
  Notes: undefined;
  Profile: undefined;
};

// Study Tools Types
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  reviewCount: number;
  correctCount: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  courseId: string;
  cards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  courseId: string;
  isAIGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface Exam {
  id: string;
  title: string;
  type: 'mini' | 'full';
  questions: Question[];
  timeLimit: number; // in minutes
  passingScore: number; // percentage
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ExamResult {
  id: string;
  examId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: Date;
  answers: number[];
}

// AI Chat Types
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  courseId?: string;
}

export interface ChatSession {
  id: string;
  courseId?: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
}

// UI Types
export interface NeumorphicStyle {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: object;
    h2: object;
    h3: object;
    body: object;
    caption: object;
  };
}
