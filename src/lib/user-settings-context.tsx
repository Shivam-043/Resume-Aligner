"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface UserSettings {
  geminiApiKey?: string;
  hasCompletedOnboarding?: boolean;
  showTourGuide?: boolean;
  preferences?: {
    theme?: 'light' | 'dark';
    language?: string;
  };
}

interface UserSettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  isApiKeyConfigured: () => boolean;
  clearSettings: () => void;
  loading: boolean;
}

const UserSettingsContext = createContext<UserSettingsContextType | null>(null);

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
};

const STORAGE_KEY = 'resumeVibe_userSettings';

export const UserSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>({});
  const [loading, setLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } else {
        // First time user - show tour guide
        setSettings({ showTourGuide: true, hasCompletedOnboarding: false });
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
      setSettings({ showTourGuide: true, hasCompletedOnboarding: false });
    } finally {
      setLoading(false);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Error saving user settings:', error);
      }
    }
  }, [settings, loading]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const isApiKeyConfigured = () => {
    return Boolean(settings.geminiApiKey && settings.geminiApiKey.trim().length > 0);
  };

  const clearSettings = () => {
    setSettings({});
    localStorage.removeItem(STORAGE_KEY);
  };

  const value: UserSettingsContextType = {
    settings,
    updateSettings,
    isApiKeyConfigured,
    clearSettings,
    loading
  };

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
};