# Implementation Plan - Login Redirect Fix

## 1. Write bug condition exploration tests (BEFORE implementing fix)

### 1.1 Bug 1: Session לא מתעדכן אחרי התחברות
- [ ] 1.1.1 **Property 1: Bug Condition** - Session Update After Signin
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the session update bug exists
  - **Test Details**: 
    - Simulate successful signin with valid credentials
    - Check if `useSession()` returns updated session immediately after authentication
    - Assert that Navbar displays "התנתק" instead of "התחבר"
  - **Expected Behavior from Design**: 
    - Session updates in real-time after successful authentication
    - `router.refresh()` is called to sync client-side session
    - Navbar immediately reflects authenticated state
  - Run test on UNFIXED code (app/auth/signin/page.tsx)
  - **EXPECTED OUTCOME**: Test FAILS (session remains null/unauthenticated, Navbar still shows "התחבר")
  - Document counterexamples found (e.g., "After successful signin, session.user is null until manual page refresh")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 2.1_

- [ ] 1.1.2 **Property 1: Bug Condition** - Session Update After Registration
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the session update bug exists after registration
  - **Test Details**: 
    - Simulate successful registration and auto-signin
    - Check if `useSession()` returns updated session immediately after registration
    - Assert that Navbar displays "התנתק" instead of "התחבר"
  - **Expected Behavior from Design**: 
    - Session updates in real-time after successful registration and auto-signin
    - `router.refresh()` is called to sync client-side session
    - Navbar immediately reflects authenticated state
  - Run test on UNFIXED code (app/auth/signin/page.tsx)
  - **EXPECTED OUTCOME**: Test FAILS (session remains null/unauthenticated, Navbar still shows "התחבר")
  - Document counterexamples found (e.g., "After successful registration, session.user is null until manual page refresh")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.2, 2.2_

