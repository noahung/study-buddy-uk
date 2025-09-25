import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronRight, Send, Mail, MessageCircle, Book } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export default function HelpSupportScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    email: ''
  });

  const faqData = [
    {
      question: 'How do I reset my password?',
      answer: 'You can reset your password by going to Settings > Account Settings > Change Password. You can also use the "Forgot Password" link on the login screen.'
    },
    {
      question: 'Can I access courses offline?',
      answer: 'Yes! Premium users can download courses for offline access. Simply tap the download icon next to any lesson to save it to your device.'
    },
    {
      question: 'How does the AI chat feature work?',
      answer: 'Our AI tutor uses advanced machine learning to understand your questions and provide personalized explanations. You can ask questions in natural language about any topic.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Absolutely! You can cancel your subscription at any time from Settings > Subscription. Your access will continue until the end of your current billing period.'
    },
    {
      question: 'How do I track my study progress?',
      answer: 'Your progress is automatically tracked in the Revision Hub. You can see detailed analytics, study streaks, and personalized recommendations.'
    },
    {
      question: 'Are there group study features?',
      answer: 'Currently, Master Study focuses on individual learning. However, you can share notes and flashcards with friends through the share feature.'
    },
    {
      question: 'How accurate is the AI tutor?',
      answer: 'Our AI tutor is trained on verified educational content and continuously improved. However, we recommend cross-referencing important information with official sources.'
    },
    {
      question: 'Can I request new courses or topics?',
      answer: 'Yes! We love hearing from our users. You can request new content through the contact form below or in the app feedback section.'
    }
  ];

  const quickActions = [
    {
      title: 'Email Support',
      description: 'Get help via email',
      icon: Mail,
      color: 'from-blue-500 to-cyan-500',
      action: 'Email us at support@masterstudy.com'
    },
    {
      title: 'Live Chat',
      description: 'Chat with our team',
      icon: MessageCircle,
      color: 'from-green-500 to-emerald-500',
      action: 'Available 24/7 for Premium users'
    },
    {
      title: 'User Guide',
      description: 'Learn how to use the app',
      icon: Book,
      color: 'from-purple-500 to-pink-500',
      action: 'Comprehensive tutorials and guides'
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Contact form submitted:', contactForm);
    // Reset form
    setContactForm({ subject: '', message: '', email: '' });
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="p-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div 
            className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
            style={{
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.15), -4px -4px 8px rgba(255, 255, 255, 0.9)'
            }}
          >
            <HelpCircle className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Help & Support</h1>
          <p className="text-gray-600 mb-6">We're here to help you succeed</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="bg-white p-4 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.9)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${action.color.replace('from-', '').replace(' to-', ', ')})`,
                        boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <Icon className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{action.action}</p>
                    </div>
                    <ChevronRight className="text-gray-400" size={20} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div
            className="bg-white rounded-xl overflow-hidden"
            style={{
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)'
            }}
          >
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                className={`border-b border-gray-100 last:border-b-0`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="text-gray-400" size={20} />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Contact Form */}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="bg-white p-6 rounded-xl"
          style={{
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)'
          }}
        >
          <h3 className="font-medium text-gray-900 mb-4">Contact Us</h3>
          <p className="text-gray-600 text-sm mb-6">
            Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
          </p>
          
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Your email address"
              value={contactForm.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="rounded-xl border-0"
              style={{
                boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.8)',
                background: 'rgba(248, 250, 252, 0.8)'
              }}
            />
            
            <Input
              type="text"
              placeholder="Subject"
              value={contactForm.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="rounded-xl border-0"
              style={{
                boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.8)',
                background: 'rgba(248, 250, 252, 0.8)'
              }}
            />
            
            <Textarea
              placeholder="Describe your issue or question..."
              value={contactForm.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={4}
              className="rounded-xl border-0 resize-none"
              style={{
                boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.8)',
                background: 'rgba(248, 250, 252, 0.8)'
              }}
            />
            
            <Button
              onClick={handleSubmit}
              disabled={!contactForm.email || !contactForm.subject || !contactForm.message}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
              style={{
                boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Send size={16} className="mr-2" />
              Send Message
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}