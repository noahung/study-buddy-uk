// British English prompts for all AI services
// This ensures consistent UK spelling throughout the app

export const BRITISH_ENGLISH_PROMPTS = {
  // Study Planner Prompts
  studyPlan: `Create a personalised study plan for a {difficulty} level student studying "{courseName}".

Student Profile:
- Available time: {availableTime} minutes per day
- Learning style: {studyStyle}
- Study period: {startDate} to {endDate}
- Course: {courseName}

Generate a comprehensive study plan with:
1. Daily study sessions (mix of flashcards, notes, quizzes, and reviews)
2. Progressive difficulty increase
3. Spaced repetition schedule
4. Learning objectives for each session
5. Prerequisites and dependencies
6. Estimated duration for each session
7. Priority levels based on importance and difficulty
8. Personalised recommendations

Format as JSON with the following structure:`,

  learningInsights: `Analyse the following study data and generate personalised learning insights:

Study Data:
- Completed sessions: {completedSessions}
- Test scores: {testScores}
- Time spent: {timeSpent} minutes
- Weak topics: {weakTopics}
- Strong topics: {strongTopics}

Generate insights that include:
1. Learning strengths and weaknesses
2. Study pattern analysis
3. Personalised recommendations
4. Topic difficulty analysis
5. Time management insights
6. Study method effectiveness

Format as JSON array with this structure:`,

  adaptiveRecommendations: `Based on the student's current progress and performance history, generate adaptive study recommendations:

Current Progress:
- Course completion: {completionPercentage}%
- Recent test scores: {recentScores}
- Study time: {studyTime} minutes
- Current topic: {currentTopic}

Performance History:
{performanceHistory}

Generate 5-7 specific, actionable recommendations that adapt to the student's current level and learning patterns. Focus on:
1. Immediate next steps
2. Areas needing attention
3. Study method adjustments
4. Time management
5. Difficulty progression

Return as a JSON array of recommendation strings.`,

  // Chat Service Prompts
  contextualResponse: `You are an AI study tutor. Respond to the student's message with personalised, helpful guidance.

Student Context:
{context}

Previous conversation:
{previousMessages}

Current message: {message}

Provide a helpful, personalised response that:
1. Directly addresses the student's question
2. Uses appropriate difficulty level
3. Matches their learning style
4. References previous context when relevant
5. Suggests next steps or related topics
6. Maintains an encouraging, supportive tone

Keep the response concise but informative (2-3 paragraphs max).`,

  studySuggestions: `Based on the student's recent conversation and learning profile, generate 3-5 personalised study suggestions.

Context:
{context}

Recent topics discussed:
{recentTopics}

Generate specific, actionable study suggestions that:
1. Build on recent conversations
2. Address weak areas
3. Match learning style
4. Are appropriate for their level
5. Include specific resources or methods

Return as a JSON array of suggestion strings.`,

  personalisedExplanation: `Explain "{topic}" in response to: "{question}"

Student Profile:
- Learning Style: {learningStyle}
- Difficulty Level: {difficulty}
- Explanation Preference: {preferredExplanationStyle}
- Weak Areas: {weakAreas}
- Strong Areas: {strongAreas}

Provide an explanation that:
1. Matches their learning style (use examples, diagrams, step-by-step, etc.)
2. Is appropriate for their difficulty level
3. Uses their preferred explanation style
4. Builds on their strong areas
5. Addresses potential confusion points
6. Includes practical examples or applications

Keep it clear, engaging, and personalised.`,

  // Analytics Service Prompts
  learningPatterns: `Analyse the following learning data and identify patterns:

Study Sessions ({sessionCount} sessions):
{studySessions}

Test Results ({testCount} tests):
{testResults}

Time Spent:
{timeSpent}

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

Format as JSON array with this structure:`,

  performancePrediction: `Predict future performance based on historical data and current trends:

Historical Data:
- Average test scores: {averageScores}
- Study consistency: {consistency}%
- Time per topic: {timePerTopic} minutes
- Improvement rate: {improvementRate}%

Current Trends:
- Recent performance: {recentPerformance}%
- Study frequency: {studyFrequency} sessions/week
- Focus areas: {focusAreas}

Planned Study:
{plannedStudy}

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

Format as JSON array:`,

  // Content Generation Prompts
  flashcards: `Generate {count} flashcards about "{topic}" for a {difficulty} level student.

Learning Style: {learningStyle}
Context: {context}
User Level: {userLevel}

Requirements:
{requirements}

For each flashcard, provide:
1. Front side (question/term/concept)
2. Back side (answer/definition/explanation)
3. Difficulty level (easy/medium/hard)
4. Category/topic area
5. Optional hints for difficult cards

Make the content:
- Appropriate for {difficulty} level
- Engaging and memorable
- Progressive in difficulty
- Include practical examples
- Use {learningStyle} learning techniques

Format as JSON:`,

  studyNotes: `Generate comprehensive study notes about "{topic}" for a {difficulty} level student.

Learning Style: {learningStyle}
Context: {context}
User Level: {userLevel}

Requirements:
{requirements}

Create:
1. A detailed, well-structured note
2. A concise summary
3. Key points (5-7 bullet points)
4. Study questions (3-5 questions to test understanding)
5. Related topics to explore

Structure the content for {learningStyle} learning:
- Use clear headings and subheadings
- Include examples and practical applications
- Make it scannable and easy to review
- Include visual cues if appropriate

Format as JSON:`,

  quizContent: `Generate {count} quiz questions about "{topic}" for a {difficulty} level student.

Learning Style: {learningStyle}
Context: {context}
User Level: {userLevel}

Requirements:
{requirements}

For each question, provide:
1. Clear, unambiguous question
2. 4 multiple choice options
3. Correct answer
4. Detailed explanation
5. Difficulty level (easy/medium/hard)
6. Category/topic area
7. Optional hints

Make questions:
- Appropriate for {difficulty} level
- Test both knowledge and understanding
- Include practical applications
- Progress from easier to harder
- Avoid trick questions

Format as JSON:`,

  contentSummary: `Summarise the following content about "{topic}":

Content:
{content}

Learning Style: {learningStyle}

Create:
1. A concise summary (2-3 paragraphs)
2. Key points (5-7 bullet points)
3. Study questions (3-5 questions to test understanding)
4. Related topics to explore

Make it appropriate for {learningStyle} learning and easy to review.

Format as JSON:`,

  personalisedExplanation: `Explain "{topic}" in response to: "{question}"

Student Profile:
- Learning Style: {learningStyle}
- Difficulty Level: {difficulty}
- User Level: {userLevel}

Provide a personalised explanation that:
1. Directly answers the question
2. Uses {learningStyle} learning techniques
3. Is appropriate for {difficulty} level
4. Includes practical examples
5. Uses analogies and visual cues
6. Builds understanding progressively

Format as JSON:`,

  adaptiveContent: `Generate {contentType} content about "{topic}" that adapts to the student's performance:

Performance Data:
- Weak Areas: {weakAreas}
- Strong Areas: {strongAreas}
- Recent Scores: {recentScores}
- Study Time: {studyTime} minutes

Create content that:
1. Focuses more on weak areas
2. Builds on strong areas
3. Matches their study time availability
4. Adjusts difficulty based on recent scores
5. Provides extra practice for struggling concepts
6. Includes reinforcement for mastered topics

Format as JSON with appropriate structure for {contentType}.`,

  contentRecommendations: `Generate personalised content recommendations for a student:

Current Progress:
- Completed Topics: {completedTopics}
- Current Topic: {currentTopic}
- Progress: {progress}%
- Study Time: {availableTime} minutes available

Learning Goals:
{learningGoals}

Recommend:
1. Specific content types to study next
2. A daily study plan
3. Focus areas that need attention

Format as JSON:`
};

// Helper function to replace placeholders in prompts
export const formatPrompt = (prompt: string, replacements: Record<string, string | number>): string => {
  let formattedPrompt = prompt;
  Object.entries(replacements).forEach(([key, value]) => {
    formattedPrompt = formattedPrompt.replace(new RegExp(`{${key}}`, 'g'), String(value));
  });
  return formattedPrompt;
};
