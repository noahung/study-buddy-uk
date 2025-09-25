import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Award, 
  Target, 
  BookOpen, 
  TrendingUp, 
  Filter,
  Search,
  Star,
  Calendar,
  Zap,
  Brain,
  CheckCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ExamBankScreenProps {
  onBack: () => void;
  setCurrentScreen: (screen: string) => void;
}

export default function ExamBankScreen({ onBack, setCurrentScreen }: ExamBankScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const examCategories = [
    { id: 'all', label: 'All Exams', count: 45 },
    { id: 'practice', label: 'Practice Tests', count: 25 },
    { id: 'mock', label: 'Mock Exams', count: 12 },
    { id: 'previous', label: 'Previous Years', count: 8 }
  ];

  const difficultyLevels = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-700' },
    { id: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-700' }
  ];

  const examData = [
    {
      id: 1,
      title: 'React Advanced Patterns - Final Exam',
      type: 'Mock Exam',
      difficulty: 'advanced',
      duration: 120,
      questions: 50,
      attempts: 234,
      avgScore: 78,
      rating: 4.8,
      topics: ['Hooks', 'Context API', 'Performance', 'Testing'],
      isPopular: true,
      isNew: false,
      description: 'Comprehensive exam covering advanced React patterns and best practices'
    },
    {
      id: 2,
      title: 'JavaScript Fundamentals Quiz',
      type: 'Practice Test',
      difficulty: 'beginner',
      duration: 45,
      questions: 25,
      attempts: 1200,
      avgScore: 85,
      rating: 4.9,
      topics: ['Variables', 'Functions', 'Arrays', 'Objects'],
      isPopular: true,
      isNew: false,
      description: 'Essential JavaScript concepts for beginners'
    },
    {
      id: 3,
      title: 'State Management Deep Dive',
      type: 'Practice Test',
      difficulty: 'intermediate',
      duration: 75,
      questions: 35,
      attempts: 456,
      avgScore: 72,
      rating: 4.6,
      topics: ['Redux', 'Context', 'Zustand', 'State Patterns'],
      isPopular: false,
      isNew: true,
      description: 'Compare different state management solutions'
    },
    {
      id: 4,
      title: 'React Performance Optimization',
      type: 'Mock Exam',
      difficulty: 'advanced',
      duration: 90,
      questions: 40,
      attempts: 189,
      avgScore: 68,
      rating: 4.7,
      topics: ['Memoization', 'Code Splitting', 'Lazy Loading'],
      isPopular: false,
      isNew: true,
      description: 'Advanced techniques for optimizing React applications'
    },
    {
      id: 5,
      title: 'CSS Layout Mastery',
      type: 'Practice Test',
      difficulty: 'intermediate',
      duration: 60,
      questions: 30,
      attempts: 678,
      avgScore: 81,
      rating: 4.5,
      topics: ['Flexbox', 'Grid', 'Positioning', 'Responsive'],
      isPopular: true,
      isNew: false,
      description: 'Master modern CSS layout techniques'
    },
    {
      id: 6,
      title: 'Node.js & Express API Development',
      type: 'Previous Year',
      difficulty: 'intermediate',
      duration: 105,
      questions: 45,
      attempts: 324,
      avgScore: 75,
      rating: 4.4,
      topics: ['Express', 'Middleware', 'Database', 'Authentication'],
      isPopular: false,
      isNew: false,
      description: 'Real exam from 2023 - Backend development fundamentals'
    }
  ];

  const filteredExams = examData.filter(exam => {
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'practice' && exam.type === 'Practice Test') ||
      (selectedCategory === 'mock' && exam.type === 'Mock Exam') ||
      (selectedCategory === 'previous' && exam.type === 'Previous Year');
    
    const matchesDifficulty = selectedDifficulty === 'all' || exam.difficulty === selectedDifficulty;
    
    return matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Practice Test': return 'bg-blue-100 text-blue-700';
      case 'Mock Exam': return 'bg-purple-100 text-purple-700';
      case 'Previous Year': return 'bg-orange-100 text-orange-700';
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
              <h1 className="text-xl font-bold text-gray-900">Exam Bank</h1>
              <p className="text-sm text-gray-600">Choose from {filteredExams.length} available exams</p>
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
              <Search size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-xl"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
              }}
            >
              <Filter size={20} />
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-4 gap-3 mb-6"
        >
          <div
            className="bg-white p-3 rounded-xl text-center"
            style={{
              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
            }}
          >
            <div 
              className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center"
              style={{
                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
              }}
            >
              <Target className="text-white" size={16} />
            </div>
            <p className="text-lg font-bold text-gray-900">45</p>
            <p className="text-xs text-gray-600">Total Exams</p>
          </div>
          
          <div
            className="bg-white p-3 rounded-xl text-center"
            style={{
              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
            }}
          >
            <div 
              className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
              style={{
                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
              }}
            >
              <CheckCircle className="text-white" size={16} />
            </div>
            <p className="text-lg font-bold text-gray-900">12</p>
            <p className="text-xs text-gray-600">Completed</p>
          </div>
          
          <div
            className="bg-white p-3 rounded-xl text-center"
            style={{
              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
            }}
          >
            <div 
              className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center"
              style={{
                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
              }}
            >
              <TrendingUp className="text-white" size={16} />
            </div>
            <p className="text-lg font-bold text-gray-900">78%</p>
            <p className="text-xs text-gray-600">Avg Score</p>
          </div>
          
          <div
            className="bg-white p-3 rounded-xl text-center"
            style={{
              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
            }}
          >
            <div 
              className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
              style={{
                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
              }}
            >
              <Award className="text-white" size={16} />
            </div>
            <p className="text-lg font-bold text-gray-900">3</p>
            <p className="text-xs text-gray-600">Rank</p>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Category Filter */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
            <div className="flex space-x-2 overflow-x-auto">
              {examCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap rounded-xl"
                  style={{
                    boxShadow: selectedCategory === category.id
                      ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.1)'
                      : '2px 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {category.label} ({category.count})
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Difficulty</h3>
            <div className="flex space-x-2 overflow-x-auto">
              {difficultyLevels.map((level) => (
                <Button
                  key={level.id}
                  variant={selectedDifficulty === level.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(level.id)}
                  className="whitespace-nowrap rounded-xl"
                  style={{
                    boxShadow: selectedDifficulty === level.id
                      ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.1)'
                      : '2px 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Exam List */}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          {filteredExams.map((exam, index) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              className="bg-white p-5 rounded-xl cursor-pointer transition-all duration-200"
              style={{
                boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.9)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen('test-taking')}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900">{exam.title}</h3>
                    {exam.isNew && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        <Zap size={10} className="mr-1" />
                        New
                      </Badge>
                    )}
                    {exam.isPopular && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                        <Star size={10} className="mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{exam.description}</p>
                  
                  {/* Badges */}
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className={`text-xs ${getTypeColor(exam.type)}`}>
                      {exam.type}
                    </Badge>
                    <Badge className={`text-xs ${getDifficultyColor(exam.difficulty)}`}>
                      {exam.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Star size={12} className="mr-1 text-yellow-500" />
                    {exam.rating}
                  </div>
                  <p className="text-xs text-gray-500">{exam.attempts} attempts</p>
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1 mb-3">
                {exam.topics.slice(0, 3).map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                  >
                    {topic}
                  </span>
                ))}
                {exam.topics.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                    +{exam.topics.length - 3} more
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    {exam.duration} min
                  </span>
                  <span className="flex items-center">
                    <BookOpen size={12} className="mr-1" />
                    {exam.questions} questions
                  </span>
                  <span className="flex items-center">
                    <Users size={12} className="mr-1" />
                    Avg: {exam.avgScore}%
                  </span>
                </div>
                
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-4"
                  style={{
                    boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.2)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentScreen('test-taking');
                  }}
                >
                  Start Exam
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}