#!/usr/bin/env node

/**
 * PDCS-Fronted-UI 配置管理器
 * 用于管理不同环境的配置文件和环境隔离
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ConfigManager {
  constructor() {
    this.configDir = path.join(process.cwd(), 'config');
    this.envConfigDir = path.join(this.configDir, 'environments');
    this.backupDir = path.join(process.cwd(), '.config-backups');
    this.currentEnv = process.env.NODE_ENV || 'development';
  }

  /**
   * 初始化配置管理系统
   */
  init() {
    console.log('🔧 初始化配置管理系统...');
    
    // 创建配置目录结构
    this.createConfigStructure();
    
    // 创建默认配置文件
    this.createDefaultConfigs();
    
    // 创建环境配置
    this.createEnvironmentConfigs();
    
    // 创建配置加载器
    this.createConfigLoader();
    
    console.log('✅ 配置管理系统初始化完成');
  }

  /**
   * 创建配置目录结构
   */
  createConfigStructure() {
    const dirs = [
      this.configDir,
      this.envConfigDir,
      path.join(this.envConfigDir, 'development'),
      path.join(this.envConfigDir, 'staging'),
      path.join(this.envConfigDir, 'production'),
      path.join(this.configDir, 'schemas'),
      path.join(this.configDir, 'templates'),
      this.backupDir
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * 创建默认配置文件
   */
  createDefaultConfigs() {
    // 主配置文件
    const mainConfig = {
      app: {
        name: 'PDCS Application',
        version: '1.0.0',
        description: 'Built with PDCS-Fronted-UI Framework'
      },
      framework: {
        name: 'PDCS-Fronted-UI',
        version: this.getFrameworkVersion(),
        features: {
          i18n: true,
          themes: true,
          charts: true,
          database: true,
          pwa: true,
          debug: false
        }
      },
      build: {
        target: 'es2020',
        minify: true,
        sourcemap: true,
        analyze: false
      },
      security: {
        csp: {
          enabled: true,
          reportOnly: false
        },
        cors: {
          enabled: true,
          origins: []
        }
      }
    };

    this.writeConfig('config/app.config.js', this.generateConfigFile(mainConfig));

    // 数据库配置
    const dbConfig = {
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

    this.writeConfig('config/database.config.js', this.generateConfigFile(dbConfig));

    // 主题配置
    const themeConfig = {
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

    this.writeConfig('config/theme.config.js', this.generateConfigFile(themeConfig));

    // 国际化配置
    const i18nConfig = {
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
            success: '成功',
            cancel: '取消',
            confirm: '确认'
          }
        },
        'en-US': {
          common: {
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            cancel: 'Cancel',
            confirm: 'Confirm'
          }
        }
      }
    };

    this.writeConfig('config/i18n.config.js', this.generateConfigFile(i18nConfig));
  }

  /**
   * 创建环境特定配置
   */
  createEnvironmentConfigs() {
    const environments = ['development', 'staging', 'production'];

    environments.forEach(env => {
      const envConfig = this.getEnvironmentConfig(env);
      const envPath = path.join(this.envConfigDir, env, 'config.js');
      this.writeConfig(envPath, this.generateConfigFile(envConfig));

      // 创建环境变量文件
      const envVars = this.getEnvironmentVariables(env);
      const envVarsPath = path.join(this.envConfigDir, env, '.env');
      this.writeEnvFile(envVarsPath, envVars);
    });
  }

  /**
   * 获取环境特定配置
   */
  getEnvironmentConfig(env) {
    const baseConfig = {
      api: {
        baseUrl: 'http://localhost:3000/api',
        timeout: 10000,
        retries: 3
      },
      logging: {
        level: 'info',
        console: true,
        file: false
      },
      performance: {
        enableMetrics: false,
        enableProfiling: false
      }
    };

    switch (env) {
      case 'development':
        return {
          ...baseConfig,
          api: {
            ...baseConfig.api,
            baseUrl: 'http://localhost:3000/api'
          },
          logging: {
            ...baseConfig.logging,
            level: 'debug',
            console: true,
            file: true
          },
          performance: {
            enableMetrics: true,
            enableProfiling: true
          },
          debug: {
            enabled: true,
            showDebugUI: true,
            logLevel: 'verbose'
          }
        };

      case 'staging':
        return {
          ...baseConfig,
          api: {
            ...baseConfig.api,
            baseUrl: 'https://staging-api.example.com'
          },
          logging: {
            ...baseConfig.logging,
            level: 'warn',
            file: true
          },
          performance: {
            enableMetrics: true,
            enableProfiling: false
          }
        };

      case 'production':
        return {
          ...baseConfig,
          api: {
            ...baseConfig.api,
            baseUrl: 'https://api.example.com'
          },
          logging: {
            ...baseConfig.logging,
            level: 'error',
            console: false,
            file: true
          },
          performance: {
            enableMetrics: false,
            enableProfiling: false
          },
          security: {
            strictMode: true,
            enableCSP: true,
            enableHSTS: true
          }
        };

      default:
        return baseConfig;
    }
  }

  /**
   * 获取环境变量
   */
  getEnvironmentVariables(env) {
    const baseVars = {
      NODE_ENV: env,
      NEXT_PUBLIC_APP_ENV: env,
      NEXT_PUBLIC_FRAMEWORK_VERSION: this.getFrameworkVersion()
    };

    switch (env) {
      case 'development':
        return {
          ...baseVars,
          NEXT_PUBLIC_DEBUG: 'true',
          NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
          NEXT_PUBLIC_LOG_LEVEL: 'debug'
        };

      case 'staging':
        return {
          ...baseVars,
          NEXT_PUBLIC_DEBUG: 'false',
          NEXT_PUBLIC_API_URL: 'https://staging-api.example.com',
          NEXT_PUBLIC_LOG_LEVEL: 'warn'
        };

      case 'production':
        return {
          ...baseVars,
          NEXT_PUBLIC_DEBUG: 'false',
          NEXT_PUBLIC_API_URL: 'https://api.example.com',
          NEXT_PUBLIC_LOG_LEVEL: 'error'
        };

      default:
        return baseVars;
    }
  }

  /**
   * 创建配置加载器
   */
  createConfigLoader() {
    const loaderCode = `
/**
 * PDCS-Fronted-UI 配置加载器
 * 根据环境自动加载相应的配置文件
 */

const path = require('path');
const fs = require('fs');

class ConfigLoader {
  constructor() {
    this.env = process.env.NODE_ENV || 'development';
    this.configCache = new Map();
  }

  /**
   * 加载配置文件
   */
  load(configName) {
    const cacheKey = \`\${this.env}:\${configName}\`;
    
    if (this.configCache.has(cacheKey)) {
      return this.configCache.get(cacheKey);
    }

    try {
      // 加载基础配置
      const baseConfigPath = path.join(__dirname, \`\${configName}.config.js\`);
      const baseConfig = fs.existsSync(baseConfigPath) ? require(baseConfigPath) : {};

      // 加载环境特定配置
      const envConfigPath = path.join(__dirname, 'environments', this.env, 'config.js');
      const envConfig = fs.existsSync(envConfigPath) ? require(envConfigPath) : {};

      // 合并配置
      const mergedConfig = this.mergeConfigs(baseConfig, envConfig);
      
      // 缓存配置
      this.configCache.set(cacheKey, mergedConfig);
      
      return mergedConfig;
    } catch (error) {
      console.error(\`Failed to load config \${configName}:\`, error);
      return {};
    }
  }

  /**
   * 深度合并配置对象
   */
  mergeConfigs(base, override) {
    const result = { ...base };
    
    for (const key in override) {
      if (override.hasOwnProperty(key)) {
        if (typeof override[key] === 'object' && override[key] !== null && !Array.isArray(override[key])) {
          result[key] = this.mergeConfigs(result[key] || {}, override[key]);
        } else {
          result[key] = override[key];
        }
      }
    }
    
    return result;
  }

  /**
   * 清除配置缓存
   */
  clearCache() {
    this.configCache.clear();
  }

  /**
   * 获取所有配置
   */
  getAllConfigs() {
    return {
      app: this.load('app'),
      database: this.load('database'),
      theme: this.load('theme'),
      i18n: this.load('i18n')
    };
  }
}

module.exports = new ConfigLoader();
`;

    this.writeConfig('config/index.js', loaderCode);
  }

  /**
   * 生成配置文件内容
   */
  generateConfigFile(config) {
    return `/**
 * PDCS-Fronted-UI 配置文件
 * 自动生成，请勿直接修改
 * 使用 config-manager.js 进行配置管理
 */

module.exports = ${JSON.stringify(config, null, 2)};
`;
  }

  /**
   * 写入环境变量文件
   */
  writeEnvFile(filePath, vars) {
    const content = Object.entries(vars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync(filePath, content);
  }

  /**
   * 写入配置文件
   */
  writeConfig(filePath, content) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
  }

  /**
   * 获取框架版本
   */
  getFrameworkVersion() {
    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(packagePath)) {
        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        return pkg.dependencies?.['@fbsqual/pdcs-fronted-ui'] || 'latest';
      }
    } catch (error) {
      console.warn('无法获取框架版本:', error.message);
    }
    return 'latest';
  }
}

// CLI接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const manager = new ConfigManager();

  try {
    switch (command) {
      case 'init':
        manager.init();
        break;
      
      default:
        console.log(\`
🔧 PDCS-Fronted-UI 配置管理器

使用方法:
  node scripts/config-manager.js init    # 初始化配置管理系统

配置文件结构:
  config/
  ├── app.config.js           # 应用配置
  ├── database.config.js      # 数据库配置
  ├── theme.config.js         # 主题配置
  ├── i18n.config.js          # 国际化配置
  ├── index.js                # 配置加载器
  └── environments/           # 环境特定配置
      ├── development/
      ├── staging/
      └── production/
        \`);
    }
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
    process.exit(1);
  }
}

module.exports = ConfigManager;
