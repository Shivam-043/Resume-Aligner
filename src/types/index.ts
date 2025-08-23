export interface SkillMatch {
  skill: string
  present: boolean
  importance: 'high' | 'medium' | 'low'
  suggestion?: string
}

export interface MatchingSection {
  title: string
  score: number
  matches: string[]
  gaps: string[]
  suggestions: string[]
}

export interface TailoringRecommendation {
  section: string
  priority: 'high' | 'medium' | 'low'
  current: string
  recommended: string
  reason: string
}

export interface ImprovementSuggestion {
  category: string
  priority: 'high' | 'medium' | 'low'
  suggestion: string
  impact: string
  actionItems: string[]
}

export interface ProjectRecommendation {
  title: string
  description: string
  skillsUtilized: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  timeEstimate: string
  resources: string[]
  relevance: string
}

export interface AnalysisResult {
  overallMatchPercentage: number
  skillsAnalysis: {
    technicalSkills: SkillMatch[]
    softSkills: SkillMatch[]
    certifications: SkillMatch[]
  }
  sectionAnalysis: {
    experience: MatchingSection
    education: MatchingSection
    skills: MatchingSection
    achievements: MatchingSection
  }
  keywordAnalysis: {
    matchedKeywords: string[]
    missingKeywords: string[]
    keywordDensity: number
  }
  tailoringRecommendations: TailoringRecommendation[]
  improvementSuggestions: ImprovementSuggestion[]
  atsCompatibility: {
    score: number
    issues: string[]
    recommendations: string[]
  }
  competitiveAnalysis: {
    strengths: string[]
    weaknesses: string[]
    differentiators: string[]
  }
  projectRecommendations: ProjectRecommendation[]
}

export interface JobAnalysis {
  title: string
  company: string
  requiredSkills: string[]
  preferredSkills: string[]
  experience: string
  education: string
  keyResponsibilities: string[]
  companyInfo: string
}