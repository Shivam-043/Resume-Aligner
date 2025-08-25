import React from 'react';
import Link from 'next/link';

interface PortfolioErrorFallbackProps {
  error?: string;
  shortUrl?: string;
}

export default function PortfolioErrorFallback({ error, shortUrl }: PortfolioErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Portfolio Unavailable
        </h2>
        
        <p className="text-center text-gray-600 mb-6">
          We&apos;re sorry, but the portfolio you&apos;re looking for is currently unavailable.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <p className="text-gray-600">This could be due to one of the following reasons:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>The portfolio may have been removed by its owner</li>
            <li>The link may have expired or been mistyped</li>
            <li>Our systems might be experiencing temporary technical difficulties</li>
          </ul>
        </div>

        {shortUrl && (
          <p className="text-sm text-gray-500 mb-6">
            Portfolio ID: {shortUrl}
          </p>
        )}

        <div className="flex justify-center space-x-4">
          <Link 
            href="/"
            className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}