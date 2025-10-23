# 开发指南 - 添加新功能

本指南帮助开发者为 TapTap MCP Server 添加新功能（如云存档、分享等）。

## 📁 项目结构

```
src/
├── auth/                    # 认证模块
│   └── deviceFlow.ts       # OAuth Device Code Flow
│
├── config/                  # 配置定义
│   ├── toolDefinitions.ts  # 所有 Tools 的定义（JSON Schema）
│   └── resourceDefinitions.ts  # 所有 Resources 的定义
│
├── data/                    # 静态文档数据
│   ├── leaderboardDocs.ts  # 排行榜 API 文档内容
│   └── [newFeature]Docs.ts # 新功能文档（待添加）
│
├── handlers/                # 业务处理器
│   ├── appHandlers.ts      # 应用管理（通用）
│   ├── environmentHandlers.ts  # 环境检查（通用）
│   ├── leaderboardHandlers.ts  # 排行榜业务逻辑
│   └── [newFeature]Handlers.ts # 新功能处理器（待添加）
│
├── network/                 # 网络层
│   ├── httpClient.ts       # HTTP 客户端（通用，带签名）
│   ├── leaderboardApi.ts   # 排行榜 API 调用
│   └── [newFeature]Api.ts  # 新功能 API（待添加）
│
├── tools/                   # 工具函数（返回文档内容）
│   ├── leaderboardTools.ts # 排行榜工具函数
│   └── [newFeature]Tools.ts # 新功能工具（待添加）
│
├── types/                   # TypeScript 类型定义
│   └── index.ts            # 通用类型（MacToken 等）
│
├── utils/                   # 工具函数
│   ├── cache.ts            # 本地缓存
│   └── logger.ts           # 日志工具
│
└── server.ts               # 主服务器（注册所有 Tools 和 Resources）
```

---

## 🚀 添加新功能的步骤

以**云存档（Cloud Save）**为例：

### 步骤 1: 创建文档数据（data/）

创建 `src/data/cloudSaveDocs.ts`：

```typescript
/**
 * Cloud Save API Documentation
 */

export interface CloudSaveAPI {
  name: string;
  method: string;
  description: string;
  parameters?: Record<string, string>;
  returnValue?: string;
  example: string;
}

export interface CloudSaveDocumentation {
  title: string;
  description: string;
  apis: CloudSaveAPI[];
}

export const CLOUD_SAVE_DOCUMENTATION: CloudSaveDocumentation = {
  title: "TapTap Cloud Save API (Minigame & H5)",
  description: `Complete cloud save functionality...

⚠️ IMPORTANT:
- NO npm packages or SDK installation required
- Use global 'tap' object
- Works in TapTap Minigame AND H5 environments`,

  apis: [
    {
      name: "saveData",
      method: "cloudSaveManager.saveData({ key, data, callback })",
      description: "Save data to cloud",
      parameters: {
        "key": "string - Save key",
        "data": "any - Data to save",
        "callback": "CommonCallback - Success/failure callbacks"
      },
      returnValue: "void",
      example: `
const cloudSaveManager = tap.getCloudSaveManager();

cloudSaveManager.saveData({
  key: "player_progress",
  data: { level: 5, coins: 100 },
  callback: {
    onSuccess: (res) => console.log("Saved"),
    onFailure: (code, msg) => console.error(code, msg)
  }
});
      `
    }
    // ... 更多 APIs
  ]
};

// Helper function
export function getCloudSaveOverview(): string {
  return `# ${CLOUD_SAVE_DOCUMENTATION.title}\n\n${CLOUD_SAVE_DOCUMENTATION.description}\n\n...`;
}
```

### 步骤 2: 创建 Tools 函数（tools/）

创建 `src/tools/cloudSaveTools.ts`：

```typescript
import { CLOUD_SAVE_DOCUMENTATION } from '../data/cloudSaveDocs.js';

/**
 * Get specific API documentation
 */
function getAPIDoc(apiName: string): string {
  const api = CLOUD_SAVE_DOCUMENTATION.apis.find(a => a.name === apiName);
  if (!api) return `API "${apiName}" not found`;

  let doc = `# ${api.name}\n\n`;
  doc += `**Method:** \`${api.method}\`\n\n`;
  doc += `**Description:** ${api.description}\n\n`;
  // ... format parameters, example, etc.
  return doc;
}

