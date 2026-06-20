# Login Redirect Fix - Bugfix Design

## Overview

תיקון ארבע בעיות קריטיות במערכת ההתחברות וההתנתקות:
1. **Session לא מתעדכן בזמן אמת** - אחרי התחברות/רישום מוצלחים, Navbar ממשיך להציג "התחבר" במקום "התנתק"
2. **Session לא מתנקה אחרי התנתקות** - אחרי לחיצה על "התנתק", ה-session נשאר והUI נשאר נעול
3. **חסר הצגת שם המשתמש** - Navbar לא מציג את שם המשתמש ליד כפתור "התנתק"
4. **Redirect לא נכון** - משתמשים מועברים ל-`/checklist` במקום ל-`/` אחרי התחברות/רישום

הבעיות נובעות מ:
- חסרון `router.refresh()` אחרי התחברות (בעיה 1)
- הגדרות לא נכונות ב-`signOut()` (בעיה 2)
- חסרון הצגת `session.user.name` ב-Navbar (בעיה 3)
- hardcoded redirect target ל-`/checklist` (בעיה 4)

## Glossary

- **Bug_Condition (C)**: התנאי שגורם לבאגים - כאשר משתמש מתחבר/נרשם בהצלחה והמערכת לא מעדכנת את ה-session, לא מנקה session בהתנתקות, לא מציגה שם משתמש, או מפנה ל-URL לא נכון
- **Property (P)**: ההתנהגות הרצויה - המערכת צריכה לעדכן session בזמן אמת, לנקות session בהתנתקות, להציג שם משתמש, ולהפנות ל-`/` (דף הבית)
- **Preservation**: ההתנהגות הקיימת שצריכה להישמר - הצגת שגיאות, אימות קלט, מניעת גישה לדפים מוגנים, ותפקוד toggle בין כניסה/רישום
- **handleSignIn**: הפונקציה ב-`app/auth/signin/page.tsx` שמטפלת בתהליך ההתחברות
- **handleRegister**: הפונקציה ב-`app/auth/signin/page.tsx` שמטפלת בתהליך הרישום ובהתחברות אוטומטית לאחר מכן
- **router.push**: הפונקציה מ-Next.js שמבצעת ניווט בצד-לקוח
- **router.refresh**: הפונקציה מ-Next.js שמעדכנת את ה-server-side session בצד-לקוח
- **signOut**: הפונקציה מ-next-auth/react שמבצעת התנתקות
- **Navbar**: הקומפוננטה ב-`components/Navbar.tsx` שמציגה את סרגל הניווט והאימות

## Bug Details

### Bug Condition

הבאגים מתרחשים בארבעה תרחישים:

**1. Session לא מתעדכן אחרי התחברות:**
כאשר משתמש משלים בהצלחה תהליך התחברות או רישום, הקוד מבצע רק `router.push()` ללא `router.refresh()`, מה שגורם ל-Navbar להמשיך להציג "התחבר" במקום "התנתק" עד רענון ידני של הדף.

**2. Session לא מתנקה אחרי התנתקות:**
כאשר משתמש לוחץ על "התנתק", הפונקציה `signOut()` נקראת עם `callbackUrl` בלבד אך ללא `redirect: true`, מה שמונע ניקוי מלא של ה-session ומשאיר את ה-UI במצב נעול.

**3. חסר הצגת שם המשתמש:**
ב-Navbar, הקוד מציג את תמונת הפרופיל (אם קיימת) וכפתור "התנתק", אך לא מציג את שם המשתמש (`session.user.name`) ליד הכפתור.

