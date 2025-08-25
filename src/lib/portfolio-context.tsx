"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define types for better TypeScript support
export interface PortfolioData {
  personalInfo?: {
    name: string;
    jobTitle: string;
    summary: string;
    profileImage?: string;
    [key: string]: any;
  };
  experience?: any[];
  education?: any[];
  skills?: any[];
  projects?: any[];
  leadership?: any[];
  contact?: any;
  [key: string]: any;
}

export interface GenerationState {
  stage: 'idle' | 'started' | 'analyzing' | 'generating' | 'completed' | 'error';
  progress: number; // 0-100
  progressMessage: string;
  error?: string;
  lastUpdated: number; // timestamp
}

interface PortfolioContextType {
  portfolioData: PortfolioData | null;
  setPortfolioData: (data: PortfolioData | null) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  generationProgress: string;
  setGenerationProgress: (progress: string) => void;
  generationState: GenerationState;
  updateGenerationState: (state: Partial<GenerationState>) => void;
  resumeText: string | null;
  setResumeText: (text: string | null) => void;
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  clearPortfolioData: () => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

// Create the context with a default value
const PortfolioContext = createContext<PortfolioContextType | null>(null);

// Custom hook to use the portfolio context
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

// Storage keys for consistent access
const STORAGE_KEYS = {
  PORTFOLIO_DATA: 'resumeVibe_portfolioData',
  RESUME_TEXT: 'resumeVibe_resumeText',
  GENERATION_STATE: 'resumeVibe_generationState',
  PROFILE_IMAGE: 'resumeVibe_profileImage'
};

export function PortfolioProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const [portfolioData, setPortfolioDataState] = useState<PortfolioData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [resumeText, setResumeTextState] = useState<string | null>(null);
  const [profileImage, setProfileImageState] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [generationState, setGenerationState] = useState<GenerationState>({
    stage: 'idle',
    progress: 0,
    progressMessage: '',
    lastUpdated: Date.now()
  });
  
  // Load all data from localStorage on mount
  useEffect(() => {
    try {
      // Load portfolio data
      const savedPortfolioData = localStorage.getItem(STORAGE_KEYS.PORTFOLIO_DATA);
      if (savedPortfolioData) {
        setPortfolioDataState(JSON.parse(savedPortfolioData));
      }
      
      // Load resume text
      const savedResumeText = localStorage.getItem(STORAGE_KEYS.RESUME_TEXT);
      if (savedResumeText) {
        setResumeTextState(savedResumeText);
      }
      
      // Load generation state
      const savedGenerationState = localStorage.getItem(STORAGE_KEYS.GENERATION_STATE);
      if (savedGenerationState) {
        setGenerationState(JSON.parse(savedGenerationState));
        // If the generation was in progress, set isGenerating to true
        const parsedState = JSON.parse(savedGenerationState) as GenerationState;
        if (['started', 'analyzing', 'generating'].includes(parsedState.stage)) {
          setIsGenerating(true);
          setGenerationProgress(parsedState.progressMessage);
        }
      }
      
      // Load profile image
      const savedProfileImage = localStorage.getItem(STORAGE_KEYS.PROFILE_IMAGE);
      if (savedProfileImage) {
        setProfileImageState(savedProfileImage);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);
  
  // Save portfolio data to localStorage whenever it changes
  const setPortfolioData = (data: PortfolioData | null) => {
    setPortfolioDataState(data);
    if (data) {
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO_DATA, JSON.stringify(data));
    } else {
      localStorage.removeItem(STORAGE_KEYS.PORTFOLIO_DATA);
    }
  };
  
  // Save resume text to localStorage whenever it changes
  const setResumeText = (text: string | null) => {
    setResumeTextState(text);
    if (text) {
      localStorage.setItem(STORAGE_KEYS.RESUME_TEXT, text);
    } else {
      localStorage.removeItem(STORAGE_KEYS.RESUME_TEXT);
    }
  };
  
  // Update generation state
  const updateGenerationState = (state: Partial<GenerationState>) => {
    const newState = { ...generationState, ...state, lastUpdated: Date.now() };
    setGenerationState(newState);
    localStorage.setItem(STORAGE_KEYS.GENERATION_STATE, JSON.stringify(newState));
  };
  
  // Save profile image to localStorage whenever it changes
  const setProfileImage = (image: string | null) => {
    setProfileImageState(image);
    if (image) {
      localStorage.setItem(STORAGE_KEYS.PROFILE_IMAGE, image);
    } else {
      localStorage.removeItem(STORAGE_KEYS.PROFILE_IMAGE);
    }
  };
  
  // Clear all portfolio-related data
  const clearPortfolioData = () => {
    setPortfolioData(null);
    setResumeText(null);
    setIsGenerating(false);
    setGenerationProgress('');
    setProfileImage(null);
    setHasUnsavedChanges(false);
    updateGenerationState({
      stage: 'idle',
      progress: 0,
      progressMessage: '',
    });
    
    // Remove all keys from localStorage
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  };

  return (
    <PortfolioContext.Provider 
      value={{ 
        portfolioData, 
        setPortfolioData,
        isGenerating,
        setIsGenerating,
        generationProgress,
        setGenerationProgress,
        generationState,
        updateGenerationState,
        resumeText,
        setResumeText,
        profileImage,
        setProfileImage,
        clearPortfolioData,
        hasUnsavedChanges,
        setHasUnsavedChanges
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}