'use client'

import { useState } from 'react'
import { 
  RotateCcw, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Lightbulb,
  Award,
  Brain,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Globe
} from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AnalysisResult } from '@/types'
import CoverLetterGenerator from './CoverLetterGenerator'
import PortfolioGenerator from './PortfolioGenerator'

interface MatchingResultsProps {
  result: AnalysisResult
  onReset: () => void
  jobUrl: string
  resumeText?: string
  jobDescription?: string
}

export default function MatchingResults({ result, onReset, jobUrl, resumeText = '', jobDescription = '' }: MatchingResultsProps) {
  const [activeSection, setActiveSection] = useState<string>('overview')
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const pieData = [
    { name: 'Match', value: result.overallMatchPercentage, fill: '#22c55e' },
    { name: 'Gap', value: 100 - result.overallMatchPercentage, fill: '#ef4444' }
  ]

  const sectionScores = [
    { name: 'Experience', score: result.sectionAnalysis.experience.score },
    { name: 'Skills', score: result.sectionAnalysis.skills.score },
    { name: 'Education', score: result.sectionAnalysis.education.score },
    { name: 'Achievements', score: result.sectionAnalysis.achievements.score }
  ]

  const skillCategories = [
    {
      title: 'Technical Skills',
      skills: result.skillsAnalysis.technicalSkills,
      icon: <Brain className="h-5 w-5" />
    },
    {
      title: 'Soft Skills',
      skills: result.skillsAnalysis.softSkills,
      icon: <Target className="h-5 w-5" />
    },
    {
      title: 'Certifications',
      skills: result.skillsAnalysis.certifications,
      icon: <Award className="h-5 w-5" />
    }
  ]

  // Navigation tabs data
  const navigationTabs = [
    { id: 'overview', label: 'Overview', icon: <Target className="h-5 w-5" /> },
    { id: 'skills', label: 'Skills Analysis', icon: <Brain className="h-5 w-5" /> },
    { id: 'sections', label: 'Section Analysis', icon: <FileText className="h-5 w-5" /> },
    { id: 'recommendations', label: 'Recommendations', icon: <Lightbulb className="h-5 w-5" /> },
    { id: 'improvements', label: 'Improvements', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 'projects', label: 'Project Ideas', icon: <Award className="h-5 w-5" /> },
    { id: 'coverLetter', label: 'Cover Letter', icon: <FileText className="h-5 w-5" /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Globe className="h-5 w-5" /> }
  ]

  return (
    <div>
      {/* Header with Reset */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analysis Results</h2>
          <p className="text-sm text-gray-600 mt-1">Comprehensive resume-job matching report</p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* Main content with sidebar layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl shadow-md transition-colors sticky top-4">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getScoreColor(result.overallMatchPercentage)}`}>
                  <span className="font-bold text-sm">{result.overallMatchPercentage}%</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Match Score</p>
                  <p className="text-xs text-gray-500">
                    {result.overallMatchPercentage >= 80 ? 'Excellent' : 
                     result.overallMatchPercentage >= 60 ? 'Good' : 'Needs Work'}
                  </p>
                </div>
              </div>
            </div>
            
            <nav className="p-2">
              <ul className="space-y-1">
                {navigationTabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveSection(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeSection === tab.id
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      {tab.id === 'skills' && (
                        <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {result.skillsAnalysis.technicalSkills.filter(s => s.present).length}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Job URL in sidebar */}
            {jobUrl && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-start space-x-2">
                  <ExternalLink className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Analyzed Job:</p>
                    <a 
                      href={jobUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline break-words"
                    >
                      {jobUrl}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Overall Match Score */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">Overall Match Score</h3>
                    <div className="relative inline-block">
                      <ResponsiveContainer width={200} height={200}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={450}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">
                          {result.overallMatchPercentage}%
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-4">
                      {result.overallMatchPercentage >= 80 ? 'Excellent match!' :
                      result.overallMatchPercentage >= 60 ? 'Good match with room for improvement' :
                      'Significant tailoring needed'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">Section Scores</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={sectionScores}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                        <Bar dataKey="score" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Keywords Matched</p>
                      <p className="text-2xl font-bold text-green-600">
                        {result.keywordAnalysis.matchedKeywords.length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Missing Keywords</p>
                      <p className="text-2xl font-bold text-red-600">
                        {result.keywordAnalysis.missingKeywords.length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">ATS Score</p>
                      <p className={`text-2xl font-bold ${
                        result.atsCompatibility.score >= 80 
                          ? 'text-green-600' 
                          : result.atsCompatibility.score >= 60 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }`}>
                        {result.atsCompatibility.score}%
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skills Analysis Section */}
          {activeSection === 'skills' && (
            <div className="space-y-6">
              {skillCategories.map((category, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    {category.icon}
                    <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
                  </div>
                  
                  <div className="grid gap-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {skill.present ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span className="font-medium text-gray-800">{skill.skill}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(skill.importance)}`}>
                            {skill.importance} priority
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Keyword Analysis */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Keyword Analysis</h3>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-green-600 mb-3">Matched Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.keywordAnalysis.matchedKeywords.map((keyword, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-red-600 mb-3">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.keywordAnalysis.missingKeywords.map((keyword, index) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">
                    <span className="font-medium">Keyword Density:</span> {result.keywordAnalysis.keywordDensity}%
                    {result.keywordAnalysis.keywordDensity < 2 && ' - Consider adding more relevant keywords'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section Analysis */}
          {activeSection === 'sections' && (
            <div className="space-y-6">
              {Object.entries(result.sectionAnalysis).map(([sectionName, section]) => (
                <div key={sectionName} className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 capitalize">{sectionName}</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(section.score)}`}>
                      {section.score}% Match
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium text-green-600 mb-3">Strengths</h4>
                      <ul className="space-y-2">
                        {section.matches.map((match, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-800">{match}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-red-600 mb-3">Gaps</h4>
                      <ul className="space-y-2">
                        {section.gaps.map((gap, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-800">{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {section.suggestions.length > 0 && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="text-md font-medium text-yellow-800 mb-2">Suggestions</h4>
                      <ul className="space-y-1">
                        {section.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Lightbulb className="h-4 w-4 text-yellow-800 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-yellow-800">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tailoring Recommendations */}
          {activeSection === 'recommendations' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Tailoring Recommendations</h3>
                
                <div className="space-y-4">
                  {result.tailoringRecommendations.map((rec, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div 
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleCard(`rec-${index}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(rec.priority)}`}>
                              {rec.priority}
                            </span>
                            <h4 className="font-medium text-gray-800">{rec.section}</h4>
                          </div>
                          {expandedCards.has(`rec-${index}`) ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>

                      {expandedCards.has(`rec-${index}`) && (
                        <div className="px-4 pb-4 space-y-4">
                          <div className="grid lg:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium text-red-600 mb-2">Current</h5>
                              <p className="text-sm p-3 bg-red-100 text-red-800 rounded border-l-4 border-red-200">
                                {rec.current}
                              </p>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-green-600 mb-2">Recommended</h5>
                              <p className="text-sm p-3 bg-green-100 text-green-800 rounded border-l-4 border-green-200">
                                {rec.recommended}
                              </p>
                            </div>
                          </div>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm text-blue-600">
                              <span className="font-medium">Reason:</span> {rec.reason}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ATS Compatibility */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-800">ATS Compatibility</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.atsCompatibility.score)}`}>
                    {result.atsCompatibility.score}%
                  </div>
                </div>

                {result.atsCompatibility.issues.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-red-600 mb-3">Issues Found</h4>
                    <ul className="space-y-2">
                      {result.atsCompatibility.issues.map((issue, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-800">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-md font-medium text-green-600 mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {result.atsCompatibility.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Lightbulb className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-800">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Improvement Suggestions */}
          {activeSection === 'improvements' && (
            <div className="space-y-6">
              {result.improvementSuggestions.map((suggestion, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-800">{suggestion.category}</h3>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority} priority
                    </span>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-800">{suggestion.suggestion}</p>
                    
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-600">
                        <span className="font-medium">Expected Impact:</span> {suggestion.impact}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Action Items:</h4>
                      <ul className="space-y-1">
                        {suggestion.actionItems.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-2">
                            <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-800">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}

              {/* Competitive Analysis */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Competitive Analysis</h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-green-600 mb-3">Your Strengths</h4>
                    <ul className="space-y-2">
                      {result.competitiveAnalysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-800">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-red-600 mb-3">Areas to Improve</h4>
                    <ul className="space-y-2">
                      {result.competitiveAnalysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-800">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-blue-600 mb-3">Differentiators</h4>
                    <ul className="space-y-2">
                      {result.competitiveAnalysis.differentiators.map((diff, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Award className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-800">{diff}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Project Recommendations */}
          {activeSection === 'projects' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Award className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Portfolio Project Recommendations</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  These project ideas are tailored to enhance your resume specifically for this job. 
                  Building these projects will help you demonstrate your skills and close any gaps identified in the analysis.
                </p>
              </div>

              {result.projectRecommendations && result.projectRecommendations.map((project, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">{project.title}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full 
                        ${project.difficulty === 'beginner' ? 'bg-green-100 text-green-600' : 
                          project.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-600' : 
                          'bg-red-100 text-red-600'}`}>
                        {project.difficulty} level
                      </span>
                    </div>
                    <p className="text-gray-800 mb-4">{project.description}</p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-blue-600 mb-2">Why This Matters</h4>
                      <p className="text-sm text-blue-600">{project.relevance}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Skills Utilized</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.skillsUtilized.map((skill, skillIndex) => (
                          <span key={skillIndex} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Estimated time: {project.timeEstimate}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6">
                    <h4 className="text-md font-medium text-gray-800 mb-3">Resources</h4>
                    <ul className="space-y-2">
                      {project.resources.map((resource, resourceIndex) => (
                        <li key={resourceIndex} className="flex items-start space-x-2">
                          <ExternalLink className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-blue-600 hover:underline">
                            <a href={resource.startsWith('http') ? resource : `https://www.google.com/search?q=${encodeURIComponent(resource)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {resource}
                            </a>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cover Letter Section */}
          {activeSection === 'coverLetter' && (
            <div className="space-y-6">
              <CoverLetterGenerator 
                resumeText={resumeText}
                jobDescription={jobDescription}
              />
              
              {(!resumeText || !jobDescription) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-800 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-yellow-800 mb-2">Missing Information</h3>
                  <p className="text-yellow-800">
                    To generate a cover letter, both resume text and job description are required. 
                    Please start a new analysis with complete information.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Portfolio Section */}
          {activeSection === 'portfolio' && (
            <div className="space-y-6">
              <PortfolioGenerator 
                resumeText={resumeText}
                jobDescription={jobDescription}
              />
              
              {(!resumeText || !jobDescription) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-800 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-yellow-800 mb-2">Missing Information</h3>
                  <p className="text-yellow-800">
                    To generate a portfolio, both resume text and job description are required. 
                    Please start a new analysis with complete information.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}