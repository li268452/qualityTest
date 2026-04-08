# 代码质量测试项目

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=qualityTest&metric=alert_status)](https://sonarcloud.io/dashboard?id=qualityTest)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=qualityTest&metric=code_smells)](https://sonarcloud.io/dashboard?id=qualityTest)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=qualityTest&metric=bugs)](https://sonarcloud.io/dashboard?id=qualityTest)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=qualityTest&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=qualityTest)

🤖 **GitHub 仓库**: https://github.com/li268452/qualityTest

这是一个用于测试 SonarQube 和代码质量管理系统的简单项目。

## 📋 项目概述

本项目的目的是：
1. 测试 SonarQube 本地部署
2. 测试 ngrok 内网穿透
3. 测试 GitHub Actions 集成
4. 测试代码质量门禁功能
5. 实践基于模块上下文的 AI 回归测试

**注意**：项目中的代码故意包含了一些质量问题，用于测试 SonarQube 的检测能力。

## 🛠️ 技术栈

- **代码检查**：ESLint + Prettier
- **质量扫描**：SonarQube 26.3.0 (Community Edition - 本地安装)
- **内网穿透**：ngrok
- **CI/CD**：GitHub Actions
- **测试框架**：Jest / Playwright（待集成）

## 📍 SonarQube 安装位置

本地 SonarQube 路径：
```
D:\代码质量测试功能\sonarqube-26.3.0.120487
```

版本：SonarQube 26.3.0.120487
默认端口：9000

## 📦 安装依赖

```bash
npm install
```

## 🚀 快速开始

### 步骤 1：安装 SonarQube Scanner（本地扫描用）

```bash
npm install -g sonar-scanner
```

### 步骤 2：启动 SonarQube

双击运行：
```
scripts\start-sonarqube.bat
```

等待 1-2 分钟后，访问：http://localhost:9000

**默认登录**：
- 账号：`admin`
- 密码：`admin`

### 步骤 3：在 SonarQube 中创建项目

1. 登录后，点击 **"Create Project"**
2. 选择 **"Manually"**
3. 输入项目 Key: `qualityTest`
4. 输入项目名称: `Code Quality Test Project`
5. 点击 **"Set Up"**

### 步骤 4：生成 Token

1. 进入 **My Account** → **Security**
2. 输入 Token 名称：`github-quality-test`
3. 点击 **Generate**
4. **复制并保存 Token**（只显示一次）

### 步骤 5：运行本地扫描

```bash
# 设置环境变量
export SONAR_TOKEN="你的Token"
export SONAR_HOST_URL="http://localhost:9000"

# 运行扫描
npm run lint
sonar-scanner
```

## 🌐 GitHub 集成配置

### 快速配置

👉 **详细配置指南**: [GitHub 集成配置指南](docs/GITHUB_SETUP.md)

### 简要步骤

#### 1. 配置 GitHub Secrets

进入 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions**

添加以下 Secrets：

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `SONAR_TOKEN` | 从 SonarQube 生成的 Token | 认证令牌 |
| `SONAR_HOST_URL` | `http://localhost:9000` 或 ngrok 地址 | SonarQube 服务器地址 |

#### 2. 触发 GitHub Actions

推送代码到 GitHub 会自动触发工作流：

```bash
git add .
git commit -m "test: 测试 GitHub Actions 集成"
git push origin main
```

#### 3. 查看运行结果

- **GitHub Actions**: https://github.com/li268452/qualityTest/actions
- **SonarQube 报告**: http://localhost:9000/dashboard?id=qualityTest

### GitHub Actions 工作流

```
代码推送 → ESLint 检查 → SonarQube 扫描 → 质量门禁检查 → 允许/阻止合并
```

**检查内容**：

| 阶段 | 检查项 | 耗时 | 失败后果 |
|------|-------|------|---------|
| **ESLint** | 代码规范 | < 10秒 | 阻止提交 |
| **SonarQube** | 代码质量 | 1-3分钟 | 阻止合并 |
| **质量门禁** | 综合评估 | 自动 | PR 合并被禁用 |

## 📊 测试代码说明

### 代码质量问题列表

项目中的测试代码包含以下质量问题：

| 文件 | 问题类型 | 严重程度 | 说明 |
|------|---------|---------|------|
| `src/index.js` | 未使用变量 | Minor | `unusedVariable` |
| `src/index.js` | 使用 var | Minor | 应使用 let/const |
| `src/index.js` | console.log | Minor | 生产环境不应有 |
| `src/index.js` | 使用 == | Major | 应使用 === |
| `src/index.js` | 函数复杂度高 | Major | `complexFunction` 嵌套过深 |
| `src/index.js` | 重复代码 | Major | `calculateArea1/2` |
| `src/index.js` | 魔法数字 | Minor | `calculateDiscount` |
| `src/index.js` | 空指针风险 | Critical | `getUserInfo` 未检查 null |
| `src/index.js` | 函数过长 | Major | `processUserData` |
| `src/index.js` | eval 使用 | Critical | 安全风险 |

## 🔧 本地开发

### 运行 ESLint

```bash
npm run lint
```

### 自动修复 ESLint 问题

```bash
npm run lint:fix
```

### 格式化代码

```bash
npm run format
```

## 📋 SonarQube 质量门禁

默认质量门禁标准（可在 SonarQube Web UI 中修改）：

| 指标 | 要求 |
|------|------|
| Bug 数 | = 0（新代码） |
| 安全漏洞 | = 0（新代码） |
| 代码覆盖率 | ≥ 60%（可选） |
| 代码异味 | ≤ 50 |
| 代码重复率 | ≤ 3% |

## 🛠️ 常用命令

```bash
# 安装依赖
npm install

# ESLint 检查
npm run lint

# ESLint 自动修复
npm run lint:fix

# 格式化代码
npm run format

# 本地 SonarQube 扫描（需要先设置环境变量）
sonar-scanner

# 启动 SonarQube（本地安装版）
scripts\start-sonarqube.bat

# 停止 SonarQube
scripts\stop-sonarqube.bat

# 查看 SonarQube 日志
type D:\代码质量测试功能\sonarqube-26.3.0.120487\logs\sonar.log
```

## 📁 项目结构

```
qualityTest/
├── .github/
│   └── workflows/
│       └── code-quality.yml      # GitHub Actions 工作流
├── .module-contexts/              # 模块上下文（待创建）
├── docs/
│   └── GITHUB_SETUP.md           # GitHub 配置指南
├── scripts/                       # 工具脚本
├── src/                           # 源代码
├── sonar-project.properties       # SonarQube 配置
├── .eslintrc.js                   # ESLint 配置
├── .prettierrc                    # Prettier 配置
├── package.json
└── README.md
```

## 📝 注意事项

### ngrok 免费版限制

- 每次重启，公网地址会变化
- 需要更新 GitHub Secrets 中的 `SONAR_HOST_URL`
- 免费版有流量限制

### 解决方案

如果需要稳定的公网地址，可以考虑：
1. 使用 ngrok 付费版（固定域名）
2. 购买云服务器部署 SonarQube
3. 使用 SonarQube Cloud（云端服务）

## 📖 参考资料

- [SonarQube 官方文档](https://docs.sonarqube.org/)
- [ngrok 官网](https://ngrok.com/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [ESLint 文档](https://eslint.org/)
- [代码质量管理系统方案](../../代码质量管理系统方案-SonarQube+AI.md)

## 🐛 常见问题

### Q1: SonarQube 启动失败？

**A**: 检查端口 9000 是否被占用，以及 Java 是否安装：

```bash
# 检查 Java 版本（需要 Java 17+）
java -version

# 检查端口占用
netstat -ano | findstr :9000

# 查看 SonarQube 日志
type D:\代码质量测试功能\sonarqube-26.3.0.120487\logs\sonar.log
```

### Q2: GitHub Actions 失败？

**A**: 检查以下项：
1. GitHub Secrets 是否正确配置
2. ngrok 是否正在运行
3. SONAR_HOST_URL 是否正确（包含 https://）

详细解决方案请参考：[GitHub 集成配置指南](docs/GITHUB_SETUP.md)

### Q3: 质量门禁失败？

**A**: 查看 SonarQube 报告，修复相关问题：

```
http://localhost:9000/dashboard?id=qualityTest
```

## 🔗 相关链接

- **GitHub 仓库**: https://github.com/li268452/qualityTest
- **GitHub Actions**: https://github.com/li268452/qualityTest/actions
- **问题反馈**: https://github.com/li268452/qualityTest/issues

---

**项目创建日期**: 2026-04-07
**SonarQube 版本**: 26.3.0.120487 (Community)
**测试目的**: 代码质量管理系统功能验证
