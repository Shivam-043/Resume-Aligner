'use client'

import { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  link?: string
}

export default function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <div className="relative bg-white bg-opacity-90 rounded-xl p-6 overflow-hidden shadow-xl border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:border-opacity-50 hover:border-blue-500">
      {/* Subtle glow effect */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none z-0" 
        style={{
          background: 'radial-gradient(circle at bottom right, #3b82f6, transparent 70%)',
        }}
        aria-hidden="true"
      ></div>
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-6">
          {icon}
        </div>
        
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        
        <p className="text-sm text-gray-700 mb-6 line-height-relaxed">
          {description}
        </p>
        
        {link && (
          <a 
            href={link}
            className="inline-flex items-center text-blue-600 font-medium hover:underline"
          >
            Learn more <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  )
}