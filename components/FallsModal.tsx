'use client'

import { useEffect, useRef } from 'react'
import { POEMS } from '@/lib/poems'

interface FallsModalProps {
  isOpen: boolean
  poem: string
  onClose: () => void
}

export default function FallsModal({ isOpen, poem, onClose }: FallsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Focus trap and close on Escape
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="7 יפול צדיק — שיר מעודד"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-gray/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        ref={dialogRef}
        className="relative z-10 bg-cream border border-gold/40 rounded-lg shadow-xl max-w-md w-full max-h-[85vh] flex flex-col text-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4 shrink-0">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="סגור את החלון"
            className="text-dark-gray/50 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold/40 rounded-sm p-1"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <h2 className="text-gold font-semibold text-lg">7 יפול צדיק</h2>
        </div>

        {/* Poem — scrollable */}
        <div
          className="overflow-y-auto px-8 pb-2 flex-1"
          aria-live="polite"
        >
          <p className="text-dark-gray leading-loose whitespace-pre-line text-base">
            {poem}
          </p>
        </div>

        {/* Close button */}
        <div className="px-8 py-6 shrink-0 flex justify-center border-t border-gold/10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gold text-white text-sm rounded-sm hover:bg-gold/90 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/60"
            aria-label="סגור את החלון"
          >
            כי נפלתי קמתי
          </button>
        </div>
      </div>
    </div>
  )
}

export { POEMS }
