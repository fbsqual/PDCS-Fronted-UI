# 🚀 PDCS Frontend 部署指南

本指南将帮助您将PDCS Frontend项目部署到GitHub并设置自动化部署。

## 📋 部署前准备

### 1. 环境检查
确保您已安装以下工具：
- Git (版本 2.0+)
- Node.js (版本 18+)
- npm 或 yarn

### 2. 项目准备
```bash
# 确保项目可以正常构建
npm run build

# 运行测试确保代码质量
npm run test

# 检查代码风格
npm run lint
```

## 🐙 GitHub 部署

### 方法一：使用自动化脚本（推荐）

1. **在GitHub上创建新仓库**
   - 访问 [GitHub](https://github.com/new)
   - 创建名为 `pdcs-frontend` 的新仓库
   - **不要**初始化README、.gitignore或LICENSE（我们已经有了）

2. **运行部署脚本**
   ```bash
   # 给脚本执行权限（Linux/Mac）
   chmod +x scripts/deploy-to-github.sh
   
   # 执行部署（替换为您的GitHub用户名）
   ./scripts/deploy-to-github.sh your-username pdcs-frontend
   ```

3. **Windows用户手动部署**
   ```bash
   # 添加远程仓库
   git remote add origin https://github.com/your-username/pdcs-frontend.git
   
   # 重命名主分支
   git branch -m master main
   
   # 推送代码
   git push -u origin main
   git push -u origin develop
   ```

### 方法二：手动部署

```bash
# 1. 添加远程仓库
git remote add origin https://github.com/your-username/pdcs-frontend.git

# 2. 推送主分支
git push -u origin main

# 3. 推送开发分支
git push -u origin develop
```

## 🌐 Vercel 部署（推荐）

### 1. 自动部署设置

1. **连接GitHub**
   - 访问 [Vercel](https://vercel.com)
   - 使用GitHub账号登录
   - 点击 "New Project"
   - 选择您的 `pdcs-frontend` 仓库

2. **配置项目**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **环境变量设置**
   ```
   NEXT_PUBLIC_APP_NAME=PDCS Frontend Framework
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成
   - 获取部署URL

### 2. 自定义域名（可选）

1. 在Vercel项目设置中添加自定义域名
2. 配置DNS记录指向Vercel
3. 启用HTTPS（自动）

## 🔄 CI/CD 设置

### GitHub Actions 配置

项目已包含 `.github/workflows/ci.yml` 配置文件，支持：

- ✅ 自动化测试
- ✅ 代码质量检查
- ✅ 类型检查
- ✅ 构建验证
- ✅ 自动部署到Vercel

### 配置Secrets

在GitHub仓库设置中添加以下Secrets：

```
VERCEL_TOKEN=your-vercel-token
ORG_ID=your-vercel-org-id
PROJECT_ID=your-vercel-project-id
```

获取这些值：
1. 访问 [Vercel Tokens](https://vercel.com/account/tokens)
2. 创建新token
3. 在项目设置中找到Org ID和Project ID

## 📱 其他部署选项

### 1. Netlify 部署

```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 构建项目
npm run build

# 部署
netlify deploy --prod --dir=.next
```

### 2. Docker 部署

```dockerfile
# Dockerfile 已包含在项目中
docker build -t pdcs-frontend .
docker run -p 3000:3000 pdcs-frontend
```

### 3. 静态导出

```bash
# 修改 next.config.js 添加
output: 'export'

# 构建静态文件
npm run build

# 部署 out/ 目录到任何静态托管服务
```

## 🔧 部署后配置

### 1. 仓库设置

在GitHub仓库中配置：

- **分支保护规则**
  ```
  Branch: main
  ✅ Require pull request reviews
  ✅ Require status checks to pass
  ✅ Require branches to be up to date
  ```

- **自动合并设置**
  ```
  ✅ Allow merge commits
  ✅ Allow squash merging
  ✅ Allow rebase merging
  ```

### 2. 监控和分析

- **Vercel Analytics**: 自动启用
- **GitHub Insights**: 查看仓库统计
- **Lighthouse CI**: 性能监控

### 3. 安全设置

- 启用 Dependabot 安全更新
- 配置 Code scanning alerts
- 设置 Secret scanning

## 🚨 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清理缓存
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Git推送失败**
   ```bash
   # 检查远程仓库
   git remote -v
   
   # 重新设置远程仓库
   git remote set-url origin https://github.com/username/repo.git
   ```

3. **Vercel部署失败**
   - 检查环境变量设置
   - 确认构建命令正确
   - 查看构建日志

### 获取帮助

- 📚 查看 [项目文档](./docs/)
- 🐛 提交 [GitHub Issues](https://github.com/your-username/pdcs-frontend/issues)
- 💬 参与 [GitHub Discussions](https://github.com/your-username/pdcs-frontend/discussions)

## 🎉 部署完成

恭喜！您的PDCS Frontend项目现在已经：

- ✅ 托管在GitHub上
- ✅ 自动部署到Vercel
- ✅ 配置了CI/CD流水线
- ✅ 支持团队协作开发

**下一步**：开始使用这个框架开发您的项目！

---

📝 **更新此文档**: 如果您发现任何问题或有改进建议，请提交PR更新此部署指南。
