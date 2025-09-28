import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Flashcard, FlashcardSet, FlashcardStudySession, FlashcardProgress, StudyStats } from '../types/flashcard';
import { aiService } from './aiService';

// Flashcard Sets
export const getFlashcardSets = async (userId: string, courseId?: string): Promise<FlashcardSet[]> => {
  try {
    let q = query(
      collection(db, 'flashcardSets'),
      where('createdBy', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    if (courseId) {
      q = query(q, where('courseId', '==', courseId));
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as FlashcardSet[];
  } catch (error) {
    console.error('Error fetching flashcard sets:', error);
    throw error;
  }
};

export const getFlashcardSetById = async (setId: string): Promise<FlashcardSet | null> => {
  try {
    const setRef = doc(db, 'flashcardSets', setId);
    const setSnap = await getDoc(setRef);
    
    if (setSnap.exists()) {
      return {
        id: setSnap.id,
        ...setSnap.data(),
        createdAt: setSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: setSnap.data().updatedAt?.toDate() || new Date(),
      } as FlashcardSet;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching flashcard set:', error);
    throw error;
  }
};

export const createFlashcardSet = async (
  userId: string,
  setData: Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt' | 'studyCount' | 'averageScore'>
): Promise<string> => {
  try {
    const setsRef = collection(db, 'flashcardSets');
    const docRef = await addDoc(setsRef, {
      ...setData,
      createdBy: userId,
      studyCount: 0,
      averageScore: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating flashcard set:', error);
    throw error;
  }
};

export const updateFlashcardSet = async (setId: string, updates: Partial<FlashcardSet>): Promise<void> => {
  try {
    const setRef = doc(db, 'flashcardSets', setId);
    await updateDoc(setRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating flashcard set:', error);
    throw error;
  }
};

export const deleteFlashcardSet = async (setId: string): Promise<void> => {
  try {
    const setRef = doc(db, 'flashcardSets', setId);
    await deleteDoc(setRef);
  } catch (error) {
    console.error('Error deleting flashcard set:', error);
    throw error;
  }
};

// Flashcards
export const getFlashcardsBySet = async (setId: string): Promise<Flashcard[]> => {
  try {
    const flashcardsRef = collection(db, 'flashcards');
    const q = query(
      flashcardsRef,
      where('setId', '==', setId),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Flashcard[];
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    throw error;
  }
};

export const createFlashcard = async (
  userId: string,
  flashcardData: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>
): Promise<string> => {
  try {
    const flashcardsRef = collection(db, 'flashcards');
    const docRef = await addDoc(flashcardsRef, {
      ...flashcardData,
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating flashcard:', error);
    throw error;
  }
};

export const updateFlashcard = async (flashcardId: string, updates: Partial<Flashcard>): Promise<void> => {
  try {
    const flashcardRef = doc(db, 'flashcards', flashcardId);
    await updateDoc(flashcardRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating flashcard:', error);
    throw error;
  }
};

export const deleteFlashcard = async (flashcardId: string): Promise<void> => {
  try {
    const flashcardRef = doc(db, 'flashcards', flashcardId);
    await deleteDoc(flashcardRef);
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    throw error;
  }
};

// AI-Generated Flashcards
export const generateFlashcards = async (
  topic: string,
  count: number = 10,
  courseId?: string,
  courseName?: string
): Promise<Flashcard[]> => {
  try {
    const aiFlashcards = await aiService.generateFlashcards(topic, count, courseName);
    
    return aiFlashcards.map((card, index) => ({
      id: `temp_${Date.now()}_${index}`,
      front: card.front || '',
      back: card.back || '',
      category: card.category || topic,
      difficulty: card.difficulty || 'medium',
      courseId,
      tags: [topic],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'ai',
    }));
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
};

// Study Sessions
export const createStudySession = async (
  userId: string,
  sessionData: Omit<FlashcardStudySession, 'id' | 'startTime'>
): Promise<string> => {
  try {
    const sessionsRef = collection(db, 'studySessions');
    const docRef = await addDoc(sessionsRef, {
      ...sessionData,
      userId,
      startTime: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating study session:', error);
    throw error;
  }
};

export const updateStudySession = async (
  sessionId: string,
  updates: Partial<FlashcardStudySession>
): Promise<void> => {
  try {
    const sessionRef = doc(db, 'studySessions', sessionId);
    await updateDoc(sessionRef, {
      ...updates,
      endTime: updates.endTime ? serverTimestamp() : undefined,
    });
  } catch (error) {
    console.error('Error updating study session:', error);
    throw error;
  }
};

// Progress Tracking
export const getFlashcardProgress = async (userId: string, flashcardId: string): Promise<FlashcardProgress | null> => {
  try {
    const progressRef = doc(db, 'flashcardProgress', `${userId}_${flashcardId}`);
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      return {
        ...progressSnap.data(),
        lastStudied: progressSnap.data().lastStudied?.toDate() || new Date(),
        nextReview: progressSnap.data().nextReview?.toDate() || new Date(),
      } as FlashcardProgress;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching flashcard progress:', error);
    throw error;
  }
};

export const updateFlashcardProgress = async (
  userId: string,
  flashcardId: string,
  isCorrect: boolean,
  responseTime: number // in seconds
): Promise<void> => {
  try {
    const progressRef = doc(db, 'flashcardProgress', `${userId}_${flashcardId}`);
    const progressSnap = await getDoc(progressRef);
    
    const now = new Date();
    const existingProgress = progressSnap.exists() ? progressSnap.data() : {
      timesStudied: 0,
      correctCount: 0,
      incorrectCount: 0,
      easeFactor: 2.5,
      interval: 1,
      isMastered: false,
    };
    
    const newProgress = {
      ...existingProgress,
      timesStudied: existingProgress.timesStudied + 1,
      correctCount: existingProgress.correctCount + (isCorrect ? 1 : 0),
      incorrectCount: existingProgress.incorrectCount + (isCorrect ? 0 : 1),
      lastStudied: serverTimestamp(),
      nextReview: serverTimestamp(), // Will be calculated based on spaced repetition
      isMastered: existingProgress.correctCount >= 3 && existingProgress.correctCount / existingProgress.timesStudied >= 0.8,
    };
    
    // Calculate next review date using spaced repetition
    if (isCorrect) {
      newProgress.interval = Math.min(existingProgress.interval * newProgress.easeFactor, 365);
      newProgress.easeFactor = Math.max(newProgress.easeFactor + 0.1, 1.3);
    } else {
      newProgress.interval = 1;
      newProgress.easeFactor = Math.max(newProgress.easeFactor - 0.2, 1.3);
    }
    
    const nextReviewDate = new Date(now.getTime() + newProgress.interval * 24 * 60 * 60 * 1000);
    newProgress.nextReview = nextReviewDate;
    
    await setDoc(progressRef, newProgress);
  } catch (error) {
    console.error('Error updating flashcard progress:', error);
    throw error;
  }
};

// Study Stats
export const getStudyStats = async (userId: string): Promise<StudyStats> => {
  try {
    const progressRef = collection(db, 'flashcardProgress');
    const q = query(progressRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    const progressData = snapshot.docs.map(doc => doc.data());
    
    const totalCards = progressData.length;
    const masteredCards = progressData.filter(p => p.isMastered).length;
    const cardsToReview = progressData.filter(p => {
      const nextReview = p.nextReview?.toDate() || new Date();
      return nextReview <= new Date();
    }).length;
    
    const averageScore = totalCards > 0 ? 
      progressData.reduce((sum, p) => sum + (p.correctCount / Math.max(p.timesStudied, 1)), 0) / totalCards : 0;
    
    // Calculate study streak (simplified)
    const studyStreak = 0; // TODO: Implement proper streak calculation
    
    const totalStudyTime = progressData.reduce((sum, p) => sum + (p.timesStudied * 2), 0); // Estimate 2 minutes per card
    
    return {
      totalCards,
      masteredCards,
      cardsToReview,
      averageScore: Math.round(averageScore * 100),
      studyStreak,
      totalStudyTime,
    };
  } catch (error) {
    console.error('Error fetching study stats:', error);
    throw error;
  }
};
