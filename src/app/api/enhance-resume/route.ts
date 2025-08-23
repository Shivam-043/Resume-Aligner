import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define the expected structure for Gemini's response
interface GeminiResponse {
  personalInfo: {
    name: string;
    jobTitle: string;
    summary: string;
    profileImage?: string;
    location?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  about: {
    title: string;
    description: string[];
    resumeLink?: string;
  };
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    location: string;
    achievements: string[];
  }>;
  skills: {
    technical: Array<{
      name: string;
      level: number;
    }>;
    soft: Array<{
      name: string;
      description: string;
    }>;
    tools: string[];
  };
  leadership: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  contact: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    location?: string;
    message?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { resumeText } = await request.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Missing required parameter: resumeText' },
        { status: 400 }
      );
    }

    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prepare the prompt for Gemini
    const prompt = `You are an expert resume analyzer and professional portfolio creator.
Your task is to analyze the provided resume text and extract/enhance the information to create a compelling professional portfolio.
Follow these guidelines:

1. Extract the person's name, job title, contact information, and write a compelling professional summary
2. Create a detailed "About Me" section that highlights their unique value proposition
3. Format their work experience with clear company names, roles, durations, and locations
4. Transform bullet points into achievement-oriented statements with metrics when possible
5. Categorize their skills into technical skills (with proficiency levels 1-5), soft skills (with brief descriptions), and tools/technologies
6. Generate 4 leadership qualities based on their experience
7. Extract contact information including email, phone, location, LinkedIn, GitHub, etc.

Provide the output as a structured JSON object exactly matching this format:
{
  "personalInfo": {
    "name": "Full Name",
    "jobTitle": "Professional Title",
    "summary": "Compelling professional summary in ~2 sentences",
    "profileImage": "" // Leave empty, will be filled by the app
  },
  "about": {
    "title": "About Me",
    "description": ["Paragraph 1", "Paragraph 2"], // 1-2 paragraphs about their background and value
    "resumeLink": "#"
  },
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "duration": "Month Year - Month Year",
      "location": "City, State/Country",
      "achievements": [
        "Achievement 1 with metrics",
        "Achievement 2 with metrics",
        "Achievement 3 with metrics",
        "Achievement 4 with metrics"
      ]
    }
  ],
  "skills": {
    "technical": [
      { "name": "Skill Name", "level": 4 }
    ],
    "soft": [
      { "name": "Soft Skill", "description": "Brief description" }
    ],
    "tools": ["Tool 1", "Tool 2"]
  },
  "leadership": [
    {
      "title": "Leadership Quality",
      "description": "Description of leadership ability with evidence",
      "icon": "users" // Choose from: users, chart, trophy, target, shield, zap
    }
  ],
  "contact": {
    "email": "email@example.com",
    "phone": "+1234567890",
    "linkedin": "linkedin-username",
    "github": "github-username",
    "website": "https://personal-website.com",
    "location": "City, Country"
  }
}

Don't include any explanations or notes in your response, just the valid JSON object.

Here is the resume text to analyze and transform into a portfolio structure:

${resumeText}`;

    // Call Gemini API to analyze the resume
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    let portfolioData: GeminiResponse;

    try {
      // Extract JSON from the response
      // First try to find a JSON object in the response if it's wrapped in markdown code blocks
      let jsonText = responseText;
      const jsonRegex = /```(?:json)?([\s\S]*?)```/;
      const match = responseText.match(jsonRegex);
      
      if (match && match[1]) {
        jsonText = match[1].trim();
      }
      
      // Parse the response as JSON
      portfolioData = JSON.parse(jsonText);
    } catch (error) {
      console.error('Failed to parse Gemini response as JSON:', error);
      return NextResponse.json(
        { error: 'Failed to parse portfolio data from AI response', details: responseText },
        { status: 500 }
      );
    }

    // Return the enhanced portfolio data
    return NextResponse.json({ portfolioData });
  } catch (error) {
    console.error('Error processing resume:', error);
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
}