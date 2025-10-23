# 项目架构

## 🎯 模块化设计

每个功能（排行榜、云存档、分享等）都遵循相同的模块化结构：

```
功能模块
├── data/[feature]Docs.ts       # 文档内容（静态数据）
├── tools/[feature]Tools.ts     # 工具函数（返回文档）
├── network/[feature]Api.ts     # API 调用（HTTP 请求）
├── handlers/[feature]Handlers.ts # 业务逻辑（处理器）
└── 在 server.ts 中注册
```

---

## 📊 当前功能模块

### 1. 排行榜模块（Leaderboard）

```
src/
├── data/leaderboardDocs.ts      # 排行榜 API 文档
├── tools/leaderboardTools.ts    # 返回文档的工具函数
├── network/leaderboardApi.ts    # 排行榜 API 调用
├── handlers/leaderboardHandlers.ts  # 业务逻辑
└── config/
    ├── toolDefinitions.ts       # Tools 注册
    └── resourceDefinitions.ts   # Resources 注册
```

**提供的功能**：
- 10 个 Tools（包括流程指引）
- 7 个 Resources（API 文档）

---

## 🔄 数据流向

### Tools 调用流程

```
Client (Claude Code/VSCode)
    ↓
MCP Protocol (tools/call)
    ↓
server.ts → handleToolCall()
    ↓
根据 tool name 路由到：
    ├── leaderboardHandlers.createLeaderboard()  # 操作类
    ├── leaderboardTools.getIntegrationWorkflow()  # 文档类
    └── environmentHandlers.checkEnvironment()  # 系统类
    ↓
返回结果（string）
```

### Resources 读取流程

```
Client (Claude Code)
    ↓
MCP Protocol (resources/read)
    ↓
server.ts → handleResourceRead()
    ↓
查询 RESOURCE_URI_MAP[uri]
    ↓
调用对应的工具函数
    ↓
leaderboardTools.submitScores()
    ↓
返回文档内容（markdown string）
```

---

## 🏗️ 分层架构

```
┌─────────────────────────────────────┐
│   MCP Client (Claude Code/VSCode)  │
└─────────────┬───────────────────────┘
              │ MCP Protocol
              │
┌─────────────▼───────────────────────┐
│   server.ts (路由层)                │
│   - handleToolCall()                │
│   - handleResourceRead()            │
└─────────────┬───────────────────────┘
              │
       ┌──────┴──────┐
       │             │
┌──────▼──────┐ ┌───▼──────┐
│  Handlers   │ │  Tools   │
│  (业务逻辑)  │ │  (文档)  │
└──────┬──────┘ └───┬──────┘
       │             │
       │      ┌──────┴──────┐
       │      │             │
┌──────▼──────▼──────┐ ┌───▼──────┐
│   Network APIs      │ │   Data   │
│   (HTTP 调用)       │ │  (文档)  │
└─────────────────────┘ └──────────┘
```

---

## 🎨 命名约定

### 文件命名

| 层级 | 命名规范 | 示例 |
|------|---------|------|
| Docs | `[feature]Docs.ts` | `leaderboardDocs.ts`, `cloudSaveDocs.ts` |
| Tools | `[feature]Tools.ts` | `leaderboardTools.ts`, `cloudSaveTools.ts` |
| API | `[feature]Api.ts` | `leaderboardApi.ts`, `cloudSaveApi.ts` |
| Handlers | `[feature]Handlers.ts` | `leaderboardHandlers.ts`, `cloudSaveHandlers.ts` |

### 函数命名

| 类型 | 命名规范 | 示例 |
|------|---------|------|
| Tool | `get_[feature]_[action]` | `get_leaderboard_guide`, `create_leaderboard` |
| Resource URI | `docs://[feature]/[path]` | `docs://leaderboard/api/submit-scores` |
| Handler | `[action][Feature]` | `createLeaderboard`, `saveData` |

### 变量命名

- **驼峰命名**: `leaderboardManager`, `cloudSaveData`
- **常量**: `LEADERBOARD_DOCUMENTATION`, `CLOUD_SAVE_API`
- **接口**: `LeaderboardAPI`, `CloudSaveParams`

---

## 🔧 通用工具和函数

### 可复用的组件

**HTTP Client** (`src/network/httpClient.ts`):
- ✅ 已集成 MAC 认证
- ✅ 已集成请求签名
- ✅ 统一的错误处理
- 使用：`new HttpClient()` 然后调用 `.get()` 或 `.post()`

**App Info** (`src/network/leaderboardApi.ts`):
- ✅ `ensureAppInfo()` - 自动获取 developer_id 和 app_id
- ✅ `selectApp()` - 选择应用并缓存
- ✅ `getAllDevelopersAndApps()` - 获取所有应用
- 新功能可以直接复用这些函数

**缓存** (`src/utils/cache.ts`):
- ✅ `readAppCache()` - 读取缓存
- ✅ `saveAppCache()` - 保存缓存
- ✅ 自动处理目录创建
- 新功能可以扩展 `AppCacheInfo` 接口添加自己的字段

**认证** (`src/auth/deviceFlow.ts`):
- ✅ OAuth Device Code Flow
- ✅ 自动处理 token 存储
- ✅ 新功能无需关心认证细节

---

## 📚 参考示例

查看 **排行榜模块** 作为完整的参考实现：

1. **文档内容**: `src/data/leaderboardDocs.ts`
2. **工具函数**: `src/tools/leaderboardTools.ts`
3. **API 调用**: `src/network/leaderboardApi.ts`
4. **业务逻辑**: `src/handlers/leaderboardHandlers.ts`
5. **Tools 注册**: `src/config/toolDefinitions.ts` (行 13-100)
6. **Resources 注册**: `src/config/resourceDefinitions.ts` (行 20-63)
7. **处理器注册**: `src/server.ts` (行 201-310)

---

## 🚀 快速开始

```bash
# 1. 使用脚手架创建新功能
./scripts/create-feature.sh cloud-save "Cloud Save"

# 2. 编辑生成的文件，实现功能

# 3. 注册到 config/ 和 server.ts

# 4. 编译测试
npm run build

# 5. 本地调试
node dist/server.js

# 6. 提交代码
git add .
git commit -m "feat: 添加云存档功能"
```

---

## 💡 开发提示

1. **优先实现 `get_[feature]_guide` Tool**
   - 这是 AI 的入口
   - 包含完整工作流
   - 列出所有 Resources

2. **Resources 只放 API 详细文档**
   - 不要放工作流指引
   - 专注于参数、返回值、示例

3. **复用现有组件**
   - HTTP Client
   - App Info
   - 缓存
   - 认证

4. **遵循命名约定**
   - 保持一致性
   - 方便查找和维护

5. **测试不同 MCP 客户端**
   - Claude Code
   - VSCode
   - Cursor

---

## 📖 参考文档

- **MCP 规范**: https://modelcontextprotocol.io/
- **项目指南**: CONTRIBUTING.md
- **更新日志**: CHANGELOG.md
- **使用说明**: CLAUDE.md
