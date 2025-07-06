# 🤝 贡献指南

感谢您对 PDCS Frontend Framework 的关注！我们欢迎所有形式的贡献。

## 📋 贡献方式

### 🐛 报告Bug
- 使用 [GitHub Issues](https://github.com/your-username/pdcs-frontend/issues) 报告bug
- 请提供详细的复现步骤和环境信息
- 如果可能，请提供最小复现示例

### 💡 功能建议
- 通过 [GitHub Issues](https://github.com/your-username/pdcs-frontend/issues) 提交功能建议
- 详细描述功能需求和使用场景
- 说明该功能如何改善用户体验

### 🔧 代码贡献

#### 开发环境设置
```bash
# 1. Fork 并克隆仓库
git clone https://github.com/your-username/pdcs-frontend.git
cd pdcs-frontend

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 运行测试
npm run test
```

#### 开发流程
1. **创建分支**: 从 `develop` 分支创建功能分支
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **开发代码**: 
   - 遵循现有的代码风格
   - 添加必要的测试
   - 更新相关文档

3. **提交代码**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **推送分支**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **创建Pull Request**:
   - 提供清晰的PR描述
   - 关联相关的Issue
   - 确保所有检查通过

## 📝 代码规范

### 提交信息格式
使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

类型包括：
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 代码风格
- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 配置
- 组件使用 PascalCase 命名
- 文件使用 kebab-case 命名
- 添加适当的 JSDoc 注释

### 测试要求
- 新功能必须包含单元测试
- 测试覆盖率不低于 80%
- 使用 Jest 和 React Testing Library

## 🏗️ 项目结构

```
src/
├── components/          # 可复用组件
│   ├── ui/             # 基础UI组件
│   ├── charts/         # 图表组件
│   └── ...
├── lib/                # 工具函数
├── hooks/              # 自定义Hooks
├── styles/             # 样式文件
└── app/                # Next.js App Router页面
```

## 🔍 代码审查

所有的Pull Request都需要经过代码审查：

1. **自动检查**: CI/CD流水线会自动运行测试和代码检查
2. **人工审查**: 维护者会审查代码质量和设计
3. **反馈处理**: 根据审查意见修改代码
4. **合并**: 审查通过后合并到目标分支

## 📚 文档贡献

- 更新 README.md 中的功能说明
- 在 `docs/` 目录下添加详细文档
- 更新组件的 JSDoc 注释
- 提供使用示例和最佳实践

## 🎯 发布流程

1. **版本规划**: 在 GitHub Issues 中讨论版本计划
2. **功能开发**: 在 `develop` 分支进行开发
3. **发布准备**: 创建 `release/vx.x.x` 分支
4. **测试验证**: 全面测试新版本功能
5. **正式发布**: 合并到 `main` 分支并打标签

## 🤔 需要帮助？

如果您在贡献过程中遇到任何问题：

- 查看 [文档](./docs/)
- 搜索 [已有Issues](https://github.com/your-username/pdcs-frontend/issues)
- 创建新的 [Discussion](https://github.com/your-username/pdcs-frontend/discussions)
- 联系维护者

## 📄 许可证

通过贡献代码，您同意您的贡献将在 [MIT License](./LICENSE) 下发布。

---

再次感谢您的贡献！🎉
