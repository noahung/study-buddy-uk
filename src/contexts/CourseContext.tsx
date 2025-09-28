import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course, CourseCategory, UserProgress, Quiz, UserQuizAttempt } from '../types/course';
import { 
  getCourseCategories, 
  getCourses, 
  getCourseById, 
  getUserProgress, 
  updateUserProgress,
  getUserAllProgress,
  getCourseQuizzes,
  getQuizById,
  submitQuizAttempt,
  getUserQuizAttempts,
  getDashboardData
} from '../services/courseService';
import { useAuth } from './AuthContext';

interface CourseContextType {
  // Categories
  categories: CourseCategory[];
  categoriesLoading: boolean;
  loadCategories: () => Promise<void>;
  
  // Courses
  courses: Course[];
  coursesLoading: boolean;
  loadCourses: (categoryId?: string) => Promise<void>;
  getCourse: (courseId: string) => Promise<Course | null>;
  
  // User Progress
  userProgress: UserProgress[];
  progressLoading: boolean;
  loadUserProgress: () => Promise<void>;
  updateProgress: (courseId: string, progress: Partial<UserProgress>) => Promise<void>;
  
  // Quizzes
  quizzes: Quiz[];
  quizzesLoading: boolean;
  loadCourseQuizzes: (courseId: string) => Promise<void>;
  getQuiz: (quizId: string) => Promise<Quiz | null>;
  submitQuiz: (attempt: Omit<UserQuizAttempt, 'id'>) => Promise<string>;
  
  // Dashboard
  dashboardData: any;
  dashboardLoading: boolean;
  loadDashboardData: () => Promise<void>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // State
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizzesLoading, setQuizzesLoading] = useState(false);
  
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  // Load categories
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      setError(null);
      const data = await getCourseCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Load courses
  const loadCourses = async (categoryId?: string) => {
    try {
      setCoursesLoading(true);
      setError(null);
      const data = await getCourses(categoryId);
      setCourses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setCoursesLoading(false);
    }
  };

  // Get single course
  const getCourse = async (courseId: string): Promise<Course | null> => {
    try {
      setError(null);
      return await getCourseById(courseId);
    } catch (err: any) {
      setError(err.message || 'Failed to load course');
      return null;
    }
  };

  // Load user progress
  const loadUserProgress = async () => {
    if (!user) return;
    
    try {
      setProgressLoading(true);
      setError(null);
      const data = await getUserAllProgress(user.id);
      setUserProgress(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load user progress');
    } finally {
      setProgressLoading(false);
    }
  };

  // Update progress
  const updateProgress = async (courseId: string, progress: Partial<UserProgress>) => {
    if (!user) return;
    
    try {
      setError(null);
      await updateUserProgress(user.id, courseId, progress);
      
      // Reload user progress
      await loadUserProgress();
    } catch (err: any) {
      setError(err.message || 'Failed to update progress');
    }
  };

  // Load course quizzes
  const loadCourseQuizzes = async (courseId: string) => {
    try {
      setQuizzesLoading(true);
      setError(null);
      const data = await getCourseQuizzes(courseId);
      setQuizzes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load quizzes');
    } finally {
      setQuizzesLoading(false);
    }
  };

  // Get single quiz
  const getQuiz = async (quizId: string): Promise<Quiz | null> => {
    try {
      setError(null);
      return await getQuizById(quizId);
    } catch (err: any) {
      setError(err.message || 'Failed to load quiz');
      return null;
    }
  };

  // Submit quiz
  const submitQuiz = async (attempt: Omit<UserQuizAttempt, 'id'>): Promise<string> => {
    try {
      setError(null);
      const attemptId = await submitQuizAttempt(attempt);
      
      // Reload user progress and dashboard data
      await Promise.all([loadUserProgress(), loadDashboardData()]);
      
      return attemptId;
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz');
      throw err;
    }
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      setDashboardLoading(true);
      setError(null);
      const data = await getDashboardData(user.id);
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setDashboardLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Load initial data when user changes
  useEffect(() => {
    if (user) {
      loadCategories();
      loadCourses();
      loadUserProgress();
      loadDashboardData();
    } else {
      setCategories([]);
      setCourses([]);
      setUserProgress([]);
      setDashboardData(null);
    }
  }, [user]);

  const value: CourseContextType = {
    categories,
    categoriesLoading,
    loadCategories,
    courses,
    coursesLoading,
    loadCourses,
    getCourse,
    userProgress,
    progressLoading,
    loadUserProgress,
    updateProgress,
    quizzes,
    quizzesLoading,
    loadCourseQuizzes,
    getQuiz,
    submitQuiz,
    dashboardData,
    dashboardLoading,
    loadDashboardData,
    error,
    clearError,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourse = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};
