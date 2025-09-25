import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Clock, Calendar, Target, BookOpen, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    weeklyGoals: true,
    streakReminders: false,
    courseUpdates: true,
    achievementAlerts: true,
    testReminders: true
  });

  const updateNotification = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const notificationTypes = [
    {
      id: 'dailyReminders',
      title: 'Daily Study Reminders',
      description: 'Get reminded to study every day',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      time: '9:00 AM',
      enabled: notifications.dailyReminders
    },
    {
      id: 'weeklyGoals',
      title: 'Weekly Goal Updates',
      description: 'Track your weekly progress',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      time: 'Sundays 8:00 PM',
      enabled: notifications.weeklyGoals
    },
    {
      id: 'streakReminders',
      title: 'Streak Reminders',
      description: "Don't break your study streak",
      icon: Award,
      color: 'from-orange-500 to-red-500',
      time: '8:00 PM',
      enabled: notifications.streakReminders
    },
    {
      id: 'courseUpdates',
      title: 'Course Updates',
      description: 'New lessons and content',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      time: 'As they happen',
      enabled: notifications.courseUpdates
    },
    {
      id: 'achievementAlerts',
      title: 'Achievement Alerts',
      description: 'Celebrate your milestones',
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
      time: 'Instant',
      enabled: notifications.achievementAlerts
    },
    {
      id: 'testReminders',
      title: 'Test Reminders',
      description: 'Upcoming tests and deadlines',
      icon: Calendar,
      color: 'from-indigo-500 to-purple-500',
      time: '1 day before',
      enabled: notifications.testReminders
    }
  ];

  const recentNotifications = [
    {
      title: 'Daily Study Reminder',
      message: 'Time for your daily learning session!',
      time: '2 hours ago',
      type: 'reminder',
      read: false
    },
    {
      title: 'Achievement Unlocked',
      message: 'You completed your first React course!',
      time: '1 day ago',
      type: 'achievement',
      read: true
    },
    {
      title: 'Weekly Goal Update',
      message: 'You achieved 80% of your weekly goal',
      time: '2 days ago',
      type: 'progress',
      read: true
    },
    {
      title: 'New Course Available',
      message: 'Advanced JavaScript patterns is now available',
      time: '3 days ago',
      type: 'update',
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder': return Clock;
      case 'achievement': return Award;
      case 'progress': return Target;
      case 'update': return BookOpen;
      default: return Bell;
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600 mb-6">Manage your study reminders and alerts</p>
        </motion.div>
      </div>

      {/* Notification Settings */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
          <div className="space-y-4">
            {notificationTypes.map((notification, index) => {
              const Icon = notification.icon;
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="bg-white p-4 rounded-xl"
                  style={{
                    boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${notification.color.replace('from-', '').replace(' to-', ', ')})`,
                          boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        <Icon className="text-white" size={20} />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">{notification.description}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                    
                    <div
                      className="p-1 rounded-full"
                      style={{
                        boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      <Switch
                        checked={notification.enabled}
                        onCheckedChange={(checked) => updateNotification(notification.id, checked)}
                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Notifications */}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Notifications</h2>
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Mark all as read
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentNotifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                  className={`bg-white p-4 rounded-xl transition-all duration-200 ${
                    !notification.read ? 'border-l-4 border-blue-500' : ''
                  }`}
                  style={{
                    boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        notification.type === 'reminder' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                        notification.type === 'achievement' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                        notification.type === 'progress' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                        'bg-gradient-to-br from-purple-500 to-pink-500'
                      }`}
                      style={{
                        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <Icon className="text-white" size={16} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}