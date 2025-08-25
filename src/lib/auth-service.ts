"use client";

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Check if Firebase is initialized
const isFirebaseInitialized = () => {
  return auth !== null && db !== null;
};

// Create a new user with email and password
export const signUp = async (email: string, password: string) => {
  if (!isFirebaseInitialized()) {
    throw new Error('Firebase is not initialized. Check your Firebase configuration in the .env.local file.');
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Create a user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: email,
      createdAt: new Date().toISOString(),
      hostedPortfolios: []
    });
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  if (!isFirebaseInitialized()) {
    throw new Error('Firebase is not initialized. Check your Firebase configuration in the .env.local file.');
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  if (!isFirebaseInitialized()) {
    throw new Error('Firebase is not initialized. Check your Firebase configuration in the .env.local file.');
  }
  
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user document exists, if not, create it
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        createdAt: new Date().toISOString(),
        hostedPortfolios: []
      });
    }
    
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  if (!isFirebaseInitialized()) {
    throw new Error('Firebase is not initialized. Check your Firebase configuration in the .env.local file.');
  }
  
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get the current user
export const getCurrentUser = (): User | null => {
  if (!isFirebaseInitialized()) {
    console.warn('Firebase is not initialized. Cannot get current user.');
    return null;
  }
  return auth.currentUser;
};

// Subscribe to auth state changes
export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!isFirebaseInitialized()) {
    console.warn('Firebase is not initialized. Auth state changes will not be monitored.');
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};