**4. Redirect לא נכון:**
הקוד מבצע `router.push('/checklist')` בשני מקומות:
- בפונקציה `handleSignIn` - לאחר קבלת תשובה מוצלחת מ-`signIn()`
- בפונקציה `handleRegister` - לאחר רישום והתחברות אוטומטית מוצלחים

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type AuthenticationEvent
  OUTPUT: boolean
  
  RETURN (
    // Bug 1: Session not refreshed
    (input.type IN ['signin', 'register'] 
     AND input.authenticationSuccessful == true
     AND input.routerRefreshCalled == false)
    
    OR
    
    // Bug 2: Session not cleared on signout
    (input.type == 'signout'
     AND input.signOutRedirectParam == false)
    
    OR
    
    // Bug 3: Username not displayed
    (input.type == 'navbar_render'
     AND input.userAuthenticated == true
     AND input.userNameDisplayed == false)
    
    OR
    
    // Bug 4: Wrong redirect target
    (input.type IN ['signin', 'register']
     AND input.authenticationSuccessful == true
     AND input.redirectTarget == '/checklist')
  )
END FUNCTION
```

### Examples

**Bug 1 - Session לא מתעדכן:**
- משתמש קיים מזין מייל וסיסמה נכונים → לוחץ "כניסה" → מקבל אימות מוצלח → **מועבר לדף הבית אך Navbar עדיין מציג "התחבר"** במקום **"התנתק"** (עד רענון ידני)
- משתמש חדש ממלא טופס רישום → לוחץ "יצירת חשבון" → חשבון נוצר והאימות מצליח → **מועבר לדף הבית אך Navbar עדיין מציג "התחבר"** (עד רענון ידני)

**Bug 2 - Session לא מתנקה:**
- משתמש מחובר לוחץ על "התנתק" → **מועבר לדף התחברות אך session לא מנוקה לגמרי** → UI נשאר נעול או מתנהג בצורה לא צפויה

**Bug 3 - חסר שם משתמש:**
- משתמש מחובר (לדוגמה: שם = "שרה") → **Navbar מציג רק את תמונת הפרופיל וכפתור "התנתק"** → **לא מציג "שלום לשרה"** או "שרה" בצד הכפתור

**Bug 4 - Redirect לא נכון:**
- משתמש קיים מזין מייל וסיסמה נכונים → לוחץ "כניסה" → מקבל אימות מוצלח → **מופנה ל-`/checklist`** במקום **`/`**
- משתמש חדש ממלא טופס רישום (שם, מייל, סיסמה) → לוחץ "יצירת חשבון" → חשבון נוצר והאימות מצליח → **מופנה ל-`/checklist`** במקום **`/`**

**דוגמאות לתנהגות תקינה (לא חלק מתנאי הבאג):**
- כניסה עם סיסמה שגויה → **מקבל הודעת שגיאה ונשאר בדף הכניסה**
- רישום עם מייל קיים → **מקבל הודעת שגיאה ונשאר בדף ההרשמה**

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- הצגת הודעות שגיאה כאשר התחברות נכשלת (מייל או סיסמה שגויים)
- הצגת הודעות שגיאה כאשר רישום נכשל (מייל כבר קיים, סיסמה קצרה מדי, וכו')
- הפניה לדף `/auth/signin` כאשר משתמש לא מחובר מנסה לגשת לדפים מוגנים (`/checklist`, `/weekly`, `/shopping`, `/dreams`)
- תפקוד המעבר בין מצבי "כניסה" ו-"רישום" בעזרת כפתורי ה-toggle
- עיצוב ותצוגת ממשק המשתמש של דף ההתחברות והNavbar
- ניקוי הודעות שגיאה בעת מעבר בין מצבי כניסה/רישום
- הצגת תמונת פרופיל (אם קיימת) בNavbar
- הצגת "טוען..." בעת טעינת session status

**Scope:**
כל הקלטים שאינם כוללים התחברות או רישום **מוצלחים**, התנתקות, או rendering של Navbar עם משתמש מחובר, לא אמורים להיות מושפעים מהתיקון הזה. זה כולל:
- כניסה/רישום עם אישורים שגויים
- טעינת דף ההתחברות
- מעבר בין טאבים של כניסה/רישום
- ניווט לדף ההתחברות דרך middleware (כאשר לא מאומת)

## Hypothesized Root Cause

בהתבסס על תיאור הבעיות וניתוח הקוד, הסיבות הבסיסיות הן:

1. **Bug 1 - Session לא מתעדכן (Missing router.refresh())**:
   - בקובץ `app/auth/signin/page.tsx`, לאחר התחברות/רישום מוצלחים, הקוד מבצע רק `router.push()` ללא `router.refresh()`
   - ב-Next.js App Router עם server-side session (JWT strategy), לאחר שינוי ב-session בצד השרת, הצד-לקוח לא יודע על השינוי עד שהוא מבצע refresh
   - זה גורם ל-`useSession()` ב-Navbar להמשיך להחזיר session ישן (null) עד רענון ידני של הדף

2. **Bug 2 - Session לא מתנקה (Missing redirect parameter in signOut())**:
   - בקובץ `components/Navbar.tsx`, הקריאה ל-`signOut()` נעשית עם `{ callbackUrl: '/auth/signin' }` בלבד
   - בגרסאות מסוימות של NextAuth, זה לא מספיק כדי לבצע ניקוי מלא ו-redirect מיידי
   - הפתרון הוא להוסיף `redirect: true` או להשתמש ב-`window.location.href` לאחר `signOut()`

3. **Bug 3 - חסר הצגת שם משתמש (Missing UI element)**:
   - בקובץ `components/Navbar.tsx`, הקוד מציג `session.user.image` ו-button "התנתק", אך לא מציג `session.user.name`
   - זו פשוט חסרה הוספת אלמנט UI שמציג את השם

4. **Bug 4 - Redirect לא נכון (Hardcoded redirect target)**:
   - בקובץ `app/auth/signin/page.tsx`, הקוד מכיל הארדקודינג מפורש של יעד ההפניה `/checklist`:
     - בשורה ~28: `router.push('/checklist')` בתוך פונקציית `handleSignIn`
     - בשורה ~59: `router.push('/checklist')` בתוך פונקציית `handleRegister`
   - יתכן שבעבר דף `/checklist` שימש כדף הבית או כנקודת כניסה ראשית לאפליקציה

## Correctness Properties

Property 1: Bug Condition - Session Update and Correct Redirect After Authentication

_For any_ authentication event where the user successfully signs in or registers (authentication successful), the fixed handleSignIn/handleRegister functions SHALL:
1. Call `router.refresh()` to update the client-side session immediately
2. Redirect the user to `/` (home page) instead of `/checklist`
3. Ensure the Navbar updates to display "התנתק" instead of "התחבר"

**Validates: Requirements 2.1, 2.2, 2.5, 2.6**

Property 2: Bug Condition - Session Cleanup on Sign Out

_For any_ sign-out event where an authenticated user clicks "התנתק", the fixed signOut call in Navbar SHALL clear the session completely and redirect the user to `/auth/signin` immediately.

**Validates: Requirements 2.3**

Property 3: Bug Condition - Username Display in Navbar

_For any_ Navbar render event where a user is authenticated and has a name in their session, the fixed Navbar component SHALL display the user's name (e.g., "שלום ל[שם המשתמש]") next to the "התנתק" button.

**Validates: Requirements 2.4**

Property 4: Preservation - Error Handling and UI Behavior

_For any_ authentication event where authentication fails, or any UI interaction that doesn't involve successful authentication, sign-out, or authenticated Navbar rendering (isBugCondition returns false), the fixed code SHALL produce exactly the same behavior as the original code, preserving error message display, toggle functionality, and redirect-to-signin for unauthenticated access to protected routes.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

## Fix Implementation

### Changes Required

בהנחה שניתוח סיבות השורש שלנו נכון:

**File 1**: `app/auth/signin/page.tsx`

**Functions**: `handleSignIn` ו-`handleRegister`

**Specific Changes**:

1. **Add router.refresh() and Change Redirect in handleSignIn**:
   - **מיקום**: שורה ~24-29 (לאחר בדיקה שהתחברות הצליחה)
   - **קוד נוכחי**:
     ```typescript
     if (result?.error) {
       setError('מייל או סיסמה שגויים')
     } else {
       router.push('/checklist')
     }
     ```
   - **קוד מתוקן**:
     ```typescript
     if (result?.error) {
       setError('מייל או סיסמה שגויים')
     } else {
       router.refresh()  // ← הוספה: עדכון session בצד-לקוח
       router.push('/')  // ← שינוי: מ-'/checklist' ל-'/'
     }
     ```
   - **הסבר**: 
     - `router.refresh()` מעדכן את ה-server components ואת ה-session בצד-לקוח
     - `router.push('/')` משנה את יעד הניווט לדף הבית

2. **Add router.refresh() and Change Redirect in handleRegister**:
   - **מיקום**: שורה ~55-61 (לאחר בדיקה שרישום והתחברות אוטומטית הצליחו)
   - **קוד נוכחי**:
     ```typescript
     if (result?.error) {
       setError('ההרשמה הצליחה אך הכניסה נכשלה — נסי להתחבר')
       setMode('signin')
     } else {
       router.push('/checklist')
     }
     ```
   - **קוד מתוקן**:
     ```typescript
     if (result?.error) {
       setError('ההרשמה הצליחה אך הכניסה נכשלה — נסי להתחבר')
       setMode('signin')
     } else {
       router.refresh()  // ← הוספה: עדכון session בצד-לקוח
       router.push('/')  // ← שינוי: מ-'/checklist' ל-'/'
     }
     ```
   - **הסבר**: זהה לשינוי ב-handleSignIn

**File 2**: `components/Navbar.tsx`

**Component**: `Navbar`

**Specific Changes**:

3. **Fix signOut to properly clear session**:
   - **מיקום**: שורה ~79-85 (כפתור "התנתק" בauth section)
   - **קוד נוכחי**:
     ```typescript
     <button
       type="button"
       onClick={() => signOut({ callbackUrl: '/auth/signin' })}
       aria-label="התנתק מהחשבון"
       className="text-sm text-dark-gray hover:text-gold transition-colors px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold/40 rounded-sm"
     >
       התנתק
     </button>
     ```
   - **קוד מתוקן (Option 1 - המומלץ)**:
     ```typescript
     <button
       type="button"
       onClick={() => signOut({ callbackUrl: '/auth/signin', redirect: true })}
       aria-label="התנתק מהחשבון"
       className="text-sm text-dark-gray hover:text-gold transition-colors px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold/40 rounded-sm"
     >
       התנתק
     </button>
     ```
   - **או קוד מתוקן (Option 2 - חזק יותר)**:
     ```typescript
     <button
       type="button"
       onClick={async () => {
         await signOut({ redirect: false })
         window.location.href = '/auth/signin'
       }}
       aria-label="התנתק מהחשבון"
       className="text-sm text-dark-gray hover:text-gold transition-colors px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold/40 rounded-sm"
     >
       התנתק
     </button>
     ```
   - **הסבר**: 
     - Option 1: הוספת `redirect: true` מבטיחה ניקוי מלא של session ו-redirect מיידי
     - Option 2: שימוש ב-`window.location.href` מבצע hard navigation שמנקה לגמרי את הזיכרון

4. **Add username display in Navbar**:
   - **מיקום**: שורה ~74-85 (auth section, לפני או אחרי תמונת הפרופיל)
   - **קוד נוכחי**:
     ```typescript
     {session?.user ? (
       <>
         {session.user.image && (
           <Image
             src={session.user.image}
             alt={`תמונת פרופיל של ${session.user.name ?? 'משתמשת'}`}
             width={32}
             height={32}
             className="rounded-full border border-gold/40"
           />
         )}
         <button
           type="button"
           onClick={() => signOut({ callbackUrl: '/auth/signin' })}
           aria-label="התנתק מהחשבון"
           className="text-sm text-dark-gray hover:text-gold transition-colors px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold/40 rounded-sm"
         >
           התנתק
         </button>
       </>
     ) : (
     ```
   - **קוד מתוקן**:
     ```typescript
     {session?.user ? (
       <>
         {session.user.image && (
           <Image
             src={session.user.image}
             alt={`תמונת פרופיל של ${session.user.name ?? 'משתמשת'}`}
             width={32}
             height={32}
             className="rounded-full border border-gold/40"
           />
         )}
         {session.user.name && (
           <span className="text-sm text-dark-gray/70">
             שלום ל{session.user.name}
           </span>
         )}
         <button
           type="button"
           onClick={() => signOut({ callbackUrl: '/auth/signin', redirect: true })}
           aria-label="התנתק מהחשבון"
           className="text-sm text-dark-gray hover:text-gold transition-colors px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold/40 rounded-sm"
         >
           התנתק
         </button>
       </>
     ) : (
     ```
   - **הסבר**: הוספת בדיקה ל-`session.user.name` והצגתו בין תמונת הפרופיל לכפתור ההתנתקות

**Verification Steps**:
1. לאחר השינויים, לשמור את שני הקבצים
2. להריץ בדיקת TypeScript lint (`npm run lint` או `npx tsc --noEmit`) כדי לוודא שאין שגיאות syntax
3. לבדוק שהאפליקציה עדיין מתקמפלת ללא שגיאות

## Testing Strategy

### Validation Approach

אסטרטגיית הבדיקה עוקבת אחר גישה דו-שלבית: תחילה, לחשוף דוגמאות נגד (counterexamples) שמדגימות את הבעיות בקוד הלא מתוקן, ולאחר מכן לוודא שהתיקון עובד נכון ושומר על התנהגות קיימת.

### Exploratory Bug Condition Checking

**Goal**: לחשוף counterexamples שמדגימים את הארבע בעיות לפני יישום התיקון. לאשר או להפריך את ניתוח סיבות השורש. אם נפריך, נצטרך להניח מחדש.

**Test Plan**: לכתוב בדיקות שמדמות תהליכי התחברות, רישום, והתנתקות, ולבדוק את:
1. האם session מתעדכן בזמן אמת אחרי התחברות/רישום (Bug 1)
2. האם session מתנקה כראוי אחרי התנתקות (Bug 2)
3. האם שם המשתמש מוצג בNavbar (Bug 3)
4. האם ההפניה היא ל-`/` ולא ל-`/checklist` (Bug 4)

להריץ בדיקות אלו על הקוד הלא מתוקן כדי לצפות בכשלים ולהבין את סיבות השורש.

**Test Cases**:

**Bug 1 Tests - Session לא מתעדכן:**
1. **Signin Session Update Test**: לדמות כניסה מוצלחת → לבדוק אם `useSession()` מחזיר session מעודכן מיד אחרי `router.push()` (יכשל בקוד לא מתוקן - session יישאר null עד refresh)
2. **Register Session Update Test**: לדמות רישום מוצלח ואוטו-סיינאין → לבדוק אם Navbar מעדכן ל-"התנתק" מיד (יכשל בקוד לא מתוקן - יישאר "התחבר")

**Bug 2 Tests - Session לא מתנקה:**
3. **SignOut Session Clear Test**: לדמות משתמש מחובר לוחץ "התנתק" → לבדוק אם session מתנקה לגמרי והמערכת מבצעת redirect מיידי (יכשל בקוד לא מתוקן - session עלול להישאר)

**Bug 3 Tests - חסר שם משתמש:**
4. **Username Display Test**: לדמות משתמש מחובר עם שם (לדוגמה: "שרה") → לבדוק אם Navbar מציג "שלום לשרה" (יכשל בקוד לא מתוקן - לא יוצג)

**Bug 4 Tests - Redirect לא נכון:**
5. **Signin Redirect Test**: לדמות כניסה מוצלחת → לוודא שהמערכת מפנה ל-`/checklist` (יכשל בקוד לא מתוקן - צפוי, מאשר את הבאג)
6. **Register Redirect Test**: לדמות רישום מוצלח → לוודא שהמערכת מפנה ל-`/checklist` (יכשל בקוד לא מתוקן - צפוי, מאשר את הבאג)

**Preservation Tests:**
7. **Failed Signin Test**: לדמות כניסה עם סיסמה שגויה → לוודא שהמערכת לא מבצעת redirect ומציגה שגיאה (אמור להצליח גם בקוד לא מתוקן)
8. **Failed Register Test**: לדמות רישום עם מייל קיים → לוודא שהמערכת לא מבצעת redirect ומציגה שגיאה (אמור להצליח גם בקוד לא מתוקן)

**Expected Counterexamples**:
- **Bug 1**: session לא מתעדכן מיד, Navbar ממשיך להציג "התחבר"
- **Bug 2**: session לא מתנקה לגמרי, UI נשאר נעול
- **Bug 3**: שם המשתמש לא מוצג בNavbar
- **Bug 4**: המערכת מפנה ל-`/checklist` במקום ל-`/`
- סיבות אפשריות: חסר `router.refresh()`, הגדרות `signOut()` לא מספיקות, חסר UI element, hardcoded URL

### Fix Checking

**Goal**: לוודא שעבור כל הקלטים שבהם תנאי הבעיות מתקיימים, הפונקציות המתוקנות מייצרות את ההתנהגות הצפויה.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := handleAuthenticationFlow_fixed(input)
  ASSERT expectedBehavior(result)
  // For Bug 1: session updates immediately after signin/register
  // For Bug 2: session clears completely after signout
  // For Bug 3: username is displayed in Navbar when authenticated
  // For Bug 4: redirect target is '/' instead of '/checklist'
END FOR
```

**Test Cases**:
1. **Fix Check - Session Updates**: לוודא שאחרי התחברות/רישום, `router.refresh()` נקרא ו-session מתעדכן מיד
2. **Fix Check - Session Clears**: לוודא שאחרי התנתקות, session מתנקה לגמרי והמערכת מבצעת redirect
3. **Fix Check - Username Display**: לוודא ששם המשתמש מוצג בNavbar כאשר משתמש מחובר
4. **Fix Check - Correct Redirect**: לוודא שההפניה היא ל-`/` ולא ל-`/checklist`

### Preservation Checking

**Goal**: לוודא שעבור כל הקלטים שבהם תנאי הבאג לא מתקיים, הפונקציה המתוקנה מייצרת את אותה תוצאה כמו הפונקציה המקורית.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT handleAuthenticationFlow_original(input) = handleAuthenticationFlow_fixed(input)
END FOR
```

**Testing Approach**: בדיקה מבוססת-תכונות (property-based testing) מומלצת לבדיקת שימור מכיוון ש:
- היא מייצרת מקרי בדיקה רבים באופן אוטומטי על פני תחום הקלט
- היא תופסת מקרי קצה שבדיקות unit ידניות עלולות להחמיץ
- היא מספקת ערבויות חזקות שההתנהגות לא השתנתה עבור כל הקלטים שאינם באגים

**Test Plan**: תחילה לצפות בהתנהגות על הקוד הלא מתוקן עבור תרחישי שגיאה ואינטראקציות UI, ולאחר מכן לכתוב בדיקות מבוססות-תכונות שתופסות את ההתנהגות הזו.

**Test Cases**:
1. **Error Display Preservation**: לצפות שהצגת שגיאות עובדת נכון בקוד לא מתוקן, ולאחר מכן לכתוב בדיקה שמוודאת שהיא ממשיכה לעבוד אחרי התיקון
2. **Toggle Functionality Preservation**: לצפות שמעבר בין "כניסה" ל-"רישום" עובד נכון בקוד לא מתוקן, ולכתוב בדיקה שמוודאת שזה ממשיך לעבוד
3. **Middleware Redirect Preservation**: לצפות שגישה לדפים מוגנים ללא אימות גורמת לredirect ל-`/auth/signin`, ולכתוב בדיקה שמוודאת שזה ממשיך לעבוד
4. **UI State Preservation**: לצפות שמצב הטופס (ערכי שדות, מצב loading) מתנהג נכון, ולכתוב בדיקה שמוודאת שזה נשמר

### Unit Tests

- לבדוק שפונקציית `handleSignIn` מבצעת `router.refresh()` ו-`router.push('/')` כאשר אימות מצליח
- לבדוק שפונקציית `handleRegister` מבצעת `router.refresh()` ו-`router.push('/')` כאשר רישום ואימות מצליחים
- לבדוק שהודעות שגיאה מוצגות כאשר אימות נכשל (לא קורה refresh או redirect)
- לבדוק שהודעות שגיאה מוצגות כאשר רישום נכשל (לא קורה refresh או redirect)
- לבדוק שמעבר בין מצבי toggle (signin/register) עובד ומנקה שגיאות
- לבדוק מקרי קצה (שדות ריקים, פורמט מייל לא תקין, סיסמה קצרה מדי)
- לבדוק שNavbar מציג שם משתמש כאשר `session.user.name` קיים
- לבדוק שNavbar לא קורס כאשר `session.user.name` הוא null/undefined
- לבדוק ש-`signOut()` נקרא עם הפרמטרים הנכונים (`redirect: true`)
- לבדוק שהתנתקות מנקה את session ומבצעת redirect ל-`/auth/signin`

### Property-Based Tests

- ליצור states אקראיים של טופס כניסה ולוודא ש-`router.refresh()` נקרא ו-redirect ל-`/` מתרחש רק כאשר אימות מצליח
- ליצור states אקראיים של טופס רישום ולוודא ש-`router.refresh()` נקרא ו-redirect ל-`/` מתרחש רק כאשר רישום ואימות מצליחים
- ליצור קלטים אקראיים של שגיאות (credentials שגויים, מיילים קיימים) ולוודא שהתנהגות הצגת השגיאה נשמרת (ללא refresh או redirect)
- לבדוק על פני תרחישים רבים שמעבר toggle לא משפיע על redirect/refresh logic
- ליצור session states אקראיים עם/בלי שמות משתמש ולוודא שNavbar מציג נכון בכל מקרה
- לבדוק על פני תרחישים רבים של התנתקות שsession תמיד מתנקה ו-redirect מתבצע

### Integration Tests

- לבדוק תהליך כניסה מלא: ניווט ל-`/auth/signin` → מילוי credentials → כניסה → וידוא שהמשתמש נמצא ב-`/` → וידוא ש-Navbar מציג "התנתק" ושם משתמש מיד
- לבדוק תהליך רישום מלא: ניווט ל-`/auth/signin` → מעבר ל-"הרשמה" → מילוי פרטים → רישום → וידוא שהמשתמש נמצא ב-`/` → וידוא ש-Navbar מציג "התנתק" ושם משתמש מיד
- לבדוק תהליך התנתקות מלא: משתמש מחובר → לחיצה על "התנתק" → וידוא שהמשתמש מגיע ל-`/auth/signin` → וידוא ש-session נוקה לגמרי → וידוא ש-Navbar מציג "התחבר"
- לבדוק שמעבר בין pages מוגנים ל-non-protected עובד נכון לאחר התחברות עם session מעודכן
- לבדוק שמחזור התחברות-ניתוק-התחברות עובד נכון עם ה-redirect החדש וה-refresh
- לבדוק שמשתמש לא מאומת שמנסה לגשת ל-`/checklist` מופנה ל-`/auth/signin` ואז אחרי התחברות מגיע ל-`/` (לא חזרה ל-`/checklist`)
- לבדוק שNavbar מציג שם משתמש נכון לאורך כל מחזור החיים (לאחר כניסה, רישום, ניווט בין דפים)
- לבדוק שתמונת פרופיל (אם קיימת) מוצגת יחד עם שם המשתמש בלי קונפליקטים UI
