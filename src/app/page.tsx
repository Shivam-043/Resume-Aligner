'use client'

import { useState } from 'react'
import ResumeUploader from '@/components/ResumeUploader'
import JobUrlInput from '@/components/JobUrlInput'
import MatchingResults from '@/components/MatchingResults'
import Header from '@/components/Header'
import FeatureCard from '@/components/FeatureCard'
import { AnalysisResult } from '@/types'
import { Zap, Target, FileText, CheckCircle } from 'lucide-react'

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
    <div className="min-h-screen relative">
      {/* Background image */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url("/BG.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.8
        }}
        aria-hidden="true"
      ></div>
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {!analysisResult ? (
            <div className="space-y-16">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold mb-6">
                  Resume Job Matcher
                </h1>
                <p className="text-xl opacity-75 max-w-3xl mx-auto">
                  Upload your resume and provide a job posting URL to get detailed matching analysis, 
                  tailoring suggestions, and improvement recommendations powered by AI.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FeatureCard 
                  icon={<Zap className="h-6 w-6 text-white" />}
                  title="Fast Integration"
                  description="Our AI-powered analysis takes seconds to provide detailed insights on your resume's match to job requirements."
                />
                <FeatureCard 
                  icon={<Target className="h-6 w-6 text-white" />}
                  title="Precision Matching"
                  description="Get targeted recommendations based on skills gap analysis to make your resume stand out to hiring managers."
                />
                <FeatureCard 
                  icon={<FileText className="h-6 w-6 text-white" />}
                  title="ATS Optimization"
                  description="Ensure your resume passes Applicant Tracking Systems with our ATS compatibility checker."
                />
                <FeatureCard 
                  icon={<CheckCircle className="h-6 w-6 text-white" />}
                  title="Complete Solution"
                  description="Generate tailored cover letters and portfolio project ideas to complement your resume."
                />
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
                  className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
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
    </div>
  )
}
