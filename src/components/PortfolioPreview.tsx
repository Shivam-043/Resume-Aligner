"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '../client/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../client/src/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../client/src/components/ui/dialog';
import { Badge } from '../client/src/components/ui/badge';
import { Eye, Sparkles } from 'lucide-react';
import { SAMPLE_PORTFOLIO_DATA } from '../lib/portfolio-preview-data';
import { PortfolioData } from '../lib/portfolio-context';
import '../client/src/portfolio.css';

interface PortfolioPreviewProps {
  onConfirm: (sampleData: PortfolioData) => void;
  disabled?: boolean;
}

// Dynamically import the portfolio page to avoid SSR issues
const DynamicPortfolio = dynamic(() => import('../client/src/pages/portfolio'), {
  ssr: false,
});

export default function PortfolioPreview({ onConfirm, disabled = false }: PortfolioPreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm(SAMPLE_PORTFOLIO_DATA);
    setIsModalOpen(false);
  };

  // Create a preview version with sample profile image placeholder
  const previewData = {
    ...SAMPLE_PORTFOLIO_DATA,
    personalInfo: {
      ...SAMPLE_PORTFOLIO_DATA.personalInfo!,
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
    }
  };

  return (
    <>
      <Card className="w-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-semibold text-blue-800">Portfolio Preview</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Sample Template
            </Badge>
          </div>
          <CardDescription className="text-sm text-gray-600">
            See how your portfolio will look with our professional template
          </CardDescription>
        </CardHeader>
        
        <CardContent 
          className="space-y-4 cursor-pointer"
          onClick={() => !disabled && setIsModalOpen(true)}
        >
          {/* Mini Preview */}
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="space-y-3">
              {/* Mini Hero Section */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-sm font-bold">AJ</span>
                </div>
                <h3 className="font-bold text-sm">{previewData.personalInfo?.name}</h3>
                <p className="text-xs opacity-90">{previewData.personalInfo?.jobTitle}</p>
              </div>

              {/* Mini Sections */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <h4 className="font-semibold text-gray-800 mb-1">Experience</h4>
                  <div className="space-y-1">
                    {previewData.experience?.slice(0, 2).map((exp, i) => (
                      <div key={i} className="text-gray-600">
                        <div className="font-medium truncate">{exp.company}</div>
                        <div className="text-xs text-gray-500 truncate">{exp.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-2 rounded">
                  <h4 className="font-semibold text-gray-800 mb-1">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {previewData.skills?.[0]?.items.slice(0, 3).map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs px-1 py-0">
                        {skill.name}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="text-xs px-1 py-0 bg-gray-100">+</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-2 text-blue-600 border-blue-300 hover:bg-blue-50"
              disabled={disabled}
            >
              <Eye className="h-4 w-4" />
              <span>Click to Preview Full Portfolio</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Full Portfolio Preview Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span>Portfolio Preview</span>
            </DialogTitle>
            <DialogDescription>
              This is how your portfolio will look with our professional template. Your actual data will replace the sample content.
            </DialogDescription>
          </DialogHeader>

          {/* Full Portfolio Preview - Scrollable */}
          <div className="flex-1 overflow-y-auto max-h-[70vh]">
            <div className="portfolio-page">
              <DynamicPortfolio 
                portfolioData={previewData} 
                isHostedVersion={true}
              />
            </div>
          </div>

          <DialogFooter className="p-6 pt-0 flex space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close Preview
            </Button>
            <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700">
              Use This Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}