import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, MoreHorizontal, Bot, User, Lightbulb, HelpCircle, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function AIChatInterface() {
  const [message, setMessage] = useState('');
  const [activeMode, setActiveMode] = useState('qa');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI study assistant. How can I help you learn today?",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const modes = [
    { id: 'qa', label: 'Q&A', icon: HelpCircle, color: 'from-blue-500 to-cyan-500' },
    { id: 'explain', label: 'Explain Simply', icon: Lightbulb, color: 'from-green-500 to-emerald-500' },
    { id: 'quiz', label: 'Quiz Me', icon: Zap, color: 'from-purple-500 to-pink-500' }
  ];

  const suggestedPrompts = [
    "Explain React hooks",
    "Quiz me on JavaScript",
    "What is state management?",
    "Help with async/await"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: getAIResponse(message, activeMode),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userMessage: string, mode: string) => {
    const responses = {
      qa: "That's a great question! Based on the topic you're asking about, here's a comprehensive explanation...",
      explain: "Let me break this down in simple terms for you. Think of it like this...",
      quiz: "Great! Let's test your knowledge. Here's a question for you: What is the main difference between..."
    };
    return responses[mode as keyof typeof responses] || responses.qa;
  };

  const handlePromptClick = (prompt: string) => {
    setMessage(prompt);
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <div className="p-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
              }}
            >
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Chat</h1>
              <p className="text-sm text-gray-600">Your personal study assistant</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-xl"
            style={{
              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
            }}
          >
            <MoreHorizontal size={20} />
          </Button>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex space-x-2 mb-4"
        >
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <Button
                key={mode.id}
                variant="ghost"
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-gray-600'
                }`}
                style={{
                  background: isActive 
                    ? `linear-gradient(135deg, ${mode.color.replace('from-', '').replace(' to-', ', ')})`
                    : 'white',
                  boxShadow: isActive
                    ? 'inset 4px 4px 8px rgba(0, 0, 0, 0.2), 2px 2px 4px rgba(0, 0, 0, 0.1)'
                    : '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
                }}
              >
                <Icon size={16} />
                <span className="text-sm">{mode.label}</span>
              </Button>
            );
          })}
        </motion.div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-6 overflow-y-auto">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                      : 'bg-white text-gray-900'
                  }`}
                  style={{
                    boxShadow: msg.type === 'user'
                      ? '6px 6px 12px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.2)'
                      : '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <div className="flex items-start space-x-2">
                    {msg.type === 'ai' && (
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="text-white" size={12} />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className={`text-xs mt-2 ${
                        msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div
                className="bg-white px-4 py-3 rounded-xl"
                style={{
                  boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="text-white" size={12} />
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Prompts */}
      {messages.length === 1 && (
        <div className="px-6 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p className="text-sm text-gray-600 mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  onClick={() => handlePromptClick(prompt)}
                  className="px-3 py-2 bg-white text-gray-700 rounded-xl text-sm transition-all duration-200"
                  style={{
                    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white rounded-xl p-3"
          style={{
            boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
          }}
        >
          <div className="flex items-center space-x-3">
            <Input
              type="text"
              placeholder="Ask me anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 border-0 bg-transparent focus:ring-0 focus:outline-none"
            />
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700"
            >
              <Mic size={20} />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50"
              style={{
                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Send size={20} />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}