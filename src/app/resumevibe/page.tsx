'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import '../../client/src/index.css'; // Import main CSS
import '../../client/src/portfolio.css'; // Import portfolio-specific CSS

// Dynamically import the entire ResumeVibe App
// This prevents server-side rendering issues since the ResumeVibe app uses browser APIs
const ResumeVibeApp = dynamic(
  () => import('../../client/src/App'),
  { ssr: false }
);

export default function ResumeVibePage() {
  useEffect(() => {
    // Set page title
    document.title = 'Resume Portfolio | Resume Aligner';
    
    // Ensure we're working with clean navigation state
    if (typeof window !== 'undefined') {
      // Clear any existing hash to ensure we start at the root route
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      
      // Add custom class to body for portfolio-specific styles
      document.body.classList.add('portfolio-page');
      
      return () => {
        document.body.classList.remove('portfolio-page');
      };
    }
  }, []);

  return (
    <div className="resume-vibe-container min-h-screen bg-white">
      <ResumeVibeApp />
    </div>
  );
}