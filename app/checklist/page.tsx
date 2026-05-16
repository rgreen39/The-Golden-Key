'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ChecklistItem from '@/components/ChecklistItem'

// ─── Checklist data ────────────────────────────────────────────────────────────

const CHECKLIST_ITEMS = [
  {
    id: 'mem',
    letter: 'מ',
    keyword: 'מים',
    text: 'אולי אני סתם צמאה?',
    expandedContent:
      'אם את לא צמאה, אל תשתי, זה יהרוס לך את העיכול, תשתי בדיוק את הכמות שהגוף שלך מבקש, תסמכי עליו, הוא יבקש כמה שהוא צריך',
  },
  {
    id: 'resh',
    letter: 'ר',
    keyword: 'רוגע',
    text: 'מה קורה איתי? אני נסערת? מבולבלת? מוצפת? איזה אירוע חריג היה בשעות האחרונות?',
    expandedContent: `נסי לתת שם לאירוע
נסי לתת שם לרגש בעקבות האירוע
נסי לבדוק אם את מרגישה את זה איפהשהוא בגוף שלך? (דופק מהיר, זעה, בטן מכווצת, כתפיים תפוסות, כאב ראש עמוק)
קחי לעצמך כמה רגעים רק להרגיש את זה
נשמי עמוק, חמצן טרי, נשפי את המתח החוצה
זה עדיין שם?
אם זה עדיין שם, תנסי לחשוב עם מי את יכולה לדבר על זה?
אוף, היא לא זמינה
אולי את רוצה להגיד כמה מילים לבורא עולם על העניין הזה?
אולי סתם לדבר על זה עם עצמך?
אולי לכתוב משהו קצר, לשרבט את זה על דף ולקרוע אותו לחתיכות?
תשתמשי בשיטה האהובה עלייך להרגע, לפעמים רק חיבוק לעצמך יכול לעשות את העבודה`,
  },
  {
    id: 'pe',
    letter: 'פ',
    keyword: 'פנאי',
    text: 'יש לך משהו דחוף שאת צריכה לעשות עכשיו?',
    expandedContent:
      'אולי זה משהו שאת ממש ממש לא רוצה לעשות? אם כן, פרקי את המשימה שלך לחלקים, קחי לעצמך את החלק הכי קטן של המשימה, והכי נחמד, בצעי אותו עכשיו ותחזרי לצ\'קליסט בהרגשה טובה שהדברים זזים, ואת על זה',
  },
  {
    id: 'shin',
    letter: 'ש',
    keyword: 'שינה',
    text: 'אולי את פשוט מאד מאד עייפה?',
    expandedContent:
      'את עייפה, את פשוט עייפפפפפה. אבל את חייבת לעשות את X ואת Y ולהספיק עוד ועוד....... חייבת??? תהיי מחוייבת קודם כל לעצמך. ואם את צריכה שינה, אז מגיע לך! תטפלי רק במה שקריטי ותכנסי מייד לישון. אם יש משימות קריטיות שמישהו אחר יכול לבצע - תסבירי לו שאת לא מסוגלת ותורידי את זה ממך. פשוט תכנסי לישון מייד לפני שתפלי. מותר לך להכנס לישון גם עם הבגדים! זה הרבה יותר טוב מלגמור את העוגה כולה ולגלות ששום דבר לא התקדם',
  },
  {
    id: 'zayin',
    letter: 'ז',
    keyword: 'זרימה',
    text: 'מה בא לך לעשות עכשיו?',
    expandedContent:
      'אולי את לא באמת רעבה, אולי פשוט בא לך משהו נחמד? מה את אוהבת לעשות, רוצה לנגן, לצייר באקריליק או בשמן? אולי לשיר? לרקוד? לצאת למרפסת לכמה דקות? לקרוא איזה כתבה מעניינת? להכניס כמה דברים לסל קניות אונליין? אולי אפילו איזה משחק בגיימבוי או צפייה בקליפ מצחיק שקיבלת? תעשי משהו שמשמח אותך, כי מגיע לך להיות שמחה, ה\' אוהב אותך שמחה, וכל המטלות הדחופות - יחכו, כי עכשיו את קודמת להכל, את מחוייבת לעצמך, אוהבת את עצמך, ורוצה לפנק את עצמך',
  },
  {
    id: 'he',
    letter: 'ה',
    keyword: 'הגדרת כמות',
    text: '!זהו, עברת על הכל, תארגני לעצמך צלחת מפנקת',
    expandedContent: undefined,
  },
  {
    id: 'bet',
    letter: 'ב',
    keyword: 'בתאבון',
    text: 'מה מתחשק לך לאכול עכשיו?',
    expandedContent:
      'מה מתחשק לך? סלט בריא עם תוספות? ארוחה מבושלת טעימה? לחם עם שוקולד? עוגה משבת? פשוט תקשיבי לעצמך ותלכי עם זה. אם חסרים לך מצרכים תרשמי על המקרר אלו מצרכים לקנות כדי שתוכלי להתארגן עם זה לפעם הבאה. אם חסר לך זמן ופניות כדי להכין את מה שמתחשק לך, תנסי לחשוב איך תוכלי למצוא את הזמן להכין אוכל כזה לפעם הבאה (אולי עם ההכנות של שבת ולהקפיא? אולי בערב, או מוקדם בבוקר? אולי תוך כדי עם הילדים). תני כבוד גדול למה שהגוף שלך מבקש. הוא ראוי לזה, את ראויה לזה, את מחוייבת לעצמך לפני הכל. אם היית מאושפזת בבית חולים איכשהו היו מסתדרים כולם. אל תלכי בכיוון הזה, תלכי בכיוון של התחזקות, מילוי עצמי, מחוייבות כבוד ואהבה לעצמך, כשתהיי קודמת להכל, תהיי מלאה, לא תצטרכי להתאמץ כדי לתת, זה פשוט יזרום ממך הלאה, באהבה',
  },
]

