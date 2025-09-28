# Study Buddy UK - Deployment Guide

This guide covers the complete deployment process for the Study Buddy UK mobile app.

## 🚀 Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Copy `env.production.example` to `.env`
- [ ] Fill in all production API keys and configuration
- [ ] Verify Firebase project is properly configured
- [ ] Set up RevenueCat account and configure products
- [ ] Configure Gemini API with production quotas

### 2. Firebase Configuration
- [ ] Deploy Firestore indexes: `firebase deploy --only firestore:indexes`
- [ ] Deploy security rules: `firebase deploy --only firestore:rules`
- [ ] Configure Firebase Authentication providers
- [ ] Set up Firebase Storage rules
- [ ] Enable Firebase Analytics

### 3. App Store Preparation
- [ ] Generate app icons (1024x1024 for App Store, 512x512 for Play Store)
- [ ] Create app screenshots for both stores
- [ ] Write app store descriptions
- [ ] Prepare privacy policy and terms of service
- [ ] Set up app store developer accounts

## 📱 iOS Deployment

### Prerequisites
- macOS with Xcode installed
- Apple Developer Account ($99/year)
- iOS device or simulator for testing

### Steps

1. **Configure iOS Settings**
   ```bash
   # Update bundle identifier in app.config.js
   bundleIdentifier: "com.studybuddyuk.app"
   ```

2. **Build for iOS**
   ```bash
   # Install EAS CLI
   npm install -g @expo/eas-cli
   
   # Login to Expo
   eas login
   
   # Configure EAS
   eas build:configure
   
   # Build for iOS
   eas build --platform ios --profile production
   ```

3. **Submit to App Store**
   ```bash
   # Submit to App Store
   eas submit --platform ios
   ```

### iOS Specific Requirements
- App Store Connect configuration
- In-App Purchase products setup
- Push notification certificates
- App Store review guidelines compliance

## 🤖 Android Deployment

### Prerequisites
- Android Studio installed
- Google Play Console account ($25 one-time fee)
- Android device or emulator for testing

### Steps

1. **Configure Android Settings**
   ```bash
   # Update package name in app.config.js
   package: "com.studybuddyuk.app"
   ```

2. **Build for Android**
   ```bash
   # Build for Android
   eas build --platform android --profile production
   ```

3. **Submit to Google Play**
   ```bash
   # Submit to Google Play
   eas submit --platform android
   ```

### Android Specific Requirements
- Google Play Console configuration
- In-App Billing products setup
- App signing key management
- Google Play review guidelines compliance

## 🔧 Production Configuration

### Environment Variables
Create a `.env` file with the following variables:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Gemini API
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# RevenueCat
EXPO_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_api_key

# App Configuration
EXPO_PUBLIC_APP_ENV=production
EXPO_PUBLIC_DEBUG_MODE=false
EXPO_PUBLIC_LOG_LEVEL=error
```

### Firebase Security Rules
Ensure your Firestore rules are production-ready:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Production security rules
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // ... other rules
  }
}
```

## 🧪 Testing Before Deployment

### 1. Run Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test files
npm test -- --testPathPattern=AuthContext
```

### 2. Manual Testing Checklist
- [ ] Authentication flow (sign up, sign in, sign out)
- [ ] Course selection and navigation
- [ ] AI chat functionality
- [ ] Flashcard creation and study
- [ ] Notes creation and management
- [ ] Mock test taking
- [ ] Subscription purchase flow
- [ ] Offline functionality
- [ ] Push notifications
- [ ] Deep linking

### 3. Performance Testing
- [ ] App startup time
- [ ] Memory usage
- [ ] Battery consumption
- [ ] Network efficiency
- [ ] Database query performance

## 📊 Monitoring & Analytics

### 1. Firebase Analytics
- Set up custom events for user actions
- Track conversion funnels
- Monitor app performance metrics
- Set up crash reporting

### 2. RevenueCat Analytics
- Track subscription metrics
- Monitor conversion rates
- Analyze churn patterns
- Set up revenue alerts

### 3. Custom Analytics
- User engagement metrics
- Feature usage statistics
- Error tracking and reporting
- Performance monitoring

## 🔄 Continuous Deployment

### 1. GitHub Actions Setup
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to App Stores
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: eas build --platform all --non-interactive
```

### 2. Automated Testing
- Unit tests on every commit
- Integration tests on pull requests
- E2E tests before deployment
- Performance regression testing

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables
   - Verify API keys are correct
   - Ensure all dependencies are installed
   - Check for TypeScript errors

2. **App Store Rejections**
   - Review Apple's guidelines
   - Test on physical devices
   - Ensure all features work as described
   - Check for crashes and bugs

3. **Firebase Issues**
   - Verify project configuration
   - Check security rules
   - Ensure indexes are deployed
   - Monitor Firebase console for errors

### Support Resources
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

## 📈 Post-Deployment

### 1. Monitor Key Metrics
- App downloads and installs
- User retention rates
- Subscription conversion rates
- Crash-free sessions
- User engagement metrics

### 2. User Feedback
- Monitor app store reviews
- Collect user feedback
- Track support tickets
- Analyze user behavior

### 3. Iterative Improvements
- Regular app updates
- Feature enhancements
- Bug fixes and optimizations
- A/B testing for new features

## 🎯 Success Metrics

### Key Performance Indicators (KPIs)
- **User Acquisition**: Downloads, installs, registrations
- **User Engagement**: DAU, MAU, session duration
- **Revenue**: MRR, ARPU, conversion rates
- **Retention**: Day 1, Day 7, Day 30 retention
- **Quality**: Crash rate, app store rating

### Target Goals
- 1000+ downloads in first month
- 4.5+ app store rating
- 20%+ subscription conversion rate
- <1% crash rate
- 60%+ Day 7 retention

---

**Ready to deploy your Study Buddy UK app! 🚀**

For questions or support, contact the development team or refer to the documentation links above.
