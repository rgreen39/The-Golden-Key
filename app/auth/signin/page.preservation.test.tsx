/**
 * Preservation Tests for Login/Registration Flow
 * 
 * These tests capture behavior that must be PRESERVED after fixing the bugs.
 * They should PASS on both unfixed and fixed code.
 * 
 * **Validates: Requirements 3.1, 3.2, 3.4, 3.6**
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
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

describe('Property 2: Preservation - Error Handling and Display', () => {
  /**
   * **IMPORTANT**: Follow observation-first methodology
   * 
   * Observe behavior on UNFIXED code for authentication failures:
   * - Failed signin with invalid credentials displays error message
   * - Failed registration with existing email displays error message
   * - No redirect occurs when authentication fails
   * 
   * **EXPECTED OUTCOME**: Tests PASS on unfixed code (confirming baseline behavior)
   * 
   * **Validates: Requirements 3.1, 3.2**
   */

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('PRESERVATION: Should display error message when signin fails with invalid credentials', async () => {
    // Mock failed signin
    vi.mocked(signIn).mockResolvedValue({
      error: 'CredentialsSignin',
      status: 401,
      ok: false,
      url: null,
    })

    const user = userEvent.setup()
    render(<SignInPage />)

    // Fill in credentials
    const emailInput = screen.getByLabelText(/כתובת מייל/i)
    const passwordInput = screen.getByLabelText(/סיסמה/i)
    const submitButton = screen.getByRole('button', { name: /כניסה לחשבון/i })

    await user.type(emailInput, 'wrong@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    // Should display error message
    await waitFor(() => {
      const errorMessage = screen.getByText(/מייל או סיסמה שגויים/i)
      expect(errorMessage).toBeInTheDocument()
    })

    // Should NOT redirect when authentication fails
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('PRESERVATION: Should display error message when registration fails', async () => {
    // Mock failed registration (e.g., email already exists)
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Email already exists' }),
    } as Response)

    const user = userEvent.setup()
    render(<SignInPage />)

    // Switch to registration mode
    const registerTab = screen.getByRole('button', { name: /הרשמה/i })
    await user.click(registerTab)

    // Fill in registration form
    const emailInput = screen.getByLabelText(/כתובת מייל/i)
    const passwordInput = screen.getByLabelText(/סיסמה/i)
    const submitButton = screen.getByRole('button', { name: /יצירת חשבון חדש/i })

    await user.type(emailInput, 'existing@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    // Should display error message
    await waitFor(() => {
      const errorMessage = screen.getByRole('alert')
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage).toHaveTextContent(/Email already exists|שגיאה בהרשמה/i)
    })

    // Should NOT redirect when registration fails
    expect(mockPush).not.toHaveBeenCalled()
  })
})

describe('Property 2: Preservation - UI and Toggle Functionality', () => {
  /**
   * **IMPORTANT**: Follow observation-first methodology
   * 
   * Observe behavior on UNFIXED code for UI interactions:
   * - Toggle between "כניסה" and "הרשמה" works correctly
   * - Error messages clear when toggling between modes
   * - Form fields maintain their state appropriately
   * 
   * **EXPECTED OUTCOME**: Tests PASS on unfixed code (confirming baseline UI behavior)
   * 
   * **Validates: Requirements 3.4, 3.6**
   */

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('PRESERVATION: Should toggle between signin and register modes', async () => {
    const user = userEvent.setup()
    render(<SignInPage />)

    // Initially in signin mode (no name field)
    expect(screen.queryByLabelText(/שם/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /כניסה לחשבון/i })).toBeInTheDocument()

    // Switch to registration mode
    const registerTab = screen.getByRole('button', { name: /הרשמה/i })
    await user.click(registerTab)

    // Should show name field and register button
    expect(screen.getByLabelText(/שם/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /יצירת חשבון חדש/i })).toBeInTheDocument()

    // Switch back to signin mode
    const signinTab = screen.getByRole('button', { name: /כניסה/i })
    await user.click(signinTab)

    // Should hide name field and show signin button
    expect(screen.queryByLabelText(/שם/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /כניסה לחשבון/i })).toBeInTheDocument()
  })

  it('PRESERVATION: Should clear error messages when toggling modes', async () => {
    // Mock failed signin
    vi.mocked(signIn).mockResolvedValue({
      error: 'CredentialsSignin',
      status: 401,
      ok: false,
      url: null,
    })

    const user = userEvent.setup()
    render(<SignInPage />)

    // Trigger signin error
    const emailInput = screen.getByLabelText(/כתובת מייל/i)
    const passwordInput = screen.getByLabelText(/סיסמה/i)
    const submitButton = screen.getByRole('button', { name: /כניסה לחשבון/i })

    await user.type(emailInput, 'wrong@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/מייל או סיסמה שגויים/i)).toBeInTheDocument()
    })

    // Switch to registration mode
    const registerTab = screen.getByRole('button', { name: /הרשמה/i })
    await user.click(registerTab)

    // Error should be cleared
    expect(screen.queryByText(/מייל או סיסמה שגויים/i)).not.toBeInTheDocument()
  })

  it('PRESERVATION: Should display loading state during form submission', async () => {
    // Mock slow signin
    vi.mocked(signIn).mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            error: undefined,
            status: 200,
            ok: true,
            url: null,
          })
        }, 100)
      })
    })

    const user = userEvent.setup()
    render(<SignInPage />)

    const emailInput = screen.getByLabelText(/כתובת מייל/i)
    const passwordInput = screen.getByLabelText(/סיסמה/i)
    const submitButton = screen.getByRole('button', { name: /כניסה לחשבון/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText(/רגע\.\.\./i)).toBeInTheDocument()
    })

    // Button should be disabled during loading
    expect(submitButton).toBeDisabled()
  })

  it('PRESERVATION: Should maintain form field state during interaction', async () => {
    const user = userEvent.setup()
    render(<SignInPage />)

    // Type in email field
    const emailInput = screen.getByLabelText(/כתובת מייל/i) as HTMLInputElement
    await user.type(emailInput, 'test@example.com')

    // Email value should be maintained
    expect(emailInput.value).toBe('test@example.com')

    // Type in password field
    const passwordInput = screen.getByLabelText(/סיסמה/i) as HTMLInputElement
    await user.type(passwordInput, 'mypassword')

    // Both values should be maintained
    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('mypassword')
  })
})
