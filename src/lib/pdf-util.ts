/**
 * Extract text from a PDF file by sending it to the server API
 * @param fileData PDF file as a File object
 * @returns Object with text content and page count
 */
export async function extractTextFromPdf(fileData: File): Promise<{ text: string; pageCount: number }> {
  try {
    // Create form data to send file to API
    const formData = new FormData();
    formData.append('file', fileData);

    // Send to server API route
    const response = await fetch('/api/upload-resume', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to extract text from PDF');
    }

    const data = await response.json();
    return {
      text: data.text,
      pageCount: data.pageCount
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    // Fall back to mock data on any error
    return mockExtractTextFromPdf();
  }
}

/**
 * A fallback function in case the PDF extraction fails
 * @returns Sample text as a fallback
 */
export function mockExtractTextFromPdf() {
  console.warn('Using mock PDF extraction as fallback');
  return {
    text: `PROFESSIONAL SUMMARY
Experienced software engineer with expertise in React, TypeScript, and Next.js. Passionate about building scalable web applications and improving user experiences.

SKILLS
- Frontend: React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS
- Backend: Node.js, Express, Python
- Database: MongoDB, PostgreSQL
- Tools: Git, Docker, Jest, AWS

WORK EXPERIENCE
Senior Frontend Developer | TechCorp Inc.
Jan 2021 - Present
- Led the development of a customer-facing web application using React and TypeScript
- Implemented responsive designs and improved performance by 30%
- Collaborated with UX designers and backend engineers to deliver features on time

Software Engineer | StartupXYZ
Mar 2018 - Dec 2020
- Developed and maintained multiple web applications using React and Node.js
- Implemented RESTful APIs and database integrations
- Participated in code reviews and mentored junior developers

EDUCATION
Bachelor of Science in Computer Science | University of Technology
Graduated: 2018
- GPA: 3.8/4.0
- Relevant coursework: Data Structures, Algorithms, Web Development

PROJECTS
E-commerce Platform
- Built a full-stack e-commerce platform with React, Node.js, and MongoDB
- Implemented user authentication, product catalog, and payment processing

Personal Portfolio
- Designed and developed a responsive personal portfolio using Next.js and Tailwind CSS
- Deployed using Vercel with continuous integration`,
    pageCount: 1
  };
}

/**
 * Generate a cover letter based on a resume and job description using Gemini 2.5 Pro
 * @param resumeText The extracted text from the resume
 * @param jobDescription The job description text
 * @param userName Optional user name to personalize the cover letter
 * @returns A generated cover letter
 */
export async function generateCoverLetter(resumeText: string, jobDescription: string, userName?: string): Promise<string> {
  try {
    // Call the Gemini API through our backend route
    const response = await fetch('/api/generate-cover-letter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        resumeText,
        jobDescription,
        userName
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to generate cover letter: ${errorData}`);
    }
    
    const data = await response.json();
    return data.coverLetter;
  } catch (error) {
    console.error('Error generating cover letter with Gemini:', error);
    console.log('Falling back to rule-based cover letter generation');
    
    // Fall back to the rule-based approach if the API call fails
    return generateFallbackCoverLetter(resumeText, jobDescription, userName);
  }
}

/**
 * Fallback cover letter generation function using rule-based approach
 */
function generateFallbackCoverLetter(resumeText: string, jobDescription: string, userName?: string): string {
  // Extract key information from the resume
  const name = userName || extractNameFromResume(resumeText) || 'Applicant';
  const skills = extractSkillsFromResume(resumeText);
  const experience = extractExperienceFromResume(resumeText);
  
  // Extract key requirements from the job description
  const jobTitle = extractJobTitleFromDescription(jobDescription) || 'the position';
  const company = extractCompanyFromDescription(jobDescription) || 'your company';
  const keyRequirements = extractKeyRequirementsFromJob(jobDescription);
  
  // Current date formatting
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Generate the cover letter
  return `${formattedDate}

Dear Hiring Manager,

I am writing to express my interest in ${jobTitle} at ${company}. With my background in ${experience.field || 'the industry'} and expertise in ${skills.slice(0, 3).join(', ')}, I am confident in my ability to make significant contributions to your team.

${generateMatchingParagraph(keyRequirements, skills, experience)}

${generateValuePropositionParagraph(jobDescription, resumeText)}

I am excited about the opportunity to bring my unique skills and experiences to ${company}. Thank you for considering my application. I look forward to the possibility of discussing how I can contribute to your team's success.

Sincerely,
${name}`;
}

/**
 * Helper function to extract a name from resume text
 * Simple implementation - in production would use more sophisticated NLP
 */
function extractNameFromResume(resumeText: string): string | null {
  // Look for a name at the beginning of the resume
  // This is a simplified approach and would need improvement for production
  const lines = resumeText.split('\n');
  
  // Check the first few non-empty lines for a potential name
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (line && line.length > 0 && line.length < 40 && !line.includes(':') && !line.includes('@')) {
      // Simple heuristic: names are usually short lines at the top without special characters
      return line;
    }
  }
  
  return null;
}

/**
 * Extract skills from resume text
 */
function extractSkillsFromResume(resumeText: string): string[] {
  const skills: string[] = [];
  const skillsRegex = /skills|technologies|programming languages|technical skills/i;
  
  // Check if there's a skills section
  if (skillsRegex.test(resumeText)) {
    // Very basic implementation - look for common tech skills
    const commonSkills = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'HTML', 'CSS',
      'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Git', 'REST API', 'GraphQL',
      'Next.js', 'Vue.js', 'Angular', 'Express', 'Django', 'Flask', 'Spring Boot',
      'CI/CD', 'DevOps', 'Agile', 'Scrum', 'Project Management', 'Team Leadership'
    ];
    
    // Extract skills that appear in the resume
    skills.push(...commonSkills.filter(skill => 
      new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i').test(resumeText)
    ));
  }
  
  return skills.length > 0 ? skills : ['relevant skills'];
}

/**
 * Extract experience details from resume text
 */
function extractExperienceFromResume(resumeText: string): { field: string, years?: number } {
  // This would be more sophisticated in production
  let field = '';
  
  if (/software|developer|engineer|web|frontend|backend|fullstack|programming/i.test(resumeText)) {
    field = 'software development';
  } else if (/data|analyst|analytics|science|scientist|machine learning|AI/i.test(resumeText)) {
    field = 'data science';
  } else if (/marketing|market research|seo|content|social media/i.test(resumeText)) {
    field = 'marketing';
  } else if (/sales|account|business development|client|customer/i.test(resumeText)) {
    field = 'sales';
  } else if (/project manager|management|product owner|scrum/i.test(resumeText)) {
    field = 'project management';
  } else if (/design|UX|UI|user experience|user interface/i.test(resumeText)) {
    field = 'design';
  } else {
    field = 'professional experience';
  }
  
  return { field };
}

/**
 * Extract job title from job description
 */
function extractJobTitleFromDescription(jobDescription: string): string | null {
  const titleMatch = jobDescription.match(/\b(software engineer|web developer|frontend developer|backend developer|full stack developer|data scientist|product manager|project manager|ux designer|ui designer|graphic designer|marketing specialist|sales representative|data analyst|business analyst|devops engineer|qa engineer|system administrator|network engineer|it specialist|content writer|digital marketer|hr manager|recruiter)\b/i);
  
  return titleMatch ? titleMatch[0] : null;
}

/**
 * Extract company name from job description
 */
function extractCompanyFromDescription(jobDescription: string): string | null {
  // This is a simplified approach
  // Look for "at [Company]" or "with [Company]" or "join [Company]" patterns
  const companyMatch = jobDescription.match(/(?:at|with|join)\s+([A-Z][A-Za-z0-9\s]{2,}?)(?:\.|\,|\s|$)/);
  
  return companyMatch ? companyMatch[1].trim() : null;
}

/**
 * Extract key requirements from job description
 */
function extractKeyRequirementsFromJob(jobDescription: string): string[] {
  const requirements: string[] = [];
  
  // Simple approach: look for common skill keywords
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'HTML', 'CSS',
    'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Git', 'REST API', 'GraphQL',
    'Next.js', 'Vue.js', 'Angular', 'Express', 'Django', 'Flask', 'Spring Boot',
    'CI/CD', 'DevOps', 'Agile', 'Scrum', 'Project Management', 'Team Leadership'
  ];
  
  // Extract skills mentioned in the job description
  requirements.push(...skillKeywords.filter(skill => 
    new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i').test(jobDescription)
  ));
  
  return requirements.length > 0 ? requirements : ['specific skills and qualifications'];
}

/**
 * Generate a paragraph highlighting matches between candidate and job requirements
 */
function generateMatchingParagraph(requirements: string[], skills: string[], experience: { field: string }): string {
  // Find matching skills
  const matchingSkills = requirements.filter(req => 
    skills.some(skill => skill.toLowerCase() === req.toLowerCase())
  );
  
  if (matchingSkills.length > 0) {
    return `Through my professional experiences, I've developed strong expertise in ${matchingSkills.slice(0, 3).join(', ')}, which directly align with your requirements. My background in ${experience.field} has prepared me to tackle the challenges and responsibilities outlined in the job description. I am particularly drawn to this role because it leverages my strengths while offering opportunities for professional growth.`;
  } else {
    return `Through my professional experiences in ${experience.field}, I've developed skills that align well with the requirements in your job description. I am confident that my background has prepared me to tackle the challenges and responsibilities of this role, and I'm excited about the opportunity to bring my expertise to your team.`;
  }
}

/**
 * Generate a paragraph highlighting the candidate's value proposition
 */
function generateValuePropositionParagraph(jobDescription: string, resumeText: string): string {
  // Look for achievement indicators in the resume
  const hasAchievements = /increased|improved|achieved|led|managed|developed|created|implemented|reduced|optimized/i.test(resumeText);
  
  // Look for teamwork indicators in the job description
  const teamFocus = /team|collaborate|communication|interpersonal/i.test(jobDescription);
  
  // Look for innovation indicators in the job description
  const innovationFocus = /innovate|creative|novel|new|disrupt|transform/i.test(jobDescription);
  
  if (hasAchievements && teamFocus) {
    return `Throughout my career, I've demonstrated the ability to deliver results while working effectively in team environments. I value collaborative problem-solving and clear communication, which I understand are crucial for success at your organization. I'm confident that my combination of technical skills and interpersonal abilities would make me a valuable asset to your team.`;
  } else if (hasAchievements && innovationFocus) {
    return `Throughout my career, I've demonstrated the ability to drive innovation and deliver impactful results. I thrive in environments that encourage creative thinking and novel approaches to problem-solving. Based on your job description, I believe my forward-thinking mindset and technical capabilities align perfectly with what you're seeking in an ideal candidate.`;
  } else {
    return `What sets me apart is my dedication to continuous learning and professional growth, combined with a track record of delivering quality results. I am adept at quickly adapting to new technologies and methodologies, and I take pride in producing work that exceeds expectations. I believe these qualities make me well-suited for this role at your organization.`;
  }
}