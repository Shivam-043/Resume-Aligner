import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

interface PersonalInfo {
  name: string;
  jobTitle: string;
  summary: string;
  profileImage?: string;
}

// Default fallback data
const defaultPersonalInfo: PersonalInfo = {
  name: "Shivam Krishan Varshney",
  jobTitle: "Software Engineer",
  summary: "Passionate Flutter & Android Developer from NIT Kurukshetra, crafting exceptional mobile experiences and leading cross-functional teams to deliver innovative solutions.",
  profileImage: ""
};

const Hero = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(defaultPersonalInfo);
  
  useEffect(() => {
    // Try to get portfolio data from localStorage
    try {
      const portfolioData = localStorage.getItem('resumeVibe_portfolioData');
      if (portfolioData) {
        const parsedData = JSON.parse(portfolioData);
        if (parsedData.personalInfo) {
          setPersonalInfo({
            name: parsedData.personalInfo.name || defaultPersonalInfo.name,
            jobTitle: parsedData.personalInfo.jobTitle || defaultPersonalInfo.jobTitle,
            summary: parsedData.personalInfo.summary || defaultPersonalInfo.summary,
            profileImage: parsedData.personalInfo.profileImage || defaultPersonalInfo.profileImage
          });
        }
      }
    } catch (error) {
      console.error("Error loading portfolio data:", error);
    }
  }, []);
  
  // Split name into first and last for styling
  const nameParts = personalInfo.name.trim().split(/\s+/);
  const firstName = nameParts.length >= 2 ? nameParts.slice(0, nameParts.length - 1).join(' ') : personalInfo.name;
  const lastName = nameParts.length >= 2 ? nameParts[nameParts.length - 1] : "";

  return (
    <section id="home" className="portfolio-hero min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden" data-testid="hero-section">
      {/* Minimalistic background elements */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-gradient-to-r from-[var(--portfolio-primary)] to-[var(--portfolio-secondary)]"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-[var(--portfolio-accent)] to-[var(--portfolio-vibrant)]"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-[var(--portfolio-secondary)] opacity-20 blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10 text-center animate-fade-in">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl animate-bounce-subtle ring-4 ring-[var(--portfolio-primary)] ring-offset-4 ring-offset-transparent" data-testid="profile-avatar">
            <img 
              src={personalInfo.profileImage || "/placeholder-profile.jpg"} 
              alt={`${personalInfo.name} - ${personalInfo.jobTitle}`}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6" data-testid="hero-title">
          <span className="gradient-text">{firstName}</span>
          {lastName && (
            <>
              <br />
              <span className="text-[var(--portfolio-dark)]">{lastName}</span>
            </>
          )}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-4" data-testid="hero-subtitle">{personalInfo.jobTitle}</p>
        
        <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto" data-testid="hero-description">
          {personalInfo.summary}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            asChild
            className="vibrant-button"
            data-testid="button-contact"
          >
            <a href="#contact">
              Get In Touch
            </a>
          </Button>
          
          <Button 
            asChild
            variant="outline"
            className="vibrant-button-outline"
            data-testid="button-work"
          >
            <a href="#experience">
              View Work
            </a>
          </Button>
        </div>
        
        <div className="mt-12 flex justify-center space-x-6" data-testid="hero-stats">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--portfolio-primary)]" data-testid="stat-users">100K+</div>
            <div className="text-sm text-gray-500">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--portfolio-secondary)]" data-testid="stat-rating">4.7★</div>
            <div className="text-sm text-gray-500">App Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--portfolio-accent)]" data-testid="stat-leetcode">500+</div>
            <div className="text-sm text-gray-500">LeetCode</div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" data-testid="scroll-indicator">
        <ChevronDown className="h-6 w-6 text-gray-400" />
      </div>
    </section>
  );
};

export default Hero;
