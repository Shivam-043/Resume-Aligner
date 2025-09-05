import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription, userName, userApiKey } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing required parameters: resumeText and jobDescription' },
        { status: 400 }
      );
    }

    // Use user's API key if provided, otherwise fall back to server's key
    const apiKey = userApiKey || process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'No API key available. Please configure your Gemini API key in settings.' },
        { status: 400 }
      );
    }

    // Initialize the Gemini API client with the appropriate API key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the prompt for Gemini
    const prompt = `You are an expert cover letter writer with experience in professional career coaching.

Your task is to write a compelling, personalized cover letter based on the candidate's resume and the job description provided.

Follow these guidelines:
1. Use a professional tone that matches the industry
2. Highlight specific skills and experiences from the resume that match the job requirements
3. Include measurable achievements and results when possible
4. Demonstrate knowledge of the company/role based on the job description
5. Keep the cover letter concise (300-400 words)
6. Use a standard cover letter format with date, greeting, body paragraphs, and closing
7. Make it personal and not generic-sounding
8. Avoid clichés and overly formal language
9. Show enthusiasm for the specific role and company

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

APPLICANT NAME: ${userName || 'Extract from resume'}

Write a complete, ready-to-use cover letter. Don't include any explanations or notes in your response, just the cover letter text.`;

    // Call Gemini API to generate the cover letter
    const result = await model.generateContent(prompt);
    const coverLetter = result.response.text();

    // Return the generated cover letter
    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}