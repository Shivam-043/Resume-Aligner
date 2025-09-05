"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../client/src/components/ui/dialog';
import { Button } from '../client/src/components/ui/button';
import { Input } from '../client/src/components/ui/input';
import { Label } from '../client/src/components/ui/label';
import { Alert, AlertDescription } from '../client/src/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../client/src/components/ui/card';
import { useUserSettings } from '../lib/user-settings-context';
import { Eye, EyeOff, Key, ExternalLink, CheckCircle, AlertCircle, Bot } from 'lucide-react';

interface ApiSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  showSkipOption?: boolean;
  onSkip?: () => void;
}

export const ApiSettings: React.FC<ApiSettingsProps> = ({ 
  isOpen, 
  onClose, 
  showSkipOption = false,
  onSkip 
}) => {
  const { settings, updateSettings } = useUserSettings();
  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey || '');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [isValidatingGemini, setIsValidatingGemini] = useState(false);
  const [geminiValidationResult, setGeminiValidationResult] = useState<'valid' | 'invalid' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateGeminiKey = async (key: string) => {
    if (!key.trim()) {
      setGeminiValidationResult(null);
      return;
    }

    setIsValidatingGemini(true);
    setError(null);

    try {
      const response = await fetch('/api/validate-gemini-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key.trim() })
      });

      if (response.ok) {
        setGeminiValidationResult('valid');
      } else {
        const data = await response.json();
        setGeminiValidationResult('invalid');
        setError(data.error || 'Invalid Gemini API key');
      }
    } catch (error) {
      setGeminiValidationResult('invalid');
      setError('Failed to validate Gemini API key');
      console.error('Validation error:', error);
    } finally {
      setIsValidatingGemini(false);
    }
  };

  const handleGeminiKeyChange = (value: string) => {
    setGeminiApiKey(value);
    setGeminiValidationResult(null);
    setError(null);
  };

  const handleSave = () => {
    if (!geminiApiKey.trim()) {
      setError('Please enter your Gemini API key to use AI features');
      return;
    }

    updateSettings({ 
      geminiApiKey: geminiApiKey.trim(),
      hasCompletedOnboarding: true
    });
    onClose();
  };

  const handleSkip = () => {
    updateSettings({ hasCompletedOnboarding: true });
    if (onSkip) onSkip();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Configuration
          </DialogTitle>
          <DialogDescription>
            Configure your Gemini API key to enable all AI-powered features including resume analysis, cover letter generation, portfolio creation, and the chatbot.
          </DialogDescription>
        </DialogHeader>

        {/* Gemini Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Google Gemini API Key
            </CardTitle>
            <CardDescription>
              Required for all AI features in this app (Gemini 1.5 Flash).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">How to get your Gemini API Key:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Visit Google AI Studio</li>
                <li>Sign in with your Google account</li>
                <li>Click &quot;Get API Key&quot; button</li>
                <li>Create a new API key for your project</li>
                <li>Copy the API key and paste it below</li>
              </ol>
            </div>
            <Button variant="outline" size="sm" asChild>
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

            {/* Gemini API Key Input */}
            <div className="space-y-2">
              <Label htmlFor="geminiApiKey">Gemini API Key</Label>
              <div className="relative">
                <Input
                  id="geminiApiKey"
                  type={showGeminiKey ? 'text' : 'password'}
                  value={geminiApiKey}
                  onChange={(e) => handleGeminiKeyChange(e.target.value)}
                  placeholder="Enter your Gemini API key (e.g., AIza...)"
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {geminiValidationResult && (
                    <>
                      {geminiValidationResult === 'valid' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowGeminiKey(!showGeminiKey)}
                    className="h-8 w-8 p-0"
                  >
                    {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              {geminiApiKey && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => validateGeminiKey(geminiApiKey)}
                  disabled={isValidatingGemini}
                >
                  {isValidatingGemini ? 'Validating...' : 'Validate API Key'}
                </Button>
              )}
            </div>

            {geminiValidationResult === 'valid' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>Gemini API key is valid and ready to use!</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Error Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Privacy Notice */}
        <Alert>
          <AlertDescription>
            <strong>Privacy:</strong> Your API key is stored locally in your browser and not shared with our servers. Requests are made to Google using your key.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div>
            {showSkipOption && (
              <Button variant="outline" onClick={handleSkip}>
                Skip for now
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!geminiApiKey.trim() || (geminiValidationResult === 'invalid')}
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};