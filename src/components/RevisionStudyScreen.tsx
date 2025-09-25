import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Clock, 
  Brain, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Lightbulb,
  BookOpen,
  Target,
  TrendingUp,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface RevisionStudyScreenProps {
  onBack: () => void;
  topicId?: string;
}

export default function RevisionStudyScreen({ onBack, topicId }: RevisionStudyScreenProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyProgress, setStudyProgress] = useState<{ [key: number]: 'easy' | 'medium' | 'hard' | null }>({});
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    needsReview: 0,
    timeSpent: 0
  });
  const [studyMode, setStudyMode] = useState<'review' | 'test' | 'focus'>('review');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Sample study content - in real app this would come from props/API
  const studyCards = [
    {
      id: 1,
      topic: 'React State Management',
      question: 'What is the difference between useState and useReducer in React?',
      answer: 'useState is ideal for simple state logic with primitive values, while useReducer is better for complex state logic involving multiple sub-values or when the next state depends on the previous one. useReducer also provides better performance for components that trigger deep updates.',
      difficulty: 'medium',
      tags: ['React', 'Hooks', 'State'],
      examples: [
        'useState: const [count, setCount] = useState(0)',
        'useReducer: const [state, dispatch] = useReducer(reducer, initialState)'
      ],
      hints: [
        'Think about complexity of state updates',
        'Consider performance implications',
        'Remember the useReducer pattern follows Redux principles'
      ]
    },
    {
      id: 2,
      topic: 'JavaScript Promises',
      question: 'Explain the difference between Promise.all() and Promise.allSettled()',
      answer: 'Promise.all() resolves when all promises resolve, but rejects immediately if any promise rejects. Promise.allSettled() waits for all promises to settle (resolve or reject) and returns an array of results with status and value/reason for each promise.',
      difficulty: 'hard',
      tags: ['JavaScript', 'Async', 'Promises'],
      examples: [
        'Promise.all([p1, p2, p3]).then(results => {})',
        'Promise.allSettled([p1, p2, p3]).then(results => {})'
      ],
      hints: [
        'Consider what happens when one promise fails',
        'Think about getting results from all promises regardless of outcome',
        'Remember allSettled is newer and more resilient'
      ]
    },
    {
      id: 3,
      topic: 'CSS Grid Layout',
      question: 'How do you create a responsive grid that adapts to different screen sizes?',
      answer: 'Use CSS Grid with auto-fit or auto-fill in repeat(), minmax() for flexible sizing, and media queries for breakpoints. Example: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) creates a responsive grid where columns automatically adjust based on available space.',
      difficulty: 'medium',
      tags: ['CSS', 'Grid', 'Responsive'],
      examples: [
        'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
        'grid-template-areas: "header header" "sidebar main" "footer footer"'
      ],
      hints: [
        'auto-fit vs auto-fill behavior',
        'minmax() function for flexible sizing',
        'Consider using grid-template-areas for complex layouts'
      ]
    }
  ];

  const currentCard = studyCards[currentCardIndex];
  const totalCards = studyCards.length;
  const progress = ((currentCardIndex + 1) / totalCards) * 100;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
        setSessionStats(prev => ({ ...prev, timeSpent: prev.timeSpent + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCardResponse = (difficulty: 'easy' | 'medium' | 'hard') => {
    setStudyProgress(prev => ({ ...prev, [currentCard.id]: difficulty }));
    
    if (difficulty === 'easy') {
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setSessionStats(prev => ({ ...prev, needsReview: prev.needsReview + 1 }));
    }

    // Auto-advance to next card after response
    setTimeout(() => {
      if (currentCardIndex < totalCards - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
      }
    }, 500);
  };

  const nextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const resetCard = () => {
    setIsFlipped(false);
    setStudyProgress(prev => ({ ...prev, [currentCard.id]: null }));
  };

  const toggleSession = () => {
    setIsSessionActive(!isSessionActive);
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="p-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 rounded-xl"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
              }}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Revision Study</h1>
              <p className="text-sm text-gray-600">{currentCard.topic}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSession}
              className={`p-2 rounded-xl ${isSessionActive ? 'text-red-600' : 'text-green-600'}`}
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
              }}
            >
              {isSessionActive ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="p-2 rounded-xl"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
              }}
            >
              {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </Button>
          </div>
        </motion.div>

        {/* Progress & Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white p-4 rounded-xl mb-6"
          style={{
            boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                Card {currentCardIndex + 1} of {totalCards}
              </span>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock size={14} />
                <span>{formatTime(sessionTimer)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center text-green-600">
                <CheckCircle size={14} className="mr-1" />
                {sessionStats.correct}
              </span>
              <span className="flex items-center text-orange-600">
                <RotateCcw size={14} className="mr-1" />
                {sessionStats.needsReview}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>
      </div>

      {/* Study Card */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentCardIndex}-${isFlipped}`}
              initial={{ opacity: 0, rotateY: isFlipped ? -90 : 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: isFlipped ? 90 : -90 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl min-h-[400px]"
              style={{
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)'
              }}
            >
              {!isFlipped ? (
                // Question Side
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                        style={{
                          boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        <Brain className="text-white" size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Question</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {currentCard.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h2 className="text-lg font-medium text-gray-900 leading-relaxed">
                    {currentCard.question}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Lightbulb size={14} className="mr-1 text-yellow-500" />
                        Hints
                      </h4>
                      <div className="space-y-2">
                        {currentCard.hints.map((hint, index) => (
                          <p key={index} className="text-sm text-gray-600 bg-yellow-50 p-2 rounded-lg">
                            {hint}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsFlipped(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl py-3"
                    style={{
                      boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    Show Answer
                  </Button>
                </div>
              ) : (
                // Answer Side
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
                        style={{
                          boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        <CheckCircle className="text-white" size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Answer</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetCard}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <RotateCcw size={16} />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-800 leading-relaxed">
                      {currentCard.answer}
                    </p>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <BookOpen size={14} className="mr-1 text-blue-500" />
                        Code Examples
                      </h4>
                      <div className="space-y-2">
                        {currentCard.examples.map((example, index) => (
                          <code key={index} className="block text-sm bg-gray-100 p-3 rounded-lg text-gray-800">
                            {example}
                          </code>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">How well did you know this?</p>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        onClick={() => handleCardResponse('hard')}
                        variant="outline"
                        className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 rounded-xl"
                        style={{
                          boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <XCircle size={16} className="mr-1" />
                        Need Review
                      </Button>
                      <Button
                        onClick={() => handleCardResponse('medium')}
                        variant="outline"
                        className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 rounded-xl"
                        style={{
                          boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <RotateCcw size={16} className="mr-1" />
                        Okay
                      </Button>
                      <Button
                        onClick={() => handleCardResponse('easy')}
                        variant="outline"
                        className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 rounded-xl"
                        style={{
                          boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Easy
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <Button
            onClick={previousCard}
            disabled={currentCardIndex === 0}
            variant="outline"
            className="flex items-center space-x-2 rounded-xl"
            style={{
              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
            }}
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-2">
            {studyCards.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentCardIndex
                    ? 'bg-blue-500 w-6'
                    : studyProgress[studyCards[index].id]
                      ? studyProgress[studyCards[index].id] === 'easy'
                        ? 'bg-green-500'
                        : studyProgress[studyCards[index].id] === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextCard}
            disabled={currentCardIndex === totalCards - 1}
            variant="outline"
            className="flex items-center space-x-2 rounded-xl"
            style={{
              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
            }}
          >
            <span>Next</span>
            <ArrowLeft size={16} className="rotate-180" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}