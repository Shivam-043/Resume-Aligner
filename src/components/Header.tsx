'use client'

import { useState } from 'react'
import { FileText, Target, TrendingUp, Key, HelpCircle, Menu, X } from 'lucide-react'
import { Button } from '@/client/src/components/ui/button'
import { useUserSettings } from '@/lib/user-settings-context'
import { ApiSettings } from './ApiSettings'
import { TourGuide } from './TourGuide'

export default function Header() {
  const [showApiSettings, setShowApiSettings] = useState(false)
  const [showTourGuide, setShowTourGuide] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { isApiKeyConfigured } = useUserSettings()

  return (
    <>
      {/* API Settings Modal */}
      <ApiSettings
        isOpen={showApiSettings}
        onClose={() => setShowApiSettings(false)}
      />

      {/* Tour Guide Modal */}
      <TourGuide
        isOpen={showTourGuide}
        onClose={() => setShowTourGuide(false)}
        onOpenApiSettings={() => {
          setShowTourGuide(false)
          setShowApiSettings(true)
        }}
      />

      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200 w-[90%] lg:w-[80%] justify-center mx-auto rounded-full my-2">
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Resume Aligner</h1>
                <p className="text-xs lg:text-sm text-gray-600">AI-Powered Resume Optimization</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-gray-700">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Smart Analysis</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm">Match Optimization</span>
                </div>
              </div>

              {/* Settings Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTourGuide(true)}
                  className="flex items-center gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span className="hidden xl:inline">Help</span>
                </Button>
                
                <Button
                  variant={isApiKeyConfigured() ? "outline" : "default"}
                  size="sm"
                  onClick={() => setShowApiSettings(true)}
                  className="flex items-center gap-2"
                >
                  <Key className="h-4 w-4" />
                  <span className="hidden xl:inline">
                    {isApiKeyConfigured() ? 'API Settings' : 'Setup API Key'}
                  </span>
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Smart Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">Match Optimization</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowMobileMenu(false)
                      setShowTourGuide(true)
                    }}
                    className="flex items-center gap-2 flex-1"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Help & Tour
                  </Button>
                  
                  <Button
                    variant={isApiKeyConfigured() ? "outline" : "default"}
                    size="sm"
                    onClick={() => {
                      setShowMobileMenu(false)
                      setShowApiSettings(true)
                    }}
                    className="flex items-center gap-2 flex-1"
                  >
                    <Key className="h-4 w-4" />
                    {isApiKeyConfigured() ? 'API Settings' : 'Setup API'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}