'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function NotEatingPage() {
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => router.push('/'), 6000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [router])

  return (
    <main
      className="fixed inset-0 bg-cream flex flex-col items-center justify-center"
      dir="rtl"
      aria-label="מצאת את המפתח ללב שלך"
    >
      {/* Key + heart animation */}
      <div className="flex flex-col items-center gap-8">

        {/* Animated SVG */}
        <svg
          viewBox="0 0 160 200"
          width="200"
          height="250"
          aria-hidden="true"
          className="drop-shadow-sm"
        >
          {/* Heart */}
          <path
            d="M80 170 C80 170 20 125 20 75 C20 48 40 35 58 42 C68 46 80 60 80 60 C80 60 92 46 102 42 C120 35 140 48 140 75 C140 125 80 170 80 170Z"
            fill="#C9A84C"
            opacity="0.15"
            style={{ animation: 'heartOpen 2s ease-in-out infinite' }}
          />
          <path
            d="M80 170 C80 170 20 125 20 75 C20 48 40 35 58 42 C68 46 80 60 80 60 C80 60 92 46 102 42 C120 35 140 48 140 75 C140 125 80 170 80 170Z"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="2.5"
            style={{ animation: 'heartOpen 2s ease-in-out infinite' }}
          />

          {/* Key — descending into heart */}
          <g style={{ animation: 'keyDescend 2s ease-in-out infinite', transformOrigin: '80px 40px' }}>
            {/* Key ring */}
            <circle cx="80" cy="28" r="16" fill="none" stroke="#C9A84C" strokeWidth="3" />
            <circle cx="80" cy="28" r="7" fill="#C9A84C" />
            {/* Key shaft */}
            <rect x="78" y="42" width="4" height="55" rx="2" fill="#C9A84C" />
            {/* Key teeth */}
            <rect x="82" y="68" width="10" height="4" rx="1.5" fill="#C9A84C" />
            <rect x="82" y="80" width="7" height="4" rx="1.5" fill="#C9A84C" />
            <rect x="82" y="92" width="10" height="4" rx="1.5" fill="#C9A84C" />
          </g>

          {/* Sparkles */}
          {[
            { cx: 30, cy: 50, r: 2.5, delay: '0s' },
            { cx: 130, cy: 55, r: 2, delay: '0.4s' },
            { cx: 25, cy: 100, r: 1.5, delay: '0.8s' },
            { cx: 135, cy: 95, r: 2, delay: '0.2s' },
            { cx: 80, cy: 185, r: 1.5, delay: '0.6s' },
          ].map((s, i) => (
            <circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="#C9A84C"
              style={{ animation: `sparkle 2s ease-in-out ${s.delay} infinite` }}
            />
          ))}
        </svg>

        {/* Text */}
        <div className="text-center flex flex-col gap-2">
          <p className="text-2xl font-light text-gold tracking-wide">
            מצאת את המפתח ללב שלך
          </p>
          <p className="text-sm text-dark-gray/40 font-light">חוזרת לדף הבית...</p>
        </div>
      </div>

      <style>{`
        @keyframes keyDescend {
          0%   { transform: translateY(-8px) rotate(-8deg); opacity: 0.7; }
          50%  { transform: translateY(8px) rotate(0deg);  opacity: 1; }
          100% { transform: translateY(-8px) rotate(-8deg); opacity: 0.7; }
        }
        @keyframes heartOpen {
          0%, 100% { transform: scale(1);    opacity: 0.15; }
          50%       { transform: scale(1.06); opacity: 0.25; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0;   transform: scale(0.5); }
          50%       { opacity: 0.8; transform: scale(1.2); }
        }
      `}</style>
    </main>
  )
}
