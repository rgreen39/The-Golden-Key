'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'register'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('מייל או סיסמה שגויים')
    } else {
      router.push('/checklist')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'שגיאה בהרשמה')
      setLoading(false)
      return
    }

    // Auto sign in after registration
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('ההרשמה הצליחה אך הכניסה נכשלה — נסי להתחבר')
      setMode('signin')
    } else {
      router.push('/checklist')
    }
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">

        {/* Title */}
        <div className="mb-10">
          <h1 className="text-5xl font-light text-dark-gray tracking-widest mb-3">
            מרפש זהב
          </h1>
          <div className="mx-auto mb-4 w-12 h-px bg-gold" aria-hidden="true" />
          <p className="text-base text-dark-gray/60 font-light">
            אכילה מודעת, חיים מלאים
          </p>
        </div>

        {/* Card */}
        <div className="bg-white px-8 py-10" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>

          {/* Mode toggle */}
          <div className="flex mb-8 border-b border-gold/20">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError('') }}
              className={`flex-1 pb-2 text-sm transition-colors ${mode === 'signin' ? 'text-gold border-b-2 border-gold font-medium' : 'text-dark-gray/50 hover:text-dark-gray'}`}
            >
              כניסה
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError('') }}
              className={`flex-1 pb-2 text-sm transition-colors ${mode === 'register' ? 'text-gold border-b-2 border-gold font-medium' : 'text-dark-gray/50 hover:text-dark-gray'}`}
            >
              הרשמה
            </button>
          </div>

          <form onSubmit={mode === 'signin' ? handleSignIn : handleRegister} className="flex flex-col gap-4">

            {mode === 'register' && (
              <div className="text-right">
                <label htmlFor="name" className="block text-xs text-dark-gray/60 mb-1">
                  שם (אופציונלי)
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="השם שלך"
                  className="w-full border border-gold/30 bg-cream px-3 py-2 text-sm text-dark-gray placeholder:text-dark-gray/30 focus:outline-none focus:border-gold transition-colors"
                  dir="rtl"
                />
              </div>
            )}

            <div className="text-right">
              <label htmlFor="email" className="block text-xs text-dark-gray/60 mb-1">
                כתובת מייל
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full border border-gold/30 bg-cream px-3 py-2 text-sm text-dark-gray placeholder:text-dark-gray/30 focus:outline-none focus:border-gold transition-colors"
                dir="ltr"
              />
            </div>

            <div className="text-right">
              <label htmlFor="password" className="block text-xs text-dark-gray/60 mb-1">
                סיסמה {mode === 'register' && <span className="text-dark-gray/40">(לפחות 6 תווים)</span>}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                required
                className="w-full border border-gold/30 bg-cream px-3 py-2 text-sm text-dark-gray placeholder:text-dark-gray/30 focus:outline-none focus:border-gold transition-colors"
                dir="ltr"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-right" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-cream py-3 text-sm font-medium tracking-wide hover:opacity-85 transition-opacity disabled:opacity-50 mt-2"
              aria-label={mode === 'signin' ? 'כניסה לחשבון' : 'יצירת חשבון חדש'}
            >
              {loading ? 'רגע...' : mode === 'signin' ? 'כניסה' : 'יצירת חשבון'}
            </button>
          </form>
        </div>

        <p className="mt-8 text-xs text-dark-gray/35 font-light">
          הנתונים שלך שמורים בצורה מאובטחת
        </p>
      </div>
    </main>
  )
}
