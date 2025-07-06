#!/bin/bash

# PDCS-UI GitHub 部署脚本
# 使用方法: ./deploy-to-github.sh <github-username> <repository-name>

GITHUB_USERNAME=$1
REPO_NAME=$2

if [ -z "$GITHUB_USERNAME" ] || [ -z "$REPO_NAME" ]; then
    echo "❌ 请提供GitHub用户名和仓库名"
    echo "使用方法: ./deploy-to-github.sh <github-username> <repository-name>"
    echo "示例: ./deploy-to-github.sh myusername pdcs-ui"
    exit 1
fi

echo "🚀 开始部署到GitHub..."
echo "📦 仓库: https://github.com/$GITHUB_USERNAME/$REPO_NAME"

# 检查是否已经初始化Git
if [ ! -d ".git" ]; then
    echo "❌ 未找到Git仓库，请先运行 git init"
    exit 1
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  发现未提交的更改，正在提交..."
    git add .
    git commit -m "chore: prepare for GitHub deployment"
fi

# 添加远程仓库
echo "🔗 添加远程仓库..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# 重命名主分支为main（如果当前是master）
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "master" ]; then
    echo "🔄 重命名主分支为main..."
    git branch -m master main
fi

# 推送到GitHub
echo "📤 推送代码到GitHub..."
git push -u origin main

# 推送develop分支
if git show-ref --verify --quiet refs/heads/develop; then
    echo "📤 推送develop分支..."
    git push -u origin develop
fi

echo ""
echo "✅ 部署完成！"
echo ""
echo "🌐 GitHub仓库: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "📚 项目文档: https://github.com/$GITHUB_USERNAME/$REPO_NAME#readme"
echo ""
echo "🚀 下一步:"
echo "1. 在GitHub上配置仓库设置"
echo "2. 启用GitHub Pages（如果需要）"
echo "3. 配置Vercel部署（推荐）"
echo "4. 设置GitHub Actions secrets（用于CI/CD）"
echo ""
echo "📋 推荐的GitHub仓库设置:"
echo "- 启用Issues和Discussions"
echo "- 设置分支保护规则（main分支）"
echo "- 配置自动合并规则"
echo "- 添加仓库描述和标签"
