# 📋 PDCS-Fronted-UI API 变更文档

本文档详细记录了PDCS-Fronted-UI框架各版本之间的API变更，帮助开发者了解版本升级时需要注意的变更内容。

## 📖 版本说明

### 版本命名规范

我们遵循 [语义化版本控制](https://semver.org/lang/zh-CN/) (SemVer) 规范：

- **主版本号 (MAJOR)**: 不兼容的API变更
- **次版本号 (MINOR)**: 向后兼容的功能新增
- **修订版本号 (PATCH)**: 向后兼容的问题修复

### 变更类型标识

- 🚨 **BREAKING**: 破坏性变更，需要修改代码
- ✨ **NEW**: 新增功能或API
- 🔄 **CHANGED**: 功能变更，保持向后兼容
- 🗑️ **DEPRECATED**: 已弃用，将在未来版本移除
- 🐛 **FIXED**: 问题修复
- 📝 **DOCS**: 文档更新

## 🚀 v2.0.0 (计划中)

### 🚨 破坏性变更

#### 组件API变更

**Button 组件**
```typescript
// v1.x (旧)
<Button variant="primary" size="medium">Click me</Button>

// v2.0 (新)
<Button variant="default" size="default">Click me</Button>
```

变更详情：
- `variant="primary"` → `variant="default"`
- `size="medium"` → `size="default"`
- `size="large"` → `size="lg"`
- `size="small"` → `size="sm"`

**Input 组件**
```typescript
// v1.x (旧)
<Input error="Error message" />

// v2.0 (新)
<Input className={cn(error && "border-destructive")} />
<p className="text-sm text-destructive">{error}</p>
```

变更详情：
- 移除内置错误状态，使用组合模式
- 错误消息需要单独渲染

#### Hook API变更

**useTheme Hook**
```typescript
// v1.x (旧)
const { theme, toggleTheme } = useTheme();

// v2.0 (新)
const { theme, setTheme, systemTheme } = useTheme();
```

变更详情：
- 移除 `toggleTheme` 方法
- 新增 `setTheme` 方法，支持更多主题选项
- 新增 `systemTheme` 返回系统主题

**useLocalStorage Hook**
```typescript
// v1.x (旧)
const [value, setValue] = useLocalStorage('key', defaultValue);

// v2.0 (新)
const [value, setValue, { loading, error }] = useLocalStorage('key', defaultValue);
```

变更详情：
- 返回值增加状态信息
- 支持异步操作状态

#### 配置文件变更

**主题配置**
```javascript
// v1.x (旧)
// theme.config.js
export const themeConfig = {
  defaultTheme: 'light',
  themes: ['light', 'dark']
};

// v2.0 (新)
// config/theme.json
{
  "default": "light",
  "storageKey": "pdcs-ui-theme",
  "themes": {
    "light": { "name": "Light", "value": "light" },
    "dark": { "name": "Dark", "value": "dark" },
    "system": { "name": "System", "value": "system" }
  }
}
```

**国际化配置**
```javascript
// v1.x (旧)
// i18n.config.js
export const i18nConfig = {
  defaultLocale: 'zh-CN',
  locales: ['zh-CN', 'en-US']
};

// v2.0 (新)
// config/i18n.json
{
  "defaultLocale": "zh-CN",
  "locales": [
    { "code": "zh-CN", "name": "简体中文", "flag": "🇨🇳" },
    { "code": "en-US", "name": "English", "flag": "🇺🇸" }
  ],
  "fallbackLocale": "en-US"
}
```

### ✨ 新增功能

#### 新组件

**DataTable 组件**
```typescript
import { DataTable } from '@/components/ui/data-table';

<DataTable
  columns={columns}
  data={data}
  pagination
  sorting
  filtering
/>
```

**Toast 组件**
```typescript
import { toast } from '@/components/ui/toast';

toast.success('操作成功');
toast.error('操作失败');
toast.info('提示信息');
```

#### 新Hook

**useDebounce Hook**
```typescript
import { useDebounce } from '@/hooks/use-debounce';

const debouncedValue = useDebounce(value, 500);
```

**useMediaQuery Hook**
```typescript
import { useMediaQuery } from '@/hooks/use-media-query';

const isMobile = useMediaQuery('(max-width: 768px)');
```

#### 新工具函数

**格式化工具**
```typescript
import { formatDate, formatNumber, formatCurrency } from '@/lib/format';

formatDate(new Date(), 'YYYY-MM-DD');
formatNumber(1234.56, { decimals: 2 });
formatCurrency(99.99, 'USD');
```

### 🔄 功能变更

#### 主题系统增强
- 支持系统主题自动切换
- 新增更多CSS变量
- 改进暗色模式支持

#### 国际化改进
- 支持更多语言
- 改进翻译加载机制
- 新增地区格式化支持

#### 性能优化
- 组件懒加载优化
- 减少包体积
- 改进渲染性能

### 🗑️ 已弃用功能

#### 组件属性
```typescript
// 已弃用，将在v3.0移除
<Button loading={true} /> // 使用 disabled + Spinner 替代

// 已弃用，将在v3.0移除
<Input helperText="帮助文本" /> // 使用单独的帮助文本组件
```

#### Hook方法
```typescript
// 已弃用，将在v3.0移除
const { toggleTheme } = useTheme(); // 使用 setTheme 替代
```

### 📦 依赖更新

#### 主要依赖
- Next.js: 13.x → 14.x
- React: 18.2 → 18.3
- TypeScript: 4.9 → 5.0
- Tailwind CSS: 3.3 → 3.4

#### 新增依赖
- `@radix-ui/react-toast`: 新增Toast组件支持
- `date-fns`: 日期格式化工具
- `zustand`: 状态管理（可选）

#### 移除依赖
- `classnames`: 使用内置的`cn`工具函数替代

## 📋 v1.2.0

### ✨ 新增功能

#### 新组件
- **Skeleton**: 骨架屏组件
- **Progress**: 进度条组件
- **Badge**: 徽章组件

#### 新Hook
- **useClickOutside**: 点击外部检测
- **useKeyPress**: 按键检测

### 🔄 功能变更

#### 组件改进
- Button组件新增`loading`状态
- Input组件改进无障碍支持
- Card组件新增`hover`效果

### 🐛 问题修复

- 修复主题切换时的闪烁问题
- 修复移动端触摸事件问题
- 修复TypeScript类型定义问题

## 📋 v1.1.0

### ✨ 新增功能

#### PWA支持
- 离线缓存
- 安装提示
- 后台同步

#### 图表组件
- 基于Chart.js的图表组件
- 支持多种图表类型
- 响应式设计

### 🔄 功能变更

#### 主题系统
- 新增更多颜色变量
- 改进暗色模式
- 支持自定义主题

### 🐛 问题修复

- 修复国际化切换问题
- 修复组件样式冲突
- 修复构建警告

## 📋 v1.0.0

### ✨ 初始发布

#### 核心功能
- 基础UI组件库
- 主题系统
- 国际化支持
- TypeScript支持
- 响应式设计

#### 组件列表
- Button, Input, Card, Dialog
- ThemeProvider, I18nProvider
- 基础布局组件

## 🔄 迁移指南

### 从v1.x迁移到v2.0

#### 自动迁移
```bash
# 运行自动迁移工具
npm run migrate:v1-to-v2

# 检查迁移结果
npm run lint
npm run type-check
```

#### 手动迁移步骤

1. **更新组件属性**
```bash
# 批量替换Button组件属性
find src -name "*.tsx" -exec sed -i 's/variant="primary"/variant="default"/g' {} \;
find src -name "*.tsx" -exec sed -i 's/size="medium"/size="default"/g' {} \;
```

2. **更新Hook使用**
```typescript
// 更新useTheme使用
const { theme, setTheme } = useTheme();

// 替换toggleTheme调用
// 旧: toggleTheme()
// 新: setTheme(theme === 'light' ? 'dark' : 'light')
```

3. **更新配置文件**
```bash
# 迁移配置文件
npm run config:migrate
```

### 兼容性检查

```bash
# 检查API兼容性
npm run check:compatibility

# 生成兼容性报告
npm run report:compatibility
```

## 🔍 变更检测工具

### API变更检测
```bash
# 检测API变更
npm run api:check-changes

# 生成变更报告
npm run api:generate-report

# 验证向后兼容性
npm run api:check-compatibility
```

### 自动化测试
```bash
# 运行兼容性测试
npm run test:compatibility

# 运行回归测试
npm run test:regression
```

## 📚 相关文档

- [升级指南](./UPGRADE_GUIDE.md)
- [迁移指南](./MIGRATION_GUIDE.md)
- [变更日志](./CHANGELOG.md)
- [API文档](./API_REFERENCE.md)

## 🆘 获取帮助

### 支持渠道

1. **GitHub Issues**: 报告API变更相关问题
2. **讨论区**: 讨论API设计和变更建议
3. **文档**: 查看详细的API文档
4. **示例**: 参考最新的代码示例

### 反馈建议

如果您对API变更有任何建议或发现问题，请：

1. 在GitHub Issues中创建问题
2. 提供详细的使用场景
3. 包含代码示例
4. 说明期望的行为

---

我们致力于在保持API稳定性的同时持续改进框架功能。感谢您的理解和支持！
