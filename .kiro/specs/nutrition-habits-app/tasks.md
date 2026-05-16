# משימות יישום — מרפש זהב

## משימות

- [x] 1. הקמת פרויקט Next.js עם TypeScript ו-Tailwind
  - [x] 1.1 יצירת פרויקט Next.js 14 עם App Router ו-TypeScript
  - [x] 1.2 הגדרת Tailwind CSS עם תמיכה ב-RTL
  - [x] 1.3 הוספת גופן Heebo מ-Google Fonts
  - [x] 1.4 הגדרת `dir="rtl"` ב-layout.tsx
  - [x] 1.5 הגדרת פלטת צבעים (שמנת, זהב, אפור כהה) ב-tailwind.config

- [x] 2. הגדרת DB עם Prisma ו-PostgreSQL
  - [x] 2.1 התקנת Prisma ו-@prisma/client
  - [x] 2.2 יצירת schema.prisma עם מודלים: User, Meal, ShoppingItem, DreamFood, Fall
  - [x] 2.3 הגדרת חיבור ל-PostgreSQL דרך DATABASE_URL ב-.env
  - [x] 2.4 הרצת `prisma migrate dev` ליצירת הטבלאות
  - [x] 2.5 יצירת קובץ lib/prisma.ts עם singleton client

- [x] 3. הגדרת אימות Google OAuth עם NextAuth.js
  - [x] 3.1 התקנת next-auth ו-@auth/prisma-adapter
  - [x] 3.2 יצירת /app/api/auth/[...nextauth]/route.ts עם Google Provider
  - [x] 3.3 הגדרת GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET ב-.env
  - [x] 3.4 יצירת SessionProvider wrapper ב-layout.tsx
  - [x] 3.5 יצירת middleware.ts להגנה על routes מוגנים
  - [x] 3.6 יצירת דף התחברות /app/auth/signin/page.tsx עם כפתור "התחבר עם Google"

- [x] 4. יצירת Navbar וסרגל ניווט
  - [x] 4.1 יצירת רכיב Navbar.tsx עם לינקים: אני רוצה לאכול | יומן שבועי | רשימת קניות | תפריט חלומות | 7 יפול צדיק
  - [x] 4.2 הוספת כפתור התחברות/התנתקות עם תמונת פרופיל Google
  - [x] 4.3 עיצוב Navbar: רקע שמנת, גופן אלגנטי, ללא אייקונים מיותרים
  - [x] 4.4 הוספת Navbar ל-layout.tsx הראשי

- [x] 5. יצירת דף הבית
  - [x] 5.1 יצירת /app/page.tsx עם כותרת "מרפש זהב"
  - [x] 5.2 עיצוב דף הבית עם רקע מתאים לאווירה
  - [x] 5.3 הוספת כפתור "אני רוצה לאכול" המנווט ל-/checklist

- [x] 6. יצירת רכיב ChecklistItem
  - [x] 6.1 יצירת רכיב ChecklistItem.tsx עם props: letter, text, expandedContent, checked, onToggle
  - [x] 6.2 יישום תיבת סימון עם אינדיקציה ויזואלית ברורה למצב מסומן
  - [x] 6.3 יישום פאנל הרחבה (accordion) עם אנימציית פתיחה/סגירה
  - [x] 6.4 הוספת aria-label לנגישות מלאה

- [x] 7. יצירת דף הצ'קליסט
  - [x] 7.1 יצירת /app/checklist/page.tsx
  - [x] 7.2 הגדרת נתוני 7 הסעיפים (מ,ר,פ,ש,ז,ה,ב) עם טקסטים מדויקים ותכני הרחבה
  - [x] 7.3 ניהול state של סימון הסעיפים עם useState
  - [x] 7.4 הצגת שני שדות קלט מתחת לסעיף ב: "מצרכים שחסרים לי:" ו"האוכל שאני חולמת שיהיה לי עכשיו:"
  - [x] 7.5 הצגת שדה "בחרתי לאכול:" וכפתור "אני מוכנה להנות מהשפע" כשכל 7 סעיפים מסומנים
  - [x] 7.6 שמירה אוטומטית של שדות מצרכים ואוכל חלום עם debounce 800ms

- [x] 8. יצירת API routes לשדות מצרכים ואוכל חלום
  - [x] 8.1 יצירת /app/api/shopping/route.ts עם GET ו-PUT
  - [x] 8.2 יצירת /app/api/dreams/route.ts עם GET ו-PUT
  - [x] 8.3 הגנה על routes עם getServerSession()
  - [x] 8.4 טעינת ערכים שמורים בטעינת דף הצ'קליסט

- [x] 9. יצירת API route לשמירת ארוחות ומסך הסיום
  - [x] 9.1 יצירת /app/api/meals/route.ts עם GET ו-POST
  - [x] 9.2 שמירת ארוחה ב-DB בלחיצה על "אני מוכנה להנות מהשפע" (תאריך, שעה, מה נבחר לאכול)
  - [x] 9.3 יצירת /app/checklist/complete/page.tsx עם טקסט "פותח את ידך ומשביע לכל חי רצון"
  - [x] 9.4 יצירת אנימציית לבבות ברקע (CSS animation)
  - [x] 9.5 יישום טיימר 10 שניות עם useEffect ו-redirect אוטומטי לדף הבית
  - [x] 9.6 הוספת כפתור "ארוחה חדשה" שמבטל הטיימר ומנווט לצ'קליסט

- [x] 10. יצירת הלוח השבועי
  - [x] 10.1 יצירת /app/weekly/page.tsx
  - [x] 10.2 שליפת ארוחות השבוע הנוכחי מ-/api/meals
  - [x] 10.3 יצירת רכיב WeeklyBoard.tsx עם 7 עמודות (ימי השבוע)
  - [x] 10.4 יישום ציר Y לפי שעות (06:00–24:00)
  - [x] 10.5 הצגת כל ארוחה כנקודה על הציר בשעה המתאימה
  - [x] 10.6 יישום tooltip/modal בלחיצה על נקודה עם פרטי הארוחה

- [x] 11. יצירת דפי רשימת קניות ותפריט חלומות
  - [x] 11.1 יצירת /app/shopping/page.tsx עם שדה טקסט לרשימת מצרכים חסרים
  - [x] 11.2 יצירת /app/dreams/page.tsx עם שדה טקסט לאוכל חלום
  - [x] 11.3 טעינת ערכים שמורים מה-DB בטעינת הדף
  - [x] 11.4 שמירה אוטומטית עם debounce 800ms

- [x] 12. יישום כפתור "7 יפול צדיק"
  - [x] 12.1 יצירת /app/api/falls/route.ts עם POST לשמירת נפילה
  - [ ] 12.2 יצירת רכיב FallsModal.tsx המציג שיר רנדומלי מתוך 5 שירים
  - [x] 12.3 הגדרת 5 השירים כ-constant בקובץ נפרד lib/poems.ts
  - [x] 12.4 שמירת רשומת נפילה ב-DB בכל לחיצה על הכפתור
  - [x] 12.5 חיבור הכפתור בסרגל הניווט לפתיחת ה-modal

- [x] 13. בדיקות ונגישות
  - [x] 13.1 וידוא ניגודיות צבעים 4.5:1 לפי WCAG 2.1 AA
  - [x] 13.2 וידוא ניווט מקלדת לכל האלמנטים האינטראקטיביים
  - [x] 13.3 וידוא aria-labels על כל אלמנטי הממשק
  - [x] 13.4 בדיקת תצוגה RTL מלאה בכל הדפים
  - [x] 13.5 בדיקת responsive design למסכים שונים
