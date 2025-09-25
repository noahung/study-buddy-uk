import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, FileText, CreditCard, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: MessageCircle,
      title: 'AI-Powered Chat',
      description: 'Get instant answers to your questions with our intelligent AI tutor. Ask anything, anytime.',
      illustration: '🤖',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: CheckCircle,
      title: 'Smart Mock Tests',
      description: 'Practice with adaptive tests that adjust to your learning pace and identify weak areas.',
      illustration: '📝',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: CreditCard,
      title: 'Interactive Flashcards',
      description: 'Master concepts with spaced repetition flashcards designed for optimal memory retention.',
      illustration: '🧠',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header with progress */}
      <div className="p-6 pt-12">
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index <= currentSlide ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                style={{
                  width: index === currentSlide ? 32 : 8,
                  boxShadow: index === currentSlide 
                    ? '2px 2px 4px rgba(59, 130, 246, 0.3), inset 1px 1px 2px rgba(255, 255, 255, 0.5)'
                    : 'inset 1px 1px 2px rgba(0, 0, 0, 0.1)'
                }}
                animate={{
                  width: index === currentSlide ? 32 : 8,
                }}
              />
            ))}
          </div>
          <button
            onClick={onComplete}
            className="text-gray-500 hover:text-gray-700 transition-colors px-3 py-1 rounded-lg"
          >
            Skip
          </button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 px-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="text-center max-w-sm"
          >
            {/* Illustration */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <div 
                className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4"
                style={{
                  background: `linear-gradient(135deg, ${slides[currentSlide].gradient.replace('from-', '').replace(' to-', ', ')})`,
                  boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 4px 4px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="text-6xl">
                  {slides[currentSlide].illustration}
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                {slides[currentSlide].title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-6 pb-12">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center space-x-2 ${
              currentSlide === 0 ? 'opacity-0 pointer-events-none' : ''
            }`}
            style={{
              boxShadow: currentSlide > 0 
                ? '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.8)'
                : 'none'
            }}
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </Button>

          <Button
            onClick={nextSlide}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl transition-all duration-200"
            style={{
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.2), -2px -2px 4px rgba(255, 255, 255, 0.1)'
            }}
          >
            <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      {/* Swipe indicators */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{ x: [-10, 10, -10] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-gray-400 text-sm flex items-center space-x-2"
        >
          <span>Swipe to explore</span>
          <ChevronRight size={16} />
        </motion.div>
      </div>
    </div>
  );
}