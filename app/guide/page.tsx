import Link from 'next/link'

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-cream py-12 px-6" dir="rtl">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light text-gold tracking-wide mb-3">
            המדריך שלך
          </h1>
          <div className="w-16 h-px bg-gold mx-auto" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 text-dark-gray leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gold mb-2">החלום שלך — להיות רזה, לא?</h2>
            <p className="text-base font-light">
              להיות רזה זה לא רק גיזרה, זה תפיסה אחרת.
            </p>
            <p className="mt-2 text-base font-light">
              תפיסה שאני ראויה, ראויה לשפע ופינוק, ומה שמעיק ועודף לא ייכנס אלי.
            </p>
            <p className="mt-2 text-base font-light">
              להיות רזה זה תפיסה שאוכל פותר רעב — הוא גם משמח ומרגיע, אבל כבונוס ולא כמטרה.
            </p>
          </section>

          <div className="w-full h-px bg-gold/20" aria-hidden="true" />

          <section>
            <h2 className="text-lg font-semibold text-gold mb-2">ללמוד להנות מהשפע</h2>
            <p className="text-base font-light">
              להיות רזה זה להנות מכל ביס — הרעב הוא התבלין הכי טוב לאוכל.
            </p>
            <p className="mt-2 text-base font-light">
              תלמדי להרגיש רעב, תלמדי שהרעב שלך ראוי למענה שמכבד אותך.
            </p>
            <p className="mt-2 text-base font-light">
              תלמדי להנות באמת מהשפע של הבורא, ותהיי רזה בע"ה.
            </p>
          </section>

          <div className="w-full h-px bg-gold/20" aria-hidden="true" />

          <section>
            <h2 className="text-lg font-semibold text-gold mb-2">איך להשתמש במערכת</h2>
            <ul className="flex flex-col gap-3 text-base font-light">
              <li className="flex gap-2">
                <span className="text-gold shrink-0">•</span>
                <span>השתמשי במערכת בכל פעם שעולה לך מחשבה או רגש — "בא לי לאכול". אם המערכת לא זמינה, עשי את זה בעל פה.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold shrink-0">•</span>
                <span>עברי סעיף סעיף כדי לוודא שאת פותרת רעב ולא מעיקה על עצמך עם עודפים מיותרים.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold shrink-0">•</span>
                <span>אם אחרי פתרון של סעיף כלשהו את כבר לא רוצה לאכול — לחצי על <strong>"בסוף לא"</strong>.</span>
              </li>
            </ul>
          </section>

          <div className="w-full h-px bg-gold/20" aria-hidden="true" />

          <section>
            <h2 className="text-lg font-semibold text-gold mb-2">רשימת החלומות שלך</h2>
            <ul className="flex flex-col gap-3 text-base font-light">
              <li className="flex gap-2">
                <span className="text-gold shrink-0">•</span>
                <span>לקראת הסוף — אם יש משהו שאת חולמת עליו והוא לא זמין, רשמי אותו לפעמים הבאות, כדי שתוכלי לעזור לעצמך להנות מהשפע בהמשך.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold shrink-0">•</span>
                <span>עייני מדי פעם ברשימת המצרכים והמאכלים שאת חולמת עליהם.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold shrink-0">•</span>
                <span>היי יצירתית — איך ומאיפה את יכולה להשיג אותם, או למצוא זמן להכין אותם.</span>
              </li>
            </ul>
          </section>

          <div className="w-full h-px bg-gold/20" aria-hidden="true" />

          <section className="text-center py-4">
            <p className="text-base font-light text-dark-gray/80 leading-loose">
              כשברור לך שאת ראויה לכל הטוב הזה, ומה עושה לך טוב —
              <br />
              <strong className="text-gold font-medium">כל השאר יסתדר מאליו בעזרת ה׳.</strong>
            </p>
          </section>

        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/checklist"
            className="inline-block bg-gold text-cream px-10 py-3 text-sm font-medium tracking-wide hover:opacity-85 transition-opacity focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
            aria-label="עברי לצ'קליסט"
          >
            אני מוכנה — קחי אותי לצ׳קליסט
          </Link>
        </div>

      </div>
    </main>
  )
}
