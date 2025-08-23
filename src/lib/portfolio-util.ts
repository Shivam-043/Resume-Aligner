/**
 * Utility functions for transforming parsed resume data into portfolio format
 */

/**
 * Transform parsed resume text into a structured format for the portfolio
 * using Gemini 2.5 Pro's advanced analysis capabilities
 * @param resumeText Parsed text from the resume
 * @returns Structured data for portfolio components
 */
export async function transformResumeToPortfolioData(resumeText: string) {
  try {
    // First try to use the Gemini-enhanced portfolio data generation
    const enhancedData = await fetchEnhancedPortfolioData(resumeText);
    return enhancedData;
  } catch (error) {
    console.error("Error using enhanced portfolio generation:", error);
    console.log("Falling back to basic portfolio data extraction");
    
    // Fall back to basic extraction if Gemini API fails
    return generateBasicPortfolioData(resumeText);
  }
}

/**
 * Fetch enhanced portfolio data using Gemini 2.5 Pro API
 */
async function fetchEnhancedPortfolioData(resumeText: string) {
  const response = await fetch('/api/enhance-resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ resumeText })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to enhance resume: ${errorText}`);
  }
  
  const data = await response.json();
  return data.portfolioData;
}

/**
 * Generate basic portfolio data using rule-based extraction
 * as a fallback if the Gemini API is unavailable
 */
function generateBasicPortfolioData(resumeText: string) {
  // Extract sections from resume text
  const sections = extractSectionsFromResume(resumeText);
  
  return {
    personalInfo: extractPersonalInfo(resumeText, sections),
    about: {
      title: "About Me",
      description: [extractPersonalInfo(resumeText, sections).summary],
      resumeLink: "#"
    },
    experience: extractExperienceData(resumeText, sections),
    skills: extractSkillsData(resumeText, sections),
    leadership: generateLeadershipData(resumeText, sections),
    contact: extractContactInfo(resumeText, sections),
  };
}

/**
 * Generate leadership data based on experience and skills
 * Only used in the fallback method
 */
