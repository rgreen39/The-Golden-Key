/**
 * Bug Exploration Tests for Login Redirect Fix
 * 
 * These tests are designed to FAIL on unfixed code to confirm bugs exist.
 * They encode the expected behavior and will pass once the bugs are fixed.
 * 
 * **Validates: Requirements 1.1, 1.2, 1.5, 1.6, 2.1, 2.2, 2.5, 2.6**
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signIn } from 'next-auth/react'
import SignInPage from './page'

// Mock next-auth
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}))

// Mock next/navigation
const mockPush = vi.fn()
const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

// Mock fetch for registration
global.fetch = vi.fn()

describe('Bug 1.1.1: Session Update After Signin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('EXPLORATION TEST: Should call router.refresh() and redirect to / after successful signin', async () => {
    /**
     * **Property 1: Bug Condition** - Session Update After Signin
     * 
     * **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
     * **DO NOT attempt to fix the test or the code when it fails**
     * 
     * **GOAL**: Surface counterexamples that demonstrate the session update bug exists
     * 
     * **Expected Behavior from Design**: 
     * - Session updates in real-time after successful authentication
     * - `router.refresh()` is called to sync client-side session
     * - Redirect target is `/` (home page), not `/checklist`
     * 
     * **EXPECTED OUTCOME**: Test FAILS (router.refresh() is not called, redirect is to /checklist)
     * 
     * **Validates: Requirements 1.1, 2.1, 1.5, 2.5**
     */

    // Mock successful signin
    vi.mocked(signIn).mockResolvedValue({
      error: undefined,
      status: 200,
      ok: true,
      url: null,
    })

    const user = userEvent.setup()
    render(<SignInPage />)

    // Fill in credentials
    const emailInput = screen.getByLabelText(/כתובת מייל/i)
    const passwordInput = screen.getByLabelText(/סיסמה/i)
    const submitButton = screen.getByRole('button', { name: /כניסה לחשבון/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    // Wait for async operations to complete
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      })
    })

    // BUG CHECK: On unfixed code, these assertions will FAIL
    // This confirms the bugs exist:
    // 1. router.refresh() is NOT called (session won't update)
    // 2. router.push() is called with '/checklist' instead of '/'
    
    await waitFor(() => {
      // Expected: router.refresh() should be called BEFORE redirect
      expect(mockRefresh).toHaveBeenCalled()
      
      // Expected: redirect should be to '/' not '/checklist'
      expect(mockPush).toHaveBeenCalledWith('/')
      expect(mockPush).not.toHaveBeenCalledWith('/checklist')
    })

    // Counterexample documentation:
    // If this test fails, it confirms:
    // - router.refresh() was not called (mockRefresh.mock.calls.length === 0)
    // - router.push('/checklist') was called instead of router.push('/')
  })
})

describe('Bug 1.1.2: Session Update After Registration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('EXPLORATION TEST: Should call router.refresh() and redirect to / after successful registration', async () => {
    /**
     * **Property 1: Bug Condition** - Session Update After Registration
     * 
     * **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
     * **DO NOT attempt to fix the test or the code when it fails**
     * 
     * **GOAL**: Surface counterexamples that demonstrate the session update bug exists after registration
     * 
     * **Expected Behavior from Design**: 
     * - Session updates in real-time after successful registration and auto-signin
     * - `router.refresh()` is called to sync client-side session
     * - Redirect target is `/` (home page), not `/checklist`
     * 
     * **EXPECTED OUTCOME**: Test FAILS (router.refresh() is not called, redirect is to /checklist)
     * 
     * **Validates: Requirements 1.2, 2.2, 1.6, 2.6**
     */

    // Mock successful registration
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    // Mock successful auto-signin after registration
    vi.mocked(signIn).mockResolvedValue({
      error: undefined,
      status: 200,
      ok: true,
      url: null,
    })

    const user = userEvent.setup()
    render(<SignInPage />)

    // Switch to registration mode
    const registerTab = screen.getByRole('button', { name: /הרשמה/i })
    await user.click(registerTab)

    // Fill in registration form
    const nameInput = screen.getByLabelText(/שם/i)
    const emailInput = screen.getByLabelText(/כתובת מייל/i)
    const passwordInput = screen.getByLabelText(/סיסמה/i)
    const submitButton = screen.getByRole('button', { name: /יצירת חשבון חדש/i })

    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'newuser@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    // Wait for registration and auto-signin
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'newuser@example.com', 
          password: 'password123', 
          name: 'Test User' 
        }),
      })
    })

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'newuser@example.com',
        password: 'password123',
        redirect: false,
      })
    })

    // BUG CHECK: On unfixed code, these assertions will FAIL
    // This confirms the bugs exist:
    // 1. router.refresh() is NOT called (session won't update)
    // 2. router.push() is called with '/checklist' instead of '/'
    
    await waitFor(() => {
      // Expected: router.refresh() should be called BEFORE redirect
      expect(mockRefresh).toHaveBeenCalled()
      
      // Expected: redirect should be to '/' not '/checklist'
      expect(mockPush).toHaveBeenCalledWith('/')
      expect(mockPush).not.toHaveBeenCalledWith('/checklist')
    })

    // Counterexample documentation:
    // If this test fails, it confirms:
    // - router.refresh() was not called (mockRefresh.mock.calls.length === 0)
    // - router.push('/checklist') was called instead of router.push('/')
  })
})

