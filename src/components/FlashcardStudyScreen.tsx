import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Check, X, Eye, EyeOff, Star, SkipForward } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface FlashcardStudyScreenProps {
  onBack: () => void;
}

export default function FlashcardStudyScreen({ onBack }: FlashcardStudyScreenProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studiedCards, setStudiedCards] = useState<number[]>([]);
  const [correctCards, setCorrectCards] = useState<number[]>([]);
  const [incorrectCards, setIncorrectCards] = useState<number[]>([]);

  const flashcards = [
    {
      id: 1,
      question: "What is the primary purpose of React's useEffect hook?",
      answer: "useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM. It runs after the render is committed to the screen.",
      difficulty: "Medium",
      category: "React Hooks"
    },
    {
      id: 2,
      question: "Explain the difference between controlled and uncontrolled components in React.",
      answer: "Controlled components have their form data handled by React component state, while uncontrolled components store their form data in the DOM itself. Controlled components use onChange handlers and value props.",
      difficulty: "Easy",
      category: "React Forms"
    },
    {
      id: 3,
      question: "What is Redux and when would you use it?",
      answer: "Redux is a predictable state container for JavaScript apps. It helps manage application state in a centralized store. Use it when you have complex state logic, many components need access to the same state, or you need predictable state updates.",
      difficulty: "Hard",
      category: "State Management"
    },
    {
      id: 4,
      question: "What is the Virtual DOM and how does it work?",
      answer: "The Virtual DOM is a JavaScript representation of the actual DOM. React uses it to improve performance by batching updates, comparing changes (diffing), and only updating the parts of the real DOM that have changed.",
      difficulty: "Medium",
      category: "React Concepts"
    },
    {
      id: 5,
      question: "Explain React's component lifecycle methods.",
      answer: "Lifecycle methods are hooks that allow you to tap into different phases of a component's life: mounting (componentDidMount), updating (componentDidUpdate), and unmounting (componentWillUnmount). In functional components, useEffect handles these phases.",
      difficulty: "Hard",
      category: "React Lifecycle"
    }
  ];

  const currentCard = flashcards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / flashcards.length) * 100;
  const isLastCard = currentCardIndex === flashcards.length - 1;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(true);
  };

  const handleCorrect = () => {
    if (!correctCards.includes(currentCard.id)) {
      setCorrectCards([...correctCards, currentCard.id]);
    }
    if (!studiedCards.includes(currentCard.id)) {
      setStudiedCards([...studiedCards, currentCard.id]);
    }
    nextCard();
  };

  const handleIncorrect = () => {
    if (!incorrectCards.includes(currentCard.id)) {
      setIncorrectCards([...incorrectCards, currentCard.id]);
    }
    if (!studiedCards.includes(currentCard.id)) {
      setStudiedCards([...studiedCards, currentCard.id]);
    }
    nextCard();
  };

  const nextCard = () => {
    if (isLastCard) {
      // Show completion screen or navigate back
      return;
    }
    setCurrentCardIndex(currentCardIndex + 1);
    setIsFlipped(false);
    setShowAnswer(false);
  };

  const skipCard = () => {
    nextCard();
  };

  const resetCard = () => {
    setIsFlipped(false);
    setShowAnswer(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
              <h1 className="text-xl font-bold text-gray-900">React Advanced Patterns</h1>
              <p className="text-sm text-gray-600">Flashcard Study Session</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Card {currentCardIndex + 1} of {flashcards.length}</p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>
      </div>

      {/* Flashcard */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative h-80"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isFlipped ? 'answer' : 'question'}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-white p-6 rounded-xl cursor-pointer"
              style={{
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)'
              }}
              onClick={handleFlip}
            >
              <div className="h-full flex flex-col">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentCard.difficulty)}`}>
                    {currentCard.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {currentCard.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    {!isFlipped ? (
                      <>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Question</h3>
                        <p className="text-gray-700 leading-relaxed">{currentCard.question}</p>
                        <div className="mt-6 flex items-center justify-center text-blue-600">
                          <Eye size={16} className="mr-2" />
                          <span className="text-sm">Tap to reveal answer</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Answer</h3>
                        <p className="text-gray-700 leading-relaxed">{currentCard.answer}</p>
                        <div className="mt-6 flex items-center justify-center text-green-600">
                          <EyeOff size={16} className="mr-2" />
                          <span className="text-sm">Tap to hide answer</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-4"
        >
          {/* Flip Button */}
          <div className="flex justify-center">
            <motion.button
              onClick={handleFlip}
              className="bg-white p-4 rounded-xl"
              style={{
                boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="text-blue-600" size={24} />
            </motion.button>
          </div>

          {/* Answer Buttons */}
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <motion.button
                onClick={handleIncorrect}
                className="bg-white p-4 rounded-xl flex items-center justify-center space-x-2 text-red-600"
                style={{
                  boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X size={20} />
                <span>Incorrect</span>
              </motion.button>
              <motion.button
                onClick={handleCorrect}
                className="bg-white p-4 rounded-xl flex items-center justify-center space-x-2 text-green-600"
                style={{
                  boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Check size={20} />
                <span>Correct</span>
              </motion.button>
            </motion.div>
          )}

          {/* Skip Button */}
          <div className="flex justify-center">
            <motion.button
              onClick={skipCard}
              className="bg-white px-6 py-2 rounded-xl flex items-center space-x-2 text-gray-600"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SkipForward size={16} />
              <span>Skip</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Study Stats */}
      <div className="fixed bottom-24 left-6 right-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-white/90 backdrop-blur-xl p-4 rounded-xl border border-gray-200/50"
          style={{
            boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.1), -4px -4px 12px rgba(255, 255, 255, 0.9)'
          }}
        >
          <div className="flex items-center justify-around text-sm">
            <div className="text-center">
              <div className="text-green-600 font-medium">{correctCards.length}</div>
              <div className="text-gray-500">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-red-600 font-medium">{incorrectCards.length}</div>
              <div className="text-gray-500">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-gray-900 font-medium">{studiedCards.length}</div>
              <div className="text-gray-500">Studied</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}