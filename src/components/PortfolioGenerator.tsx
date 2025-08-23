import React, { useState } from 'react';
import { Button } from '../client/src/components/ui/button';
import { transformResumeToPortfolioData } from '@/lib/portfolio-util';
import { Alert, AlertTitle, AlertDescription } from '../client/src/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface PortfolioGeneratorProps {
  resumeText: string;
  jobDescription?: string;
}

export default function PortfolioGenerator({ resumeText, jobDescription }: PortfolioGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePortfolio = async () => {
    if (!resumeText.trim()) {
      setError('No resume data available. Please upload and parse a resume first.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress('Analyzing resume data...');

    try {
      // Transform the resume data using Gemini's advanced analysis
      setGenerationProgress('Enhancing resume with AI-powered analysis...');
      const portfolioData = await transformResumeToPortfolioData(resumeText);
      
      setGenerationProgress('Creating professional portfolio...');
      
      // Store the portfolio data in localStorage so the ResumeVibe app can access it
      localStorage.setItem('resumeVibe_portfolioData', JSON.stringify(portfolioData));
      
      setGenerationProgress('Finalizing your portfolio...');
      
      // Give the system a moment to save the data
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationComplete(true);
        setGenerationProgress('');
        
        // Open portfolio in a new tab
        window.open('/resumevibe', '_blank');
      }, 1000);
    } catch (err) {
      setIsGenerating(false);
      setGenerationProgress('');
      setError('Failed to generate portfolio. Please try again.');
      console.error('Portfolio generation error:', err);
    }
  };

  return (
    <div className="w-full mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">AI-Enhanced Portfolio Generator</h2>
      <p className="text-gray-600 mb-6">
        Transform your resume into a professional web portfolio using Gemini 2.5 Pro AI to showcase your skills and experience.
      </p>

      {error && (
        <Alert className="mb-4 bg-red-50 border-red-200">
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-600">{error}</AlertDescription>
        </Alert>
      )}

      {generationComplete && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            Portfolio successfully generated! We've opened it in a new tab.
            <br />
            You can also <a href="/resumevibe" target="_blank" className="text-blue-600 hover:text-blue-800 underline">click here</a> to view your portfolio.
          </AlertDescription>
        </Alert>
      )}

      {isGenerating && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <Loader2 className="mr-3 h-5 w-5 text-blue-600 animate-spin" />
            <p className="text-blue-800 font-medium">{generationProgress}</p>
          </div>
          <div className="mt-3 bg-blue-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{width: '100%'}}></div>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handleGeneratePortfolio}
          disabled={isGenerating}
          className={`px-6 py-3 font-semibold rounded-lg ${
            isGenerating ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          } text-white transition-colors shadow-md hover:shadow-lg`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Portfolio...
            </>
          ) : (
            'Generate AI-Enhanced Portfolio'
          )}
        </Button>
      </div>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        Powered by Gemini 2.5 Pro AI to create high-quality, professional portfolios
      </p>
    </div>
  );
}