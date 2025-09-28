import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';

// Google Sign-In
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    // For React Native, we'll use a web-based OAuth flow
    // This will be implemented with expo-auth-session
    throw new Error('Google Sign-In not implemented yet');
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

// Apple Sign-In
export const signInWithApple = async (): Promise<User | null> => {
  try {
    // For React Native, we'll use a web-based OAuth flow
    // This will be implemented with expo-auth-session
    throw new Error('Apple Sign-In not implemented yet');
  } catch (error) {
    console.error('Apple Sign-In Error:', error);
    throw error;
  }
};

// Email/Password Sign-In
export const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = await createUserFromFirebaseUser(userCredential.user);
    return user;
  } catch (error) {
    console.error('Email Sign-In Error:', error);
    throw error;
  }
};

// Email/Password Sign-Up
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
): Promise<User | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    await updateProfile(userCredential.user, {
      displayName: name,
    });

    // Create user document in Firestore
    const user = await createUserFromFirebaseUser(userCredential.user);
    await createUserDocument(user);
    
    return user;
  } catch (error) {
    console.error('Email Sign-Up Error:', error);
    throw error;
  }
};

// Sign Out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
};

// Auth State Listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const user = await createUserFromFirebaseUser(firebaseUser);
      callback(user);
    } else {
      callback(null);
    }
  });
};

// Helper function to create User from Firebase User
const createUserFromFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  // Get user data from Firestore
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  const userData = userDoc.data();

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || userData?.name || '',
    subscription: userData?.subscription || 'free',
    createdAt: userData?.createdAt?.toDate() || new Date(),
    lastActive: new Date(),
  };
};

// Helper function to create user document in Firestore
const createUserDocument = async (user: User): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', user.id), {
      name: user.name,
      email: user.email,
      subscription: user.subscription,
      createdAt: user.createdAt,
      lastActive: user.lastActive,
    });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

// Update user subscription
export const updateUserSubscription = async (userId: string, subscription: 'free' | 'premium'): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', userId), {
      subscription,
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
};
