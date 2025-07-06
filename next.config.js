/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig = {
  // 支持PWA
  ...withPWA({
    // PWA配置
  }),
  // 图片优化配置
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || 'default-key',
  },
  // 字体优化配置
  optimizeFonts: false, // 禁用Google Fonts优化以避免网络问题
  // Webpack配置
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 添加对.sql文件的支持
    config.module.rules.push({
      test: /\.sql$/,
      use: 'raw-loader',
    });

    // 处理 sql.js 的 Node.js 模块问题
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }

    return config;
  },
};

module.exports = nextConfig;
