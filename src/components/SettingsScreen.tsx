import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Bell, Shield, Palette, Download, HelpCircle, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    studyReminders: true,
    soundEffects: false,
    autoSync: true,
    downloadOverWifi: true,
    analyticsTracking: false
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingsSections = [
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        {
          id: 'darkMode',
          label: 'Dark Mode',
          description: 'Switch to dark theme',
          type: 'switch',
          value: settings.darkMode
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          description: 'Receive app notifications',
          type: 'switch',
          value: settings.notifications
        },
        {
          id: 'studyReminders',
          label: 'Study Reminders',
          description: 'Daily study reminders',
          type: 'switch',
          value: settings.studyReminders
        },
        {
          id: 'soundEffects',
          label: 'Sound Effects',
          description: 'Play sounds for interactions',
          type: 'switch',
          value: settings.soundEffects
        }
      ]
    },
    {
      title: 'Data & Storage',
      icon: Download,
      items: [
        {
          id: 'autoSync',
          label: 'Auto Sync',
          description: 'Automatically sync your progress',
          type: 'switch',
          value: settings.autoSync
        },
        {
          id: 'downloadOverWifi',
          label: 'Download over WiFi only',
          description: 'Save mobile data usage',
          type: 'switch',
          value: settings.downloadOverWifi
        }
      ]
    },
    {
      title: 'Privacy',
      icon: Shield,
      items: [
        {
          id: 'analyticsTracking',
          label: 'Analytics Tracking',
          description: 'Help improve the app',
          type: 'switch',
          value: settings.analyticsTracking
        },
        {
          id: 'privacy',
          label: 'Privacy Policy',
          description: 'Read our privacy policy',
          type: 'link'
        },
        {
          id: 'terms',
          label: 'Terms of Service',
          description: 'Read terms and conditions',
          type: 'link'
        }
      ]
    },
    {
      title: 'Support',
      icon: HelpCircle,
      items: [
        {
          id: 'help',
          label: 'Help Center',
          description: 'Get help and support',
          type: 'link'
        },
        {
          id: 'feedback',
          label: 'Send Feedback',
          description: 'Share your thoughts',
          type: 'link'
        },
        {
          id: 'about',
          label: 'About',
          description: 'App version and info',
          type: 'link'
        }
      ]
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600 mb-6">Customize your learning experience</p>
        </motion.div>
      </div>

      {/* Settings Sections */}
      <div className="px-6 pb-24">
        {settingsSections.map((section, sectionIndex) => {
          const SectionIcon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + sectionIndex * 0.1, duration: 0.6 }}
              className="mb-8"
            >
              {/* Section Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.15), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <SectionIcon className="text-white" size={16} />
                </div>
                <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
              </div>

              {/* Section Items */}
              <div
                className="bg-white rounded-xl overflow-hidden"
                style={{
                  boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)'
                }}
              >
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + sectionIndex * 0.1 + itemIndex * 0.05, duration: 0.5 }}
                    className={`p-4 flex items-center justify-between ${
                      itemIndex < section.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{item.label}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>

                    <div className="ml-4">
                      {item.type === 'switch' && (
                        <div
                          className="p-1 rounded-full transition-all duration-200"
                          style={{
                            boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8)'
                          }}
                        >
                          <Switch
                            checked={item.value || false}
                            onCheckedChange={(checked) => updateSetting(item.id, checked)}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600"
                          />
                        </div>
                      )}

                      {item.type === 'link' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 rounded-full text-gray-400 hover:text-gray-600"
                          style={{
                            boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1), -2px -2px 4px rgba(255, 255, 255, 0.8)'
                          }}
                        >
                          <ChevronRight size={16} />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* App Version */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="text-center mt-8"
        >
          <div
            className="bg-white p-4 rounded-xl inline-block"
            style={{
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
            }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                style={{
                  boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
                }}
              >
                <Settings className="text-white" size={16} />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Master Study</p>
                <p className="text-sm text-gray-600">Version 2.1.0</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reset Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-8"
        >
          <Button
            variant="destructive"
            className="w-full py-3 rounded-xl transition-all duration-200"
            style={{
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
            }}
          >
            Reset All Settings
          </Button>
        </motion.div>
      </div>
    </div>
  );
}