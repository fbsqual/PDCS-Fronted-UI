# 🚀 PDCS-Fronted-UI 升级指南

本指南将帮助您安全地将使用PDCS-Fronted-UI框架创建的项目升级到最新版本，确保升级过程顺利且不会破坏现有功能。

## 📋 升级前准备

### 1. 备份项目

```bash
# 创建项目备份
cp -r your-project your-project-backup

# 或使用Git创建分支
git checkout -b upgrade-pdcs-ui
git add .
git commit -m "Backup before PDCS-UI upgrade"
```

### 2. 检查当前版本

```bash
# 检查当前框架版本
npm list pdcs-fronted-ui

# 检查可用更新
npm run sync:check
```

### 3. 阅读变更日志

在升级前，请仔细阅读 [CHANGELOG.md](./CHANGELOG.md) 了解：
- 新功能和改进
- 破坏性变更
- 弃用的功能
- 迁移说明

## 🔄 自动升级流程

### 使用框架同步工具

```bash
# 检查可用更新
npm run sync:check

# 执行自动升级
npm run sync:update

# 验证升级结果
npm run test:all
npm run quality:audit
```

### 升级过程说明

1. **依赖更新**: 自动更新框架相关依赖
2. **配置迁移**: 自动迁移配置文件
3. **代码更新**: 应用必要的代码变更
4. **测试验证**: 运行测试确保功能正常

## 📝 手动升级步骤

如果自动升级失败或需要更精细的控制，可以按以下步骤手动升级：

### 步骤 1: 更新依赖

```bash
# 更新核心依赖
npm update next react react-dom

# 更新UI组件库
npm update @radix-ui/react-* lucide-react

# 更新开发依赖
npm update @types/node @types/react @types/react-dom
npm update eslint typescript tailwindcss

# 更新测试依赖
npm update @testing-library/react @testing-library/jest-dom
npm update jest @playwright/test
```

### 步骤 2: 更新配置文件

#### Next.js 配置
```javascript
// next.config.js - 检查是否需要更新
const nextConfig = {
  experimental: {
    appDir: true, // 如果使用App Router
  },
  images: {
    domains: ['example.com'], // 更新图片域名配置
  },
  // 添加新的配置选项
};

module.exports = nextConfig;
```

#### TypeScript 配置
```json
// tsconfig.json - 更新编译选项
{
  "compilerOptions": {
    "target": "es2017", // 可能需要更新
    "moduleResolution": "bundler", // Next.js 13.5+
    "allowImportingTsExtensions": true, // 新选项
    "noEmit": true
  }
}
```

#### Tailwind CSS 配置
```javascript
// tailwind.config.js - 检查新的配置选项
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 检查是否有新的主题配置
    },
  },
  plugins: [
    // 检查是否需要新的插件
  ],
};
```

### 步骤 3: 更新代码

#### 组件更新
```typescript
// 检查组件API变更
import { Button } from '@/components/ui/button';

// 旧版本
<Button variant="default" size="md">Click me</Button>

// 新版本（如果有变更）
<Button variant="default" size="default">Click me</Button>
```

#### Hook更新
```typescript
// 检查Hook API变更
import { useTheme } from '@/hooks/use-theme';

const { theme, setTheme } = useTheme();

// 检查是否有新的返回值或参数
```

#### 工具函数更新
```typescript
// 检查工具函数签名变更
import { cn, formatDate } from '@/lib/utils';

// 确保函数调用方式仍然正确
const className = cn('base-class', conditionalClass);
```

### 步骤 4: 更新样式

```css
/* 检查CSS变量更新 */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* 检查是否有新的CSS变量 */
}

/* 检查新的工具类 */
.custom-component {
  @apply bg-background text-foreground;
  /* 确保使用的类名仍然存在 */
}
```

## 🔍 版本特定升级指南

### 从 v1.x 升级到 v2.x

#### 主要变更
- **组件API变更**: Button组件的size属性值变更
- **主题系统升级**: 新增更多CSS变量
- **国际化改进**: 支持更多语言和地区

#### 迁移步骤
```bash
# 1. 运行迁移脚本
npm run migrate:v1-to-v2

# 2. 更新组件使用
# 将所有 size="md" 改为 size="default"
find src -name "*.tsx" -exec sed -i 's/size="md"/size="default"/g' {} \;

# 3. 更新主题配置
npm run config:migrate-theme
```

### 从 v2.x 升级到 v3.x

