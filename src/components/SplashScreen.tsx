import React from 'react';
import { motion } from 'motion/react';
import { Book, Sparkles } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full"
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center space-y-8 z-10">
        {/* Logo Container */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
          className="relative"
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-20"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              width: 140,
              height: 140,
              filter: 'blur(20px)',
            }}
          />
          
          {/* Main logo container */}
          <div 
            className="w-28 h-28 bg-white rounded-full flex items-center justify-center relative"
            style={{
              boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9), inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
            >
              <Book className="text-white" size={32} />
            </motion.div>
            
            {/* Sparkle effects */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${[10, 90, 20, 80][i]}%`,
                  top: `${[20, 30, 80, 70][i]}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'easeInOut',
                }}
              >
                <Sparkles className="text-yellow-400" size={12} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* App Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold text-gray-900">Master Study</h1>
          <p className="text-gray-600">Your AI-Powered Learning Companion</p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex space-x-2"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
              style={{
                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}