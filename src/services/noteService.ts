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
  serverTimestamp,
  limit,
  startAfter
} from 'firebase/firestore';
import { db } from './firebase';
import { Note, NoteTemplate, NoteSearchResult, NoteStats } from '../types/note';
import { aiService } from './aiService';

// Notes CRUD
export const getNotes = async (
  userId: string, 
  courseId?: string,
  limitCount: number = 50
): Promise<Note[]> => {
  try {
    let q = query(
      collection(db, 'notes'),
      where('createdBy', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );
    
    if (courseId) {
      q = query(
        collection(db, 'notes'),
        where('createdBy', '==', userId),
        where('courseId', '==', courseId),
        orderBy('updatedAt', 'desc'),
        limit(limitCount)
      );
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      lastAccessed: doc.data().lastAccessed?.toDate() || new Date(),
    })) as Note[];
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

export const getNoteById = async (noteId: string): Promise<Note | null> => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    const noteSnap = await getDoc(noteRef);
    
    if (noteSnap.exists()) {
      return {
        id: noteSnap.id,
        ...noteSnap.data(),
        createdAt: noteSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: noteSnap.data().updatedAt?.toDate() || new Date(),
        lastAccessed: noteSnap.data().lastAccessed?.toDate() || new Date(),
      } as Note;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
};

export const createNote = async (
  userId: string,
  noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'lastAccessed' | 'wordCount' | 'createdBy'>
): Promise<string> => {
  try {
    const wordCount = noteData.content.split(/\s+/).length;
    
    const notesRef = collection(db, 'notes');
    const docRef = await addDoc(notesRef, {
      ...noteData,
      createdBy: userId,
      wordCount,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastAccessed: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const updateNote = async (
  noteId: string, 
  updates: Partial<Note>
): Promise<void> => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    
    const updateData = { ...updates };
    if (updates.content) {
      updateData.wordCount = updates.content.split(/\s+/).length;
    }
    
    await updateDoc(noteRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
      lastAccessed: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

// Search Notes
export const searchNotes = async (
  userId: string,
  searchQuery: string,
  courseId?: string
): Promise<NoteSearchResult[]> => {
  try {
    const notes = await getNotes(userId, courseId, 100);
    const query = searchQuery.toLowerCase();
    
    const results = notes
      .map(note => {
        let relevanceScore = 0;
        const matchedFields: string[] = [];
        
        // Check title
        if (note.title.toLowerCase().includes(query)) {
          relevanceScore += 10;
          matchedFields.push('title');
        }
        
        // Check content
        if (note.content.toLowerCase().includes(query)) {
          relevanceScore += 5;
          matchedFields.push('content');
        }
        
        // Check tags
        const tagMatches = note.tags.filter(tag => tag.toLowerCase().includes(query));
        if (tagMatches.length > 0) {
          relevanceScore += tagMatches.length * 3;
          matchedFields.push('tags');
        }
        
        return {
          note,
          relevanceScore,
          matchedFields,
        };
      })
      .filter(result => result.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    return results;
  } catch (error) {
    console.error('Error searching notes:', error);
    throw error;
  }
};

// AI Features
export const generateNoteSummary = async (
  noteId: string,
  courseName?: string
): Promise<string> => {
  try {
    const note = await getNoteById(noteId);
    if (!note) {
      throw new Error('Note not found');
    }
    
    const summary = await aiService.generateNoteSummary(note.content, courseName);
    
    // Update note with AI summary
    await updateNote(noteId, { aiSummary: summary.content });
    
    return summary.content;
  } catch (error) {
    console.error('Error generating note summary:', error);
    throw error;
  }
};

export const generateNoteFromTopic = async (
  userId: string,
  topic: string,
  courseId?: string,
  courseName?: string
): Promise<string> => {
  try {
    const aiResponse = await aiService.generateChatResponse(
      `Create comprehensive study notes about: ${topic}`,
      { courseId, courseName, userLevel: 'intermediate' }
    );
    
    const noteId = await createNote(userId, {
      title: `Study Notes: ${topic}`,
      content: aiResponse.content,
      courseId,
      courseName,
      tags: [topic],
      isPublic: false,
      aiGenerated: true,
    });
    
    return noteId;
  } catch (error) {
    console.error('Error generating note from topic:', error);
    throw error;
  }
};

// Note Templates
export const getNoteTemplates = async (): Promise<NoteTemplate[]> => {
  try {
    const templatesRef = collection(db, 'noteTemplates');
    const q = query(templatesRef, orderBy('usageCount', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as NoteTemplate[];
  } catch (error) {
    console.error('Error fetching note templates:', error);
    throw error;
  }
};

export const createNoteFromTemplate = async (
  userId: string,
  templateId: string,
  courseId?: string,
  courseName?: string
): Promise<string> => {
  try {
    const templateRef = doc(db, 'noteTemplates', templateId);
    const templateSnap = await getDoc(templateRef);
    
    if (!templateSnap.exists()) {
      throw new Error('Template not found');
    }
    
    const template = templateSnap.data() as NoteTemplate;
    
    const noteId = await createNote(userId, {
      title: `New ${template.name}`,
      content: template.template,
      courseId,
      courseName,
      tags: [template.category],
      isPublic: false,
      aiGenerated: false,
    });
    
    // Update template usage count
    await updateDoc(templateRef, {
      usageCount: template.usageCount + 1,
    });
    
    return noteId;
  } catch (error) {
    console.error('Error creating note from template:', error);
    throw error;
  }
};

// Note Statistics
export const getNoteStats = async (userId: string): Promise<NoteStats> => {
  try {
    const notes = await getNotes(userId, undefined, 1000);
    
    const totalNotes = notes.length;
    const totalWords = notes.reduce((sum, note) => sum + note.wordCount, 0);
    const averageWordsPerNote = totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0;
    
    // Count tags
    const tagCounts: Record<string, number> = {};
    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const mostUsedTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const recentNotes = notes.slice(0, 5);
    
    // Course distribution
    const courseCounts: Record<string, { name: string; count: number }> = {};
    notes.forEach(note => {
      if (note.courseId && note.courseName) {
        courseCounts[note.courseId] = {
          name: note.courseName,
          count: (courseCounts[note.courseId]?.count || 0) + 1,
        };
      }
    });
    
    const courseDistribution = Object.entries(courseCounts)
      .map(([courseId, data]) => ({ courseId, courseName: data.name, count: data.count }))
      .sort((a, b) => b.count - a.count);
    
    return {
      totalNotes,
      totalWords,
      averageWordsPerNote,
      mostUsedTags,
      recentNotes,
      courseDistribution,
    };
  } catch (error) {
    console.error('Error fetching note stats:', error);
    throw error;
  }
};
