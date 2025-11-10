# MCP Server Private Parameter Protocol

## 概述

本文档描述 TapTap Minigame MCP Server 与 MCP Proxy 之间的**私有参数协议**（Private Parameter Protocol）。

这个协议允许 MCP Proxy 向工具调用注入额外的认证和元数据参数，而这些参数**不会出现在工具的公开定义中**，对 AI Agent 完全透明。

## 🎯 设计目标

1. **对 AI Agent 透明**：AI Agent 只看到业务参数，不需要关心认证细节
2. **多账号支持**：不同的工具调用可以使用不同的 MAC Token
3. **灵活扩展**：支持添加更多私有参数（用户ID、会话ID等）
4. **安全性**：私有参数在日志中自动脱敏
5. **向后兼容**：不影响现有的 OAuth 认证流程

## 📝 私有参数规范

所有私有参数使用**下划线前缀** (`_`) 来区分业务参数。

### 支持的私有参数

| 参数名 | 类型 | 描述 | 优先级 |
|--------|------|------|--------|
| `_mac_token` | `MacToken` | 用户认证 Token | 高（覆盖 context 和全局） |
| `_user_id` | `string` | 多租户用户标识 | - |
| `_session_id` | `string` | 请求追踪和调试 | - |

### MacToken 类型定义

```typescript
interface MacToken {
  kid: string;          // MAC key identifier
  mac_key: string;      // MAC key for signing
  token_type: "mac";    // Token type
  mac_algorithm: "hmac-sha-1"; // MAC algorithm
}
```

## 🔄 工作流程

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   AI Agent  │────────▶│  MCP Proxy  │────────▶│ MCP Server  │
│  (Claude)   │ Call A  │ (Injector)  │ Call B  │  (TapTap)   │
└─────────────┘         └─────────────┘         └─────────────┘
                             │
                             │ 注入 _mac_token
                             ▼
                        ┌─────────────┐
                        │ MAC Token   │
                        │   Store     │
                        └─────────────┘

Call A (Agent → Proxy):
{
  "name": "list_leaderboards",
  "arguments": {
    "page": 1
  }
}

Call B (Proxy → Server):
{
  "name": "list_leaderboards",
  "arguments": {
    "page": 1,
    "_mac_token": {
      "kid": "abc123",
      "mac_key": "secret",
      "token_type": "mac",
      "mac_algorithm": "hmac-sha-1"
    }
  }
}
```

## 💉 注入方式

### 方式 1：直接参数注入（推荐）

MCP Proxy 直接在 `arguments` 中注入私有参数：

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "list_leaderboards",
    "arguments": {
      "page": 1,
      "_mac_token": {
        "kid": "abc123",
        "mac_key": "secret_key",
        "token_type": "mac",
        "mac_algorithm": "hmac-sha-1"
      },
      "_user_id": "user_12345",
      "_session_id": "session_xyz"
    }
  }
}
```

### 方式 2：HTTP Header 注入

在 HTTP/SSE 模式下，可以通过 HTTP Headers 注入：

```http
POST / HTTP/1.1
Host: localhost:3000
Content-Type: application/json
X-TapTap-Mac-Token: eyJraWQiOiJhYmMxMjMiLCJtYWNfa2V5Ijoic2VjcmV0In0=
X-TapTap-User-Id: user_12345
Mcp-Session-Id: session_xyz

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "list_leaderboards",
    "arguments": {
      "page": 1
    }
  }
}
```

**Header 格式说明：**

- `X-TapTap-Mac-Token`: Base64 编码的 MAC Token JSON（也支持直接传 JSON 字符串）
- `X-TapTap-User-Id`: 用户ID（纯字符串）
- `Mcp-Session-Id`: 会话ID（使用 MCP 标准 header）

**Base64 编码示例：**

```bash
# 原始 MAC Token
{
  "kid": "abc123",
  "mac_key": "secret",
  "token_type": "mac",
  "mac_algorithm": "hmac-sha-1"
}

# Base64 编码后
eyJraWQiOiJhYmMxMjMiLCJtYWNfa2V5Ijoic2VjcmV0IiwidG9rZW5fdHlwZSI6Im1hYyIsIm1hY19hbGdvcml0aG0iOiJobWFjLXNoYTEifQ==
```

## 🔐 认证优先级

当存在多个 MAC Token 来源时，按以下优先级选择：

```
1. arguments._mac_token  (最高优先级，来自 Proxy 注入)
   ↓
2. context.macToken      (来自环境变量或 OAuth)
   ↓
3. global ApiConfig      (全局配置)
```

**示例：**

```typescript
// 场景1: Proxy 注入 Token
const args = {
  page: 1,
  _mac_token: { kid: "proxy_token", ... }
};
// 使用: proxy_token

// 场景2: 仅 Context Token
const args = { page: 1 };
const context = { macToken: { kid: "context_token", ... } };
// 使用: context_token

// 场景3: 仅全局 Token
const args = { page: 1 };
const context = {};
// 使用: ApiConfig.getInstance().macToken
```

## 🛡️ 安全性

### 1. 日志脱敏

所有私有参数在日志中自动脱敏：

```typescript
// 原始参数
{
  page: 1,
  _mac_token: { kid: "abc", mac_key: "secret" },
  _user_id: "user123"
}

// 日志中显示
{
  page: 1
  // 私有参数已被移除
}
```

