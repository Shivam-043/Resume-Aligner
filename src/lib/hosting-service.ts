"use client";

import { doc, setDoc, getDoc, updateDoc, arrayUnion, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, generateShortUrlHash } from './firebase';
import { getCurrentUser } from './auth-service';
import { PortfolioData } from './portfolio-context';

// Check if Firebase is initialized
const isFirebaseInitialized = () => {
  return db !== null && storage !== null;
};

interface HostedPortfolio {
  id: string;
  shortUrl: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  portfolioData: PortfolioData;
  views?: number;
  public?: boolean;
  dataUrl?: string;
  userId?: string;
}

interface PortfolioReference {
  id: string;
  shortUrl: string;
  title: string;
  createdAt: string;
}

// Save a portfolio to Firebase and generate a shareable URL
export const hostPortfolio = async (
  portfolioData: PortfolioData, 
  title: string, 
  description: string = ''
): Promise<{ id: string; shortUrl: string; shareableUrl: string }> => {
  if (!isFirebaseInitialized()) {
    throw new Error('Firebase is not initialized. Check your Firebase configuration in the .env.local file.');
  }
  
  const user = getCurrentUser();
  
  if (!user) {
    throw new Error('User must be authenticated to host a portfolio');
  }
  
  try {
    // Generate a unique ID for the portfolio
    const shortUrl = generateShortUrlHash();
    const portfolioId = `${user.uid}_${shortUrl}`;
    
    // Create portfolio document in Firestore
    const portfolioDoc: Omit<HostedPortfolio, 'portfolioData'> = {
      id: portfolioId,
      userId: user.uid,
      shortUrl,
      title,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      public: true,
      views: 0
    };
    
    // Save portfolio data as a JSON string in Storage
    const portfolioDataRef = ref(storage, `portfolios/${portfolioId}/data.json`);
    await uploadString(portfolioDataRef, JSON.stringify(portfolioData), 'raw');
    
    // Get the download URL for the portfolio data
    const portfolioDataUrl = await getDownloadURL(portfolioDataRef);
    
    // Add the URL to the portfolio document
    portfolioDoc.dataUrl = portfolioDataUrl;
    
    // Save the portfolio document to Firestore
    await setDoc(doc(db, 'portfolios', portfolioId), portfolioDoc);
    
    // Check if user document exists, if not, create it before updating
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    
    const portfolioRef: PortfolioReference = {
      id: portfolioId,
      shortUrl,
      title,
      createdAt: new Date().toISOString(),
    };
    
    if (!userDocSnapshot.exists()) {
      // Create user document if it doesn't exist
      await setDoc(userDocRef, {
        email: user.email,
        createdAt: new Date().toISOString(),
        hostedPortfolios: [portfolioRef]
      });
    } else {
      // Update existing user document
      await updateDoc(userDocRef, {
        hostedPortfolios: arrayUnion(portfolioRef)
      });
    }
    
    return {
      id: portfolioId,
      shortUrl,
      shareableUrl: `${window.location.origin}/portfolio/${shortUrl}`
    };
  } catch (error) {
    console.error('Error hosting portfolio:', error);
    throw error;
  }
};

// Get a hosted portfolio by its short URL
export const getHostedPortfolio = async (shortUrl: string): Promise<HostedPortfolio | null> => {
  if (!isFirebaseInitialized()) {
    throw new Error('Firebase is not initialized. Check your Firebase configuration in the .env.local file.');
  }
  
  try {
    // Query for the portfolio document by shortUrl
    const portfoliosRef = collection(db, 'portfolios');
    const q = query(portfoliosRef, where('shortUrl', '==', shortUrl));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const portfolioDoc = querySnapshot.docs[0].data() as Omit<HostedPortfolio, 'portfolioData'>;
    
    // Get the portfolio data from Storage
    const portfolioDataRef = ref(storage, `portfolios/${portfolioDoc.id}/data.json`);
    const portfolioDataUrl = await getDownloadURL(portfolioDataRef);
    
    // Fetch the JSON data
    const response = await fetch(portfolioDataUrl);
    const portfolioData = await response.json();
    
    // Increment view count
    await updateDoc(doc(db, 'portfolios', portfolioDoc.id), {
      views: (portfolioDoc.views || 0) + 1
    });
    
    return {
      ...portfolioDoc,
      portfolioData
    } as HostedPortfolio;
  } catch (error) {
    console.error('Error getting hosted portfolio:', error);
    throw error;
  }
};

// Get all portfolios for the current user
export const getUserPortfolios = async (): Promise<PortfolioReference[]> => {
  if (!isFirebaseInitialized()) {
    throw new Error('Firebase is not initialized. Check your Firebase configuration in the .env.local file.');
  }
  
  const user = getCurrentUser();
  
  if (!user) {
    throw new Error('User must be authenticated to get their portfolios');
  }
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      return [];
    }
    
    const userData = userDoc.data();
    return (userData.hostedPortfolios || []) as PortfolioReference[];
  } catch (error) {
    console.error('Error getting user portfolios:', error);
    throw error;
  }
};

// Delete a hosted portfolio
export const deleteHostedPortfolio = async (portfolioId: string): Promise<boolean> => {
  if (!isFirebaseInitialized()) {
    throw new Error('Firebase is not initialized. Check your Firebase configuration in the .env.local file.');
  }
  
  const user = getCurrentUser();
  
  if (!user) {
    throw new Error('User must be authenticated to delete a portfolio');
  }
  
  try {
    // Get the user document
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }
    
    const userData = userDoc.data();
    
    // Filter out the portfolio to be deleted
    const updatedPortfolios = (userData.hostedPortfolios || []).filter(
      (portfolio: PortfolioReference) => portfolio.id !== portfolioId
    );
    
    // Update the user document
    await updateDoc(doc(db, 'users', user.uid), {
      hostedPortfolios: updatedPortfolios
    });
    
    // Delete the portfolio document
    await deleteDoc(doc(db, 'portfolios', portfolioId));
    
    // Delete the portfolio data from Storage
    const portfolioDataRef = ref(storage, `portfolios/${portfolioId}/data.json`);
    await deleteObject(portfolioDataRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting hosted portfolio:', error);
    throw error;
  }
};