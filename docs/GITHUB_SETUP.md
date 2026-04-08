# GitHub 集成配置指南

本文档说明如何将项目与 GitHub 和 SonarQube 进行集成配置。

---

## 📋 前置条件

- ✅ 项目已推送到 GitHub：https://github.com/li268452/qualityTest
- ✅ 已安装本地 SonarQube 或有云端 SonarQube 访问权限
- ✅ 已安装 ngrok（如使用本地 SonarQube）

---

## 🔧 步骤 1：配置 GitHub Secrets

### 1.1 获取 SonarQube Token

1. 登录 SonarQube（本地或云端）
2. 点击右上角头像 → **My Account**
3. 选择 **Security** 标签
4. 输入 Token 名称：`github-quality-test`
5. 点击 **Generate**
6. **复制并保存 Token**（只显示一次！）

### 1.2 在 GitHub 中配置 Secrets

1. 打开 GitHub 仓库：https://github.com/li268452/qualityTest
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下两个 Secrets：

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `SONAR_TOKEN` | 上一步生成的 Token | SonarQube 认证令牌 |
| `SONAR_HOST_URL` | SonarQube 服务器地址 | 见下方说明 |

#### SONAR_HOST_URL 配置

根据你的 SonarQube 部署方式填写：

| 部署方式 | SONAR_HOST_URL 值 |
|---------|------------------|
| 本地 SonarQube | `http://localhost:9000` |
| 使用 ngrok 穿透 | `https://xxx.ngrok.io`（每次启动 ngrok 后需更新） |
| SonarQube Cloud | `https://sonarcloud.io` |
| 自建服务器 | `http://your-server-ip:9000` |

---

## 🚀 步骤 2：启动 SonarQube

### 选项 A：使用本地 SonarQube

```bash
# Windows
cd D:\代码质量测试功能\sonarqube-26.3.0.120487\bin
# 找到对应系统的启动脚本并运行

# 或使用项目脚本
cd D:\代码质量测试功能\质量测试项目
scripts\start-sonarqube.bat
```

等待 1-2 分钟，访问 http://localhost:9000

### 选项 B：使用 SonarQube Cloud

1. 访问 https://sonarcloud.io
2. 使用 GitHub 账号登录
3. 创建新项目并选择 GitHub 仓库

---

## 🌐 步骤 3：配置内网穿透（可选）

如果使用本地 SonarQube，需要通过 ngrok 暴露到公网：

### 3.1 启动 ngrok

```bash
# 安装 ngrok 后
ngrok http 9000
```

### 3.2 获取公网地址

ngrok 会显示类似以下信息：

```
Forwarding  https://abc123.ngrok.io  ->  http://localhost:9000
```

复制 `https://abc123.ngrok.io` 这个地址。

### 3.3 更新 GitHub Secret

1. 回到 GitHub → Settings → Secrets → Actions
2. 编辑 `SONAR_HOST_URL`
3. 更新为新的 ngrok 地址
4. 保存

⚠️ **注意**：ngrok 免费版每次重启都会改变地址，需要重新更新。

---

## ✅ 步骤 4：在 SonarQube 中创建项目

1. 登录 SonarQube
2. 点击 **Create Project**
3. 选择 **Manually**
4. 输入项目信息：
   - **Project key**: `qualityTest`
   - **Display name**: `Code Quality Test Project`
5. 点击 **Set Up**

---

## 🧪 步骤 5：测试配置

### 5.1 触发 GitHub Actions

推送代码到 GitHub 会自动触发工作流：

```bash
git add .
git commit -m "test: 测试 GitHub Actions 集成"
git push origin main
```

### 5.2 查看运行结果

1. 打开 GitHub 仓库
2. 点击 **Actions** 标签
3. 查看最新的工作流运行状态

### 5.3 查看 SonarQube 报告

如果配置成功，访问 SonarQube 查看分析报告：

```
http://localhost:9000/dashboard?id=qualityTest
```

---

## 🚦 步骤 6：配置分支保护（推荐）

为了确保代码质量，建议配置分支保护规则：

### 6.1 进入分支保护设置

1. GitHub 仓库 → **Settings**
2. **Branches** → **Add rule**

### 6.2 配置保护规则

**规则名称**：`main` 分支保护

**配置项**：

| 配置项 | 值 | 说明 |
|-------|-----|------|
| Branch name pattern | `main` | 保护主分支 |
| ✅ Require a pull request | 勾选 | 必须通过 PR 合并 |
| ✅ Require approvals | 1 人 | 至少 1 人审批 |
| ✅ Require status checks to pass | 勾选 | 要求检查通过 |
| Required status checks | `eslint-check`, `sonarqube-scan`, `quality-gate` | 必须通过的检查 |
| ✅ Require branches to be up to date | 勾选 | PR 必须是最新的 |

### 6.3 效果

配置后，只有当所有质量检查通过时，PR 才能合并到 main 分支。

---

## 📊 查看质量报告

### GitHub Actions Summary

每次运行后，在 GitHub Actions 页面可以看到详细的检查摘要：

```markdown
### 🔍 ESLint 代码检查结果

| 检查项 | 结果 |
|:------|:----:|
| 代码规范 | ✅ 通过 |

### 📊 SonarQube 质量扫描

| 项目 | qualityTest |
|:-----|:--------------------------|
| 分支 | `main` |
| 提交 | `abc123...` |
| 状态 | ✅ 通过 |

🔗 查看详细报告: http://localhost:9000/dashboard?id=qualityTest

### 🚦 质量门禁检查

#### ✅ 质量门禁通过
代码质量检查全部通过，可以合并

> 🎉 所有检查通过！
```

### SonarQube Dashboard

访问 SonarQube 可以查看详细的质量分析：

- **Bug 数量**
- **安全漏洞**
- **代码异味**
- **代码覆盖率**
- **代码重复率**

---

## 🛠️ 故障排除

### 问题 1：GitHub Actions 失败 - SONAR_TOKEN 错误

**错误信息**：`Unable to execute SonarQube scan: Invalid SONAR_TOKEN`

**解决方案**：
1. 检查 GitHub Secret 中的 SONAR_TOKEN 是否正确
2. 在 SonarQube 中重新生成 Token
3. 更新 GitHub Secret

### 问题 2：GitHub Actions 失败 - 无法连接 SonarQube

**错误信息**：`Failed to connect to SONAR_HOST_URL`

**解决方案**：
1. 检查 SonarQube 是否正在运行
2. 检查 SONAR_HOST_URL 是否正确
3. 如果使用 ngrok，确认 ngrok 正在运行且地址已更新

### 问题 3：质量门禁总是失败

**解决方案**：
1. 查看 SonarQube 报告，找出具体问题
2. 修复代码质量问题
3. 重新提交触发扫描

### 问题 4：ngrok 地址每次都变化

**解决方案**：
1. 使用 ngrok 付费版（固定域名）
2. 购买云服务器部署 SonarQube
3. 使用 SonarQube Cloud 服务

---

## 📖 相关文档

- [项目 README](../README.md)
- [代码质量管理系统方案](../../代码质量管理系统方案-SonarQube+AI.md)
- [SonarQube 官方文档](https://docs.sonarqube.org/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

---

**配置完成后，每次推送代码都会自动进行质量检查！** ✨
