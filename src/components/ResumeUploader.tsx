'use client'

import { useState, useCallback, useRef } from 'react'
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
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-inner">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Upload Resume</h2>
      </div>

      {!resumeText ? (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50 shadow-inner' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="flex flex-col items-center justify-center space-y-6 py-6">
            {isUploading ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 font-medium">Processing your resume...</p>
                <p className="text-xs text-gray-500">This may take a few moments</p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                  <Upload className="h-10 w-10 text-blue-500" strokeWidth={1.5} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-semibold text-blue-600">Click to upload</span>
                    <span className="text-lg text-gray-700">or drag and drop</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    PDF files up to 10MB with extractable text
                  </p>
                </div>
              </>
            )}
            
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              id="resume-upload"
            />
          </div>
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