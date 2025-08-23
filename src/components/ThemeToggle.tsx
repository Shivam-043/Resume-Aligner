'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-gray-600 hover:text-gray-900 transition-colors" />
      ) : (
        <Sun className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
      )}
    </button>
  )
}