function generateLeadershipData(resumeText: string, sections: Record<string, { start: number, end: number }>) {
  // Default leadership qualities if none can be extracted
  const defaultLeadership = [
    {
      title: "Team Leadership",
      description: "Led cross-functional teams to deliver high-quality projects on time and within budget.",
      icon: "users"
    },
    {
      title: "Project Management",
      description: "Successfully managed multiple projects simultaneously, ensuring efficient resource allocation and timely deliverables.",
      icon: "chart"
    },
    {
      title: "Technical Excellence",
      description: "Established best practices and coding standards that improved overall code quality and reduced bugs.",
      icon: "trophy"
    },
    {
      title: "Strategic Planning",
      description: "Developed strategic roadmaps that aligned with business objectives and drove product innovation.",
      icon: "target"
    }
  ];
  
  // Look for leadership keywords in the resume
  const leadershipKeywords = [
    "led", "managed", "supervised", "directed", "coordinated", "spearheaded", 
    "oversaw", "mentored", "trained", "guided", "initiated", "championed"
  ];
  
  const leadershipData = [];
  
  // Extract experience data to look for leadership roles
  const experienceData = extractExperienceData(resumeText, sections);
  
  // Find achievements that mention leadership
  for (const job of experienceData) {
    for (const achievement of job.achievements) {
      for (const keyword of leadershipKeywords) {
        if (achievement.toLowerCase().includes(keyword)) {
          // Found a leadership achievement
          leadershipData.push({
            title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} ${job.role}`,
            description: achievement,
            icon: getLeadershipIcon(keyword)
          });
          break; // Only use each achievement once
        }
      }
      
      if (leadershipData.length >= 4) break; // Limit to 4 leadership items
    }
    
    if (leadershipData.length >= 4) break;
  }
  
  // If we couldn't find enough leadership items, use the defaults
  return leadershipData.length > 0 ? leadershipData : defaultLeadership;
}

/**
 * Determine an appropriate icon for a leadership quality
 */
function getLeadershipIcon(keyword: string) {
  // Map keywords to appropriate icons
  if (['led', 'managed', 'supervised', 'directed', 'oversaw'].includes(keyword)) {
    return 'users';
  } else if (['coordinated', 'spearheaded', 'initiated', 'championed'].includes(keyword)) {
    return 'chart';
  } else if (['mentored', 'trained', 'guided'].includes(keyword)) {
    return 'trophy';
  } else {
    return 'target';
  }
}

/**
 * Extract main sections from the resume text
 */
function extractSectionsFromResume(resumeText: string) {
  const commonSectionHeaders = [
    'PROFESSIONAL SUMMARY', 'SUMMARY', 'PROFILE',
    'EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT HISTORY',
    'EDUCATION', 'ACADEMIC BACKGROUND',
    'SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES',
    'PROJECTS', 'PROJECT EXPERIENCE',
    'CERTIFICATIONS', 'CERTIFICATES',
    'CONTACT', 'CONTACT INFORMATION',
  ];
  
  const sections: Record<string, { start: number, end: number }> = {};
  const lines = resumeText.split('\n');
  
  // Identify section boundaries
  let currentSection = '';
  let currentSectionStart = 0;
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim().toUpperCase();
    
    // Check if this line could be a section header
    if (trimmedLine && 
        (commonSectionHeaders.includes(trimmedLine) || 
         commonSectionHeaders.some(header => trimmedLine.includes(header)))) {
      
      // If we were already in a section, mark its end
      if (currentSection) {
        sections[currentSection].end = index;
      }
      
      // Start a new section
      const matchedHeader = commonSectionHeaders.find(header => 
        trimmedLine.includes(header)
      ) || trimmedLine;
      
      currentSection = matchedHeader;
      currentSectionStart = index;
      
      sections[currentSection] = {
        start: index,
        end: lines.length, // Default to end of resume, will be updated when next section is found
      };
    }
  });
  
  return sections;
}

/**
 * Extract personal information like name, title, and summary
 */
function extractPersonalInfo(resumeText: string, sections: Record<string, { start: number, end: number }>) {
  const lines = resumeText.split('\n');
  
  // Name is usually at the top of resume
  let name = '';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (line && line.length > 0 && line.length < 50 && !line.includes(':') && !line.includes('@')) {
      name = line;
      break;
    }
  }
  
  // Extract job title (often near the name or in the summary)
  const jobTitleRegex = /\b(software engineer|developer|engineer|web developer|frontend|backend|full stack|data scientist|product manager|ux designer|designer)\b/i;
  const jobTitleMatch = resumeText.match(jobTitleRegex);
  const jobTitle = jobTitleMatch ? jobTitleMatch[0] : 'Professional';
  
  // Extract summary from the SUMMARY section if it exists
  let summary = '';
  const summarySectionKeys = ['PROFESSIONAL SUMMARY', 'SUMMARY', 'PROFILE'];
  
  for (const key of summarySectionKeys) {
    if (sections[key]) {
      const summaryLines = lines.slice(sections[key].start + 1, sections[key].end);
      summary = summaryLines.join(' ').trim();
      break;
    }
  }
  
  // If no dedicated summary section, use the first paragraph
  if (!summary) {
    const firstParagraphEnd = Math.min(10, lines.length);
    summary = lines.slice(1, firstParagraphEnd).join(' ').trim();
  }
  
  return {
    name,
    jobTitle,
    summary,
    profileImage: '' // Default empty, would be set by user upload
  };
}

/**
 * Extract work experience data
 */
function extractExperienceData(resumeText: string, sections: Record<string, { start: number, end: number }>) {
  const experienceData: Array<{
    company: string;
    role: string;
    duration: string;
    location: string;
    achievements: string[];
  }> = [];
  
  const experienceSectionKeys = ['EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT HISTORY'];
  let experienceSection = null;
  
  // Find the experience section
  for (const key of experienceSectionKeys) {
    if (sections[key]) {
      experienceSection = sections[key];
      break;
    }
  }
  
  if (experienceSection) {
    const lines = resumeText.split('\n');
    const experienceText = lines.slice(experienceSection.start + 1, experienceSection.end).join('\n');
    
    // Try to identify individual job entries
    // This is a simplified approach - real-world resumes can be very varied
    const jobEntries = experienceText.split(/\n(?=[A-Z][a-z]+\s|[A-Z]+\s)/);
    
    jobEntries.forEach(entry => {
      if (entry.trim().length < 10) return; // Skip very short entries
      
      const entryLines = entry.split('\n');
      
      // Extract company name and role (usually at the beginning of the entry)
      let company = '';
      let role = '';
      let duration = '';
      let location = '';
      
      // First line often contains company name
      if (entryLines.length > 0) {
        company = entryLines[0].trim();
      }
      
      // Second line often contains role
      if (entryLines.length > 1) {
        role = entryLines[1].trim();
        
        // Check if the company line might also contain the role
        if (company.includes('|')) {
          const parts = company.split('|');
          company = parts[0].trim();
          role = parts[1].trim();
        }
      }
      
      // Look for date patterns to extract duration
      const dateRegex = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[-–—]\s*(?:Present|Current|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{0,4}/i;
      const dateMatch = entry.match(dateRegex);
      if (dateMatch) {
        duration = dateMatch[0];
      }
      
      // Look for location information
      const locationRegex = /(?:Remote|Hybrid|On-site|In-office)?[,]?\s*(?:[A-Z][a-z]+(?:[-\s][A-Z][a-z]+)*,\s*[A-Z]{2}|[A-Z][a-z]+(?:[-\s][A-Z][a-z]+)*)/;
      const locationMatch = entry.match(locationRegex);
      if (locationMatch) {
        location = locationMatch[0];
      }
      
      // Extract bullet points as achievements
      const achievements: string[] = [];
      let inBulletPoints = false;
      
      entryLines.forEach((line, i) => {
        // Skip the first few lines which are likely company, role, dates
        if (i < 2) return;
        
        const trimmedLine = line.trim();
        
        // Detect bullet points
        if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || 
            /^\d+\./.test(trimmedLine)) {
          inBulletPoints = true;
          achievements.push(trimmedLine.replace(/^[•\-*\d\.]+\s*/, ''));
        } 
        // Continuation of previous bullet point or paragraph
        else if (inBulletPoints && trimmedLine && i > 2) {
          if (achievements.length > 0) {
            achievements[achievements.length - 1] += ' ' + trimmedLine;
          } else {
            achievements.push(trimmedLine);
          }
        }
      });
      
      // Only add entries that have at least some extracted information
      if (company || role) {
        experienceData.push({
          company: company || 'Company Name',
          role: role || 'Position Title',
          duration: duration || 'Date Range',
          location: location || 'Location',
          achievements: achievements.length > 0 ? achievements : ['Responsibilities and achievements']
        });
      }
    });
  }
  
  return experienceData;
}

/**
 * Extract skills data from resume
 */
function extractSkillsData(resumeText: string, sections: Record<string, { start: number, end: number }>) {
  const skills: { category: string; items: string[] }[] = [];
  
  const skillsSectionKeys = ['SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES'];
  let skillsSection = null;
  
  // Find the skills section
  for (const key of skillsSectionKeys) {
    if (sections[key]) {
      skillsSection = sections[key];
      break;
    }
  }
  
  if (skillsSection) {
    const lines = resumeText.split('\n');
    const skillsText = lines.slice(skillsSection.start + 1, skillsSection.end).join('\n');
    
    // Try to identify skill categories
    const categories: Record<string, string[]> = {
      'Programming Languages': [],
      'Frameworks & Libraries': [],
      'Tools & Technologies': [],
      'Soft Skills': [],
    };
    
    // Common skill keywords by category
    const categoryKeywords: Record<string, RegExp> = {
      'Programming Languages': /\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|PHP|Ruby|Go|Swift|Kotlin|Rust|Scala|R|HTML|CSS|SQL|Dart|C|Perl|Shell|Haskell|Lua)\b/gi,
      'Frameworks & Libraries': /\b(React|Angular|Vue|Next\.js|Express|Django|Flask|Spring|Laravel|Ruby on Rails|ASP\.NET|Bootstrap|Tailwind|jQuery|Node\.js|Flutter|SwiftUI|TensorFlow|PyTorch|Pandas|NumPy|Redux|Svelte)\b/gi,
      'Tools & Technologies': /\b(Git|Docker|Kubernetes|AWS|Azure|GCP|Firebase|MongoDB|PostgreSQL|MySQL|Redis|GraphQL|REST API|CI\/CD|Jenkins|GitHub Actions|Jira|Figma|Sketch|Adobe XD|Webpack|Babel|ESLint|Heroku|Vercel|Netlify)\b/gi,
      'Soft Skills': /\b(Communication|Leadership|Teamwork|Problem Solving|Critical Thinking|Creativity|Time Management|Project Management|Adaptability|Collaboration|Negotiation|Presentation|Decision Making|Emotional Intelligence)\b/gi,
    };
    
    // Extract skills by category from the skills section
    for (const [category, regex] of Object.entries(categoryKeywords)) {
      const matches = skillsText.match(regex);
      if (matches && matches.length > 0) {
        categories[category] = [...new Set(matches)]; // Remove duplicates
      }
    }
    
    // Convert categories object to array format
    for (const [category, items] of Object.entries(categories)) {
      if (items.length > 0) {
        skills.push({
          category,
          items
        });
      }
    }
    
    // If no categorized skills were found, extract all potential skill keywords
    if (skills.length === 0) {
      const allSkillsRegex = /\b([A-Za-z][\w\.\+\#]+(?:\s[A-Za-z][\w\.\+\#]+)*)\b/g;
      const potentialSkills = skillsText.match(allSkillsRegex) || [];
      
      const filteredSkills = potentialSkills
        .filter(skill => 
          skill.length > 2 && 
          !['and', 'the', 'with', 'for', 'in', 'on', 'to', 'of'].includes(skill.toLowerCase())
        );
      
      if (filteredSkills.length > 0) {
        skills.push({
          category: 'Skills',
          items: [...new Set(filteredSkills)] // Remove duplicates
        });
      }
    }
  }
  
  // If still no skills found, use a fallback approach by scanning the entire resume
  if (skills.length === 0) {
    const commonSkills = [
      'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Express',
      'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', '.NET',
      'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'NoSQL',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
      'Git', 'GitHub', 'GitLab', 'CI/CD', 'Agile', 'Scrum'
    ];
    
    const foundSkills = commonSkills.filter(skill => 
      new RegExp(`\\b${skill.replace(/\./g, '\\.')}\\b`, 'i').test(resumeText)
    );
    
    if (foundSkills.length > 0) {
      skills.push({
        category: 'Technical Skills',
        items: foundSkills
      });
    }
  }
  
  return skills;
}

/**
 * Extract education data from resume
 */
function extractEducationData(resumeText: string, sections: Record<string, { start: number, end: number }>) {
  const educationData: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    date: string;
    gpa?: string;
    achievements?: string[];
  }> = [];
  
  const educationSectionKeys = ['EDUCATION', 'ACADEMIC BACKGROUND'];
  let educationSection = null;
  
  // Find the education section
  for (const key of educationSectionKeys) {
    if (sections[key]) {
      educationSection = sections[key];
      break;
    }
  }
  
  if (educationSection) {
    const lines = resumeText.split('\n');
    const educationText = lines.slice(educationSection.start + 1, educationSection.end).join('\n');
    
    // Try to identify individual education entries
    const eduEntries = educationText.split(/\n(?=[A-Z][a-z]+\s|[A-Z]+\s)/);
    
    eduEntries.forEach(entry => {
      if (entry.trim().length < 10) return; // Skip very short entries
      
      const entryLines = entry.split('\n');
      
      // Extract institution name (usually at the beginning of the entry)
      let institution = '';
      let degree = '';
      let fieldOfStudy = '';
      let date = '';
      let gpa = '';
      const achievements: string[] = [];
      
      // First line often contains institution name
      if (entryLines.length > 0) {
        institution = entryLines[0].trim();
      }
      
      // Look for degree information
      const degreeRegex = /\b(?:Bachelor|Master|PhD|Doctorate|Associate|B\.S\.|B\.A\.|M\.S\.|M\.A\.|M\.B\.A\.|Ph\.D\.|B\.Tech|M\.Tech|B\.E\.|M\.E\.|B\.Com|M\.Com)\b[^,\n]*/i;
      const degreeMatch = entry.match(degreeRegex);
      if (degreeMatch) {
        degree = degreeMatch[0].trim();
      }
      
      // Look for field of study
      const fieldRegex = /\bin\s+([^,\n]+)/i;
      const fieldMatch = entry.match(fieldRegex);
      if (fieldMatch && fieldMatch[1]) {
        fieldOfStudy = fieldMatch[1].trim();
      }
      
      // Extract date information
      const dateRegex = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|(?:19|20)\d{2}/i;
      const dateMatches = Array.from(entry.matchAll(new RegExp(dateRegex, 'gi')));
      
      if (dateMatches.length === 2) {
        date = `${dateMatches[0][0]} - ${dateMatches[1][0]}`;
      } else if (dateMatches.length === 1) {
        date = `Graduated: ${dateMatches[0][0]}`;
      }
      
      // Look for GPA information
      const gpaRegex = /\b(?:GPA|Grade Point Average)[\s:]*([0-4]\.[0-9]+|[0-9]+\.[0-9]+)(?:\/([0-9]\.[0-9]+|[0-9]+))?\b/i;
      const gpaMatch = entry.match(gpaRegex);
      if (gpaMatch) {
        gpa = gpaMatch[0].trim();
      }
      
      // Extract achievements or coursework
      entryLines.forEach((line, i) => {
        if (i < 2) return; // Skip the first few lines which are likely institution, degree
        
        const trimmedLine = line.trim();
        
        // Detect bullet points or coursework
        if ((trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*') ||
             /^\d+\./.test(trimmedLine)) || 
            /\b(?:coursework|courses|achievements|honors|awards)\b/i.test(trimmedLine)) {
          achievements.push(trimmedLine.replace(/^[•\-*\d\.]+\s*/, ''));
        }
      });
      
      // Only add entries that have at least institution information
      if (institution) {
        educationData.push({
          institution,
          degree: degree || 'Degree',
          fieldOfStudy: fieldOfStudy || 'Field of Study',
          date: date || 'Date Range',
          gpa: gpa || undefined,
          achievements: achievements.length > 0 ? achievements : undefined
        });
      }
    });
  }
  
  return educationData;
}

/**
 * Extract project data from resume
 */
function extractProjectsData(resumeText: string, sections: Record<string, { start: number, end: number }>) {
  const projectsData: Array<{
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }> = [];
  
  const projectsSectionKeys = ['PROJECTS', 'PROJECT EXPERIENCE'];
  let projectsSection = null;
  
  // Find the projects section
  for (const key of projectsSectionKeys) {
    if (sections[key]) {
      projectsSection = sections[key];
      break;
    }
  }
  
  if (projectsSection) {
    const lines = resumeText.split('\n');
    const projectsText = lines.slice(projectsSection.start + 1, projectsSection.end).join('\n');
    
    // Try to identify individual project entries
    const projectEntries = projectsText.split(/\n(?=[A-Z][a-z]+\s|[A-Z]+\s)/);
    
    projectEntries.forEach(entry => {
      if (entry.trim().length < 10) return; // Skip very short entries
      
      const entryLines = entry.split('\n');
      
      // Extract project title (usually at the beginning of the entry)
      let title = '';
      let description = '';
      let technologies: string[] = [];
      let link = '';
      
      // First line often contains project title
      if (entryLines.length > 0) {
        title = entryLines[0].trim();
      }
      
      // Extract technologies using common patterns
      const techRegex = /\b(?:using|with|built with|developed with|technologies:|tech stack:)\s+([^.]+)/i;
      const techMatch = entry.match(techRegex);
      if (techMatch && techMatch[1]) {
        technologies = techMatch[1].split(/,|\sand\s|\s\|\s/).map(tech => tech.trim());
      } else {
        // Try to extract technologies by looking for common programming terms
        const commonTechTerms = [
          'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express',
          'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', '.NET', 'PHP', 'Laravel',
          'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Redux', 'GraphQL', 'REST API',
          'HTML', 'CSS', 'SASS', 'SCSS', 'Tailwind', 'Bootstrap', 'Material UI', 'AWS', 'Azure'
        ];
        
        commonTechTerms.forEach(tech => {
          const techRegExp = new RegExp(`\\b${tech.replace(/\./g, '\\.')}\\b`, 'i');
          if (techRegExp.test(entry)) {
            technologies.push(tech);
          }
        });
      }
      
      // Look for URLs/links
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urlMatch = entry.match(urlRegex);
      if (urlMatch) {
        link = urlMatch[0];
      }
      
      // Extract description by combining non-header, non-technology lines
      const descLines: string[] = [];
      let inDescription = false;
      
      entryLines.forEach((line, i) => {
        // Skip the title line
        if (i === 0) return;
        
        const trimmedLine = line.trim();
        
        // Skip empty lines or lines that appear to be technology lists
        if (!trimmedLine || /\b(?:using|with|built with|developed with|technologies:|tech stack:)\s+/i.test(trimmedLine)) {
          return;
        }
        
        // Detect bullet points as part of the description
        if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || 
            /^\d+\./.test(trimmedLine)) {
          inDescription = true;
          descLines.push(trimmedLine.replace(/^[•\-*\d\.]+\s*/, ''));
        } 
        // Include other lines that might be part of description
        else if (i > 0) {
          inDescription = true;
          descLines.push(trimmedLine);
        }
      });
      
      description = descLines.join(' ').trim();
      
      // Only add projects that have at least a title
      if (title) {
        projectsData.push({
          title,
          description: description || 'Project description',
          technologies: technologies.length > 0 ? technologies : ['Various technologies'],
          link: link || undefined
        });
      }
    });
  }
  
  return projectsData;
}

/**
 * Extract contact information from resume
 */
function extractContactInfo(resumeText: string, sections: Record<string, { start: number, end: number }>) {
  // Initialize with empty values
  let email = '';
  let phone = '';
  let location = '';
  let linkedin = '';
  let github = '';
  let website = '';
  
  // Extract email using regex
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const emailMatch = resumeText.match(emailRegex);
  if (emailMatch) {
    email = emailMatch[0];
  }
  
  // Extract phone using regex
  const phoneRegex = /\b(?:\+\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/;
  const phoneMatch = resumeText.match(phoneRegex);
  if (phoneMatch) {
    phone = phoneMatch[0];
  }
  
  // Extract location - simplified approach
  const locationRegex = /(?:Address|Location|Based in):\s*([^,\n]+(?:,\s*[^,\n]+)*)/i;
  const locationMatch = resumeText.match(locationRegex);
  if (locationMatch && locationMatch[1]) {
    location = locationMatch[1].trim();
  } else {
    // Alternative: look for city/state patterns
    const cityStateRegex = /\b[A-Z][a-z]+(?:[-\s][A-Z][a-z]+)*,\s*[A-Z]{2}\b/;
    const cityStateMatch = resumeText.match(cityStateRegex);
    if (cityStateMatch) {
      location = cityStateMatch[0];
    }
  }
  
  // Extract LinkedIn URL
  const linkedinRegex = /(?:linkedin\.com\/in\/[A-Za-z0-9_-]+|linkedin:\s*([A-Za-z0-9_-]+))/i;
  const linkedinMatch = resumeText.match(linkedinRegex);
  if (linkedinMatch) {
    linkedin = linkedinMatch[0].replace(/linkedin:\s*/i, 'linkedin.com/in/');
  }
  
  // Extract GitHub URL
  const githubRegex = /(?:github\.com\/[A-Za-z0-9_-]+|github:\s*([A-Za-z0-9_-]+))/i;
  const githubMatch = resumeText.match(githubRegex);
  if (githubMatch) {
    github = githubMatch[0].replace(/github:\s*/i, 'github.com/');
  }
  
  // Extract personal website
  const websiteRegex = /(?:https?:\/\/(?:www\.)?([A-Za-z0-9][-A-Za-z0-9.]*\.[A-Za-z]{2,})(?:\/[-A-Za-z0-9%_.~#?&=]*)?)/i;
  const websiteMatch = resumeText.match(websiteRegex);
  if (websiteMatch && 
      !websiteMatch[0].includes('linkedin.com') && 
      !websiteMatch[0].includes('github.com')) {
    website = websiteMatch[0];
  }
  
  return {
    email,
    phone,
    location,
    linkedin,
    github,
    website,
  };
}