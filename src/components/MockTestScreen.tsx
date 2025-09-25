import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Flag, CheckCircle, Circle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface MockTestScreenProps {
  onBack: () => void;
  onComplete: (results: any) => void;
}

export default function MockTestScreen({ onBack, onComplete }: MockTestScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What is the primary purpose of React's Virtual DOM?",
      options: [
        "To directly manipulate the browser's DOM",
        "To improve performance by minimizing direct DOM manipulation",
        "To store application state",
        "To handle user input events"
      ],
      correctAnswer: "To improve performance by minimizing direct DOM manipulation",
      explanation: "The Virtual DOM is a JavaScript representation of the actual DOM that helps React batch updates and minimize expensive DOM operations."
    },
    {
      id: 2,
      question: "Which hook would you use to perform side effects in a functional component?",
      options: [
        "useState",
        "useContext",
        "useEffect",
        "useReducer"
      ],
      correctAnswer: "useEffect",
      explanation: "useEffect is the hook used for side effects like data fetching, subscriptions, or manually changing the DOM in functional components."
    },
    {
      id: 3,
      question: "What is the difference between controlled and uncontrolled components?",
      options: [
        "Controlled components use refs, uncontrolled use state",
        "Controlled components are managed by React state, uncontrolled store their own state",
        "There is no difference",
        "Controlled components are faster than uncontrolled"
      ],
      correctAnswer: "Controlled components are managed by React state, uncontrolled store their own state",
      explanation: "Controlled components have their form data handled by React component state, while uncontrolled components store form data in the DOM itself."
    },
    {
      id: 4,
      question: "When should you use useReducer instead of useState?",
      options: [
        "When you have simple boolean state",
        "When you have complex state logic or multiple related state variables",
        "When you need to store strings",
        "Never, useState is always better"
      ],
      correctAnswer: "When you have complex state logic or multiple related state variables",
      explanation: "useReducer is preferable when you have complex state logic, multiple sub-values, or when the next state depends on the previous one."
    },
    {
      id: 5,
      question: "What is prop drilling and how can you avoid it?",
      options: [
        "Passing props through multiple component levels; avoid with global variables",
        "Passing props through multiple component levels; avoid with Context API or state management libraries",
        "A way to optimize component performance; cannot be avoided",
        "A method to pass functions as props; avoid with arrow functions"
      ],
      correctAnswer: "Passing props through multiple component levels; avoid with Context API or state management libraries",
      explanation: "Prop drilling occurs when you pass data through many component levels. It can be avoided using Context API, Redux, or other state management solutions."
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto-submit when time runs out
      handleSubmit();
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const toggleFlag = () => {
    if (flaggedQuestions.includes(currentQuestion.id)) {
      setFlaggedQuestions(flaggedQuestions.filter(id => id !== currentQuestion.id));
    } else {
      setFlaggedQuestions([...flaggedQuestions, currentQuestion.id]);
    }
  };

  const handleSubmit = () => {
    const results = {
      answers,
      questions,
      score: calculateScore(),
      timeSpent: 3600 - timeRemaining,
      flaggedQuestions
    };
    onComplete(results);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
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
              <p className="text-sm text-gray-600">Mock Test - {questions.length} Questions</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`flex items-center space-x-2 p-2 rounded-xl ${timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-white'}`}
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
              }}
            >
              <Clock size={16} />
              <span className="font-medium">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="text-sm text-gray-600">{answeredCount} answered</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>
      </div>

      {/* Question Navigation */}
      <div className="px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white p-4 rounded-xl"
          style={{
            boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
          }}
        >
          <div className="flex items-center space-x-2 overflow-x-auto">
            {questions.map((_, index) => {
              const isAnswered = answers[questions[index].id];
              const isFlagged = flaggedQuestions.includes(questions[index].id);
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <motion.button
                  key={index}
                  onClick={() => jumpToQuestion(index)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    isCurrent 
                      ? 'bg-blue-500 text-white' 
                      : isAnswered 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                  }`}
                  style={{
                    boxShadow: isCurrent 
                      ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.2)' 
                      : '2px 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {index + 1}
                  {isFlagged && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Question */}
      <div className="px-6 mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl"
            style={{
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)'
            }}
          >
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Question {currentQuestionIndex + 1}
              </h3>
              <motion.button
                onClick={toggleFlag}
                className={`p-2 rounded-lg ${flaggedQuestions.includes(currentQuestion.id) ? 'text-yellow-600' : 'text-gray-400'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Flag size={20} />
              </motion.button>
            </div>

            {/* Question Text */}
            <p className="text-gray-700 mb-6 leading-relaxed">{currentQuestion.question}</p>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion.id] === option;
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full p-4 text-left rounded-xl transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-50 border-2 border-blue-500 text-blue-900' 
                        : 'bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100'
                    }`}
                    style={{
                      boxShadow: isSelected 
                        ? 'inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'
                        : '2px 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center space-x-3">
                      {isSelected ? (
                        <CheckCircle className="text-blue-500" size={20} />
                      ) : (
                        <Circle className="text-gray-400" size={20} />
                      )}
                      <span>{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="flex items-center space-x-2 rounded-xl"
            style={{
              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
            }}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-4">
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={() => setShowSubmitConfirm(true)}
                className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                style={{
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
                }}
              >
                Submit Test
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center space-x-2 rounded-xl"
                style={{
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
                }}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl max-w-md w-full"
              style={{
                boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.2), -12px -12px 24px rgba(255, 255, 255, 0.9)'
              }}
            >
              <div className="flex items-center mb-4">
                <AlertCircle className="text-yellow-500 mr-3" size={24} />
                <h3 className="text-lg font-medium">Submit Test?</h3>
              </div>
              <p className="text-gray-600 mb-6">
                You have answered {answeredCount} out of {questions.length} questions. 
                {questions.length - answeredCount > 0 && (
                  <span className="text-red-600">
                    {' '}{questions.length - answeredCount} questions remain unanswered.
                  </span>
                )}
              </p>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setShowSubmitConfirm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Continue Test
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  Submit Now
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}