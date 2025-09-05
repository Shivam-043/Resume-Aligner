import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '../client/src/components/ui/button';
import { transformResumeToPortfolioData } from '@/lib/portfolio-util';
import { Alert, AlertTitle, AlertDescription } from '../client/src/components/ui/alert';
import { Loader2, Upload, FileText, Download, Code, Zap, CheckCircle } from 'lucide-react';
import { HostPortfolio } from './HostPortfolio';
import PortfolioPreview from './PortfolioPreview';
import { usePortfolio } from '@/lib/portfolio-context';
import { PortfolioData } from '@/lib/portfolio-context';
import { useUserSettings } from '@/lib/user-settings-context';

interface PortfolioGeneratorProps {
  resumeText: string;
  jobDescription?: string;
}

export default function PortfolioGenerator({ resumeText, jobDescription }: PortfolioGeneratorProps) {
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
    setHasUnsavedChanges,
    jobDescription: contextJobDescription,
    setJobDescription: setContextJobDescription
  } = usePortfolio();

  // Get user settings for API key
  const { settings } = useUserSettings();
  
  const [generationComplete, setGenerationComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  
  // LaTeX Enhancement State
  const [showLatexSection, setShowLatexSection] = useState(false);
  const [latexCode, setLatexCode] = useState('');
  const [enhancedLatexCode, setEnhancedLatexCode] = useState('');
  const [isEnhancingLatex, setIsEnhancingLatex] = useState(false);
  const [latexError, setLatexError] = useState<string | null>(null);
  const [latexEnhancementComplete, setLatexEnhancementComplete] = useState(false);
  
  // Use context job description if available, otherwise fall back to prop
  const activeJobDescription = contextJobDescription || jobDescription;
  
  // Save the current resume text and job description to context for persistence
  useEffect(() => {
    if (resumeText) {
      setResumeText(resumeText);
    }
    if (jobDescription && !contextJobDescription) {
      setContextJobDescription(jobDescription);
    }
  }, [resumeText, jobDescription, contextJobDescription, setResumeText, setContextJobDescription]);
  
  // Set generation complete state based on the context data
  useEffect(() => {
    if (generationState.stage === 'completed' && portfolioData) {
      setGenerationComplete(true);
      setShowPreview(false);
    }
  }, [generationState, portfolioData]);

  // Hide preview if portfolio already exists or if generating
  useEffect(() => {
    if (portfolioData || isGenerating || generationComplete) {
      setShowPreview(false);
    } else if (!portfolioData && !isGenerating && !generationComplete) {
      setShowPreview(true);
    }
  }, [portfolioData, isGenerating, generationComplete]);

  // LaTeX Enhancement Function
  const handleEnhanceLatex = async () => {
    console.log('=== LaTeX Enhancement Debug ===');
    console.log('latexCode length:', latexCode.length);
    console.log('jobDescription:', activeJobDescription ? `Present (${activeJobDescription.length} chars)` : 'Missing');
    console.log('jobDescription value:', activeJobDescription);
    
    if (!latexCode.trim()) {
      setLatexError('Please enter your LaTeX code first.');
      return;
    }

    // More lenient check for job description
    if (!activeJobDescription || activeJobDescription.trim().length < 10) {
      setLatexError(`Job description is ${!activeJobDescription ? 'missing' : 'too short'}. Please start a new analysis with both your resume and a job description to use this feature.`);
      console.log('Job description validation failed:', activeJobDescription);
      return;
    }

    setIsEnhancingLatex(true);
    setLatexError(null);
    setEnhancedLatexCode('');
    setLatexEnhancementComplete(false);

    try {
      console.log('Sending request to /api/enhance-latex');
      const response = await fetch('/api/enhance-latex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latexCode: latexCode.trim(),
          jobDescription: activeJobDescription.trim(),
          resumeText: resumeText || '',
          geminiApiKey: settings.geminiApiKey
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(errorData.error || 'Failed to enhance LaTeX code');
      }

      const data = await response.json();
      console.log('Enhancement successful:', data);
      setEnhancedLatexCode(data.enhancedLatex);
      setLatexEnhancementComplete(true);
      
    } catch (err) {
      console.error('LaTeX enhancement error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to enhance LaTeX code';
      setLatexError(errorMessage);
    } finally {
      setIsEnhancingLatex(false);
    }
  };

  // Download Enhanced LaTeX
  const handleDownloadLatex = () => {
    if (!enhancedLatexCode) return;

    const blob = new Blob([enhancedLatexCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enhanced-resume.tex';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy Enhanced LaTeX to Clipboard
  const handleCopyLatex = async () => {
    if (!enhancedLatexCode) return;
    
    try {
      await navigator.clipboard.writeText(enhancedLatexCode);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Handle using sample data from preview
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUseSampleData = async (sampleData: PortfolioData) => {
    if (!profileImage) {
      setError('Please upload a profile image first before using the template.');
      return;
    }

    if (!resumeText.trim()) {
      setError('Please upload and parse a resume first to personalize the template.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setShowPreview(false);
    setGenerationProgress('Personalizing template with your resume data...');
    updateGenerationState({
      stage: 'started',
      progress: 10,
      progressMessage: 'Personalizing template with your resume data...'
    });

    try {
      // Use Gemini to enhance the sample template with user's actual resume data
      setGenerationProgress('Analyzing your resume with AI...');
      updateGenerationState({
        stage: 'analyzing',
        progress: 30,
        progressMessage: 'Analyzing your resume with AI...'
      });
      
      const personalizedPortfolioData = await transformResumeToPortfolioData(resumeText);
      
      // Add the profile image to the personalized data
      if (personalizedPortfolioData.personalInfo) {
        personalizedPortfolioData.personalInfo.profileImage = profileImage;
      }
      
      setGenerationProgress('Creating your personalized portfolio...');
      updateGenerationState({
        stage: 'generating',
        progress: 70,
        progressMessage: 'Creating your personalized portfolio...'
      });
      
      // Save the personalized portfolio data in global context
      setPortfolioData(personalizedPortfolioData);
      setHasUnsavedChanges(false);
      
      setGenerationProgress('Finalizing your portfolio...');
      updateGenerationState({
        stage: 'completed',
        progress: 100,
        progressMessage: 'Portfolio personalization complete!'
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
      setError('Failed to personalize the template. Please try again.');
      console.error('Template personalization error:', err);
      
      updateGenerationState({
        stage: 'error',
        progress: 0,
        progressMessage: '',
        error: 'Failed to personalize the template. Please try again.'
      });
    }
  };

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
    setShowPreview(false);
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

  // Handle regeneration - show preview again
  const handleRegeneratePortfolio = () => {
    setPortfolioData(null);
    setGenerationComplete(false);
    setShowPreview(true);
    setError(null);
    updateGenerationState({
      stage: 'idle',
      progress: 0,
      progressMessage: '',
    });
  };

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

      {/* LaTeX Resume Enhancement Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Code className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">LaTeX Resume Enhancement</h3>
            <Zap className="h-4 w-4 text-yellow-500" />
          </div>
          <button
            onClick={() => setShowLatexSection(!showLatexSection)}
            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
          >
            {showLatexSection ? 'Hide' : 'Show'} LaTeX Tool
          </button>
        </div>

        {showLatexSection && (
          <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg">
            <div className="mb-4">
              <h4 className="text-md font-semibold text-purple-800 mb-2">🚀 Boost Your ATS Score by 80%!</h4>
              <p className="text-sm text-gray-700 mb-4">
                Paste your LaTeX resume code below and our AI will enhance it specifically for the job description, 
                optimizing keywords, formatting, and structure to maximize ATS compatibility.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>ATS Keyword Optimization</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>Section Structure Enhancement</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>Job-Specific Tailoring</span>
                </div>
              </div>
            </div>

            {latexError && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <AlertTitle className="text-red-800">Error</AlertTitle>
                <AlertDescription className="text-red-600">{latexError}</AlertDescription>
              </Alert>
            )}

            {latexEnhancementComplete && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertTitle className="text-green-800">Enhancement Complete!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your LaTeX code has been optimized for ATS compatibility. Download or copy the enhanced version below.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original LaTeX Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your LaTeX Resume Code
                </label>
                <textarea
                  value={latexCode}
                  onChange={(e) => setLatexCode(e.target.value)}
                  placeholder="Paste your LaTeX resume code here..."
                  className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  disabled={isEnhancingLatex}
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">
                    {latexCode.length} characters
                  </span>
                  <Button
                    onClick={handleEnhanceLatex}
                    disabled={isEnhancingLatex || !latexCode.trim() || !activeJobDescription}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2"
                  >
                    {isEnhancingLatex ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Enhance for ATS
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Enhanced LaTeX Output */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Enhanced LaTeX Code
                  </label>
                  {enhancedLatexCode && (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCopyLatex}
                        className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 border border-blue-200 rounded"
                        title="Copy to clipboard"
                      >
                        Copy
                      </button>
                      <button
                        onClick={handleDownloadLatex}
                        className="text-xs text-green-600 hover:text-green-800 px-2 py-1 border border-green-200 rounded flex items-center space-x-1"
                        title="Download as .tex file"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  )}
                </div>
                <textarea
                  value={enhancedLatexCode}
                  readOnly
                  placeholder="Enhanced LaTeX code will appear here..."
                  className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <div className="mt-3">
                  <span className="text-xs text-gray-500">
                    {enhancedLatexCode.length} characters
                    {enhancedLatexCode && latexCode && (
                      <span className="ml-2 text-green-600">
                        ({enhancedLatexCode.length > latexCode.length ? '+' : ''}{enhancedLatexCode.length - latexCode.length} chars)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {!activeJobDescription && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Job description is required for LaTeX enhancement. 
                  Please start a new analysis with both your resume and a job description to use this feature.
                </p>
              </div>
            )}

            {/* Debug Information - Remove this after fixing */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-800">
                <strong>Debug Info:</strong> Job Description Status: {activeJobDescription ? `✅ Available (${activeJobDescription.length} chars)` : '❌ Missing'}
              </p>
              {activeJobDescription && (
                <p className="text-xs text-blue-600 mt-1">
                  Preview: {activeJobDescription.slice(0, 100)}...
                </p>
              )}
            </div>
          </div>
        )}
      </div>

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

      {/* Portfolio Preview Section - Show after profile upload */}
      {showPreview && profileImage && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Quick Start Options</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Quick Preview Card */}
            <PortfolioPreview 
              onConfirm={handleUseSampleData}
              disabled={!profileImage || isGenerating}
            />
            
            {/* Custom Generation Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-dashed border-green-300 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Loader2 className="h-5 w-5 text-green-600" />
                <h4 className="text-lg font-semibold text-green-800">Custom AI Generation</h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Generate a personalized portfolio using your resume data with advanced AI analysis
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  AI-powered content enhancement
                </div>
                <div className="flex items-center text-sm text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Personalized based on your resume
                </div>
                <div className="flex items-center text-sm text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Professional formatting & design
                </div>
              </div>
              <Button
                onClick={() => setShowPreview(false)}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Generate Custom Portfolio
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button - Only show if preview is hidden (custom generation) */}
      {!showPreview && (
        <div className="flex justify-center">
          <Button
            onClick={portfolioData ? handleRegeneratePortfolio : handleGeneratePortfolio}
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
      )}
      
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