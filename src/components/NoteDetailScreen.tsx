import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Edit3, Save, Share, BookmarkPlus, MoreVertical, Tag, Calendar, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

interface NoteDetailScreenProps {
  onBack: () => void;
}

export default function NoteDetailScreen({ onBack }: NoteDetailScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteTitle, setNoteTitle] = useState('React State Management Patterns');
  const [noteContent, setNoteContent] = useState(`# React State Management Patterns

## Introduction
State management is one of the most crucial aspects of building scalable React applications. As applications grow in complexity, managing state becomes increasingly challenging.

## Key Patterns

### 1. Local Component State
- Use \`useState\` for simple, component-specific state
- Best for form inputs, toggles, and UI state
- Example:
\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

### 2. Lifting State Up
- Move state to the lowest common ancestor
- Useful when multiple components need the same state
- Pass down as props and pass up as callbacks

### 3. Context API
- Provides a way to pass data through component tree
- Avoids prop drilling
- Good for themes, user authentication, locale settings

### 4. Custom Hooks
- Extract stateful logic into reusable functions
- Promotes code reuse and separation of concerns
- Example:
\`\`\`jsx
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  return { count, increment, decrement };
}
\`\`\`

### 5. Reducer Pattern
- Use \`useReducer\` for complex state logic
- Better for state transitions and complex updates
- More predictable state changes

## Best Practices
1. **Keep state as local as possible** - Don't lift state unnecessarily
2. **Use the right tool for the job** - Not everything needs global state
3. **Normalize state shape** - Avoid deeply nested objects
4. **Separate concerns** - Business logic separate from UI logic
5. **Use TypeScript** - Better developer experience and fewer bugs

## Common Pitfalls
- **Over-engineering** - Using complex solutions for simple problems
- **Prop drilling** - Passing props through many component levels
- **Stale closures** - Using outdated values in closures
- **Unnecessary re-renders** - Not optimizing component re-renders

## Tools & Libraries
- **Redux** - Predictable state container
- **Zustand** - Lightweight state management
- **Recoil** - Experimental state management by Facebook
- **Jotai** - Atomic approach to state management

## Conclusion
Choose the right state management pattern based on your application's needs. Start simple and add complexity only when necessary.`);
  
  const [tags, setTags] = useState(['React', 'State Management', 'JavaScript', 'Frontend']);
  const [lastModified] = useState('2 hours ago');
  const [wordCount] = useState(847);
  const [readTime] = useState(4);

  const handleSave = () => {
    setIsEditing(false);
    // Implement save logic here
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="text-xl font-bold border-0 p-0 bg-transparent"
                  style={{ boxShadow: 'none' }}
                />
              ) : (
                <h1 className="text-xl font-bold text-gray-900">{noteTitle}</h1>
              )}
              <p className="text-sm text-gray-600">Personal Study Notes</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <Button
                onClick={handleSave}
                size="sm"
                className="p-2 rounded-xl bg-green-500 hover:bg-green-600 text-white"
                style={{
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
                }}
              >
                <Save size={16} />
              </Button>
            ) : (
              <Button
                onClick={handleEdit}
                variant="ghost"
                size="sm"
                className="p-2 rounded-xl"
                style={{
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
                }}
              >
                <Edit3 size={16} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-xl"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
              }}
            >
              <Share size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-xl"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
              }}
            >
              <MoreVertical size={16} />
            </Button>
          </div>
        </motion.div>

        {/* Note Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white p-4 rounded-xl mb-6"
          style={{
            boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center">
                <Calendar size={14} className="mr-1" />
                Last modified {lastModified}
              </span>
              <span className="flex items-center">
                <Eye size={14} className="mr-1" />
                {wordCount} words · {readTime} min read
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-yellow-600 hover:text-yellow-700"
            >
              <BookmarkPlus size={16} />
            </Button>
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Tag size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                style={{
                  boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1), -2px -2px 4px rgba(255, 255, 255, 0.9)'
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Note Content */}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white rounded-xl overflow-hidden"
          style={{
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)'
          }}
        >
          {isEditing ? (
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full h-96 p-6 border-0 resize-none bg-transparent"
              placeholder="Start writing your notes..."
              style={{ boxShadow: 'none' }}
            />
          ) : (
            <div className="p-6">
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
                  {noteContent.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={index} className="text-2xl font-bold text-gray-900 mb-4 mt-6">{line.substring(2)}</h1>;
                    } else if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-xl font-bold text-gray-900 mb-3 mt-5">{line.substring(3)}</h2>;
                    } else if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-lg font-medium text-gray-900 mb-2 mt-4">{line.substring(4)}</h3>;
                    } else if (line.startsWith('- ')) {
                      return <li key={index} className="text-gray-700 mb-1 ml-4">{line.substring(2)}</li>;
                    } else if (line.startsWith('```')) {
                      return <div key={index} className="bg-gray-100 p-3 rounded-lg font-mono text-sm my-3">{line}</div>;
                    } else if (line.trim() === '') {
                      return <br key={index} />;
                    } else {
                      return <p key={index} className="text-gray-700 mb-3 leading-relaxed">{line}</p>;
                    }
                  })}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Floating Actions */}
      {!isEditing && (
        <div className="fixed bottom-24 right-6">
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            onClick={handleEdit}
            className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg"
            style={{
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.9)'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit3 size={20} />
          </motion.button>
        </div>
      )}
    </div>
  );
}