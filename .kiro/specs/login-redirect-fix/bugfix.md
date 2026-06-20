# Bugfix Requirements Document

## Introduction

מסמך זה מפרט את הדרישות לתיקון ארבע בעיות בתהליך ההתחברות וההתנתקות:
1. Session לא מתעדכן בזמן אמת אחרי התחברות מוצלחת
2. Session לא מתנקה כראוי אחרי התנתקות
3. חסר הצגת שם המשתמש בNavbar
4. Redirect לא נכון אחרי התחברות (מועבר ל-`/checklist` במקום ל-`/`)

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user successfully signs in using the credentials form THEN the session is not updated in real-time and the Navbar continues to display "התחבר" instead of "התנתק"

1.2 WHEN a user successfully registers and is auto-signed in THEN the session is not updated in real-time and the Navbar continues to display "התחבר" instead of "התנתק"

1.3 WHEN a user clicks "התנתק" (sign out) THEN the session is not cleared properly and the UI remains locked/restricted

1.4 WHEN a user is authenticated THEN the Navbar does not display the user's name (e.g., "שלום ל[שם המשתמש]") next to the "התנתק" button

1.5 WHEN a user successfully signs in using the credentials form THEN the system redirects to `/checklist` instead of `/`

1.6 WHEN a user successfully registers and is auto-signed in THEN the system redirects to `/checklist` instead of `/`

### Expected Behavior (Correct)

2.1 WHEN a user successfully signs in using the credentials form THEN the session SHALL update immediately and the Navbar SHALL display "התנתק" instead of "התחבר"

2.2 WHEN a user successfully registers and is auto-signed in THEN the session SHALL update immediately and the Navbar SHALL display "התנתק" instead of "התחבר"

2.3 WHEN a user clicks "התנתק" (sign out) THEN the session SHALL be cleared immediately and the user SHALL be redirected to `/auth/signin`

2.4 WHEN a user is authenticated THEN the Navbar SHALL display "שלום ל[user name]" next to the "התנתק" button

2.5 WHEN a user successfully signs in using the credentials form THEN the system SHALL redirect to `/` (home page)

2.6 WHEN a user successfully registers and is auto-signed in THEN the system SHALL redirect to `/` (home page)

### Unchanged Behavior (Regression Prevention)

3.1 WHEN authentication fails due to invalid credentials THEN the system SHALL CONTINUE TO display the error message "מייל או סיסמה שגויים" without redirecting

3.2 WHEN registration fails due to validation errors THEN the system SHALL CONTINUE TO display the appropriate error message without redirecting

3.3 WHEN a user is not authenticated and tries to access protected routes THEN the system SHALL CONTINUE TO redirect to the sign-in page

3.4 WHEN the sign-in page loads THEN the system SHALL CONTINUE TO display the correct UI with signin/register toggle functionality

3.5 WHEN the user profile image is available THEN the system SHALL CONTINUE TO display it in the Navbar

3.6 WHEN session status is loading THEN the system SHALL CONTINUE TO display "טוען..." in the Navbar
