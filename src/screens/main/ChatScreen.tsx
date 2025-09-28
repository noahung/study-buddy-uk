import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useCourse } from '../../contexts/CourseContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { NeumorphicCard, NeumorphicButton, NeumorphicInput } from '../../components/ui';
import PremiumGate from '../../components/common/PremiumGate';
import { Ionicons } from '@expo/vector-icons';
import { aiService } from '../../services/aiService';
import { 
  generateContextualResponse, 
  generateStudySuggestions,
  generatePersonalizedExplanation,
  ChatSession,
  LearningProfile
} from '../../services/aiChatService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  courseId?: string;
  type?: 'general' | 'course-specific' | 'quiz-help' | 'note-summary';
}

interface ChatScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const { courses, coursesLoading, loadCourses } = useCourse();
  const { isPremium, canUseFeature, incrementUsage } = useSubscription();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [chatType, setChatType] = useState<'general' | 'course-specific' | 'quiz-help' | 'note-summary'>('general');
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [learningProfile, setLearningProfile] = useState<LearningProfile | null>(null);
  const [studySuggestions, setStudySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadCourses();
    // Add welcome message
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your AI Study Buddy. I can help you with course questions, quiz preparation, note summaries, and general study guidance. What would you like to know?',
      timestamp: new Date(),
      type: 'general'
    }]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Check if user can use AI chat feature
    if (!isPremium && !canUseFeature('aiChatSessions')) {
      Alert.alert(
        'Usage Limit Reached',
        'You have reached your daily limit for AI chat sessions. Upgrade to Premium for unlimited access.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => onNavigate?.('subscription') }
        ]
      );
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      courseId: selectedCourse || undefined,
      type: chatType
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    // Increment usage for free users
    if (!isPremium) {
      await incrementUsage('aiChatSessions');
    }

    try {
      const course = courses.find(c => c.id === selectedCourse);
      const context = {
        courseId: selectedCourse || undefined,
        courseName: course?.name,
        previousMessages: messages.slice(-5), // Last 5 messages for context
        userLevel: 'intermediate' as const
      };

      const response = await aiService.generateChatResponse(inputMessage, context);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        courseId: selectedCourse || undefined,
        type: chatType
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear the chat history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setMessages([{
              id: 'welcome',
              role: 'assistant',
              content: 'Hello! I\'m your AI Study Buddy. I can help you with course questions, quiz preparation, note summaries, and general study guidance. What would you like to know?',
              timestamp: new Date(),
              type: 'general'
            }]);
          },
        },
      ]
    );
  };

  const renderMessage = (message: ChatMessage) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.role === 'user' ? styles.userMessage : styles.assistantMessage,
      ]}
    >
      <NeumorphicCard
        style={[
          styles.messageCard,
          message.role === 'user' && styles.userMessageCard,
        ]}
        variant={message.role === 'user' ? 'inset' : 'small'}
      >
        <View style={styles.messageHeader}>
          <View style={styles.messageInfo}>
            <Text style={[
              styles.messageRole,
              { color: message.role === 'user' ? theme.colors.primary : theme.colors.textSecondary }
            ]}>
              {message.role === 'user' ? 'You' : 'Study Buddy'}
            </Text>
            <Text style={[styles.messageTime, { color: theme.colors.textSecondary }]}>
              {message.timestamp.toLocaleTimeString()}
            </Text>
          </View>
          {message.type && message.type !== 'general' && (
            <View style={[styles.typeBadge, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.typeText, { color: theme.colors.textSecondary }]}>
                {message.type.replace('-', ' ')}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.messageContent, { color: theme.colors.text }]}>
          {message.content}
        </Text>
      </NeumorphicCard>
    </View>
  );

  const quickQuestions = [
    'Explain this concept in simple terms',
    'Help me prepare for an exam',
    'Create a study plan',
    'Summarize my notes',
    'Quiz me on this topic',
  ];

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>AI Study Buddy</Text>
        <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
          <Ionicons name="refresh" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Chat Type Selector */}
      <View style={styles.chatTypeContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chatTypeList}>
            {[
              { id: 'general', label: 'General', icon: 'chatbubbles' },
              { id: 'course-specific', label: 'Course Help', icon: 'book' },
              { id: 'quiz-help', label: 'Quiz Prep', icon: 'help-circle' },
              { id: 'note-summary', label: 'Note Summary', icon: 'document-text' },
            ].map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.chatTypeCard,
                  chatType === type.id && styles.selectedChatType,
                  { backgroundColor: chatType === type.id ? theme.colors.primary : theme.colors.background }
                ]}
                onPress={() => setChatType(type.id as any)}
              >
                <Ionicons 
                  name={type.icon as any} 
                  size={16} 
                  color={chatType === type.id ? theme.colors.background : theme.colors.text} 
                />
                <Text style={[
                  styles.chatTypeText,
                  { color: chatType === type.id ? theme.colors.background : theme.colors.text }
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Course Selector */}
      {chatType === 'course-specific' && (
        <View style={styles.courseSelector}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Select Course
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.courseList}>
              <TouchableOpacity
                style={[
                  styles.courseCard,
                  !selectedCourse && styles.selectedCourse,
                  { backgroundColor: !selectedCourse ? theme.colors.primary : theme.colors.background }
                ]}
                onPress={() => setSelectedCourse(null)}
              >
                <Text style={[
                  styles.courseText,
                  { color: !selectedCourse ? theme.colors.background : theme.colors.text }
                ]}>
                  General
                </Text>
              </TouchableOpacity>
              
              {courses.map((course) => (
                <TouchableOpacity
                  key={course.id}
                  style={[
                    styles.courseCard,
                    selectedCourse === course.id && styles.selectedCourse,
                    { backgroundColor: selectedCourse === course.id ? theme.colors.primary : theme.colors.background }
                  ]}
                  onPress={() => setSelectedCourse(course.id)}
                >
                  <Text style={[
                    styles.courseText,
                    { color: selectedCourse === course.id ? theme.colors.background : theme.colors.text }
                  ]}>
                    {course.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Quick Questions */}
      <View style={styles.quickQuestionsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Quick Questions
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.quickQuestionsList}>
            {quickQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickQuestionCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => handleQuickQuestion(question)}
              >
                <Text style={[styles.quickQuestionText, { color: theme.colors.text }]}>
                  {question}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(renderMessage)}
        
        {isLoading && (
          <View style={styles.loadingMessage}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              AI is thinking...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Error Message */}
      {error && (
        <NeumorphicCard style={styles.errorCard}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity onPress={() => setError(null)}>
            <Ionicons name="close" size={16} color={theme.colors.error} />
          </TouchableOpacity>
        </NeumorphicCard>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
          <NeumorphicInput
            placeholder="Ask me anything about your studies..."
            value={inputMessage}
            onChangeText={setInputMessage}
            style={styles.messageInput}
            multiline
          />
        <NeumorphicButton
          variant="primary"
          size="md"
          onPress={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          style={styles.sendButton}
        >
          <Ionicons name="send" size={16} color="white" />
        </NeumorphicButton>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
  },
  chatTypeContainer: {
    marginBottom: 16,
  },
  chatTypeList: {
    flexDirection: 'row',
    gap: 12,
  },
  chatTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  selectedChatType: {
    // Additional styles for selected state
  },
  chatTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  courseSelector: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  courseList: {
    flexDirection: 'row',
    gap: 12,
  },
  courseCard: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedCourse: {
    // Additional styles for selected state
  },
  courseText: {
    fontSize: 12,
    fontWeight: '500',
  },
  quickQuestionsContainer: {
    marginBottom: 16,
  },
  quickQuestionsList: {
    flexDirection: 'row',
    gap: 8,
  },
  quickQuestionCard: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  quickQuestionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  assistantMessage: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '80%',
    padding: 12,
  },
  userMessageCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageInfo: {
    flex: 1,
  },
  messageRole: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageTime: {
    fontSize: 10,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 8,
    textTransform: 'uppercase',
  },
  messageContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  loadingText: {
    fontSize: 12,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    marginRight: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatScreen;