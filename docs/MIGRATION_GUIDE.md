# 🔄 PDCS-Fronted-UI 迁移指南

本指南提供了详细的迁移说明，帮助您将现有项目迁移到PDCS-Fronted-UI框架，或在不同版本之间进行迁移。

## 📋 迁移概述

### 迁移类型

1. **从其他框架迁移**: 从其他UI框架迁移到PDCS-Fronted-UI
2. **版本间迁移**: 在PDCS-Fronted-UI不同版本之间迁移
3. **配置迁移**: 迁移配置文件和设置
4. **数据迁移**: 迁移用户数据和状态

### 迁移策略

- **渐进式迁移**: 逐步替换组件和功能
- **完整迁移**: 一次性完整迁移
- **并行运行**: 新旧系统并行运行
- **分阶段迁移**: 按功能模块分阶段迁移

## 🚀 从其他框架迁移

### 从 Material-UI 迁移

#### 组件映射表

| Material-UI | PDCS-Fronted-UI | 说明 |
|-------------|-----------------|------|
| `Button` | `Button` | 属性名称略有不同 |
| `TextField` | `Input` | 需要调整属性 |
| `Card` | `Card` | 结构基本相同 |
| `Dialog` | `Dialog` | API相似 |
| `AppBar` | 自定义导航 | 需要自定义实现 |

#### 迁移步骤

```bash
# 1. 安装PDCS-Fronted-UI
npm install pdcs-fronted-ui

# 2. 运行迁移工具
npm run migrate:from-mui

# 3. 手动调整组件
```

#### 代码示例

```typescript
// Material-UI (旧)
import { Button, TextField } from '@mui/material';

<Button variant="contained" color="primary">
  Click me
</Button>
<TextField label="Name" variant="outlined" />

// PDCS-Fronted-UI (新)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<Button variant="default">
  Click me
</Button>
<div className="space-y-2">
  <Label htmlFor="name">Name</Label>
  <Input id="name" placeholder="Enter your name" />
</div>
```

### 从 Ant Design 迁移

#### 组件映射表

| Ant Design | PDCS-Fronted-UI | 说明 |
|------------|-----------------|------|
| `Button` | `Button` | 尺寸属性不同 |
| `Input` | `Input` | 基本相同 |
| `Table` | `DataTable` | 需要重新配置 |
| `Form` | 自定义表单 | 使用react-hook-form |
| `DatePicker` | 自定义日期选择器 | 需要额外实现 |

#### 迁移脚本

```bash
#!/bin/bash
# migrate-from-antd.sh

echo "🔄 从Ant Design迁移到PDCS-Fronted-UI..."

# 替换导入语句
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/import { Button } from "antd"/import { Button } from "@\/components\/ui\/button"/g'

# 替换组件属性
find src -name "*.tsx" | xargs sed -i 's/size="large"/size="lg"/g'
find src -name "*.tsx" | xargs sed -i 's/size="small"/size="sm"/g'

echo "✅ 基础迁移完成，请手动检查和调整"
```

### 从 Chakra UI 迁移

#### 主题系统迁移

```typescript
// Chakra UI 主题 (旧)
const theme = {
  colors: {
    brand: {
      50: '#f7fafc',
      500: '#4299e1',
      900: '#1a365d',
    }
  }
};

// PDCS-Fronted-UI 主题 (新)
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f7fafc',
          500: '#4299e1',
          900: '#1a365d',
        }
      }
    }
  }
};
```

## 🔄 版本间迁移

### 自动迁移工具

```bash
# 检查迁移需求
npm run migrate:check

# 执行自动迁移
npm run migrate:auto

# 生成迁移报告
npm run migrate:report
```

### 手动迁移步骤

#### 1. 准备迁移

```bash
# 创建迁移分支
git checkout -b migration-to-v2

# 备份当前配置
cp -r config config-backup
cp package.json package.json.backup
```

#### 2. 更新依赖

