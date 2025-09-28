import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  limit,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Course, CourseCategory, UserProgress, Lesson, Quiz, UserQuizAttempt } from '../types/course';

// Course Categories
export const getCourseCategories = async (): Promise<CourseCategory[]> => {
  try {
    const categoriesRef = collection(db, 'courseCategories');
    const snapshot = await getDocs(categoriesRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as CourseCategory[];
  } catch (error) {
    console.error('Error fetching course categories:', error);
    throw error;
  }
};

// Courses
export const getCourses = async (categoryId?: string): Promise<Course[]> => {
  try {
    let q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
    
    if (categoryId) {
      q = query(q, where('category', '==', categoryId));
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Course[];
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);
    
    if (courseSnap.exists()) {
      return {
        id: courseSnap.id,
        ...courseSnap.data(),
        createdAt: courseSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: courseSnap.data().updatedAt?.toDate() || new Date(),
      } as Course;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

// User Progress
export const getUserProgress = async (userId: string, courseId: string): Promise<UserProgress | null> => {
  try {
    const progressRef = doc(db, 'userProgress', `${userId}_${courseId}`);
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      return {
        ...progressSnap.data(),
        lastAccessed: progressSnap.data().lastAccessed?.toDate() || new Date(),
        startedAt: progressSnap.data().startedAt?.toDate() || new Date(),
        completedAt: progressSnap.data().completedAt?.toDate(),
      } as UserProgress;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

export const updateUserProgress = async (
  userId: string, 
  courseId: string, 
  progress: Partial<UserProgress>
): Promise<void> => {
  try {
    const progressRef = doc(db, 'userProgress', `${userId}_${courseId}`);
    await setDoc(progressRef, {
      ...progress,
      lastAccessed: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

export const getUserAllProgress = async (userId: string): Promise<UserProgress[]> => {
  try {
    const progressRef = collection(db, 'userProgress');
    const q = query(progressRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      lastAccessed: doc.data().lastAccessed?.toDate() || new Date(),
      startedAt: doc.data().startedAt?.toDate() || new Date(),
      completedAt: doc.data().completedAt?.toDate(),
    })) as UserProgress[];
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

// Lessons
export const getCourseLessons = async (courseId: string): Promise<Lesson[]> => {
  try {
    const lessonsRef = collection(db, 'lessons');
    const q = query(
      lessonsRef, 
      where('courseId', '==', courseId),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Lesson[];
  } catch (error) {
    console.error('Error fetching course lessons:', error);
    throw error;
  }
};

// Quizzes
export const getCourseQuizzes = async (courseId: string): Promise<Quiz[]> => {
  try {
    const quizzesRef = collection(db, 'quizzes');
    const q = query(
      quizzesRef, 
      where('courseId', '==', courseId),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Quiz[];
  } catch (error) {
    console.error('Error fetching course quizzes:', error);
    throw error;
  }
};

export const getQuizById = async (quizId: string): Promise<Quiz | null> => {
  try {
    const quizRef = doc(db, 'quizzes', quizId);
    const quizSnap = await getDoc(quizRef);
    
    if (quizSnap.exists()) {
      return {
        id: quizSnap.id,
        ...quizSnap.data(),
      } as Quiz;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};

// Quiz Attempts
export const submitQuizAttempt = async (attempt: Omit<UserQuizAttempt, 'id'>): Promise<string> => {
  try {
    const attemptsRef = collection(db, 'quizAttempts');
    const docRef = await addDoc(attemptsRef, {
      ...attempt,
      completedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    throw error;
  }
};

export const getUserQuizAttempts = async (userId: string, quizId?: string): Promise<UserQuizAttempt[]> => {
  try {
    const attemptsRef = collection(db, 'quizAttempts');
    let q = query(attemptsRef, where('userId', '==', userId));
    
    if (quizId) {
      q = query(q, where('quizId', '==', quizId));
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      completedAt: doc.data().completedAt?.toDate() || new Date(),
    })) as UserQuizAttempt[];
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    throw error;
  }
};

// Dashboard Data
export const getDashboardData = async (userId: string) => {
  try {
    const [progress, recentAttempts] = await Promise.all([
      getUserAllProgress(userId),
      getUserQuizAttempts(userId)
    ]);
    
    const totalCourses = progress.length;
    const completedCourses = progress.filter(p => p.progress === 100).length;
    const inProgressCourses = progress.filter(p => p.progress > 0 && p.progress < 100).length;
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0);
    const averageScore = recentAttempts.length > 0 
      ? recentAttempts.reduce((sum, a) => sum + a.score, 0) / recentAttempts.length 
      : 0;
    
    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalTimeSpent,
      averageScore,
      recentProgress: progress.slice(0, 5),
      recentAttempts: recentAttempts.slice(0, 5),
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