// Export for Resources
export async function getSaveDataDoc(): Promise<string> {
  return getAPIDoc('saveData');
}

export async function getCloudSaveOverview(): Promise<string> {
  // ... implementation
}

export async function getCloudSaveIntegrationWorkflow(): Promise<string> {
  return `# 云存档完整接入工作流

## ⚠️ 关键原则：客户端无需安装 SDK

...步骤...

## 📚 需要详细 API 文档？

- **docs://cloud-save/api/save-data** - saveData() 详细文档
- **docs://cloud-save/api/load-data** - loadData() 详细文档
...
  `;
}

export const cloudSaveTools = {
  getSaveDataDoc,
  getLoadDataDoc,
  getCloudSaveOverview,
  getCloudSaveIntegrationWorkflow
};
```

### 步骤 3: 创建 API 调用层（network/）

创建 `src/network/cloudSaveApi.ts`：

```typescript
import { HttpClient } from './httpClient.js';
import { ensureAppInfo } from './leaderboardApi.js';  // 复用

export interface SaveDataParams {
  developer_id: number;
  app_id: number;
  key: string;
  data: any;
}

/**
 * Save data to cloud
 */
export async function saveCloudData(params: SaveDataParams): Promise<any> {
  const client = new HttpClient();

  try {
    const response = await client.post('/cloud-save/v1/save', {
      body: params
    });

    return response;
  } catch (error) {
    throw new Error(`Failed to save data: ${error.message}`);
  }
}

// 更多 API...
```

### 步骤 4: 创建业务处理器（handlers/）

创建 `src/handlers/cloudSaveHandlers.ts`：

```typescript
import { saveCloudData } from '../network/cloudSaveApi.js';
import { ensureAppInfo } from '../network/leaderboardApi.js';

export interface HandlerContext {
  projectPath?: string;
  macToken?: any;
}

/**
 * Save data handler
 */
export async function saveData(
  args: { key: string; data: any },
  context: HandlerContext
): Promise<string> {
  try {
    // Auto-fetch developer_id and app_id
    const appInfo = await ensureAppInfo(context.projectPath);

    const result = await saveCloudData({
      developer_id: appInfo.developer_id!,
      app_id: appInfo.app_id!,
      key: args.key,
      data: args.data
    });

    return `✅ 数据保存成功!\n\nKey: ${args.key}\n...`;
  } catch (error) {
    return `❌ 保存失败: ${error.message}`;
  }
}

// 更多 handlers...
```

### 步骤 5: 注册 Tools（config/toolDefinitions.ts）

在 `src/config/toolDefinitions.ts` 中添加：

```typescript
export function getToolDefinitions(): Tool[] {
  return [
    // ============ 排行榜 Tools ============
    // ... 现有的排行榜工具 ...

    // ============ 云存档 Tools ============
    {
      name: 'get_cloud_save_guide',
      description: '⭐ READ THIS FIRST when user wants to integrate cloud save. Returns complete workflow...',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'save_cloud_data',
      description: 'Save data to TapTap cloud storage. Requires authentication.',
      inputSchema: {
        type: 'object',
        properties: {
          key: { type: 'string', description: 'Save key' },
          data: { type: 'object', description: 'Data to save' }
        },
        required: ['key', 'data']
      }
    },
    // ... 更多云存档工具
  ];
}
```

### 步骤 6: 注册 Resources（config/resourceDefinitions.ts）

在 `src/config/resourceDefinitions.ts` 中添加：

```typescript
export function getResourceDefinitions(): ResourceDefinition[] {
  return [
    // ============ 排行榜 Resources ============
    // ... 现有的排行榜 Resources ...

    // ============ 云存档 Resources ============
    {
      uri: 'docs://cloud-save/api/save-data',
      name: 'API: saveData()',
      description: 'How to save data to cloud - READ THIS when user asks how to save/upload data',
      mimeType: 'text/markdown'
    },
    {
      uri: 'docs://cloud-save/api/load-data',
      name: 'API: loadData()',
      description: 'How to load data from cloud - READ THIS when user asks how to load/retrieve data',
      mimeType: 'text/markdown'
    },
    {
      uri: 'docs://cloud-save/overview',
      name: 'Cloud Save Complete Overview',
      description: 'Complete overview of cloud save APIs',
      mimeType: 'text/markdown'
    }
  ];
}

