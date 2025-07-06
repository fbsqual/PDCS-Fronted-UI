# 🧪 测试和质量保证指南

PDCS-Fronted-UI 框架提供了完整的测试和质量保证体系，确保代码质量、安全性和性能。本指南将帮助您了解如何使用这些工具来维护高质量的代码库。

## 🏗️ 测试架构

### 测试类型

#### 1. 单元测试 (Unit Tests)
- **目的**: 测试独立的函数、组件和模块
- **工具**: Jest + React Testing Library
- **覆盖范围**: 组件、Hooks、工具函数
- **运行速度**: 快速 (< 1秒)

#### 2. 集成测试 (Integration Tests)
- **目的**: 测试多个组件或模块的交互
- **工具**: Jest + React Testing Library
- **覆盖范围**: 页面级组件、API集成、状态管理
- **运行速度**: 中等 (1-5秒)

#### 3. 端到端测试 (E2E Tests)
- **目的**: 测试完整的用户流程
- **工具**: Playwright
- **覆盖范围**: 用户交互、页面导航、业务流程
- **运行速度**: 较慢 (5-30秒)

### 测试目录结构

```
__tests__/
├── components/             # 组件测试
│   ├── ui/
│   │   ├── button.test.tsx
│   │   ├── input.test.tsx
│   │   └── ...
│   ├── theme-provider.test.tsx
│   └── i18n-provider.test.tsx
├── hooks/                  # Hook测试
│   ├── use-local-storage.test.tsx
│   ├── use-theme.test.tsx
│   └── ...
├── utils/                  # 工具函数测试
│   ├── cn.test.ts
│   ├── format.test.ts
│   └── ...
├── integration/            # 集成测试
│   ├── theme-switching.test.tsx
│   ├── i18n-switching.test.tsx
│   └── ...
└── utils/                  # 测试工具
    ├── test-utils.tsx
    └── test-config.ts

e2e/
├── specs/                  # E2E测试规范
│   ├── basic.spec.ts
│   ├── components.spec.ts
│   └── ...
└── fixtures/               # 测试数据
    └── mock-data.json
```

## 🚀 快速开始

### 1. 初始化测试环境

```bash
# 初始化测试环境
npm run test:init

# 安装测试依赖
npm install
```

### 2. 运行测试

```bash
# 运行所有测试
npm run test:all

# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 运行E2E测试
npm run test:e2e

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监视模式运行测试
npm run test:watch
```

### 3. 质量检查

```bash
# 初始化质量保证工具
npm run quality:init

# 运行完整质量审计
npm run quality:audit

# 运行代码质量检查
npm run quality:lint

# 运行安全审计
npm run quality:security

# 检查代码格式
npm run format:check

# 自动修复格式问题
npm run format
```

## 📝 编写测试

### 组件测试示例

```typescript
import { render, screen, fireEvent } from '@/test-utils';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('is accessible', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});
```

### Hook测试示例

```typescript
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

  it('updates stored value when setter is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe('"updated"');
  });

  it('handles function updates', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));
    
    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });
    
    expect(result.current[0]).toBe(1);
  });
});
```

### E2E测试示例

```typescript
import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test('user can switch between light and dark themes', async ({ page }) => {
    await page.goto('/');
    
    // 验证默认主题
    await expect(page.locator('html')).toHaveAttribute('class', /light/);
    
    // 点击主题切换按钮
    await page.click('[data-testid="theme-toggle"]');
    
    // 验证主题已切换
    await expect(page.locator('html')).toHaveAttribute('class', /dark/);
    
    // 验证主题持久化
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('class', /dark/);
  });

  test('theme preference is saved in localStorage', async ({ page }) => {
    await page.goto('/');
    
    // 切换到暗色主题
    await page.click('[data-testid="theme-toggle"]');
    
    // 检查localStorage
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('dark');
  });
});
```

## 🔍 质量保证

### 代码质量检查

#### ESLint 配置
- **TypeScript规则**: 严格的类型检查
- **React规则**: Hooks和组件最佳实践
- **可访问性规则**: WCAG合规性检查
- **导入规则**: 模块导入顺序和规范

#### Prettier 配置
- **代码格式化**: 统一的代码风格
- **自动修复**: 格式问题自动修复
- **编辑器集成**: 保存时自动格式化

#### TypeScript 严格模式
- **严格类型检查**: 启用所有严格选项
- **未使用变量检查**: 检测未使用的变量和参数
- **精确可选属性**: 严格的可选属性类型检查

### 安全审计

