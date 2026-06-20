'use client'

import { useEffect, useState } from 'react'
import WeeklyBoard from '@/components/WeeklyBoard'

interface Meal {
  id: string
  createdAt: string
  foodChoice: string | null
}

interface Overcome {
  id: string
  createdAt: string
  checklistKey: string
}

function getWeekBounds(): { start: Date; end: Date } {
  const now = new Date()
  // Week starts on Sunday (day 0)
  const dayOfWeek = now.getDay()
  const start = new Date(now)
  start.setDate(now.getDate() - dayOfWeek)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

export default function WeeklyPage() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [overcomes, setOvercomes] = useState<Overcome[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const { start, end } = getWeekBounds()

  useEffect(() => {
    async function load() {
      try {
        const [mealsRes, overcomesRes] = await Promise.all([
          fetch(`/api/meals?from=${start.toISOString()}&to=${end.toISOString()}`),
          fetch(`/api/overcomes?from=${start.toISOString()}&to=${end.toISOString()}`)
        ])
        
        if (!mealsRes.ok || !overcomesRes.ok) throw new Error()
        
        const [mealsData, overcomesData] = await Promise.all([
          mealsRes.json(),
          overcomesRes.json()
        ])
        
        setMeals(mealsData.meals ?? [])
        setOvercomes(overcomesData.overcomes ?? [])
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main
      className="min-h-screen bg-cream py-8 px-4"
      dir="rtl"
      aria-label="יומן שבועי"
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-gold text-center mb-2 tracking-wide">
          יומן שבועי
        </h1>
        <p className="text-sm text-dark-gray/60 text-center mb-8">
          ארוחות השבוע הנוכחי על ציר הזמן
        </p>

        {loading && (
          <p className="text-center text-dark-gray/50 py-12" aria-live="polite">
            טוענת...
          </p>
        )}

        {error && (
          <p className="text-center text-dark-gray/50 py-12" role="alert">
            שגיאה בטעינת הנתונים. נסי לרענן את הדף.
          </p>
        )}

        {!loading && !error && (
          <>
            {meals.length === 0 && overcomes.length === 0 ? (
              <p className="text-center text-dark-gray/50 py-12">
                אין ארוחות או התגברויות רשומות השבוע עדיין.
              </p>
            ) : (
              <WeeklyBoard meals={meals} overcomes={overcomes} weekStart={start} />
            )}
          </>
        )}
      </div>
    </main>
  )
}
