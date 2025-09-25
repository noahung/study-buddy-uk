import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Search, Plus, Calendar, Tag, MoreVertical, Edit, Trash2, Share } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface NotesListViewProps {
  setCurrentScreen: (screen: string) => void;
}

export default function NotesListView({ setCurrentScreen }: NotesListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<number | null>(null);

  const notes = [
    {
      id: 1,
      title: 'React Hooks Essentials',
      preview: 'useState and useEffect are the most commonly used hooks in React applications...',
      content: 'Full content about React hooks including examples and best practices.',
      lastModified: '2 hours ago',
      tags: ['React', 'JavaScript', 'Hooks'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'CSS Grid vs Flexbox',
      preview: 'Understanding when to use CSS Grid and when to use Flexbox for layouts...',
      content: 'Detailed comparison between CSS Grid and Flexbox with practical examples.',
      lastModified: '1 day ago',
      tags: ['CSS', 'Layout', 'Design'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      title: 'JavaScript Async/Await',
      preview: 'Modern approach to handling asynchronous operations in JavaScript...',
      content: 'Complete guide to async/await including error handling and best practices.',
      lastModified: '3 days ago',
      tags: ['JavaScript', 'Async', 'Promises'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      title: 'Node.js Performance Tips',
      preview: 'Optimizing Node.js applications for better performance and scalability...',
      content: 'Performance optimization techniques for Node.js backend applications.',
      lastModified: '1 week ago',
      tags: ['Node.js', 'Performance', 'Backend'],
      color: 'from-orange-500 to-red-500'
    }
  ];

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="p-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Notes</h1>
          <p className="text-gray-600 mb-6">Your personal study collection</p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 rounded-xl border-0"
              style={{
                boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
                background: 'rgba(255, 255, 255, 0.8)'
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Notes List */}
      <div className="px-6 pb-32">
        <AnimatePresence>
          {filteredNotes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div 
                className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mb-4"
                style={{
                  boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)'
                }}
              >
                <FileText className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
              <p className="text-gray-600 mb-6">Create your first note to get started</p>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl"
                style={{
                  boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.2)'
                }}
              >
                <Plus size={16} className="mr-2" />
                Create Note
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-4"
            >
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                  onClick={() => setCurrentScreen('note-detail')}
                >
                  {/* Note Header */}
                  <div 
                    className="h-16 px-6 flex items-center justify-between relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${note.color.replace('from-', '').replace(' to-', ', ')})`
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <FileText className="text-white" size={16} />
                      </div>
                      <h3 className="font-medium text-white truncate">{note.title}</h3>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNote(selectedNote === note.id ? null : note.id);
                      }}
                      className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg"
                    >
                      <MoreVertical size={16} />
                    </Button>
                    
                    {/* Decorative elements */}
                    <div className="absolute -right-2 -top-2 w-8 h-8 bg-white/10 rounded-full" />
                    <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-white/10 rounded-full" />
                  </div>

                  {/* Note Content */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {note.preview}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center"
                          style={{
                            boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <Tag size={10} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Timestamp */}
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar size={12} className="mr-1" />
                      Last modified {note.lastModified}
                    </div>
                  </div>

                  {/* Action Menu */}
                  <AnimatePresence>
                    {selectedNote === note.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200 bg-gray-50 px-6 py-3"
                      >
                        <div className="flex items-center justify-around">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                          >
                            <Share size={14} />
                            <span>Share</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed bottom-28 right-6 z-10"
      >
        <motion.button
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full flex items-center justify-center"
          style={{
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.2), -4px -4px 8px rgba(255, 255, 255, 0.1)'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus size={24} />
        </motion.button>
      </motion.div>
    </div>
  );
}