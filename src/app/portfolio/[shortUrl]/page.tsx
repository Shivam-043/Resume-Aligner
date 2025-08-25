import React from 'react';
import { getHostedPortfolioServer } from '../../../lib/server-hosting-service';
import { notFound } from 'next/navigation';
import DynamicPortfolioWrapper from '../../../components/DynamicPortfolioWrapper';
import PortfolioErrorFallback from '../../../components/PortfolioErrorFallback';

interface PortfolioPageProps {
  params: {
    shortUrl: string;
  };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { shortUrl } = params;
  
  try {
    // Fetch the hosted portfolio data using the server-side function
    const portfolioData = await getHostedPortfolioServer(shortUrl);

    // If no portfolio is found with this short URL, show 404
    if (!portfolioData) {
      console.log(`Portfolio not found for shortUrl: ${shortUrl}`);
      notFound();
    }

    return (
      <main className="min-h-screen">
        <DynamicPortfolioWrapper 
          portfolioData={portfolioData.portfolioData} 
          isHostedVersion={true}
          hostInfo={{
            title: portfolioData.title,
            description: portfolioData.description,
            createdAt: portfolioData.createdAt
          }}
        />
      </main>
    );
  } catch (error) {
    console.error(`Error loading portfolio with shortUrl ${shortUrl}:`, error);
    
    // Show our nice error fallback component
    return <PortfolioErrorFallback shortUrl={shortUrl} error="The portfolio data could not be loaded at this time." />;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PortfolioPageProps) {
  // Await params before destructuring
  const resolvedParams = await Promise.resolve(params);
  const { shortUrl } = resolvedParams;
  
  try {
    const portfolioData = await getHostedPortfolioServer(shortUrl);
    
    if (!portfolioData) {
      return {
        title: 'Portfolio Not Found',
      };
    }
    
    return {
      title: portfolioData.title || 'Professional Portfolio',
      description: portfolioData.description || 'View my professional portfolio',
      openGraph: {
        title: portfolioData.title || 'Professional Portfolio',
        description: portfolioData.description || 'View my professional portfolio',
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'Portfolio Unavailable',
      description: 'This portfolio is currently unavailable.',
    };
  }
}