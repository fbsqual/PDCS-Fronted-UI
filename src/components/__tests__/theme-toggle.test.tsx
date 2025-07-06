import { render, screen, fireEvent, waitFor } from '@/lib/test-utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { useTheme } from 'next-themes'

// Mock next-themes
jest.mock('next-themes')
const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>

describe('ThemeToggle Component', () => {
  const mockSetTheme = jest.fn()

  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      resolvedTheme: 'light',
      themes: ['light', 'dark', 'system'],
      systemTheme: 'light',
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows current theme icon', () => {
    render(<ThemeToggle />)
    // Should show sun icon for light theme
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
  })

  it('opens dropdown menu on click', async () => {
    render(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('button'))
    
    await waitFor(() => {
      expect(screen.getByText('浅色')).toBeInTheDocument()
      expect(screen.getByText('深色')).toBeInTheDocument()
      expect(screen.getByText('系统')).toBeInTheDocument()
    })
  })

  it('changes theme when menu item is clicked', async () => {
    render(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('button'))
    
    await waitFor(() => {
      expect(screen.getByText('深色')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('深色'))
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('shows correct icon for dark theme', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      resolvedTheme: 'dark',
      themes: ['light', 'dark', 'system'],
      systemTheme: 'light',
    })

    render(<ThemeToggle />)
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
  })

  it('shows correct icon for system theme', () => {
    mockUseTheme.mockReturnValue({
      theme: 'system',
      setTheme: mockSetTheme,
      resolvedTheme: 'light',
      themes: ['light', 'dark', 'system'],
      systemTheme: 'light',
    })

    render(<ThemeToggle />)
    expect(screen.getByTestId('system-icon')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    
    expect(button).toHaveAttribute('aria-label')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('handles keyboard navigation', async () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    
    // Focus the button
    button.focus()
    expect(button).toHaveFocus()
    
    // Press Enter to open menu
    fireEvent.keyDown(button, { key: 'Enter' })
    
    await waitFor(() => {
      expect(screen.getByText('浅色')).toBeInTheDocument()
    })
  })
})
