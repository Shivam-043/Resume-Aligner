"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '../client/src/components/ui/button';
import { Input } from '../client/src/components/ui/input';
import { Label } from '../client/src/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../client/src/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../client/src/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '../client/src/components/ui/alert';
import { AuthModal } from './AuthModal';
import { useAuth } from '../lib/auth-context';
import { hostPortfolio, getUserPortfolios, deleteHostedPortfolio } from '../lib/hosting-service';
import { Check, Copy, Globe, Share2, Trash2, AlertCircle } from 'lucide-react';
import { PortfolioData } from '../lib/portfolio-context';

interface HostPortfolioProps {
  portfolioData: PortfolioData;
}

interface PortfolioReference {
  id: string;
  shortUrl: string;
  title: string;
  createdAt: string;
}

export const HostPortfolio: React.FC<HostPortfolioProps> = ({ portfolioData }) => {
  const { currentUser, error: authError } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHostingModalOpen, setIsHostingModalOpen] = useState(false);
  const [isMyPortfoliosOpen, setIsMyPortfoliosOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [hostingResult, setHostingResult] = useState<{id: string; shortUrl: string; shareableUrl: string} | null>(null);
  const [userPortfolios, setUserPortfolios] = useState<PortfolioReference[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  // Check if Firebase is properly configured
  useEffect(() => {
    try {
      // Simple check to see if the firebase app is initialized
      if (authError) {
        setConfigError('Firebase configuration is missing or invalid. Please check your .env.local file for Firebase settings.');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setConfigError('Firebase configuration is missing or invalid. Please check your .env.local file for Firebase settings.');
    }
  }, [authError]);

  const handleHostClick = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      setIsHostingModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsHostingModalOpen(true);
  };

  const handleHost = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await hostPortfolio(portfolioData, title, description);
      setHostingResult(result);
      setIsHostingModalOpen(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to host portfolio';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPortfolios = async () => {
    setLoading(true);
    try {
      const portfolios = await getUserPortfolios();
      setUserPortfolios(portfolios);
      setIsMyPortfoliosOpen(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch portfolios';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePortfolio = async (portfolioId: string) => {
    setLoading(true);
    try {
      await deleteHostedPortfolio(portfolioId);
      setUserPortfolios(userPortfolios.filter(portfolio => portfolio.id !== portfolioId));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete portfolio';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Share Your Portfolio</CardTitle>
          <CardDescription>
            Host your portfolio online to share with recruiters and on social media
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {configError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Firebase Configuration Error</AlertTitle>
              <AlertDescription>
                {configError}
                <div className="mt-2 text-sm">
                  <p>To set up Firebase:</p>
                  <ol className="list-decimal list-inside ml-2 space-y-1 mt-1">
                    <li>Create a Firebase project at <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline">firebase.google.com</a></li>
                    <li>Enable Authentication and Firestore in your Firebase project</li>
                    <li>Copy your Firebase config to the .env.local file</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {hostingResult && (
            <Alert className="bg-green-50 border-green-200">
              <AlertTitle className="text-green-800">Portfolio Hosted Successfully!</AlertTitle>
              <AlertDescription className="text-green-700">
                <div className="mt-2">
                  <p className="mb-2">Your portfolio is now available online at:</p>
                  <div className="flex items-center space-x-2 p-2 bg-white rounded border">
                    <Globe size={16} />
                    <span className="text-sm font-medium flex-1 truncate">
                      {hostingResult.shareableUrl}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(hostingResult.shareableUrl)}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {error && !configError && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleHostClick} disabled={loading || !!configError}>
            <Globe className="mr-2 h-4 w-4" />
            Host Portfolio
          </Button>
          {currentUser && (
            <Button variant="outline" onClick={handleViewPortfolios} disabled={loading || !!configError}>
              My Portfolios
            </Button>
          )}
        </CardFooter>
      </Card>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        title="Create an account"
        description="Sign in to host your portfolio online and share it with recruiters"
      />

      <Dialog open={isHostingModalOpen} onOpenChange={setIsHostingModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Host Your Portfolio</DialogTitle>
            <DialogDescription>
              Provide some details about your portfolio
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Portfolio Title</Label>
              <Input
                id="title"
                placeholder="e.g. John Doe - Full Stack Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="A brief description of your portfolio"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsHostingModalOpen(false)}>Cancel</Button>
            <Button onClick={handleHost} disabled={!title || loading}>
              {loading ? 'Processing...' : 'Host Portfolio'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isMyPortfoliosOpen} onOpenChange={setIsMyPortfoliosOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>My Hosted Portfolios</DialogTitle>
            <DialogDescription>
              Manage all your hosted portfolios
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {isMyPortfoliosOpen && userPortfolios.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                You haven&apos;t hosted any portfolios yet
              </p>
            ) : (
              <div className="space-y-4">
                {userPortfolios.map((portfolio) => (
                  <div key={portfolio.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium">{portfolio.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(portfolio.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToClipboard(`${window.location.origin}/portfolio/${portfolio.shortUrl}`)}
                      >
                        <Share2 size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDeletePortfolio(portfolio.id)}
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};