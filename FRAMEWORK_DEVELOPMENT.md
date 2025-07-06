# PDCS UI Framework 开发指南

## 🔄 版本管理策略

### 语义化版本控制 (SemVer)
- **主版本号 (Major)**: 不兼容的API修改
- **次版本号 (Minor)**: 向下兼容的功能性新增
- **修订号 (Patch)**: 向下兼容的问题修正

### 分支策略
```
main          # 生产环境稳定版本
├── develop   # 开发主分支
├── feature/* # 功能开发分支
├── hotfix/*  # 紧急修复分支
└── release/* # 发布准备分支
```

## 🛠️ 开发工作流

### 1. 新功能开发
```bash
# 从develop创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/new-component

# 开发完成后合并回develop
git checkout develop
git merge feature/new-component
git push origin develop
```

### 2. 发布流程
```bash
# 创建发布分支
git checkout -b release/v1.1.0 develop

# 更新版本号和CHANGELOG
npm version minor

# 测试和修复
npm run test
npm run build

# 合并到main并打标签
git checkout main
git merge release/v1.1.0
git tag v1.1.0
git push origin main --tags

# 发布到npm
npm publish
```

## 📦 组件开发规范

### 组件结构
```
src/components/new-component/
├── index.ts              # 导出文件
├── new-component.tsx     # 主组件
├── new-component.test.tsx # 测试文件
├── new-component.stories.tsx # Storybook故事
└── types.ts              # 类型定义
```

### 代码规范
1. **TypeScript**: 所有组件必须使用TypeScript
2. **Props接口**: 每个组件都要有完整的Props接口定义
3. **文档注释**: 使用JSDoc格式的注释
4. **测试覆盖**: 每个组件都要有单元测试
5. **可访问性**: 遵循WCAG 2.1 AA标准

### 示例组件模板
```tsx
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * 新组件属性接口
 */
export interface NewComponentProps {
  /**
   * 组件内容
   */
  children?: React.ReactNode
  
  /**
   * 自定义样式类名
   */
  className?: string
  
  /**
   * 是否禁用
   */
  disabled?: boolean
}

/**
 * 新组件
 * 
 * @example
 * ```tsx
 * <NewComponent disabled={false}>
 *   内容
 * </NewComponent>
 * ```
 */
export const NewComponent = forwardRef<
  HTMLDivElement,
  NewComponentProps
>(({ children, className, disabled = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "base-styles",
        disabled && "disabled-styles",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

NewComponent.displayName = "NewComponent"
```

## 🧪 测试策略

### 单元测试
```bash
# 运行所有测试
npm run test

# 监听模式
npm run test:watch

# 覆盖率报告
npm run test:coverage
```

### 测试文件示例
```tsx
import { render, screen } from '@testing-library/react'
import { NewComponent } from './new-component'

describe('NewComponent', () => {
  it('renders correctly', () => {
    render(<NewComponent>Test content</NewComponent>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<NewComponent className="custom-class">Test</NewComponent>)
    expect(screen.getByText('Test')).toHaveClass('custom-class')
  })
})
```

## 📚 文档维护

### 自动生成文档
```bash
# 生成API文档
npm run docs:generate

# 启动文档服务器
npm run docs:serve
```

### Storybook集成
```bash
# 启动Storybook
npm run storybook

# 构建Storybook
npm run build-storybook
```

## 🔧 工具配置

### ESLint配置
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

### Prettier配置
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```
