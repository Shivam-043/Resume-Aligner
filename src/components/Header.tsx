'use client'

import { FileText, Target, TrendingUp } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="bg-[var(--card-bg)] shadow-lg border-b border-[var(--card-border)] transition-colors">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-[var(--primary)] p-2 rounded-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Resume Aligner</h1>
              <p className="text-sm opacity-75">AI-Powered Resume Optimization</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span className="text-sm">Smart Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">Match Optimization</span>
              </div>
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}