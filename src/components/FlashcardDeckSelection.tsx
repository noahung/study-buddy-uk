import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Lock, Play, Star, TrendingUp, Search, Grid, List } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface FlashcardDeckSelectionProps {
  setCurrentScreen: (screen: string) => void;
}

export default function FlashcardDeckSelection({ setCurrentScreen }: FlashcardDeckSelectionProps) {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const flashcardDecks = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      description: 'Variables, functions, and basic concepts',
      cardCount: 45,
      studyStreak: 7,
      difficulty: 'Beginner',
      isPremium: false,
      progress: 78,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 2,
      title: 'React Hooks Deep Dive',
      description: 'useState, useEffect, custom hooks',
      cardCount: 32,
      studyStreak: 3,
      difficulty: 'Intermediate',
      isPremium: false,
      progress: 45,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      title: 'Advanced CSS Techniques',
      description: 'Grid, Flexbox, animations, and more',
      cardCount: 28,
      studyStreak: 0,
      difficulty: 'Advanced',
      isPremium: true,
      progress: 0,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 4,
      title: 'Node.js Backend Essentials',
      description: 'Express, middleware, database integration',
      cardCount: 56,
      studyStreak: 0,
      difficulty: 'Intermediate',
      isPremium: true,
      progress: 0,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-orange-600 bg-orange-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Flashcards</h1>
          <p className="text-gray-600 mb-6">Master concepts with spaced repetition</p>

          {/* Search and View Toggle */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search decks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-3 rounded-xl border-0"
                style={{
                  boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
                  background: 'rgba(255, 255, 255, 0.8)'
                }}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl ${viewMode === 'grid' ? 'text-blue-600' : 'text-gray-500'}`}
                style={{
                  boxShadow: viewMode === 'grid' 
                    ? 'inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.8)'
                    : '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.8)'
                }}
              >
                <Grid size={20} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl ${viewMode === 'list' ? 'text-blue-600' : 'text-gray-500'}`}
                style={{
                  boxShadow: viewMode === 'list' 
                    ? 'inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.8)'
                    : '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.8)'
                }}
              >
                <List size={20} />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Deck Grid/List */}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={viewMode === 'grid' ? 'grid grid-cols-1 gap-4' : 'space-y-4'}
        >
          {flashcardDecks.map((deck, index) => (
            <motion.div
              key={deck.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              className="bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
              style={{
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)'
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Card Header */}
              <div 
                className="h-24 p-6 flex items-center justify-between relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${deck.color.replace('from-', '').replace(' to-', ', ')})`
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <CreditCard className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{deck.title}</h3>
                    <p className="text-white/80 text-sm">{deck.cardCount} cards</p>
                  </div>
                </div>
                
                {deck.isPremium && (
                  <div className="flex items-center space-x-2">
                    <Lock className="text-white/80" size={16} />
                    <span className="text-white/80 text-sm">Premium</span>
                  </div>
                )}
                
                {/* Decorative circles */}
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full" />
                <div className="absolute -right-8 -bottom-8 w-20 h-20 bg-white/10 rounded-full" />
              </div>

              {/* Card Content */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">{deck.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(deck.difficulty)}`}>
                    {deck.difficulty}
                  </span>
                  
                  {deck.studyStreak > 0 && (
                    <div className="flex items-center space-x-1 text-orange-600">
                      <TrendingUp size={14} />
                      <span className="text-sm">{deck.studyStreak} day streak</span>
                    </div>
                  )}
                </div>

                {/* Progress */}
                {deck.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{deck.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${deck.progress}%`,
                          boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.3)'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  onClick={() => !deck.isPremium && setCurrentScreen('flashcard-study')}
                  className={`w-full py-3 rounded-xl transition-all duration-200 ${
                    deck.isPremium 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                  }`}
                  style={{
                    boxShadow: deck.isPremium 
                      ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.1)'
                      : '4px 4px 8px rgba(0, 0, 0, 0.2)'
                  }}
                  disabled={deck.isPremium}
                >
                  {deck.isPremium ? (
                    <>
                      <Lock size={16} className="mr-2" />
                      Upgrade to Access
                    </>
                  ) : (
                    <>
                      <Play size={16} className="mr-2" />
                      {deck.progress > 0 ? 'Continue' : 'Start'} Study
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Create New Deck Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6"
        >
          <Button
            className="w-full bg-white text-gray-700 py-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
            style={{
              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
            }}
          >
            <CreditCard size={20} className="mr-2" />
            Create New Deck
          </Button>
        </motion.div>
      </div>
    </div>
  );
}