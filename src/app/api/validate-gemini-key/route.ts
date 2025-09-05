import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Initialize Gemini with the provided API key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Test the API key with a simple prompt
    const testPrompt = "Say 'API key is working' if you can read this.";
    
    try {
      const result = await model.generateContent(testPrompt);
      const response = result.response.text();
      
      // Check if we got a valid response
      if (response && response.length > 0) {
        return NextResponse.json({ 
          valid: true, 
          message: 'API key is valid and working' 
        });
      } else {
        return NextResponse.json(
          { error: 'API key validation failed - no response received' },
          { status: 400 }
        );
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (apiError: any) {
      // Handle specific API errors
      if (apiError.message?.includes('API_KEY_INVALID')) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your Gemini API key.' },
          { status: 400 }
        );
      } else if (apiError.message?.includes('QUOTA_EXCEEDED')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please check your usage limits.' },
          { status: 429 }
        );
      } else if (apiError.message?.includes('PERMISSION_DENIED')) {
        return NextResponse.json(
          { error: 'Permission denied. Please ensure your API key has proper permissions.' },
          { status: 403 }
        );
      } else {
        return NextResponse.json(
          { error: 'API key validation failed: ' + (apiError.message || 'Unknown error') },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { error: 'Internal server error during API key validation' },
      { status: 500 }
    );
  }
}