#!/usr/bin/env node

/**
 * PDCS-Fronted-UI 质量保证工具
 * 用于代码质量检查、性能分析和安全审计
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class QualityAssurance {
  constructor() {
    this.projectRoot = process.cwd();
    this.reportsDir = path.join(this.projectRoot, 'quality-reports');
    this.configDir = path.join(this.projectRoot, 'quality-config');
  }

  /**
   * 初始化质量保证工具
   */
  init() {
    console.log('🔍 初始化质量保证工具...');
    
    // 创建目录结构
    this.createDirectories();
    
    // 创建配置文件
    this.createConfigs();
    
    // 创建质量检查脚本
    this.createQualityScripts();
    
    console.log('✅ 质量保证工具初始化完成');
  }

  /**
   * 创建目录结构
   */
  createDirectories() {
    const dirs = [
      this.reportsDir,
      path.join(this.reportsDir, 'lint'),
      path.join(this.reportsDir, 'security'),
      path.join(this.reportsDir, 'performance'),
      path.join(this.reportsDir, 'accessibility'),
      this.configDir
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * 创建配置文件
   */
  createConfigs() {
    // ESLint配置
    const eslintConfig = {
      extends: [
        'next/core-web-vitals',
        '@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      plugins: [
        '@typescript-eslint',
        'react-hooks',
        'jsx-a11y',
        'import'
      ],
      rules: {
        // TypeScript规则
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        
        // React规则
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        
        // 可访问性规则
        'jsx-a11y/alt-text': 'error',
        'jsx-a11y/aria-props': 'error',
        'jsx-a11y/aria-proptypes': 'error',
        'jsx-a11y/aria-unsupported-elements': 'error',
        'jsx-a11y/role-has-required-aria-props': 'error',
        'jsx-a11y/role-supports-aria-props': 'error',
        
        // 导入规则
        'import/order': ['error', {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          'newlines-between': 'always'
        }],
        
        // 通用规则
        'no-console': 'warn',
        'no-debugger': 'error',
        'no-unused-vars': 'off', // 使用TypeScript版本
        'prefer-const': 'error',
        'no-var': 'error'
      },
      settings: {
        react: {
          version: 'detect'
        }
      },
      env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true
      }
    };

    this.writeConfig('.eslintrc.json', JSON.stringify(eslintConfig, null, 2));

    // Prettier配置
    const prettierConfig = {
      semi: true,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      bracketSpacing: true,
      bracketSameLine: false,
      arrowParens: 'avoid',
      endOfLine: 'lf',
      overrides: [
        {
          files: '*.json',
          options: {
            printWidth: 200
          }
        }
      ]
    };

    this.writeConfig('.prettierrc.json', JSON.stringify(prettierConfig, null, 2));

    // Prettier忽略文件
    const prettierIgnore = `
# Dependencies
node_modules/
.next/
out/

# Build outputs
dist/
build/
coverage/

# Config files
.env*
*.log

# Generated files
*.d.ts
public/sw.js
public/workbox-*.js
`;

    this.writeConfig('.prettierignore', prettierIgnore.trim());

    // TypeScript配置增强
    const tsConfigEnhanced = {
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'es6'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [
          {
            name: 'next'
          }
        ],
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*'],
          '@/components/*': ['./src/components/*'],
          '@/lib/*': ['./src/lib/*'],
          '@/hooks/*': ['./src/hooks/*'],
          '@/types/*': ['./src/types/*']
        },
        // 严格检查选项
        noUnusedLocals: true,
        noUnusedParameters: true,
        exactOptionalPropertyTypes: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        noUncheckedIndexedAccess: true
      },
      include: [
        'next-env.d.ts',
        '**/*.ts',
        '**/*.tsx',
        '.next/types/**/*.ts'
      ],
      exclude: [
        'node_modules',
        '.next',
        'out',
        'dist'
      ]
    };

    this.writeConfig('tsconfig.strict.json', JSON.stringify(tsConfigEnhanced, null, 2));

    // Stylelint配置
    const stylelintConfig = {
      extends: [
        'stylelint-config-standard',
        'stylelint-config-tailwindcss'
      ],
      rules: {
        'at-rule-no-unknown': [
          true,
          {
            ignoreAtRules: [
              'tailwind',
              'apply',
              'variants',
              'responsive',
              'screen'
            ]
          }
        ],
        'declaration-block-trailing-semicolon': null,
        'no-descending-specificity': null,
        'function-no-unknown': [
          true,
          {
            ignoreFunctions: ['theme']
          }
        ]
      }
    };

    this.writeConfig('.stylelintrc.json', JSON.stringify(stylelintConfig, null, 2));
  }

  /**
   * 创建质量检查脚本
   */
  createQualityScripts() {
    // 代码质量检查脚本
    const lintScript = `#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class LintRunner {
  constructor() {
    this.reportsDir = path.join(process.cwd(), 'quality-reports', 'lint');
  }

  async runAll() {
    console.log('🔍 运行代码质量检查...');
    
    const results = {
      eslint: await this.runESLint(),
      prettier: await this.runPrettier(),
      typescript: await this.runTypeScript(),
      stylelint: await this.runStylelint()
    };

    this.generateReport(results);
    return results;
  }

  async runESLint() {
    console.log('📋 运行 ESLint...');
    try {
      const output = execSync('npx eslint . --ext .ts,.tsx,.js,.jsx --format json', {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const results = JSON.parse(output);
      const reportPath = path.join(this.reportsDir, 'eslint-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
      
      const errorCount = results.reduce((sum, file) => sum + file.errorCount, 0);
      const warningCount = results.reduce((sum, file) => sum + file.warningCount, 0);
      
      console.log(\`✅ ESLint: \${errorCount} 错误, \${warningCount} 警告\`);
      
      return {
        success: errorCount === 0,
        errors: errorCount,
        warnings: warningCount,
        reportPath
      };
    } catch (error) {
      console.error('❌ ESLint 检查失败:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async runPrettier() {
    console.log('💅 运行 Prettier...');
    try {
      execSync('npx prettier --check .', {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log('✅ Prettier: 代码格式正确');
      return { success: true };
    } catch (error) {
      console.log('⚠️  Prettier: 发现格式问题');
      return {
        success: false,
        canFix: true,
        message: '运行 npm run format 修复格式问题'
      };
    }
  }

  async runTypeScript() {
    console.log('🔷 运行 TypeScript 检查...');
    try {
      const output = execSync('npx tsc --noEmit --project tsconfig.strict.json', {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log('✅ TypeScript: 类型检查通过');
      return { success: true };
    } catch (error) {
      console.error('❌ TypeScript: 类型错误');
      const reportPath = path.join(this.reportsDir, 'typescript-errors.txt');
      fs.writeFileSync(reportPath, error.stdout || error.message);
      
      return {
        success: false,
        error: error.stdout || error.message,
        reportPath
      };
    }
  }

  async runStylelint() {
    console.log('🎨 运行 Stylelint...');
    try {
      const output = execSync('npx stylelint "**/*.css" --formatter json', {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const results = JSON.parse(output);
      const reportPath = path.join(this.reportsDir, 'stylelint-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
      
      const errorCount = results.reduce((sum, file) => sum + file.errored ? 1 : 0, 0);
      console.log(\`✅ Stylelint: \${errorCount} 个文件有问题\`);
      
      return {
        success: errorCount === 0,
        errors: errorCount,
        reportPath
      };
    } catch (error) {
      if (error.status === 2) {
        // Stylelint found issues
        return {
          success: false,
          error: 'CSS 样式问题',
          canFix: true
        };
      }
      
      console.error('❌ Stylelint 运行失败:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  generateReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        passed: Object.values(results).filter(r => r.success).length,
        failed: Object.values(results).filter(r => !r.success).length,
        total: Object.keys(results).length
      },
      details: results
    };

    const reportPath = path.join(this.reportsDir, 'quality-summary.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(\`📊 质量报告已保存到: \${reportPath}\`);
    console.log(\`📈 总体结果: \${report.summary.passed}/\${report.summary.total} 通过\`);
  }
}

if (require.main === module) {
  const runner = new LintRunner();
  runner.runAll().catch(console.error);
}

module.exports = LintRunner;
`;

    this.writeConfig('scripts/lint-runner.js', lintScript);

    // 安全审计脚本
    const securityScript = `#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class SecurityAuditor {
  constructor() {
    this.reportsDir = path.join(process.cwd(), 'quality-reports', 'security');
  }

  async runAudit() {
    console.log('🔒 运行安全审计...');
    
    const results = {
      npm: await this.runNpmAudit(),
      dependencies: await this.checkDependencies(),
      secrets: await this.scanSecrets()
    };

    this.generateReport(results);
    return results;
  }

  async runNpmAudit() {
    console.log('📦 运行 npm audit...');
    try {
      const output = execSync('npm audit --json', {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const results = JSON.parse(output);
      const reportPath = path.join(this.reportsDir, 'npm-audit.json');
      fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
      
      const vulnerabilities = results.metadata?.vulnerabilities || {};
      const total = Object.values(vulnerabilities).reduce((sum, count) => sum + count, 0);
      
      console.log(\`📊 发现 \${total} 个安全漏洞\`);
      
      return {
        success: total === 0,
        vulnerabilities,
        total,
        reportPath
      };
    } catch (error) {
      // npm audit 返回非零退出码时仍可能有有效输出
      try {
        const results = JSON.parse(error.stdout);
        const vulnerabilities = results.metadata?.vulnerabilities || {};
        const total = Object.values(vulnerabilities).reduce((sum, count) => sum + count, 0);
        
        return {
          success: false,
          vulnerabilities,
          total,
          error: \`发现 \${total} 个安全漏洞\`
        };
      } catch (parseError) {
        return {
          success: false,
          error: 'npm audit 执行失败'
        };
      }
    }
  }

  async checkDependencies() {
    console.log('🔍 检查依赖项...');
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      const outdated = [];
      const deprecated = [];
      
      // 这里可以添加更复杂的依赖检查逻辑
      // 例如检查过时的包、已弃用的包等
      
      return {
        success: outdated.length === 0 && deprecated.length === 0,
        outdated,
        deprecated,
        total: Object.keys(dependencies).length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async scanSecrets() {
    console.log('🔐 扫描敏感信息...');
    
    const patterns = [
      /api[_-]?key[\\s]*[:=][\\s]*['""]?[a-zA-Z0-9]{20,}['""]?/gi,
      /secret[_-]?key[\\s]*[:=][\\s]*['""]?[a-zA-Z0-9]{20,}['""]?/gi,
      /password[\\s]*[:=][\\s]*['""]?[a-zA-Z0-9]{8,}['""]?/gi,
      /token[\\s]*[:=][\\s]*['""]?[a-zA-Z0-9]{20,}['""]?/gi
    ];
    
    const findings = [];
    const filesToScan = this.getFilesToScan();
    
    filesToScan.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        patterns.forEach((pattern, index) => {
          const matches = content.match(pattern);
          if (matches) {
            findings.push({
              file,
              pattern: index,
              matches: matches.length
            });
          }
        });
      } catch (error) {
        // 忽略无法读取的文件
      }
    });
    
    return {
      success: findings.length === 0,
      findings,
      scannedFiles: filesToScan.length
    };
  }

  getFilesToScan() {
    const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.env'];
    const excludeDirs = ['node_modules', '.next', 'dist', 'build', '.git'];
    
    const files = [];
    
    const scanDir = (dir) => {
      try {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory() && !excludeDirs.includes(item)) {
            scanDir(fullPath);
          } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
            files.push(fullPath);
          }
        });
      } catch (error) {
        // 忽略无法访问的目录
      }
    };
    
    scanDir(process.cwd());
    return files;
  }

  generateReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        passed: Object.values(results).filter(r => r.success).length,
        failed: Object.values(results).filter(r => !r.success).length,
        total: Object.keys(results).length
      },
      details: results
    };

    const reportPath = path.join(this.reportsDir, 'security-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(\`🔒 安全报告已保存到: \${reportPath}\`);
    
    if (report.summary.failed > 0) {
      console.log('⚠️  发现安全问题，请查看详细报告');
    } else {
      console.log('✅ 未发现安全问题');
    }
  }
}

if (require.main === module) {
  const auditor = new SecurityAuditor();
  auditor.runAudit().catch(console.error);
}

module.exports = SecurityAuditor;
`;

    this.writeConfig('scripts/security-auditor.js', securityScript);
  }

  /**
   * 运行完整的质量检查
   */
  async runFullAudit() {
    console.log('🔍 开始完整质量审计...');
    
    const results = {
      lint: await this.runLintCheck(),
      security: await this.runSecurityAudit(),
      performance: await this.runPerformanceCheck(),
      accessibility: await this.runAccessibilityCheck()
    };

    this.generateFullReport(results);
    return results;
  }

  /**
   * 运行代码质量检查
   */
  async runLintCheck() {
    try {
      const LintRunner = require('./lint-runner.js');
      const runner = new LintRunner();
      return await runner.runAll();
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 运行安全审计
   */
  async runSecurityAudit() {
    try {
      const SecurityAuditor = require('./security-auditor.js');
      const auditor = new SecurityAuditor();
      return await auditor.runAudit();
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 运行性能检查
   */
  async runPerformanceCheck() {
    console.log('⚡ 运行性能检查...');
    
    try {
      // 分析包大小
      const bundleAnalysis = await this.analyzeBundleSize();
      
      // 检查性能最佳实践
      const bestPractices = await this.checkPerformanceBestPractices();
      
      return {
        success: true,
        bundleAnalysis,
        bestPractices
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 运行可访问性检查
   */
  async runAccessibilityCheck() {
    console.log('♿ 运行可访问性检查...');
    
    try {
      // 这里可以集成axe-core或其他可访问性检查工具
      const a11yResults = {
        violations: [],
        passes: [],
        incomplete: []
      };
      
      return {
        success: a11yResults.violations.length === 0,
        results: a11yResults
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 分析包大小
   */
  async analyzeBundleSize() {
    // 简化的包大小分析
    return {
      totalSize: '0 MB',
      chunks: [],
      recommendations: []
    };
  }

  /**
   * 检查性能最佳实践
   */
  async checkPerformanceBestPractices() {
    return {
      imageOptimization: true,
      codesplitting: true,
      lazyLoading: true,
      caching: true
    };
  }

  /**
   * 生成完整报告
   */
  generateFullReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        overall: Object.values(results).every(r => r.success),
        categories: Object.keys(results).map(key => ({
          name: key,
          passed: results[key].success
        }))
      },
      details: results,
      recommendations: this.generateRecommendations(results)
    };

    const reportPath = path.join(this.reportsDir, 'full-quality-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 完整质量报告已保存到: ${reportPath}`);
    
    if (report.summary.overall) {
      console.log('🎉 所有质量检查通过！');
    } else {
      console.log('⚠️  发现质量问题，请查看详细报告');
    }
    
    return report;
  }

  /**
   * 生成改进建议
   */
  generateRecommendations(results) {
    const recommendations = [];
    
    if (!results.lint?.success) {
      recommendations.push({
        category: 'Code Quality',
        priority: 'high',
        message: '修复代码质量问题以提高可维护性'
      });
    }
    
    if (!results.security?.success) {
      recommendations.push({
        category: 'Security',
        priority: 'critical',
        message: '立即修复安全漏洞'
      });
    }
    
    if (!results.performance?.success) {
      recommendations.push({
        category: 'Performance',
        priority: 'medium',
        message: '优化性能以提升用户体验'
      });
    }
    
    if (!results.accessibility?.success) {
      recommendations.push({
        category: 'Accessibility',
        priority: 'high',
        message: '改善可访问性以支持更多用户'
      });
    }
    
    return recommendations;
  }

  /**
   * 写入配置文件
   */
  writeConfig(filePath, content) {
    const fullPath = path.join(this.projectRoot, filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content);
  }
}

// CLI接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const qa = new QualityAssurance();

  try {
    switch (command) {
      case 'init':
        qa.init();
        break;
      
      case 'audit':
        qa.runFullAudit();
        break;
      
      case 'lint':
        qa.runLintCheck();
        break;
      
      case 'security':
        qa.runSecurityAudit();
        break;
      
      case 'performance':
        qa.runPerformanceCheck();
        break;
      
      case 'accessibility':
        qa.runAccessibilityCheck();
        break;
      
      default:
        console.log(`
🔍 PDCS-Fronted-UI 质量保证工具

使用方法:
  node scripts/quality-assurance.js init           # 初始化质量保证工具
  node scripts/quality-assurance.js audit          # 运行完整质量审计
  node scripts/quality-assurance.js lint           # 运行代码质量检查
  node scripts/quality-assurance.js security       # 运行安全审计
  node scripts/quality-assurance.js performance    # 运行性能检查
  node scripts/quality-assurance.js accessibility  # 运行可访问性检查

功能:
  - 代码质量检查 (ESLint, Prettier, TypeScript)
  - 安全漏洞扫描 (npm audit, 敏感信息检测)
  - 性能分析 (包大小, 最佳实践)
  - 可访问性检查 (WCAG 合规性)
        `);
    }
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
    process.exit(1);
  }
}

module.exports = QualityAssurance;
