# 项目结构图

## 📂 目录结构

```
taptap-minigame-mcp-server/
│
├── 📖 文档
│   ├── README.md                    # 用户使用文档
│   ├── CLAUDE.md                    # Claude Code 指南
│   ├── CONTRIBUTING.md              # 开发者贡献指南
│   ├── ARCHITECTURE.md              # 架构说明
│   ├── CHANGELOG.md                 # 版本变更记录
│   └── PROJECT-STRUCTURE.md         # 本文件
│
├── 📦 包管理
│   ├── package.json                 # NPM 包配置
│   └── tsconfig.json                # TypeScript 配置
│
├── 🔧 脚本
│   └── scripts/
│       └── create-feature.sh        # 快速创建新功能的脚手架
│
├── 🎯 可执行文件
│   └── bin/
│       ├── minigame-open-mcp        # MCP Server 入口
│       └── authorize                # OAuth 授权工具
│
└── 💻 源代码
    └── src/
        │
        ├── 🔐 认证模块
        │   └── auth/
        │       └── deviceFlow.ts    # OAuth 2.0 Device Code Flow
        │
        ├── ⚙️  配置层
        │   └── config/
        │       ├── toolDefinitions.ts      # 所有 Tools 定义
        │       └── resourceDefinitions.ts  # 所有 Resources 定义
        │
        ├── 📚 文档数据层
        │   └── data/
        │       └── leaderboardDocs.ts     # 排行榜 API 文档内容
        │       # 未来: cloudSaveDocs.ts, shareDocs.ts...
        │
        ├── 🔨 工具函数层
        │   └── tools/
        │       └── leaderboardTools.ts    # 排行榜文档工具
        │       # 未来: cloudSaveTools.ts, shareTools.ts...
        │
        ├── 🌐 网络请求层
        │   └── network/
        │       ├── httpClient.ts          # HTTP 客户端（通用）
        │       └── leaderboardApi.ts      # 排行榜 API 调用
        │       # 未来: cloudSaveApi.ts, shareApi.ts...
        │
        ├── ⚙️  业务处理层
        │   └── handlers/
        │       ├── appHandlers.ts         # 应用管理（通用）
        │       ├── environmentHandlers.ts # 环境检查（通用）
        │       └── leaderboardHandlers.ts # 排行榜业务逻辑
        │       # 未来: cloudSaveHandlers.ts, shareHandlers.ts...
        │
        ├── 🔧 工具函数
        │   └── utils/
        │       ├── cache.ts               # 本地缓存
        │       └── logger.ts              # 日志工具
        │
        ├── 📝 类型定义
        │   └── types/
        │       └── index.ts               # 通用类型
        │
        └── 🚀 主服务器
            └── server.ts                  # MCP Server 主入口
```

---

## 🎨 功能模块模式

每个新功能都遵循相同的模式：

### 排行榜模块（参考实现）

```
Leaderboard 功能
├── leaderboardDocs.ts (142行)
│   └── API 文档内容
│       ├── tap.getLeaderboardManager()
│       ├── submitScores()
│       ├── openLeaderboard()
│       └── ...
│
├── leaderboardTools.ts (507行)
│   └── 文档获取函数
│       ├── getLeaderboardManager() → 返回文档
│       ├── submitScores() → 返回文档
│       ├── getIntegrationWorkflow() → 返回工作流
│       └── getCurrentAppInfo() → 返回应用信息
│
├── leaderboardApi.ts (464行)
│   └── API 调用函数
│       ├── createLeaderboard() → POST /open/leaderboard/v1/create
│       ├── listLeaderboards() → GET /open/leaderboard/v1/list
│       ├── ensureAppInfo() → 自动获取 app 信息
│       └── ...
│
└── leaderboardHandlers.ts (390行)
    └── 业务逻辑处理
        ├── createLeaderboard() → 验证 → API 调用 → 格式化返回
        ├── listLeaderboards() → 获取 → 格式化列表
        └── startLeaderboardIntegration() → 完整工作流
```

### 未来：云存档模块（待实现）

```
CloudSave 功能
├── cloudSaveDocs.ts
│   └── API 文档
│       ├── saveData()
│       ├── loadData()
│       └── deleteData()
│
├── cloudSaveTools.ts
│   └── 文档函数
│       ├── getSaveDataDoc()
│       ├── getCloudSaveIntegrationWorkflow()
│       └── ...
│
├── cloudSaveApi.ts
│   └── API 调用
│       ├── saveCloudData()
│       ├── loadCloudData()
│       └── ...
│
└── cloudSaveHandlers.ts
    └── 业务处理
        ├── saveData()
        ├── loadData()
        └── ...
```

---

## 🔗 模块间依赖

```
server.ts (主入口)
    ↓ imports
    ├── config/toolDefinitions.ts
    ├── config/resourceDefinitions.ts
    ├── handlers/* (所有处理器)
    └── tools/* (所有工具)

handlers/* (处理器)
    ↓ imports
    ├── network/*Api.ts (API 调用)
    └── utils/cache.ts (缓存)

tools/* (工具函数)
    ↓ imports
    └── data/*Docs.ts (文档数据)

network/*Api.ts (API 层)
    ↓ imports
    ├── network/httpClient.ts (HTTP 客户端)
    └── utils/cache.ts (缓存)
```

**依赖原则**：
- ✅ 上层依赖下层
- ❌ 下层不依赖上层
- ✅ 同层模块相互独立

---

## 📏 代码度量

当前项目规模（v1.2.0-beta.11）：

| 模块 | 文件数 | 代码行数 |
|------|-------|---------|
| 排行榜 | 4 | ~1500 行 |
| 网络层 | 2 | ~600 行 |
| 配置层 | 2 | ~300 行 |
| 认证层 | 1 | ~400 行 |
| 工具层 | 2 | ~200 行 |
| 主服务器 | 1 | ~400 行 |
| **总计** | **12** | **~3400 行** |

**新功能估算**：
- 简单功能（3-5 个 API）：~800-1000 行
- 复杂功能（10+ 个 API）：~1500-2000 行

---

## 🎯 质量标准

### 代码质量

- ✅ TypeScript 严格模式
- ✅ 所有函数有 JSDoc 注释
- ✅ 所有接口有类型定义
- ✅ 错误处理完整
- ✅ 日志记录（通过 logger）

### 文档质量

- ✅ 强调 NO SDK 安装
- ✅ 完整的代码示例
- ✅ 所有参数说明
- ✅ 错误码说明
- ✅ 使用场景说明

### MCP 规范

- ✅ Tools: 操作和指引
- ✅ Resources: API 详细文档
- ✅ description 包含关键词（READ THIS when...）
- ✅ 示例代码使用单个对象参数

---

## 🔍 代码审查清单

添加新功能时，检查：

- [ ] 文件命名遵循约定
- [ ] 导出函数命名正确
- [ ] 在 toolDefinitions.ts 中注册
- [ ] 在 resourceDefinitions.ts 中注册
- [ ] 在 server.ts 中添加路由
- [ ] 编译无错误：`npm run build`
- [ ] 测试启动：`node dist/server.js`
- [ ] 更新 CLAUDE.md 工具分类
- [ ] 更新 CHANGELOG.md
- [ ] 提交信息清晰

---

## 📖 延伸阅读

- **添加新功能**: 参见 CONTRIBUTING.md
- **使用脚手架**: `./scripts/create-feature.sh`
- **排行榜参考**: 查看 src/ 下的 leaderboard* 文件
- **MCP 规范**: https://modelcontextprotocol.io/
