# Study Buddy UK - Mobile App

A comprehensive React Native mobile application for UK professional certification exam preparation, featuring AI-powered study tools and personalised learning experiences.

## 🇬🇧 About

Study Buddy UK is a mobile-first learning platform designed specifically for UK professional certification exams. The app provides intelligent study tools, AI-powered recommendations, and a beautiful neumorphic interface to help students succeed in their professional certification journey.

## ✨ Features

### 📱 Complete Mobile Experience
- **25+ Screens** - Every screen from the original web UI implemented
- **Neumorphic Design** - Beautiful, modern UI with depth and shadows
- **Responsive Layout** - Optimised for all mobile screen sizes
- **Dark/Light Mode** - Complete theme system with user preferences

### 🤖 AI-Powered Learning
- **AI Study Planner** - Personalised study plans based on learning style
- **AI Learning Analytics** - Performance insights and pattern recognition
- **AI Chat Assistant** - Context-aware study support with British English
- **Smart Content Generation** - AI-generated flashcards, notes, and quizzes
- **Adaptive Recommendations** - Learning suggestions based on performance

### 📚 Study Tools
- **Mock Exams** - Full exam experience with timer and scoring
- **Flashcards** - Spaced repetition system for effective memorisation
- **Notes System** - Rich text editor with AI summarisation
- **Progress Tracking** - Detailed analytics and performance metrics
- **Revision Hub** - Smart study recommendations and scheduling

### 🔐 User Management
- **Firebase Authentication** - Secure login with email/password and social auth
- **User Profiles** - Personalised learning experience
- **Progress Sync** - Cloud-based data synchronisation
- **Offline Support** - Study anywhere, sync when connected

## 🚀 Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and build tools
- **TypeScript** - Type-safe development
- **Firebase** - Authentication and cloud database
- **Google Gemini AI** - Advanced AI capabilities
- **React Navigation** - Screen navigation and routing
- **React Context** - State management
- **Expo Vector Icons** - Beautiful iconography

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Setup
1. Clone the repository:
```bash
git clone https://github.com/noahung/study-buddy-uk.git
cd study-buddy-uk
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp env.example .env
# Edit .env with your Firebase and API keys
```

4. Start the development server:
```bash
npm start
```

5. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication and Firestore
3. Add your Firebase config to `src/constants/index.ts`

### AI Configuration
1. Get a Gemini API key from [https://makersuite.google.com](https://makersuite.google.com)
2. Add your API key to `src/constants/index.ts`

## 📱 Screens

### Authentication
- **Splash Screen** - App loading with animations
- **Onboarding** - 3-slide introduction to features
- **Auth Screen** - Login/signup with social options

### Main App
- **Home Dashboard** - Overview with stats and quick actions
- **AI Study Planner** - Personalised study planning
- **AI Learning Analytics** - Performance insights
- **Chat Screen** - AI study assistant
- **Tests Screen** - Mock exam management
- **Flashcards Screen** - Flashcard study tools
- **Notes Screen** - Note-taking and management
- **Profile Screen** - User profile and settings

### Study Screens
- **Course Selection** - Choose study courses
- **Exam Detail** - Exam information and attempts
- **Live Exam** - Full exam experience
- **Test Results** - Detailed performance analysis
- **Flashcard Study** - Interactive flashcard sessions
- **Note Detail** - View and edit notes
- **Note Editor** - Create and edit notes
- **Revision Hub** - Smart study recommendations
- **Test History** - Past exam attempts

## 🎨 Design System

### Neumorphic Components
- **NeumorphicCard** - Main content containers
- **NeumorphicButton** - Interactive buttons with depth
- **NeumorphicInput** - Form inputs with neumorphic styling
- **NeumorphicProgress** - Progress indicators

### Theme System
- **Light/Dark Mode** - Complete theme switching
- **Consistent Colours** - Professional colour palette
- **Typography** - Clear, readable font hierarchy
- **Spacing** - Consistent spacing system

## 🤖 AI Features

### Study Planner
- Personalised study plans based on learning style
- Adaptive scheduling based on performance
- Progress tracking and optimisation
- Goal-oriented study recommendations

### Learning Analytics
- Pattern recognition in study behaviour
- Performance insights and trends
- Predictive analytics for future performance
- Personalised improvement recommendations

### Content Generation
- AI-generated flashcards, notes, and quizzes
- Adaptive content based on performance
- Personalised explanations with examples
- Content summarisation and study questions

### Chat Assistant
- Context-aware conversations
- Learning profile integration
- Study suggestions based on chat history
- British English responses throughout

## 🇬🇧 British English Support

All AI responses and content use British English spelling and terminology:
- "organise" instead of "organize"
- "colour" instead of "color"
- "centre" instead of "center"
- "personalised" instead of "personalized"
- "analyse" instead of "analyze"

## 📊 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (Header, SideDrawer)
│   └── ui/             # Neumorphic UI components
├── contexts/           # React Context providers
├── navigation/         # Navigation configuration
├── screens/           # App screens
│   ├── ai/            # AI-powered screens
│   ├── auth/          # Authentication screens
│   ├── main/          # Main app screens
│   └── study/         # Study-related screens
├── services/          # API and business logic
├── types/             # TypeScript type definitions
└── constants/         # App constants and configuration
```

## 🚀 Development Phases

### ✅ Completed Phases
- **Phase 1** - Project Foundation & Setup
- **Phase 2** - Design System & Theming
- **Phase 3** - Navigation & Core Structure
- **Phase 4** - Authentication & User Management
- **Phase 5** - Course Management & Data
- **Phase 6** - Study Tools Implementation
- **Phase 7** - AI Integration & Features

### 🔄 Upcoming Phases
- **Phase 8** - Monetisation & Premium Features
- **Phase 9** - Testing, Polish & Deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@studybuddyuk.com or join our Discord community.

## 🙏 Acknowledgments

- React Native community for excellent documentation
- Expo team for the amazing development platform
- Firebase for robust backend services
- Google Gemini for AI capabilities
- All contributors who helped make this project possible

---

**Study Buddy UK** - Empowering UK professionals through intelligent learning. 🇬🇧
