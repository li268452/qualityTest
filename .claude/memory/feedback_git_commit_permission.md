---
name: git_commit_permission
description: Git 提交需要用户明确同意
type: feedback
---

## 规则

**Git 提交操作（commit/push）必须先获得用户明确同意，不可自动执行。**

**Why:** 用户明确要求 "提交需要我同意"，自动提交可能导致未经审查的代码进入仓库。

**How to apply:**

- 每次执行 `git commit` 或 `git push` 前，必须先使用 AskUserQuestion 询问用户是否同意提交
- 即使用户说"提交吧"，下次仍需再次询问（这不是一次性授权）
- 只有拉取代码（git pull/pull --rebase）不需要询问，因为这是同步操作
