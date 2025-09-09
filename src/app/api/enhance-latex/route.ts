import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Disable caching and extend timeout
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds timeout

interface LatexEnhancementRequest {
  latexCode: string;
  jobDescription: string;
  resumeText?: string;
  geminiApiKey?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { latexCode, jobDescription, resumeText, geminiApiKey }: LatexEnhancementRequest = await request.json();

    if (!latexCode || !latexCode.trim()) {
      return NextResponse.json(
        { error: 'LaTeX code is required' },
        { status: 400 }
      );
    }

    if (!jobDescription || !jobDescription.trim()) {
      return NextResponse.json(
        { error: 'Job description is required' },
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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `You are an elite ATS optimization expert specializing in STRATEGIC resume enhancement without length expansion. Your mission is to maximize resume-job match percentage while maintaining or reducing the original resume length.

CORE PRINCIPLE: OPTIMIZE BY REPLACEMENT, NOT ADDITION

STRATEGIC APPROACH:
1. SMART KEYWORD INTEGRATION: Replace generic terms with job-specific keywords
2. CONTENT REFINEMENT: Enhance existing bullet points with job-relevant terminology
3. STRATEGIC SUBSTITUTION: Replace less relevant skills with job-required ones
4. EFFICIENT OPTIMIZATION: Maximize keyword density within existing content structure
5. LENGTH PRESERVATION: Maintain original resume length or make it shorter

TRANSFORMATION PHILOSOPHY:
- REPLACE rather than ADD content
- REFINE existing descriptions with job-aligned keywords
- SUBSTITUTE generic terms with specific job requirements
- COMPRESS verbose content while adding relevant keywords
- PRIORITIZE high-impact keyword placement

ATS OPTIMIZATION WITHIN LENGTH CONSTRAINTS:
- Target 85-95% keyword match through strategic replacement
- Use exact job terminology to replace generic descriptions
- Optimize existing bullet points with job-relevant metrics
- Replace outdated or irrelevant skills with job requirements
- Maintain professional tone while maximizing keyword density

OUTPUT: Enhanced LaTeX code with equivalent or reduced length but maximum job relevance.`
    });

    // Build the enhancement prompt
    const enhancementPrompt = `MISSION: Enhance this LaTeX resume for maximum ATS compatibility while MAINTAINING OR REDUCING the original length. Focus on strategic optimization through replacement and refinement.

**ORIGINAL LATEX CODE:**
\`\`\`latex
${latexCode}
\`\`\`

**TARGET JOB DESCRIPTION:**
${jobDescription}

${resumeText ? `**CURRENT RESUME CONTEXT:**\n${resumeText}\n\n` : ''}

**📏 LENGTH-CONSCIOUS OPTIMIZATION STRATEGY:**

**PHASE 1: STRATEGIC ANALYSIS**
1. Identify the most important keywords from job description
2. Locate less relevant content in current resume that can be replaced
3. Find opportunities to substitute generic terms with specific job requirements
4. Prioritize high-impact keyword placements

**PHASE 2: SMART REPLACEMENT TACTICS**
- **SKILLS SECTION**: Replace outdated/irrelevant skills with job-required ones (same number of skills)
- **EXPERIENCE**: Enhance existing bullet points by replacing generic terms with job-specific keywords
- **ACHIEVEMENTS**: Refine descriptions to include job-relevant terminology without adding length
- **PROJECTS**: Optimize project descriptions with job-aligned keywords while maintaining brevity

**PHASE 3: EFFICIENT KEYWORD INTEGRATION**
- Replace generic action verbs with job-specific terms
- Substitute vague descriptions with precise job-relevant language  
- Enhance existing metrics to align with job success criteria
- Use job posting's exact phrases to replace similar but less optimal wording

**PHASE 4: COMPRESSION & ENHANCEMENT**
- Combine similar points to make room for job-critical keywords
- Remove redundant words while adding relevant terms
- Streamline verbose descriptions while incorporating job requirements
- Optimize sentence structure for maximum keyword density per word

**🎯 OPTIMIZATION TARGETS:**
- Achieve 85-95% keyword match through strategic replacement
- Maintain or reduce original character count
- Include top 10-15 most critical job requirements
- Replace at least 50% of generic terms with job-specific language
- Ensure every section directly addresses job needs

**⚠️ STRICT LENGTH RULES:**
- NEVER expand bullet points - only enhance existing ones
- REPLACE rather than ADD skills and technologies
- COMBINE or COMPRESS verbose content when adding keywords
- MAINTAIN original section structure and length limits
- SUBSTITUTE generic achievements with job-aligned ones

**OUTPUT REQUIREMENTS:**
Return complete enhanced LaTeX code that maintains or reduces original length while achieving maximum job relevance. Focus on smart replacement and strategic optimization rather than content expansion.

**ENHANCEMENT PHILOSOPHY:** STRATEGIC REPLACEMENT over AGGRESSIVE EXPANSION.`;

    const result = await model.generateContent(enhancementPrompt);
    const response = await result.response;
    let enhancedLatex = response.text();

    // Clean up the response - remove markdown code blocks if present
    enhancedLatex = enhancedLatex
      .replace(/^```latex\s*/i, '')
      .replace(/^```tex\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/```\s*$/, '')
      .trim();

    if (!enhancedLatex) {
      return NextResponse.json(
        { error: 'Failed to generate enhanced LaTeX code. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      enhancedLatex,
      originalLength: latexCode.length,
      enhancedLength: enhancedLatex.length,
      improvements: [
        'ATS keyword optimization',
        'Section structure enhancement',
        'Job-specific content tailoring',
        'LaTeX formatting improvements'
      ]
    });

  } catch (error: unknown) {
    console.error('LaTeX enhancement error:', error);

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
      error: 'Failed to enhance LaTeX code. Please try again or check if your LaTeX code is valid.',
    }, { status: 500 });
  }
}