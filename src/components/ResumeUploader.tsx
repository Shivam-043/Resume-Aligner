'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, CheckCircle, X, AlertCircle } from 'lucide-react'
import { extractTextFromPdf } from '@/lib/pdf-util'

interface ResumeUploaderProps {
  onResumeExtracted: (text: string) => void
  resumeText: string
}

export default function ResumeUploader({ onResumeExtracted, resumeText }: ResumeUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [errorDetails, setErrorDetails] = useState<string>('')

  const processFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size should be less than 10MB')
      return
    }

    setIsUploading(true)
    setError('')
    setErrorDetails('')

    try {
      // Use the updated extractTextFromPdf function that calls our server API
      const { text } = await extractTextFromPdf(file)
      
      if (text) {
        onResumeExtracted(text)
        setUploadedFileName(file.name)
      } else {
        throw new Error('Could not extract text from PDF')
      }
    } catch (error) {
      console.error('PDF processing error:', error)
      
      if (error instanceof Error) {
        setError(error.message || 'Failed to process resume')
        setErrorDetails('The PDF might be password protected or contain only scanned images')
      } else {
        setError('Failed to process resume. Please try a different PDF file.')
      }
    } finally {
      setIsUploading(false)
    }
  }, [onResumeExtracted])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      processFile(files[0])
    }
  }, [processFile])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const handleClear = () => {
    onResumeExtracted('')
    setUploadedFileName('')
    setError('')
    setErrorDetails('')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Upload Resume</h2>
      </div>

      {!resumeText ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
          
          {isUploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Processing your resume...</p>
              <p className="text-xs text-gray-500">This may take a few moments</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg font-medium text-gray-700">
                Drop your resume here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF files up to 10MB with extractable text
              </p>
              <p className="text-xs text-gray-500">
                PDF must contain actual text, not just images or scans
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
              >
                Choose File
              </label>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Resume uploaded: {uploadedFileName}
              </span>
            </div>
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Extracted Text Preview:</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {resumeText.length > 500 
                ? `${resumeText.slice(0, 500)}...` 
                : resumeText}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
          
          {errorDetails && (
            <div className="pl-7">
              <p className="text-xs text-red-500">{errorDetails}</p>
            </div>
          )}
          
          <div className="pl-7">
            <p className="text-xs text-gray-600 mt-1">
              Common solutions:
            </p>
            <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
              <li>Try using a different PDF file</li>
              <li>Make sure the PDF contains actual text (not just scanned images)</li>
              <li>Check if the PDF is password-protected or encrypted</li>
              <li>Ensure the file is less than 10MB in size</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}