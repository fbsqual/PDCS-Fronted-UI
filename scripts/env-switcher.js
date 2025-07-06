#!/usr/bin/env node

/**
 * PDCS-Fronted-UI 环境切换工具
 * 用于在不同环境之间切换配置
 */

const fs = require('fs');
const path = require('path');

class EnvironmentSwitcher {
  constructor() {
    this.configDir = path.join(process.cwd(), 'config');
    this.envConfigDir = path.join(this.configDir, 'environments');
    this.currentEnvFile = path.join(process.cwd(), '.env.local');
    this.envStateFile = path.join(this.configDir, '.current-env');
    this.supportedEnvs = ['development', 'staging', 'production'];
  }

  /**
   * 获取当前环境
   */
  getCurrentEnvironment() {
    if (fs.existsSync(this.envStateFile)) {
      return fs.readFileSync(this.envStateFile, 'utf8').trim();
    }
    return 'development'; // 默认环境
  }

  /**
   * 设置当前环境
   */
  setCurrentEnvironment(env) {
    if (!this.supportedEnvs.includes(env)) {
      throw new Error(`不支持的环境: ${env}。支持的环境: ${this.supportedEnvs.join(', ')}`);
    }

    fs.writeFileSync(this.envStateFile, env);
  }

  /**
   * 切换到指定环境
   */
  switchTo(targetEnv) {
    console.log(`🔄 切换到环境: ${targetEnv}`);

    if (!this.supportedEnvs.includes(targetEnv)) {
      throw new Error(`不支持的环境: ${targetEnv}`);
    }

    const currentEnv = this.getCurrentEnvironment();
    
    if (currentEnv === targetEnv) {
      console.log(`ℹ️  已经在 ${targetEnv} 环境中`);
      return;
    }

    // 备份当前环境配置
    this.backupCurrentConfig(currentEnv);

    // 应用目标环境配置
    this.applyEnvironmentConfig(targetEnv);

    // 更新环境状态
    this.setCurrentEnvironment(targetEnv);

    console.log(`✅ 成功切换到 ${targetEnv} 环境`);
    
    // 显示环境信息
    this.showEnvironmentInfo(targetEnv);
  }

  /**
   * 备份当前环境配置
   */
  backupCurrentConfig(env) {
    console.log(`💾 备份 ${env} 环境配置...`);

    const backupDir = path.join(this.configDir, 'backups', env);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // 备份.env.local文件
    if (fs.existsSync(this.currentEnvFile)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(backupDir, `.env.local.${timestamp}`);
      fs.copyFileSync(this.currentEnvFile, backupFile);
    }
  }

  /**
   * 应用环境配置
   */
  applyEnvironmentConfig(env) {
    console.log(`⚙️  应用 ${env} 环境配置...`);

    const envConfigPath = path.join(this.envConfigDir, env, '.env');
    
    if (!fs.existsSync(envConfigPath)) {
      throw new Error(`环境配置文件不存在: ${envConfigPath}`);
    }

    // 复制环境配置到.env.local
    fs.copyFileSync(envConfigPath, this.currentEnvFile);

    // 更新package.json中的环境脚本
    this.updatePackageScripts(env);

    // 更新Next.js配置
    this.updateNextConfig(env);
  }

  /**
   * 更新package.json脚本
   */
  updatePackageScripts(env) {
    const packagePath = path.join(process.cwd(), 'package.json');
    
    if (!fs.existsSync(packagePath)) {
      return;
    }

    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // 更新环境相关脚本
    pkg.scripts = {
      ...pkg.scripts,
      [`dev:${env}`]: `NODE_ENV=${env} next dev`,
      [`build:${env}`]: `NODE_ENV=${env} next build`,
      [`start:${env}`]: `NODE_ENV=${env} next start`
    };

    fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
  }

  /**
   * 更新Next.js配置
   */
  updateNextConfig(env) {
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    
    if (!fs.existsSync(nextConfigPath)) {
      return;
    }

    // 读取环境特定配置
    const envConfigPath = path.join(this.envConfigDir, env, 'config.js');
    if (!fs.existsSync(envConfigPath)) {
      return;
    }

    // 这里可以根据需要更新Next.js配置
    // 由于配置文件可能很复杂，这里只是示例
    console.log(`📝 请手动检查 next.config.js 是否需要更新以适应 ${env} 环境`);
  }

