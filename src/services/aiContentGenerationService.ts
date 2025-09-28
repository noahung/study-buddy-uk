import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../constants';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export interface ContentGenerationRequest {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  contentType: 'flashcards' | 'notes' | 'quiz' | 'summary' | 'explanation';
  count?: number;
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  context?: string;
  userLevel?: string;
  specificRequirements?: string[];
}

export interface GeneratedContent {
  id: string;
  type: string;
  title: string;
  content: any;
  difficulty: string;
  learningObjectives: string[];
  estimatedTime: number; // minutes
  prerequisites: string[];
  tags: string[];
  createdAt: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  cards: {
    front: string;
    back: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    hints?: string[];
  }[];
  estimatedTime: number;
  learningObjectives: string[];
  tags: string[];
}

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  summary: string;
  keyPoints: string[];
  questions: string[];
  relatedTopics: string[];
  difficulty: string;
  estimatedTime: number;
  tags: string[];
}

export interface QuizContent {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    hints?: string[];
  }[];
  estimatedTime: number;
  passingScore: number;
  tags: string[];
}

// Generate flashcards with AI
export const generateFlashcards = async (
  request: ContentGenerationRequest
): Promise<FlashcardSet> => {
  try {
    const prompt = `Generate ${request.count || 10} flashcards about "${request.topic}" for a ${request.difficulty} level student.

Learning Style: ${request.learningStyle || 'visual'}
Context: ${request.context || 'General study'}
User Level: ${request.userLevel || 'intermediate'}

Requirements:
${request.specificRequirements?.map(req => `- ${req}`).join('\n') || '- Cover key concepts comprehensively'}

For each flashcard, provide:
1. Front side (question/term/concept)
2. Back side (answer/definition/explanation)
3. Difficulty level (easy/medium/hard)
4. Category/topic area
5. Optional hints for difficult cards

Make the content:
- Appropriate for ${request.difficulty} level
- Engaging and memorable
- Progressive in difficulty
- Include practical examples
- Use ${request.learningStyle} learning techniques

Format as JSON:
{
  "title": "Flashcard Set Title",
  "description": "Brief description of what this set covers",
  "cards": [
    {
      "front": "Question or term",
      "back": "Answer or definition",
      "difficulty": "easy|medium|hard",
      "category": "Topic category",
      "hints": ["hint1", "hint2"]
    }
  ],
  "learningObjectives": ["objective1", "objective2"],
  "tags": ["tag1", "tag2"],
  "estimatedTime": 30
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const flashcardData = JSON.parse(text);
    
    return {
      id: `flashcard_${Date.now()}`,
      title: flashcardData.title,
      description: flashcardData.description,
      cards: flashcardData.cards,
      estimatedTime: flashcardData.estimatedTime,
      learningObjectives: flashcardData.learningObjectives,
      tags: flashcardData.tags
    };
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw new Error('Failed to generate flashcards');
  }
};

// Generate study notes with AI
export const generateStudyNotes = async (
  request: ContentGenerationRequest
): Promise<StudyNote> => {
  try {
    const prompt = `Generate comprehensive study notes about "${request.topic}" for a ${request.difficulty} level student.

Learning Style: ${request.learningStyle || 'reading'}
Context: ${request.context || 'General study'}
User Level: ${request.userLevel || 'intermediate'}

Requirements:
${request.specificRequirements?.map(req => `- ${req}`).join('\n') || '- Cover all important aspects of the topic'}

Create:
1. A detailed, well-structured note
2. A concise summary
3. Key points (5-7 bullet points)
4. Study questions (3-5 questions to test understanding)
5. Related topics to explore

Structure the content for ${request.learningStyle} learning:
- Use clear headings and subheadings
- Include examples and practical applications
- Make it scannable and easy to review
- Include visual cues if appropriate

Format as JSON:
{
  "title": "Note Title",
  "content": "Detailed note content with proper formatting",
  "summary": "Concise summary",
  "keyPoints": ["point1", "point2", "point3"],
  "questions": ["question1", "question2", "question3"],
  "relatedTopics": ["topic1", "topic2", "topic3"],
  "difficulty": "${request.difficulty}",
  "estimatedTime": 45,
  "tags": ["tag1", "tag2"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const noteData = JSON.parse(text);
    
    return {
      id: `note_${Date.now()}`,
      title: noteData.title,
      content: noteData.content,
      summary: noteData.summary,
      keyPoints: noteData.keyPoints,
      questions: noteData.questions,
      relatedTopics: noteData.relatedTopics,
      difficulty: noteData.difficulty,
      estimatedTime: noteData.estimatedTime,
      tags: noteData.tags
    };
  } catch (error) {
    console.error('Error generating study notes:', error);
    throw new Error('Failed to generate study notes');
  }
};

// Generate quiz content with AI
export const generateQuizContent = async (
  request: ContentGenerationRequest
): Promise<QuizContent> => {
  try {
    const prompt = `Generate ${request.count || 10} quiz questions about "${request.topic}" for a ${request.difficulty} level student.

Learning Style: ${request.learningStyle || 'reading'}
Context: ${request.context || 'General study'}
User Level: ${request.userLevel || 'intermediate'}

Requirements:
${request.specificRequirements?.map(req => `- ${req}`).join('\n') || '- Test understanding comprehensively'}

For each question, provide:
1. Clear, unambiguous question
2. 4 multiple choice options
3. Correct answer
4. Detailed explanation
5. Difficulty level (easy/medium/hard)
6. Category/topic area
7. Optional hints

Make questions:
- Appropriate for ${request.difficulty} level
- Test both knowledge and understanding
- Include practical applications
- Progress from easier to harder
- Avoid trick questions

Format as JSON:
{
  "title": "Quiz Title",
  "description": "Brief description of what this quiz covers",
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Why this answer is correct",
      "difficulty": "easy|medium|hard",
      "category": "Topic category",
      "hints": ["hint1", "hint2"]
    }
  ],
  "estimatedTime": 30,
  "passingScore": 70,
  "tags": ["tag1", "tag2"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const quizData = JSON.parse(text);
    
    return {
      id: `quiz_${Date.now()}`,
      title: quizData.title,
      description: quizData.description,
      questions: quizData.questions,
      estimatedTime: quizData.estimatedTime,
      passingScore: quizData.passingScore,
      tags: quizData.tags
    };
  } catch (error) {
    console.error('Error generating quiz content:', error);
    throw new Error('Failed to generate quiz content');
  }
};

// Generate content summary with AI
export const generateContentSummary = async (
  content: string,
  topic: string,
  learningStyle?: string
): Promise<{
  summary: string;
  keyPoints: string[];
  questions: string[];
  relatedTopics: string[];
}> => {
  try {
    const prompt = `Summarize the following content about "${topic}":

Content:
${content}

Learning Style: ${learningStyle || 'reading'}

Create:
1. A concise summary (2-3 paragraphs)
2. Key points (5-7 bullet points)
3. Study questions (3-5 questions to test understanding)
4. Related topics to explore

Make it appropriate for ${learningStyle} learning and easy to review.

Format as JSON:
{
  "summary": "Concise summary",
  "keyPoints": ["point1", "point2", "point3"],
  "questions": ["question1", "question2", "question3"],
  "relatedTopics": ["topic1", "topic2", "topic3"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating content summary:', error);
    throw new Error('Failed to generate content summary');
  }
};

// Generate personalized explanation
export const generatePersonalizedExplanation = async (
  topic: string,
  question: string,
  learningStyle: string,
  difficulty: string,
  userLevel: string
): Promise<{
  explanation: string;
  examples: string[];
  analogies: string[];
  visualCues: string[];
}> => {
  try {
    const prompt = `Explain "${topic}" in response to: "${question}"

Student Profile:
- Learning Style: ${learningStyle}
- Difficulty Level: ${difficulty}
- User Level: ${userLevel}

Provide a personalized explanation that:
1. Directly answers the question
2. Uses ${learningStyle} learning techniques
3. Is appropriate for ${difficulty} level
4. Includes practical examples
5. Uses analogies and visual cues
6. Builds understanding progressively

Format as JSON:
{
  "explanation": "Detailed explanation",
  "examples": ["example1", "example2", "example3"],
  "analogies": ["analogy1", "analogy2"],
  "visualCues": ["visual cue1", "visual cue2"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating personalized explanation:', error);
    throw new Error('Failed to generate personalized explanation');
  }
};

// Generate adaptive content based on performance
export const generateAdaptiveContent = async (
  topic: string,
  performanceData: {
    weakAreas: string[];
    strongAreas: string[];
    recentScores: number[];
    studyTime: number;
  },
  contentType: string
): Promise<GeneratedContent> => {
  try {
    const prompt = `Generate ${contentType} content about "${topic}" that adapts to the student's performance:

Performance Data:
- Weak Areas: ${performanceData.weakAreas.join(', ')}
- Strong Areas: ${performanceData.strongAreas.join(', ')}
- Recent Scores: ${performanceData.recentScores.join(', ')}
- Study Time: ${performanceData.studyTime} minutes

Create content that:
1. Focuses more on weak areas
2. Builds on strong areas
3. Matches their study time availability
4. Adjusts difficulty based on recent scores
5. Provides extra practice for struggling concepts
6. Includes reinforcement for mastered topics

Format as JSON with appropriate structure for ${contentType}.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const contentData = JSON.parse(text);
    
    return {
      id: `adaptive_${Date.now()}`,
      type: contentType,
      title: contentData.title,
      content: contentData,
      difficulty: 'adaptive',
      learningObjectives: contentData.learningObjectives || [],
      estimatedTime: contentData.estimatedTime || 30,
      prerequisites: contentData.prerequisites || [],
      tags: contentData.tags || [],
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating adaptive content:', error);
    throw new Error('Failed to generate adaptive content');
  }
};

// Generate content recommendations
export const generateContentRecommendations = async (
  userId: string,
  currentProgress: any,
  learningGoals: string[],
  availableTime: number
): Promise<{
  recommendedContent: string[];
  studyPlan: string[];
  focusAreas: string[];
}> => {
  try {
    const prompt = `Generate personalized content recommendations for a student:

Current Progress:
- Completed Topics: ${currentProgress.completedTopics?.join(', ') || 'None'}
- Current Topic: ${currentProgress.currentTopic || 'Not specified'}
- Progress: ${currentProgress.progress || 0}%
- Study Time: ${availableTime} minutes available

Learning Goals:
${learningGoals.join(', ')}

Recommend:
1. Specific content types to study next
2. A daily study plan
3. Focus areas that need attention

Format as JSON:
{
  "recommendedContent": ["content1", "content2", "content3"],
  "studyPlan": ["plan step1", "plan step2", "plan step3"],
  "focusAreas": ["area1", "area2", "area3"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating content recommendations:', error);
    throw new Error('Failed to generate content recommendations');
  }
};
