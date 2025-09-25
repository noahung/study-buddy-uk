import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bot,
  User,
  Send,
  Mic,
  MoreHorizontal,
  HelpCircle,
  Lightbulb,
  Zap,
} from 'lucide-react-native';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { theme, spacing, typography, neumorphicShadow } from '../styles';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Mode {
  id: string;
  label: string;
  icon: any;
  color: string;
}

interface Props {
  onNavigate: (screen: string) => void;
  onOpenSidebar: () => void;
}

const { width } = Dimensions.get('window');

const AIChatScreen: React.FC<Props> = ({ onNavigate, onOpenSidebar }) => {
  const [message, setMessage] = useState('');
  const [activeMode, setActiveMode] = useState('qa');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI study assistant. How can I help you learn today?",
      timestamp: new Date(),
    },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  const modes: Mode[] = [
    { id: 'qa', label: 'Q&A', icon: HelpCircle, color: '#3b82f6' },
    { id: 'explain', label: 'Explain Simply', icon: Lightbulb, color: '#10b981' },
    { id: 'quiz', label: 'Quiz Me', icon: Zap, color: '#8b5cf6' },
  ];

  const suggestedPrompts = [
    "Explain React hooks",
    "Quiz me on JavaScript", 
    "What is state management?",
    "Help with async/await"
  ];

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: getAIResponse(message, activeMode),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userMessage: string, mode: string): string => {
    const responses: Record<string, string> = {
      qa: "That's a great question! Based on the topic you're asking about, here's a comprehensive explanation...",
      explain: "Let me break this down in simple terms for you. Think of it like this...",
      quiz: "Great! Let's test your knowledge. Here's a question for you: What is the main difference between..."
    };
    return responses[mode] || responses.qa;
  };

  const handlePromptClick = (prompt: string) => {
    setMessage(prompt);
  };

  const renderModeButton = (mode: Mode) => {
    const isActive = activeMode === mode.id;
    const Icon = mode.icon;

    return (
      <TouchableOpacity
        key={mode.id}
        onPress={() => setActiveMode(mode.id)}
        style={[
          styles.modeButton,
          {
            backgroundColor: isActive ? mode.color : theme.surface,
            ...neumorphicShadow.sm,
          }
        ]}
      >
        <Icon 
          size={16} 
          color={isActive ? theme.surface : theme.text.secondary} 
        />
        <Text 
          variant="caption"
          style={{ 
            color: isActive ? theme.surface : theme.text.secondary,
            marginLeft: spacing[2]
          }}
        >
          {mode.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMessage = (msg: Message) => {
    const isUser = msg.type === 'user';
    
    return (
      <View
        key={msg.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
            neumorphicShadow.md,
          ]}
        >
          {!isUser && (
            <View style={styles.aiIconContainer}>
              <Bot size={12} color={theme.surface} />
            </View>
          )}
          <View style={styles.messageContent}>
            <Text 
              variant="body"
              style={{ 
                color: isUser ? theme.surface : theme.text.primary,
                lineHeight: 20
              }}
            >
              {msg.content}
            </Text>
            <Text 
              variant="caption"
              style={{
                color: isUser ? 'rgba(255,255,255,0.7)' : theme.text.secondary,
                marginTop: spacing[2]
              }}
            >
              {msg.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.aiMessageContainer]}>
        <View style={[styles.messageBubble, styles.aiBubble, neumorphicShadow.md]}>
          <View style={styles.aiIconContainer}>
            <Bot size={12} color={theme.surface} />
          </View>
          <View style={styles.typingContainer}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.typingDot,
                  {
                    opacity: typingAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                    transform: [
                      {
                        scale: typingAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.2],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderSuggestedPrompts = () => {
    if (messages.length > 1) return null;

    return (
      <View style={styles.suggestedContainer}>
        <Text variant="body" style={{ color: theme.text.secondary, marginBottom: spacing[3] }}>
          Try asking:
        </Text>
        <View style={styles.promptsContainer}>
          {suggestedPrompts.map((prompt, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePromptClick(prompt)}
              style={[styles.promptButton, neumorphicShadow.sm]}
            >
              <Text variant="caption" style={{ color: theme.text.primary }}>
                {prompt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={[styles.aiAvatarLarge, neumorphicShadow.md]}>
              <Bot size={20} color={theme.surface} />
            </View>
            <View style={styles.headerText}>
              <Text variant="h3" style={{ color: theme.text.primary }}>
                AI Chat
              </Text>
              <Text variant="caption" style={{ color: theme.text.secondary }}>
                Your personal study assistant
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => onOpenSidebar()}
            style={[styles.menuButton, neumorphicShadow.sm]}
          >
            <MoreHorizontal size={20} color={theme.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeContainer}>
          {modes.map(renderModeButton)}
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          {renderTypingIndicator()}
          {renderSuggestedPrompts()}
        </ScrollView>

        {/* Input Area */}
        <View style={[styles.inputContainer, neumorphicShadow.lg]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask me anything..."
              placeholderTextColor={theme.text.secondary}
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSendMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={styles.micButton}>
              <Mic size={20} color={theme.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!message.trim()}
              style={[
                styles.sendButton,
                {
                  opacity: message.trim() ? 1 : 0.5,
                  ...neumorphicShadow.sm,
                }
              ]}
            >
              <Send size={20} color={theme.surface} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  headerText: {
    flex: 1,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing[6],
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 12,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: spacing[6],
  },
  messagesContent: {
    paddingVertical: spacing[4],
    gap: spacing[4],
  },
  messageContainer: {
    maxWidth: width * 0.8,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 12,
    padding: spacing[4],
  },
  userBubble: {
    backgroundColor: theme.primary,
  },
  aiBubble: {
    backgroundColor: theme.surface,
    flexDirection: 'row',
  },
  aiIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[2],
    alignSelf: 'flex-start',
    marginTop: spacing[1],
  },
  messageContent: {
    flex: 1,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.text.secondary,
  },
  suggestedContainer: {
    paddingVertical: spacing[4],
  },
  promptsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  promptButton: {
    backgroundColor: theme.surface,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 12,
  },
  inputContainer: {
    backgroundColor: theme.surface,
    margin: spacing[6],
    borderRadius: 12,
    padding: spacing[3],
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing[3],
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    fontSize: 16,
    color: theme.text.primary,
    paddingVertical: spacing[2],
  },
  micButton: {
    padding: spacing[2],
    borderRadius: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AIChatScreen;