// ─── Page component ────────────────────────────────────────────────────────────

export default function ChecklistPage() {
  const router = useRouter()

  // Checklist state
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(CHECKLIST_ITEMS.map((item) => [item.id, false]))
  )

  // Input fields
  const [shopping, setShopping] = useState('')
  const [dream, setDream] = useState('')
  const [foodChoice, setFoodChoice] = useState('')

  // Save status indicators
  const [shoppingSaved, setShoppingSaved] = useState(false)
  const [dreamSaved, setDreamSaved] = useState(false)

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── Toggle checkbox ─────────────────────────────────────────────────────────
  const handleToggle = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const allChecked = CHECKLIST_ITEMS.every((item) => checked[item.id])

  // ── Submit meal ─────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodChoice }),
      })
      // Navigate to completion screen, passing foodChoice via query
      const params = new URLSearchParams()
      if (foodChoice) params.set('food', foodChoice)
      router.push(`/checklist/complete?${params.toString()}`)
    } catch {
      setIsSubmitting(false)
    }
  }, [foodChoice, isSubmitting, router])

  return (
    <main
      className="min-h-screen bg-cream py-8 px-4"
      dir="rtl"
      aria-label="צ'קליסט מרפשזהב"
    >
      <div className="max-w-2xl mx-auto">
        {/* Page title */}
        <h1 className="text-2xl font-semibold text-gold text-center mb-2 tracking-wide">
          מרפש זהב
        </h1>
        <p className="text-sm text-dark-gray/60 text-center mb-8">
          בדקי את עצמך לפני הארוחה
        </p>

        {/* Checklist items */}
        <div
          className="flex flex-col gap-2"
          role="group"
          aria-label="סעיפי הצ'קליסט"
        >
          {CHECKLIST_ITEMS.map((item) => (
            <ChecklistItem
              key={item.id}
              letter={item.letter}
              keyword={item.keyword}
              text={item.text}
              expandedContent={item.expandedContent}
              checked={checked[item.id]}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>

        {/* Extra fields below סעיף ב */}
        <div className="mt-4 flex flex-col gap-3">
          {/* Shopping field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="shopping-input" className="text-sm font-medium text-dark-gray">
              מצרכים שחסרים לי:
            </label>
            <div className="flex gap-2">
              <textarea
                id="shopping-input"
                value={shopping}
                onChange={(e) => setShopping(e.target.value)}
                rows={2}
                placeholder="רשמי מצרכים חסרים..."
                aria-label="מצרכים שחסרים לי"
                className="flex-1 px-3 py-2 text-sm bg-white border border-gold/30 rounded-sm text-dark-gray placeholder-dark-gray/40 focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none leading-relaxed"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!shopping.trim()) return
                  await fetch('/api/shopping', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: shopping }),
                  })
                  setShopping('')
                  setShoppingSaved(true)
                  setTimeout(() => setShoppingSaved(false), 2000)
                }}
                className="px-3 py-1 text-xs bg-gold text-white rounded-sm hover:bg-gold/90 transition-colors self-end"
                aria-label="שמור מצרכים"
              >
                {shoppingSaved ? '✓' : 'שמור'}
              </button>
            </div>
          </div>

          {/* Dream food field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="dream-input" className="text-sm font-medium text-dark-gray">
              האוכל שאני חולמת שיהיה לי עכשיו:
            </label>
            <div className="flex gap-2">
              <textarea
                id="dream-input"
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                rows={2}
                placeholder="מה את חולמת לאכול..."
                aria-label="האוכל שאני חולמת שיהיה לי עכשיו"
                className="flex-1 px-3 py-2 text-sm bg-white border border-gold/30 rounded-sm text-dark-gray placeholder-dark-gray/40 focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none leading-relaxed"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!dream.trim()) return
                  await fetch('/api/dreams', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: dream }),
                  })
                  setDream('')
                  setDreamSaved(true)
                  setTimeout(() => setDreamSaved(false), 2000)
                }}
                className="px-3 py-1 text-xs bg-gold text-white rounded-sm hover:bg-gold/90 transition-colors self-end"
                aria-label="שמור אוכל חלום"
              >
                {dreamSaved ? '✓' : 'שמור'}
              </button>
            </div>
          </div>
        </div>

        {/* Completion section — shown only when all 7 items are checked */}
        {allChecked && (
          <div
            className="mt-4 p-4 bg-white border border-gold/30 rounded-lg flex flex-col gap-3"
            role="region"
            aria-label="סיום הצ'קליסט"
            aria-live="polite"
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="food-choice-input"
                className="text-sm font-medium text-dark-gray"
              >
                בחרתי לאכול:
              </label>
              <input
                id="food-choice-input"
                type="text"
                value={foodChoice}
                onChange={(e) => setFoodChoice(e.target.value)}
                placeholder="מה בחרת לאכול?"
                aria-label="בחרתי לאכול"
                className="w-full px-3 py-2 text-sm bg-cream border border-gold/30 rounded-sm text-dark-gray placeholder-dark-gray/40 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => router.push('/not-eating')}
                aria-label="בסוף לא — חזרה לדף הבית"
                className="flex-1 py-3 border border-dark-gray/30 text-dark-gray/60 font-medium text-sm rounded-sm hover:border-dark-gray/50 hover:text-dark-gray transition-colors focus:outline-none focus:ring-2 focus:ring-dark-gray/20 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                בסוף לא
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                aria-label="אני מוכנה להנות מהשפע — שמור ארוחה ועבור למסך הסיום"
                className="flex-1 py-3 bg-gold text-white font-medium text-sm rounded-sm hover:bg-gold/90 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/60 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 8L6.5 12.5L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isSubmitting ? 'שומרת...' : 'אני מוכנה להנות מהשפע'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
