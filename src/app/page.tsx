'use client'

import { useState } from 'react'
import ResumeUploader from '@/components/ResumeUploader'
import JobUrlInput from '@/components/JobUrlInput'
import MatchingResults from '@/components/MatchingResults'
import Header from '@/components/Header'
import { AnalysisResult } from '@/types'

export default function Home() {
  const [resumeText, setResumeText] = useState<string>('')
  const [jobDescription, setJobDescription] = useState<string>('')
  const [jobUrl, setJobUrl] = useState<string>('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
      alert('Please upload a resume and provide a job description.')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume: resumeText,
          jobDescription: jobDescription,
          jobUrl: jobUrl
        }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setResumeText('')
    setJobDescription('')
    setJobUrl('')
    setAnalysisResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {!analysisResult ? (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Resume Job Matcher
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Upload your resume and provide a job posting URL to get detailed matching analysis, 
                tailoring suggestions, and improvement recommendations powered by AI.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <ResumeUploader 
                onResumeExtracted={setResumeText}
                resumeText={resumeText}
              />
              
              <JobUrlInput 
                onJobExtracted={setJobDescription}
                jobDescription={jobDescription}
                jobUrl={jobUrl}
                onJobUrlChange={setJobUrl}
              />
            </div>

            <div className="text-center">
              <button
                onClick={handleAnalyze}
                disabled={!resumeText || !jobDescription || isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Match'}
              </button>
            </div>
          </div>
        ) : (
          <MatchingResults 
            result={analysisResult}
            onReset={handleReset}
            jobUrl={jobUrl}
            resumeText={resumeText}
            jobDescription={jobDescription}
          />
        )}
      </main>
    </div>
  )
}
