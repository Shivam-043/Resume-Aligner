'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const [companyName, setCompanyName] = useState('JavaScript Mastery')
  const [jobTitle, setJobTitle] = useState('Frontend Developer')
  const [jobDescription, setJobDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      setFile(droppedFile)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file || !companyName || !jobTitle) {
      alert('Please fill in all required fields and upload a resume.')
      return
    }

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('companyName', companyName)
      formData.append('jobTitle', jobTitle)
      formData.append('jobDescription', jobDescription)
      
      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Redirect to results page or display success
        router.push('/resumevibe')
      } else {
        throw new Error(data.error || 'Error uploading resume')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to upload resume. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="upload-page">
      <div className="frame-10">
        <div className="ellipse-9"></div>
        <div className="ellipse-10"></div>
        <div className="rectangle-7"></div>
        <div className="rectangle-8"></div>
        
        <div className="frame-5">
          <div className="frame-96">
            <h1 className="heading">
              Smart feedback <br />
              for your dream job
            </h1>
          </div>
          <p className="subheading">
            Drop your resume for an ATS score and improvement tips.
          </p>
        </div>

        <div className="frame-6">
          <div className="resulyze">RESULYZE</div>
          <div className="upload-resume-btn">
            Upload Resume
          </div>
        </div>

        <form onSubmit={handleSubmit} className="frame-43319">
          <div className="input-group">
            <label htmlFor="companyName">Company Name</label>
            <div className="field">
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company Name"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="jobTitle">Job Title</label>
            <div className="field">
              <input
                type="text"
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job Title"
              />
            </div>
          </div>

          <div className="content">
            <div className="input-group">
              <label htmlFor="jobDescription">Job Description</label>
              <div className="field textarea-field">
                <textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Write a clear & concise job description with responsibilities & expectations..."
                />
              </div>
            </div>
          </div>

          <div className="upload">
            <label>Upload Resume</label>
            <div 
              className={`card ${isDragging ? 'dragging' : ''}`} 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="file-upload-base">
                <div className="content">
                  <div className="container">
                    <div className="icon-container">
                      {file ? (
                        <svg width="48" height="48" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 2.40419V8.6C17 9.44008 17 9.86012 17.1635 10.181C17.3073 10.4632 17.5368 10.6927 17.819 10.8365C18.1399 11 18.5599 11 19.4 11H25.5958M26 13.9823V24.8C26 27.3202 26 28.5804 25.5095 29.543C25.0781 30.3897 24.3897 31.0781 23.543 31.5095C22.5804 32 21.3202 32 18.8 32H9.2C6.67976 32 5.41965 32 4.45704 31.5095C3.61031 31.0781 2.9219 30.3897 2.49047 29.543C2 28.5804 2 27.3202 2 24.8V9.2C2 6.67976 2 5.41965 2.49047 4.45704C2.9219 3.61031 3.61031 2.9219 4.45704 2.49047C5.41965 2 6.67976 2 9.2 2H14.0177C15.1183 2 15.6686 2 16.1865 2.12434C16.6457 2.23457 17.0847 2.41639 17.4873 2.66312C17.9414 2.94141 18.3305 3.33055 19.1088 4.10883L23.8912 8.89117C24.6695 9.66945 25.0586 10.0586 25.3369 10.5127C25.5836 10.9153 25.7654 11.3543 25.8757 11.8135C26 12.3314 26 12.8817 26 13.9823Z" stroke="#475467" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="48" height="48" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 2.40419V8.6C17 9.44008 17 9.86012 17.1635 10.181C17.3073 10.4632 17.5368 10.6927 17.819 10.8365C18.1399 11 18.5599 11 19.4 11H25.5958M26 13.9823V24.8C26 27.3202 26 28.5804 25.5095 29.543C25.0781 30.3897 24.3897 31.0781 23.543 31.5095C22.5804 32 21.3202 32 18.8 32H9.2C6.67976 32 5.41965 32 4.45704 31.5095C3.61031 31.0781 2.9219 30.3897 2.49047 29.543C2 28.5804 2 27.3202 2 24.8V9.2C2 6.67976 2 5.41965 2.49047 4.45704C2.9219 3.61031 3.61031 2.9219 4.45704 2.49047C5.41965 2 6.67976 2 9.2 2H14.0177C15.1183 2 15.6686 2 16.1865 2.12434C16.6457 2.23457 17.0847 2.41639 17.4873 2.66312C17.9414 2.94141 18.3305 3.33055 19.1088 4.10883L23.8912 8.89117C24.6695 9.66945 25.0586 10.0586 25.3369 10.5127C25.5836 10.9153 25.7654 11.3543 25.8757 11.8135C26 12.3314 26 12.8817 26 13.9823Z" stroke="#475467" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="text-and-supporting-text">
                    <div className="action" onClick={triggerFileInput}>
                      <span className="text">Click to upload</span>
                      <span className="text">or drag and drop</span>
                    </div>
                    <p className="supporting-text">
                      PDF, PNG or JPG (max. 10MB)
                    </p>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Save & Analyze Resume'}
          </button>
        </form>

        <div className="decorative-elements">
          <div className="group-5"></div>
          <div className="group-6"></div>
          <div className="file-icon"></div>
          <div className="cursor">
            <div className="frame-20">
              <span>You</span>
            </div>
            <div className="polygon"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .upload-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: #FFFFFF;
          border-radius: 30px;
        }

        .frame-10 {
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, #EAF2FF 0%, #FFF3F6 100%);
          border-radius: 40px;
          position: relative;
          padding: 40px 20px;
        }

        .ellipse-9 {
          position: absolute;
          width: 769px;
          height: 953px;
          right: -300px;
          top: -217px;
          background: #7C87FB;
          opacity: 0.35;
          filter: blur(250px);
        }

        .ellipse-10 {
          position: absolute;
          width: 714px;
          height: 877px;
          left: -441px;
          top: 343px;
          background: #FA7185;
          opacity: 0.35;
          filter: blur(250px);
        }

        .rectangle-7 {
          position: absolute;
          width: 234.11px;
          height: 527.66px;
          right: 150px;
          top: 297px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%);
          transform: rotate(30deg);
        }

        .rectangle-8 {
          position: absolute;
          width: 234.11px;
          height: 578.87px;
          left: 60px;
          top: -10px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%);
          transform: rotate(30deg);
        }

        .frame-5 {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0px;
          gap: 28px;
          isolation: isolate;
          position: relative;
          width: 100%;
          max-width: 927px;
          margin: 100px auto 50px;
        }

        .frame-96 {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0;
          gap: 10px;
          width: 100%;
        }

        .heading {
          width: 100%;
          font-family: 'Mona Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-style: normal;
          font-weight: 600;
          font-size: clamp(40px, 6vw, 96px);
          line-height: 100%;
          text-align: center;
          letter-spacing: -0.02em;
          background: linear-gradient(87.58deg, #AB8C95 7.97%, #000000 47.09%, #8E97C5 88.53%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .subheading {
          width: 100%;
          font-family: 'Mona Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: clamp(18px, 3vw, 32px);
          line-height: 140%;
          text-align: center;
          color: #475467;
          margin: 0;
        }

        .frame-6 {
          position: absolute;
          width: 90%;
          max-width: 1113px;
          height: 82px;
          left: 50%;
          transform: translateX(-50%);
          top: 44px;
          background: #FFFFFF;
          border-radius: 999px;
          display: flex;
          align-items: center;
          padding: 0 20px;
          justify-content: space-between;
        }

        .resulyze {
          font-family: 'Bakbak One', 'Mona Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 24px;
          line-height: 100%;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          background: linear-gradient(87.58deg, #AB8C95 7.97%, #000000 47.09%, #8E97C5 88.53%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .upload-resume-btn {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 14px 24px;
          gap: 12px;
          background: radial-gradient(50% 48.84% at 50% 51.16%, #9098F7 0%, #6E7AFF 100%);
          box-shadow: inset 0px 0px 8px 2px rgba(54, 103, 155, 0.4);
          border-radius: 999px;
          font-family: 'Mona Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-style: normal;
          font-weight: 500;
          font-size: 20px;
          line-height: 110%;
          letter-spacing: -0.01em;
          color: #FFFFFF;
          cursor: pointer;
        }

        .frame-43319 {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0;
          gap: 50px;
          width: 100%;
          max-width: 1143px;
          margin: 0 auto;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0;
          gap: 8px;
          width: 100%;
        }

        .input-group label {
          width: 100%;
          font-family: 'Mona Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 24px;
          line-height: 40px;
          color: #475467;
        }

        .field {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 20px 30px;
          width: 100%;
          background: #FFFFFF;
          box-shadow: inset 0px 0px 12px rgba(36, 99, 235, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 18px;
        }

        .field input {
          width: 100%;
          height: 40px;
          font-family: 'Mona Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-style: normal;
          font-weight: 500;
          font-size: 30px;
          line-height: 40px;
          color: #1D2939;
          border: none;
          outline: none;
          background: transparent;
        }

        .textarea-field {
          padding: 26px 24px;
          height: 190px;
          align-items: flex-start;
        }

        .field textarea {
          width: 100%;
          height: 100%;
          font-family: 'Mona Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 30px;
          line-height: 40px;
          color: #1D2939;
          border: none;
          outline: none;
          background: transparent;
          resize: none;
        }

        .field textarea::placeholder {
          color: #98A2B3;
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0;
          gap: 50px;
          width: 100%;
        }

        .upload {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0;
          gap: 14px;
          width: 100%;
        }

        .upload label {
          width: 100%;
          font-family: 'Mona Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 24px;
          line-height: 40px;
          color: #475467;
        }

        .card {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 18px 20px 20px;
          width: 100%;
          background: linear-gradient(180deg, rgba(193, 211, 248, 0.1) 0%, rgba(167, 191, 241, 0.3) 100%);
          box-shadow: inset 0px 0px 12px rgba(36, 99, 235, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 40px;
          transition: all 0.2s ease-in-out;
        }

        .card.dragging {
          background: linear-gradient(180deg, rgba(193, 211, 248, 0.3) 0%, rgba(167, 191, 241, 0.5) 100%);
          box-shadow: inset 0px 0px 16px rgba(36, 99, 235, 0.4);
        }

        .file-upload-base {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          width: 100%;
          background: #FFFFFF;
          border-radius: 30px;
          min-height: 300px;
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0;
          gap: 28px;
          width: 100%;
        }

        .container {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          padding: 2px 0 0;
          gap: 8px;
        }

        .icon-container {
          width: 80px;
          height: 80px;
          background: linear-gradient(180deg, #A1A1A9 0%, #3F3F45 100%);
          box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.1), inset 0px -2px 4px rgba(255, 255, 255, 0.5);
          border-radius: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .text-and-supporting-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0;
          gap: 14px;
          width: 100%;
        }

        .action {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 0;
          gap: 9px;
          cursor: pointer;
        }

        .text {
          font-family: 'Mona Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 28px;
          line-height: 36px;
          color: #475467;
        }

        .text:first-child {
          font-weight: 600;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .supporting-text {
          width: 100%;
          font-family: 'Mona Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 24px;
          line-height: 30px;
          text-align: center;
          color: #475467;
          margin: 0;
        }

        .submit-button {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 14px 24px;
          gap: 12px;
          width: 100%;
          height: 80px;
          background: radial-gradient(50% 48.84% at 50% 51.16%, #9098F7 0%, #6E7AFF 100%);
          box-shadow: inset 0px 0px 8px 2px rgba(54, 103, 155, 0.4);
          border-radius: 999px;
          border: none;
          font-family: 'Mona Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-style: normal;
          font-weight: 600;
          font-size: 24px;
          line-height: 110%;
          letter-spacing: -0.01em;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .submit-button:hover {
          background: radial-gradient(50% 48.84% at 50% 51.16%, #7A85F0 0%, #5963E8 100%);
        }

        .submit-button:disabled {
          background: #98A2B3;
          cursor: not-allowed;
        }

        .decorative-elements {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .group-5, .group-6 {
          position: absolute;
        }

        .file-icon {
          position: absolute;
          width: 60px;
          height: 60px;
          right: 418px;
          bottom: 100px;
          background: #FFFFFF;
          box-shadow: 0px 24px 48px -12px rgba(16, 24, 40, 0.18);
          border-radius: 6px;
          display: none;
        }

        .cursor {
          position: absolute;
          width: 146px;
          height: 86px;
          right: 150px;
          bottom: 120px;
          display: none;
        }

        .frame-20 {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 8px 20px;
          position: absolute;
          width: 97px;
          height: 50px;
          background: #2368FE;
          backdrop-filter: blur(6px);
          border-radius: 999px;
        }

        .frame-20 span {
          font-family: 'Mona Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-style: normal;
          font-weight: 500;
          font-size: 28px;
          line-height: 100%;
          color: #FFFFFF;
        }

        .polygon {
          position: absolute;
          width: 38.64px;
          height: 42.94px;
          left: 0;
          top: 0;
          background: #5991FF;
          border-radius: 3px;
          transform: rotate(-51.22deg);
        }

        /* Responsive styles */
        @media (max-width: 1200px) {
          .frame-43319 {
            max-width: 90%;
          }
        }

        @media (max-width: 768px) {
          .frame-6 {
            flex-direction: column;
            height: auto;
            gap: 15px;
            padding: 15px;
            position: relative;
            top: 15px;
          }
          
          .submit-button {
            height: 60px;
            font-size: 20px;
          }
          
          .field {
            padding: 15px 20px;
          }
          
          .field input,
          .field textarea {
            font-size: 20px;
          }
          
          .input-group label,
          .upload label {
            font-size: 18px;
          }
          
          .text {
            font-size: 22px;
          }
          
          .supporting-text {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .heading {
            font-size: 36px;
          }
          
          .subheading {
            font-size: 16px;
          }
          
          .text {
            font-size: 18px;
          }
          
          .supporting-text {
            font-size: 14px;
          }
          
          .field input,
          .field textarea {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  )
}