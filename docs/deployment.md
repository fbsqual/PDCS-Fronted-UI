# 部署指南

本文档详细介绍了如何将 PDCS Frontend 项目部署到不同的平台。

## 🚀 快速部署

### 环境要求

- Node.js 18.0 或更高版本
- npm, yarn 或 pnpm 包管理器
- Git（用于版本控制）

### 构建项目

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build

# 本地预览构建结果
npm run start
```

## 🌐 部署平台

### 1. Vercel 部署（推荐）

Vercel 是 Next.js 的官方部署平台，提供最佳的性能和开发体验。

#### 自动部署

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 访问 [vercel.com](https://vercel.com)
3. 导入你的仓库
4. Vercel 会自动检测 Next.js 项目并部署

#### 手动部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel

# 部署到生产环境
vercel --prod
```

#### 环境变量配置

在 Vercel 控制台中设置以下环境变量：

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api.com
NEXT_PUBLIC_DEBUG_MODE=false
```

### 2. Netlify 部署

Netlify 提供简单的静态站点部署服务。

#### 构建设置

- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Node version**: 18

#### netlify.toml 配置

```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. AWS Amplify 部署

AWS Amplify 提供全栈应用部署服务。

#### 部署步骤

1. 登录 AWS Amplify 控制台
2. 选择 "Host web app"
3. 连接你的 Git 仓库
4. 配置构建设置：

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### 4. 自托管部署

#### 使用 PM2

```bash
# 安装 PM2
npm install -g pm2

# 构建项目
npm run build

# 使用 PM2 启动应用
pm2 start npm --name "pdcs-frontend" -- start

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

#### 使用 Docker

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
```

构建和运行：

```bash
# 构建镜像
docker build -t pdcs-frontend .

# 运行容器
docker run -p 3000:3000 pdcs-frontend
```

#### 使用 Nginx

Nginx 配置示例：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态文件缓存
    location /_next/static {
        alias /path/to/your/app/.next/static;
        expires 1y;
        access_log off;
    }

    # PWA 文件
    location /manifest.json {
        alias /path/to/your/app/public/manifest.json;
        expires 1d;
    }

    location /sw.js {
        alias /path/to/your/app/public/sw.js;
        expires 1d;
    }
}
```

## 🔧 环境变量

### 必需的环境变量

```env
# API 基础 URL
NEXT_PUBLIC_API_BASE_URL=https://api.example.com

# 应用环境
NODE_ENV=production
```

### 可选的环境变量

```env
# 调试模式（生产环境建议设为 false）
NEXT_PUBLIC_DEBUG_MODE=false

# API 版本
NEXT_PUBLIC_API_VERSION=v1

# 分析工具
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# 错误追踪
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

## 📊 性能优化

### 1. 构建优化

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用 SWC 压缩
  swcMinify: true,
  
  // 图片优化
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 实验性功能
  experimental: {
    // 应用目录
    appDir: true,
    // 服务器组件
    serverComponents: true,
  },
  
  // 压缩
  compress: true,
  
  // PWA 配置
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  }
}

module.exports = nextConfig
```

### 2. CDN 配置

```javascript
// next.config.js
const nextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.example.com' 
    : '',
}
```

### 3. 缓存策略

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ]
  },
}
```

## 🔒 安全配置

### 1. 安全头部

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ]
  },
}
```

### 2. 环境变量安全

- 不要在客户端代码中暴露敏感信息
- 使用 `NEXT_PUBLIC_` 前缀的变量会暴露给客户端
- 服务器端变量不会暴露给客户端

## 📈 监控和分析

### 1. 性能监控

```javascript
// 添加到 _app.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

export function reportWebVitals(metric) {
  // 发送到分析服务
  console.log(metric)
}
```

### 2. 错误追踪

```bash
# 安装 Sentry
npm install @sentry/nextjs

# 配置 Sentry
npx @sentry/wizard -i nextjs
```

## 🚨 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本
   - 清除缓存：`npm run clean` 或 `rm -rf .next`
   - 重新安装依赖：`rm -rf node_modules && npm install`

2. **运行时错误**
   - 检查环境变量配置
   - 查看浏览器控制台错误
   - 检查网络请求状态

3. **性能问题**
   - 启用 Next.js 分析：`npm run build -- --analyze`
   - 检查包大小和依赖
   - 优化图片和静态资源

### 调试工具

```bash
# 启用调试模式
DEBUG=* npm run dev

# 分析包大小
npm run build -- --analyze

# 性能分析
npm run dev -- --profile
```

## 📝 部署检查清单

- [ ] 环境变量配置正确
- [ ] 构建成功无错误
- [ ] 静态资源正常加载
- [ ] API 接口连接正常
- [ ] PWA 功能正常
- [ ] 响应式设计测试
- [ ] 性能指标达标
- [ ] 安全头部配置
- [ ] 错误监控设置
- [ ] 备份和回滚计划

## 🔄 持续集成/持续部署 (CI/CD)

### GitHub Actions 示例

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
      env:
        NEXT_PUBLIC_API_BASE_URL: ${{ secrets.API_BASE_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

通过以上配置，你可以将 PDCS Frontend 项目成功部署到各种平台，并确保最佳的性能和安全性。