```json
// package.json - 更新版本
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

#### 3. 迁移配置文件

```javascript
// next.config.js - v1 to v2
const nextConfig = {
  // v1 配置
  experimental: {
    appDir: false
  },
  
  // v2 配置
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@prisma/client']
  }
};
```

#### 4. 更新组件代码

```typescript
// 组件迁移示例
// v1 版本
import { Button } from '@/components/ui/button';

<Button variant="primary" size="medium">
  Click me
</Button>

// v2 版本
import { Button } from '@/components/ui/button';

<Button variant="default" size="default">
  Click me
</Button>
```

## 📁 配置迁移

### 环境配置迁移

```bash
# 迁移环境配置
npm run config:migrate

# 验证配置
npm run config:validate

# 生成新的配置模板
npm run config:generate-template
```

### 配置文件对比

```javascript
// 旧配置格式
const config = {
  theme: 'light',
  language: 'zh-CN',
  features: {
    darkMode: true,
    i18n: true
  }
};

// 新配置格式
const config = {
  app: {
    theme: {
      default: 'light',
      storageKey: 'pdcs-ui-theme'
    },
    i18n: {
      defaultLocale: 'zh-CN',
      locales: ['zh-CN', 'en-US']
    }
  },
  features: {
    theme: { enabled: true },
    i18n: { enabled: true }
  }
};
```

### 数据库配置迁移

```typescript
// 旧数据库配置
const dbConfig = {
  type: 'sqlite',
  database: 'app.db'
};

// 新数据库配置
const dbConfig = {
  development: {
    type: 'sqlite',
    database: 'dev.db',
    synchronize: true
  },
  production: {
    type: 'postgresql',
    url: process.env.DATABASE_URL,
    synchronize: false
  }
};
```

## 🗄️ 数据迁移

### 用户数据迁移

```typescript
// 数据迁移脚本
class DataMigrator {
  async migrateUserPreferences() {
    const oldPrefs = localStorage.getItem('user-preferences');
    if (oldPrefs) {
      const parsed = JSON.parse(oldPrefs);
      
      // 转换为新格式
      const newPrefs = {
        theme: parsed.darkMode ? 'dark' : 'light',
        language: parsed.locale || 'zh-CN',
        settings: {
          notifications: parsed.notifications ?? true,
          autoSave: parsed.autoSave ?? false
        }
      };
      
      localStorage.setItem('pdcs-ui-preferences', JSON.stringify(newPrefs));
      localStorage.removeItem('user-preferences');
    }
  }

  async migrateLocalStorage() {
    // 迁移所有相关的localStorage数据
    const keys = Object.keys(localStorage);
    const oldKeys = keys.filter(key => key.startsWith('old-app-'));
    
    oldKeys.forEach(oldKey => {
      const value = localStorage.getItem(oldKey);
      const newKey = oldKey.replace('old-app-', 'pdcs-ui-');
      localStorage.setItem(newKey, value);
      localStorage.removeItem(oldKey);
    });
  }
}

// 使用迁移器
const migrator = new DataMigrator();
await migrator.migrateUserPreferences();
await migrator.migrateLocalStorage();
```

### 状态管理迁移

```typescript
// 从Redux迁移到Zustand
// 旧的Redux store
const initialState = {
  user: null,
  theme: 'light',
  language: 'zh-CN'
};

// 新的Zustand store
import { create } from 'zustand';

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  language: string;
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
}

const useAppStore = create<AppState>((set) => ({
  user: null,
  theme: 'light',
  language: 'zh-CN',
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
}));
```

## 🧪 迁移测试

### 测试迁移脚本

```bash
# 运行迁移测试
npm run test:migration

# 验证迁移结果
npm run verify:migration

# 回滚测试
npm run test:rollback
```

### 迁移验证清单

```typescript
// 迁移验证脚本
class MigrationValidator {
  async validateMigration() {
    const results = {
      dependencies: await this.checkDependencies(),
      configuration: await this.checkConfiguration(),
      components: await this.checkComponents(),
      data: await this.checkData(),
      functionality: await this.checkFunctionality()
    };
    
    return results;
  }