### 1.2 Bug 2: Session לא מתנקה אחרי התנתקות
- [ ] 1.2.1 **Property 1: Bug Condition** - Session Cleanup After Signout
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the session cleanup bug exists
  - **Test Details**: 
    - Simulate authenticated user clicking "התנתק"
    - Check if session is cleared completely
    - Check if redirect to `/auth/signin` occurs immediately
  - **Expected Behavior from Design**: 
    - Session is cleared immediately on signout
    - User is redirected to `/auth/signin` without delay
    - UI updates to show unauthenticated state
  - Run test on UNFIXED code (components/Navbar.tsx)
  - **EXPECTED OUTCOME**: Test FAILS (session remains or redirect doesn't occur, UI stays locked)
  - Document counterexamples found (e.g., "After clicking התנתק, session persists and UI remains restricted")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.3, 2.3_

### 1.3 Bug 3: חסר הצגת שם המשתמש
- [ ] 1.3.1 **Property 1: Bug Condition** - Username Display in Navbar
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the username display bug exists
  - **Test Details**: 
    - Simulate authenticated user with name in session (e.g., name = "שרה")
    - Check if Navbar displays "שלום לשרה" next to "התנתק" button
  - **Expected Behavior from Design**: 
    - When `session.user.name` exists, display it in Navbar
    - Format: "שלום ל[user name]"
    - Display between profile image and "התנתק" button
  - Run test on UNFIXED code (components/Navbar.tsx)
  - **EXPECTED OUTCOME**: Test FAILS (username is not displayed in Navbar)
  - Document counterexamples found (e.g., "Navbar shows profile image and התנתק button, but not the user name 'שרה'")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.4, 2.4_

### 1.4 Bug 4: Redirect לא נכון
- [ ] 1.4.1 **Property 1: Bug Condition** - Redirect Target After Signin
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the redirect bug exists after signin
  - **Test Details**: 
    - Simulate successful signin
    - Check redirect target URL
    - Assert redirect is to `/checklist` (this is the bug - we're confirming it exists)
  - **Expected Behavior from Design**: 
    - Redirect should be to `/` (home page)
    - NOT to `/checklist`
  - Run test on UNFIXED code (app/auth/signin/page.tsx)
  - **EXPECTED OUTCOME**: Test FAILS (redirect is to `/checklist` instead of `/`)
  - Document counterexamples found (e.g., "After signin, router.push('/checklist') is called instead of router.push('/')")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.5, 2.5_

- [ ] 1.4.2 **Property 1: Bug Condition** - Redirect Target After Registration
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the redirect bug exists after registration
  - **Test Details**: 
    - Simulate successful registration and auto-signin
    - Check redirect target URL
    - Assert redirect is to `/checklist` (this is the bug - we're confirming it exists)
  - **Expected Behavior from Design**: 
    - Redirect should be to `/` (home page)
    - NOT to `/checklist`
  - Run test on UNFIXED code (app/auth/signin/page.tsx)
  - **EXPECTED OUTCOME**: Test FAILS (redirect is to `/checklist` instead of `/`)
  - Document counterexamples found (e.g., "After registration, router.push('/checklist') is called instead of router.push('/')")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.6, 2.6_

## 2. Write preservation property tests (BEFORE implementing fix)

- [ ] 2.1 **Property 2: Preservation** - Error Handling and Display
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for authentication failures:
    - Failed signin with invalid credentials displays error message
    - Failed registration with existing email displays error message
    - No redirect occurs when authentication fails
  - Write property-based tests capturing observed error handling behavior
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline error handling behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2_

- [ ] 2.2 **Property 2: Preservation** - UI and Toggle Functionality
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for UI interactions:
    - Toggle between "כניסה" and "הרשמה" works correctly
    - Error messages clear when toggling between modes
    - Form fields maintain their state appropriately
    - Loading states display correctly ("טוען..." in Navbar and "רגע..." in button)
  - Write property-based tests capturing observed UI behavior patterns
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline UI behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.4, 3.6_

- [ ] 2.3 **Property 2: Preservation** - Protected Routes and Middleware
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for route protection:
    - Unauthenticated users trying to access `/checklist`, `/weekly`, `/shopping`, `/dreams` are redirected to `/auth/signin`
    - Middleware correctly identifies unauthenticated requests
  - Write property-based tests capturing observed route protection behavior
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline route protection to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.3_

- [ ] 2.4 **Property 2: Preservation** - Profile Image Display
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for profile image:
    - When `session.user.image` exists, it displays in Navbar
    - Image has correct styling (rounded-full, border)
    - Alt text includes user name when available
  - Write property-based tests capturing observed profile image behavior
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline profile image display to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.5_

## 3. Fix for Login Redirect Issues

- [ ] 3.1 Fix session update and redirect in signin flow
  - [ ] 3.1.1 Implement router.refresh() and correct redirect in handleSignIn
    - Open file: `app/auth/signin/page.tsx`
    - Locate the `handleSignIn` function (around line 16-33)
    - Find the success branch: `else { router.push('/checklist') }`
    - Add `router.refresh()` before `router.push()`
    - Change redirect target from `/checklist` to `/`
    - Result should be:
      ```typescript
      if (result?.error) {
        setError('מייל או סיסמה שגויים')
      } else {
        router.refresh()  // ← Add this line
        router.push('/')   // ← Change from '/checklist' to '/'
      }
      ```
    - _Bug_Condition: `isBugCondition(input)` where `input.type == 'signin'` AND `input.authenticationSuccessful == true` AND (`input.routerRefreshCalled == false` OR `input.redirectTarget == '/checklist'`)_
    - _Expected_Behavior: After successful signin, `router.refresh()` updates session immediately and `router.push('/')` redirects to home page_
    - _Preservation: Error handling for failed signin must be preserved (3.1, 3.2)_
    - _Requirements: 1.1, 2.1, 1.5, 2.5_

  - [ ] 3.1.2 Implement router.refresh() and correct redirect in handleRegister
    - Open file: `app/auth/signin/page.tsx`
    - Locate the `handleRegister` function (around line 35-66)
    - Find the success branch after auto-signin: `else { router.push('/checklist') }`
    - Add `router.refresh()` before `router.push()`
    - Change redirect target from `/checklist` to `/`
    - Result should be:
      ```typescript
      if (result?.error) {
        setError('ההרשמה הצליחה אך הכניסה נכשלה — נסי להתחבר')
        setMode('signin')
      } else {
        router.refresh()  // ← Add this line
        router.push('/')   // ← Change from '/checklist' to '/'
      }
      ```
    - _Bug_Condition: `isBugCondition(input)` where `input.type == 'register'` AND `input.authenticationSuccessful == true` AND (`input.routerRefreshCalled == false` OR `input.redirectTarget == '/checklist'`)_
    - _Expected_Behavior: After successful registration and auto-signin, `router.refresh()` updates session immediately and `router.push('/')` redirects to home page_
    - _Preservation: Error handling for failed registration must be preserved (3.1, 3.2)_
    - _Requirements: 1.2, 2.2, 1.6, 2.6_

  - [ ] 3.1.3 Verify signin session update and redirect tests now pass
    - **Property 1: Expected Behavior** - Session Update and Redirect After Signin
    - **IMPORTANT**: Re-run the SAME tests from task 1.1.1 and 1.4.1 - do NOT write new tests
    - The tests from tasks 1.1.1 and 1.4.1 encode the expected behavior
    - When these tests pass, it confirms:
      - Session updates immediately after signin (no longer need manual refresh)
      - Redirect is to `/` instead of `/checklist`
    - Run tests from task 1.1.1 (session update) and 1.4.1 (redirect target)
    - **EXPECTED OUTCOME**: Tests PASS (confirms bugs are fixed)
    - _Requirements: Expected Behavior Properties from design (2.1, 2.5)_

  - [ ] 3.1.4 Verify registration session update and redirect tests now pass
    - **Property 1: Expected Behavior** - Session Update and Redirect After Registration
    - **IMPORTANT**: Re-run the SAME tests from task 1.1.2 and 1.4.2 - do NOT write new tests
    - The tests from tasks 1.1.2 and 1.4.2 encode the expected behavior
    - When these tests pass, it confirms:
      - Session updates immediately after registration (no longer need manual refresh)
      - Redirect is to `/` instead of `/checklist`
    - Run tests from task 1.1.2 (session update) and 1.4.2 (redirect target)
    - **EXPECTED OUTCOME**: Tests PASS (confirms bugs are fixed)
    - _Requirements: Expected Behavior Properties from design (2.2, 2.6)_

- [ ] 3.2 Fix session cleanup on signout
  - [ ] 3.2.1 Update signOut call to properly clear session
    - Open file: `components/Navbar.tsx`
    - Locate the "התנתק" button in the auth section (around line 79-85)
    - Find the current signOut call: `onClick={() => signOut({ callbackUrl: '/auth/signin' })}`
    - **Option 1 (Recommended)**: Add `redirect: true` parameter
      ```typescript
      onClick={() => signOut({ callbackUrl: '/auth/signin', redirect: true })}
      ```
    - **Option 2 (Stronger guarantee)**: Use async/await with window.location.href
      ```typescript
      onClick={async () => {
        await signOut({ redirect: false })
        window.location.href = '/auth/signin'
      }}
      ```
    - Choose Option 1 first; if session cleanup issues persist, use Option 2
    - _Bug_Condition: `isBugCondition(input)` where `input.type == 'signout'` AND `input.signOutRedirectParam == false`_
    - _Expected_Behavior: Session clears completely on signout and user is redirected to `/auth/signin` immediately_
    - _Preservation: Profile image display and loading states must be preserved (3.5, 3.6)_
    - _Requirements: 1.3, 2.3_

  - [ ] 3.2.2 Verify signout session cleanup test now passes
    - **Property 1: Expected Behavior** - Session Cleanup After Signout
    - **IMPORTANT**: Re-run the SAME test from task 1.2.1 - do NOT write a new test
    - The test from task 1.2.1 encodes the expected behavior
    - When this test passes, it confirms session is cleared completely and redirect occurs immediately
    - Run test from task 1.2.1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: Expected Behavior Properties from design (2.3)_

- [ ] 3.3 Add username display in Navbar
  - [ ] 3.3.1 Add username display element in Navbar
    - Open file: `components/Navbar.tsx`
    - Locate the auth section where profile image and "התנתק" button are displayed (around line 74-85)
    - Add username display between profile image and "התנתק" button:
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
    - Ensure conditional rendering: only display name if `session.user.name` exists
    - _Bug_Condition: `isBugCondition(input)` where `input.type == 'navbar_render'` AND `input.userAuthenticated == true` AND `input.userNameDisplayed == false`_
    - _Expected_Behavior: When `session.user.name` exists, display "שלום ל[user name]" in Navbar between profile image and "התנתק" button_
    - _Preservation: Profile image display, signout button, and loading states must be preserved (3.5, 3.6)_
    - _Requirements: 1.4, 2.4_

  - [ ] 3.3.2 Verify username display test now passes
    - **Property 1: Expected Behavior** - Username Display in Navbar
    - **IMPORTANT**: Re-run the SAME test from task 1.3.1 - do NOT write a new test
    - The test from task 1.3.1 encodes the expected behavior
    - When this test passes, it confirms username is displayed correctly in Navbar
    - Run test from task 1.3.1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: Expected Behavior Properties from design (2.4)_

  - [ ] 3.3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - All Preservation Requirements
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run all preservation property tests from section 2:
      - Task 2.1: Error handling and display (Requirements 3.1, 3.2)
      - Task 2.2: UI and toggle functionality (Requirements 3.4, 3.6)
      - Task 2.3: Protected routes and middleware (Requirement 3.3)
      - Task 2.4: Profile image display (Requirement 3.5)
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after all fixes (no regressions introduced)

## 4. Checkpoint - Ensure all tests pass

- [ ] 4.1 Run all exploration tests and verify they now pass (expected behavior achieved)
  - Run all tests from section 1 (tasks 1.1.1, 1.1.2, 1.2.1, 1.3.1, 1.4.1, 1.4.2)
  - All should now PASS (they failed on unfixed code, confirming bugs existed)
  - Passing confirms: session updates, session cleanup, username display, and correct redirects are working

- [ ] 4.2 Run all preservation tests and verify they still pass (no regressions)
  - Run all tests from section 2 (tasks 2.1, 2.2, 2.3, 2.4)
  - All should still PASS (they passed on unfixed code and should continue to pass)
  - Passing confirms: error handling, UI functionality, route protection, and profile image display are preserved

- [ ] 4.3 Verify complete authentication flow end-to-end
  - Manual verification (or E2E test):
    1. Navigate to `/auth/signin`
    2. Sign in with valid credentials → verify immediate redirect to `/` and Navbar shows "התנתק" + username
    3. Sign out → verify immediate redirect to `/auth/signin` and session cleared
    4. Register new account → verify immediate redirect to `/` and Navbar shows "התנתק" + username
    5. Try accessing protected route (`/checklist`) while unauthenticated → verify redirect to `/auth/signin`
    6. Sign in with invalid credentials → verify error message displayed without redirect

- [ ] 4.4 Final checkpoint - Ask user if any questions or issues arise
  - All tests passing
  - All four bugs fixed:
    - ✅ Session updates immediately after signin/register
    - ✅ Session clears properly on signout
    - ✅ Username displays in Navbar
    - ✅ Redirects go to `/` instead of `/checklist`
  - All preservation requirements maintained
  - Ready for user review
