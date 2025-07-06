// Jest setup file
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    resolvedTheme: 'light',
    themes: ['light', 'dark', 'system'],
    systemTheme: 'light',
  }),
  ThemeProvider: ({ children }) => children,
}))

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, defaultValue) => defaultValue || key,
    i18n: {
      language: 'zh-CN',
      changeLanguage: jest.fn(),
    },
  }),
  Trans: ({ children }) => children,
  I18nextProvider: ({ children }) => children,
}))

// Mock Recharts
jest.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  Bar: () => <div data-testid="bar" />,
  Pie: () => <div data-testid="pie" />,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  Cell: () => <div data-testid="cell" />,
}))

// Mock Radix UI components
jest.mock('@radix-ui/react-dropdown-menu', () => ({
  Root: ({ children }) => <div data-testid="dropdown-root">{children}</div>,
  Trigger: ({ children, ...props }) => <button data-testid="dropdown-trigger" {...props}>{children}</button>,
  Content: ({ children }) => <div data-testid="dropdown-content">{children}</div>,
  Item: ({ children, ...props }) => <div data-testid="dropdown-item" {...props}>{children}</div>,
  CheckboxItem: ({ children, ...props }) => <div data-testid="dropdown-checkbox-item" {...props}>{children}</div>,
  RadioItem: ({ children, ...props }) => <div data-testid="dropdown-radio-item" {...props}>{children}</div>,
  Label: ({ children, ...props }) => <div data-testid="dropdown-label" {...props}>{children}</div>,
  Separator: () => <div data-testid="dropdown-separator" />,
  Group: ({ children }) => <div data-testid="dropdown-group">{children}</div>,
  Portal: ({ children }) => <div data-testid="dropdown-portal">{children}</div>,
  Sub: ({ children }) => <div data-testid="dropdown-sub">{children}</div>,
  SubContent: ({ children }) => <div data-testid="dropdown-sub-content">{children}</div>,
  SubTrigger: ({ children, ...props }) => <div data-testid="dropdown-sub-trigger" {...props}>{children}</div>,
  ItemIndicator: ({ children }) => <div data-testid="dropdown-item-indicator">{children}</div>,
}))

// Mock sql.js
jest.mock('sql.js', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    Database: jest.fn().mockImplementation(() => ({
      run: jest.fn(),
      prepare: jest.fn().mockReturnValue({
        step: jest.fn().mockReturnValue(false),
        getAsObject: jest.fn().mockReturnValue({}),
        free: jest.fn(),
        run: jest.fn(),
      }),
      exec: jest.fn().mockReturnValue([]),
      export: jest.fn().mockReturnValue(new Uint8Array()),
      close: jest.fn(),
      getRowsModified: jest.fn().mockReturnValue(0),
    })),
  }),
}))

// Mock localforage
jest.mock('localforage', () => ({
  createInstance: jest.fn().mockReturnValue({
    setItem: jest.fn().mockResolvedValue(undefined),
    getItem: jest.fn().mockResolvedValue(null),
    removeItem: jest.fn().mockResolvedValue(undefined),
    clear: jest.fn().mockResolvedValue(undefined),
    iterate: jest.fn().mockResolvedValue(undefined),
  }),
}))

// Mock fetch
global.fetch = jest.fn()

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn().mockReturnValue('mock-url')
global.URL.revokeObjectURL = jest.fn()

// Mock FileReader
global.FileReader = jest.fn().mockImplementation(() => ({
  readAsArrayBuffer: jest.fn(),
  readAsDataURL: jest.fn(),
  readAsText: jest.fn(),
  onload: null,
  onerror: null,
  result: null,
}))

// Mock performance
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
    },
    getEntriesByType: jest.fn().mockReturnValue([{
      navigationStart: 0,
      domContentLoadedEventEnd: 1000,
      loadEventEnd: 2000,
    }]),
  },
})

// Mock navigator.connection
Object.defineProperty(navigator, 'connection', {
  writable: true,
  value: {
    effectiveType: '4g',
    downlink: 10,
    rtt: 100,
  },
})

// Suppress console warnings in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
