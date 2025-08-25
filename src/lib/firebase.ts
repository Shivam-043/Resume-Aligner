"use client";

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { nanoid } from 'nanoid';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check if Firebase config is valid before initializing
const isFirebaseConfigValid = () => {
  return (
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== '' && 
    firebaseConfig.apiKey !== 'your-api-key' &&
    firebaseConfig.authDomain && 
    firebaseConfig.projectId
  );
};

// Initialize Firebase - only if config is valid and it hasn't been initialized already
let app;
let auth;
let db;
let storage;

if (isFirebaseConfigValid()) {
  try {
    // Check if Firebase is already initialized
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Create dummy objects to prevent errors
    app = null;
    auth = null;
    db = null;
    storage = null;
  }
} else {
  console.warn('Firebase configuration is missing or invalid. Firebase features will not work.');
  // Create dummy objects to prevent errors
  app = null;
  auth = null;
  db = null;
  storage = null;
}

// Generate a random short URL hash
export const generateShortUrlHash = () => {
  return nanoid(8); // Generate an 8-character hash
};

export { app, auth, db, storage };