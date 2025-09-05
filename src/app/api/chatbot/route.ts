import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Disable caching and extend timeout
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds timeout

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  resumeText?: string;
  jobDescription?: string;
  geminiApiKey?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, resumeText, jobDescription, geminiApiKey }: ChatRequest = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    // Prefer server key; allow optional per-user key
    const apiKey = process.env.GEMINI_API_KEY || geminiApiKey;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'No Gemini API key available. Please configure your Gemini API key in settings or server environment.' },
        { status: 400 }
      );
    }

    // Get the latest user message
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      );
    }

    // Build system instruction with context
    const baseSystem = 'You are a professional career advisor. Provide helpful, specific, and actionable career advice. Keep responses conversational and under 200 words. Avoid generic fluff. Use bullet points when appropriate.';
    let systemInstruction = baseSystem;

    if (resumeText && resumeText.trim()) {
      const truncatedResume = resumeText.length > 1500 ? resumeText.slice(0, 1500) + '...' : resumeText;
      systemInstruction += `\n\nCandidate Resume Context:\n${truncatedResume}`;
    }
    if (jobDescription && jobDescription.trim()) {
      const truncatedJob = jobDescription.length > 1200 ? jobDescription.slice(0, 1200) + '...' : jobDescription;
      systemInstruction += `\n\nTarget Job Context:\n${truncatedJob}`;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction
    });

    // Map conversation history to Gemini chat format (excluding the last user msg)
    const historyMessages = messages.slice(0, -1).slice(-8); // last 8 msgs for context
    // Filter out system messages and ensure history starts with a 'user' role to satisfy Gemini requirements
    const rawHistory = historyMessages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    const history = rawHistory;
    // Drop any leading 'model' messages so the first content is from 'user'
    while (history.length && history[0].role !== 'user') {
      history.shift();
    }

    const chat = model.startChat({ history });

    const result = await chat.sendMessage(lastUserMessage.content);
    const response = await result.response;
    let text = (response && typeof response.text === 'function') ? response.text() : '';

    // Post-process: enforce ~200-word cap and basic cleanup
    text = trimToWordLimit(text || '', 200).trim();

    if (!text) {
      // Intelligent fallback if empty
      text = generateIntelligentFallback(lastUserMessage.content);
    }

    return NextResponse.json({
      message: text,
      model: 'gemini-1.5-flash',
      source: 'gemini'
    });
  } catch (error: unknown) {
    console.error('Chatbot error (Gemini):', error);

    const message = error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : 'Unknown error';

    if (message.includes('API key') || message.includes('PERMISSION')) {
      return NextResponse.json({ error: 'Invalid or missing Gemini API key. Please check your configuration.' }, { status: 401 });
    }
    if (message.includes('quota') || message.includes('exceeded')) {
      return NextResponse.json({ error: 'Quota exceeded. Please try again later.' }, { status: 429 });
    }

    return NextResponse.json({
      message: "I'm here to help with your career questions. Please try asking again.",
      model: 'error-fallback',
      source: 'fallback'
    });
  }
}

// Trim response to a word limit
function trimToWordLimit(text: string, wordLimit: number): string {
  const words = text.split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + '...';
}

// Generate intelligent fallback responses
function generateIntelligentFallback(userQuestion: string): string {
  const q = userQuestion.toLowerCase();
  if (q.includes('resume') || q.includes('cv')) {
    return 'Key resume tips: use strong action verbs, quantify results (e.g., 25%+, $ savings), tailor keywords to the JD, keep formatting clean, and prioritize recent impact.';
  }
  if (q.includes('interview')) {
    return 'Interview prep: research the company, prepare STAR stories (Situation, Task, Action, Result), practice aloud, and prepare 2–3 thoughtful questions for the team.';
  }
  if (q.includes('skill')) {
    return 'Skill growth: pick 1–2 high-impact skills from the job description, follow a 4–6 week plan (course + small project), and add measurable outcomes to your resume.';
  }
  return 'Focus on matching your achievements to the role requirements, quantify your impact, and show evidence of continuous learning.';
}