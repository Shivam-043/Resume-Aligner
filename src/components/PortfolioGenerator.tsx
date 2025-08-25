import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '../client/src/components/ui/button';
import { transformResumeToPortfolioData } from '@/lib/portfolio-util';
import { Alert, AlertTitle, AlertDescription } from '../client/src/components/ui/alert';
import { Loader2, Upload } from 'lucide-react';
import { HostPortfolio } from './HostPortfolio';
import { usePortfolio } from '@/lib/portfolio-context';

interface PortfolioGeneratorProps {
  resumeText: string;
}

export default function PortfolioGenerator({ resumeText }: PortfolioGeneratorProps) {
  // Use the enhanced context for shared state
  const { 
    portfolioData, 
    setPortfolioData,
    isGenerating,
    setIsGenerating,
    generationProgress,
    setGenerationProgress,
    generationState,
    updateGenerationState,
    profileImage,
    setProfileImage,
    setResumeText,
    setHasUnsavedChanges
  } = usePortfolio();
  
  const [generationComplete, setGenerationComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  
  // Save the current resume text to context for persistence
  useEffect(() => {
    if (resumeText) {
      setResumeText(resumeText);
    }
  }, [resumeText, setResumeText]);
  
  // Set generation complete state based on the context data
  useEffect(() => {
    if (generationState.stage === 'completed' && portfolioData) {
      setGenerationComplete(true);
    }
  }, [generationState, portfolioData]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setImageError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size should be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Mark that we have unsaved changes
    setHasUnsavedChanges(true);
  };

  const handleGeneratePortfolio = useCallback(async () => {
    if (!resumeText.trim()) {
      setError('No resume data available. Please upload and parse a resume first.');
      return;
    }

    if (!profileImage) {
      setError('Please upload a profile image for your portfolio first.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress('Analyzing resume data...');
    updateGenerationState({
      stage: 'started',
      progress: 10,
      progressMessage: 'Analyzing resume data...'
    });

    try {
      // Transform the resume data using Gemini's advanced analysis
      setGenerationProgress('Enhancing resume with AI-powered analysis...');
      updateGenerationState({
        stage: 'analyzing',
        progress: 30,
        progressMessage: 'Enhancing resume with AI-powered analysis...'
      });
      
      const generatedPortfolioData = await transformResumeToPortfolioData(resumeText);
      
      // Add the profile image to the personal info
      if (generatedPortfolioData.personalInfo) {
        generatedPortfolioData.personalInfo.profileImage = profileImage;
      }
      
      setGenerationProgress('Creating professional portfolio...');
      updateGenerationState({
        stage: 'generating',
        progress: 70,
        progressMessage: 'Creating professional portfolio...'
      });
      
      // Save the portfolio data in global context
      setPortfolioData(generatedPortfolioData);
      setHasUnsavedChanges(false);
      
      setGenerationProgress('Finalizing your portfolio...');
      updateGenerationState({
        stage: 'completed',
        progress: 100,
        progressMessage: 'Portfolio generation complete!'
      });
      
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
      
      updateGenerationState({
        stage: 'error',
        progress: 0,
        progressMessage: '',
        error: 'Failed to generate portfolio. Please try again.'
      });
    }
  }, [
    resumeText, 
    profileImage, 
    setIsGenerating, 
    setError, 
    setGenerationProgress, 
    updateGenerationState, 
    setPortfolioData, 
    setHasUnsavedChanges,
    setGenerationComplete
  ]);

  // Resume generation if it was in progress
  useEffect(() => {
    const resumeGeneration = async () => {
      // If we were in the middle of generating and have resume text, resume the process
      if (['started', 'analyzing', 'generating'].includes(generationState.stage) && 
          resumeText && profileImage) {
        try {
          // Only proceed with generation if we haven't completed it yet
          if (generationState.stage !== 'completed' && !portfolioData) {
            await handleGeneratePortfolio();
          }
        } catch (error) {
          console.error("Error resuming portfolio generation:", error);
        }
      }
    };
    
    if (!portfolioData) {
      resumeGeneration();
    }
  }, [
    generationState.stage, 
    resumeText, 
    profileImage, 
    portfolioData, 
    handleGeneratePortfolio
  ]); // Added all required dependencies

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
            Portfolio successfully generated! We&apos;ve opened it in a new tab.
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
            <div 
              className="bg-blue-600 h-2.5 rounded-full animate-pulse" 
              style={{width: `${generationState.progress}%`}}
            ></div>
          </div>
        </div>
      )}

      {/* Profile Image Upload Section */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Upload Profile Image</h3>
        <p className="text-gray-600 text-sm mb-4">
          Please upload a professional headshot for your portfolio. This image will be displayed prominently on your portfolio page.
        </p>
        
        <div className="flex flex-col items-center space-y-4">
          {profileImage ? (
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500">
              <Image 
                src={profileImage} 
                alt="Profile preview" 
                className="object-cover"
                fill
                sizes="128px"
                priority
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400">
              <Upload className="h-10 w-10 text-gray-400" />
            </div>
          )}
          
          <label className="cursor-pointer">
            <span className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm">
              {profileImage ? 'Change Image' : 'Select Image'}
            </span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
              disabled={isGenerating}
            />
          </label>
          
          {imageError && (
            <p className="text-red-500 text-sm">{imageError}</p>
          )}
          
          {profileImage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProfileImage(null)}
              disabled={isGenerating}
              className="text-xs"
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleGeneratePortfolio}
          disabled={isGenerating || !profileImage}
          className={`px-6 py-3 font-semibold rounded-lg ${
            isGenerating || !profileImage ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          } text-white transition-colors shadow-md hover:shadow-lg`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Portfolio...
            </>
          ) : portfolioData ? (
            'Regenerate Portfolio'
          ) : (
            'Generate AI-Enhanced Portfolio'
          )}
        </Button>
      </div>
      
      {generationComplete && portfolioData && (
        <div className="mt-8">
          <HostPortfolio portfolioData={portfolioData} />
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        Powered by Gemini 2.5 Pro AI to create high-quality, professional portfolios
      </p>
    </div>
  );
}