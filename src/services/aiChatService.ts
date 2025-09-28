import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../constants';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  courseId?: string;
  courseName?: string;
  type?: 'general' | 'course-specific' | 'quiz-help' | 'note-summary' | 'study-planning';
  context?: {
    topic?: string;
    difficulty?: string;
    previousQuestions?: string[];
    learningGoals?: string[];
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  courseId?: string;
  courseName?: string;
  messages: ChatMessage[];
  context: {
    currentTopic?: string;
    difficulty?: string;
    learningStyle?: string;
    weakAreas?: string[];
    strongAreas?: string[];
    studyGoals?: string[];
  };
  createdAt: string;
  lastActiveAt: string;
  isActive: boolean;
}

export interface LearningProfile {
  userId: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  weakAreas: string[];
  strongAreas: string[];
  studyGoals: string[];
  preferredExplanationStyle: 'detailed' | 'concise' | 'step-by-step';
  lastUpdated: string;
}

// Generate AI response with context awareness
export const generateContextualResponse = async (
  message: string,
  session: ChatSession,
  learningProfile?: LearningProfile
): Promise<string> => {
  try {
    // Build context from session and learning profile
    const context = buildContext(session, learningProfile);
    
    const prompt = `You are an AI study tutor. Respond to the student's message with personalised, helpful guidance.

Student Context:
${context}

Previous conversation:
${session.messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n')}

Current message: ${message}

Provide a helpful, personalised response that:
1. Directly addresses the student's question
2. Uses appropriate difficulty level
3. Matches their learning style
4. References previous context when relevant
5. Suggests next steps or related topics
6. Maintains an encouraging, supportive tone

Keep the response concise but informative (2-3 paragraphs max).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating contextual response:', error);
    throw new Error('Failed to generate AI response');
  }
};

// Build context string from session and learning profile
const buildContext = (session: ChatSession, learningProfile?: LearningProfile): string => {
  let context = '';
  
  if (session.courseName) {
    context += `Course: ${session.courseName}\n`;
  }
  
  if (session.context.currentTopic) {
    context += `Current Topic: ${session.context.currentTopic}\n`;
  }
  
  if (session.context.difficulty) {
    context += `Difficulty Level: ${session.context.difficulty}\n`;
  }
  
  if (learningProfile) {
    context += `Learning Style: ${learningProfile.learningStyle}\n`;
    context += `Difficulty Preference: ${learningProfile.difficulty}\n`;
    context += `Weak Areas: ${learningProfile.weakAreas.join(', ')}\n`;
    context += `Strong Areas: ${learningProfile.strongAreas.join(', ')}\n`;
    context += `Study Goals: ${learningProfile.studyGoals.join(', ')}\n`;
    context += `Explanation Style: ${learningProfile.preferredExplanationStyle}\n`;
  }
  
  return context;
};

// Generate study suggestions based on conversation
export const generateStudySuggestions = async (
  session: ChatSession,
  learningProfile?: LearningProfile
): Promise<string[]> => {
  try {
    const recentTopics = extractTopicsFromMessages(session.messages.slice(-10));
    const context = buildContext(session, learningProfile);
    
    const prompt = `Based on the student's recent conversation and learning profile, generate 3-5 personalised study suggestions.

Context:
${context}

Recent topics discussed:
${recentTopics.join(', ')}

Generate specific, actionable study suggestions that:
1. Build on recent conversations
2. Address weak areas
3. Match learning style
4. Are appropriate for their level
5. Include specific resources or methods

Return as a JSON array of suggestion strings.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating study suggestions:', error);
    return ['Continue studying the current topic', 'Review previous notes', 'Take a practice quiz'];
  }
};

// Extract topics from conversation messages
const extractTopicsFromMessages = (messages: ChatMessage[]): string[] => {
  const topics = new Set<string>();
  
  messages.forEach(message => {
    // Simple keyword extraction (in a real app, you'd use more sophisticated NLP)
    const keywords = message.text.toLowerCase().match(/\b(?:study|learn|understand|explain|help|quiz|test|exam|flashcard|note|topic|concept|theory|practice|review)\b/g);
    if (keywords) {
      keywords.forEach(keyword => topics.add(keyword));
    }
  });
  
  return Array.from(topics);
};

