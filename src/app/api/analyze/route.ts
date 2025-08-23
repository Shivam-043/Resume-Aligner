import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { AnalysisResult } from '@/types'

// Disable caching and extend timeout
export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 seconds timeout

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    console.log('Analysis API called')
    const { resume, jobDescription, jobUrl } = await request.json()

    if (!resume || !jobDescription) {
      console.error('Missing required parameters')
      return NextResponse.json(
        { error: 'Resume and job description are required' },
        { status: 400 }
      )
    }

    console.log('Parameters received, initializing Gemini model')
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
You are an expert HR analyst and career counselor. Analyze the following resume against the job description and provide a comprehensive matching report.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

JOB URL: ${jobUrl || 'Not provided'}

Please provide a detailed analysis in the following JSON format. Be thorough and specific in your analysis:

{
  "overallMatchPercentage": <number between 0-100>,
  "skillsAnalysis": {
    "technicalSkills": [
      {
        "skill": "<skill name>",
        "present": <boolean>,
        "importance": "<high|medium|low>",
        "suggestion": "<optional improvement suggestion>"
      }
    ],
    "softSkills": [
      {
        "skill": "<skill name>",
        "present": <boolean>,
        "importance": "<high|medium|low>",
        "suggestion": "<optional improvement suggestion>"
      }
    ],
    "certifications": [
      {
        "skill": "<certification name>",
        "present": <boolean>,
        "importance": "<high|medium|low>",
        "suggestion": "<optional improvement suggestion>"
      }
    ]
  },
  "sectionAnalysis": {
    "experience": {
      "title": "Professional Experience",
      "score": <number between 0-100>,
      "matches": ["<specific matching points>"],
      "gaps": ["<specific gaps identified>"],
      "suggestions": ["<actionable suggestions>"]
    },
    "education": {
      "title": "Education",
      "score": <number between 0-100>,
      "matches": ["<specific matching points>"],
      "gaps": ["<specific gaps identified>"],
      "suggestions": ["<actionable suggestions>"]
    },
    "skills": {
      "title": "Skills",
      "score": <number between 0-100>,
      "matches": ["<specific matching points>"],
      "gaps": ["<specific gaps identified>"],
      "suggestions": ["<actionable suggestions>"]
    },
    "achievements": {
      "title": "Achievements",
      "score": <number between 0-100>,
      "matches": ["<specific matching points>"],
      "gaps": ["<specific gaps identified>"],
      "suggestions": ["<actionable suggestions>"]
    }
  },
  "keywordAnalysis": {
    "matchedKeywords": ["<list of keywords present in both resume and job description>"],
    "missingKeywords": ["<list of important keywords missing from resume>"],
    "keywordDensity": <percentage of relevant keywords present>
  },
  "tailoringRecommendations": [
    {
      "section": "<section name>",
      "priority": "<high|medium|low>",
      "current": "<current content or description>",
      "recommended": "<specific recommended changes>",
      "reason": "<why this change would improve matching>"
    }
  ],
  "improvementSuggestions": [
    {
      "category": "<category name>",
      "priority": "<high|medium|low>",
      "suggestion": "<detailed suggestion>",
      "impact": "<expected impact description>",
      "actionItems": ["<specific actionable steps>"]
    }
  ],
  "atsCompatibility": {
    "score": <number between 0-100>,
    "issues": ["<list of ATS-related issues>"],
    "recommendations": ["<list of ATS improvement recommendations>"]
  },
  "competitiveAnalysis": {
    "strengths": ["<candidate's competitive advantages>"],
    "weaknesses": ["<areas where candidate might be weaker than competition>"],
    "differentiators": ["<unique selling points>"]
  },
  "projectRecommendations": [
    {
      "title": "<project title>",
      "description": "<detailed project description>",
      "skillsUtilized": ["<list of skills that would be demonstrated/developed>"],
      "difficulty": "<beginner|intermediate|advanced>",
      "timeEstimate": "<estimated time to complete>",
      "resources": ["<useful resources, tutorials, or references>"],
      "relevance": "<explanation of how this project addresses gaps in the resume>"
    }
  ]
}

Provide detailed, actionable insights. Focus on specific improvements rather than generic advice. Consider industry standards and current market trends.

