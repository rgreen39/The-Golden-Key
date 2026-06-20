'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useState, useCallback, useEffect } from 'react'
import FallsModal from './FallsModal'
import WeightModal from './WeightModal'
import { POEMS } from '@/lib/poems'

const navLinks = [
  { href: '/checklist', label: 'אני רוצה לאכול', ariaLabel: 'נווט לצ\'קליסט מרפשזהב' },
  { href: '/weekly', label: 'יומן שבועי', ariaLabel: 'נווט ללוח השבועי' },
  { href: '/shopping', label: 'רשימת קניות', ariaLabel: 'נווט לרשימת הקניות' },
  { href: '/dreams', label: 'תפריט חלומות', ariaLabel: 'נווט לתפריט החלומות' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [fallsOpen, setFallsOpen] = useState(false)
  const [currentPoem, setCurrentPoem] = useState('')
  const [weightOpen, setWeightOpen] = useState(false)
  const [shouldPromptWeight, setShouldPromptWeight] = useState(false)

  // Check if weight prompt is needed (only when logged in)
  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/weight')
      .then(r => r.json())
      .then(d => setShouldPromptWeight(d.shouldPrompt ?? false))
      .catch(() => {})
  }, [status])

  const handleFallsClick = useCallback(async () => {
    const poem = POEMS[Math.floor(Math.random() * POEMS.length)]
    setCurrentPoem(poem)
    setFallsOpen(true)
    try { await fetch('/api/falls', { method: 'POST' }) } catch {}
  }, [])

  const handleWeightSaved = useCallback(() => {
    setShouldPromptWeight(false)
  }, [])

  return (
    <>
      <nav
        className="w-full bg-cream border-b border-gold/30 font-heebo"
        role="navigation"
        aria-label="סרגל ניווט ראשי"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* App title */}
          <Link
            href="/"
            className="text-gold font-semibold text-xl tracking-wide shrink-0 hover:opacity-80 transition-opacity"
            aria-label="עמוד הבית"
          >
            The Golden Key
          </Link>

          {/* Navigation links */}
          <ul className="hidden sm:flex items-center gap-1 flex-wrap justify-center" role="list">
            {navLinks.map(({ href, label, ariaLabel }) => {
              const isActive = pathname === href
              return (
                <li key={href} role="listitem">
                  <Link
                    href={href}
                    aria-label={ariaLabel}
                    aria-current={isActive ? 'page' : undefined}
                    className={[
                      'px-3 py-1.5 text-sm transition-colors rounded-sm',
                      isActive ? 'text-gold underline underline-offset-4 font-medium' : 'text-dark-gray hover:text-gold',
                    ].join(' ')}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}

            {/* 7 יפול צדיק */}
            <li role="listitem">
              <button
                type="button"
                aria-label="פתח את מודל 7 יפול צדיק"
                onClick={handleFallsClick}
                className="px-3 py-1.5 text-sm border border-gold text-gold rounded-sm hover:bg-gold/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/40"
              >
                7 יפול צדיק
              </button>
            </li>

            {/* Weight button — only shown when needed */}
            {shouldPromptWeight && session?.user && (
              <li role="listitem">
                <button
                  type="button"
                  onClick={() => setWeightOpen(true)}
                  aria-label="הזיני משקל נוכחי"
                  className="px-3 py-1.5 text-sm border border-gold/60 text-dark-gray/70 rounded-sm hover:border-gold hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold/40 flex items-center gap-1"
                >
                  ⚖️ משקל
                </button>
              </li>
            )}
          </ul>

          {/* Auth section */}
          <div className="flex items-center gap-2 shrink-0">
            {status === 'loading' ? (
              <span className="text-sm text-dark-gray/50 w-20 text-center" aria-live="polite">טוען...</span>
            ) : session?.user ? (
              <>
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={`תמונת פרופיל של ${session.user.name ?? 'משתמשת'}`}
                    width={32}
                    height={32}
                    className="rounded-full border border-gold/40"
                  />
                )}
                {session.user.name && (
                  <span className="text-sm text-dark-gray/70">
                    שלום ל{session.user.name}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/auth/signin', redirect: true })}
                  aria-label="התנתק מהחשבון"
                  className="text-sm text-dark-gray hover:text-gold transition-colors px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold/40 rounded-sm"
                >
                  התנתק
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => signIn()}
                aria-label="התחבר לחשבון"
                className="text-sm text-dark-gray hover:text-gold transition-colors px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold/40 rounded-sm"
              >
                התחבר
              </button>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="sm:hidden border-t border-gold/20 px-4 py-2 flex flex-wrap gap-1">
          {navLinks.map(({ href, label, ariaLabel }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                aria-label={ariaLabel}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'px-2 py-1 text-sm transition-colors',
                  isActive ? 'text-gold underline underline-offset-4 font-medium' : 'text-dark-gray hover:text-gold',
                ].join(' ')}
              >
                {label}
              </Link>
            )
          })}
          <button
            type="button"
            onClick={handleFallsClick}
            className="px-2 py-1 text-sm border border-gold text-gold rounded-sm hover:bg-gold/10 transition-colors"
          >
            7 יפול צדיק
          </button>
          {shouldPromptWeight && session?.user && (
            <button
              type="button"
              onClick={() => setWeightOpen(true)}
              className="px-2 py-1 text-sm border border-gold/60 text-dark-gray/70 rounded-sm hover:border-gold hover:text-gold transition-colors"
            >
              ⚖️ משקל
            </button>
          )}
        </div>
      </nav>

      <FallsModal isOpen={fallsOpen} poem={currentPoem} onClose={() => setFallsOpen(false)} />
      <WeightModal isOpen={weightOpen} onClose={() => setWeightOpen(false)} onSaved={handleWeightSaved} />
    </>
  )
}
