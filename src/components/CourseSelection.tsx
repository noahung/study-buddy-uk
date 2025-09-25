import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, TrendingUp, Users, Clock, Star, ChevronRight, ArrowLeft, BookOpen, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface CourseSelectionProps {
  onCourseSelect: () => void;
}

export default function CourseSelection({ onCourseSelect }: CourseSelectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const categories = [
    {
      id: 'finance',
      title: 'Finance',
      description: 'Banking, Investment, Accounting',
      icon: '💰',
      color: 'from-green-500 to-emerald-600',
      courses: 42,
      students: '12.5k',
      subCourses: [
        { id: 'cemap', title: 'CeMAP (Certificate in Mortgage Advice & Practice)', level: 'Advanced', duration: '12 weeks' },
        { id: 'cii', title: 'CII Insurance Qualifications', level: 'Intermediate', duration: '8 weeks' },
        { id: 'acca', title: 'ACCA (Association of Chartered Certified Accountants)', level: 'Professional', duration: '24 weeks' },
        { id: 'aat', title: 'AAT (Association of Accounting Technicians)', level: 'Foundation', duration: '16 weeks' },
        { id: 'cfa', title: 'CFA (Chartered Financial Analyst)', level: 'Advanced', duration: '36 weeks' },
        { id: 'fra', title: 'FRA (Financial Risk Assessment)', level: 'Intermediate', duration: '10 weeks' }
      ]
    },
    {
      id: 'hr',
      title: 'Human Resources',
      description: 'Recruitment, Management, Policy',
      icon: '👥',
      color: 'from-blue-500 to-cyan-600',
      courses: 38,
      students: '8.2k',
      subCourses: [
        { id: 'cipd', title: 'CIPD (Chartered Institute of Personnel and Development)', level: 'Professional', duration: '20 weeks' },
        { id: 'shrm', title: 'SHRM (Society for Human Resource Management)', level: 'Advanced', duration: '14 weeks' },
        { id: 'hrci', title: 'HRCI (HR Certification Institute)', level: 'Intermediate', duration: '12 weeks' },
        { id: 'phri', title: 'PHR (Professional in Human Resources)', level: 'Professional', duration: '16 weeks' },
        { id: 'sphr', title: 'SPHR (Senior Professional in Human Resources)', level: 'Advanced', duration: '18 weeks' }
      ]
    },
    {
      id: 'it',
      title: 'Information Technology',
      description: 'Programming, Security, Cloud',
      icon: '💻',
      color: 'from-purple-500 to-pink-600',
      courses: 156,
      students: '25.7k',
      subCourses: [
        { id: 'aws', title: 'AWS Solutions Architect', level: 'Advanced', duration: '14 weeks' },
        { id: 'cissp', title: 'CISSP (Certified Information Systems Security Professional)', level: 'Expert', duration: '20 weeks' },
        { id: 'pmp', title: 'PMP (Project Management Professional)', level: 'Advanced', duration: '16 weeks' },
        { id: 'ccna', title: 'CCNA (Cisco Certified Network Associate)', level: 'Intermediate', duration: '12 weeks' },
        { id: 'comptia', title: 'CompTIA Security+', level: 'Intermediate', duration: '10 weeks' },
        { id: 'react', title: 'React Advanced Patterns', level: 'Advanced', duration: '8 weeks' },
        { id: 'python', title: 'Python Full Stack Development', level: 'Intermediate', duration: '16 weeks' }
      ]
    },
    {
      id: 'healthcare',
      title: 'Healthcare',
      description: 'Medicine, Nursing, Therapy',
      icon: '🏥',
      color: 'from-red-500 to-orange-600',
      courses: 67,
      students: '15.3k',
      subCourses: [
        { id: 'nclex', title: 'NCLEX-RN (National Council Licensure Examination)', level: 'Professional', duration: '12 weeks' },
        { id: 'cma', title: 'CMA (Certified Medical Assistant)', level: 'Foundation', duration: '8 weeks' },
        { id: 'cna', title: 'CNA (Certified Nursing Assistant)', level: 'Foundation', duration: '6 weeks' },
        { id: 'rn', title: 'RN (Registered Nurse) Prep', level: 'Professional', duration: '16 weeks' },
        { id: 'lpn', title: 'LPN (Licensed Practical Nurse)', level: 'Intermediate', duration: '10 weeks' }
      ]
    }
  ];

  const myCourses = [
    {
      title: 'React Advanced Patterns',
      progress: 67,
      lastAccessed: '2 hours ago',
      category: 'IT'
    },
    {
      title: 'Financial Analysis Fundamentals',
      progress: 34,
      lastAccessed: '1 day ago',
      category: 'Finance'
    }
  ];

  const selectedCategoryData = selectedCategory ? categories.find(cat => cat.id === selectedCategory) : null;

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleCourseSelect = (course: any) => {
    setSelectedCourse(course);
    onCourseSelect();
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedCourse(null);
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
          {selectedCategory && (
            <div className="flex items-center mb-4">
              <motion.button
                onClick={handleBackToCategories}
                className="flex items-center space-x-2 text-blue-600 mb-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={20} />
                <span>Back to Categories</span>
              </motion.button>
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedCategory ? selectedCategoryData?.title + ' Courses' : 'Choose Your Path'}
          </h1>
          <p className="text-gray-600 mb-6">
            {selectedCategory ? 'Select a course to begin your learning journey' : 'Select a category to start learning'}
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-4 rounded-xl border-0"
              style={{
                boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
                background: 'rgba(255, 255, 255, 0.8)'
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* My Courses Section */}
      {myCourses.length > 0 && (
        <div className="px-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">Continue Learning</h2>
            <div className="space-y-3">
              {myCourses.map((course, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="bg-white p-4 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCourseSelect}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {course.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">{course.progress}% complete</span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {course.lastAccessed}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${course.progress}%`,
                        boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.3)'
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Categories or Courses Grid */}
      <div className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {selectedCategory ? 'Available Courses' : 'Browse Categories'}
          </h2>
          
          {!selectedCategory ? (
            /* Categories Grid */
            <div className="grid grid-cols-1 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="bg-white p-6 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)'
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${category.color.replace('from-', '').replace(' to-', ', ')})`,
                        boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      {category.icon}
                    </div>
                    <ChevronRight className="text-gray-400" size={20} />
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <TrendingUp size={14} className="mr-1" />
                        {category.courses} courses
                      </span>
                      <span className="flex items-center">
                        <Users size={14} className="mr-1" />
                        {category.students} students
                      </span>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star size={14} className="fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.8</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Courses Grid */
            <div className="grid grid-cols-1 gap-4">
              {selectedCategoryData?.subCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="bg-white p-6 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.9)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCourseSelect(course)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${selectedCategoryData.color.replace('from-', '').replace(' to-', ', ')})`,
                        boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <BookOpen className="text-white" size={20} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course.level === 'Foundation' ? 'bg-green-100 text-green-700' :
                        course.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                        course.level === 'Advanced' ? 'bg-purple-100 text-purple-700' :
                        course.level === 'Professional' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {course.level}
                      </span>
                      <ChevronRight className="text-gray-400" size={20} />
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-2">{course.title}</h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {course.duration}
                    </span>
                    <span className="flex items-center">
                      <Award size={14} className="mr-1" />
                      Certificate included
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}