export interface Note {
  id: string;
  title: string;
  content: string;
  courseId?: string;
  courseName?: string;
  tags: string[];
  isPublic: boolean;
  createdBy: string; // userId
  createdAt: Date;
  updatedAt: Date;
  lastAccessed: Date;
  wordCount: number;
  aiSummary?: string;
  aiGenerated: boolean;
}

export interface NoteTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  usageCount: number;
}

export interface NoteSearchResult {
  note: Note;
  relevanceScore: number;
  matchedFields: string[];
}

export interface NoteStats {
  totalNotes: number;
  totalWords: number;
  averageWordsPerNote: number;
  mostUsedTags: Array<{ tag: string; count: number }>;
  recentNotes: Note[];
  courseDistribution: Array<{ courseId: string; courseName: string; count: number }>;
}
