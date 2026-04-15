# AI Flow Testing Skill - 安装和发布指南

## 目录

- [Skill 结构](#skill-结构)
- [本地使用](#本地使用)
- [发布到 Skills 市场](#发布到-skills-市场)
- [版本管理](#版本管理)

## Skill 结构

```
.claude/skills/ai-flow-testing/
├── skill.md              # Skill 定义文件（必需）
├── README.md             # 使用说明
├── INSTALL.md            # 安装和发布指南（本文件）
├── scripts/              # 核心脚本
│   ├── ai-test.js        # 主测试脚本
│   ├── analyze-module.js # 模块分析器
│   └── scenario-parser.js # 场景解析器
└── template/             # 文档模板
    └── TEMPLATE.md       # 模块文档模板
```

## 本地使用

### 方法1：直接复制到项目中

1. 将整个 `.claude/skills/ai-flow-testing/` 目录复制到你的项目中
2. 确保项目结构符合要求：
   ```
   your-project/
   ├── .claude/
   │   └── skills/
   │       └── ai-flow-testing/
   ├── docs/
   │   └── modules/
   └── src/
       └── modules/
   ```
3. 运行测试：
   ```bash
   node .claude/skills/ai-flow-testing/scripts/ai-test.js --module=your-module
   ```

### 方法2：创建全局脚本（可选）

创建一个全局可执行脚本：

1. 创建 `ai-test` 命令：

   ```bash
   # Windows (PowerShell)
   echo 'node $env:USERPROFILE\.claude\skills\ai-flow-testing\scripts\ai-test.js $args' > $env:USERPROFILE\ai-test.ps1

   # macOS/Linux
   echo '#!/bin/bash' > /usr/local/bin/ai-test
   echo 'node ~/.claude/skills/ai-flow-testing/scripts/ai-test.js "$@"' >> /usr/local/bin/ai-test
   chmod +x /usr/local/bin/ai-test
   ```

2. 使用命令：
   ```bash
   ai-test --module=your-module
   ```

## 发布到 Skills 市场

### 准备工作

1. **确保 Skill 已经完善**
   - ✅ skill.md 包含完整的描述和用法
   - ✅ README.md 包含详细的使用说明
   - ✅ 脚本经过充分测试
   - ✅ 模板文件完整

2. **版本管理**
   - 在 skill.md 中添加版本号
   - 记录更新日志

### 发布步骤

#### 步骤1：创建 GitHub 仓库

1. 在 GitHub 上创建新仓库：`ai-flow-testing-skill`
2. 将 Skill 内容推送到仓库：
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI Flow Testing Skill v1.0.0"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ai-flow-testing-skill.git
   git push -u origin main
   ```

#### 步骤2：创建 Release

1. 在 GitHub 上创建 Release：
   - Tag: `v1.0.0`
   - Title: `AI Flow Testing Skill v1.0.0`
   - Description: 包含功能介绍和使用说明

#### 步骤3：提交到 Claude Skills 市场

1. 访问 Claude Code Skills 市场
2. 点击 "Submit Skill"
3. 填写信息：
   - **Name**: AI Flow Testing
   - **Description**: 自动化流程驱动测试工具，通过解析自然语言场景描述自动生成和执行测试用例
   - **Repository**: https://github.com/YOUR_USERNAME/ai-flow-testing-skill
   - **Tags**: testing, automation, vue, mock-api
   - **Category**: Development Tools

4. 提供使用示例：

   ```bash
   # 测试单个模块
   node .claude/skills/ai-flow-testing/scripts/ai-test.js --module=user-management

   # 测试所有模块
   node .claude/skills/ai-flow-testing/scripts/ai-test.js --all
   ```

## 版本管理

### 版本号规范

使用语义化版本：`MAJOR.MINOR.PATCH`

- **MAJOR**: 重大功能变更或破坏性更新
- **MINOR**: 新增功能，向后兼容
- **PATCH**: Bug 修复，向后兼容

### 更新日志格式

```markdown
## [1.0.0] - 2026-04-15

### Added

- 支持场景描述解析
- 支持真实执行测试
- 支持智能字段映射
- 支持跨模块测试

### Fixed

- 修复参数提取问题
- 修复路径解析问题

### Changed

- 改进错误提示信息
```

### 发布流程

1. 更新版本号和更新日志
2. 创建 Git Tag
3. 推送到 GitHub
4. 创建 GitHub Release
5. 更新 Skills 市场

## 维护和支持

### 问题反馈

- GitHub Issues: https://github.com/YOUR_USERNAME/ai-flow-testing-skill/issues

### 贡献指南

欢迎提交 Pull Request！

1. Fork 项目
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 许可证

MIT License - 详见 LICENSE 文件

## 联系方式

- 作者：Your Name
- 邮箱：your.email@example.com
- GitHub：https://github.com/YOUR_USERNAME

---

**注意**: 发布前请确保：

1. 所有功能都已充分测试
2. 文档完整且准确
3. 代码符合项目规范
4. 已添加适当的许可证
