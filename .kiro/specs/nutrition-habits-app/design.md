# מסמך עיצוב טכני — מרפש זהב

## סקירה כללית

אפליקציית Web בעברית RTL לשיפור הרגלי תזונה. הסטאק מבוסס על Next.js (fullstack), PostgreSQL עם Prisma, ואימות Google OAuth דרך NextAuth.js.

---

## ארכיטקטורת המערכת

```
┌─────────────────────────────────────┐
│           Browser (React/Next.js)    │
│  - דף בית                           │
│  - צ'קליסט מרפשזהב                  │
│  - לוח שבועי                        │
│  - רשימת קניות / תפריט חלומות       │
│  - 7 יפול צדיק                      │
└──────────────┬──────────────────────┘
               │ HTTP / API Routes
┌──────────────▼──────────────────────┐
│         Next.js API Routes           │
│  /api/auth/[...nextauth]            │
│  /api/meals                         │
│  /api/shopping                      │
│  /api/dreams                        │
│  /api/falls                         │
└──────────────┬──────────────────────┘
               │ Prisma ORM
┌──────────────▼──────────────────────┐
│           PostgreSQL DB              │
│  users, meals, shopping_items,      │
│  dream_foods, falls                 │
└─────────────────────────────────────┘
```

---

## סטאק טכנולוגי

| שכבה | טכנולוגיה |
|------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + כיוון RTL |
| Auth | NextAuth.js + Google OAuth 2.0 |
| ORM | Prisma |
| DB | PostgreSQL |
| Hosting | Vercel (frontend + API) + Railway (DB) |

---

## מבנה ה-DB (Prisma Schema)

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  image         String?
  createdAt     DateTime @default(now())
  meals         Meal[]
  shoppingItems ShoppingItem[]
  dreamFoods    DreamFood[]
  falls         Fall[]
}

model Meal {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  foodChoice String?
  createdAt DateTime @default(now())
}

model ShoppingItem {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  content   String
  updatedAt DateTime @updatedAt
}

model DreamFood {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  content   String
  updatedAt DateTime @updatedAt
}

model Fall {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

---

## מבנה הדפים והניתוב

```
/                    → דף בית (מרפש זהב)
/checklist           → צ'קליסט מרפשזהב
/checklist/complete  → מסך "פותח את ידך..." (10 שניות)
/weekly              → לוח שבועי
/shopping            → רשימת קניות
/dreams              → תפריט חלומות
/falls               → יומן נפילות (7 יפול צדיק)
/api/auth/[...nextauth] → Google OAuth
/api/meals           → GET, POST
/api/shopping        → GET, PUT
/api/dreams          → GET, PUT
/api/falls           → GET, POST
```

---

## רכיבי UI מרכזיים

### Navbar
- סרגל עליון עם לינקים: אני רוצה לאכול | יומן שבועי | רשימת קניות | תפריט חלומות | 7 יפול צדיק
- כפתור התחברות/התנתקות עם תמונת פרופיל Google
- עיצוב: רקע לבן/שמנת, גופן עברי אלגנטי, ללא אייקונים מיותרים

### ChecklistItem
```typescript
interface ChecklistItemProps {
  letter: string        // מ | ר | פ | ש | ז | ה | ב
  text: string          // טקסט הסעיף
  expandedContent?: string  // תוכן ההרחבה (אופציונלי)
  checked: boolean
  onToggle: () => void
}
```

### ChecklistPage
- מציג 7 סעיפי מרפשזהב
- מתחת לסעיף ב: שני שדות קלט (מצרכים חסרים + אוכל חלום)
- כשכל 7 סעיפים מסומנים: מציג שדה "בחרתי לאכול:" + כפתור "אני מוכנה להנות מהשפע"

### CompletionScreen
- טקסט: "פותח את ידך ומשביע לכל חי רצון"
- רקע: אנימציית לבבות (CSS animation)
- טיימר: 10 שניות → redirect לדף הבית
- כפתור "ארוחה חדשה" לדילוג על הטיימר

### WeeklyBoard
- תצוגת 7 עמודות (ימי השבוע)
- ציר Y: שעות 06:00–24:00
- כל ארוחה: נקודה על הציר בשעה המתאימה
- לחיצה על נקודה: tooltip/modal עם פרטי הארוחה

### FallsModal
- מוצג בלחיצה על "7 יפול צדיק"
- בוחר רנדומלית אחד מ-5 שירים
- מציג את השיר בפורמט קריא
- שומר רשומת נפילה ב-DB אוטומטית

---

## ממשקי API

### POST /api/meals
```typescript
// Request
{ foodChoice: string }
// Response
{ id: string, createdAt: string, foodChoice: string }
```

### GET /api/meals?from=&to=
```typescript
// Response
{ meals: Array<{ id, createdAt, foodChoice }> }
```

### GET /api/shopping
```typescript
// Response
{ content: string, updatedAt: string }
```

### PUT /api/shopping
```typescript
// Request
{ content: string }
// Response
{ content: string, updatedAt: string }
```

### GET /api/dreams
```typescript
// Response
{ content: string, updatedAt: string }
```

### PUT /api/dreams
```typescript
// Request
{ content: string }
// Response
{ content: string, updatedAt: string }
```

### POST /api/falls
```typescript
// Response
{ id: string, createdAt: string }
```

---

## אסטרטגיית אימות

- NextAuth.js עם Google Provider
- Session strategy: JWT
- כל API route מוגן עם `getServerSession()`
- משתמש לא מחובר מופנה ל-`/api/auth/signin`
- בהתחברות ראשונה: יצירת רשומת User ב-DB אוטומטית דרך Prisma adapter

---

## עיצוב ו-RTL

- `dir="rtl"` על תג `<html>`
- Tailwind: שימוש ב-`rtl:` prefix לכיוונים
- גופן: Heebo מ-Google Fonts (עברית מודרנית ואלגנטית)
- פלטת צבעים: גוונים חמים ונקיים — שמנת (#FAFAF7), זהב (#C9A84C), אפור כהה (#2D2D2D)
- ללא border-radius גדולים מדי, ללא צלליות כבדות — מינימליזם פרימיום

---

## תכונות נוספות

### שמירה אוטומטית של שדות מצרכים ואוכל חלום
- debounce של 800ms על שינוי בשדה
- שמירה ב-DB דרך PUT /api/shopping ו-PUT /api/dreams
- אינדיקטור "נשמר" קטן ודיסקרטי

### טיימר מסך הסיום
- `useEffect` עם `setTimeout` של 10,000ms
- `useRouter().push('/')` בסיום
- כפתור "ארוחה חדשה" מבטל את הטיימר ומנווט לצ'קליסט
