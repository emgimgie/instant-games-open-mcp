# 开发指南 - 添加新功能

本指南帮助开发者为 TapTap MCP Server 添加新功能（如云存档、分享等）。

## 🏗️ 新架构概览（v1.2.0-beta.11+）

项目采用**模块化架构**，每个功能都是完全内聚的：

```
src/
├── features/              # 功能模块（代码完全内聚）
│   └── leaderboard/      # 排行榜模块
│       ├── index.ts      # 模块定义 ⭐
│       ├── tools.ts      # Tools 定义 + 处理器
│       ├── resources.ts  # Resources 定义 + 处理器
│       ├── docs.ts       # 文档数据
│       ├── docTools.ts   # 文档工具
│       ├── handlers.ts   # 业务逻辑
│       └── api.ts        # API 调用
│
├── core/                  # 共享核心代码
│   ├── auth/             # OAuth
│   ├── network/          # HTTP Client
│   ├── handlers/         # 通用处理器
│   ├── utils/            # 缓存、日志
│   └── types/            # 类型
│
└── server.ts              # 自动注册
```

---

## 🚀 添加新功能的步骤

以**云存档（Cloud Save）**为例：

### 方法 A: 使用脚手架（推荐）

```bash
# 1. 使用脚本生成模板
./scripts/create-feature.sh cloud-save "Cloud Save"

# 自动创建所有必需文件在 src/features/cloudSave/

# 2. 实现各个文件中的 TODO 标记内容

# 3. 在 server.ts 注册模块
```

### 方法 B: 手动创建（完整控制）

#### 步骤 1: 创建模块目录

```bash
mkdir src/features/cloudSave
```

#### 步骤 2: 创建模块定义（index.ts）

`src/features/cloudSave/index.ts`:

```typescript
import { cloudSaveToolDefinitions, cloudSaveToolHandlers } from './tools.js';
import { cloudSaveResourceDefinitions, cloudSaveResourceHandlers } from './resources.js';

export const cloudSaveModule = {
  name: 'cloudSave',
  description: 'TapTap 云存档功能',

  tools: cloudSaveToolDefinitions.map((definition, index) => ({
    definition,
    handler: cloudSaveToolHandlers[index],
    requiresAuth: ['save_cloud_data', 'load_cloud_data'].includes(definition.name)
  })),

  resources: cloudSaveResourceDefinitions.map((definition, index) => ({
    ...definition,
    handler: cloudSaveResourceHandlers[index]
  }))
};
```

#### 步骤 3: 定义 Tools（tools.ts）

`src/features/cloudSave/tools.ts`:

```typescript
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { HandlerContext } from '../../core/types/index.js';
import * as cloudSaveHandlers from './handlers.js';
import { cloudSaveTools } from './docTools.js';

export const cloudSaveToolDefinitions: Tool[] = [
  {
    name: 'get_cloud_save_guide',
    description: '⭐ 云存档完整接入指引',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'save_cloud_data',
    description: '保存数据到云端',
    inputSchema: {
      type: 'object',
      properties: {
        key: { type: 'string', description: 'Save key' },
        data: { type: 'object', description: 'Data to save' }
      },
      required: ['key', 'data']
    }
  }
];

export const cloudSaveToolHandlers = [
  // get_cloud_save_guide
  async (args: any, context: HandlerContext) => {
    return cloudSaveTools.getIntegrationWorkflow();
  },

  // save_cloud_data
  async (args: any, context: HandlerContext) => {
    return cloudSaveHandlers.saveData(args, context);
  }
];
```

#### 步骤 4: 定义 Resources（resources.ts）

`src/features/cloudSave/resources.ts`:

```typescript
import { cloudSaveTools } from './docTools.js';

export const cloudSaveResourceDefinitions = [
  {
    uri: 'docs://cloud-save/api/save-data',
    name: 'API: saveData()',
    description: 'How to save data...',
    mimeType: 'text/markdown'
  },
  {
    uri: 'docs://cloud-save/overview',
    name: 'Cloud Save Overview',
    description: 'Complete overview...',
    mimeType: 'text/markdown'
  }
];

export const cloudSaveResourceHandlers = [
  // docs://cloud-save/api/save-data
  async () => cloudSaveTools.getSaveDataDoc(),

  // docs://cloud-save/overview
  async () => cloudSaveTools.getOverview()
];
```

#### 步骤 5: 实现文档内容（docs.ts, docTools.ts）

参考 `src/features/leaderboard/docs.ts` 和 `docTools.ts`

