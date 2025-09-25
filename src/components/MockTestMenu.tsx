import React from 'react';
import { motion } from 'motion/react';
import { Clock, Play, TrendingUp, Award, CheckCircle, Target, BookOpen } from 'lucide-react';
import { Button } from './ui/button';

interface MockTestMenuProps {
  setCurrentScreen?: (screen: string) => void;
}

export default function MockTestMenu({ setCurrentScreen }: MockTestMenuProps) {
  const testTypes = [
    {
      id: 'exam-bank',
      title: 'Exam Bank',
      description: 'Browse all available exams',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      stats: '45+ exams available',
      onClick: () => setCurrentScreen?.('exam-bank')
    },
    {
      id: 'practice',
      title: 'Quick Practice',
      description: 'Unlimited time, instant feedback',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      stats: '25 questions',
      onClick: () => setCurrentScreen?.('test-taking')
    },
    {
      id: 'timed',
      title: 'Timed Test',
      description: 'Real exam conditions',
      icon: Clock,
      color: 'from-red-500 to-orange-500',
      stats: '60 minutes',
      onClick: () => setCurrentScreen?.('test-taking')
    }
  ];

  const recentResults = [
    {
      title: 'JavaScript Fundamentals',
      score: 85,
      date: '2 days ago',
      questions: 30,
      type: 'practice'
    },
    {
      title: 'React Hooks Quiz',
      score: 92,
      date: '5 days ago',
      questions: 20,
      type: 'timed'
    },
    {
      title: 'CSS Flexbox Test',
      score: 78,
      date: '1 week ago',
      questions: 15,
      type: 'practice'
    }
  ];

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="p-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mock Tests</h1>
          <p className="text-gray-600 mb-6">Practice and improve your skills</p>
        </motion.div>
      </div>

      {/* Test Types */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Choose Test Type</h2>
          <div className="space-y-4">
            {testTypes.map((test, index) => {
              const Icon = test.icon;
              return (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="bg-white p-6 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)'
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={test.onClick}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${test.color.replace('from-', '').replace(' to-', ', ')})`,
                        boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <Icon className="text-white" size={24} />
                    </div>
                    <Button
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl"
                      style={{
                        boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2)'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        test.onClick?.();
                      }}
                    >
                      <Play size={16} className="mr-2" />
                      {test.id === 'exam-bank' ? 'Browse' : 'Start'}
                    </Button>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{test.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{test.description}</p>
                  <p className="text-sm text-gray-500">{test.stats}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Results */}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Results</h2>
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-700"
            >
              <TrendingUp size={16} className="mr-1" />
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                className="bg-white p-4 rounded-xl"
                style={{
                  boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: result.score >= 80 
                          ? 'linear-gradient(135deg, #10B981, #059669)'
                          : result.score >= 60
                          ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                          : 'linear-gradient(135deg, #EF4444, #DC2626)',
                        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {result.score >= 80 ? (
                        <Award className="text-white" size={16} />
                      ) : (
                        <CheckCircle className="text-white" size={16} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{result.title}</h4>
                      <p className="text-sm text-gray-500">
                        {result.questions} questions • {result.date}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      result.score >= 80 ? 'text-green-600' :
                      result.score >= 60 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {result.score}%
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{result.type}</p>
                  </div>
                </div>
                
                {/* Score bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      result.score >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                      result.score >= 60 ? 'bg-gradient-to-r from-orange-500 to-amber-600' :
                      'bg-gradient-to-r from-red-500 to-rose-600'
                    }`}
                    style={{ 
                      width: `${result.score}%`,
                      boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.3)'
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}