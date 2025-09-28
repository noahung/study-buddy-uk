import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../constants';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export interface StudySession {
  id: string;
  title: string;
  type: 'flashcard' | 'note' | 'quiz' | 'review';
  duration: number; // in minutes
  priority: 'high' | 'medium' | 'low';
  courseId: string;
  courseName: string;
  description: string;
  estimatedDifficulty: 'easy' | 'medium' | 'hard';
  prerequisites: string[];
  learningObjectives: string[];
  suggestedTime: string; // ISO date string
  isCompleted: boolean;
  completedAt?: string;
  actualDuration?: number;
  effectiveness?: number; // 1-5 rating
}

export interface StudyPlan {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  completedSessions: number;
  progress: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  studyStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  availableTime: number; // minutes per day
  sessions: StudySession[];
  recommendations: string[];
  lastUpdated: string;
}

export interface LearningInsight {
  id: string;
  type: 'strength' | 'weakness' | 'recommendation' | 'pattern';
  title: string;
  description: string;
  confidence: number; // 0-1
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
  relatedTopics: string[];
  suggestedActions: string[];
}

// Generate personalized study plan
export const generateStudyPlan = async (
  userId: string,
  courseId: string,
  courseName: string,
  availableTime: number,
  studyStyle: string,
  difficulty: string,
  startDate: string,
  endDate: string
): Promise<StudyPlan> => {
  try {
    const prompt = `Create a personalised study plan for a ${difficulty} level student studying "${courseName}".

Student Profile:
- Available time: ${availableTime} minutes per day
- Learning style: ${studyStyle}
- Study period: ${startDate} to ${endDate}
- Course: ${courseName}

Generate a comprehensive study plan with:
1. Daily study sessions (mix of flashcards, notes, quizzes, and reviews)
2. Progressive difficulty increase
3. Spaced repetition schedule
4. Learning objectives for each session
5. Prerequisites and dependencies
6. Estimated duration for each session
7. Priority levels based on importance and difficulty
8. Personalised recommendations

Format as JSON with the following structure:
{
  "sessions": [
    {
      "title": "Session title",
      "type": "flashcard|note|quiz|review",
      "duration": 30,
      "priority": "high|medium|low",
      "description": "What to study",
      "estimatedDifficulty": "easy|medium|hard",
      "prerequisites": ["prerequisite topics"],
      "learningObjectives": ["objective 1", "objective 2"],
      "suggestedTime": "2024-01-20T09:00:00Z"
    }
  ],
  "recommendations": [
    "Study recommendation 1",
    "Study recommendation 2"
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const planData = JSON.parse(text);
    
    // Calculate total days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    // Create study sessions with IDs
    const sessions: StudySession[] = planData.sessions.map((session: any, index: number) => ({
      id: `session_${Date.now()}_${index}`,
      title: session.title,
      type: session.type,
      duration: session.duration,
      priority: session.priority,
      courseId,
      courseName,
      description: session.description,
      estimatedDifficulty: session.estimatedDifficulty,
      prerequisites: session.prerequisites || [],
      learningObjectives: session.learningObjectives || [],
      suggestedTime: session.suggestedTime,
      isCompleted: false
    }));

    const studyPlan: StudyPlan = {
      id: `plan_${Date.now()}`,
      userId,
      courseId,
      courseName,
      startDate,
      endDate,
      totalSessions: sessions.length,
      completedSessions: 0,
      progress: 0,
      difficulty: difficulty as any,
      studyStyle: studyStyle as any,
      availableTime,
      sessions,
      recommendations: planData.recommendations || [],
      lastUpdated: new Date().toISOString()
    };

    return studyPlan;
  } catch (error) {
    console.error('Error generating study plan:', error);
    throw new Error('Failed to generate study plan');
  }
};

// Generate learning insights based on study data
export const generateLearningInsights = async (
  userId: string,
  studyData: {
    completedSessions: any[];
    testScores: any[];
    timeSpent: any[];
    weakTopics: string[];
    strongTopics: string[];
  }
): Promise<LearningInsight[]> => {
  try {
    const prompt = `Analyse the following study data and generate personalised learning insights:

Study Data:
- Completed sessions: ${studyData.completedSessions.length}
- Test scores: ${studyData.testScores.map(s => s.score).join(', ')}
- Time spent: ${studyData.timeSpent.reduce((sum, t) => sum + t.duration, 0)} minutes
- Weak topics: ${studyData.weakTopics.join(', ')}
- Strong topics: ${studyData.strongTopics.join(', ')}

Generate insights that include:
1. Learning strengths and weaknesses
2. Study pattern analysis
3. Personalised recommendations
4. Topic difficulty analysis
5. Time management insights
6. Study method effectiveness

Format as JSON array with this structure:
[
  {
    "type": "strength|weakness|recommendation|pattern",
    "title": "Insight title",
    "description": "Detailed description",
    "confidence": 0.8,
    "actionable": true,
    "priority": "high|medium|low",
    "relatedTopics": ["topic1", "topic2"],
    "suggestedActions": ["action1", "action2"]
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const insightsData = JSON.parse(text);
    
    const insights: LearningInsight[] = insightsData.map((insight: any, index: number) => ({
      id: `insight_${Date.now()}_${index}`,
      type: insight.type,
      title: insight.title,
      description: insight.description,
      confidence: insight.confidence,
      actionable: insight.actionable,
      priority: insight.priority,
      relatedTopics: insight.relatedTopics || [],
      suggestedActions: insight.suggestedActions || []
    }));

    return insights;
  } catch (error) {
    console.error('Error generating learning insights:', error);
    throw new Error('Failed to generate learning insights');
  }
};

// Generate adaptive study recommendations
export const generateAdaptiveRecommendations = async (
  userId: string,
  currentProgress: any,
  performanceHistory: any[]
): Promise<string[]> => {
  try {
    const prompt = `Based on the student's current progress and performance history, generate adaptive study recommendations:

Current Progress:
- Course completion: ${currentProgress.completionPercentage}%
- Recent test scores: ${currentProgress.recentScores.join(', ')}
- Study time: ${currentProgress.studyTime} minutes
- Current topic: ${currentProgress.currentTopic}

Performance History:
${performanceHistory.map(p => `- ${p.topic}: ${p.score}% (${p.difficulty})`).join('\n')}

Generate 5-7 specific, actionable recommendations that adapt to the student's current level and learning patterns. Focus on:
1. Immediate next steps
2. Areas needing attention
3. Study method adjustments
4. Time management
5. Difficulty progression

Return as a JSON array of recommendation strings.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating adaptive recommendations:', error);
    throw new Error('Failed to generate adaptive recommendations');
  }
};

// Generate study schedule optimization
export const optimizeStudySchedule = async (
  userId: string,
  currentSchedule: StudySession[],
  preferences: {
    preferredStudyTimes: string[];
    breakFrequency: number;
    maxSessionDuration: number;
    energyLevels: { time: string; level: number }[];
  }
): Promise<StudySession[]> => {
  try {
    const prompt = `Optimize the following study schedule based on the student's preferences and energy levels:

Current Schedule:
${currentSchedule.map(s => `- ${s.title}: ${s.duration}min (${s.priority} priority)`).join('\n')}

Preferences:
- Preferred study times: ${preferences.preferredStudyTimes.join(', ')}
- Break frequency: every ${preferences.breakFrequency} minutes
- Max session duration: ${preferences.maxSessionDuration} minutes
- Energy levels: ${preferences.energyLevels.map(e => `${e.time}: ${e.level}/10`).join(', ')}

Optimize the schedule by:
1. Scheduling high-priority sessions during peak energy times
2. Adding appropriate breaks
3. Balancing session durations
4. Ensuring logical topic progression
5. Maintaining realistic time commitments

Return the optimized schedule as JSON with the same structure as the input sessions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const optimizedSessions = JSON.parse(text);
    
    return currentSchedule.map((session, index) => ({
      ...session,
      duration: optimizedSessions[index]?.duration || session.duration,
      suggestedTime: optimizedSessions[index]?.suggestedTime || session.suggestedTime
    }));
  } catch (error) {
    console.error('Error optimizing study schedule:', error);
    throw new Error('Failed to optimize study schedule');
  }
};

// Generate personalized quiz questions
export const generatePersonalizedQuiz = async (
  userId: string,
  topic: string,
  difficulty: string,
  questionCount: number,
  weakAreas: string[]
): Promise<any[]> => {
  try {
    const prompt = `Generate ${questionCount} personalized quiz questions about "${topic}" for a ${difficulty} level student.

Focus on the student's weak areas: ${weakAreas.join(', ')}

Create questions that:
1. Target the weak areas specifically
2. Progress from easier to harder concepts
3. Include practical applications
4. Test both knowledge and understanding
5. Provide clear explanations

Format as JSON array with this structure:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Why this answer is correct",
    "difficulty": "easy|medium|hard",
    "topic": "Specific topic area"
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating personalized quiz:', error);
    throw new Error('Failed to generate personalized quiz');
  }
};
