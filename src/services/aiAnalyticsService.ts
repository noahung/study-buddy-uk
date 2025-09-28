import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../constants';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export interface LearningPattern {
  id: string;
  type: 'time' | 'difficulty' | 'topic' | 'method' | 'performance';
  title: string;
  description: string;
  confidence: number; // 0-1
  impact: 'positive' | 'negative' | 'neutral';
  recommendations: string[];
  data: any;
}

export interface StudySession {
  id: string;
  userId: string;
  courseId: string;
  type: 'flashcard' | 'note' | 'quiz' | 'review';
  duration: number; // minutes
  score?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  timestamp: string;
  effectiveness?: number; // 1-5 rating
}

export interface LearningInsight {
  id: string;
  type: 'strength' | 'weakness' | 'opportunity' | 'trend' | 'anomaly';
  title: string;
  description: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  suggestedActions: string[];
  relatedData: any;
  createdAt: string;
}

export interface PerformancePrediction {
  id: string;
  metric: 'test_score' | 'completion_time' | 'retention_rate' | 'engagement';
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string; // e.g., "1 week", "1 month"
  factors: string[];
  recommendations: string[];
}

// Analyze learning patterns from study data
export const analyzeLearningPatterns = async (
  userId: string,
  studySessions: StudySession[],
  testResults: any[],
  timeSpent: any[]
): Promise<LearningPattern[]> => {
  try {
    const prompt = `Analyse the following learning data and identify patterns:

Study Sessions (${studySessions.length} sessions):
${studySessions.map(s => 
  `- ${s.type}: ${s.duration}min, ${s.difficulty} difficulty, ${s.topic}, score: ${s.score || 'N/A'}`
).join('\n')}

Test Results (${testResults.length} tests):
${testResults.map(t => 
  `- ${t.topic}: ${t.score}%, ${t.difficulty} difficulty, ${t.timestamp}`
).join('\n')}

Time Spent:
${timeSpent.map(t => 
  `- ${t.date}: ${t.duration} minutes on ${t.topic}`
).join('\n')}

Identify patterns in:
1. Time of day effectiveness
2. Study duration optimisation
3. Topic difficulty progression
4. Learning method effectiveness
5. Performance trends
6. Study consistency

For each pattern, provide:
- Type and title
- Description of the pattern
- Confidence level (0-1)
- Impact (positive/negative/neutral)
- Specific recommendations
- Supporting data

Format as JSON array with this structure:
[
  {
    "type": "time|difficulty|topic|method|performance",
    "title": "Pattern title",
    "description": "Detailed description",
    "confidence": 0.8,
    "impact": "positive|negative|neutral",
    "recommendations": ["rec1", "rec2"],
    "data": {"key": "value"}
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const patternsData = JSON.parse(text);
    
    return patternsData.map((pattern: any, index: number) => ({
      id: `pattern_${Date.now()}_${index}`,
      type: pattern.type,
      title: pattern.title,
      description: pattern.description,
      confidence: pattern.confidence,
      impact: pattern.impact,
      recommendations: pattern.recommendations || [],
      data: pattern.data || {}
    }));
  } catch (error) {
    console.error('Error analyzing learning patterns:', error);
    throw new Error('Failed to analyze learning patterns');
  }
};

// Generate learning insights
export const generateLearningInsights = async (
  userId: string,
  patterns: LearningPattern[],
  recentPerformance: any,
  goals: string[]
): Promise<LearningInsight[]> => {
  try {
    const prompt = `Generate personalised learning insights based on the identified patterns and student data:

Identified Patterns:
${patterns.map(p => 
  `- ${p.title}: ${p.description} (${p.impact} impact, ${p.confidence} confidence)`
).join('\n')}

Recent Performance:
- Average Score: ${recentPerformance.averageScore}%
- Study Time: ${recentPerformance.studyTime} minutes
- Consistency: ${recentPerformance.consistency}%
- Weak Areas: ${recentPerformance.weakAreas.join(', ')}

Student Goals:
${goals.join(', ')}

Generate insights that:
1. Highlight strengths and weaknesses
2. Identify opportunities for improvement
3. Spot trends and anomalies
4. Provide actionable recommendations
5. Align with student goals

For each insight, provide:
- Type (strength/weakness/opportunity/trend/anomaly)
- Title and description
- Confidence level
- Priority level
- Whether it's actionable
- Specific suggested actions

Format as JSON array:
[
  {
    "type": "strength|weakness|opportunity|trend|anomaly",
    "title": "Insight title",
    "description": "Detailed description",
    "confidence": 0.8,
    "priority": "high|medium|low",
    "actionable": true,
    "suggestedActions": ["action1", "action2"],
    "relatedData": {"key": "value"}
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const insightsData = JSON.parse(text);
    
    return insightsData.map((insight: any, index: number) => ({
      id: `insight_${Date.now()}_${index}`,
      type: insight.type,
      title: insight.title,
      description: insight.description,
      confidence: insight.confidence,
      priority: insight.priority,
      actionable: insight.actionable,
      suggestedActions: insight.suggestedActions || [],
      relatedData: insight.relatedData || {},
      createdAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error generating learning insights:', error);
    throw new Error('Failed to generate learning insights');
  }
};

// Predict future performance
export const predictPerformance = async (
  userId: string,
  historicalData: any,
  currentTrends: any,
  plannedStudy: any[]
): Promise<PerformancePrediction[]> => {
  try {
    const prompt = `Predict future performance based on historical data and current trends:

Historical Data:
- Average test scores: ${historicalData.averageScores.join(', ')}
- Study consistency: ${historicalData.consistency}%
- Time per topic: ${historicalData.timePerTopic} minutes
- Improvement rate: ${historicalData.improvementRate}%

Current Trends:
- Recent performance: ${currentTrends.recentPerformance}%
- Study frequency: ${currentTrends.studyFrequency} sessions/week
- Focus areas: ${currentTrends.focusAreas.join(', ')}

Planned Study:
${plannedStudy.map(s => `- ${s.topic}: ${s.duration} minutes, ${s.difficulty} difficulty`).join('\n')}

Predict performance for:
1. Test scores (1 week, 1 month)
2. Completion time (1 week, 1 month)
3. Retention rate (1 week, 1 month)
4. Engagement level (1 week, 1 month)

For each prediction, provide:
- Current value
- Predicted value
- Confidence level
- Timeframe
- Key factors influencing the prediction
- Recommendations to improve

Format as JSON array:
[
  {
    "metric": "test_score|completion_time|retention_rate|engagement",
    "currentValue": 75,
    "predictedValue": 82,
    "confidence": 0.8,
    "timeframe": "1 week",
    "factors": ["factor1", "factor2"],
    "recommendations": ["rec1", "rec2"]
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const predictionsData = JSON.parse(text);
    
    return predictionsData.map((prediction: any, index: number) => ({
      id: `prediction_${Date.now()}_${index}`,
      metric: prediction.metric,
      currentValue: prediction.currentValue,
      predictedValue: prediction.predictedValue,
      confidence: prediction.confidence,
      timeframe: prediction.timeframe,
      factors: prediction.factors || [],
      recommendations: prediction.recommendations || []
    }));
  } catch (error) {
    console.error('Error predicting performance:', error);
    throw new Error('Failed to predict performance');
  }
};

// Generate personalized study recommendations
export const generatePersonalizedRecommendations = async (
  userId: string,
  insights: LearningInsight[],
  patterns: LearningPattern[],
  currentGoals: string[],
  availableTime: number
): Promise<string[]> => {
  try {
    const prompt = `Generate personalized study recommendations based on the student's learning data:

Key Insights:
${insights.map(i => 
  `- ${i.title}: ${i.description} (${i.priority} priority)`
).join('\n')}

Learning Patterns:
${patterns.map(p => 
  `- ${p.title}: ${p.description} (${p.impact} impact)`
).join('\n')}

Current Goals:
${currentGoals.join(', ')}

Available Time: ${availableTime} minutes per day

Generate 5-7 specific, actionable recommendations that:
1. Address the most important insights
2. Leverage positive patterns
3. Mitigate negative patterns
4. Align with current goals
5. Fit within available time
6. Are personalized to their learning style
7. Include specific next steps

Return as a JSON array of recommendation strings.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating personalized recommendations:', error);
    return [
      'Review your weakest topics for 30 minutes daily',
      'Take practice quizzes to identify knowledge gaps',
      'Use spaced repetition for better retention',
      'Study during your most productive hours',
      'Set specific, measurable goals for each study session'
    ];
  }
};

// Analyze study effectiveness
export const analyzeStudyEffectiveness = async (
  studySessions: StudySession[]
): Promise<{
  overallEffectiveness: number;
  mostEffectiveMethods: string[];
  optimalDuration: number;
  bestStudyTimes: string[];
  recommendations: string[];
}> => {
  try {
    const prompt = `Analyze the effectiveness of study sessions:

Study Sessions:
${studySessions.map(s => 
  `- ${s.type}: ${s.duration}min, ${s.difficulty}, ${s.topic}, effectiveness: ${s.effectiveness || 'N/A'}`
).join('\n')}

Analyze:
1. Overall effectiveness score (1-5)
2. Most effective study methods
3. Optimal study duration
4. Best study times
5. Specific recommendations for improvement

Format as JSON:
{
  "overallEffectiveness": 3.5,
  "mostEffectiveMethods": ["method1", "method2"],
  "optimalDuration": 45,
  "bestStudyTimes": ["morning", "evening"],
  "recommendations": ["rec1", "rec2", "rec3"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error analyzing study effectiveness:', error);
    return {
      overallEffectiveness: 3.0,
      mostEffectiveMethods: ['flashcards', 'practice quizzes'],
      optimalDuration: 30,
      bestStudyTimes: ['morning'],
      recommendations: ['Study more consistently', 'Focus on difficult topics', 'Take regular breaks']
    };
  }
};
