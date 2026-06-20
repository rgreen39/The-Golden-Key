/**
 * Preservation Tests for Navbar
 * 
 * These tests capture behavior that must be PRESERVED after fixing the bugs.
 * They should PASS on both unfixed and fixed code.
 * 
 * **Validates: Requirements 3.5, 3.6**
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
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

describe('Property 2: Preservation - Profile Image Display', () => {
  /**
   * **IMPORTANT**: Follow observation-first methodology
   * 
   * Observe behavior on UNFIXED code for profile image:
   * - When `session.user.image` exists, it displays in Navbar
   * - Image has correct styling (rounded-full, border)
   * - Alt text includes user name when available
   * 
   * **EXPECTED OUTCOME**: Tests PASS on unfixed code (confirming baseline image display)
   * 
   * **Validates: Requirement 3.5**
   */

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('PRESERVATION: Should display profile image when session.user.image exists', () => {
    // Mock authenticated session with image
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          image: 'https://example.com/avatar.jpg',
        },
        expires: '2099-01-01',
      },
      status: 'authenticated',
      update: vi.fn(),
    })

    render(<Navbar />)

    // Should display profile image
    const profileImage = screen.getByAltText(/תמונת פרופיל של Test User/i)
    expect(profileImage).toBeInTheDocument()
    expect(profileImage).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('PRESERVATION: Should not crash when session.user.image is undefined', () => {
    // Mock authenticated session without image
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          image: undefined,
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

  it('PRESERVATION: Profile image alt text should include username or fallback', () => {
    // Mock session with name
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'שרה',
          image: 'https://example.com/avatar.jpg',
        },
        expires: '2099-01-01',
      },
      status: 'authenticated',
      update: vi.fn(),
    })

    render(<Navbar />)

    // Alt text should include name
    const profileImage = screen.getByAltText(/תמונת פרופיל של שרה/i)
    expect(profileImage).toBeInTheDocument()
  })
})

describe('Property 2: Preservation - Loading and Auth States', () => {
  /**
   * **IMPORTANT**: Follow observation-first methodology
   * 
   * Observe behavior on UNFIXED code for loading states:
   * - When status is 'loading', display "טוען..." 
   * - When unauthenticated, display "התחבר" button
   * - When authenticated, display "התנתק" button
   * 
   * **EXPECTED OUTCOME**: Tests PASS on unfixed code (confirming baseline state handling)
   * 
   * **Validates: Requirement 3.6**
   */

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('PRESERVATION: Should display loading text when session status is loading', () => {
    // Mock loading session
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'loading',
      update: vi.fn(),
    })

    render(<Navbar />)

    // Should display "טוען..."
    const loadingText = screen.getByText(/טוען\.\.\./i)
    expect(loadingText).toBeInTheDocument()
  })

  it('PRESERVATION: Should display התחבר button when unauthenticated', () => {
    // Mock unauthenticated session
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    })

    render(<Navbar />)

    // Should display "התחבר" button
    const signInButton = screen.getByRole('button', { name: /התחבר לחשבון/i })
    expect(signInButton).toBeInTheDocument()

    // Should NOT display "התנתק" button
    expect(screen.queryByRole('button', { name: /התנתק מהחשבון/i })).not.toBeInTheDocument()
  })

  it('PRESERVATION: Should display התנתק button when authenticated', () => {
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

    render(<Navbar />)

    // Should display "התנתק" button
    const signOutButton = screen.getByRole('button', { name: /התנתק מהחשבון/i })
    expect(signOutButton).toBeInTheDocument()

    // Should NOT display "התחבר" button
    expect(screen.queryByRole('button', { name: /התחבר לחשבון/i })).not.toBeInTheDocument()
  })

  it('PRESERVATION: Should display navigation links for all users', () => {
    // Mock unauthenticated session
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    })

    render(<Navbar />)

    // Should display navigation links (even when unauthenticated)
    // Note: Middleware will handle redirect on actual page access
    // Use getAllByText since links appear in both desktop and mobile nav
    expect(screen.getAllByText(/אני רוצה לאכול/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/יומן שבועי/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/רשימת קניות/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/תפריט חלומות/i).length).toBeGreaterThan(0)
  })
})
