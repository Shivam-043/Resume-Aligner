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
    // Set page title and meta tags for SEO
    document.title = 'Resume Portfolio Builder - Create Professional Portfolios | Resume Aligner';
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Build stunning professional portfolios from your resume data. Showcase your skills, experience, and projects with our AI-powered portfolio generator.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Build stunning professional portfolios from your resume data. Showcase your skills, experience, and projects with our AI-powered portfolio generator.';
      document.head.appendChild(meta);
    }

    // Add keywords meta tag
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'portfolio builder, resume portfolio, professional portfolio, online portfolio, career portfolio, portfolio generator';
      document.head.appendChild(meta);
    }
    
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