export const RESOURCE_URI_MAP: Record<string, string> = {
  // ============ 排行榜映射 ============
  // ... 现有的映射 ...

  // ============ 云存档映射 ============
  'docs://cloud-save/api/save-data': 'getSaveDataDoc',
  'docs://cloud-save/api/load-data': 'getLoadDataDoc',
  'docs://cloud-save/overview': 'getCloudSaveOverview'
};
```

### 步骤 7: 注册处理器（server.ts）

在 `src/server.ts` 中添加：

```typescript
// 导入云存档处理器
import * as cloudSaveHandlers from './handlers/cloudSaveHandlers.js';
import { cloudSaveTools } from './tools/cloudSaveTools.js';

// 在 handleToolCall 中添加
private async handleToolCall(name: string, args: any): Promise<string> {
  // ============ 排行榜工具 ============
  // ... 现有的处理 ...

  // ============ 云存档工具 ============
  if (name === 'get_cloud_save_guide') {
    return cloudSaveTools.getCloudSaveIntegrationWorkflow();
  }

  if (name === 'save_cloud_data') {
    await this.ensureAuth();  // 需要认证
    return cloudSaveHandlers.saveData(args, this.context);
  }

  // ... 更多云存档工具
}

// 在 handleResourceRead 中，cloudSaveTools 已经在映射中，无需额外代码
```

---

## 📋 开发检查清单

添加新功能时，确保完成以下步骤：

- [ ] 创建文档数据文件（`src/data/[feature]Docs.ts`）
- [ ] 创建工具函数文件（`src/tools/[feature]Tools.ts`）
- [ ] 创建 API 调用文件（`src/network/[feature]Api.ts`）
- [ ] 创建业务处理器（`src/handlers/[feature]Handlers.ts`）
- [ ] 注册 Tools（`src/config/toolDefinitions.ts`）
- [ ] 注册 Resources（`src/config/resourceDefinitions.ts`）
- [ ] 注册处理器（`src/server.ts`）
- [ ] 编译测试（`npm run build`）
- [ ] 更新 CLAUDE.md（添加新工具说明）
- [ ] 更新 CHANGELOG.md（记录变更）

---

## 🎯 设计原则

### Tools 设计原则

**必须包含的 Tools**：
1. `get_[feature]_guide` - 完整接入工作流指引 ⭐
2. 操作类工具（如 `create_`, `list_`, `delete_` 等）
3. 如有需要：`get_current_[feature]_info` - 当前状态查询

**Tool 命名规范**：
- 动词开头：`get_`, `create_`, `list_`, `delete_`, `update_`
- 小写 + 下划线：`get_cloud_save_guide`

**Tool description 规范**：
- 第一行：核心功能简述
- 使用 ⭐ 标记重要的指引工具
- 说明何时使用（when to call）
- 说明是否需要认证

### Resources 设计原则

**必须包含的 Resources**：
1. `docs://[feature]/api/[method]` - 每个客户端 API 的详细文档
2. `docs://[feature]/overview` - 完整概览

**Resource URI 规范**：
- `docs://[feature]/api/[method-name]` - API 文档
- `docs://[feature]/overview` - 功能概览
- 使用小写 + 连字符：`cloud-save`, `social-share`

**Resource description 规范**：
- 说明文档内容
- 添加关键词：READ THIS when user asks...
- 列举使用场景（how to xxx）

### 文档内容规范

**必须强调**：
```markdown
⚠️ CRITICAL - NO SDK INSTALLATION REQUIRED:
- ❌ DO NOT run 'npm install'
- ❌ DO NOT add packages to package.json
- ✅ Use global 'tap' object
```

**代码示例规范**：
```javascript
// ⚠️ tap 是全局对象，无需 import
const featureManager = tap.getFeatureManager();

featureManager.someMethod({
  param1: value1,
  param2: value2,
  callback: {
    onSuccess: (res) => {},
    onFailure: (code, msg) => {}
  }
});
```

---

## 📝 快速添加新功能模板

创建了一个快速模板生成脚本：
