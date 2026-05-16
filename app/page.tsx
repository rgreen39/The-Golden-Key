import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
      <div className="flex flex-col items-center text-center max-w-lg w-full">
        {/* Title */}
        <h1 className="text-5xl font-light tracking-widest text-dark-gray mb-6">
          The Golden Key
        </h1>

        {/* Gold divider */}
        <div className="w-24 h-px bg-gold mb-6" aria-hidden="true" />

        {/* Tagline */}
        <p className="text-xl font-light text-gold tracking-wide mb-4">
          אכילה מודעת, חיים מלאים
        </p>

        {/* Description */}
        <p className="text-base text-dark-gray/70 leading-relaxed mb-12 font-light">
          לפני כל ארוחה — רגע של עצירה, הקשבה לעצמך, ובחירה מתוך אהבה.
          <br />
          שבעה סעיפים קצרים שיעזרו לך להיכנס לארוחה בשמחה ובמודעות.
        </p>

        {/* CTA Button */}
        <Link
          href="/checklist"
          aria-label="עבור לצ'קליסט מרפשזהב — אני רוצה לאכול"
          className="inline-block bg-gold text-cream text-lg font-light tracking-wide px-10 py-4 transition-opacity duration-200 hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream"
        >
          אני רוצה לאכול
        </Link>

        {/* Guide link */}
        <Link
          href="/guide"
          aria-label="קראי את המדריך"
          className="mt-4 text-sm text-dark-gray/50 hover:text-gold transition-colors underline underline-offset-4"
        >
          קראי את המדריך קודם
        </Link>
      </div>
    </main>
  );
}