### 2. JSON Schema 验证

- 私有参数**不在** `inputSchema.properties` 中声明
- 默认 `additionalProperties` 为 `true`，允许额外参数通过
- AI Agent 看到的工具定义不包含私有参数

### 3. TypeScript 类型安全

```typescript
import type { PrivateToolParams } from '../../core/types/privateParams.js';

// Handler 类型定义
handler: async (
  args: { page: number } & PrivateToolParams,  // TypeScript 知道私有参数存在
  context
) => {
  // args._mac_token 可以安全访问
}
```

## 📚 实现示例

### Tool Definition（对外）

```typescript
{
  definition: {
    name: 'list_leaderboards',
    description: 'List all leaderboards',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number' }
        // 不声明 _mac_token
      }
    }
  },
  handler: async (
    args: { page: number } & PrivateToolParams,
    context
  ) => {
    // 使用 getEffectiveContext 自动处理优先级
    return leaderboardHandlers.listLeaderboards(
      args,
      getEffectiveContext(args, context)
    );
  }
}
```

### MCP Proxy 示例代码

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

class MCPProxy {
  private tokenStore: Map<string, MacToken>;

  async handleToolCall(request: any) {
    const { name, arguments: args } = request.params;

    // 从 token store 获取用户的 MAC Token
    const userId = extractUserId(request); // 从 session/auth 提取
    const macToken = this.tokenStore.get(userId);

    // 注入私有参数
    const enrichedArgs = {
      ...args,
      _mac_token: macToken,
      _user_id: userId,
      _session_id: request.sessionId
    };

    // 转发到真实的 MCP Server
    return this.mcpClient.request({
      method: 'tools/call',
      params: {
        name,
        arguments: enrichedArgs
      }
    });
  }
}
```

## 🧪 测试验证

### 测试 1：直接参数注入

```bash
# 使用 curl 测试
curl -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "list_leaderboards",
      "arguments": {
        "page": 1,
        "_mac_token": {
          "kid": "test_kid",
          "mac_key": "test_key",
          "token_type": "mac",
          "mac_algorithm": "hmac-sha-1"
        }
      }
    }
  }'
```

### 测试 2：HTTP Header 注入

```bash
# Base64 编码 token
TOKEN=$(echo -n '{"kid":"test","mac_key":"key","token_type":"mac","mac_algorithm":"hmac-sha-1"}' | base64)

# 发送请求
curl -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -H "X-TapTap-Mac-Token: $TOKEN" \
  -H "X-TapTap-User-Id: user_test" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "list_leaderboards",
      "arguments": { "page": 1 }
    }
  }'
```

### 测试 3：验证日志脱敏

```bash
# 启用详细日志
export TDS_MCP_VERBOSE=true
export TDS_MCP_TRANSPORT=sse
export TDS_MCP_PORT=3000
npm start

# 发送包含私有参数的请求
# 检查日志输出，确认私有参数不会显示
```

## 🔧 故障排查

### 问题 1：私有参数未生效

**症状：** `_mac_token` 注入后仍使用全局 Token

**排查步骤：**
1. 检查参数格式是否正确（必须包含 `kid`, `mac_key` 等字段）
2. 检查 TypeScript 类型定义是否包含 `& PrivateToolParams`
3. 检查 handler 是否使用 `getEffectiveContext(args, context)`

### 问题 2：日志中显示敏感信息

**症状：** 日志中看到完整的 `_mac_token`

**排查步骤：**
1. 确认使用的是 `logger.logToolCall()` 而不是 `console.log()`
2. 检查 `stripPrivateParams()` 是否正确导入
3. 验证 `logToolCall` 调用顺序（应在 `mergePrivateParams` 之后）

### 问题 3：HTTP Header 注入失败

**症状：** 从 header 注入的 token 未被识别

**排查步骤：**
1. 确认使用的是 HTTP/SSE 模式（`TDS_MCP_TRANSPORT=sse` 或 `http`）
2. 检查 header 名称是否正确（`X-TapTap-Mac-Token`）
3. 验证 Base64 编码是否正确（可以先尝试不编码，直接传 JSON）

## 📖 相关文档

- [README.md](README.md) - 用户文档和使用说明
- [CLAUDE.md](CLAUDE.md) - 开发指南和架构说明
- [src/core/types/privateParams.ts](src/core/types/privateParams.ts) - 类型定义
- [src/core/utils/handlerHelpers.ts](src/core/utils/handlerHelpers.ts) - Helper 函数

## 🤝 贡献

如果需要添加新的私有参数：

1. 在 `PrivateToolParams` 接口中添加类型定义
2. 更新 `extractPrivateParams()` 和 `stripPrivateParams()` 函数
3. 在 `server.ts` 的 `extractPrivateParamsFromHeaders()` 中添加 header 支持
4. 更新本文档

## ⚠️ 重要提醒

- **私有参数协议是内部约定**：不是 MCP 标准的一部分
- **仅用于受信任的 Proxy**：不应在不受信任的环境中使用
- **定期更新 Token**：建议 MAC Token 有过期时间并定期轮换
- **监控异常**：记录所有私有参数注入行为，便于审计
