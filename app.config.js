export default {
  expo: {
    name: "Study Buddy UK",
    slug: "study-buddy-uk",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.studybuddyuk.app",
      buildNumber: "1.0.0",
      infoPlist: {
        NSUserTrackingUsageDescription: "This app uses tracking to provide personalized study recommendations and analytics.",
        NSCameraUsageDescription: "This app uses the camera to scan documents and create study materials.",
        NSPhotoLibraryUsageDescription: "This app accesses your photo library to import study materials.",
        NSMicrophoneUsageDescription: "This app uses the microphone for voice notes and audio study features."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.studybuddyuk.app",
      versionCode: 1,
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-build-properties",
        {
          ios: {
            newArchEnabled: false
          },
          android: {
            newArchEnabled: false
          }
        }
      ],
      [
        "expo-in-app-purchases",
        {
          ios: {
            inAppPurchase: true
          },
          android: {
            inAppPurchase: true
          }
        }
      ]
    ],
    extra: {
      firebaseConfig: {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
      },
      geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
      revenueCatApiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY
    },
    scheme: "study-buddy-uk",
    privacy: "public",
    platforms: ["ios", "android"],
    owner: "noahung",
    updates: {
      url: "https://u.expo.dev/your-project-id"
    },
    runtimeVersion: {
      policy: "sdkVersion"
    }
  }
};
