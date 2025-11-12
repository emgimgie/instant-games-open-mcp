# TapTap MCP Proxy

TapCode 的 MCP 代理实现，用于连接 AI Agent 和 TapTap MCP Server，自动注入 MAC Token 实现多租户隔离。

## 架构

```
User Space 容器内：
┌─────────────────────────────────┐
│ Claude Agent (主进程)            │
│   ↓ stdio (spawn 子进程)         │
│ MCP Proxy (子进程)               │
│   - 读取: Token 文件             │
│   - 注入: _mac_token             │
│   - 注入: _project_path          │
│   - 注入: _user_id               │
└──────────┬──────────────────────┘
           │ HTTP/SSE
           ↓
    TapTap MCP Server
    (独立服务)
```

## 核心功能

### 1. 透明代理
- **前端**：通过 stdio 暴露给 AI Agent
- **后端**：通过 HTTP/SSE 连接 TapTap MCP Server
- **转发**：tools/list, resources/list, resources/read, tools/call

### 2. 私有参数注入

在 `tools/call` 请求中自动注入：

```typescript
{
  ...originalArgs,
  _mac_token: {
    kid: "...",
    mac_key: "...",
    token_type: "mac",
    mac_algorithm: "hmac-sha-1"
  },
  _project_path: "userId/projectId",  // 租户隔离
  _user_id: "userId"
}
```

### 3. 自动重连

- 初始化时直接连接 TapTap Server
- 连接失败时后台自动重连
- 重连成功后发送 `notifications/tools/list_changed` 通知 Agent

## 配置方式

### 在 Claude.init.ts 中配置

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';

const q = query({
  prompt: 'Hello!',
  options: {
    mcpServers: {
      'taptap': {
        type: 'stdio',
        command: 'node',
        args: ['/srv/mcp-proxy/index.js'],
        env: {
          TAPTAP_SERVER_URL: 'http://host.docker.internal:5003',
          PROJECT_ID: projectId,
          USER_ID: userId,
          TOKEN_FILE: `/srv/db/tokens/${projectId}.json`,
          WORKSPACE_PATH: '/workspace',
          TDS_ENV: 'rnd'  // 或 'production'
        }
      }
    }
  }
});
```

### 在 Claude.client.ts 中配置

```typescript
import * as acp from '@agentclientprotocol/sdk/dist/acp.js';

const sessionResult = await connection.newSession({
  cwd: '/workspace',
  mcpServers: [
    {
      name: 'taptap',
      command: 'node',
      args: ['/srv/mcp-proxy/index.js'],
      env: [
        { name: 'TAPTAP_SERVER_URL', value: 'http://host.docker.internal:5003' },
        { name: 'PROJECT_ID', value: PROJECT_ID },
        { name: 'USER_ID', value: USER_ID },
        { name: 'TOKEN_FILE', value: `/srv/db/tokens/${PROJECT_ID}.json` },
        { name: 'WORKSPACE_PATH', value: '/workspace' },
        { name: 'TDS_ENV', value: 'rnd' }
      ]
    }
  ]
});
```

**注意**：两个 SDK 的 env 格式不同！
- `@anthropic-ai/claude-agent-sdk`: 对象格式 `{KEY: 'value'}`
- `@agentclientprotocol/sdk`: 数组格式 `[{name: 'KEY', value: 'value'}]`

## 环境变量

| 变量 | 必需 | 说明 | 示例 |
|------|------|------|------|
| `TAPTAP_SERVER_URL` | ✅ | TapTap MCP Server 地址 | `http://host.docker.internal:5003` |
| `PROJECT_ID` | ✅ | 项目 ID | `my-project-001` |
| `USER_ID` | ✅ | 用户 ID | `user123` |
| `TOKEN_FILE` | ✅ | MAC Token 文件路径 | `/srv/db/tokens/project.json` |
| `WORKSPACE_PATH` | ⚪ | 工作空间路径（默认 /workspace） | `/workspace` |
| `TDS_ENV` | ⚪ | TapTap 环境（默认 rnd） | `rnd` 或 `production` |

## Token 文件格式

Token 文件应包含有效的 MAC Token JSON：

```json
{
  "kid": "your_kid_here",
  "mac_key": "your_mac_key_here",
  "token_type": "mac",
  "mac_algorithm": "hmac-sha-1"
}
```

