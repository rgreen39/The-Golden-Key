'use client'

import { useEffect, useRef, useState } from 'react'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

export default function DreamsPage() {
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const initialLoadDone = useRef(false)

  const debouncedContent = useDebounce(content, 800)

  // Load saved value
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/dreams')
        if (res.ok) {
          const data = await res.json()
          setContent(data.content ?? '')
        }
      } catch {
        // Non-critical
      } finally {
        setLoading(false)
        initialLoadDone.current = true
      }
    }
    load()
  }, [])

  // Auto-save on debounced change
  useEffect(() => {
    if (!initialLoadDone.current) return
    async function save() {
      try {
        const res = await fetch('/api/dreams', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: debouncedContent }),
        })
        if (res.ok) {
          setSaved(true)
          setTimeout(() => setSaved(false), 2000)
        }
      } catch {
        // Non-critical
      }
    }
    save()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent])

  return (
    <main
      className="min-h-screen bg-cream py-8 px-4"
      dir="rtl"
      aria-label="תפריט חלומות"
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gold text-center mb-2 tracking-wide">
          תפריט חלומות
        </h1>
        <p className="text-sm text-dark-gray/60 text-center mb-8">
          האוכל שאת חולמת עליו
        </p>

        {loading ? (
          <p className="text-center text-dark-gray/50 py-12" aria-live="polite">
            טוענת...
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="dreams-content"
              className="text-sm font-medium text-dark-gray"
            >
              האוכל שאני חולמת שיהיה לי:
            </label>
            <div className="relative">
              <textarea
                id="dreams-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder="מה את חולמת לאכול..."
                aria-label="תפריט חלומות — האוכל שאני חולמת עליו"
                className="w-full px-4 py-3 text-sm bg-white border border-gold/30 rounded-sm text-dark-gray placeholder-dark-gray/40 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 resize-none leading-relaxed"
              />
              {saved && (
                <span
                  className="absolute left-3 bottom-3 text-xs text-gold/70"
                  aria-live="polite"
                  role="status"
                >
                  נשמר ✓
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
