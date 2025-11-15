# 分支保护规则配置指南

本文档说明如何在 GitHub 上配置分支保护规则，以确保代码质量和发布流程的规范性。

## 📋 概述

分支保护规则强制执行特定的工作流程，确保：
- ✅ 所有代码都经过 Code Review
- ✅ 所有代码都通过 CI 测试
- ✅ Commit 消息符合规范
- ✅ 自动化发布流程正确运行

## 🔐 配置步骤

### 1. 进入仓库设置

```
GitHub 仓库 → Settings → Branches → Add branch protection rule
```

### 2. Main 分支保护规则

#### Branch name pattern
```
main
```

#### 必需配置

**✅ Require a pull request before merging**
- 勾选此项，强制所有更改通过 PR 合并
- **✅ Require approvals**: 至少 1 个批准
- **✅ Dismiss stale pull request approvals when new commits are pushed**: 新 commit 时清除旧的批准
- ☐ Require review from Code Owners: 可选，如果有 CODEOWNERS 文件

**✅ Require status checks to pass before merging**
- 勾选此项，强制 CI 检查通过才能合并
- **✅ Require branches to be up to date before merging**: 必须基于最新代码
- **Status checks that are required** (添加以下检查项):
  - `lint` - 代码风格检查
  - `build` - 构建检查
  - `test` - 测试检查
  - `commitlint` - Commit 消息检查
  - `summary` - PR 总结检查

**✅ Require conversation resolution before merging**
- 勾选此项，确保所有评论都得到解决

**☐ Require signed commits** (可选)
- 增强安全性，要求所有 commit 都签名

**☐ Require linear history** (可选)
- 保持历史清晰，禁止 merge commits

**✅ Include administrators**
- **强烈建议勾选**，管理员也必须遵循规则

**✅ Restrict who can push to matching branches**
- 勾选此项
- **不选择任何人或团队**
- 这样就只能通过 PR 合并，无法直接 push

#### 完整配置示例

```yaml
Branch name pattern: main

✅ Require a pull request before merging
   ✅ Require approvals: 1
   ✅ Dismiss stale pull request approvals when new commits are pushed
   ☐ Require review from Code Owners

✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   ✅ Status checks:
       - lint
       - build
       - test
       - commitlint
       - summary

✅ Require conversation resolution before merging

☐ Require signed commits

☐ Require linear history

✅ Include administrators

✅ Restrict who can push to matching branches
   (不选择任何人)
```

---

### 3. Beta/Alpha 分支保护规则（可选）

如果你使用 Pre-release 分支，也可以为它们设置保护规则。

#### Branch name pattern
```
beta
```

或使用通配符匹配多个分支：
```
beta/*
```

#### 推荐配置

```yaml
Branch name pattern: beta

✅ Require a pull request before merging
   ✅ Require approvals: 1

✅ Require status checks to pass before merging
   ✅ Status checks:
       - lint
       - build
       - test

☐ Include administrators (可以放宽，允许管理员直接 push)

☐ Restrict who can push (可以允许特定团队成员直接 push)
```

---

## 🚀 配置后的工作流程

### 开发新功能

```bash
# 1. 创建 feature 分支
git checkout -b feature/new-awesome-feature

# 2. 开发并提交（遵循 Conventional Commits）
git add .
git commit -m "feat: add awesome new feature"

# 3. 推送到远程
git push origin feature/new-awesome-feature

# 4. 在 GitHub 创建 PR
# 访问仓库 → "Compare & pull request" → 填写描述 → "Create pull request"

# 5. 等待 CI 检查通过
# - Lint: ✅
# - Build: ✅
# - Test: ✅
# - Commitlint: ✅

# 6. 请求 Code Review
# 团队成员审查代码并批准

# 7. 在 GitHub 网页点击 "Merge pull request"
# GitHub 自动合并到 main 并触发 Release CI

# 8. Release CI 自动运行
# - 分析 commits
# - 计算版本号
# - 更新 package.json 和 CHANGELOG.md
# - 发布到 npm
# - 创建 GitHub Release

# 9. （可选）同步本地 main 分支
git checkout main
git pull origin main
```

### 快速修复 Bug

