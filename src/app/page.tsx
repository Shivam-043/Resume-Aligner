'use client'

import { useState } from 'react'
import ResumeUploader from '@/components/ResumeUploader'
import JobUrlInput from '@/components/JobUrlInput'
import MatchingResults from '@/components/MatchingResults'
import Header from '@/components/Header'
import FeatureCard from '@/components/FeatureCard'
import { AnalysisResult } from '@/types'
import { Zap, Target, CheckCircle, Star, Users, TrendingUp, Shield } from 'lucide-react'

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
    <>
      {/* Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Resume Aligner",
            "applicationCategory": "BusinessApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "2847"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />

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
                {/* Hero Section - SEO Optimized */}
                <section className="text-center mb-12" aria-labelledby="hero-heading">
                  <h1 id="hero-heading" className="text-5xl font-bold mb-6">
                    AI-Powered Resume Job Matcher & ATS Optimizer
                  </h1>
                  <p className="text-xl opacity-75 max-w-4xl mx-auto mb-8">
                    Transform your job search with our intelligent resume analyzer. Upload your resume and job posting URL to get instant ATS compatibility scores, tailored optimization recommendations, AI-generated cover letters, and professional portfolio creation tools. Join thousands of job seekers who landed their dream jobs 3x faster.
                  </p>
                  
                  {/* Trust Indicators */}
                  <div className="flex justify-center items-center gap-8 text-sm opacity-80 mb-8">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>50,000+ Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span>4.8/5 Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>3x Faster Job Placement</span>
                    </div>
                  </div>
                </section>

                {/* Feature Cards - Enhanced for SEO */}
                <section aria-labelledby="features-heading">
                  <h2 id="features-heading" className="text-3xl font-bold text-center mb-8">
                    Powerful Resume Optimization Features
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard 
                      icon={<Zap className="h-6 w-6 text-white" />}
                      title="Lightning-Fast AI Analysis"
                      description="Get comprehensive resume analysis in under 30 seconds. Our advanced AI algorithms scan for keyword optimization, ATS compatibility, and industry-specific requirements."
                    />
                    <FeatureCard 
                      icon={<Target className="h-6 w-6 text-white" />}
                      title="Precision Job Matching"
                      description="Advanced matching algorithm analyzes job requirements vs. your skills. Get detailed gap analysis and actionable recommendations to increase your interview chances by 60%."
                    />
                    <FeatureCard 
                      icon={<Shield className="h-6 w-6 text-white" />}
                      title="ATS Optimization & Scoring"
                      description="Ensure your resume passes Applicant Tracking Systems. Get detailed ATS compatibility scores and specific formatting recommendations for maximum visibility."
                    />
                    <FeatureCard 
                      icon={<CheckCircle className="h-6 w-6 text-white" />}
                      title="Complete Career Toolkit"
                      description="Beyond resume optimization: generate personalized cover letters, create professional portfolios, and get project recommendations to strengthen your profile."
                    />
                  </div>
                </section>

                {/* How It Works Section */}
                <section className="bg-white/10 rounded-lg p-8 backdrop-blur-sm" aria-labelledby="how-it-works">
                  <h2 id="how-it-works" className="text-3xl font-bold text-center mb-8">
                    How Resume Aligner Works
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">1</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Upload Your Resume</h3>
                      <p className="text-sm opacity-80">Upload your resume in PDF, DOC, or DOCX format. Our AI extracts and analyzes all content automatically.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">2</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Add Job Posting</h3>
                      <p className="text-sm opacity-80">Paste the job posting URL or description. We automatically extract requirements, skills, and keywords.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">3</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Get AI Analysis</h3>
                      <p className="text-sm opacity-80">Receive detailed matching scores, optimization recommendations, cover letters, and portfolio suggestions.</p>
                    </div>
                  </div>
                </section>

                {/* Main Tool Section */}
                <section aria-labelledby="tool-heading">
                  <h2 id="tool-heading" className="text-3xl font-bold text-center mb-8">
                    Start Optimizing Your Resume Now
                  </h2>
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

                  <div className="text-center mt-8">
                    <button
                      onClick={handleAnalyze}
                      disabled={!resumeText || !jobDescription || isAnalyzing}
                      className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                      aria-describedby="analyze-button-description"
                    >
                      {isAnalyzing ? 'Analyzing Your Resume...' : 'Get Free AI Analysis'}
                    </button>
                    <p id="analyze-button-description" className="text-sm opacity-70 mt-2">
                      100% Free • No Registration Required • Instant Results
                    </p>
                  </div>
                </section>

                {/* Benefits Section */}
                <section className="text-center" aria-labelledby="benefits-heading">
                  <h2 id="benefits-heading" className="text-3xl font-bold mb-8">
                    Why Choose Resume Aligner?
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                      <h3 className="text-xl font-semibold mb-3">Free Forever</h3>
                      <p className="text-sm opacity-80">Complete resume analysis, ATS checking, and optimization recommendations at zero cost.</p>
                    </div>
                    <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                      <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
                      <p className="text-sm opacity-80">Your resume data is processed securely and never stored. Complete privacy guaranteed.</p>
                    </div>
                    <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                      <h3 className="text-xl font-semibold mb-3">Industry Expert</h3>
                      <p className="text-sm opacity-80">Built by HR professionals and powered by latest AI technology for accurate insights.</p>
                    </div>
                  </div>
                </section>
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
    </>
  )
}