  /**
   * 显示环境信息
   */
  showEnvironmentInfo(env) {
    console.log(`\n📋 ${env.toUpperCase()} 环境信息:`);
    
    // 读取环境变量
    const envVars = this.readEnvFile(this.currentEnvFile);
    
    console.log('🔧 环境变量:');
    Object.entries(envVars).forEach(([key, value]) => {
      if (key.startsWith('NEXT_PUBLIC_')) {
        console.log(`  ${key}=${value}`);
      }
    });

    // 读取环境配置
    const envConfigPath = path.join(this.envConfigDir, env, 'config.js');
    if (fs.existsSync(envConfigPath)) {
      try {
        delete require.cache[require.resolve(envConfigPath)];
        const envConfig = require(envConfigPath);
        
        console.log('\n⚙️  环境配置:');
        if (envConfig.api) {
          console.log(`  API URL: ${envConfig.api.baseUrl}`);
        }
        if (envConfig.logging) {
          console.log(`  日志级别: ${envConfig.logging.level}`);
        }
        if (envConfig.debug) {
          console.log(`  调试模式: ${envConfig.debug.enabled ? '启用' : '禁用'}`);
        }
      } catch (error) {
        console.log('  ⚠️  无法读取环境配置');
      }
    }
  }

  /**
   * 读取环境变量文件
   */
  readEnvFile(filePath) {
    if (!fs.existsSync(filePath)) {
      return {};
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const vars = {};

    content.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          vars[key.trim()] = valueParts.join('=').trim();
        }
      }
    });

    return vars;
  }

  /**
   * 列出所有可用环境
   */
  listEnvironments() {
    console.log('📋 可用环境:');
    
    const currentEnv = this.getCurrentEnvironment();
    
    this.supportedEnvs.forEach(env => {
      const envDir = path.join(this.envConfigDir, env);
      const exists = fs.existsSync(envDir);
      const isCurrent = env === currentEnv;
      
      const status = isCurrent ? '(当前)' : '';
      const icon = exists ? '✅' : '❌';
      
      console.log(`  ${icon} ${env} ${status}`);
      
      if (exists) {
        const envFile = path.join(envDir, '.env');
        const configFile = path.join(envDir, 'config.js');
        
        console.log(`    - 环境变量: ${fs.existsSync(envFile) ? '✅' : '❌'}`);
        console.log(`    - 配置文件: ${fs.existsSync(configFile) ? '✅' : '❌'}`);
      }
    });
  }

  /**
   * 创建新环境
   */
  createEnvironment(env, baseEnv = 'development') {
    console.log(`🆕 创建新环境: ${env} (基于 ${baseEnv})`);

    if (this.supportedEnvs.includes(env)) {
      throw new Error(`环境 ${env} 已存在`);
    }

    const newEnvDir = path.join(this.envConfigDir, env);
    const baseEnvDir = path.join(this.envConfigDir, baseEnv);

    if (!fs.existsSync(baseEnvDir)) {
      throw new Error(`基础环境 ${baseEnv} 不存在`);
    }

    // 创建新环境目录
    fs.mkdirSync(newEnvDir, { recursive: true });

    // 复制基础环境配置
    const baseFiles = fs.readdirSync(baseEnvDir);
    baseFiles.forEach(file => {
      const sourcePath = path.join(baseEnvDir, file);
      const targetPath = path.join(newEnvDir, file);
      fs.copyFileSync(sourcePath, targetPath);
    });

    // 更新支持的环境列表
    this.supportedEnvs.push(env);

    console.log(`✅ 环境 ${env} 创建成功`);
  }

  /**
   * 删除环境
   */
  removeEnvironment(env) {
    if (!this.supportedEnvs.includes(env)) {
      throw new Error(`环境 ${env} 不存在`);
    }

    if (['development', 'staging', 'production'].includes(env)) {
      throw new Error(`不能删除系统环境: ${env}`);
    }

    const currentEnv = this.getCurrentEnvironment();
    if (currentEnv === env) {
      throw new Error(`不能删除当前环境: ${env}`);
    }

    const envDir = path.join(this.envConfigDir, env);
    if (fs.existsSync(envDir)) {
      fs.rmSync(envDir, { recursive: true, force: true });
    }

    // 从支持的环境列表中移除
    const index = this.supportedEnvs.indexOf(env);
    if (index > -1) {
      this.supportedEnvs.splice(index, 1);
    }

    console.log(`✅ 环境 ${env} 已删除`);
  }

  /**
   * 比较环境配置
   */
  compareEnvironments(env1, env2) {
    console.log(`🔍 比较环境: ${env1} vs ${env2}`);

    const env1Config = this.getEnvironmentConfig(env1);
    const env2Config = this.getEnvironmentConfig(env2);

    const differences = this.findConfigDifferences(env1Config, env2Config);

    if (differences.length === 0) {
      console.log('✅ 两个环境配置相同');
    } else {
      console.log('📋 配置差异:');
      differences.forEach(diff => {
        console.log(`  ${diff.path}: ${diff.env1} → ${diff.env2}`);
      });
    }

    return differences;
  }

  /**
   * 获取环境配置
   */
  getEnvironmentConfig(env) {
    const envFile = path.join(this.envConfigDir, env, '.env');
    const configFile = path.join(this.envConfigDir, env, 'config.js');

    const config = {
      env: this.readEnvFile(envFile),
      config: {}
    };

    if (fs.existsSync(configFile)) {
      try {
        delete require.cache[require.resolve(configFile)];
        config.config = require(configFile);
      } catch (error) {
        console.warn(`无法读取 ${env} 环境配置:`, error.message);
      }
    }

    return config;
  }

  /**
   * 查找配置差异
   */
  findConfigDifferences(config1, config2, path = '') {
    const differences = [];

    // 比较环境变量
    const allEnvKeys = new Set([...Object.keys(config1.env), ...Object.keys(config2.env)]);
    
    allEnvKeys.forEach(key => {
      const val1 = config1.env[key];
      const val2 = config2.env[key];
      
      if (val1 !== val2) {
        differences.push({
          path: `env.${key}`,
          env1: val1 || '(未设置)',
          env2: val2 || '(未设置)'
        });
      }
    });

    // 这里可以添加更复杂的配置对象比较逻辑

    return differences;
  }
}