#### 步骤 6: 实现业务逻辑（handlers.ts, api.ts）

参考 `src/features/leaderboard/handlers.ts` 和 `api.ts`

#### 步骤 7: 注册到主服务器

在 `src/server.ts` 中：

```typescript
// 添加 import
import { cloudSaveModule } from './features/cloudSave/index.js';

// 添加到模块数组
const allModules = [
  leaderboardModule,
  cloudSaveModule  // ← 新增
];

// 完成！自动注册 ✅
```

---

## 📋 开发检查清单

添加新功能时，确保：

- [ ] 在 `src/features/[feature]/` 创建所有文件
- [ ] 实现模块定义（index.ts）
- [ ] 定义所有 Tools 和 Resources
- [ ] 实现所有 handlers
- [ ] 在 server.ts 注册模块
- [ ] 编译无错：`npm run build`
- [ ] 测试启动：`node dist/server.js`
- [ ] 更新 CLAUDE.md（工具说明）
- [ ] 更新 CHANGELOG.md（版本记录）

---

## 🎯 设计原则

### 1. 代码内聚
- 一个功能的所有代码在一个目录
- 不跨目录查找文件

### 2. 模块独立
- 模块间不直接依赖
- 通过 core/ 共享代码

### 3. 自动注册
- 在模块中定义
- server.ts 自动注册
- 不需要手动修改多个文件

### 4. 职责清晰
- Tools: 操作和指引（AI 调用）
- Resources: API 文档（补充阅读）

---

## 🔧 可复用的核心组件

### HTTP Client

```typescript
import { HttpClient } from '../../core/network/httpClient.js';

const client = new HttpClient();
const result = await client.post('/your-api', { body: data });
```

### App Info

```typescript
import { ensureAppInfo } from '../leaderboard/api.js';

const appInfo = await ensureAppInfo(context.projectPath);
// 获得: developer_id, app_id, miniapp_id
```

### 缓存

```typescript
import { readAppCache, saveAppCache } from '../../core/utils/cache.js';

const cache = readAppCache(projectPath);
saveAppCache({ ...info }, projectPath);
```

---

## 📚 参考示例

**完整参考**：查看 `src/features/leaderboard/` 模块

特别关注：
- `index.ts` - 模块结构
- `tools.ts` - Tools 定义模式
- `resources.ts` - Resources 定义模式
- `handlers.ts` - 业务逻辑模式

---

## 💡 快速开始

```bash
# 1. 生成模板
./scripts/create-feature.sh cloud-save "Cloud Save"

# 2. 参考排行榜模块实现
ls -la src/features/leaderboard/

# 3. 编译测试
npm run build
node dist/server.js

# 4. 提交
git add src/features/cloudSave
git commit -m "feat: 添加云存档功能"
```

---

## 🔄 技术细节

### 数据流向 - Tools 调用

```
MCP Client (Claude Code/VSCode)
    ↓
MCP Protocol: tools/call
    ↓
server.ts → 自动路由
    ↓
查找模块中的 tool.handler
    ↓ 如果 requiresAuth=true
ensureAuth() → OAuth 懒加载
    ↓
执行 handler(args, context)
    ↓
features/[feature]/handlers.ts
    ↓
features/[feature]/api.ts
    ↓
core/network/httpClient.ts
    ↓
TapTap API
```

### 数据流向 - Resources 读取

```
MCP Client (Claude Code)
    ↓
MCP Protocol: resources/read
    ↓
server.ts → 自动路由
    ↓
查找模块中的 resource.handler
    ↓
执行 handler()
    ↓
features/[feature]/docTools.ts
    ↓
features/[feature]/docs.ts
    ↓
返回文档内容
```

### 模块依赖关系

```
features/[feature]/
    ↓ 依赖
core/ (共享代码)
    ↓ 不依赖
features/* (其他模块)
```

**依赖规则**：
- ✅ 功能模块可以依赖 core/
- ❌ 功能模块不能相互依赖
- ✅ core/ 不依赖任何功能模块

### 代码度量

当前项目（v1.2.0-beta.11）：

| 模块 | 文件数 | 代码行数 |
|------|-------|---------|
| leaderboard | 7 | ~1800 行 |
| core | 8 | ~800 行 |
| server.ts | 1 | ~300 行 |
| **总计** | **16** | **~2900 行** |

模块化后代码减少了约 15%（清理了重复）

---

## 🎊 享受模块化开发！

模块化架构让添加新功能变得简单快捷！
