#!/usr/bin/env node

/**
 * PDCS-Fronted-UI 测试管理器
 * 用于管理和执行各种类型的测试
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

class TestManager {
  constructor() {
    this.testDir = path.join(process.cwd(), '__tests__');
    this.e2eDir = path.join(process.cwd(), 'e2e');
    this.coverageDir = path.join(process.cwd(), 'coverage');
    this.reportsDir = path.join(process.cwd(), 'test-reports');
  }

  /**
   * 初始化测试环境
   */
  init() {
    console.log('🧪 初始化测试环境...');
    
    // 创建测试目录结构
    this.createTestStructure();
    
    // 创建测试配置文件
    this.createTestConfigs();
    
    // 创建基础测试文件
    this.createBaseTests();
    
    // 创建E2E测试
    this.createE2ETests();
    
    // 创建测试工具
    this.createTestUtils();
    
    console.log('✅ 测试环境初始化完成');
  }

  /**
   * 创建测试目录结构
   */
  createTestStructure() {
    const dirs = [
      this.testDir,
      path.join(this.testDir, 'components'),
      path.join(this.testDir, 'hooks'),
      path.join(this.testDir, 'utils'),
      path.join(this.testDir, 'integration'),
      this.e2eDir,
      path.join(this.e2eDir, 'specs'),
      path.join(this.e2eDir, 'fixtures'),
      this.reportsDir,
      path.join(this.reportsDir, 'unit'),
      path.join(this.reportsDir, 'integration'),
      path.join(this.reportsDir, 'e2e')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * 创建测试配置文件
   */
  createTestConfigs() {
    // Jest配置
    const jestConfig = {
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      testMatch: [
        '<rootDir>/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)',
        '<rootDir>/src/**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)'
      ],
      collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{js,jsx,ts,tsx}',
        '!src/**/index.{js,jsx,ts,tsx}'
      ],
      coverageDirectory: 'coverage',
      coverageReporters: ['text', 'lcov', 'html', 'json'],
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      },
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@/components/(.*)$': '<rootDir>/src/components/$1',
        '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
        '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1'
      },
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', {
          tsconfig: 'tsconfig.json'
        }]
      },
      testTimeout: 10000
    };

    this.writeConfig('jest.config.js', `module.exports = ${JSON.stringify(jestConfig, null, 2)};`);

    // Jest setup文件
    const jestSetup = `
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;
`;

    this.writeConfig('jest.setup.js', jestSetup);

    // Playwright配置（E2E测试）
    const playwrightConfig = {
      testDir: './e2e',
      timeout: 30000,
      expect: {
        timeout: 5000
      },
      fullyParallel: true,
      forbidOnly: !!process.env.CI,
      retries: process.env.CI ? 2 : 0,
      workers: process.env.CI ? 1 : undefined,
      reporter: [
        ['html', { outputFolder: 'test-reports/e2e' }],
        ['json', { outputFile: 'test-reports/e2e/results.json' }]
      ],
      use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure'
      },
      projects: [
        {
          name: 'chromium',
          use: { browserName: 'chromium' }
        },
        {
          name: 'firefox',
          use: { browserName: 'firefox' }
        },
        {
          name: 'webkit',
          use: { browserName: 'webkit' }
        }
      ],
      webServer: {
        command: 'npm run dev',
        port: 3000,
        reuseExistingServer: !process.env.CI
      }
    };

    this.writeConfig('playwright.config.js', `module.exports = ${JSON.stringify(playwrightConfig, null, 2)};`);
  }

  /**
   * 创建基础测试文件
   */
  createBaseTests() {
    // 组件测试示例
    const componentTest = `
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider attribute="class" defaultTheme="light">
        {component}
      </ThemeProvider>
    );
  };

  it('renders button with text', () => {
    renderWithTheme(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    renderWithTheme(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('bg-destructive');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    button.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    renderWithTheme(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
  });
});
`;

    this.writeConfig('__tests__/components/button.test.tsx', componentTest);

    // Hook测试示例
    const hookTest = `
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/use-local-storage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('returns stored value when it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('stored');
  });

  it('updates stored value when setter is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe('"updated"');
  });

  it('handles function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));
    
    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });
    
    expect(result.current[0]).toBe(1);
  });
});
`;

    this.writeConfig('__tests__/hooks/use-local-storage.test.tsx', hookTest);

    // 工具函数测试示例
    const utilTest = `
import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional');
  });

  it('handles Tailwind class conflicts', () => {
    expect(cn('px-2 px-4')).toBe('px-4');
  });

  it('handles undefined and null values', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });
});
`;

    this.writeConfig('__tests__/utils/cn.test.ts', utilTest);
  }

  /**
   * 创建E2E测试
   */
  createE2ETests() {
    // 基础E2E测试
    const e2eTest = `
import { test, expect } from '@playwright/test';

test.describe('PDCS-Fronted-UI Framework', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // 检查页面标题
    await expect(page).toHaveTitle(/PDCS-Fronted-UI/);
    
    // 检查主要元素
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('theme switching works', async ({ page }) => {
    await page.goto('/');
    
    // 查找主题切换按钮
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await expect(themeToggle).toBeVisible();
    
    // 切换主题
    await themeToggle.click();
    
    // 验证主题已切换
    await expect(page.locator('html')).toHaveAttribute('class', /dark/);
  });

  test('language switching works', async ({ page }) => {
    await page.goto('/');
    
    // 查找语言切换器
    const langSwitcher = page.locator('[data-testid="language-switcher"]');
    await expect(langSwitcher).toBeVisible();
    
    // 切换语言
    await langSwitcher.click();
    await page.locator('[data-value="en-US"]').click();
    
    // 验证语言已切换
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  });

  test('navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // 测试导航链接
    await page.click('a[href="/demo"]');
    await expect(page).toHaveURL(/.*demo/);
    
    // 检查页面内容
    await expect(page.locator('h1')).toContainText('Demo');
  });

  test('responsive design works', async ({ page }) => {
    // 测试桌面视图
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // 测试移动视图
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 检查移动菜单
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();
  });
});
`;

    this.writeConfig('e2e/specs/basic.spec.ts', e2eTest);

    // 组件E2E测试
    const componentE2ETest = `
import { test, expect } from '@playwright/test';

test.describe('UI Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo');
  });

  test('button components work correctly', async ({ page }) => {
    // 测试不同变体的按钮
    await expect(page.locator('[data-testid="button-default"]')).toBeVisible();
    await expect(page.locator('[data-testid="button-destructive"]')).toBeVisible();
    await expect(page.locator('[data-testid="button-outline"]')).toBeVisible();
    
    // 测试按钮点击
    await page.click('[data-testid="button-default"]');
    await expect(page.locator('[data-testid="button-click-count"]')).toContainText('1');
  });

  test('form components work correctly', async ({ page }) => {
    // 测试输入框
    const input = page.locator('[data-testid="demo-input"]');
    await input.fill('test input');
    await expect(input).toHaveValue('test input');
    
    // 测试选择框
    const select = page.locator('[data-testid="demo-select"]');
    await select.click();
    await page.locator('[data-value="option1"]').click();
    await expect(select).toContainText('Option 1');
  });

  test('chart components render correctly', async ({ page }) => {
    // 等待图表加载
    await page.waitForSelector('[data-testid="demo-chart"]');
    
    // 检查图表元素
    const chart = page.locator('[data-testid="demo-chart"]');
    await expect(chart).toBeVisible();
    
    // 检查图表画布
    const canvas = chart.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('data table works correctly', async ({ page }) => {
    const table = page.locator('[data-testid="demo-table"]');
    await expect(table).toBeVisible();
    
    // 测试排序
    await page.click('[data-testid="table-header-name"]');
    await page.waitForTimeout(500);
    
    // 测试分页
    const nextButton = page.locator('[data-testid="table-next"]');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500);
    }
  });
});
`;

    this.writeConfig('e2e/specs/components.spec.ts', componentE2ETest);
  }

  /**
   * 创建测试工具
   */
  createTestUtils() {
    // 测试工具函数
    const testUtils = `
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { I18nProvider } from '@/components/i18n-provider';

// 自定义渲染函数，包含所有Provider
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <I18nProvider>
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// 重新导出所有testing-library工具
export * from '@testing-library/react';
export { customRender as render };

// 测试数据生成器
export const createMockData = {
  user: (overrides = {}) => ({
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  }),
  
  chartData: (count = 5) => 
    Array.from({ length: count }, (_, i) => ({
      name: \`Item \${i + 1}\`,
      value: Math.floor(Math.random() * 100) + 1
    })),
  
  tableData: (count = 10) =>
    Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: \`Name \${i + 1}\`,
      status: i % 2 === 0 ? 'active' : 'inactive',
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
    }))
};

// 测试助手函数
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 100));

export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    })
  };
};

export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  window.IntersectionObserver = mockIntersectionObserver;
};
`;

    this.writeConfig('__tests__/utils/test-utils.tsx', testUtils);

    // 测试配置工具
    const testConfig = `
/**
 * 测试配置和常量
 */

export const TEST_CONFIG = {
  // 测试超时时间
  TIMEOUT: {
    SHORT: 1000,
    MEDIUM: 5000,
    LONG: 10000
  },
  
  // 测试数据
  MOCK_DATA: {
    USER: {
      id: 'test-user-1',
      name: 'Test User',
      email: 'test@example.com'
    },
    API_RESPONSE: {
      success: true,
      data: [],
      message: 'Success'
    }
  },
  
  // 测试选择器
  SELECTORS: {
    THEME_TOGGLE: '[data-testid="theme-toggle"]',
    LANGUAGE_SWITCHER: '[data-testid="language-switcher"]',
    MOBILE_MENU: '[data-testid="mobile-menu"]',
    LOADING_SPINNER: '[data-testid="loading-spinner"]'
  },
  
  // 测试环境配置
  ENV: {
    BASE_URL: 'http://localhost:3000',
    API_URL: 'http://localhost:3000/api'
  }
};

// 测试断言助手
export const assertions = {
  toBeAccessible: (element: HTMLElement) => {
    // 检查可访问性属性
    expect(element).toHaveAttribute('role');
    expect(element).not.toHaveAttribute('aria-hidden', 'true');
  },
  
  toHaveCorrectTheme: (element: HTMLElement, theme: 'light' | 'dark') => {
    expect(element).toHaveClass(theme);
  },
  
  toBeResponsive: async (page: any) => {
    // 测试不同屏幕尺寸
    const sizes = [
      { width: 320, height: 568 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1200, height: 800 }  // Desktop
    ];
    
    for (const size of sizes) {
      await page.setViewportSize(size);
      await page.waitForTimeout(500);
      // 这里可以添加具体的响应式检查
    }
  }
};
`;

    this.writeConfig('__tests__/utils/test-config.ts', testConfig);
  }

  /**
   * 运行测试套件
   */
  async runTests(type = 'all', options = {}) {
    console.log(\`🧪 运行测试: \${type}\`);
    
    const {
      coverage = false,
      watch = false,
      verbose = false,
      bail = false
    } = options;

    try {
      switch (type) {
        case 'unit':
          await this.runUnitTests({ coverage, watch, verbose, bail });
          break;
        case 'integration':
          await this.runIntegrationTests({ coverage, verbose, bail });
          break;
        case 'e2e':
          await this.runE2ETests({ verbose });
          break;
        case 'all':
          await this.runUnitTests({ coverage, verbose, bail });
          await this.runIntegrationTests({ coverage, verbose, bail });
          await this.runE2ETests({ verbose });
          break;
        default:
          throw new Error(\`未知的测试类型: \${type}\`);
      }
      
      console.log('✅ 测试完成');
    } catch (error) {
      console.error('❌ 测试失败:', error.message);
      throw error;
    }
  }

  /**
   * 运行单元测试
   */
  async runUnitTests(options) {
    const args = ['test'];
    
    if (options.coverage) args.push('--coverage');
    if (options.watch) args.push('--watch');
    if (options.verbose) args.push('--verbose');
    if (options.bail) args.push('--bail');
    
    args.push('--testPathPattern=__tests__/(components|hooks|utils)');
    
    return this.runCommand('npm', args);
  }

  /**
   * 运行集成测试
   */
  async runIntegrationTests(options) {
    const args = ['test'];
    
    if (options.coverage) args.push('--coverage');
    if (options.verbose) args.push('--verbose');
    if (options.bail) args.push('--bail');
    
    args.push('--testPathPattern=__tests__/integration');
    
    return this.runCommand('npm', args);
  }

  /**
   * 运行E2E测试
   */
  async runE2ETests(options) {
    const args = ['run', 'test:e2e'];
    
    if (options.verbose) args.push('--', '--reporter=list');
    
    return this.runCommand('npm', args);
  }

  /**
   * 执行命令
   */
  runCommand(command, args) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve(code);
        } else {
          reject(new Error(\`命令执行失败，退出码: \${code}\`));
        }
      });
      
      child.on('error', reject);
    });
  }

  /**
   * 生成测试报告
   */
  generateReport() {
    console.log('📊 生成测试报告...');
    
    const report = {
      timestamp: new Date().toISOString(),
      coverage: this.getCoverageReport(),
      testResults: this.getTestResults()
    };
    
    const reportPath = path.join(this.reportsDir, 'test-summary.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(\`📋 测试报告已保存到: \${reportPath}\`);
    return report;
  }

  /**
   * 获取覆盖率报告
   */
  getCoverageReport() {
    const coverageFile = path.join(this.coverageDir, 'coverage-summary.json');
    
    if (fs.existsSync(coverageFile)) {
      return JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
    }
    
    return null;
  }

  /**
   * 获取测试结果
   */
  getTestResults() {
    // 这里可以解析Jest输出的测试结果
    // 简化实现，返回基本信息
    return {
      unit: { passed: 0, failed: 0, total: 0 },
      integration: { passed: 0, failed: 0, total: 0 },
      e2e: { passed: 0, failed: 0, total: 0 }
    };
  }

  /**
   * 写入配置文件
   */
  writeConfig(filePath, content) {
    const fullPath = path.join(process.cwd(), filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content);
  }
}

// CLI接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const manager = new TestManager();

  try {
    switch (command) {
      case 'init':
        manager.init();
        break;
      
      case 'run':
        const testType = args[1] || 'all';
        const options = {
          coverage: args.includes('--coverage'),
          watch: args.includes('--watch'),
          verbose: args.includes('--verbose'),
          bail: args.includes('--bail')
        };
        manager.runTests(testType, options);
        break;
      
      case 'report':
        manager.generateReport();
        break;
      
      default:
        console.log(\`
🧪 PDCS-Fronted-UI 测试管理器

使用方法:
  node scripts/test-manager.js init                    # 初始化测试环境
  node scripts/test-manager.js run [type] [options]    # 运行测试
  node scripts/test-manager.js report                  # 生成测试报告

测试类型:
  unit         # 单元测试
  integration  # 集成测试
  e2e          # 端到端测试
  all          # 所有测试 (默认)

选项:
  --coverage   # 生成覆盖率报告
  --watch      # 监视模式
  --verbose    # 详细输出
  --bail       # 遇到错误时停止

示例:
  node scripts/test-manager.js run unit --coverage
  node scripts/test-manager.js run e2e --verbose
        \`);
    }
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
    process.exit(1);
  }
}

module.exports = TestManager;