#### 主要变更
- **TypeScript 5.0**: 升级到TypeScript 5.0
- **React 18**: 完全支持React 18特性
- **性能优化**: 改进的代码分割和懒加载

#### 迁移步骤
```bash
# 1. 更新TypeScript配置
npm run migrate:typescript-5

# 2. 更新React相关代码
npm run migrate:react-18

# 3. 优化性能配置
npm run optimize:performance
```

## ⚠️ 破坏性变更处理

### 识别破坏性变更

```bash
# 运行兼容性检查
npm run check:compatibility

# 生成变更报告
npm run generate:change-report
```

### 常见破坏性变更

#### 1. 组件属性变更
```typescript
// 旧版本
<Button variant="primary" size="large">

// 新版本
<Button variant="default" size="lg">
```

#### 2. Hook返回值变更
```typescript
// 旧版本
const { theme } = useTheme();

// 新版本
const { theme, systemTheme } = useTheme();
```

#### 3. 工具函数签名变更
```typescript
// 旧版本
formatDate(date, 'YYYY-MM-DD');

// 新版本
formatDate(date, { format: 'YYYY-MM-DD' });
```

### 自动修复工具

```bash
# 运行自动修复
npm run fix:breaking-changes

# 手动修复特定问题
npm run fix:component-props
npm run fix:hook-usage
npm run fix:utility-functions
```

## 🧪 升级后验证

### 1. 运行测试套件

```bash
# 运行所有测试
npm run test:all

# 运行特定测试
npm run test:unit
npm run test:integration
npm run test:e2e
```

### 2. 质量检查

```bash
# 运行质量审计
npm run quality:audit

# 检查代码质量
npm run lint
npm run type-check

# 检查格式
npm run format:check
```

### 3. 功能验证

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run start
```

### 4. 性能测试

```bash
# 运行性能测试
npm run test:performance

# 分析包大小
npm run analyze:bundle

# 检查Core Web Vitals
npm run test:vitals
```

## 🔧 故障排除

### 常见升级问题

#### 1. 依赖冲突
```bash
# 清理依赖
rm -rf node_modules package-lock.json
npm install

# 解决peer dependency警告
npm install --legacy-peer-deps
```

#### 2. TypeScript错误
```bash
# 重新生成类型定义
npm run type:generate

# 检查TypeScript配置
npm run type:check-config
```

#### 3. 样式问题
```bash
# 重新构建CSS
npm run build:css

# 检查Tailwind配置
npm run tailwind:check
```

#### 4. 测试失败
```bash
# 更新测试快照
npm run test:update-snapshots

# 重新生成测试配置
npm run test:init
```

### 回滚升级

如果升级后出现严重问题，可以回滚到之前的版本：

```bash
# 使用Git回滚
git checkout upgrade-pdcs-ui
git reset --hard HEAD~1

# 或恢复备份
rm -rf your-project
mv your-project-backup your-project
cd your-project
npm install
```

## 📊 升级检查清单

### 升级前
- [ ] 创建项目备份
- [ ] 阅读变更日志
- [ ] 检查当前版本
- [ ] 运行现有测试
- [ ] 记录当前配置

### 升级过程
- [ ] 更新依赖包
- [ ] 迁移配置文件
- [ ] 更新代码调用
- [ ] 修复破坏性变更
- [ ] 更新文档

### 升级后
- [ ] 运行所有测试
- [ ] 执行质量检查
- [ ] 验证核心功能
- [ ] 检查性能指标
- [ ] 更新部署配置

## 🆘 获取帮助

### 支持渠道

1. **文档**: 查看详细的API文档和指南
2. **GitHub Issues**: 报告问题和获取帮助
3. **讨论区**: 参与社区讨论
4. **示例项目**: 参考最新的示例代码

### 报告问题

如果在升级过程中遇到问题，请提供以下信息：

```bash
# 收集系统信息
npm run info:system

# 生成诊断报告
npm run diagnose:upgrade

# 导出配置信息
npm run export:config
```

### 社区资源

- **升级经验分享**: 查看其他用户的升级经验
- **最佳实践**: 学习升级的最佳实践
- **常见问题**: 查看升级相关的FAQ

---

通过遵循这个升级指南，您可以安全地将PDCS-Fronted-UI项目升级到最新版本，享受新功能和改进的同时保持项目的稳定性。如果遇到任何问题，请不要hesitate寻求社区帮助。
