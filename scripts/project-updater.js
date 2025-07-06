#!/usr/bin/env node

/**
 * PDCS-Fronted-UI 项目更新工具
 * 用于安全地更新基于框架创建的项目
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProjectUpdater {
  constructor() {
    this.configPath = path.join(process.cwd(), '.pdcs-config.json');
    this.packagePath = path.join(process.cwd(), 'package.json');
    this.backupDir = path.join(process.cwd(), '.update-backups');
  }

  /**
   * 获取项目配置
   */
  getConfig() {
    if (fs.existsSync(this.configPath)) {
      return JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    }
    throw new Error('未找到 .pdcs-config.json 配置文件，请确认这是一个PDCS项目');
  }

  /**
   * 获取包信息
   */
  getPackageInfo() {
    if (fs.existsSync(this.packagePath)) {
      return JSON.parse(fs.readFileSync(this.packagePath, 'utf8'));
    }
    throw new Error('未找到 package.json 文件');
  }

  /**
   * 检查框架更新
   */
  async checkFrameworkUpdates() {
    console.log('🔍 检查PDCS-Fronted-UI框架更新...');
    
    const config = this.getConfig();
    const currentVersion = config.framework_version;
    
    try {
      // 检查NPM上的最新版本
      const latestVersion = execSync('npm view @fbsqual/pdcs-fronted-ui version', { encoding: 'utf8' }).trim();
      
      console.log(`当前框架版本: ${currentVersion}`);
      console.log(`最新框架版本: ${latestVersion}`);
      
      if (this.compareVersions(currentVersion, latestVersion) < 0) {
        const updateType = this.getUpdateType(currentVersion, latestVersion);
        console.log(`✨ 发现新版本! (${updateType} 更新)`);
        
        return {
          hasUpdate: true,
          currentVersion,
          latestVersion,
          updateType,
          isBreaking: updateType === 'major'
        };
      } else {
        console.log('✅ 框架已是最新版本');
        return { hasUpdate: false };
      }
    } catch (error) {
      console.error('❌ 检查更新失败:', error.message);
      return { hasUpdate: false, error: error.message };
    }
  }

  /**
   * 比较版本号
   */
  compareVersions(version1, version2) {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part < v2Part) return -1;
      if (v1Part > v2Part) return 1;
    }
    
    return 0;
  }

  /**
   * 获取更新类型
   */
  getUpdateType(current, latest) {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);
    
    if (latestParts[0] > currentParts[0]) return 'major';
    if (latestParts[1] > currentParts[1]) return 'minor';
    if (latestParts[2] > currentParts[2]) return 'patch';
    return 'unknown';
  }

  /**
   * 创建更新备份
   */
  createUpdateBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `update-${timestamp}`);
    
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
    
    fs.mkdirSync(backupPath, { recursive: true });
    
    // 备份关键文件和目录
    const itemsToBackup = [
      'package.json',
      'package-lock.json',
      '.pdcs-config.json',
      'next.config.js',
      'tailwind.config.ts',
      'tsconfig.json',
      'src/components',
      'src/lib',
      'src/styles'
    ];
    
    itemsToBackup.forEach(item => {
      const sourcePath = path.join(process.cwd(), item);
      const targetPath = path.join(backupPath, item);
      
      if (fs.existsSync(sourcePath)) {
        if (fs.statSync(sourcePath).isDirectory()) {
          this.copyDirectory(sourcePath, targetPath);
        } else {
          fs.mkdirSync(path.dirname(targetPath), { recursive: true });
          fs.copyFileSync(sourcePath, targetPath);
        }
      }
    });
    
    console.log(`💾 创建更新备份: ${backupPath}`);
    return backupPath;
  }

  /**
   * 复制目录
   */
  copyDirectory(source, target) {
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }
    
    const files = fs.readdirSync(source);
    files.forEach(file => {
      const sourcePath = path.join(source, file);
      const targetPath = path.join(target, file);
      
      if (fs.statSync(sourcePath).isDirectory()) {
        this.copyDirectory(sourcePath, targetPath);
      } else {
        fs.copyFileSync(sourcePath, targetPath);
      }
    });
  }

  /**
   * 执行框架更新
   */
  async updateFramework(targetVersion = 'latest', options = {}) {
    const { force = false, skipBackup = false, skipTests = false } = options;
    
    console.log(`🚀 开始更新PDCS-Fronted-UI到版本: ${targetVersion}`);
    
    const config = this.getConfig();
    const currentVersion = config.framework_version;
    
    // 检查是否需要强制更新
    if (!force && this.compareVersions(currentVersion, targetVersion) >= 0) {
      console.log('ℹ️  当前版本已经是最新或更高版本');
      return;
    }
    
    let backupPath = null;
    
    try {
      // 创建备份
      if (!skipBackup) {
        backupPath = this.createUpdateBackup();
      }
      
      // 检查破坏性更改
      const updateType = this.getUpdateType(currentVersion, targetVersion);
      if (updateType === 'major' && !force) {
        console.log('⚠️  检测到主版本更新，可能包含破坏性更改');
        console.log('请使用 --force 参数确认更新，或查看迁移指南');
        return;
      }
      
      // 更新框架包
      console.log('📦 更新框架包...');
      execSync(`npm install @fbsqual/pdcs-fronted-ui@${targetVersion}`, { stdio: 'inherit' });
      
      // 运行迁移脚本
      if (fs.existsSync('scripts/migration-runner.js')) {
        console.log('🔄 运行迁移脚本...');
        execSync('node scripts/migration-runner.js run', { stdio: 'inherit' });
      }
      
      // 运行测试
      if (!skipTests) {
        console.log('🧪 运行测试验证...');
        try {
          execSync('npm test', { stdio: 'inherit' });
        } catch (error) {
          console.warn('⚠️  测试失败，但更新继续进行');
        }
      }
      
      // 更新配置文件
      this.updateProjectConfig(targetVersion);
      
      console.log('✅ 框架更新完成!');
      console.log(`📊 版本: ${currentVersion} → ${targetVersion}`);
      
      // 显示更新后的操作建议
      this.showPostUpdateInstructions(updateType);
      
    } catch (error) {
      console.error('❌ 更新失败:', error.message);
      
      if (backupPath && !skipBackup) {
        console.log('🔄 正在恢复备份...');
        this.restoreBackup(backupPath);
      }
      
      throw error;
    }
  }

  /**
   * 更新项目配置
   */
  updateProjectConfig(version) {
    const config = this.getConfig();
    config.framework_version = version;
    config.last_updated = new Date().toISOString();
    
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
    console.log('📝 更新项目配置文件');
  }

  /**
   * 恢复备份
   */
  restoreBackup(backupPath) {
    if (!fs.existsSync(backupPath)) {
      console.error('❌ 备份路径不存在:', backupPath);
      return;
    }
    
    const files = fs.readdirSync(backupPath);
    files.forEach(file => {
      const sourcePath = path.join(backupPath, file);
      const targetPath = path.join(process.cwd(), file);
      
      if (fs.statSync(sourcePath).isDirectory()) {
        if (fs.existsSync(targetPath)) {
          fs.rmSync(targetPath, { recursive: true, force: true });
        }
        this.copyDirectory(sourcePath, targetPath);
      } else {
        fs.copyFileSync(sourcePath, targetPath);
      }
    });
    
    console.log('✅ 备份恢复完成');
  }

  /**
   * 显示更新后说明
   */
  showPostUpdateInstructions(updateType) {
    console.log('\n📋 更新后建议操作:');
    
    switch (updateType) {
      case 'major':
        console.log('  1. 🔍 检查破坏性更改文档');
        console.log('  2. 🧪 运行完整测试套件');
        console.log('  3. 📚 查看迁移指南');
        console.log('  4. 🔄 更新自定义组件');
        break;
      case 'minor':
        console.log('  1. 📖 查看新功能文档');
        console.log('  2. 🧪 运行测试确保兼容性');
        console.log('  3. ✨ 考虑使用新功能');
        break;
      case 'patch':
        console.log('  1. 🧪 运行测试验证修复');
        console.log('  2. 📝 查看修复日志');
        break;
    }
    
    console.log('\n🔗 相关链接:');
    console.log('  📚 文档: https://github.com/fbsqual/PDCS-Fronted-UI#readme');
    console.log('  📋 变更日志: https://github.com/fbsqual/PDCS-Fronted-UI/blob/main/CHANGELOG.md');
    console.log('  🐛 问题反馈: https://github.com/fbsqual/PDCS-Fronted-UI/issues');
  }

  /**
   * 清理旧备份
   */
  cleanupBackups(retentionDays = 30) {
    if (!fs.existsSync(this.backupDir)) return;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    const backups = fs.readdirSync(this.backupDir);
    let cleanedCount = 0;
    
    backups.forEach(backup => {
      const backupPath = path.join(this.backupDir, backup);
      const stats = fs.statSync(backupPath);
      
      if (stats.mtime < cutoffDate) {
        fs.rmSync(backupPath, { recursive: true, force: true });
        cleanedCount++;
      }
    });
    
    if (cleanedCount > 0) {
      console.log(`🧹 清理了 ${cleanedCount} 个过期备份`);
    } else {
      console.log('ℹ️  没有需要清理的过期备份');
    }
  }
}

