"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../client/src/components/ui/dialog';
import { Button } from '../client/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../client/src/components/ui/card';
import { Badge } from '../client/src/components/ui/badge';
import { useUserSettings } from '../lib/user-settings-context';
import { 
  ChevronLeft, 
  ChevronRight, 
  Key, 
  Upload, 
  Sparkles, 
  FileText, 
  Settings, 
  ExternalLink,
  CheckCircle,
  Play
} from 'lucide-react';

interface TourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApiSettings: () => void;
}

const tourSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Resume Aligner! 🚀',
    content: (
      <div className="space-y-4">
        <p>
          Resume Aligner uses AI to help you create perfect resumes, analyze job matches, 
          and generate cover letters. Let&apos;s get you set up in just a few minutes!
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">What you&apos;ll learn:</h4>
          <ul className="space-y-1 text-sm">
            <li>• How to set up your free Google Gemini API key</li>
            <li>• How to upload and analyze your resume</li>
            <li>• How to generate optimized portfolios</li>
            <li>• How to create tailored cover letters</li>
          </ul>
        </div>
      </div>
    ),
    icon: <Sparkles className="w-6 h-6" />
  },
  {
    id: 'api-setup',
    title: 'Get Your Free API Key',
    content: (
      <div className="space-y-4">
        <p>
          To use Resume Aligner&apos;s AI features, you&apos;ll need a <strong>free</strong> Google Gemini API key. 
          This ensures your data stays private and gives you full control.
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="w-5 h-5" />
              Why your own API key?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Complete Privacy</p>
                <p className="text-sm text-muted-foreground">Your resume data goes directly to Google, never through our servers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Free Usage</p>
                <p className="text-sm text-muted-foreground">Google provides generous free quotas for Gemini API</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">No Rate Limits</p>
                <p className="text-sm text-muted-foreground">Use the service as much as you need</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-amber-50 p-4 rounded-lg">
          <p className="text-sm">
            <strong>Note:</strong> Getting an API key takes just 2 minutes and is completely free. 
            Google provides generous usage limits for personal use.
          </p>
        </div>
      </div>
    ),
    icon: <Key className="w-6 h-6" />
  },
  {
    id: 'api-steps',
    title: 'Step-by-Step API Key Setup',
    content: (
      <div className="space-y-4">
        <p>Follow these simple steps to get your API key:</p>
        
        <div className="space-y-3">
          <div className="flex gap-3">
            <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">1</Badge>
            <div>
              <p className="font-medium">Visit Google AI Studio</p>
              <p className="text-sm text-muted-foreground">Click the button below to open Google AI Studio</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">2</Badge>
            <div>
              <p className="font-medium">Sign in with Google</p>
              <p className="text-sm text-muted-foreground">Use any Google account (Gmail, Workspace, etc.)</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">3</Badge>
            <div>
              <p className="font-medium">Create API Key</p>
              <p className="text-sm text-muted-foreground">Click &quot;Get API Key&quot; → &quot;Create API key in new project&quot;</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">4</Badge>
            <div>
              <p className="font-medium">Copy and Save</p>
              <p className="text-sm text-muted-foreground">Copy the API key and paste it into Resume Aligner</p>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" asChild className="w-full">
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open Google AI Studio
          </a>
        </Button>
      </div>
    ),
    icon: <Settings className="w-6 h-6" />
  },
  {
    id: 'features',
    title: 'What You Can Do',
    content: (
      <div className="space-y-4">
        <p>Once your API key is set up, you&apos;ll have access to powerful AI features:</p>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Smart Resume Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Upload your resume and get detailed feedback on how well it matches specific job descriptions. 
                Get suggestions for improvements and missing skills.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Portfolio Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Transform your resume into a beautiful, professional portfolio website 
                that you can share with employers and host online.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Cover Letter Writing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate personalized, compelling cover letters tailored to specific 
                job descriptions using your resume data.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
    icon: <Sparkles className="w-6 h-6" />
  },
  {
    id: 'ready',
    title: 'You&apos;re All Set! 🎉',
    content: (
      <div className="space-y-4">
        <p>
          Great! Now you know how Resume Aligner works. Click the button below to set up 
          your API key and start using all the AI-powered features.
        </p>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Play className="w-4 h-4" />
            Next Steps:
          </h4>
          <ol className="space-y-1 text-sm">
            <li>1. Set up your Gemini API key (takes 2 minutes)</li>
            <li>2. Upload your resume to get started</li>
            <li>3. Try analyzing it against a job description</li>
            <li>4. Generate your professional portfolio</li>
          </ol>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Need help? You can always access this guide again from the settings menu.
          </p>
        </div>
      </div>
    ),
    icon: <CheckCircle className="w-6 h-6" />
  }
];

export const TourGuide: React.FC<TourGuideProps> = ({ 
  isOpen, 
  onClose, 
  onOpenApiSettings 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { updateSettings } = useUserSettings();

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    updateSettings({ showTourGuide: false });
    onClose();
    onOpenApiSettings();
  };

  const handleSkip = () => {
    updateSettings({ showTourGuide: false });
    onClose();
  };

  const currentStepData = tourSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={handleSkip}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {currentStepData.icon}
            {currentStepData.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-600'
                      : index < currentStep
                      ? 'bg-blue-300'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} of {tourSteps.length}
            </span>
          </div>

          {/* Step content */}
          <div className="min-h-[300px]">
            {currentStepData.content}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center pt-4">
            <div>
              <Button variant="ghost" onClick={handleSkip}>
                Skip Tour
              </Button>
            </div>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrev}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
              )}
              
              {currentStep < tourSteps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                  Set Up API Key
                  <Key className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};