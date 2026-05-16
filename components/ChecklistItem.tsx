'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ChecklistItemProps {
  letter: string
  keyword?: string
  text: string
  expandedContent?: string
  checked: boolean
  onToggle: () => void
}

export default function ChecklistItem({
  letter,
  keyword,
  text,
  expandedContent,
  checked,
  onToggle,
}: ChecklistItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const handleExpandToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    setIsExpanded((prev) => !prev)
  }

  const handleExpandKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleExpandToggle(e)
    }
  }

  const handleRowKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle()
    }
  }

  return (
    <div className="w-full">
      {/* Main row — clicking toggles checked */}
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
          transition-colors duration-150
          ${checked ? 'bg-amber-50' : 'bg-white hover:bg-cream'}
          border border-transparent hover:border-gold/20
        `}
        onClick={onToggle}
        onKeyDown={handleRowKeyDown}
        role="checkbox"
        aria-checked={checked}
        aria-label={`סמן סעיף ${letter}: ${text}`}
        tabIndex={0}
      >
        {/* Letter badge + keyword — right side */}
        <div className="flex flex-col items-center shrink-0 w-16" aria-hidden="true">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center mb-0.5">
            <span className="text-white font-bold text-sm leading-none">{letter}</span>
          </div>
          {keyword && (
            <span className="text-gold font-bold text-xs leading-tight text-center">
              {keyword}
            </span>
          )}
        </div>

        {/* Text */}
        <span
          className={`flex-1 text-base leading-relaxed text-right ${checked ? 'text-dark-gray/60 line-through decoration-gold/40' : 'text-dark-gray'}`}
          dir="rtl"
        >
          {text}
        </span>

        {/* Expand button */}
        {expandedContent && !checked && (
          <button
            type="button"
            onClick={handleExpandToggle}
            onKeyDown={handleExpandKeyDown}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? `כווץ סעיף ${letter}` : `הרחב סעיף ${letter}`}
            tabIndex={0}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gold/70 hover:text-gold hover:bg-gold/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/40"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Checkmark — shown after checking */}
        {checked && (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gold flex items-center justify-center" aria-hidden="true">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 12 10" fill="none">
              <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Accordion panel — only when not checked */}
      {expandedContent && !checked && (
        <div
          className={`accordion-content ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
          aria-hidden={!isExpanded}
        >
          <div className="mx-4 mb-1 mt-1 px-4 py-3 rounded-lg bg-cream border border-gold/20 text-sm text-dark-gray/80 leading-relaxed whitespace-pre-line text-right">
            {expandedContent}
          </div>
        </div>
      )}

      {/* "בסוף לא" — exit option shown after item is checked */}
      {checked && (
        <div className="flex justify-end px-4 pb-1">
          <button
            type="button"
            onClick={() => router.push('/not-eating')}
            aria-label="בסוף לא — יציאה מהתהליך"
            className="flex items-center gap-1.5 text-xs text-dark-gray/40 hover:text-dark-gray/70 transition-colors py-1 focus:outline-none"
          >
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            בסוף לא
          </button>
        </div>
      )}
    </div>
  )
}
