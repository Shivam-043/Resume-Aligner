'use client'

import { useState, useEffect, useCallback } from 'react'
import { generateCoverLetter } from '@/lib/pdf-util'
import { Download, FileText, Check, Copy, PenSquare } from 'lucide-react'
import { useCoverLetter } from '@/lib/cover-letter-context'
import { useUserSettings } from '@/lib/user-settings-context'

interface CoverLetterGeneratorProps {
  resumeText: string
  jobDescription: string
  userName?: string
}

export default function CoverLetterGenerator({ resumeText, jobDescription, userName }: CoverLetterGeneratorProps) {
  // Use the cover letter context for state persistence
  const { 
    coverLetterText, 
    setCoverLetterText,
    isGenerating,
    setIsGenerating,
    coverLetterState,
    updateCoverLetterState
  } = useCoverLetter();

  // Get user settings including API key
  const { settings, isApiKeyConfigured } = useUserSettings();

  const [isEditing, setIsEditing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [editableCoverLetter, setEditableCoverLetter] = useState<string>('')
  
  // Save the current resume and job description to context for persistence
  useEffect(() => {
    if (resumeText || jobDescription) {
      updateCoverLetterState({
        resumeText,
        jobDescription
      });
    }
  }, [resumeText, jobDescription, updateCoverLetterState]);
  
  // Initialize editable cover letter when coverLetterText changes
  useEffect(() => {
    if (coverLetterText) {
      setEditableCoverLetter(coverLetterText);
    }
  }, [coverLetterText]);

  const handleGenerateCoverLetter = useCallback(async () => {
    setIsGenerating(true)
    updateCoverLetterState({
      generationStage: 'started',
      progress: 10,
      progressMessage: 'Initializing cover letter generation...'
    });
    
    try {
      // Use a setTimeout to prevent UI freezing during generation
      setTimeout(async () => {
        updateCoverLetterState({
          generationStage: 'generating',
          progress: 50,
          progressMessage: 'Creating personalized cover letter...'
        });
        
        // Pass the user's API key to the generation function
        const generatedCoverLetter = await generateCoverLetter(
          resumeText, 
          jobDescription, 
          userName,
          settings.geminiApiKey // Pass user's API key
        )
        setCoverLetterText(generatedCoverLetter)
        setEditableCoverLetter(generatedCoverLetter)
        
        updateCoverLetterState({
          generationStage: 'completed',
          progress: 100,
          progressMessage: 'Cover letter generation complete!',
          coverLetterText: generatedCoverLetter
        });
        
        setIsGenerating(false)
      }, 100)
    } catch (error) {
      console.error('Error generating cover letter:', error)
      setIsGenerating(false)
      updateCoverLetterState({
        generationStage: 'error',
        progress: 0,
        progressMessage: 'Error generating cover letter',
        error: 'Failed to generate cover letter. Please try again.'
      });
      alert('Error generating cover letter. Please try again.')
    }
  }, [resumeText, jobDescription, userName, settings.geminiApiKey, setIsGenerating, updateCoverLetterState, setCoverLetterText]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setCoverLetterText(editableCoverLetter)
    } else {
      // Enter edit mode
      setEditableCoverLetter(coverLetterText || '')
    }
    setIsEditing(!isEditing)
  }

  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableCoverLetter(e.target.value)
  }

  const handleCopyToClipboard = () => {
    if (coverLetterText) {
      navigator.clipboard.writeText(coverLetterText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const handleDownloadAsText = () => {
    if (coverLetterText) {
      const blob = new Blob([coverLetterText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'cover-letter.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }
  
  // Resume generation if it was in progress when user navigated away
  useEffect(() => {
    const resumeGeneration = async () => {
      // If we were in the middle of generating and have the necessary inputs
      if (['started', 'generating'].includes(coverLetterState.generationStage) && 
          resumeText && jobDescription && !coverLetterText) {
        try {
          handleGenerateCoverLetter();
        } catch (error) {
          console.error("Error resuming cover letter generation:", error);
        }
      }
    };
    
    if (!coverLetterText) {
      resumeGeneration();
    }
  }, [coverLetterState.generationStage, coverLetterText, handleGenerateCoverLetter, jobDescription, resumeText]);

  if (!coverLetterText) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Cover Letter Generator</h2>
        </div>
        
        <div className="text-center py-8">
          <p className="text-gray-600 mb-6">
            Generate a personalized cover letter based on your resume and the job description.
          </p>
          
          {!isApiKeyConfigured() && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-800 text-sm">
                <strong>API Key Required:</strong> Please configure your Gemini API key in settings to use AI-powered cover letter generation.
              </p>
            </div>
          )}
          
          <button
            onClick={handleGenerateCoverLetter}
            disabled={isGenerating || !resumeText || !jobDescription}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow flex items-center justify-center mx-auto"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin mr-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {coverLetterState.progressMessage || 'Generating...'}
              </>
            ) : (
              <>Generate Cover Letter</>
            )}
          </button>
          
          {(!resumeText || !jobDescription) && (
            <p className="text-amber-600 text-sm mt-4">
              Both resume and job description are required to generate a cover letter.
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Generated Cover Letter</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEditToggle}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
            title={isEditing ? "Save changes" : "Edit cover letter"}
          >
            <PenSquare className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleCopyToClipboard}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
            title="Copy to clipboard"
          >
            {isCopied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
          </button>
          
          <button
            onClick={handleDownloadAsText}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
            title="Download as text file"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
        {isEditing ? (
          <textarea 
            value={editableCoverLetter}
            onChange={handleCoverLetterChange}
            className="w-full h-96 p-2 font-mono text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            spellCheck="true"
          />
        ) : (
          <div className="whitespace-pre-wrap font-serif text-gray-800">
            {coverLetterText}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          <p>Customize this cover letter for best results.</p>
        </div>
        <div>
          <button
            onClick={handleGenerateCoverLetter}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1 px-3 rounded transition-colors duration-200 text-sm"
          >
            Regenerate
          </button>
        </div>
      </div>
    </div>
  )
}