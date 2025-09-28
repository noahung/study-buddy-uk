import { GEMINI_API_KEY } from '../constants';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  courseId?: string;
  type?: 'general' | 'course-specific' | 'quiz-help' | 'note-summary';
}

interface AIResponse {
  content: string;
  suggestions?: string[];
  relatedTopics?: string[];
  confidence?: number;
}

// Gemini API Service
class AIService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    this.apiKey = GEMINI_API_KEY;
  }

  // Generate AI chat response
  async generateChatResponse(
    message: string,
    context?: {
      courseId?: string;
      courseName?: string;
      previousMessages?: ChatMessage[];
      userLevel?: 'beginner' | 'intermediate' | 'advanced';
    }
  ): Promise<AIResponse> {
    try {
      const prompt = this.buildChatPrompt(message, context);
      
      const response = await fetch(
        `${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

      return {
        content: aiContent,
        suggestions: this.extractSuggestions(aiContent),
        relatedTopics: this.extractRelatedTopics(aiContent),
        confidence: 0.8
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate AI response. Please try again.');
    }
  }

  // Generate quiz questions
  async generateQuizQuestions(
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number = 5,
    courseContext?: string
  ): Promise<any[]> {
    try {
      const prompt = this.buildQuizPrompt(topic, difficulty, count, courseContext);
      
      const response = await fetch(
        `${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.8,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      return this.parseQuizQuestions(aiContent);
    } catch (error) {
      console.error('AI Quiz Generation Error:', error);
      throw new Error('Failed to generate quiz questions. Please try again.');
    }
  }

  // Generate flashcard content
  async generateFlashcards(
    topic: string,
    count: number = 10,
    courseContext?: string
  ): Promise<any[]> {
    try {
      const prompt = this.buildFlashcardPrompt(topic, count, courseContext);
      
      const response = await fetch(
        `${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.6,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      return this.parseFlashcards(aiContent);
    } catch (error) {
      console.error('AI Flashcard Generation Error:', error);
      throw new Error('Failed to generate flashcards. Please try again.');
    }
  }

  // Generate note summary
  async generateNoteSummary(
    notes: string,
    courseContext?: string
  ): Promise<AIResponse> {
    try {
      const prompt = this.buildSummaryPrompt(notes, courseContext);
      
      const response = await fetch(
        `${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.5,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return {
        content: aiContent,
        suggestions: this.extractSuggestions(aiContent),
        relatedTopics: this.extractRelatedTopics(aiContent),
        confidence: 0.9
      };
    } catch (error) {
      console.error('AI Summary Generation Error:', error);
      throw new Error('Failed to generate note summary. Please try again.');
    }
  }

  // Build chat prompt
  private buildChatPrompt(message: string, context?: any): string {
    let prompt = `You are Study Buddy, an AI learning assistant specialised in UK professional certification exams. `;
    
    if (context?.courseName) {
      prompt += `The user is studying ${context.courseName}. `;
    }
    
    if (context?.userLevel) {
      prompt += `The user's level is ${context.userLevel}. `;
    }
    
    prompt += `Provide helpful, accurate, and encouraging responses using British English spelling and terminology throughout. `;
    prompt += `Use 'ise' instead of 'ize', 'our' instead of 'or' (e.g., 'colour', 'favour'), 're' instead of 'er' (e.g., 'centre', 'theatre'), and other standard British English conventions. `;
    prompt += `Keep explanations clear and concise. `;
    prompt += `If the question is about a specific topic, provide relevant examples and practical applications. `;
    prompt += `Always encourage learning and offer to help with related topics.\n\n`;
    prompt += `User question: ${message}`;
    
    return prompt;
  }

  // Build quiz generation prompt
  private buildQuizPrompt(topic: string, difficulty: string, count: number, courseContext?: string): string {
    let prompt = `Generate ${count} ${difficulty} multiple-choice quiz questions about "${topic}" using British English spelling and terminology throughout. `;
    
    if (courseContext) {
      prompt += `Context: ${courseContext}. `;
    }
    
    prompt += `Format each question as JSON with: question, options (array of 4), correctAnswer (index), explanation. `;
    prompt += `Make questions practical and relevant to UK professional certification standards. `;
    prompt += `Use British English spelling (e.g., 'organise' not 'organize', 'colour' not 'color'). `;
    prompt += `Return only valid JSON array.`;
    
    return prompt;
  }

  // Build flashcard prompt
  private buildFlashcardPrompt(topic: string, count: number, courseContext?: string): string {
    let prompt = `Generate ${count} flashcards about "${topic}" using British English spelling and terminology throughout. `;
    
    if (courseContext) {
      prompt += `Context: ${courseContext}. `;
    }
    
    prompt += `Format each flashcard as JSON with: front, back, category, difficulty. `;
    prompt += `Make them concise but informative, suitable for UK professional certification study. `;
    prompt += `Use British English spelling (e.g., 'organise' not 'organize', 'colour' not 'color'). `;
    prompt += `Return only valid JSON array.`;
    
    return prompt;
  }

  // Build summary prompt
  private buildSummaryPrompt(notes: string, courseContext?: string): string {
    let prompt = `Summarise these study notes in a clear, structured way using British English spelling and terminology throughout. `;
    
    if (courseContext) {
      prompt += `Context: ${courseContext}. `;
    }
    
    prompt += `Create key points, important concepts, and practical applications. `;
    prompt += `Make it suitable for UK professional certification exam preparation. `;
    prompt += `Use British English spelling (e.g., 'organise' not 'organize', 'colour' not 'color').\n\n`;
    prompt += `Notes: ${notes}`;
    
    return prompt;
  }

  // Extract suggestions from AI response
  private extractSuggestions(content: string): string[] {
    // Simple extraction - look for numbered lists or bullet points
    const suggestions = content.match(/\d+\.\s+([^\n]+)/g) || 
                      content.match(/•\s+([^\n]+)/g) || 
                      content.match(/-\s+([^\n]+)/g);
    
    return suggestions ? suggestions.map(s => s.replace(/^\d+\.\s+|^[•-]\s+/, '').trim()) : [];
  }

  // Extract related topics from AI response
  private extractRelatedTopics(content: string): string[] {
    // Look for phrases like "related to", "also consider", "you might want to study"
    const topicMatches = content.match(/(?:related to|also consider|you might want to study|other topics include)[^.!?]*/gi);
    
    if (topicMatches) {
      return topicMatches[0].split(/[,;]/).map(topic => topic.trim());
    }
    
    return [];
  }

  // Parse quiz questions from AI response
  private parseQuizQuestions(content: string): any[] {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: return empty array
      return [];
    } catch (error) {
      console.error('Error parsing quiz questions:', error);
      return [];
    }
  }

  // Parse flashcards from AI response
  private parseFlashcards(content: string): any[] {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: return empty array
      return [];
    } catch (error) {
      console.error('Error parsing flashcards:', error);
      return [];
    }
  }
}

export const aiService = new AIService();
export default aiService;
