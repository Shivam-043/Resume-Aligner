import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin if it hasn't been initialized yet
let app;
let db;
let storage;

try {
  if (!getApps().length) {
    // Use environment variables for the service account or load from a JSON file
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
        : undefined,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    // If we have full service account credentials
    if (serviceAccount.privateKey && serviceAccount.clientEmail) {
      app = initializeApp({
        credential: cert(serviceAccount as any),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } else {
      // Fall back to default credentials (e.g., when deployed on Firebase hosting)
      app = initializeApp({
        projectId: serviceAccount.projectId,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }
    
    db = getFirestore();
    storage = getStorage();
    console.log('Firebase Admin SDK initialized successfully');
  } else {
    app = getApps()[0];
    db = getFirestore();
    storage = getStorage();
  }
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
}

interface HostedPortfolio {
  id: string;
  shortUrl: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  portfolioData: any;
  dataUrl?: string;
}

// Server-side function to get a hosted portfolio by its short URL
export async function getHostedPortfolioServer(shortUrl: string): Promise<HostedPortfolio | null> {
  try {
    if (!db) {
      console.error("Firebase Admin is not initialized. Cannot fetch portfolio data.");
      return null;
    }
    
    console.log(`Fetching portfolio with shortUrl: ${shortUrl}`);
    
    // Query for the portfolio document by shortUrl
    const portfoliosSnapshot = await db
      .collection('portfolios')
      .where('shortUrl', '==', shortUrl)
      .limit(1)
      .get();
    
    if (portfoliosSnapshot.empty) {
      console.log(`No portfolio found with shortUrl: ${shortUrl}`);
      return null;
    }
    
    const portfolioDoc = portfoliosSnapshot.docs[0].data() as any;
    console.log(`Found portfolio document: ${portfolioDoc.id}`);
    
    // Get the portfolio data by fetching from the dataUrl
    let portfolioData;
    try {
      if (!portfolioDoc.dataUrl) {
        throw new Error('Portfolio data URL is missing');
      }
      
      console.log(`Fetching portfolio data from URL: ${portfolioDoc.dataUrl}`);
      const response = await fetch(portfolioDoc.dataUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio data: ${response.status} ${response.statusText}`);
      }
      
      portfolioData = await response.json();
      console.log('Successfully fetched portfolio data');
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      portfolioData = { 
        error: "Failed to load portfolio data",
        personalInfo: {
          name: portfolioDoc.title || "Portfolio Owner",
          title: "Professional Portfolio",
          summary: "This portfolio is currently experiencing technical difficulties. Please try again later."
        }
      };
    }
    
    // Increment view count
    try {
      await db
        .collection('portfolios')
        .doc(portfoliosSnapshot.docs[0].id)
        .update({
          views: (portfolioDoc.views || 0) + 1
        });
      console.log('View count updated successfully');
    } catch (updateError) {
      console.error('Failed to update view count:', updateError);
      // Continue execution even if view count update fails
    }
    
    return {
      ...portfolioDoc,
      portfolioData
    } as HostedPortfolio;
  } catch (error) {
    console.error('Error getting hosted portfolio:', error);
    return null;
  }
}