// Generate personalized explanation
export const generatePersonalizedExplanation = async (
  topic: string,
  question: string,
  learningProfile: LearningProfile,
  difficulty: string
): Promise<string> => {
  try {
    const prompt = `Explain "${topic}" in response to: "${question}"

Student Profile:
- Learning Style: ${learningProfile.learningStyle}
- Difficulty Level: ${difficulty}
- Explanation Preference: ${learningProfile.preferredExplanationStyle}
- Weak Areas: ${learningProfile.weakAreas.join(', ')}
- Strong Areas: ${learningProfile.strongAreas.join(', ')}

Provide an explanation that:
1. Matches their learning style (use examples, diagrams, step-by-step, etc.)
2. Is appropriate for their difficulty level
3. Uses their preferred explanation style
4. Builds on their strong areas
5. Addresses potential confusion points
6. Includes practical examples or applications

Keep it clear, engaging, and personalised.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating personalized explanation:', error);
    throw new Error('Failed to generate explanation');
  }
};

// Generate quiz help with context
export const generateQuizHelp = async (
  question: string,
  options: string[],
  studentAnswer?: string,
  session: ChatSession
): Promise<{
  explanation: string;
  hints: string[];
  relatedTopics: string[];
}> => {
  try {
    const prompt = `Help the student with this quiz question:

Question: ${question}
Options: ${options.join(', ')}
${studentAnswer ? `Student's Answer: ${studentAnswer}` : ''}

Context:
- Course: ${session.courseName || 'General'}
- Current Topic: ${session.context.currentTopic || 'Not specified'}
- Difficulty: ${session.context.difficulty || 'Not specified'}

Provide:
1. A clear explanation of the correct answer
2. 2-3 helpful hints (without giving away the answer)
3. Related topics they should review

Format as JSON:
{
  "explanation": "Detailed explanation",
  "hints": ["hint1", "hint2", "hint3"],
  "relatedTopics": ["topic1", "topic2", "topic3"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating quiz help:', error);
    throw new Error('Failed to generate quiz help');
  }
};

// Generate note summary with AI
export const generateNoteSummary = async (
  noteContent: string,
  topic: string,
  learningProfile?: LearningProfile
): Promise<{
  summary: string;
  keyPoints: string[];
  questions: string[];
  relatedTopics: string[];
}> => {
  try {
    const prompt = `Summarize this note about "${topic}":

Note Content:
${noteContent}

${learningProfile ? `Student Profile:
- Learning Style: ${learningProfile.learningStyle}
- Difficulty Level: ${learningProfile.difficulty}
- Explanation Preference: ${learningProfile.preferredExplanationStyle}` : ''}

Create:
1. A concise summary (2-3 paragraphs)
2. Key points (5-7 bullet points)
3. Study questions (3-5 questions to test understanding)
4. Related topics to explore

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
    console.error('Error generating note summary:', error);
    throw new Error('Failed to generate note summary');
  }
};

// Update learning profile based on conversation
export const updateLearningProfile = async (
  currentProfile: LearningProfile,
  newMessages: ChatMessage[]
): Promise<Partial<LearningProfile>> => {
  try {
    const conversation = newMessages.map(m => `${m.sender}: ${m.text}`).join('\n');
    
    const prompt = `Analyze this student's conversation and suggest updates to their learning profile:

Current Profile:
- Learning Style: ${currentProfile.learningStyle}
- Difficulty: ${currentProfile.difficulty}
- Weak Areas: ${currentProfile.weakAreas.join(', ')}
- Strong Areas: ${currentProfile.strongAreas.join(', ')}
- Study Goals: ${currentProfile.studyGoals.join(', ')}

Recent Conversation:
${conversation}

Suggest updates to the learning profile based on:
1. New topics mentioned
2. Difficulty level of questions
3. Learning preferences shown
4. Areas of confusion or strength
5. Study goals mentioned

Return as JSON with only the fields that should be updated:
{
  "learningStyle": "visual|auditory|kinesthetic|reading",
  "difficulty": "beginner|intermediate|advanced",
  "weakAreas": ["area1", "area2"],
  "strongAreas": ["area1", "area2"],
  "studyGoals": ["goal1", "goal2"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error updating learning profile:', error);
    return {};
  }
};
