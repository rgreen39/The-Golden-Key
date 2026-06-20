'use client'

import { useState } from 'react'

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

interface WeeklyBoardProps {
  meals: Meal[]
  overcomes: Overcome[]
  weekStart: Date
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const HOUR_START = 6   // 06:00
const HOUR_END = 24    // 24:00
const TOTAL_HOURS = HOUR_END - HOUR_START  // 18 hours

const HEBREW_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

const CHECKLIST_NAMES: Record<string, string> = {
  mem: 'מים',
  resh: 'רוגע',
  pe: 'פנאי',
  shin: 'שינה',
  zayin: 'זרימה',
  he: 'הגדרת כמות',
  bet: 'בתאבון',
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getYPercent(date: Date): number {
  const hours = date.getHours() + date.getMinutes() / 60
  const clamped = Math.max(HOUR_START, Math.min(HOUR_END, hours))
  return ((clamped - HOUR_START) / TOTAL_HOURS) * 100
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' })
}

// ─── Overcome Tooltip ──────────────────────────────────────────────────────────

interface OvercomeTooltipProps {
  overcome: Overcome
  onClose: () => void
}

function OvercomeTooltip({ overcome, onClose }: OvercomeTooltipProps) {
  const date = new Date(overcome.createdAt)
  const checklistName = CHECKLIST_NAMES[overcome.checklistKey] || overcome.checklistKey
  return (
    <div
      className="absolute z-20 bg-amber-50 border border-gold/60 rounded-lg shadow-lg p-3 text-right min-w-[160px] text-sm"
      style={{ top: '110%', right: '50%', transform: 'translateX(50%)' }}
      role="tooltip"
      aria-label="פרטי התגברות"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="סגור פרטי התגברות"
        className="absolute top-1 left-1 text-dark-gray/40 hover:text-gold text-xs focus:outline-none"
      >
        ✕
      </button>
      <p className="font-bold text-gold mb-1">⚖️ התגברות</p>
      <p className="font-medium text-dark-gray mb-1">{formatDate(date)}</p>
      <p className="text-dark-gray/70 mb-1">{formatTime(date)}</p>
      <p className="text-dark-gray/80 border-t border-gold/20 pt-1 mt-1">
        סעיף: {checklistName}
      </p>
    </div>
  )
}

// ─── Meal Tooltip ──────────────────────────────────────────────────────────────

interface TooltipProps {
  meal: Meal
  onClose: () => void
}

function MealTooltip({ meal, onClose }: TooltipProps) {
  const date = new Date(meal.createdAt)
  return (
    <div
      className="absolute z-20 bg-white border border-gold/40 rounded-lg shadow-lg p-3 text-right min-w-[160px] text-sm"
      style={{ top: '110%', right: '50%', transform: 'translateX(50%)' }}
      role="tooltip"
      aria-label="פרטי ארוחה"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="סגור פרטי ארוחה"
        className="absolute top-1 left-1 text-dark-gray/40 hover:text-gold text-xs focus:outline-none"
      >
        ✕
      </button>
      <p className="font-medium text-dark-gray mb-1">{formatDate(date)}</p>
      <p className="text-dark-gray/70 mb-1">{formatTime(date)}</p>
      {meal.foodChoice && (
        <p className="text-dark-gray/80 border-t border-gold/20 pt-1 mt-1">
          {meal.foodChoice}
        </p>
      )}
    </div>
  )
}

// ─── Overcome dot ──────────────────────────────────────────────────────────────

interface OvercomeDotProps {
  overcome: Overcome
}

function OvercomeDot({ overcome }: OvercomeDotProps) {
  const [open, setOpen] = useState(false)
  const date = new Date(overcome.createdAt)
  const yPercent = getYPercent(date)
  const checklistName = CHECKLIST_NAMES[overcome.checklistKey] || overcome.checklistKey

  return (
    <div
      className="absolute"
      style={{ top: `${yPercent}%`, left: '25%', transform: 'translate(-50%, -50%)' }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`התגברות בשעה ${formatTime(date)}: ${checklistName}`}
        aria-expanded={open}
        className="w-3 h-3 rounded-full bg-amber-400 border-2 border-white shadow hover:scale-125 transition-transform focus:outline-none focus:ring-2 focus:ring-amber-400/60"
        title="⚖️ התגברות"
      />
      {open && <OvercomeTooltip overcome={overcome} onClose={() => setOpen(false)} />}
    </div>
  )
}

// ─── Meal dot ──────────────────────────────────────────────────────────────────

interface MealDotProps {
  meal: Meal
}

function MealDot({ meal }: MealDotProps) {
  const [open, setOpen] = useState(false)
  const date = new Date(meal.createdAt)
  const yPercent = getYPercent(date)

  return (
    <div
      className="absolute"
      style={{ top: `${yPercent}%`, left: '50%', transform: 'translate(-50%, -50%)' }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`ארוחה בשעה ${formatTime(date)}${meal.foodChoice ? ': ' + meal.foodChoice : ''}`}
        aria-expanded={open}
        className="w-3 h-3 rounded-full bg-gold border-2 border-white shadow hover:scale-125 transition-transform focus:outline-none focus:ring-2 focus:ring-gold/60"
      />
      {open && <MealTooltip meal={meal} onClose={() => setOpen(false)} />}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function WeeklyBoard({ meals, overcomes, weekStart }: WeeklyBoardProps) {
  const days = getWeekDays(weekStart)

  // Hour labels on the Y axis
  const hourLabels = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => HOUR_START + i)

  return (
    <div
      className="w-full overflow-x-auto"
      role="region"
      aria-label="לוח ארוחות והתגברויות שבועי"
    >
      {/* Legend */}
      <div className="flex gap-4 justify-center mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gold border-2 border-white shadow"></div>
          <span className="text-dark-gray/70">ארוחה</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400 border-2 border-white shadow"></div>
          <span className="text-dark-gray/70">התגברות (⚖️ אונקיה)</span>
        </div>
      </div>

      <div className="min-w-[600px]">
        {/* Header row — day names */}
        <div className="flex">
          {/* Y-axis label column */}
          <div className="w-12 shrink-0" aria-hidden="true" />
          {days.map((day, i) => (
            <div
              key={i}
              className="flex-1 text-center text-xs font-medium text-dark-gray/70 pb-2 border-b border-gold/20"
            >
              <span className="block">{HEBREW_DAYS[day.getDay()]}</span>
              <span className="block text-dark-gray/50">{formatDate(day)}</span>
            </div>
          ))}
        </div>

        {/* Grid body */}
        <div className="flex">
          {/* Y-axis hour labels */}
          <div className="w-12 shrink-0 relative" style={{ height: `${TOTAL_HOURS * 40}px` }}>
            {hourLabels.map((h) => (
              <div
                key={h}
                className="absolute text-xs text-dark-gray/40 leading-none"
                style={{ top: `${((h - HOUR_START) / TOTAL_HOURS) * 100}%`, transform: 'translateY(-50%)' }}
                aria-hidden="true"
              >
                {String(h).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day, i) => {
            const dayMeals = meals.filter((m) => isSameDay(new Date(m.createdAt), day))
            const dayOvercomes = overcomes.filter((o) => isSameDay(new Date(o.createdAt), day))
            return (
              <div
                key={i}
                className="flex-1 relative border-r border-gold/10 last:border-r-0"
                style={{ height: `${TOTAL_HOURS * 40}px` }}
                aria-label={`${HEBREW_DAYS[day.getDay()]} ${formatDate(day)}`}
              >
                {/* Hour grid lines */}
                {hourLabels.map((h) => (
                  <div
                    key={h}
                    className="absolute w-full border-t border-gold/10"
                    style={{ top: `${((h - HOUR_START) / TOTAL_HOURS) * 100}%` }}
                    aria-hidden="true"
                  />
                ))}

                {/* Overcome dots */}
                {dayOvercomes.map((overcome) => (
                  <OvercomeDot key={overcome.id} overcome={overcome} />
                ))}

                {/* Meal dots */}
                {dayMeals.map((meal) => (
                  <MealDot key={meal.id} meal={meal} />
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