For the project recommendations section, suggest 2-4 portfolio projects that would showcase the candidate's skills and fill any gaps identified in the analysis. These projects should be directly relevant to the job description and help demonstrate the candidate's capabilities. Include specific online resources, tutorials, and references that the candidate could use to build these projects. Focus on projects that would be impressive to hiring managers in this specific field.
`

    console.log('Sending request to Gemini AI')
    try {
      // First, try with explicit JSON format instruction
      const result = await model.generateContent({
        contents: [{ 
          role: 'user', 
          parts: [{ 
            text: prompt + "\n\nIMPORTANT: Return ONLY valid JSON without any explanations, markdown formatting, or code blocks. The response should start with '{' and end with '}' and be parsable by JSON.parse()." 
          }] 
        }],
        generationConfig: {
          temperature: 0.1,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 8192,
        }
      })
      
      const response = await result.response
      const text = response.text()
      console.log('Received response from Gemini AI')
      
      // Log full response for debugging (in production, limit this)
    //   console.log('Full raw response:', text)

      // Try multiple approaches to extract JSON
      let analysisResult: AnalysisResult | null = null;
      
      // Approach 1: Direct parse (if the response is already clean JSON)
      try {
        analysisResult = JSON.parse(text.trim())
        console.log('Successfully parsed as direct JSON')
        return NextResponse.json(analysisResult)
      } catch (error) {
        console.log('Direct JSON parse failed:', (error as Error).message)
      }
      
      // Approach 2: Find JSON between curly braces (most comprehensive)
      try {
        // Match the outermost JSON object
        const jsonRegex = /([\s\S]*?)(\{[\s\S]*\})([\s\S]*)/
        const jsonMatch = text.match(jsonRegex)
        
        if (jsonMatch && jsonMatch[2]) {
          const extractedJson = jsonMatch[2].trim()
          console.log('Extracted JSON with regex:', extractedJson.substring(0, 100) + '...')
          analysisResult = JSON.parse(extractedJson)
          console.log('Successfully extracted JSON using regex')
          return NextResponse.json(analysisResult)
        }
      } catch (error) {
        console.log('Regex extraction failed:', (error as Error).message)
      }
      
      // Approach 3: Handle markdown code blocks
      try {
        const markdownRegex = /```(?:json)?\s*([\s\S]*?)\s*```/
        const markdownMatch = text.match(markdownRegex)
        
        if (markdownMatch && markdownMatch[1]) {
          const jsonFromMarkdown = markdownMatch[1].trim()
          analysisResult = JSON.parse(jsonFromMarkdown)
          console.log('Successfully extracted JSON from markdown code block')
          return NextResponse.json(analysisResult)
        }
      } catch (error) {
        console.log('Markdown extraction failed:', (error as Error).message)
      }
      
      // Approach 4: Try to find JSON with index positions
      try {
        const jsonStart = text.indexOf('{')
        const jsonEnd = text.lastIndexOf('}')
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          const jsonContent = text.substring(jsonStart, jsonEnd + 1)
          analysisResult = JSON.parse(jsonContent)
          console.log('Successfully extracted JSON using index positions')
          return NextResponse.json(analysisResult)
        }
      } catch (error) {
        console.log('Index extraction failed:', (error as Error).message)
      }

      // Last resort: Try to extract pieces of information and construct a valid response
      console.log('All standard JSON parsing approaches failed. Attempting fallback parsing...')
      
      // Create a basic template for the response
      const fallbackResponse: Partial<AnalysisResult> = {
        overallMatchPercentage: 60,
        skillsAnalysis: {
          technicalSkills: [],
          softSkills: [],
          certifications: []
        },
        sectionAnalysis: {
          experience: { title: "Professional Experience", score: 60, matches: [], gaps: [], suggestions: [] },
          education: { title: "Education", score: 60, matches: [], gaps: [], suggestions: [] },
          skills: { title: "Skills", score: 60, matches: [], gaps: [], suggestions: [] },
          achievements: { title: "Achievements", score: 60, matches: [], gaps: [], suggestions: [] }
        },
        keywordAnalysis: {
          matchedKeywords: [],
          missingKeywords: [],
          keywordDensity: 0
        },
        tailoringRecommendations: [],
        improvementSuggestions: [],
        atsCompatibility: {
          score: 60,
          issues: [],
          recommendations: []
        },
        competitiveAnalysis: {
          strengths: [],
          weaknesses: [],
          differentiators: []
        },
        projectRecommendations: []
      };
      
      // Extract whatever information we can from the text response
      fallbackResponse.overallMatchPercentage = extractNumericValue(text, /overall[\s\S]*?(\d+)%/i) || 60;
      
      // Add a message about the parsing issue
      fallbackResponse.improvementSuggestions = [{
        category: "System Message",
        priority: "high",
        suggestion: "We had difficulty processing the detailed analysis. Here's a simplified version. Please try again if you need more details.",
        impact: "This is a partial analysis only.",
        actionItems: ["Try submitting again for a more detailed analysis."]
      }];
      
      // Add at least one project recommendation
      fallbackResponse.projectRecommendations = [{
        title: "Portfolio Project",
        description: "Create a portfolio showcasing your skills and projects relevant to this job position.",
        skillsUtilized: ["Web Development", "Design", "Communication"],
        difficulty: "intermediate",
        timeEstimate: "2-3 weeks",
        resources: ["GitHub Pages", "Portfolio templates online"],
        relevance: "A strong portfolio demonstrates your capabilities directly to potential employers."
      }];
      
      console.log('Returning fallback analysis response')
      return NextResponse.json(fallbackResponse as AnalysisResult)
      
    } catch (aiError) {
      console.error('Gemini AI error:', aiError)
      return NextResponse.json(
        { 
          error: 'AI analysis failed', 
          details: aiError instanceof Error ? aiError.message : String(aiError)
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze resume. Please try again.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

// Helper function to extract numeric values from text
function extractNumericValue(text: string, regex: RegExp): number | null {
  const match = text.match(regex);
  if (match && match[1]) {
    const value = parseInt(match[1]);
    return isNaN(value) ? null : value;
  }
  return null;
}