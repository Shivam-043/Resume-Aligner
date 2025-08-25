"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export interface CoverLetterState {
  generationStage: 'idle' | 'started' | 'analyzing' | 'generating' | 'completed' | 'error';
  progress: number; // 0-100
  progressMessage: string;
  error?: string;
  lastUpdated: number; // timestamp
  coverLetterText?: string;
  resumeText?: string;
  jobDescription?: string;
}

interface CoverLetterContextType {
  coverLetterState: CoverLetterState;
  updateCoverLetterState: (state: Partial<CoverLetterState>) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  coverLetterText: string | null;
  setCoverLetterText: (text: string | null) => void;
  clearCoverLetterData: () => void;
}

// Create the context with a default value
const CoverLetterContext = createContext<CoverLetterContextType | null>(null);

// Custom hook to use the cover letter context
export const useCoverLetter = () => {
  const context = useContext(CoverLetterContext);
  if (!context) {
    throw new Error('useCoverLetter must be used within a CoverLetterProvider');
  }
  return context;
};

// Storage keys for consistent access
const STORAGE_KEYS = {
  COVER_LETTER_STATE: 'resumeVibe_coverLetterState',
  COVER_LETTER_TEXT: 'resumeVibe_coverLetterText',
};

export function CoverLetterProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const [coverLetterState, setCoverLetterState] = useState<CoverLetterState>({
    generationStage: 'idle',
    progress: 0,
    progressMessage: '',
    lastUpdated: Date.now()
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetterText, setCoverLetterTextState] = useState<string | null>(null);
  
  // Load all data from localStorage on mount
  useEffect(() => {
    try {
      // Load cover letter state
      const savedState = localStorage.getItem(STORAGE_KEYS.COVER_LETTER_STATE);
      if (savedState) {
        const parsedState = JSON.parse(savedState) as CoverLetterState;
        setCoverLetterState(parsedState);
        
        // If the generation was in progress, set isGenerating to true
        if (['started', 'analyzing', 'generating'].includes(parsedState.generationStage)) {
          setIsGenerating(true);
        }
      }
      
      // Load cover letter text
      const savedText = localStorage.getItem(STORAGE_KEYS.COVER_LETTER_TEXT);
      if (savedText) {
        setCoverLetterTextState(savedText);
      }
    } catch (error) {
      console.error('Error loading cover letter data from localStorage:', error);
    }
  }, []);
  
  // Update cover letter state
  const updateCoverLetterState = (state: Partial<CoverLetterState>) => {
    const newState = { ...coverLetterState, ...state, lastUpdated: Date.now() };
    setCoverLetterState(newState);
    localStorage.setItem(STORAGE_KEYS.COVER_LETTER_STATE, JSON.stringify(newState));
  };
  
  // Save cover letter text to localStorage whenever it changes
  const setCoverLetterText = (text: string | null) => {
    setCoverLetterTextState(text);
    if (text) {
      localStorage.setItem(STORAGE_KEYS.COVER_LETTER_TEXT, text);
    } else {
      localStorage.removeItem(STORAGE_KEYS.COVER_LETTER_TEXT);
    }
  };
  
  // Clear all cover letter related data
  const clearCoverLetterData = () => {
    setCoverLetterState({
      generationStage: 'idle',
      progress: 0,
      progressMessage: '',
      lastUpdated: Date.now()
    });
    setIsGenerating(false);
    setCoverLetterText(null);
    
    // Remove all keys from localStorage
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  };

  return (
    <CoverLetterContext.Provider 
      value={{ 
        coverLetterState,
        updateCoverLetterState,
        isGenerating,
        setIsGenerating,
        coverLetterText,
        setCoverLetterText,
        clearCoverLetterData
      }}
    >
      {children}
    </CoverLetterContext.Provider>
  );
}