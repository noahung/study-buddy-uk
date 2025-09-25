import React from 'react';
import { motion } from 'motion/react';
import { User, Book, Award, TrendingUp, Calendar, Edit, Share, Settings, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function ProfileScreen() {
  const userStats = {
    coursesCompleted: 12,
    studyStreak: 23,
    totalStudyHours: 156,
    achievements: 8
  };

  const achievements = [
    { id: 1, title: 'First Course Complete', icon: '🎓', unlocked: true },
    { id: 2, title: '7-Day Streak', icon: '🔥', unlocked: true },
    { id: 3, title: 'Quiz Master', icon: '🧠', unlocked: true },
    { id: 4, title: 'Note Taker', icon: '📝', unlocked: true },
    { id: 5, title: '30-Day Streak', icon: '⚡', unlocked: false },
    { id: 6, title: 'Expert Level', icon: '👑', unlocked: false }
  ];

  const enrolledCourses = [
    {
      title: 'React Advanced Patterns',
      progress: 67,
      category: 'Frontend Development',
      nextLesson: 'State Management'
    },
    {
      title: 'Node.js Backend Development',
      progress: 34,
      category: 'Backend Development',
      nextLesson: 'Express Middleware'
    },
    {
      title: 'JavaScript Fundamentals',
      progress: 100,
      category: 'Programming',
      nextLesson: 'Completed'
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
          className="text-center"
        >
          {/* Profile Avatar */}
          <div className="relative inline-block mb-4">
            <div 
              className="w-24 h-24 rounded-full p-1"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.15), -4px -4px 8px rgba(255, 255, 255, 0.9)'
              }}
            >
              <Avatar className="w-full h-full">
                <AvatarImage src="/api/placeholder/96/96" alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                  AK
                </AvatarFallback>
              </Avatar>
            </div>
            
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white text-gray-600 hover:text-gray-800 p-0"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.15), -2px -2px 4px rgba(255, 255, 255, 0.9)'
              }}
            >
              <Edit size={14} />
            </Button>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Alex Johnson</h1>
          <p className="text-gray-600 mb-2">alex.johnson@email.com</p>
          <p className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block">
            Premium Member
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { label: 'Courses', value: userStats.coursesCompleted, icon: Book, color: 'from-blue-500 to-cyan-500' },
            { label: 'Study Streak', value: `${userStats.studyStreak} days`, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
            { label: 'Study Hours', value: userStats.totalStudyHours, icon: Calendar, color: 'from-purple-500 to-pink-500' },
            { label: 'Achievements', value: userStats.achievements, icon: Award, color: 'from-orange-500 to-red-500' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className="bg-white p-4 rounded-xl text-center"
                style={{
                  boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                }}
              >
                <div 
                  className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color.replace('from-', '').replace(' to-', ', ')})`,
                    boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Icon className="text-white" size={20} />
                </div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Achievements */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Achievements</h2>
          <div className="grid grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                className={`p-4 rounded-xl text-center transition-all duration-200 ${
                  achievement.unlocked 
                    ? 'bg-white' 
                    : 'bg-gray-100 opacity-60'
                }`}
                style={{
                  boxShadow: achievement.unlocked 
                    ? '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                    : 'inset 2px 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <p className="text-xs text-gray-600 leading-tight">{achievement.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enrolled Courses */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">My Courses</h2>
          <div className="space-y-3">
            {enrolledCourses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                className="bg-white p-4 rounded-xl"
                style={{
                  boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-600">{course.category}</p>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{course.progress}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${course.progress}%`,
                      boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.3)'
                    }}
                  />
                </div>
                
                <p className="text-sm text-gray-500">
                  Next: <span className="text-gray-700">{course.nextLesson}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="space-y-3"
        >
          <Button
            className="w-full bg-white text-gray-700 py-3 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200"
            style={{
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
            }}
          >
            <Edit size={20} />
            <span>Edit Profile</span>
          </Button>
          
          <Button
            className="w-full bg-white text-gray-700 py-3 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200"
            style={{
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
            }}
          >
            <Share size={20} />
            <span>Share Profile</span>
          </Button>
          
          <Button
            className="w-full bg-white text-gray-700 py-3 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200"
            style={{
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
            }}
          >
            <Settings size={20} />
            <span>Account Settings</span>
          </Button>
          
          <Button
            variant="destructive"
            className="w-full py-3 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200"
            style={{
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
            }}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}