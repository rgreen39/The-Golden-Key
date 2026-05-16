'use client'

import { useEffect, useRef, useState } from 'react'

interface WeightEntry {
  id: string
  weight: number
  createdAt: string
}

interface WeightModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

export default function WeightModal({ isOpen, onClose, onSaved }: WeightModalProps) {
  const [weight, setWeight] = useState('')
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return
    inputRef.current?.focus()
    // Load history
    fetch('/api/weight').then(r => r.json()).then(d => setEntries(d.entries ?? []))
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const handleSave = async () => {
    const val = parseFloat(weight.replace(',', '.'))
    if (isNaN(val) || val < 20 || val > 300) {
      setError('אנא הכניסי משקל תקין (בין 20 ל-300 ק"ג)')
      return
    }
    setSaving(true)
    setError('')
    const res = await fetch('/api/weight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weight: val }),
    })
    if (res.ok) {
      const newEntry = await res.json()
      setEntries(prev => [...prev, newEntry])
      setWeight('')
      onSaved()
    } else {
      setError('שגיאה בשמירה')
    }
    setSaving(false)
  }

  if (!isOpen) return null

  // Build chart data
  const chartEntries = entries.slice(-12) // last 12 entries
  const weights = chartEntries.map(e => e.weight)
  const minW = Math.min(...weights) - 2
  const maxW = Math.max(...weights) + 2
  const range = maxW - minW || 1
  const chartH = 120
  const chartW = 280

  const points = chartEntries.map((e, i) => {
    const x = chartEntries.length === 1 ? chartW / 2 : (i / (chartEntries.length - 1)) * chartW
    const y = chartH - ((e.weight - minW) / range) * chartH
    return { x, y, entry: e }
  })

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="הזנת משקל">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark-gray/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div className="relative z-10 bg-cream border border-gold/40 rounded-lg shadow-xl max-w-sm w-full p-6 text-right max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button type="button" onClick={onClose} aria-label="סגור" className="text-dark-gray/50 hover:text-gold transition-colors focus:outline-none">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <h2 className="text-gold font-semibold text-lg">הזנת משקל</h2>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !weight}
            className="px-4 py-2 bg-gold text-white text-sm rounded-sm hover:bg-gold/90 transition-colors disabled:opacity-50 shrink-0"
          >
            {saving ? '...' : 'שמור'}
          </button>
          <input
            ref={inputRef}
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder='משקל בק"ג'
            min={20}
            max={300}
            step={0.1}
            aria-label='הזיני משקל בק"ג'
            className="flex-1 px-3 py-2 text-sm bg-white border border-gold/30 rounded-sm text-dark-gray text-right focus:outline-none focus:ring-2 focus:ring-gold/40"
            dir="ltr"
          />
        </div>

        {error && <p className="text-red-500 text-xs mb-3 text-right" role="alert">{error}</p>}

        {/* Chart */}
        {entries.length >= 2 && (
          <div className="mt-4">
            <p className="text-xs text-dark-gray/60 mb-2 font-medium">היסטוריית משקל</p>
            <svg width={chartW} height={chartH + 20} className="w-full" viewBox={`0 0 ${chartW} ${chartH + 20}`} aria-label="גרף משקל">
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map(t => (
                <line key={t} x1={0} y1={chartH * t} x2={chartW} y2={chartH * t} stroke="#C9A84C" strokeOpacity={0.15} strokeWidth={1} />
              ))}
              {/* Line */}
              <polyline points={polyline} fill="none" stroke="#C9A84C" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              {/* Dots + labels */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={4} fill="#C9A84C" />
                  <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize={9} fill="#2D2D2D" opacity={0.7}>
                    {p.entry.weight}
                  </text>
                </g>
              ))}
              {/* Date labels */}
              {points.map((p, i) => (
                <text key={i} x={p.x} y={chartH + 14} textAnchor="middle" fontSize={8} fill="#2D2D2D" opacity={0.5}>
                  {new Date(p.entry.createdAt).toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' })}
                </text>
              ))}
            </svg>

            {/* Trend */}
            {entries.length >= 2 && (() => {
              const diff = entries[entries.length - 1].weight - entries[0].weight
              const sign = diff < 0 ? '↓' : diff > 0 ? '↑' : '='
              const color = diff < 0 ? 'text-green-600' : diff > 0 ? 'text-red-500' : 'text-dark-gray/60'
              return (
                <p className={`text-xs mt-2 text-right font-medium ${color}`}>
                  {sign} {Math.abs(diff).toFixed(1)} ק"ג מאז ההתחלה
                </p>
              )
            })()}
          </div>
        )}

        {entries.length === 1 && (
          <p className="text-xs text-dark-gray/50 mt-3 text-right">הגרף יופיע לאחר הזנה נוספת</p>
        )}
      </div>
    </div>
  )
}
