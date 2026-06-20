/**
 * Bug Exploration Tests for Navbar Issues
 * 
 * These tests are designed to FAIL on unfixed code to confirm bugs exist.
 * They encode the expected behavior and will pass once the bugs are fixed.
 * 
 * **Validates: Requirements 1.3, 1.4, 2.3, 2.4**
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from './Navbar'

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}))

// Mock components
vi.mock('./FallsModal', () => ({
  default: () => null,
}))

vi.mock('./WeightModal', () => ({
  default: () => null,
}))

import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'

describe('Bug 1.2.1: Session Cleanup After Signout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock authenticated session
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
        expires: '2099-01-01',
      },
      status: 'authenticated',
      update: vi.fn(),
    })
  })

  it('EXPLORATION TEST: Should call signOut with redirect: true when clicking התנתק', async () => {
    /**
     * **Property 1: Bug Condition** - Session Cleanup After Signout
     * 
     * **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
     * **DO NOT attempt to fix the test or the code when it fails**
     * 
     * **GOAL**: Surface counterexamples that demonstrate the session cleanup bug exists
     * 
     * **Expected Behavior from Design**: 
     * - Session is cleared immediately on signout
     * - User is redirected to `/auth/signin` without delay
     * - signOut is called with redirect: true parameter
     * 
     * **EXPECTED OUTCOME**: Test FAILS (signOut is called without redirect: true)
     * 
     * **Validates: Requirements 1.3, 2.3**
     */

    const user = userEvent.setup()
    render(<Navbar />)

    // Find and click the התנתק button
    const signOutButton = screen.getByRole('button', { name: /התנתק מהחשבון/i })
    await user.click(signOutButton)

    // BUG CHECK: On unfixed code, this assertion will FAIL
    // signOut is called without redirect: true parameter
    expect(signOut).toHaveBeenCalledWith({ 
      callbackUrl: '/auth/signin',
      redirect: true  // This parameter is missing in unfixed code
    })

    // Counterexample documentation:
    // If this test fails, it confirms:
    // - signOut was called with only { callbackUrl: '/auth/signin' }
    // - Missing redirect: true prevents proper session cleanup
  })
})

describe('Bug 1.3.1: Username Display in Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('EXPLORATION TEST: Should display username when session.user.name exists', () => {
    /**
     * **Property 1: Bug Condition** - Username Display in Navbar
     * 
     * **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
     * **DO NOT attempt to fix the test or the code when it fails**
     * 
     * **GOAL**: Surface counterexamples that demonstrate the username display bug exists
     * 
     * **Expected Behavior from Design**: 
     * - When `session.user.name` exists, display it in Navbar
     * - Format: "שלום ל[user name]"
     * - Display between profile image and "התנתק" button
     * 
     * **EXPECTED OUTCOME**: Test FAILS (username is not displayed in Navbar)
     * 
     * **Validates: Requirements 1.4, 2.4**
     */

    // Mock authenticated session with name
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'שרה',
        },
        expires: '2099-01-01',
      },
      status: 'authenticated',
      update: vi.fn(),
    })

    render(<Navbar />)

    // BUG CHECK: On unfixed code, this assertion will FAIL
    // The username is not displayed in the Navbar
    const usernameDisplay = screen.getByText(/שלום לשרה/i)
    expect(usernameDisplay).toBeInTheDocument()

    // Also check that התנתק button exists (to ensure we're in the right section)
    const signOutButton = screen.getByRole('button', { name: /התנתק מהחשבון/i })
    expect(signOutButton).toBeInTheDocument()

    // Counterexample documentation:
    // If this test fails, it confirms:
    // - Navbar shows התנתק button and (possibly) profile image
    // - But username "שרה" is NOT displayed in format "שלום לשרה"
  })

  it('EXPLORATION TEST: Should not crash when session.user.name is undefined', () => {
    /**
     * Additional check: Navbar should handle undefined name gracefully
     */

    // Mock authenticated session without name
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: undefined,
        },
        expires: '2099-01-01',
      },
      status: 'authenticated',
      update: vi.fn(),
    })

    // Should not crash
    expect(() => render(<Navbar />)).not.toThrow()

    // Should still show התנתק button
    const signOutButton = screen.getByRole('button', { name: /התנתק מהחשבון/i })
    expect(signOutButton).toBeInTheDocument()
  })
})