#### npm audit
- **依赖漏洞扫描**: 检查已知安全漏洞
- **自动修复**: 自动更新有漏洞的依赖
- **报告生成**: 详细的安全报告

#### 敏感信息扫描
- **API密钥检测**: 扫描硬编码的API密钥
- **密码检测**: 检测明文密码
- **令牌检测**: 扫描访问令牌和秘钥

### 性能分析

#### 包大小分析
- **Bundle分析**: 分析打包后的文件大小
- **依赖分析**: 识别大型依赖项
- **优化建议**: 提供性能优化建议

#### 性能最佳实践
- **图片优化**: 检查图片优化配置
- **代码分割**: 验证代码分割实现
- **懒加载**: 检查懒加载配置
- **缓存策略**: 验证缓存配置

### 可访问性检查

#### WCAG合规性
- **语义化HTML**: 检查HTML语义化
- **键盘导航**: 验证键盘可访问性
- **屏幕阅读器**: 检查屏幕阅读器支持
- **颜色对比度**: 验证颜色对比度

## 📊 测试覆盖率

### 覆盖率目标

| 类型 | 目标覆盖率 | 说明 |
|------|------------|------|
| 语句覆盖率 | ≥ 80% | 代码语句执行覆盖率 |
| 分支覆盖率 | ≥ 80% | 条件分支覆盖率 |
| 函数覆盖率 | ≥ 80% | 函数调用覆盖率 |
| 行覆盖率 | ≥ 80% | 代码行覆盖率 |

### 覆盖率报告

```bash
# 生成覆盖率报告
npm run test:coverage

# 查看HTML报告
open coverage/lcov-report/index.html
```

### 覆盖率配置

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## 🔄 持续集成

### GitHub Actions 工作流

```yaml
name: Quality Assurance

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run quality:audit
      - run: npm run test:all
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### 质量门禁

- **测试通过**: 所有测试必须通过
- **覆盖率达标**: 覆盖率必须达到设定目标
- **代码质量**: ESLint检查必须通过
- **安全审计**: 不能有高危安全漏洞
- **格式检查**: 代码格式必须符合规范

## 🛠️ 测试工具和配置

### Jest 配置

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  }
};
```

### Playwright 配置

```javascript
// playwright.config.js
module.exports = {
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } }
  ]
};
```

### 测试工具函数

```typescript
// __tests__/utils/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme-provider';
import { I18nProvider } from '@/components/i18n-provider';

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

export * from '@testing-library/react';
export { customRender as render };
```

## 📈 最佳实践

### 测试编写原则

1. **AAA模式**: Arrange（准备）、Act（执行）、Assert（断言）
2. **单一职责**: 每个测试只验证一个功能点
3. **独立性**: 测试之间不应相互依赖
4. **可读性**: 测试名称应清晰描述测试内容
5. **可维护性**: 使用测试工具函数减少重复代码

### 质量保证流程

1. **开发阶段**: 编写代码的同时编写测试
2. **提交前**: 运行本地质量检查
3. **代码审查**: 审查测试覆盖率和质量
4. **持续集成**: 自动运行所有检查
5. **部署前**: 运行完整的测试套件

### 性能优化

1. **并行执行**: 利用多核CPU并行运行测试
2. **测试分组**: 将快速测试和慢速测试分组
3. **缓存优化**: 利用CI缓存加速构建
4. **增量测试**: 只运行受影响的测试

## 🆘 故障排除

### 常见问题

**1. 测试运行缓慢**
```bash
# 并行运行测试
npm run test:unit -- --maxWorkers=4

# 只运行变更相关的测试
npm run test:unit -- --onlyChanged
```

**2. 覆盖率不达标**
```bash
# 查看详细覆盖率报告
npm run test:coverage
open coverage/lcov-report/index.html
```

**3. E2E测试失败**
```bash
# 启用调试模式
npm run test:e2e -- --debug

# 查看测试录像
npx playwright show-trace test-results/trace.zip
```

**4. 质量检查失败**
```bash
# 自动修复格式问题
npm run format

# 自动修复ESLint问题
npm run lint:fix
```

### 获取帮助

1. **查看测试报告**: 检查详细的测试和质量报告
2. **调试模式**: 使用调试模式运行失败的测试
3. **日志分析**: 分析测试和构建日志
4. **社区支持**: 在GitHub Issues中寻求帮助

---

通过这个完整的测试和质量保证体系，您可以确保PDCS-Fronted-UI框架的代码质量、安全性和性能，为用户提供稳定可靠的开发体验。
