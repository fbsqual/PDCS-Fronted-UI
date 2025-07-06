# 🔧 配置管理和环境隔离指南

PDCS-Fronted-UI 框架提供了完整的配置管理和环境隔离系统，确保不同环境的配置不会相互冲突，并且在框架更新时能够安全地保持自定义配置。

## 🏗️ 配置系统架构

### 配置文件结构
```
config/
├── app.config.js           # 应用主配置
├── database.config.js      # 数据库配置
├── theme.config.js         # 主题配置
├── i18n.config.js          # 国际化配置
├── index.js                # 配置加载器
├── schemas/                # 配置验证模式
│   ├── app.schema.json
│   ├── database.schema.json
│   ├── theme.schema.json
│   └── i18n.schema.json
├── templates/              # 配置模板
├── environments/           # 环境特定配置
│   ├── development/
│   │   ├── config.js
│   │   └── .env
│   ├── staging/
│   │   ├── config.js
│   │   └── .env
│   └── production/
│       ├── config.js
│       └── .env
├── backups/                # 配置备份
└── .current-env            # 当前环境标识
```

## 🚀 快速开始

### 1. 初始化配置管理系统

```bash
# 初始化配置管理
node scripts/config-manager.js init

# 初始化配置验证器
node scripts/config-validator.js init
```

### 2. 验证配置文件

```bash
# 验证所有配置
node scripts/config-validator.js validate

# 生成验证报告
node scripts/config-validator.js report
```

### 3. 环境切换

```bash
# 查看当前环境
node scripts/env-switcher.js current

# 切换到生产环境
node scripts/env-switcher.js switch production

# 列出所有环境
node scripts/env-switcher.js list
```

## ⚙️ 配置文件详解

### 应用配置 (app.config.js)

```javascript
module.exports = {
  app: {
    name: 'My PDCS App',
    version: '1.0.0',
    description: 'Built with PDCS-Fronted-UI Framework'
  },
  framework: {
    name: 'PDCS-Fronted-UI',
    version: '1.0.0',
    features: {
      i18n: true,        // 国际化
      themes: true,      // 主题系统
      charts: true,      // 图表组件
      database: true,    // 本地数据库
      pwa: true,         // PWA功能
      debug: false       // 调试模式
    }
  },
  build: {
    target: 'es2020',    // 构建目标
    minify: true,        // 代码压缩
    sourcemap: true,     // 源码映射
    analyze: false       // 包分析
  },
  security: {
    csp: {
      enabled: true,     // 内容安全策略
      reportOnly: false
    },
    cors: {
      enabled: true,     // 跨域资源共享
      origins: []
    }
  }
};
```

### 数据库配置 (database.config.js)

```javascript
module.exports = {
  sqlite: {
    filename: 'app.db',
    options: {
      verbose: false,
      fileMustExist: false
    }
  },
  indexeddb: {
    name: 'pdcs_app_db',
    version: 1,
    stores: [
      {
        name: 'settings',
        keyPath: 'id',
        autoIncrement: true
      },
      {
        name: 'cache',
        keyPath: 'key'
      }
    ]
  }
};
```

### 主题配置 (theme.config.js)

```javascript
module.exports = {
  default: 'light',
  themes: {
    light: {
      primary: 'hsl(222.2 84% 4.9%)',
      secondary: 'hsl(210 40% 96%)',
      accent: 'hsl(210 40% 96%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)'
    },
    dark: {
      primary: 'hsl(210 40% 98%)',
      secondary: 'hsl(217.2 32.6% 17.5%)',
      accent: 'hsl(217.2 32.6% 17.5%)',
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)'
    }
  },
  customization: {
    allowUserThemes: true,
    persistTheme: true,
    systemThemeDetection: true
  }
};
```

### 国际化配置 (i18n.config.js)

```javascript
module.exports = {
  defaultLanguage: 'zh-CN',
  supportedLanguages: ['zh-CN', 'en-US', 'ja-JP'],
  fallbackLanguage: 'en-US',
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage']
  },
  resources: {
    'zh-CN': {
      common: {
        loading: '加载中...',
        error: '错误',
        success: '成功'
      }
    },
    'en-US': {
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success'
      }
    }
  }
};
```

## 🌍 环境管理

### 环境类型

#### Development (开发环境)
- **用途**: 本地开发和调试
- **特点**: 
  - 启用调试功能
  - 详细日志输出
  - 热重载支持
  - 性能监控启用

#### Staging (预发布环境)
- **用途**: 测试和预发布验证
- **特点**:
  - 接近生产环境配置
  - 启用部分监控
  - 警告级别日志
  - 性能测试支持

#### Production (生产环境)
- **用途**: 正式生产部署
- **特点**:
  - 最高安全级别
  - 错误级别日志
  - 性能优化
  - 监控和告警

### 环境切换操作

```bash
# 切换到开发环境
node scripts/env-switcher.js switch development

# 切换到预发布环境
node scripts/env-switcher.js switch staging

# 切换到生产环境
node scripts/env-switcher.js switch production
```

### 创建自定义环境

```bash
# 基于开发环境创建测试环境
node scripts/env-switcher.js create testing development

# 基于生产环境创建演示环境
node scripts/env-switcher.js create demo production
```

### 环境配置比较

```bash
# 比较开发和生产环境
node scripts/env-switcher.js compare development production

# 比较预发布和生产环境
node scripts/env-switcher.js compare staging production
```

## 🔍 配置验证

### 验证规则

配置验证器使用JSON Schema来验证配置文件的格式和内容：