// CLI接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const updater = new ProjectUpdater();

  (async () => {
    try {
      switch (command) {
        case 'check':
          const result = await updater.checkFrameworkUpdates();
          if (result.hasUpdate) {
            console.log(`\n📋 更新信息:`);
            console.log(`  类型: ${result.updateType}`);
            console.log(`  当前: ${result.currentVersion}`);
            console.log(`  最新: ${result.latestVersion}`);
            if (result.isBreaking) {
              console.log(`  ⚠️  包含破坏性更改`);
            }
            console.log(`\n运行 'npm run sync:update' 来更新框架`);
          }
          break;
        
        case 'update':
          const version = args[1] || 'latest';
          const force = args.includes('--force');
          const skipBackup = args.includes('--skip-backup');
          const skipTests = args.includes('--skip-tests');
          
          await updater.updateFramework(version, { force, skipBackup, skipTests });
          break;
        
        case 'cleanup':
          const days = parseInt(args[1]) || 30;
          updater.cleanupBackups(days);
          break;
        
        default:
          console.log(`
🔄 PDCS-Fronted-UI 项目更新工具

使用方法:
  node scripts/project-updater.js check                    # 检查更新
  node scripts/project-updater.js update                   # 更新到最新版本
  node scripts/project-updater.js update 1.2.0            # 更新到指定版本
  node scripts/project-updater.js update --force           # 强制更新
  node scripts/project-updater.js update --skip-backup     # 跳过备份
  node scripts/project-updater.js update --skip-tests      # 跳过测试
  node scripts/project-updater.js cleanup [days]           # 清理旧备份

示例:
  node scripts/project-updater.js update 1.2.0 --force
  node scripts/project-updater.js cleanup 7
          `);
      }
    } catch (error) {
      console.error('❌ 执行失败:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = ProjectUpdater;
