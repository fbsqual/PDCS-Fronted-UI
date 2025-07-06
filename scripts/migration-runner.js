#!/usr/bin/env node

/**
 * PDCS-Fronted-UI 迁移脚本执行器
 * 用于安全地执行版本迁移和回滚操作
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class MigrationRunner {
  constructor() {
    this.migrationsDir = path.join(process.cwd(), 'migrations');
    this.backupDir = path.join(process.cwd(), '.migration-backups');
    this.logFile = path.join(process.cwd(), 'migration.log');
    this.configPath = path.join(process.cwd(), '.version-config.json');
  }

  /**
   * 初始化迁移环境
   */
  init() {
    // 创建必要的目录
    [this.migrationsDir, this.backupDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 创建目录: ${dir}`);
      }
    });

    // 创建迁移状态文件
    const statusFile = path.join(this.migrationsDir, '.migration-status.json');
    if (!fs.existsSync(statusFile)) {
      fs.writeFileSync(statusFile, JSON.stringify({
        lastMigration: null,
        appliedMigrations: [],
        createdAt: new Date().toISOString()
      }, null, 2));
      console.log('📄 创建迁移状态文件');
    }

    console.log('✅ 迁移环境初始化完成');
  }

  /**
   * 获取迁移状态
   */
  getStatus() {
    const statusFile = path.join(this.migrationsDir, '.migration-status.json');
    if (fs.existsSync(statusFile)) {
      return JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    }
    return { lastMigration: null, appliedMigrations: [] };
  }

  /**
   * 更新迁移状态
   */
  updateStatus(migrationName, action = 'applied') {
    const statusFile = path.join(this.migrationsDir, '.migration-status.json');
    const status = this.getStatus();
    
    if (action === 'applied') {
      if (!status.appliedMigrations.includes(migrationName)) {
        status.appliedMigrations.push(migrationName);
      }
      status.lastMigration = migrationName;
    } else if (action === 'reverted') {
      status.appliedMigrations = status.appliedMigrations.filter(m => m !== migrationName);
      status.lastMigration = status.appliedMigrations[status.appliedMigrations.length - 1] || null;
    }
    
    status.updatedAt = new Date().toISOString();
    fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
  }

  /**
   * 创建备份
   */
  createBackup(migrationName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `${migrationName}-${timestamp}`;
    const backupPath = path.join(this.backupDir, backupName);
    
    fs.mkdirSync(backupPath, { recursive: true });
    
    // 备份关键文件
    const filesToBackup = [
      'package.json',
      'package-lock.json',
      'next.config.js',
      'tailwind.config.ts',
      'tsconfig.json',
      '.env.local',
      'src/app/layout.tsx',
      'src/components',
      'src/lib',
      'src/styles'
    ];
    
    filesToBackup.forEach(file => {
      const sourcePath = path.join(process.cwd(), file);
      const targetPath = path.join(backupPath, file);
      
      if (fs.existsSync(sourcePath)) {
        if (fs.statSync(sourcePath).isDirectory()) {
          this.copyDirectory(sourcePath, targetPath);
        } else {
          fs.mkdirSync(path.dirname(targetPath), { recursive: true });
          fs.copyFileSync(sourcePath, targetPath);
        }
      }
    });
    
    console.log(`💾 创建备份: ${backupName}`);
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
   * 获取待执行的迁移
   */
  getPendingMigrations() {
    const status = this.getStatus();
    const allMigrations = fs.readdirSync(this.migrationsDir)
      .filter(file => file.endsWith('.js') && !file.startsWith('.'))
      .sort();
    
    return allMigrations.filter(migration => 
      !status.appliedMigrations.includes(migration.replace('.js', ''))
    );
  }

  /**
   * 执行单个迁移
   */
  async runMigration(migrationFile, direction = 'up') {
    const migrationName = migrationFile.replace('.js', '');
    const migrationPath = path.join(this.migrationsDir, migrationFile);
    
    console.log(`🔄 执行迁移: ${migrationName} (${direction})`);
    
    try {
      // 创建备份
      if (direction === 'up') {
        this.createBackup(migrationName);
      }
      
      // 加载并执行迁移
      delete require.cache[require.resolve(migrationPath)];
      const Migration = require(migrationPath);
      const migration = new Migration(process.cwd());
      
      // 执行迁移
      if (direction === 'up') {
        await migration.up();
      } else {
        await migration.down();
      }
      
      // 验证迁移结果
      const isValid = await migration.validate();
      if (!isValid) {
        throw new Error('迁移验证失败');
      }
      
      // 更新状态
      this.updateStatus(migrationName, direction === 'up' ? 'applied' : 'reverted');
      
      // 记录日志
      this.log(`✅ 迁移成功: ${migrationName} (${direction})`);
      console.log(`✅ 迁移成功: ${migrationName}`);
      
    } catch (error) {
      this.log(`❌ 迁移失败: ${migrationName} - ${error.message}`);
      console.error(`❌ 迁移失败: ${migrationName}`, error);
      throw error;
    }
  }

  /**
   * 执行所有待处理的迁移
   */
  async runPendingMigrations() {
    const pendingMigrations = this.getPendingMigrations();
    
    if (pendingMigrations.length === 0) {
      console.log('✅ 没有待执行的迁移');
      return;
    }
    
    console.log(`📋 发现 ${pendingMigrations.length} 个待执行的迁移:`);
    pendingMigrations.forEach(migration => {
      console.log(`  - ${migration}`);
    });
    
    for (const migration of pendingMigrations) {
      await this.runMigration(migration, 'up');
    }
    
    console.log('🎉 所有迁移执行完成');
  }

  /**
   * 回滚迁移
   */
  async rollback(steps = 1) {
    const status = this.getStatus();
    const appliedMigrations = [...status.appliedMigrations].reverse();
    
    if (appliedMigrations.length === 0) {
      console.log('ℹ️  没有可回滚的迁移');
      return;
    }
    
    const migrationsToRollback = appliedMigrations.slice(0, steps);
    
    console.log(`⏪ 回滚 ${migrationsToRollback.length} 个迁移:`);
    migrationsToRollback.forEach(migration => {
      console.log(`  - ${migration}`);
    });
    
    for (const migrationName of migrationsToRollback) {
      await this.runMigration(`${migrationName}.js`, 'down');
    }
    
    console.log('✅ 回滚完成');
  }

  /**
   * 记录日志
   */
  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(this.logFile, logEntry);
  }

  /**
   * 清理旧备份
   */
  cleanupBackups(retentionDays = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    if (!fs.existsSync(this.backupDir)) return;
    
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
    }
  }
}

// CLI 接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const runner = new MigrationRunner();

  (async () => {
    try {
      switch (command) {
        case 'init':
          runner.init();
          break;
        
        case 'status':
          const status = runner.getStatus();
          console.log('📊 迁移状态:');
          console.log(`  最后迁移: ${status.lastMigration || '无'}`);
          console.log(`  已应用迁移: ${status.appliedMigrations.length}`);
          if (status.appliedMigrations.length > 0) {
            status.appliedMigrations.forEach(migration => {
              console.log(`    - ${migration}`);
            });
          }
          break;
        
        case 'run':
          await runner.runPendingMigrations();
          break;
        
        case 'rollback':
          const steps = parseInt(args[1]) || 1;
          await runner.rollback(steps);
          break;
        
        case 'cleanup':
          const days = parseInt(args[1]) || 30;
          runner.cleanupBackups(days);
          break;
        
        default:
          console.log(`
🔄 PDCS-Fronted-UI 迁移执行器

使用方法:
  node scripts/migration-runner.js init                 # 初始化迁移环境
  node scripts/migration-runner.js status               # 查看迁移状态
  node scripts/migration-runner.js run                  # 执行所有待处理迁移
  node scripts/migration-runner.js rollback [steps]     # 回滚迁移
  node scripts/migration-runner.js cleanup [days]       # 清理旧备份

示例:
  node scripts/migration-runner.js rollback 2          # 回滚最近2个迁移
  node scripts/migration-runner.js cleanup 7           # 清理7天前的备份
          `);
      }
    } catch (error) {
      console.error('❌ 执行失败:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = MigrationRunner;
