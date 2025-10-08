# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Model Context Protocol (MCP) 的 TapTap 小游戏排行榜 API 文档服务器（Node.js 版本）。该项目专门提供 TapTap 小游戏排行榜 API 的完整文档、代码示例和最佳实践，基于官方 API 文档：https://developer.taptap.cn/minigameapidoc/dev/api/open-api/leaderboard/。项目使用 TypeScript 开发，零依赖配置，即开即用。

## 架构概览

项目采用分层架构设计：

### 核心服务器层
- **`src/server.ts`** - 主 MCP 服务器，使用标准 MCP 协议（stdio 模式）
- **`bin/taptap-docs-mcp`** - NPM 可执行入口点

### 文档工具层
- **`src/tools/`** - 文档工具集
  - `leaderboardTools.ts` - 排行榜 API 文档工具

### 数据层
- **`src/data/`** - 静态文档数据（TypeScript）
  - `leaderboardDocs.ts` - 排行榜 API 完整文档、示例代码和最佳实践

## 常用命令

### 开发环境设置
```bash
# 确保安装了 Node.js 16+
node --version
npm --version

# 安装项目依赖
npm install

# 安装开发依赖（如果需要）
npm install --include=dev

# 或者全局安装使用
npm install -g @taptap/minigame-docs-mcp
```

### 启动服务器
```bash
# 使用启动脚本（推荐）
./start-node-mcp.sh

# 开发模式启动
npm run dev

# 编译并启动
npm run build
npm start

# 通过 npx 直接运行（无需安装）
npx @taptap/minigame-docs-mcp
```

### 环境配置

#### 基本配置（文档模式）
```bash
# 无需任何配置，直接启动即可使用
# 所有功能都基于静态文档数据，无需外部 API
```

#### 进阶配置（API 模式）
```bash
# 启用 API 模式，需要设置用户 token
export TAPTAP_USER_TOKEN="user_access_token_here"

# 可选：设置项目路径
export TAPTAP_PROJECT_PATH="/path/to/your/project"

# 启动服务器
npm start
```

#### OpenHands 集成配置示例
```json
{
  "mcpServers": {
    "taptap-docs": {
      "command": "npx",
      "args": ["@taptap/minigame-docs-mcp"],
      "env": {
        "TAPTAP_USER_TOKEN": "${CURRENT_USER_TAPTAP_TOKEN}",
        "TAPTAP_PROJECT_PATH": "${CURRENT_PROJECT_PATH}"
      }
    }
  }
}
```

### 测试和验证
```bash
# 检查项目结构
node test-node-mcp.js

# 运行测试
npm test

# 代码检查
npm run lint

# 格式化代码
npm run format

# 编译检查
npm run build
```

## MCP 集成配置

### Claude Desktop 集成
在 `~/.config/claude-desktop/config.json` 中添加：
```json
{
  "mcpServers": {
    "taptap-docs": {
      "command": "npx",
      "args": ["@taptap/minigame-docs-mcp"]
    }
  }
}
```

**注意**: 完全零配置，通过 npx 自动下载和运行！

### 文档工具分类

#### 🏆 排行榜 API 工具
- **`search_leaderboard_docs`** - 搜索排行榜 API 文档（初始化、UI、分数提交、排名查询）
- **`get_leaderboard_overview`** - 获取排行榜 API 完整概览
- **`get_leaderboard_category_docs`** - 获取指定分类的详细文档和代码示例
  - `initialization` - 获取 LeaderboardManager 实例
  - `display` - 打开排行榜 UI
  - `score_submission` - 提交玩家分数
  - `score_query` - 查询分数和排名
  - `common_scenarios` - 完整实现示例
- **`get_leaderboard_patterns`** - 获取集成模式和最佳实践

#### 🔧 环境检查工具
- **`check_environment`** - 检查环境变量配置和用户认证状态

#### 🔑 用户数据工具（需要 Token）
- **`get_user_leaderboard_scores`** - 获取用户实际排行榜分数数据（需要 `TAPTAP_USER_TOKEN`）

### 双模式支持

**📚 文档模式（默认）**
- 无需任何配置
- 提供完整的排行榜 API 文档和代码示例
- 基于小游戏官方 API 文档

**🔑 API 模式（需要用户 Token）**
- 设置 `TAPTAP_USER_TOKEN` 环境变量
- 可调用 TapTap 实际 API 获取用户排行榜数据
- API 调用失败时自动降级为文档模式

## 核心技术栈

- **MCP Framework**: 基于 Model Context Protocol 的工具服务
- **运行时**: Node.js 16+ (JavaScript 运行环境)
- **编程语言**: TypeScript (类型安全的 JavaScript)
- **包管理**: NPM (依赖管理和分发)
- **构建工具**: TypeScript Compiler (tsc)
- **测试框架**: Jest (单元测试)
- **代码质量**: ESLint (代码检查) + Prettier (格式化)

## 配置说明

### 基本配置
本项目是纯文档服务，无需任何外部 API 或数据库配置即可使用。

### 环境变量详解

**核心环境变量**：
- `TAPTAP_USER_TOKEN`: 用户 TapTap 访问 token，启用 API 模式必需
- `TAPTAP_PROJECT_PATH`: 项目路径，某些功能可能需要

**可选配置**：
- `TAPTAP_LOG_LEVEL`: 日志级别 (默认: INFO)
- `TAPTAP_DEBUG`: 调试模式 (默认: false)
- `TAPTAP_SERVER_NAME`: MCP 服务器名称 (默认: taptap-minigame)

**环境检查**：
使用 `check_environment` 工具检查所有环境变量的配置状态。

## 开发注意事项

### 代码规范
- 使用 TypeScript 进行类型安全的开发
- 所有异步函数使用 `async/await` 语法
- 遵循 ESLint 规则和 Prettier 格式化标准
- 为所有函数和接口添加 JSDoc 注释

### MCP 工具开发
- 工具处理函数必须返回 `Promise<string>` 类型
- 新增工具需要在 `src/server.ts` 中注册工具定义和处理函数
- 工具定义需要包含完整的 JSON Schema 输入验证
- 服务器使用 stdio 通信模式，适配 Claude Desktop 等 MCP 客户端

### 文档数据管理
- 所有文档内容使用 TypeScript 静态数据，类型安全
- 按功能模块分离文档数据（认证、云存档、排行榜、SDK）
- 支持关键词搜索和分类浏览
- 包含完整的代码示例和最佳实践指南

### 项目结构
- `src/data/` - 文档数据定义（TypeScript 接口 + 数据）
- `src/tools/` - 工具处理函数实现
- `src/server.ts` - 主服务器入口
- `bin/` - NPM 可执行文件
- `dist/` - 编译输出目录

## 项目特色功能

### 纯文档服务设计
项目专注于提供高质量的开发文档和代码示例，所有内容都是静态数据，无需外部 API 依赖。

### 专注用户功能文档
- **☁️ 云存档** - 跨设备存档同步、冲突处理、最佳实践的完整方案
- **🏆 排行榜** - 分数提交、排名查询、界面集成的详细指南

### 即开即用特性
- **专注用户功能** - 专门提供需要用户 token 的核心功能文档
- **完整代码示例** - 每个功能都包含可直接使用的代码示例
- **零配置启动** - 无需任何配置文件或外部依赖
- **搜索友好** - 支持关键词搜索和分类浏览，快速定位所需文档

这种设计让开发者能够快速获取云存档和排行榜功能的准确开发指南，专注于需要用户身份验证的核心功能实现。