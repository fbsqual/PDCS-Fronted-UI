import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/index'

/**
 * 测试提供者组件
 * 包装所有必要的上下文提供者
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </ThemeProvider>
  )
}

/**
 * 自定义渲染函数
 * 自动包装测试提供者
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// 重新导出所有testing-library工具
export * from '@testing-library/react'

// 覆盖render方法
export { customRender as render }

/**
 * 测试工具函数
 */
export const testUtils = {
  /**
   * 创建模拟事件
   */
  createMockEvent: (type: string, properties: Record<string, any> = {}) => {
    const event = new Event(type, { bubbles: true, cancelable: true })
    Object.assign(event, properties)
    return event
  },

  /**
   * 创建模拟文件
   */
  createMockFile: (name: string, size: number = 1024, type: string = 'text/plain') => {
    const file = new File(['mock file content'], name, { type })
    Object.defineProperty(file, 'size', { value: size })
    return file
  },

  /**
   * 等待异步操作
   */
  waitFor: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * 模拟API响应
   */
  mockApiResponse: (data: any, success: boolean = true, status: number = 200) => ({
    data,
    success,
    status,
    message: success ? 'Success' : 'Error',
    timestamp: Date.now(),
  }),

  /**
   * 模拟fetch响应
   */
  mockFetchResponse: (data: any, status: number = 200, ok: boolean = true) => {
    return Promise.resolve({
      ok,
      status,
      statusText: ok ? 'OK' : 'Error',
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
      headers: new Headers(),
    } as Response)
  },

  /**
   * 模拟localStorage
   */
  mockLocalStorage: () => {
    const store: Record<string, string> = {}
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key]
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach(key => delete store[key])
      }),
    }
  },

  /**
   * 模拟IntersectionObserver
   */
  mockIntersectionObserver: () => {
    const mockIntersectionObserver = jest.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })
    window.IntersectionObserver = mockIntersectionObserver
    return mockIntersectionObserver
  },

  /**
   * 模拟ResizeObserver
   */
  mockResizeObserver: () => {
    const mockResizeObserver = jest.fn()
    mockResizeObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })
    window.ResizeObserver = mockResizeObserver
    return mockResizeObserver
  },

  /**
   * 模拟matchMedia
   */
  mockMatchMedia: (matches: boolean = false) => {
    const mockMatchMedia = jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))
    window.matchMedia = mockMatchMedia
    return mockMatchMedia
  },

  /**
   * 清理所有模拟
   */
  cleanup: () => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  },
}

/**
 * 自定义匹配器
 */
expect.extend({
  /**
   * 检查元素是否可见
   */
  toBeVisible(received) {
    const pass = received && received.style.display !== 'none' && received.style.visibility !== 'hidden'
    return {
      message: () => `expected element to ${pass ? 'not ' : ''}be visible`,
      pass,
    }
  },

  /**
   * 检查元素是否有特定类名
   */
  toHaveClass(received, className) {
    const pass = received && received.classList && received.classList.contains(className)
    return {
      message: () => `expected element to ${pass ? 'not ' : ''}have class "${className}"`,
      pass,
    }
  },

  /**
   * 检查API响应格式
   */
  toBeValidApiResponse(received) {
    const pass = received && 
      typeof received === 'object' &&
      'data' in received &&
      'success' in received &&
      typeof received.success === 'boolean'
    
    return {
      message: () => `expected ${received} to ${pass ? 'not ' : ''}be a valid API response`,
      pass,
    }
  },
})

// 类型声明
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeVisible(): R
      toHaveClass(className: string): R
      toBeValidApiResponse(): R
    }
  }
}
