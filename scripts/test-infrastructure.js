#!/usr/bin/env node

/**
 * PDCS-Fronted-UI 基础设施测试脚本
 * 用于验证所有新增的基础设施功能是否正常工作
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class InfrastructureTest {
  constructor() {
    this.testResults = [];
    this.passedTests = 0;
    this.failedTests = 0;
  }

  /**
   * 运行所有基础设施测试
   */
  async runAllTests() {
    console.log('🧪 开始基础设施功能测试...\n');

    // 测试脚本文件存在性
    await this.testScriptFiles();
    
    // 测试配置文件
    await this.testConfigFiles();
    
    // 测试文档文件
    await this.testDocumentationFiles();
    
    // 测试NPM脚本
    await this.testNpmScripts();
    
    // 测试Git工作流
    await this.testGitWorkflows();

    // 输出测试结果
    this.outputResults();
  }

  /**
   * 测试脚本文件存在性和基本语法
   */
  async testScriptFiles() {
    console.log('📁 测试脚本文件...');
    
    const scriptFiles = [
      'config-manager.js',
      'config-validator.js',
      'env-switcher.js',
      'test-manager.js',
      'quality-assurance.js',
      'version-manager.js',
      'project-updater.js',
      'migration-runner.js',
      'create-project-enhanced.sh'
    ];

    for (const file of scriptFiles) {
      const filePath = path.join(process.cwd(), 'scripts', file);
      
      try {
        // 检查文件存在
        if (!fs.existsSync(filePath)) {
          throw new Error(`文件不存在: ${file}`);
        }

        // 检查文件大小
        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
          throw new Error(`文件为空: ${file}`);
        }

        // 对于JS文件，检查基本语法
        if (file.endsWith('.js')) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // 检查是否有基本的类或函数定义
          if (!content.includes('class ') && !content.includes('function ')) {
            throw new Error(`文件缺少类或函数定义: ${file}`);
          }

          // 检查是否有注释
          if (!content.includes('/**') && !content.includes('//')) {
            throw new Error(`文件缺少注释: ${file}`);
          }
        }

        this.addTestResult(`✅ 脚本文件 ${file}`, true);
      } catch (error) {
        this.addTestResult(`❌ 脚本文件 ${file}: ${error.message}`, false);
      }
    }
  }

  /**
   * 测试配置文件
   */
  async testConfigFiles() {
    console.log('⚙️ 测试配置文件...');
    
    const configFiles = [
      '.version-config.json',
      'CHANGELOG.md',
      '.github/workflows/ci.yml',
      '.github/workflows/release.yml',
      '.github/workflows/dependency-update.yml'
    ];

    for (const file of configFiles) {
      const filePath = path.join(process.cwd(), file);
      
      try {
        if (!fs.existsSync(filePath)) {
          throw new Error(`配置文件不存在: ${file}`);
        }

        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
          throw new Error(`配置文件为空: ${file}`);
        }

        // 对于JSON文件，验证格式
        if (file.endsWith('.json')) {
          const content = fs.readFileSync(filePath, 'utf8');
          JSON.parse(content); // 验证JSON格式
        }

        this.addTestResult(`✅ 配置文件 ${file}`, true);
      } catch (error) {
        this.addTestResult(`❌ 配置文件 ${file}: ${error.message}`, false);
      }
    }
  }

  /**
   * 测试文档文件
   */
  async testDocumentationFiles() {
    console.log('📚 测试文档文件...');
    
    const docFiles = [
      'docs/UPGRADE_GUIDE.md',
      'docs/MIGRATION_GUIDE.md',
      'docs/API_CHANGES.md',
      'docs/TESTING_AND_QUALITY.md',
      'docs/CONFIGURATION_MANAGEMENT.md',
      'docs/PROJECT_SCAFFOLDING.md',
      'docs/INFRASTRUCTURE_UPDATE_SUMMARY.md'
    ];

    for (const file of docFiles) {
      const filePath = path.join(process.cwd(), file);
      
      try {
        if (!fs.existsSync(filePath)) {
          throw new Error(`文档文件不存在: ${file}`);
        }

        const content = fs.readFileSync(filePath, 'utf8');
        
        // 检查文档长度
        if (content.length < 1000) {
          throw new Error(`文档内容过短: ${file}`);
        }

        // 检查是否有标题
        if (!content.includes('#')) {
          throw new Error(`文档缺少标题: ${file}`);
        }

        this.addTestResult(`✅ 文档文件 ${file}`, true);
      } catch (error) {
        this.addTestResult(`❌ 文档文件 ${file}: ${error.message}`, false);
      }
    }
  }

  /**
   * 测试NPM脚本
   */
  async testNpmScripts() {
    console.log('📦 测试NPM脚本...');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const scripts = packageJson.scripts || {};

      // 检查关键脚本是否存在
      const requiredScripts = [
        'config:init',
        'test:init',
        'quality:init',
        'version:check',
        'sync:check'
      ];

      for (const script of requiredScripts) {
        if (!scripts[script]) {
          throw new Error(`缺少NPM脚本: ${script}`);
        }
        this.addTestResult(`✅ NPM脚本 ${script}`, true);
      }

      // 统计新增脚本数量
      const newScripts = Object.keys(scripts).filter(script => 
        script.startsWith('config:') || 
        script.startsWith('test:') || 
        script.startsWith('quality:') || 
        script.startsWith('version:') || 
        script.startsWith('sync:')
      );

      console.log(`   📊 新增脚本数量: ${newScripts.length}`);
      
    } catch (error) {
      this.addTestResult(`❌ NPM脚本测试: ${error.message}`, false);
    }
  }

  /**
   * 测试Git工作流文件
   */
  async testGitWorkflows() {
    console.log('🔄 测试Git工作流...');
    
    const workflowDir = path.join(process.cwd(), '.github', 'workflows');
    
    try {
      if (!fs.existsSync(workflowDir)) {
        throw new Error('工作流目录不存在');
      }

      const workflows = fs.readdirSync(workflowDir);
      const expectedWorkflows = ['ci.yml', 'release.yml', 'dependency-update.yml'];

      for (const workflow of expectedWorkflows) {
        if (!workflows.includes(workflow)) {
          throw new Error(`工作流文件不存在: ${workflow}`);
        }

        const workflowPath = path.join(workflowDir, workflow);
        const content = fs.readFileSync(workflowPath, 'utf8');
        
        // 检查工作流基本结构
        if (!content.includes('name:') || !content.includes('on:')) {
          throw new Error(`工作流格式错误: ${workflow}`);
        }

        this.addTestResult(`✅ Git工作流 ${workflow}`, true);
      }
      
    } catch (error) {
      this.addTestResult(`❌ Git工作流测试: ${error.message}`, false);
    }
  }

  /**
   * 添加测试结果
   */
  addTestResult(message, passed) {
    this.testResults.push({ message, passed });
    if (passed) {
      this.passedTests++;
    } else {
      this.failedTests++;
    }
    console.log(`   ${message}`);
  }

  /**
   * 输出测试结果
   */
  outputResults() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 基础设施测试结果');
    console.log('='.repeat(60));
    
    console.log(`✅ 通过测试: ${this.passedTests}`);
    console.log(`❌ 失败测试: ${this.failedTests}`);
    console.log(`📊 总计测试: ${this.testResults.length}`);
    console.log(`📈 成功率: ${((this.passedTests / this.testResults.length) * 100).toFixed(1)}%`);

    if (this.failedTests > 0) {
      console.log('\n❌ 失败的测试:');
      this.testResults
        .filter(result => !result.passed)
        .forEach(result => console.log(`   ${result.message}`));
    }

    console.log('\n' + '='.repeat(60));
    
    if (this.failedTests === 0) {
      console.log('🎉 所有基础设施功能测试通过！');
      process.exit(0);
    } else {
      console.log('⚠️ 部分测试失败，请检查上述问题');
      process.exit(1);
    }
  }
}

// 运行测试
if (require.main === module) {
  const tester = new InfrastructureTest();
  tester.runAllTests().catch(error => {
    console.error('❌ 测试运行失败:', error);
    process.exit(1);
  });
}

module.exports = InfrastructureTest;