// CLI接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const switcher = new EnvironmentSwitcher();

  try {
    switch (command) {
      case 'switch':
        const targetEnv = args[1];
        if (!targetEnv) {
          console.error('❌ 请指定目标环境');
          process.exit(1);
        }
        switcher.switchTo(targetEnv);
        break;
      
      case 'current':
        const currentEnv = switcher.getCurrentEnvironment();
        console.log(`当前环境: ${currentEnv}`);
        switcher.showEnvironmentInfo(currentEnv);
        break;
      
      case 'list':
        switcher.listEnvironments();
        break;
      
      case 'create':
        const newEnv = args[1];
        const baseEnv = args[2] || 'development';
        if (!newEnv) {
          console.error('❌ 请指定新环境名称');
          process.exit(1);
        }
        switcher.createEnvironment(newEnv, baseEnv);
        break;
      
      case 'remove':
        const envToRemove = args[1];
        if (!envToRemove) {
          console.error('❌ 请指定要删除的环境');
          process.exit(1);
        }
        switcher.removeEnvironment(envToRemove);
        break;
      
      case 'compare':
        const env1 = args[1];
        const env2 = args[2];
        if (!env1 || !env2) {
          console.error('❌ 请指定两个要比较的环境');
          process.exit(1);
        }
        switcher.compareEnvironments(env1, env2);
        break;
      
      default:
        console.log(`
🔄 PDCS-Fronted-UI 环境切换工具

使用方法:
  node scripts/env-switcher.js switch <env>      # 切换到指定环境
  node scripts/env-switcher.js current           # 显示当前环境
  node scripts/env-switcher.js list              # 列出所有环境
  node scripts/env-switcher.js create <env>      # 创建新环境
  node scripts/env-switcher.js remove <env>      # 删除环境
  node scripts/env-switcher.js compare <env1> <env2>  # 比较环境

示例:
  node scripts/env-switcher.js switch production
  node scripts/env-switcher.js create testing development
  node scripts/env-switcher.js compare development production
        `);
    }
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
    process.exit(1);
  }
}

module.exports = EnvironmentSwitcher;
