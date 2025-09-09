"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define types for better TypeScript support
export interface PersonalInfo {
  name: string;
  jobTitle: string;
  summary: string;
  profileImage?: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  location: string;
  achievements: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  duration: string;
  location: string;
  details: string[];
}

export interface SkillItem {
  name: string;
  percentage: number;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface ProjectItem {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  image?: string;
}

export interface LeadershipItem {
  title: string;
  description: string;
  icon: "trophy" | "users" | "chart" | "target" | "award" | "lightbulb";
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

export interface PortfolioData {
  personalInfo?: PersonalInfo;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  skills?: SkillCategory[];
  projects?: ProjectItem[];
  leadership?: LeadershipItem[];
  contact?: ContactInfo;
  [key: string]: unknown;
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
  jobDescription: string | null;
  setJobDescription: (description: string | null) => void;
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
  JOB_DESCRIPTION: 'resumeVibe_jobDescription',
  GENERATION_STATE: 'resumeVibe_generationState',
  PROFILE_IMAGE: 'resumeVibe_profileImage'
};

export function PortfolioProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const [portfolioData, setPortfolioDataState] = useState<PortfolioData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [resumeText, setResumeTextState] = useState<string | null>(null);
  const [jobDescription, setJobDescriptionState] = useState<string | null>(null);
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

      // Load job description
      const savedJobDescription = localStorage.getItem(STORAGE_KEYS.JOB_DESCRIPTION);
      if (savedJobDescription) {
        setJobDescriptionState(savedJobDescription);
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

  // Save job description to localStorage whenever it changes
  const setJobDescription = (description: string | null) => {
    setJobDescriptionState(description);
    if (description) {
      localStorage.setItem(STORAGE_KEYS.JOB_DESCRIPTION, description);
    } else {
      localStorage.removeItem(STORAGE_KEYS.JOB_DESCRIPTION);
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
    setJobDescription(null);
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
        jobDescription,
        setJobDescription,
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