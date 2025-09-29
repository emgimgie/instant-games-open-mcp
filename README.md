# TapTap 小游戏开发文档 MCP 服务器

> 基于 Model Context Protocol (MCP) 的 TapTap 小游戏开发文档服务器（Node.js 版本）
>
> 🚀 零配置部署 | 📚 完整文档 | 🔧 即开即用

## 🌟 功能特性

### 🔐 认证和授权
- OAuth 2.0 授权流程完整指南
- API Key 认证最佳实践
- 令牌管理和刷新机制
- 安全认证代码示例

### ☁️ 云存档系统
- 跨设备存档同步方案
- 版本冲突智能处理
- 多槽位存档管理
- 数据安全和备份

### 🏆 排行榜系统
- 分数提交和批量操作
- 排名查询和实时更新
- 排行榜界面集成
- 竞技系统设计模式

### 🔧 SDK 集成指南
- Unity 引擎完整集成
- Cocos Creator 详细指南
- Web 平台 SDK 使用
- 多平台最佳实践

### ✨ 核心优势
- **零配置启动** - 无需 API 密钥或外部依赖
- **完整代码示例** - 可直接复制使用的代码
- **模块化设计** - 按功能分离，便于查找
- **即开即用** - 通过 npx 一键启动

## 🚀 快速开始

### 通过 NPX 直接使用（推荐）
```bash
# 无需安装，直接运行
npx @taptap/minigame-docs-mcp
```

### 全局安装
```bash
# 全局安装
npm install -g @taptap/minigame-docs-mcp

# 运行
taptap-docs-mcp
```

### 本地开发
```bash
# 克隆项目
git clone <repository-url>
cd taptap-minigame-mcp-server

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 或使用启动脚本
./start-node-mcp.sh
```

## 🔗 AI Agent 集成

### Claude Desktop 集成
在 Claude Desktop 配置文件中添加：
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

### OpenHands 集成
在 OpenHands 的 `config.toml` 中添加：
```toml
[mcp]
stdio_servers = [
    {
        name = "taptap-docs",
        command = "npx",
        args = ["@taptap/minigame-docs-mcp"]
    }
]
```

### 其他 AI Agent
使用标准 MCP 客户端库连接：
```javascript
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
    command: 'npx',
    args: ['@taptap/minigame-docs-mcp']
});
```

## 📖 可用工具

### 🔐 认证和授权工具
- `search_auth_docs` - 搜索认证相关文档（OAuth、API Key、令牌管理）
- `get_auth_methods` - 获取所有认证方式概览
- `get_auth_category_docs` - 获取指定认证分类的详细文档和代码示例

### ☁️ 云存档功能工具
- `search_cloud_save_docs` - 搜索云存档相关文档（同步、备份、冲突处理）
- `get_cloud_save_overview` - 获取云存档功能概览
- `get_cloud_save_category_docs` - 获取指定云存档分类的详细文档和 API 示例

### 🏆 排行榜系统工具
- `search_leaderboard_docs` - 搜索排行榜相关文档（分数提交、排名查询、界面显示）
- `get_leaderboard_overview` - 获取排行榜功能概览
- `get_leaderboard_category_docs` - 获取指定排行榜分类的详细文档
- `get_leaderboard_patterns` - 获取排行榜集成模式和最佳实践

### 🔧 SDK 集成工具
- `search_sdk_docs` - 搜索 SDK 集成相关文档（Unity、Cocos、Web）
- `get_sdk_platforms` - 获取支持的 SDK 平台列表
- `get_sdk_platform_docs` - 获取指定平台的 SDK 集成指南
- `get_sdk_best_practices` - 获取 SDK 集成的最佳实践

## 💡 使用示例

### 认证相关查询
```
开发者: 我想了解 TapTap 的 OAuth 登录流程

MCP 工具: search_auth_docs
参数: { "query": "OAuth", "category": "oauth" }
→ 返回完整的 OAuth 2.0 授权流程和代码示例
```

### SDK 集成指南
```
开发者: 请给我 Unity 集成 TapTap SDK 的详细步骤

MCP 工具: get_sdk_platform_docs
参数: { "platform": "unity" }
→ 返回完整的 Unity 集成代码和配置步骤
```

### 云存档开发
```
开发者: 如何实现游戏的云存档同步功能？

MCP 工具: get_cloud_save_category_docs
参数: { "category": "advanced_features" }
→ 返回版本冲突处理、自动同步等高级功能的实现代码
```

### 排行榜系统
```
开发者: 我想在游戏中添加排行榜功能

MCP 工具: get_leaderboard_patterns
→ 返回完整的排行榜集成模式和游戏结束提交分数的完整代码示例
```

### 最佳实践查询
```
开发者: TapTap SDK 集成有什么最佳实践？

MCP 工具: get_sdk_best_practices
→ 返回初始化、用户登录、错误处理、性能优化等各方面的最佳实践
```

## 🔧 开发和构建

### 本地开发
```bash
# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 构建项目
npm run build

# 运行测试
npm test

# 代码检查
npm run lint

# 格式化代码
npm run format
```

### 发布到 NPM
```bash
# 构建项目
npm run build

# 发布到 NPM
npm publish

# 发布到私有仓库
npm publish --registry https://npm.taptap.com/
```

## 📁 项目结构

```
├── src/                          # TypeScript 源码
│   ├── server.ts                 # 主服务器入口
│   ├── data/                     # 静态文档数据
│   │   ├── authDocs.ts          # 认证文档
│   │   ├── cloudSaveDocs.ts     # 云存档文档
│   │   ├── leaderboardDocs.ts   # 排行榜文档
│   │   └── sdkDocs.ts           # SDK 文档
│   └── tools/                   # 工具处理函数
│       ├── authTools.ts         # 认证工具
│       ├── cloudSaveTools.ts    # 云存档工具
│       ├── leaderboardTools.ts  # 排行榜工具
│       └── sdkTools.ts          # SDK 工具
├── bin/                         # 可执行文件
│   └── taptap-docs-mcp          # NPM 启动脚本
├── dist/                        # 编译输出（自动生成）
├── examples/                    # 集成配置示例
├── package.json                 # NPM 包配置
├── tsconfig.json               # TypeScript 配置
└── README.md                   # 项目文档
```

## 📄 许可证

MIT License

---

> **注意**: 本项目现在完全基于 Node.js，无需 Python 环境，通过 `npx` 即可零配置使用。