  async checkDependencies() {
    // 检查依赖是否正确安装
    const packageJson = require('./package.json');
    const requiredDeps = ['next', 'react', 'react-dom'];
    
    return requiredDeps.every(dep => 
      packageJson.dependencies[dep] || packageJson.devDependencies[dep]
    );
  }

  async checkConfiguration() {
    // 检查配置文件是否正确
    const configs = [
      'next.config.js',
      'tailwind.config.js',
      'tsconfig.json'
    ];
    
    return configs.every(config => fs.existsSync(config));
  }

  async checkComponents() {
    // 检查组件是否正常工作
    const { render } = require('@testing-library/react');
    const { Button } = require('@/components/ui/button');
    
    try {
      render(<Button>Test</Button>);
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkData() {
    // 检查数据是否正确迁移
    const preferences = localStorage.getItem('pdcs-ui-preferences');
    return preferences !== null;
  }

  async checkFunctionality() {
    // 检查核心功能是否正常
    const tests = [
      this.testThemeSwitching(),
      this.testLanguageSwitching(),
      this.testComponentRendering()
    ];
    
    const results = await Promise.all(tests);
    return results.every(result => result === true);
  }
}
```

## 🔧 故障排除

### 常见迁移问题

#### 1. 依赖冲突

```bash
# 清理依赖
rm -rf node_modules package-lock.json
npm install

# 解决版本冲突
npm install --force
```

#### 2. 配置错误

```bash
# 重新生成配置
npm run config:reset
npm run config:init

# 验证配置
npm run config:validate
```

#### 3. 组件不兼容

```typescript
// 创建兼容层
const LegacyButton = ({ variant, ...props }) => {
  // 转换旧的variant到新的variant
  const newVariant = variant === 'primary' ? 'default' : variant;
  return <Button variant={newVariant} {...props} />;
};
```

#### 4. 样式问题

```bash
# 重新构建样式
npm run build:css

# 清理样式缓存
rm -rf .next/cache
```

### 回滚策略

```bash
# 自动回滚
npm run migrate:rollback

# 手动回滚
git checkout migration-backup
npm install
```

## 📊 迁移检查清单

### 迁移前
- [ ] 创建完整备份
- [ ] 记录当前配置
- [ ] 运行现有测试
- [ ] 准备迁移计划
- [ ] 通知相关人员

### 迁移过程
- [ ] 更新依赖包
- [ ] 迁移配置文件
- [ ] 更新组件代码
- [ ] 迁移用户数据
- [ ] 更新测试用例

### 迁移后
- [ ] 运行所有测试
- [ ] 验证核心功能
- [ ] 检查性能指标
- [ ] 更新文档
- [ ] 培训团队成员

## 📈 迁移最佳实践

### 1. 渐进式迁移
- 从非关键功能开始
- 逐步替换核心组件
- 保持向后兼容性
- 定期验证功能

### 2. 测试驱动迁移
- 先写测试用例
- 确保测试通过
- 重构代码实现
- 持续集成验证

### 3. 文档同步更新
- 更新API文档
- 记录变更内容
- 提供迁移示例
- 维护FAQ

### 4. 团队协作
- 制定迁移计划
- 分配具体任务
- 定期进度同步
- 知识分享培训

## 🆘 获取帮助

### 迁移支持

1. **迁移工具**: 使用自动化迁移工具
2. **文档资源**: 查看详细的迁移文档
3. **社区支持**: 在社区寻求帮助
4. **专业服务**: 考虑专业迁移服务

### 报告问题

```bash
# 生成迁移报告
npm run migrate:generate-report

# 收集系统信息
npm run info:system

# 导出迁移日志
npm run export:migration-logs
```

---

通过遵循这个迁移指南，您可以安全、高效地完成项目迁移，确保迁移过程顺利且不影响业务连续性。如果遇到复杂问题，请及时寻求社区或专业支持。