```bash
# 1. 从 main 创建 fix 分支
git checkout main
git pull origin main
git checkout -b fix/critical-bug

# 2. 修复并提交
git add .
git commit -m "fix: resolve critical security issue"

# 3. 推送并创建 PR
git push origin fix/critical-bug
# 在 GitHub 创建 PR

# 4. 紧急情况可以请求快速 review
# 通过后立即合并并自动发布
```

### 发布 Beta 版本

```bash
# 1. 创建或切换到 beta 分支
git checkout -b beta

# 2. 合并要测试的功能
git merge feature/feature-a
git merge feature/feature-b

# 3. 推送到远程
git push origin beta

# 4. Release CI 自动发布 beta 版本
# 版本号: 1.3.0-beta.1

# 5. 测试通过后，合并到 main
git checkout main
git merge beta
git push origin main

# 6. 发布正式版本
# 版本号: 1.3.0
```

---

## 🔧 配置验证

配置完成后，尝试以下测试：

### 测试 1: 直接 Push 应该被拒绝

```bash
git checkout main
git commit -m "test: try direct push" --allow-empty
git push origin main

# 预期结果：❌ 被拒绝
# ! [remote rejected] main -> main (protected branch hook declined)
```

### 测试 2: 不规范的 Commit 应该被拒绝

```bash
# 创建 PR 包含不规范的 commit
git checkout -b test/bad-commit
git commit -m "this is a bad commit message"
git push origin test/bad-commit

# 在 GitHub 创建 PR

# 预期结果：❌ Commitlint 检查失败
# PR 无法合并
```

### 测试 3: CI 失败应该阻止合并

```bash
# 创建会导致 build 失败的 PR
git checkout -b test/broken-build
# 制造一个语法错误
git push origin test/broken-build

# 在 GitHub 创建 PR

# 预期结果：❌ Build 检查失败
# PR 无法合并
```

### 测试 4: 正常流程应该成功

```bash
# 创建规范的 PR
git checkout -b feature/test-feature
git commit -m "feat: add test feature"
git push origin feature/test-feature

# 在 GitHub 创建 PR

# 预期结果：✅ 所有检查通过
# ✅ 可以请求 review
# ✅ 批准后可以合并
# ✅ 合并后自动发布
```

---

## 📚 相关文档

- [GitHub Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Release](https://semantic-release.gitbook.io/)
- [Commitlint](https://commitlint.js.org/)

## ❓ 常见问题

### Q: 如果需要紧急修复，可以绕过保护规则吗？

A: 可以，但不推荐。如果必须：
1. 临时禁用 "Include administrators" 选项
2. 直接 push 到 main
3. 立即重新启用保护规则

更好的做法：使用 hotfix 流程，创建 PR 并请求快速 review。

### Q: 如果 CI 出现临时故障怎么办？

A: 可以在 PR 页面重新运行失败的检查：
1. 进入 PR 页面
2. 找到失败的检查
3. 点击 "Re-run jobs"

### Q: Commit 消息写错了怎么办？

A: 在本地修改 commit 消息后重新 push：
```bash
# 修改最后一个 commit
git commit --amend -m "feat: correct commit message"
git push origin feature/xxx --force

# 或者交互式修改多个 commits
git rebase -i HEAD~3
# 将要修改的 commit 标记为 'reword'
# 保存后会逐个提示修改
git push origin feature/xxx --force
```

### Q: 如何配置多个 reviewers？

A: 在分支保护规则中：
1. "Require approvals" 设置为需要的数量（如 2）
2. 可选：创建 CODEOWNERS 文件指定特定代码的审查者

---

## 🎯 最佳实践

1. **始终从最新的 main 分支创建新分支**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/xxx
   ```

2. **遵循 Conventional Commits 规范**
   - 使用正确的 type: `feat`, `fix`, `docs`, 等
   - 写清晰的 subject（5-100 字符）
   - 重大变更添加 `!` 或 `BREAKING CHANGE:`

3. **保持 PR 小而专注**
   - 一个 PR 只做一件事
   - 更容易 review
   - 更快合并

4. **及时同步远程变更**
   ```bash
   git fetch origin
   git rebase origin/main  # 或 git merge origin/main
   ```

5. **充分测试后再创建 PR**
   - 本地运行 `npm run lint`
   - 本地运行 `npm run build`
   - 本地运行 `npm test`

---

配置完成后，你的项目就拥有了完善的代码质量保障和自动化发布流程！🎉
