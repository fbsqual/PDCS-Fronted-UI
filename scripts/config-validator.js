#!/usr/bin/env node

/**
 * PDCS-Fronted-UI 配置验证器
 * 用于验证配置文件的正确性和完整性
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv').default;

class ConfigValidator {
  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    this.schemasDir = path.join(process.cwd(), 'config', 'schemas');
    this.configDir = path.join(process.cwd(), 'config');
  }

  /**
   * 初始化验证器
   */
  init() {
    console.log('🔍 初始化配置验证器...');
    
    // 创建配置模式文件
    this.createConfigSchemas();
    
    // 加载所有模式
    this.loadSchemas();
    
    console.log('✅ 配置验证器初始化完成');
  }

  /**
   * 创建配置模式文件
   */
  createConfigSchemas() {
    if (!fs.existsSync(this.schemasDir)) {
      fs.mkdirSync(this.schemasDir, { recursive: true });
    }

    // 应用配置模式
    const appSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        app: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            version: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+' },
            description: { type: 'string' }
          },
          required: ['name', 'version'],
          additionalProperties: false
        },
        framework: {
          type: 'object',
          properties: {
            name: { type: 'string', enum: ['PDCS-Fronted-UI'] },
            version: { type: 'string' },
            features: {
              type: 'object',
              properties: {
                i18n: { type: 'boolean' },
                themes: { type: 'boolean' },
                charts: { type: 'boolean' },
                database: { type: 'boolean' },
                pwa: { type: 'boolean' },
                debug: { type: 'boolean' }
              },
              additionalProperties: false
            }
          },
          required: ['name', 'version', 'features'],
          additionalProperties: false
        },
        build: {
          type: 'object',
          properties: {
            target: { type: 'string', enum: ['es5', 'es2015', 'es2017', 'es2018', 'es2019', 'es2020', 'esnext'] },
            minify: { type: 'boolean' },
            sourcemap: { type: 'boolean' },
            analyze: { type: 'boolean' }
          },
          additionalProperties: false
        },
        security: {
          type: 'object',
          properties: {
            csp: {
              type: 'object',
              properties: {
                enabled: { type: 'boolean' },
                reportOnly: { type: 'boolean' }
              },
              additionalProperties: false
            },
            cors: {
              type: 'object',
              properties: {
                enabled: { type: 'boolean' },
                origins: {
                  type: 'array',
                  items: { type: 'string' }
                }
              },
              additionalProperties: false
            }
          },
          additionalProperties: false
        }
      },
      required: ['app', 'framework'],
      additionalProperties: false
    };

    // 数据库配置模式
    const databaseSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        sqlite: {
          type: 'object',
          properties: {
            filename: { type: 'string', minLength: 1 },
            options: {
              type: 'object',
              properties: {
                verbose: { type: 'boolean' },
                fileMustExist: { type: 'boolean' }
              },
              additionalProperties: false
            }
          },
          required: ['filename'],
          additionalProperties: false
        },
        indexeddb: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            version: { type: 'integer', minimum: 1 },
            stores: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 1 },
                  keyPath: { type: 'string' },
                  autoIncrement: { type: 'boolean' }
                },
                required: ['name'],
                additionalProperties: false
              }
            }
          },
          required: ['name', 'version', 'stores'],
          additionalProperties: false
        }
      },
      additionalProperties: false
    };

    // 主题配置模式
    const themeSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        default: { type: 'string', enum: ['light', 'dark'] },
        themes: {
          type: 'object',
          patternProperties: {
            '^[a-zA-Z][a-zA-Z0-9_-]*$': {
              type: 'object',
              properties: {
                primary: { type: 'string', pattern: '^hsl\\(' },
                secondary: { type: 'string', pattern: '^hsl\\(' },
                accent: { type: 'string', pattern: '^hsl\\(' },
                background: { type: 'string', pattern: '^hsl\\(' },
                foreground: { type: 'string', pattern: '^hsl\\(' }
              },
              required: ['primary', 'secondary', 'background', 'foreground'],
              additionalProperties: false
            }
          },
          additionalProperties: false
        },
        customization: {
          type: 'object',
          properties: {
            allowUserThemes: { type: 'boolean' },
            persistTheme: { type: 'boolean' },
            systemThemeDetection: { type: 'boolean' }
          },
          additionalProperties: false
        }
      },
      required: ['default', 'themes'],
      additionalProperties: false
    };

    // 国际化配置模式
    const i18nSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        defaultLanguage: { type: 'string', pattern: '^[a-z]{2}-[A-Z]{2}$' },
        supportedLanguages: {
          type: 'array',
          items: { type: 'string', pattern: '^[a-z]{2}-[A-Z]{2}$' },
          minItems: 1
        },
        fallbackLanguage: { type: 'string', pattern: '^[a-z]{2}-[A-Z]{2}$' },
        detection: {
          type: 'object',
          properties: {
            order: {
              type: 'array',
              items: { type: 'string', enum: ['localStorage', 'navigator', 'htmlTag', 'cookie'] }
            },
            caches: {
              type: 'array',
              items: { type: 'string', enum: ['localStorage', 'cookie'] }
            }
          },
          additionalProperties: false
        },
        resources: {
          type: 'object',
          patternProperties: {
            '^[a-z]{2}-[A-Z]{2}$': {
              type: 'object',
              additionalProperties: true
            }
          },
          additionalProperties: false
        }
      },
      required: ['defaultLanguage', 'supportedLanguages', 'fallbackLanguage'],
      additionalProperties: false
    };

    // 写入模式文件
    this.writeSchema('app.schema.json', appSchema);
    this.writeSchema('database.schema.json', databaseSchema);
    this.writeSchema('theme.schema.json', themeSchema);
    this.writeSchema('i18n.schema.json', i18nSchema);
  }

  /**
   * 写入模式文件
   */
  writeSchema(filename, schema) {
    const filePath = path.join(this.schemasDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(schema, null, 2));
  }

  /**
   * 加载所有模式
   */
  loadSchemas() {
    const schemaFiles = fs.readdirSync(this.schemasDir);
    
    schemaFiles.forEach(file => {
      if (file.endsWith('.schema.json')) {
        const schemaPath = path.join(this.schemasDir, file);
        const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
        const schemaId = file.replace('.schema.json', '');
        this.ajv.addSchema(schema, schemaId);
      }
    });
  }

  /**
   * 验证配置文件
   */
  validateConfig(configName, configData) {
    const validate = this.ajv.getSchema(configName);
    
    if (!validate) {
      throw new Error(`未找到配置模式: ${configName}`);
    }

    const valid = validate(configData);
    
    if (!valid) {
      return {
        valid: false,
        errors: validate.errors.map(error => ({
          path: error.instancePath,
          message: error.message,
          value: error.data,
          schema: error.schemaPath
        }))
      };
    }

    return { valid: true, errors: [] };
  }

  /**
   * 验证所有配置文件
   */
  validateAllConfigs() {
    console.log('🔍 验证所有配置文件...');
    
    const configFiles = [
      { name: 'app', file: 'app.config.js' },
      { name: 'database', file: 'database.config.js' },
      { name: 'theme', file: 'theme.config.js' },
      { name: 'i18n', file: 'i18n.config.js' }
    ];

    const results = [];

    configFiles.forEach(({ name, file }) => {
      const configPath = path.join(this.configDir, file);
      
      if (fs.existsSync(configPath)) {
        try {
          // 清除require缓存
          delete require.cache[require.resolve(configPath)];
          const configData = require(configPath);
          
          const result = this.validateConfig(name, configData);
          results.push({
            name,
            file,
            ...result
          });
          
          if (result.valid) {
            console.log(`✅ ${file} 验证通过`);
          } else {
            console.log(`❌ ${file} 验证失败:`);
            result.errors.forEach(error => {
              console.log(`   - ${error.path}: ${error.message}`);
            });
          }
        } catch (error) {
          console.log(`❌ ${file} 加载失败: ${error.message}`);
          results.push({
            name,
            file,
            valid: false,
            errors: [{ message: `配置文件加载失败: ${error.message}` }]
          });
        }
      } else {
        console.log(`⚠️  ${file} 不存在`);
        results.push({
          name,
          file,
          valid: false,
          errors: [{ message: '配置文件不存在' }]
        });
      }
    });

    return results;
  }

  /**
   * 修复配置文件
   */
  fixConfig(configName, configData) {
    console.log(`🔧 尝试修复配置: ${configName}`);
    
    // 基础修复逻辑
    const fixedConfig = { ...configData };
    
    switch (configName) {
      case 'app':
        if (!fixedConfig.app) fixedConfig.app = {};
        if (!fixedConfig.app.name) fixedConfig.app.name = 'PDCS Application';
        if (!fixedConfig.app.version) fixedConfig.app.version = '1.0.0';
        
        if (!fixedConfig.framework) fixedConfig.framework = {};
        if (!fixedConfig.framework.name) fixedConfig.framework.name = 'PDCS-Fronted-UI';
        if (!fixedConfig.framework.version) fixedConfig.framework.version = 'latest';
        if (!fixedConfig.framework.features) {
          fixedConfig.framework.features = {
            i18n: true,
            themes: true,
            charts: true,
            database: true,
            pwa: true,
            debug: false
          };
        }
        break;
        
      case 'theme':
        if (!fixedConfig.default) fixedConfig.default = 'light';
        if (!fixedConfig.themes) {
          fixedConfig.themes = {
            light: {
              primary: 'hsl(222.2 84% 4.9%)',
              secondary: 'hsl(210 40% 96%)',
              background: 'hsl(0 0% 100%)',
              foreground: 'hsl(222.2 84% 4.9%)'
            },
            dark: {
              primary: 'hsl(210 40% 98%)',
              secondary: 'hsl(217.2 32.6% 17.5%)',
              background: 'hsl(222.2 84% 4.9%)',
              foreground: 'hsl(210 40% 98%)'
            }
          };
        }
        break;
        
      case 'i18n':
        if (!fixedConfig.defaultLanguage) fixedConfig.defaultLanguage = 'zh-CN';
        if (!fixedConfig.supportedLanguages) fixedConfig.supportedLanguages = ['zh-CN', 'en-US'];
        if (!fixedConfig.fallbackLanguage) fixedConfig.fallbackLanguage = 'en-US';
        break;
    }
    
    return fixedConfig;
  }

  /**
   * 生成配置报告
   */
  generateReport() {
    console.log('📊 生成配置验证报告...');
    
    const results = this.validateAllConfigs();
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        valid: results.filter(r => r.valid).length,
        invalid: results.filter(r => !r.valid).length
      },
      details: results
    };

    const reportPath = path.join(process.cwd(), 'config-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📋 报告已保存到: ${reportPath}`);
    console.log(`📊 验证结果: ${report.summary.valid}/${report.summary.total} 通过`);
    
    return report;
  }
}

// CLI接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const validator = new ConfigValidator();

  try {
    switch (command) {
      case 'init':
        validator.init();
        break;
      
      case 'validate':
        validator.validateAllConfigs();
        break;
      
      case 'report':
        validator.generateReport();
        break;
      
      default:
        console.log(`
🔍 PDCS-Fronted-UI 配置验证器

使用方法:
  node scripts/config-validator.js init       # 初始化验证器
  node scripts/config-validator.js validate   # 验证所有配置
  node scripts/config-validator.js report     # 生成验证报告

功能:
  - 配置文件格式验证
  - 配置完整性检查
  - 自动修复建议
  - 详细错误报告
        `);
    }
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
    process.exit(1);
  }
}

module.exports = ConfigValidator;