**获取 Token**：
- 通过 TapTap OAuth 设备流程授权获取
- 保存在数据库或文件系统中
- Proxy 启动前必须已存在

## 租户隔离

Proxy 通过 `_project_path` 实现租户隔离：

```typescript
// 计算规则
const _project_path = `${userId}/${projectId}`;

// 示例
userId = "user-a"
projectId = "project-1"
_project_path = "user-a/project-1"
```

TapTap MCP Server 会将缓存文件保存到对应路径，确保不同租户的数据隔离。

## 错误处理

### 连接失败

如果无法连接 TapTap Server：

```
Error: TapTap MCP Server is currently unavailable.
The proxy is attempting to reconnect.
Please try again in a few moments.
```

Proxy 会在后台自动重连。

### Token 缺失

如果 Token 文件不存在：

```
Error: MAC Token not found.
Please authorize your TapTap account first.
```

需要先完成授权流程。

### Token 无效

如果 Token 过期或无效，会收到 TapTap Server 返回的原始错误（403 等），Proxy 不做处理。

## 日志

Proxy 的日志输出到 stderr：

```
[Proxy] Starting...
[Proxy] Project: my-project
[Proxy] User: user123
[Proxy] Token: /srv/db/tokens/my-project.json
[Proxy] Connecting to http://host.docker.internal:5003...
[Proxy] ✅ Connected to TapTap MCP Server
[Proxy] Started (stdio mode)
[Proxy] Tool call: list_developers_and_apps
[Proxy] Injected: _mac_token (kid: abc123...)
[Proxy] Injected: _project_path = user123/my-project
```

## 编译

Proxy 代码会随主项目编译：

```bash
pnpm build
# 输出: dist/mcp-proxy/index.cjs
```

编译配置在 `tsup.config.ts` 中：

```typescript
CONFIG.entry = {
  'mcp-proxy/index': 'src/mcp-proxy/index.ts',
  // ...
};
CONFIG.noExternal = [
  '@modelcontextprotocol/sdk',
  'eventsource-parser',
  // ...
];
```

## 部署

Proxy 文件需要挂载到用户空间容器：

```typescript
// 在 src/lib/docker.ts 中
vols.push(`${local_dist}/mcp-proxy/index.cjs:/srv/mcp-proxy/index.js:ro`);
```

## 工作流程

### 初始化流程

1. Agent 启动
2. 读取 MCP 配置，发现 stdio 类型的 `taptap` server
3. spawn Proxy 子进程
4. Proxy 读取环境变量，连接 TapTap Server
5. Agent 调用 `tools/list` 获取工具列表
6. Proxy 转发请求，返回工具列表
7. 初始化完成

### 工具调用流程

1. Agent 调用工具（如 `list_developers_and_apps`）
2. Agent 通过 stdio 发送请求给 Proxy
3. Proxy 读取 Token 文件
4. Proxy 注入私有参数：
   - `_mac_token`
   - `_project_path = userId/projectId`
   - `_user_id`
5. Proxy 转发到 TapTap Server（HTTP/SSE）
6. TapTap Server 处理并返回结果
7. Proxy 透传响应给 Agent
8. Agent 收到结果

### 重连流程

1. Proxy 检测到连接断开
2. 后台自动尝试重连
3. 重连成功
4. 发送 `notifications/tools/list_changed` 给 Agent
5. Agent 自动重新获取工具列表

## 注意事项

1. **Token 管理**：Proxy 不处理授权流程，Token 应在 Proxy 启动前准备好
2. **错误透传**：Proxy 不处理业务错误，直接返回给 Agent
3. **进程生命周期**：Proxy 随 Agent 启动和结束
4. **一对一绑定**：每个 Agent 对应一个 Proxy 进程
5. **环境隔离**：通过环境变量传递配置，实现租户隔离

## 相关文档

- [PRIVATE_PROTOCOL.md](../../taptap-minigame-mcp-server/docs/PRIVATE_PROTOCOL.md) - 私有参数协议
- [MCP_PROXY_GUIDE.md](../../taptap-minigame-mcp-server/docs/MCP_PROXY_GUIDE.md) - Proxy 开发指引
