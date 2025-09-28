// App Configuration
export const APP_CONFIG = {
  name: 'Study Buddy',
  version: '1.0.0',
  description: 'AI-powered learning companion for UK professional certification exams',
};

// API Configuration
export const API_CONFIG = {
  baseUrl: 'https://api.studybuddy.app',
  timeout: 10000,
  retryAttempts: 3,
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyADzjlZGLKTShyPdSKZUn99tOrI5cDCW0c",
  authDomain: "study-buddy-uk.firebaseapp.com",
  projectId: "study-buddy-uk",
  storageBucket: "study-buddy-uk.firebasestorage.app",
  messagingSenderId: "633716983227",
  appId: "1:633716983227:web:25c410ca52a0d03bac309e",
  measurementId: "G-EC8F87MMQQ"
};

// Gemini API Configuration
export const GEMINI_API_KEY = "AIzaSyBlRqe8uyAPHqL2uVhuMPPT6PdQCq86rKE";

// Course Categories from PRD
export const COURSE_CATEGORIES = [
  {
    id: 'finance-banking',
    name: 'Finance & Banking',
    description: 'Financial certifications and banking qualifications',
    courses: [
      'CeMAP – Certificate in Mortgage Advice and Practice',
      'DipFA – Diploma for Financial Advisers',
      'CFA – Chartered Financial Analyst',
      'ACCA – Association of Chartered Certified Accountants',
      'CIMA – Chartered Institute of Management Accountants',
      'IMC – Investment Management Certificate',
    ],
  },
  {
    id: 'law-compliance',
    name: 'Law & Compliance',
    description: 'Legal qualifications and compliance certifications',
    courses: [
      'CILEx – Chartered Institute of Legal Executives',
      'SQE – Solicitors Qualifying Exam',
      'CISI – Chartered Institute for Securities & Investment',
      'AML – Anti-Money Laundering Certificate',
    ],
  },
  {
    id: 'it-cybersecurity',
    name: 'IT & Cybersecurity',
    description: 'Technology and cybersecurity certifications',
    courses: [
      'CompTIA A+',
      'CompTIA Security+',
      'AWS Certified Solutions Architect',
      'Microsoft Azure Fundamentals',
      'Cisco CCNA',
      'Certified Ethical Hacker (CEH)',
    ],
  },
  {
    id: 'health-safety',
    name: 'Health & Safety',
    description: 'Health, safety, and environmental certifications',
    courses: [
      'NEBOSH General Certificate',
      'IOSH Managing Safely',
      'First Aid at Work',
      'Food Safety Level 3',
    ],
  },
  {
    id: 'education-training',
    name: 'Education & Training',
    description: 'Teaching and training qualifications',
    courses: [
      'PTLLS – Preparing to Teach in the Lifelong Learning Sector',
      'Level 3 Award in Education and Training',
      'Assessor Qualification (CAVA)',
    ],
  },
];

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: {
      aiChat: { limit: 10, unit: 'messages per day' },
      mockTests: { limit: 3, unit: 'attempts' },
      flashcards: { enabled: false },
      notes: { aiAssistance: false },
    },
  },
  premium: {
    name: 'Premium',
    price: 9.99,
    features: {
      aiChat: { limit: -1, unit: 'unlimited' },
      mockTests: { limit: -1, unit: 'unlimited' },
      flashcards: { enabled: true },
      notes: { aiAssistance: true },
    },
  },
};

// UI Constants
export const UI_CONSTANTS = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  neumorphic: {
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  user: 'user',
  theme: 'theme',
  onboarding: 'onboarding_completed',
  subscription: 'subscription',
  settings: 'settings',
};

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Exam Configuration
export const EXAM_CONFIG = {
  mini: {
    questions: 10,
    timeLimit: 15, // minutes
  },
  full: {
    questions: 50,
    timeLimit: 90, // minutes
  },
  passingScore: 70, // percentage
};
