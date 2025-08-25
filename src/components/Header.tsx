'use client'

import { FileText, Target, TrendingUp } from 'lucide-react'

export default function Header() {
  return (
    <header className=" bg-opacity-95 shadow-lg border-b border-gray-200 w-[80%] justify-center mx-auto rounded-full my-2">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Aligner</h1>
              <p className="text-sm text-gray-600">AI-Powered Resume Optimization</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-700">
                <FileText className="h-5 w-5" />
                <span className="text-sm">Smart Analysis</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">Match Optimization</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}