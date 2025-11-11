# 无状态架构方案

## 目标

实现 TapTap MCP Server 的完全无状态化，支持多租户容器化部署。

## 架构背景

```
Workspace
├── RuntimeContainer-1 (用户 A)
│   ├── Agent-Chat-1 → MCP Proxy-1 → TapTap MCP (无状态)
│   ├── Agent-Chat-2 → MCP Proxy-1 ↗
│   └── Context: { userId, projectPath, developer_id, app_id, macToken }
│
├── RuntimeContainer-2 (用户 B)
│   ├── Agent-Chat-3 → MCP Proxy-2 → TapTap MCP (无状态)
│   └── Context: { userId, projectPath, developer_id, app_id, macToken }
│
└── TapTap MCP Server (中心化，无状态)
    - 不存储用户数据
    - 不依赖文件系统
    - 通过私有参数接收所有上下文
```

## 设计原则

### 私有参数用途

**通过私有参数传递所有运行时上下文：**

```typescript
interface PrivateToolParams {
  // === 认证层 ===
  _mac_token?: MacToken;

  // === 租户层 ===
  _user_id?: string;
  _tenant_id?: string;

  // === 应用上下文层 ===
  _developer_id?: number;
  _app_id?: number;
  _project_path?: string;

  // === 追踪层 ===
  _session_id?: string;
  _trace_id?: string;
  _request_id?: string;
}
```

### 环境变量用途

**固定配置（部署时确定，运行时不变）：**

- `TDS_MCP_ENV` - 环境选择（production/rnd）
- `TDS_MCP_CLIENT_TOKEN` - 签名密钥（必需）
- `TDS_MCP_CLIENT_ID` - 客户端ID（可选）
- `TDS_MCP_TRANSPORT` - 传输模式
- `TDS_MCP_PORT` - 端口
- `TDS_MCP_VERBOSE` - 详细日志

## 实现方案

### 1. 扩展私有参数定义

**文件：** `src/core/types/privateParams.ts`

新增字段：
- `_developer_id`
- `_app_id`
- `_project_path`
- `_tenant_id`

### 2. 扩展 HandlerContext

**文件：** `src/core/types/index.ts`

```typescript
export interface HandlerContext {
  projectPath?: string;
  macToken?: MacToken;
  developerId?: number;  // 新增
  appId?: number;        // 新增
  userId?: string;       // 新增
  tenantId?: string;     // 新增
}
```

### 3. 创建 ContextResolver（关键）

**文件：** `src/core/utils/contextResolver.ts`

集中处理所有上下文解析和优先级逻辑：

```typescript
export class ContextResolver {
  /**
   * 解析 App 上下文
   * 优先级：context（来自私有参数）> 缓存 > API
   */
  static async resolveAppContext(
    context: HandlerContext
  ): Promise<{ developerId: number; appId: number }> {
    // 优先使用 context
    if (context.developerId && context.appId) {
      return {
        developerId: context.developerId,
        appId: context.appId
      };
    }

    // Fallback: 缓存或 API
    const cached = readAppCache(context.projectPath);
    if (cached?.developer_id && cached?.app_id) {
      return {
        developerId: cached.developer_id,
        appId: cached.app_id
      };
    }

    const appInfo = await ensureAppInfo(context.projectPath, true, context);
    return {
      developerId: appInfo.developer_id!,
      appId: appInfo.app_id!
    };
  }
}
```

### 4. 简化业务层

**文件：** `src/features/leaderboard/api.ts` 等

```typescript
export async function listLeaderboards(
  params: ListParams,
  context?: HandlerContext
): Promise<Response> {
  const client = new HttpClient(context);

  // 一行解析所有上下文（简单！）
  const { developerId, appId } = await ContextResolver.resolveAppContext(
    context || {}
  );

  return client.get('/open/leaderboard/v1/list', {
    params: {
      developer_id: developerId.toString(),
      app_id: appId.toString(),
      ...
    }
  });
}
```

### 5. Server 层统一处理

**文件：** `src/server.ts`

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
  const { arguments: args } = request.params;

  // 从 HTTP Header 提取（可选）
  const headers = extra?.requestInfo?.headers;
  if (headers && !args._developer_id) {
    const devId = headers['x-taptap-developer-id'];
    const appId = headers['x-taptap-app-id'];
    if (devId) args._developer_id = parseInt(devId);
    if (appId) args._app_id = parseInt(appId);
  }

  // 提取到 context
  const effectiveContext = getEffectiveContext(args, baseContext);

  // 移除私有参数
  const businessArgs = stripPrivateParams(args);

  // 调用业务层
  await handler(businessArgs, effectiveContext);
});
```

## 优势总结

### 1. 对 Agent 透明
- Agent 只看到业务参数
- 不知道用户、租户、项目等基础设施

### 2. Proxy 管理上下文
- 每个 RuntimeContainer 的 Proxy 知道所有上下文
- 自动注入到每个请求

### 3. TapTap MCP 无状态
- 不存储任何数据
- 不依赖文件系统
- 可横向扩展
- 支持多租户

### 4. 高可维护性
- 优先级逻辑集中在 ContextResolver
- 业务层代码极简
- 易于扩展新的上下文字段

## 数据流

```
Agent
  ↓ create_leaderboard({ title: "xxx" })
MCP Proxy (RuntimeContainer)
  ↓ 注入：{ title, _mac_token, _developer_id, _app_id, _project_path, ... }
TapTap MCP Server
  ↓ 提取到 context
  ↓ 移除私有参数
  ↓ ContextResolver.resolveAppContext(context)
  ↓ handler({ title }, context)
API 调用
  ↓ HttpClient(context)
成功
```

## 实现清单

| 文件 | 变更 | 行数 |
|------|------|------|
| `privateParams.ts` | 新增字段 | +15 |
| `index.ts` (types) | 扩展 HandlerContext | +5 |
| `contextResolver.ts` | 新建统一解析器 | +80 |
| `handlerHelpers.ts` | 更新 getEffectiveContext | +10 |
| `server.ts` | 支持 HTTP Header（可选）| +20 |
| `leaderboard/api.ts` | 使用 ContextResolver | +10 |
| `app/api.ts` | 使用 ContextResolver | +10 |
| **总计** | | **~150 行** |

## 下一步

详见 GitHub Issue 或 PR，跟踪实现进度。
