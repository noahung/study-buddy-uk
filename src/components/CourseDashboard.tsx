import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, CreditCard, CheckSquare, FileText, TrendingUp, Menu, Bell, Search, Play, Award, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface CourseDashboardProps {
  setCurrentScreen: (screen: string) => void;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function CourseDashboard({ setCurrentScreen, setIsSidebarOpen }: CourseDashboardProps) {
  const dashboardCards = [
    {
      id: 'ai-chat',
      title: 'AI Chat',
      description: 'Get instant answers',
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500',
      stats: '24/7 available'
    },
    {
      id: 'flashcards',
      title: 'Flashcards',
      description: 'Study smart',
      icon: CreditCard,
      color: 'from-purple-500 to-pink-500',
      stats: '127 cards'
    },
    {
      id: 'mock-test',
      title: 'Mock Tests',
      description: 'Practice exams',
      icon: CheckSquare,
      color: 'from-green-500 to-emerald-500',
      stats: '12 available'
    },
    {
      id: 'notes',
      title: 'Notes',
      description: 'Your study notes',
      icon: FileText,
      color: 'from-orange-500 to-red-500',
      stats: '8 notes'
    },
    {
      id: 'revision',
      title: 'Revision Hub',
      description: 'Smart review',
      icon: TrendingUp,
      color: 'from-indigo-500 to-purple-500',
      stats: '3 topics due'
    }
  ];

  const recentActivity = [
    {
      type: 'test',
      title: 'JavaScript Fundamentals Quiz',
      score: 85,
      time: '2 hours ago'
    },
    {
      type: 'study',
      title: 'React Hooks Flashcards',
      progress: 67,
      time: '5 hours ago'
    },
    {
      type: 'note',
      title: 'Redux State Management',
      time: '1 day ago'
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
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
              }}
            >
              <Menu size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Good morning, Alex!</h1>
              <p className="text-sm text-gray-600">Ready to continue learning?</p>
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
              <Bell size={20} />
            </Button>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white p-6 rounded-xl mb-6"
          style={{
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-gray-900">Course Progress</h3>
              <p className="text-sm text-gray-600">React Advanced Patterns</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">67%</p>
              <p className="text-sm text-gray-600">Complete</p>
            </div>
          </div>
          <Progress value={67} className="h-3 mb-3" />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>12 of 18 modules completed</span>
            <span className="flex items-center">
              <Award size={14} className="mr-1 text-yellow-500" />
              Next: State Management
            </span>
          </div>
        </motion.div>
      </div>

      {/* Dashboard Cards */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Study Tools</h2>
          <div className="grid grid-cols-2 gap-4">
            {dashboardCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="bg-white p-4 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.9)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentScreen(card.id)}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                    style={{
                      background: `linear-gradient(135deg, ${card.color.replace('from-', '').replace(' to-', ', ')})`,
                      boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    <Icon className="text-white" size={20} />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{card.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{card.description}</p>
                  <p className="text-xs text-gray-500">{card.stats}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                className="bg-white p-4 rounded-xl"
                style={{
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: activity.type === 'test' 
                          ? 'linear-gradient(135deg, #10B981, #059669)'
                          : activity.type === 'study'
                          ? 'linear-gradient(135deg, #8B5CF6, #A855F7)'
                          : 'linear-gradient(135deg, #F59E0B, #D97706)',
                        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {activity.type === 'test' && <CheckSquare className="text-white" size={16} />}
                      {activity.type === 'study' && <CreditCard className="text-white" size={16} />}
                      {activity.type === 'note' && <FileText className="text-white" size={16} />}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.score && (
                      <span className="text-lg font-bold text-green-600">{activity.score}%</span>
                    )}
                    {activity.progress && (
                      <span className="text-lg font-bold text-purple-600">{activity.progress}%</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}