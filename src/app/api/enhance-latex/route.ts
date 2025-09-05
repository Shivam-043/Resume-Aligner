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
      systemInstruction: `You are an elite ATS optimization expert and keyword strategist with a singular goal: MAXIMIZE resume-job match percentage to 95-100%. Your expertise lies in deep job description analysis and aggressive content transformation while preserving LaTeX structure.

MISSION: Transform the resume content to achieve MAXIMUM ATS compatibility and keyword density alignment with the target job.

CRITICAL OPTIMIZATION STRATEGY:
1. DEEP JOB ANALYSIS: Extract ALL keywords, skills, technologies, certifications, and requirements
2. AGGRESSIVE KEYWORD INTEGRATION: Replace existing content with job-aligned terminology
3. SKILLS AMPLIFICATION: Add ALL missing job-required skills and technologies
4. EXPERIENCE REWRITING: Transform job descriptions to mirror job requirements
5. SECTION OPTIMIZATION: Ensure every section directly addresses job needs
6. KEYWORD DENSITY MAXIMIZATION: Achieve optimal keyword frequency without stuffing

TRANSFORMATION RULES:
- PRESERVE: LaTeX structure, formatting, packages, document class
- TRANSFORM: All content to maximize job relevance and keyword match
- PRIORITIZE: Exact keyword matches over synonyms
- QUANTIFY: Add metrics to every achievement possible
- ALIGN: Every bullet point should address job requirements
- AMPLIFY: Expand skills section with all job-mentioned technologies

ATS SCORING MINDSET:
- Target 95-100% keyword match with job description
- Every sentence should contain job-relevant terminology
- Skills section must include ALL technologies from job posting
- Experience must demonstrate ALL required competencies
- Use exact phrasing from job description where possible

OUTPUT: Complete LaTeX code with maximum content optimization for target job match.`
    });

    // Build the enhancement prompt
    const enhancementPrompt = `MISSION: Transform this LaTeX resume to achieve 95-100% ATS match with the target job description through comprehensive content optimization.

**ORIGINAL LATEX CODE:**
\`\`\`latex
${latexCode}
\`\`\`

**TARGET JOB DESCRIPTION:**
${jobDescription}

${resumeText ? `**CURRENT RESUME CONTEXT:**\n${resumeText}\n\n` : ''}

**🚀 MAXIMUM ATS OPTIMIZATION PROTOCOL:**

**PHASE 1: DEEP JOB ANALYSIS**
1. Extract EVERY keyword, skill, tool, technology, certification, and requirement from job description
2. Identify required experience levels, years, and specific competencies
3. Note exact phrases, acronyms, and industry terminology used
4. Catalog soft skills, leadership qualities, and behavioral requirements
5. List preferred qualifications, nice-to-haves, and bonus skills

**PHASE 2: AGGRESSIVE CONTENT TRANSFORMATION**
- **SKILLS SECTION**: Add ALL technologies, tools, frameworks, languages mentioned in job
- **EXPERIENCE**: Rewrite every bullet point to include job-relevant keywords and mirror job requirements
- **ACHIEVEMENTS**: Transform accomplishments to directly address job needs with quantified results
- **RESPONSIBILITIES**: Align every responsibility with job description requirements
- **PROJECTS**: Add or modify projects to showcase job-relevant technologies and outcomes

**PHASE 3: KEYWORD DENSITY MAXIMIZATION**
- Use exact keywords and phrases from job description (not synonyms)
- Ensure every major job requirement is addressed somewhere in resume
- Include industry-specific terminology and acronyms
- Add technical competencies even if not explicitly in current resume
- Mirror job posting language patterns and terminology

**PHASE 4: CONTENT ENHANCEMENT STRATEGY**
1. **Technical Skills**: Include ALL programming languages, frameworks, databases, cloud platforms, tools mentioned
2. **Experience Transformation**: Rewrite job descriptions to demonstrate ALL required competencies
3. **Quantification**: Add metrics that align with job success criteria
4. **Certification Addition**: Include relevant certifications mentioned or implied in job
5. **Leadership & Soft Skills**: Integrate required soft skills into experience descriptions

**🎯 TARGET METRICS:**
- Achieve 90-95% keyword match with job description
- Include ALL hard skills mentioned in job posting
- Address EVERY major responsibility listed in job requirements
- Use job posting's exact terminology whenever possible
- Ensure resume demonstrates ALL required years of experience in relevant areas

**⚠️ STRICT RULES:**
- PRESERVE: All LaTeX structure, commands, packages, formatting
- NEVER CHANGE: Document class, geometry, fonts, layout commands
- MAINTAIN: Original section order and LaTeX environments
- ONLY MODIFY: Text content within existing LaTeX commands

**OUTPUT REQUIREMENTS:**
Return the complete enhanced LaTeX code that will score 90-95% match with the target job when run through ATS systems. Focus on maximum keyword density and requirement alignment while maintaining LaTeX compilation compatibility.

**ENHANCEMENT INTENSITY:** MAXIMUM - Transform content aggressively to achieve highest possible ATS score.`;

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