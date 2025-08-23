'use client'

import { useState } from 'react'
import { Link2, Search, CheckCircle, X, Briefcase } from 'lucide-react'

interface JobUrlInputProps {
  onJobExtracted: (description: string) => void
  jobDescription: string
  jobUrl: string
  onJobUrlChange: (url: string) => void
}

export default function JobUrlInput({ 
  onJobExtracted, 
  jobDescription, 
  jobUrl, 
  onJobUrlChange 
}: JobUrlInputProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [manualInput, setManualInput] = useState<string>('')
  const [inputMode, setInputMode] = useState<'url' | 'manual'>('url')

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!jobUrl.trim()) {
      setError('Please enter a job URL')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/scrape-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: jobUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch job details')
      }

      const { jobDescription: description } = await response.json()
      onJobExtracted(description)
    } catch (error) {
      console.error('Scraping error:', error)
      setError('Failed to fetch job details. Please try manual input.')
      setInputMode('manual')
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!manualInput.trim()) {
      setError('Please enter the job description')
      return
    }

    onJobExtracted(manualInput)
    setError('')
  }

  const handleClear = () => {
    onJobExtracted('')
    onJobUrlChange('')
    setManualInput('')
    setError('')
    setInputMode('url')
  }

  if (jobDescription) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Briefcase className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Job details loaded successfully
              </span>
            </div>
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {jobUrl && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-600 font-medium mb-1">Source URL:</p>
              <a 
                href={jobUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-800 hover:underline break-all"
              >
                {jobUrl}
              </a>
            </div>
          )}
          
          <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Job Description Preview:</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {jobDescription.slice(0, 500)}...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Briefcase className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Job Information</h2>
      </div>

      <div className="mb-4">
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setInputMode('url')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              inputMode === 'url'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Job URL
          </button>
          <button
            onClick={() => setInputMode('manual')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              inputMode === 'manual'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Manual Input
          </button>
        </div>

        {inputMode === 'url' ? (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Posting URL
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => onJobUrlChange(e.target.value)}
                  placeholder="https://example.com/job-posting"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Supports LinkedIn, Indeed, Glassdoor, and other job portals
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !jobUrl.trim()}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Fetching job details...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Fetch Job Details</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Paste the complete job description here including requirements, responsibilities, qualifications, etc."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Include all job requirements, skills, and qualifications for better analysis
              </p>
            </div>

            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Use This Job Description
            </button>
          </form>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}