1. **类型验证**: 确保配置项的数据类型正确
2. **必填项检查**: 验证必需的配置项是否存在
3. **格式验证**: 检查特定格式（如版本号、URL等）
4. **枚举值验证**: 确保配置值在允许的范围内
5. **依赖关系验证**: 检查配置项之间的依赖关系

### 验证命令

```bash
# 验证所有配置文件
node scripts/config-validator.js validate

# 生成详细验证报告
node scripts/config-validator.js report
```

### 验证报告示例

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "summary": {
    "total": 4,
    "valid": 3,
    "invalid": 1
  },
  "details": [
    {
      "name": "app",
      "file": "app.config.js",
      "valid": true,
      "errors": []
    },
    {
      "name": "theme",
      "file": "theme.config.js",
      "valid": false,
      "errors": [
        {
          "path": "/themes/light/primary",
          "message": "should match pattern \"^hsl\\(\"",
          "value": "invalid-color"
        }
      ]
    }
  ]
}
```

## 🔄 配置加载机制

### 配置加载器

配置加载器 (`config/index.js`) 提供了统一的配置访问接口：

```javascript
const config = require('./config');

// 加载应用配置
const appConfig = config.load('app');

// 加载所有配置
const allConfigs = config.getAllConfigs();

// 清除配置缓存
config.clearCache();
```

### 配置合并策略

1. **基础配置**: 从主配置文件加载
2. **环境配置**: 从环境特定配置文件加载
3. **深度合并**: 递归合并配置对象
4. **环境优先**: 环境配置覆盖基础配置

### 配置缓存

- 配置在首次加载时被缓存
- 支持手动清除缓存
- 开发环境下自动检测文件变化

## 🛡️ 安全最佳实践

### 敏感信息管理

1. **环境变量**: 敏感信息存储在环境变量中
2. **配置分离**: 敏感配置与普通配置分离
3. **访问控制**: 限制配置文件的访问权限
4. **加密存储**: 对敏感配置进行加密存储

### 配置文件安全

```bash
# 设置配置文件权限（Linux/macOS）
chmod 600 config/environments/production/.env
chmod 644 config/*.config.js

# 添加到.gitignore
echo "config/environments/*/.env" >> .gitignore
echo ".env.local" >> .gitignore
```

## 🔧 自定义配置

### 添加新配置文件

1. **创建配置文件**:
```javascript
// config/custom.config.js
module.exports = {
  feature: {
    enabled: true,
    options: {
      timeout: 5000
    }
  }
};
```

2. **创建验证模式**:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "feature": {
      "type": "object",
      "properties": {
        "enabled": { "type": "boolean" },
        "options": {
          "type": "object",
          "properties": {
            "timeout": { "type": "integer", "minimum": 1000 }
          }
        }
      },
      "required": ["enabled"]
    }
  }
}
```

3. **更新配置加载器**:
```javascript
// 在config/index.js中添加
getAllConfigs() {
  return {
    app: this.load('app'),
    database: this.load('database'),
    theme: this.load('theme'),
    i18n: this.load('i18n'),
    custom: this.load('custom')  // 新增
  };
}
```

### 环境特定配置

为不同环境创建特定的配置覆盖：

```javascript
// config/environments/production/config.js
module.exports = {
  custom: {
    feature: {
      enabled: false,  // 生产环境禁用某功能
      options: {
        timeout: 10000   // 生产环境使用更长超时
      }
    }
  }
};
```

## 🔄 配置迁移

### 框架更新时的配置处理

1. **备份现有配置**: 自动备份当前配置
2. **合并新配置**: 将新的默认配置与现有配置合并
3. **验证配置**: 验证合并后的配置是否有效
4. **迁移脚本**: 运行配置迁移脚本处理不兼容的更改

### 配置迁移脚本示例

```javascript
// migrations/config-v1.1.0.js
module.exports = {
  version: '1.1.0',
  description: '添加新的安全配置选项',
  
  up(config) {
    // 升级配置
    if (!config.security) {
      config.security = {};
    }
    if (!config.security.csp) {
      config.security.csp = {
        enabled: true,
        reportOnly: false
      };
    }
    return config;
  },
  
  down(config) {
    // 降级配置
    if (config.security && config.security.csp) {
      delete config.security.csp;
    }
    return config;
  }
};
```

## 📊 监控和调试

### 配置状态监控

```bash
# 检查配置状态
node scripts/config-validator.js validate

# 查看当前环境配置
node scripts/env-switcher.js current

# 比较环境配置差异
node scripts/env-switcher.js compare development production
```

### 调试配置问题

1. **验证配置格式**: 使用配置验证器检查格式
2. **检查环境变量**: 确认环境变量正确设置
3. **查看加载日志**: 启用详细日志查看配置加载过程
4. **配置缓存清理**: 清除配置缓存重新加载

## 🆘 故障排除

### 常见问题

**1. 配置文件格式错误**
```bash
# 验证配置格式
node scripts/config-validator.js validate

# 查看详细错误信息
node scripts/config-validator.js report
```

**2. 环境切换失败**
```bash
# 检查环境配置是否存在
node scripts/env-switcher.js list

# 手动创建缺失的环境
node scripts/env-switcher.js create missing-env development
```

**3. 配置加载失败**
```bash
# 清除配置缓存
node -e "require('./config').clearCache()"

# 检查文件权限
ls -la config/
```

### 获取帮助

1. **查看日志**: 检查应用和配置管理工具的日志输出
2. **验证配置**: 使用配置验证器检查配置文件
3. **重置配置**: 必要时重新初始化配置系统
4. **社区支持**: 在GitHub Issues中寻求帮助

---

通过这个配置管理和环境隔离系统，您可以安全地管理不同环境的配置，确保框架更新时不会破坏现有的自定义配置。
