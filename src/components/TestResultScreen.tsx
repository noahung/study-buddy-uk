import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Clock, Target, CheckCircle, XCircle, Flag, Share, Download, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface TestResultScreenProps {
  onBack: () => void;
  onRetakeTest: () => void;
  results: {
    answers: { [key: number]: string };
    questions: any[];
    score: number;
    timeSpent: number;
    flaggedQuestions: number[];
  };
}

export default function TestResultScreen({ onBack, onRetakeTest, results }: TestResultScreenProps) {
  const { answers, questions, score, timeSpent, flaggedQuestions } = results;
  
  const correctAnswers = questions.filter(q => answers[q.id] === q.correctAnswer).length;
  const incorrectAnswers = questions.filter(q => answers[q.id] && answers[q.id] !== q.correctAnswer).length;
  const unanswered = questions.length - Object.keys(answers).length;
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return "Outstanding! You've mastered this topic.";
    if (score >= 80) return "Great job! You have a solid understanding.";
    if (score >= 70) return "Good work! A few more areas to review.";
    if (score >= 60) return "Not bad! Some concepts need more practice.";
    return "Keep studying! You'll improve with more practice.";
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
              <h1 className="text-xl font-bold text-gray-900">Test Results</h1>
              <p className="text-sm text-gray-600">React Advanced Patterns</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-xl"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
              }}
            >
              <Share size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-xl"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
              }}
            >
              <Download size={16} />
            </Button>
          </div>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white p-6 rounded-xl mb-6 text-center"
          style={{
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)'
          }}
        >
          <div 
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4"
            style={{
              background: `linear-gradient(135deg, ${getScoreBackground(score).replace('from-', '').replace(' to-', ', ')})`,
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.2), inset 2px 2px 4px rgba(255, 255, 255, 0.3)'
            }}
          >
            <Trophy className="text-white" size={32} />
          </div>
          <h2 className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>{score}%</h2>
          <p className="text-gray-600 mb-2">{getPerformanceMessage(score)}</p>
          <p className="text-sm text-gray-500">{correctAnswers} out of {questions.length} correct</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div 
            className="bg-white p-4 rounded-xl text-center"
            style={{
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
            }}
          >
            <Clock className="text-blue-600 mx-auto mb-2" size={20} />
            <p className="text-sm text-gray-600">Time Spent</p>
            <p className="font-medium text-gray-900">{formatTime(timeSpent)}</p>
          </div>
          <div 
            className="bg-white p-4 rounded-xl text-center"
            style={{
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
            }}
          >
            <Target className="text-green-600 mx-auto mb-2" size={20} />
            <p className="text-sm text-gray-600">Accuracy</p>
            <p className="font-medium text-gray-900">{Math.round((correctAnswers / (questions.length - unanswered)) * 100)}%</p>
          </div>
          <div 
            className="bg-white p-4 rounded-xl text-center"
            style={{
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
            }}
          >
            <Flag className="text-yellow-600 mx-auto mb-2" size={20} />
            <p className="text-sm text-gray-600">Flagged</p>
            <p className="font-medium text-gray-900">{flaggedQuestions.length}</p>
          </div>
        </motion.div>

        {/* Progress Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white p-6 rounded-xl mb-6"
          style={{
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)'
          }}
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Answer Breakdown</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-600" size={16} />
                <span className="text-gray-700">Correct</span>
              </div>
              <span className="font-medium text-gray-900">{correctAnswers}</span>
            </div>
            <Progress value={(correctAnswers / questions.length) * 100} className="h-2 bg-green-100" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <XCircle className="text-red-600" size={16} />
                <span className="text-gray-700">Incorrect</span>
              </div>
              <span className="font-medium text-gray-900">{incorrectAnswers}</span>
            </div>
            <Progress value={(incorrectAnswers / questions.length) * 100} className="h-2 bg-red-100" />
            
            {unanswered > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-gray-400" />
                    <span className="text-gray-700">Unanswered</span>
                  </div>
                  <span className="font-medium text-gray-900">{unanswered}</span>
                </div>
                <Progress value={(unanswered / questions.length) * 100} className="h-2 bg-gray-100" />
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Question Review */}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Question Review</h3>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              const wasAnswered = Boolean(userAnswer);
              const wasFlagged = flaggedQuestions.includes(question.id);
              
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                  className="bg-white p-4 rounded-xl"
                  style={{
                    boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">Q{index + 1}</span>
                      {wasAnswered ? (
                        isCorrect ? (
                          <CheckCircle className="text-green-600" size={16} />
                        ) : (
                          <XCircle className="text-red-600" size={16} />
                        )
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-gray-400" />
                      )}
                      {wasFlagged && <Flag className="text-yellow-600" size={14} />}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isCorrect && wasAnswered ? 'bg-green-100 text-green-700' :
                      wasAnswered ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {isCorrect && wasAnswered ? 'Correct' : wasAnswered ? 'Incorrect' : 'Skipped'}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-2">{question.question}</p>
                  
                  {userAnswer && (
                    <div className="text-sm">
                      <p className={`mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        <strong>Your answer:</strong> {userAnswer}
                      </p>
                      {!isCorrect && (
                        <p className="text-green-700 mb-2">
                          <strong>Correct answer:</strong> {question.correctAnswer}
                        </p>
                      )}
                      <p className="text-gray-600 text-xs">{question.explanation}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-6 left-6 right-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex items-center space-x-4"
        >
          <Button
            onClick={onRetakeTest}
            variant="outline"
            className="flex-1 flex items-center justify-center space-x-2 rounded-xl"
            style={{
              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
            }}
          >
            <RotateCcw size={16} />
            <span>Retake Test</span>
          </Button>
          <Button
            onClick={onBack}
            className="flex-1 rounded-xl"
            style={{
              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
            }}
          >
            Continue Learning
          </Button>
        </motion.div>
      </div>
    </div>
  );
}