import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Target, Calendar, Clock, Award, Flame, Brain, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface RevisionHubProps {
  setCurrentScreen?: (screen: string) => void;
}

export default function RevisionHub({ setCurrentScreen }: RevisionHubProps) {
  const studyStats = {
    dailyStreak: 12,
    weeklyGoal: 75,
    weeklyProgress: 60,
    totalStudyTime: 45,
    topicsCompleted: 8,
    topicsRemaining: 3
  };

  const studyPlan = [
    {
      id: 1,
      topic: 'React State Management',
      priority: 'high',
      estimatedTime: 30,
      dueDate: 'Today',
      progress: 0,
      type: 'review'
    },
    {
      id: 2,
      topic: 'JavaScript Promises',
      priority: 'medium',
      estimatedTime: 20,
      dueDate: 'Tomorrow',
      progress: 100,
      type: 'completed'
    },
    {
      id: 3,
      topic: 'CSS Grid Layout',
      priority: 'high',
      estimatedTime: 25,
      dueDate: 'Today',
      progress: 45,
      type: 'in-progress'
    },
    {
      id: 4,
      topic: 'Node.js Fundamentals',
      priority: 'low',
      estimatedTime: 40,
      dueDate: 'This Week',
      progress: 0,
      type: 'upcoming'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'review': return Brain;
      default: return Target;
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
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Revision Hub</h1>
          <p className="text-gray-600 mb-6">AI-powered study planning and tracking</p>
        </motion.div>
      </div>

      {/* Study Stats Cards */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          {/* Daily Streak */}
          <div
            className="bg-white p-4 rounded-xl"
            style={{
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
            }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div 
                className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center"
                style={{
                  boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
                }}
              >
                <Flame className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{studyStats.dailyStreak}</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
            </div>
          </div>

          {/* Weekly Goal */}
          <div
            className="bg-white p-4 rounded-xl"
            style={{
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
            }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div 
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                style={{
                  boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
                }}
              >
                <Target className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{studyStats.weeklyProgress}%</p>
                <p className="text-sm text-gray-600">Weekly Goal</p>
              </div>
            </div>
            <Progress value={studyStats.weeklyProgress} className="h-2" />
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white p-6 rounded-xl"
          style={{
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)'
          }}
        >
          <h3 className="font-medium text-gray-900 mb-4">This Week's Progress</h3>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div 
                className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
                style={{
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
                }}
              >
                <Clock className="text-white" size={20} />
              </div>
              <p className="text-lg font-bold text-gray-900">{studyStats.totalStudyTime}h</p>
              <p className="text-xs text-gray-600">Study Time</p>
            </div>
            
            <div className="space-y-2">
              <div 
                className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center"
                style={{
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
                }}
              >
                <Award className="text-white" size={20} />
              </div>
              <p className="text-lg font-bold text-gray-900">{studyStats.topicsCompleted}</p>
              <p className="text-xs text-gray-600">Completed</p>
            </div>
            
            <div className="space-y-2">
              <div 
                className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center"
                style={{
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
                }}
              >
                <TrendingUp className="text-white" size={20} />
              </div>
              <p className="text-lg font-bold text-gray-900">{studyStats.topicsRemaining}</p>
              <p className="text-xs text-gray-600">Remaining</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Study Plan */}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">AI Study Plan</h2>
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-700"
            >
              <Brain size={16} className="mr-1" />
              Regenerate
            </Button>
          </div>
          
          <div className="space-y-3">
            {studyPlan.map((item, index) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  className="bg-white p-4 rounded-xl"
                  style={{
                    boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.type === 'completed' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                          item.type === 'in-progress' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                          item.type === 'review' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                          'bg-gradient-to-br from-gray-400 to-gray-600'
                        }`}
                        style={{
                          boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <TypeIcon className="text-white" size={16} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.topic}</h4>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            {item.estimatedTime} min
                          </span>
                          <span className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {item.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                  
                  {/* Progress */}
                  {item.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  )}
                  
                  {/* Action Button */}
                  <Button
                    className={`w-full py-2 rounded-xl text-sm transition-all duration-200 ${
                      item.type === 'completed'
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                    }`}
                    style={{
                      boxShadow: item.type === 'completed' 
                        ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.1)'
                        : '3px 3px 6px rgba(0, 0, 0, 0.2)'
                    }}
                    disabled={item.type === 'completed'}
                    onClick={() => item.type !== 'completed' && setCurrentScreen?.('revision-study')}
                  >
                    {item.type === 'completed' ? '✓ Completed' :
                     item.type === 'in-progress' ? 'Continue' :
                     item.type === 'review' ? 'Start Review' : 'Begin Study'}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}