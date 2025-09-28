export interface Course {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  isPremium: boolean;
  imageUrl?: string;
  tags: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  courseCount: number;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  progress: number; // percentage 0-100
  completedLessons: string[];
  currentLesson: string;
  timeSpent: number; // in minutes
  lastAccessed: Date;
  startedAt: Date;
  completedAt?: Date;
  score?: number; // average score across all tests
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  type: 'video' | 'text' | 'interactive' | 'quiz';
  duration: number; // in minutes
  order: number;
  isPremium: boolean;
  prerequisites: string[];
  resources: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  url: string;
  size?: number; // in bytes
}

export interface Quiz {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  attempts: number;
  isPremium: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'essay';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserQuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: Record<string, string>;
  score: number;
  timeSpent: number; // in minutes
  completedAt: Date;
  passed: boolean;
}
