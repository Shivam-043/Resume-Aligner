"use client";

import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import '../client/src/portfolio.css'; // Import the portfolio-specific CSS

// Dynamically import the portfolio component to avoid SSR issues with client-specific code
const DynamicPortfolio = dynamic(() => import('../client/src/pages/portfolio'), {
  ssr: false,
});

interface DynamicPortfolioWrapperProps {
  portfolioData: any;
  isHostedVersion?: boolean;
  hostInfo?: {
    title: string;
    description: string;
    createdAt: string;
  };
}

export default function DynamicPortfolioWrapper({
  portfolioData,
  isHostedVersion,
  hostInfo
}: DynamicPortfolioWrapperProps) {
  // Apply the portfolio-page class to ensure all CSS variables are available
  useEffect(() => {
    // Add the portfolio-page class to the root document element to apply CSS variables
    document.documentElement.classList.add('portfolio-page');
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.classList.remove('portfolio-page');
    };
  }, []);

  return (
    <DynamicPortfolio 
      portfolioData={portfolioData} 
      isHostedVersion={isHostedVersion}
      hostInfo={hostInfo}
    />
  );
}