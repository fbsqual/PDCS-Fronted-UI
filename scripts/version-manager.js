#!/usr/bin/env node

/**
 * PDCS-Fronted-UI 版本管理工具
 * 用于管理项目版本、生成变更日志、执行迁移脚本
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VersionManager {
  constructor() {
    this.packagePath = path.join(process.cwd(), 'package.json');
    this.changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
    this.migrationsDir = path.join(process.cwd(), 'migrations');
    this.configPath = path.join(process.cwd(), '.version-config.json');
  }

  /**
   * 获取当前版本
   */
  getCurrentVersion() {
    const packageJson = JSON.parse(fs.readFileSync(this.packagePath, 'utf8'));
    return packageJson.version;
  }

  /**
   * 更新版本号
   * @param {string} type - 版本类型: major, minor, patch
   * @param {string} message - 版本更新说明
   */
  updateVersion(type, message) {
    const currentVersion = this.getCurrentVersion();
    console.log(`📦 当前版本: ${currentVersion}`);

    // 使用 npm version 命令更新版本
    const newVersion = execSync(`npm version ${type} --no-git-tag-version`, { encoding: 'utf8' }).trim();
    console.log(`🚀 新版本: ${newVersion}`);

    // 更新变更日志
    this.updateChangelog(newVersion, type, message);

    // 生成迁移脚本模板
    this.generateMigrationTemplate(currentVersion, newVersion, type);

    return newVersion;
  }

  /**
   * 更新变更日志
   */
  updateChangelog(version, type, message) {
    const date = new Date().toISOString().split('T')[0];
    const versionHeader = `## [${version}] - ${date}`;
    
    let changeType = '';
    switch (type) {
      case 'major':
        changeType = '### 💥 Breaking Changes';
        break;
      case 'minor':
        changeType = '### ✨ New Features';
        break;
      case 'patch':
        changeType = '### 🐛 Bug Fixes';
        break;
    }

    const changeEntry = `${versionHeader}\n\n${changeType}\n- ${message}\n\n`;

    if (fs.existsSync(this.changelogPath)) {
      const existingChangelog = fs.readFileSync(this.changelogPath, 'utf8');
      const updatedChangelog = changeEntry + existingChangelog;
      fs.writeFileSync(this.changelogPath, updatedChangelog);
    } else {
      const initialChangelog = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n${changeEntry}`;
      fs.writeFileSync(this.changelogPath, initialChangelog);
    }

    console.log(`📝 已更新 CHANGELOG.md`);
  }

  /**
   * 生成迁移脚本模板
   */
  generateMigrationTemplate(fromVersion, toVersion, type) {
    if (!fs.existsSync(this.migrationsDir)) {
      fs.mkdirSync(this.migrationsDir, { recursive: true });
    }

    const migrationName = `${fromVersion}-to-${toVersion}.js`;
    const migrationPath = path.join(this.migrationsDir, migrationName);

    const migrationTemplate = `/**
 * 迁移脚本: ${fromVersion} -> ${toVersion}
 * 类型: ${type}
 * 生成时间: ${new Date().toISOString()}
 */

const fs = require('fs');
const path = require('path');

class Migration_${fromVersion.replace(/\./g, '_')}_to_${toVersion.replace(/\./g, '_')} {
  constructor(projectPath) {
    this.projectPath = projectPath;
  }

  /**
   * 执行迁移
   */
  async up() {
    console.log('🔄 执行迁移: ${fromVersion} -> ${toVersion}');
    
    // TODO: 在这里添加迁移逻辑
    // 例如：
    // - 更新配置文件
    // - 重命名文件或目录
    // - 更新依赖项
    // - 修改代码结构
    
    ${type === 'major' ? `
    // 主版本更新 - 可能包含破坏性更改
    await this.handleBreakingChanges();
    ` : type === 'minor' ? `
    // 次版本更新 - 新功能添加
    await this.addNewFeatures();
    ` : `
    // 补丁版本更新 - Bug修复
    await this.applyBugFixes();
    `}
    
    console.log('✅ 迁移完成');
  }

  /**
   * 回滚迁移
   */
  async down() {
    console.log('⏪ 回滚迁移: ${toVersion} -> ${fromVersion}');
    
    // TODO: 在这里添加回滚逻辑
    
    console.log('✅ 回滚完成');
  }

  ${type === 'major' ? `
  /**
   * 处理破坏性更改
   */
  async handleBreakingChanges() {
    // TODO: 实现破坏性更改的处理逻辑
    console.log('⚠️  处理破坏性更改...');
  }
  ` : type === 'minor' ? `
  /**
   * 添加新功能
   */
  async addNewFeatures() {
    // TODO: 实现新功能的添加逻辑
    console.log('✨ 添加新功能...');
  }
  ` : `
  /**
   * 应用Bug修复
   */
  async applyBugFixes() {
    // TODO: 实现Bug修复的逻辑
    console.log('🐛 应用Bug修复...');
  }
  `}

  /**
   * 验证迁移结果
   */
  async validate() {
    console.log('🔍 验证迁移结果...');
    
    // TODO: 添加验证逻辑
    // - 检查文件是否存在
    // - 验证配置是否正确
    // - 运行测试确保功能正常
    
    return true;
  }
}

module.exports = Migration_${fromVersion.replace(/\./g, '_')}_to_${toVersion.replace(/\./g, '_')};
`;

    fs.writeFileSync(migrationPath, migrationTemplate);
    console.log(`📄 已生成迁移脚本: ${migrationName}`);
  }

  /**
   * 执行迁移
   */
  async runMigrations(targetVersion) {
    const currentVersion = this.getCurrentVersion();
    console.log(`🔄 执行迁移: ${currentVersion} -> ${targetVersion}`);

    // 获取所有迁移文件
    const migrationFiles = fs.readdirSync(this.migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort();

    for (const file of migrationFiles) {
      const migrationPath = path.join(this.migrationsDir, file);
      const Migration = require(migrationPath);
      const migration = new Migration(process.cwd());

      try {
        await migration.up();
        await migration.validate();
      } catch (error) {
        console.error(`❌ 迁移失败: ${file}`, error);
        throw error;
      }
    }

    console.log('✅ 所有迁移执行完成');
  }

  /**
   * 检查版本兼容性
   */
  checkCompatibility(targetVersion) {
    const currentVersion = this.getCurrentVersion();
    const current = this.parseVersion(currentVersion);
    const target = this.parseVersion(targetVersion);

    if (target.major > current.major) {
      console.warn('⚠️  主版本升级可能包含破坏性更改');
      return 'major';
    } else if (target.minor > current.minor) {
      console.log('✨ 次版本升级，包含新功能');
      return 'minor';
    } else if (target.patch > current.patch) {
      console.log('🐛 补丁版本升级，包含Bug修复');
      return 'patch';
    }

    return 'compatible';
  }

  /**
   * 解析版本号
   */
  parseVersion(version) {
    const [major, minor, patch] = version.replace('v', '').split('.').map(Number);
    return { major, minor, patch };
  }
}

// CLI 接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const versionManager = new VersionManager();

  switch (command) {
    case 'update':
      const type = args[1] || 'patch';
      const message = args[2] || 'Version update';
      versionManager.updateVersion(type, message);
      break;
    
    case 'migrate':
      const targetVersion = args[1];
      if (!targetVersion) {
        console.error('❌ 请指定目标版本');
        process.exit(1);
      }
      versionManager.runMigrations(targetVersion);
      break;
    
    case 'check':
      const checkVersion = args[1];
      if (!checkVersion) {
        console.error('❌ 请指定要检查的版本');
        process.exit(1);
      }
      const compatibility = versionManager.checkCompatibility(checkVersion);
      console.log(`兼容性检查结果: ${compatibility}`);
      break;
    
    default:
      console.log(`
📦 PDCS-Fronted-UI 版本管理工具

使用方法:
  node scripts/version-manager.js update [major|minor|patch] [message]
  node scripts/version-manager.js migrate [target-version]
  node scripts/version-manager.js check [version]

示例:
  node scripts/version-manager.js update minor "添加新的图表组件"
  node scripts/version-manager.js migrate 1.2.0
  node scripts/version-manager.js check 1.1.0
      `);
  }
}

module.exports = VersionManager;