describe('Bug 1.4.1: Redirect Target After Signin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('EXPLORATION TEST: Should verify redirect is to / after fix', async () => {
    /**
     * **Property 1: Bug Condition** - Redirect Target After Signin
     * 
     * **NOTE**: This test now verifies the FIX is working correctly
     * 
     * **Expected Behavior from Design**: 
     * - Redirect should be to `/` (home page)
     * - NOT to `/checklist`
     * 
     * **EXPECTED OUTCOME**: Test PASSES (redirect is to / as expected)
     * 
     * **Validates: Requirements 1.5, 2.5**
     */

    // Mock successful signin
    vi.mocked(signIn).mockResolvedValue({
      error: undefined,
      status: 200,
      ok: true,
      url: null,
    })

    const user = userEvent.setup()
    render(<SignInPage />)

    // Fill in credentials
    const emailInput = screen.getByLabelText(/כתובת מייל/i)
    const passwordInput = screen.getByLabelText(/סיסמה/i)
    const submitButton = screen.getByRole('button', { name: /כניסה לחשבון/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    // Wait for redirect
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled()
    })

    // AFTER FIX: Redirect should be to /
    expect(mockPush).toHaveBeenCalledWith('/')
    expect(mockPush).not.toHaveBeenCalledWith('/checklist')
  })
})

describe('Bug 1.4.2: Redirect Target After Registration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('EXPLORATION TEST: Should verify redirect is to / after registration fix', async () => {
    /**
     * **Property 1: Bug Condition** - Redirect Target After Registration
     * 
     * **NOTE**: This test now verifies the FIX is working correctly
     * 
     * **Expected Behavior from Design**: 
     * - Redirect should be to `/` (home page)
     * - NOT to `/checklist`
     * 
     * **EXPECTED OUTCOME**: Test PASSES (redirect is to / as expected)
     * 
     * **Validates: Requirements 1.6, 2.6**
     */

    // Mock successful registration
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    // Mock successful auto-signin after registration
    vi.mocked(signIn).mockResolvedValue({
      error: undefined,
      status: 200,
      ok: true,
      url: null,
    })

    const user = userEvent.setup()
    render(<SignInPage />)

    // Switch to registration mode
    const registerTab = screen.getByRole('button', { name: /הרשמה/i })
    await user.click(registerTab)

    // Fill in registration form
    const nameInput = screen.getByLabelText(/שם/i)
    const emailInput = screen.getByLabelText(/כתובת מייל/i)
    const passwordInput = screen.getByLabelText(/סיסמה/i)
    const submitButton = screen.getByRole('button', { name: /יצירת חשבון חדש/i })

    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'newuser@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    // Wait for redirect
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled()
    })

    // AFTER FIX: Redirect should be to /
    expect(mockPush).toHaveBeenCalledWith('/')
    expect(mockPush).not.toHaveBeenCalledWith('/checklist')
  })
})
