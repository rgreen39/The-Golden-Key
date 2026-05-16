'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// ─── Heart particles ───────────────────────────────────────────────────────────

const HEART_COUNT = 18

interface HeartConfig {
  id: number
  left: string
  delay: string
  duration: string
  size: string
}

function generateHearts(): HeartConfig[] {
  return Array.from({ length: HEART_COUNT }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 6}s`,
    duration: `${5 + Math.random() * 5}s`,
    size: `${1 + Math.random() * 1.2}rem`,
  }))
}

// ─── Inner component (uses useSearchParams) ────────────────────────────────────

function CompleteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const foodChoice = searchParams.get('food') ?? ''

  const [secondsLeft, setSecondsLeft] = useState(10)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [hearts] = useState<HeartConfig[]>(() => generateHearts())

  // ── Auto-redirect after 10 seconds ─────────────────────────────────────────
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!)
          return 0
        }
        return s - 1
      })
    }, 1000)

    timerRef.current = setTimeout(() => {
      router.push('/')
    }, 10000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [router])

  // ── New meal — cancel timer and go to checklist ─────────────────────────────
  const handleNewMeal = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
    router.push('/checklist')
  }

  // Circumference for SVG timer ring (r=45 → C ≈ 283)
  const CIRCUMFERENCE = 283
  const dashOffset = CIRCUMFERENCE - (secondsLeft / 10) * CIRCUMFERENCE

  return (
    <main
      className="relative min-h-screen bg-cream flex flex-col items-center justify-center overflow-hidden px-4"
      dir="rtl"
      aria-label="מסך סיום הצ'קליסט"
    >
      {/* Floating hearts background */}
      <div aria-hidden="true">
        {hearts.map((h) => (
          <span
            key={h.id}
            className="heart-particle"
            style={{
              left: h.left,
              animationDelay: h.delay,
              animationDuration: h.duration,
              fontSize: h.size,
            }}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Content card */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-md">
        {/* Main blessing text */}
        <h1 className="text-3xl font-semibold text-gold leading-relaxed tracking-wide">
          פותח את ידך
          <br />
          ומשביע לכל חי רצון
        </h1>

        {/* Food choice display */}
        {foodChoice && (
          <p className="text-base text-dark-gray/80 bg-white/70 px-5 py-2 rounded-sm border border-gold/20">
            בחרת לאכול: <span className="font-medium text-dark-gray">{foodChoice}</span>
          </p>
        )}

        {/* Timer ring */}
        <div
          className="relative w-20 h-20"
          role="timer"
          aria-label={`${secondsLeft} שניות עד חזרה לדף הבית`}
          aria-live="off"
        >
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            {/* Track */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#C9A84C"
              strokeOpacity="0.2"
              strokeWidth="6"
            />
            {/* Progress */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-gold">
            {secondsLeft}
          </span>
        </div>

        <p className="text-sm text-dark-gray/50">
          חוזרת לדף הבית בעוד {secondsLeft} שניות
        </p>

        {/* New meal button */}
        <button
          type="button"
          onClick={handleNewMeal}
          aria-label="התחל ארוחה חדשה — חזרה לצ'קליסט"
          className="px-8 py-3 bg-gold text-white font-medium text-base rounded-sm hover:bg-gold/90 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/60"
        >
          ארוחה חדשה
        </button>
      </div>
    </main>
  )
}

// ─── Page export (wrapped in Suspense for useSearchParams) ─────────────────────

export default function CompletePage() {
  return (
    <Suspense fallback={null}>
      <CompleteContent />
    </Suspense>
  )
}
