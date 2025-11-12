# TapCode 平台集成指南

本文档说明如何在 TapCode 平台中集成和部署 TapTap MCP Proxy。

## 架构概览

```
┌─────────────────────────────────────────────────────────┐
│ TapCode 平台服务器                                       │
│                                                         │
│  1. npm install @mikoto_zero/minigame-open-mcp         │
│  2. 生成 JSON 配置 + MAC Token                         │
│  3. 挂载 dist/mcp-proxy/ 到用户容器                    │
└─────────────────────────────────────────────────────────┘
           │
           │ Docker Volume Mount
           ↓
┌─────────────────────────────────────────────────────────┐
│ 用户容器（Runtime Container）                           │
│                                                         │
│  /workspace/user-123/project-456/  ← 用户代码（只读）   │
│  /srv/mcp-proxy/                   ← Proxy 代码（只读）  │
│    ├── index.js                                         │
│    ├── config.js                                        │
│    ├── proxy.js                                         │
│    └── types.js                                         │
│                                                         │
│  Claude Agent 启动 Proxy:                               │
│    node /srv/mcp-proxy/index.js '{"server":{...}}'     │
└─────────────────────────────────────────────────────────┘
           │
           │ HTTP/SSE
           ↓
┌─────────────────────────────────────────────────────────┐
│ TapTap MCP Server（独立部署）                           │
│  - 地址: http://host.docker.internal:5003              │
│  - 模式: SSE Streaming                                  │
└─────────────────────────────────────────────────────────┘
```

## 部署步骤

### 1. 安装 NPM 包

**方式 1：全局安装（推荐）**
```bash
npm install -g @mikoto_zero/minigame-open-mcp@latest
```

**方式 2：本地安装**
```bash
mkdir -p /opt/taptap-mcp
npm install --prefix /opt/taptap-mcp @mikoto_zero/minigame-open-mcp@latest
```

### 2. 获取 Proxy 文件路径

```typescript
import { execSync } from 'child_process';
import * as path from 'path';

// 方式 1：全局安装
const npmRoot = execSync('npm root -g').toString().trim();
const proxyPath = path.join(
  npmRoot,
  '@mikoto_zero/minigame-open-mcp/dist/mcp-proxy'
);
// 例如：/usr/local/lib/node_modules/@mikoto_zero/minigame-open-mcp/dist/mcp-proxy

// 方式 2：本地安装
const proxyPath = '/opt/taptap-mcp/node_modules/@mikoto_zero/minigame-open-mcp/dist/mcp-proxy';
```

### 3. 挂载到用户容器

```typescript
// Docker 挂载配置
const volumes = [
  // 只挂载 Proxy 部分（轻量、安全）
  `${proxyPath}:/srv/mcp-proxy:ro`,

  // 用户代码（可选，可以只读）
  `${userWorkspace}:/workspace:ro`,
];
```

### 4. 生成配置并启动 Proxy

```typescript
import { spawn } from 'child_process';

async function startMCPProxy(session: AgentSession) {
  // 1. 从数据库获取用户的 MAC Token
  const macToken = await db.tokens.findOne({
    user_id: session.userId,
    project_id: session.projectId,
  });

  if (!macToken) {
    throw new Error('MAC Token not found. User needs to authorize first.');
  }

  // 2. 生成 Proxy 配置
  const config = {
    server: {
      url: 'http://host.docker.internal:5003',
      env: process.env.NODE_ENV === 'production' ? 'production' : 'rnd',
    },
    tenant: {
      user_id: session.userId,
      project_id: session.projectId,
      workspace_path: '/workspace',
    },
    auth: {
      kid: macToken.kid,
      mac_key: macToken.mac_key,
      token_type: 'mac',
      mac_algorithm: 'hmac-sha-1',
    },
    options: {
      verbose: false,  // 生产环境关闭详细日志
      reconnect_interval: 5000,
      monitor_interval: 10000,
    },
  };

  // 3. 使用 MCP SDK 启动（推荐）
  const sessionResult = await connection.newSession({
    cwd: '/workspace',
    mcpServers: [
      {
        name: 'taptap',
        command: 'node',
        args: [
          '/srv/mcp-proxy/index.js',
          JSON.stringify(config)  // ✅ 配置通过命令行参数传递
        ],
      }
    ]
  });

  return sessionResult;
}
```

## 配置管理

### Token 数据库 Schema

```typescript
interface UserToken {
  user_id: string;
  project_id: string;
  kid: string;
  mac_key: string;
  token_type: 'mac';
  mac_algorithm: 'hmac-sha-1';
  created_at: Date;
  expires_at?: Date;
}
```

### 配置生成函数

```typescript
interface ProxyConfig {
  server: { url: string; env: 'rnd' | 'production' };
  tenant: { user_id: string; project_id: string; workspace_path: string };
  auth: { kid: string; mac_key: string; token_type: 'mac'; mac_algorithm: 'hmac-sha-1' };
  options?: { verbose?: boolean; reconnect_interval?: number; monitor_interval?: number };
}

function generateProxyConfig(
  session: AgentSession,
  macToken: UserToken,
  options?: { verbose?: boolean }
): ProxyConfig {
  return {
    server: {
      url: process.env.TAPTAP_MCP_SERVER_URL || 'http://host.docker.internal:5003',
      env: process.env.NODE_ENV === 'production' ? 'production' : 'rnd',
    },
    tenant: {
      user_id: session.userId,
      project_id: session.projectId,
      workspace_path: '/workspace',
    },
    auth: {
      kid: macToken.kid,
      mac_key: macToken.mac_key,
      token_type: macToken.token_type,
      mac_algorithm: macToken.mac_algorithm,
    },
    options: {
      verbose: options?.verbose ?? false,
      reconnect_interval: 5000,
      monitor_interval: 10000,
    },
  };
}
```

## 使用方式

### 方式 1：容器挂载（推荐，生产环境）

**优点**：
- ✅ 快速启动（无需下载）
- ✅ 所有容器共享同一份代码
- ✅ 更新方便（重新挂载即可）

**实现**：见上文第 3-4 步

---

### 方式 2：全局 CLI

```typescript
// 启动 Proxy
const config = generateProxyConfig(session, macToken);
const proxy = spawn('taptap-mcp-proxy', [JSON.stringify(config)], {
  stdio: ['pipe', 'pipe', 'pipe']
});

proxy.stderr.on('data', (data) => {
  console.log(`[Proxy ${session.projectId}] ${data}`);
});
```

**优点**：
- ✅ 简单直接
- ✅ 无需挂载

**缺点**：
- ⚠️ 需要容器内安装 NPM 包

---

### 方式 3：npx（开发/测试）

```typescript
const config = generateProxyConfig(session, macToken);
const proxy = spawn('npx', [
  '-y',  // 自动确认
  '-p', '@mikoto_zero/minigame-open-mcp',
  'taptap-mcp-proxy',
  JSON.stringify(config)
]);
```

**优点**：
- ✅ 无需安装
- ✅ 自动使用最新版本

**缺点**：
- ❌ 首次启动慢（下载包）
- ❌ 不适合生产环境

---

## 版本管理

### 推荐的版本策略

**Server 和 Proxy 使用相同版本号**：
- `1.4.0` - Server + Proxy 初始版本
- `1.4.1` - Proxy 配置重构 + Server 缓存优化
- `1.5.0` - 添加云存档功能（Server 新功能，Proxy 不变）

**语义化版本**：
- **Major（1.x.x）** - Breaking Changes（Server 或 Proxy 不兼容）
- **Minor（x.4.x）** - 新功能（向后兼容）
- **Patch（x.x.1）** - Bug 修复

### 更新流程

```bash
# TapCode 平台更新
npm update -g @mikoto_zero/minigame-open-mcp

# 或指定版本
npm install -g @mikoto_zero/minigame-open-mcp@1.5.0
```

## 文件大小

**完整包大小**：~2MB
- `dist/server.js` + 依赖：~1.5MB
- `dist/mcp-proxy/`：~500KB
- `dist/core/` + `dist/features/`：共享代码

**TapCode 只挂载 Proxy**：~500KB

## 目录结构

### NPM 包发布内容

```
@mikoto_zero/minigame-open-mcp/
├── dist/
│   ├── server.js              ← MCP Server 入口
│   ├── server.d.ts
│   ├── mcp-proxy/             ← MCP Proxy（TapCode 使用）
│   │   ├── index.js
│   │   ├── config.js
│   │   ├── proxy.js
│   │   ├── types.js
│   │   └── config.example.json
│   ├── core/                  ← 共享核心代码
│   │   ├── auth/
│   │   ├── network/
│   │   ├── utils/
│   │   └── types/
│   └── features/              ← 功能模块
│       ├── app/
│       ├── leaderboard/
│       └── h5Game/
├── bin/
│   ├── minigame-open-mcp      ← Server CLI
│   └── taptap-mcp-proxy       ← Proxy CLI
├── data/
│   └── leaderboard-api-docs.json
└── package.json
```

### TapCode 挂载内容

```
用户容器内：
/srv/mcp-proxy/      ← 只挂载这个目录
  ├── index.js
  ├── config.js
  ├── proxy.js
  └── types.js
```

## 最佳实践

### 1. 缓存 NPM 包

```typescript
// TapCode 平台启动时一次性安装
async function setupMCPProxy() {
  const version = '1.4.1';
  const installed = await checkPackageVersion('@mikoto_zero/minigame-open-mcp', version);

  if (!installed) {
    console.log('Installing MCP Proxy...');
    await exec(`npm install -g @mikoto_zero/minigame-open-mcp@${version}`);
  }

  return getProxyPath();
}

function getProxyPath(): string {
  const npmRoot = execSync('npm root -g').toString().trim();
  return path.join(npmRoot, '@mikoto_zero/minigame-open-mcp/dist/mcp-proxy');
}
```

### 2. 健康检查

```typescript
// 定期检查 Proxy 进程状态
proxy.on('exit', (code) => {
  console.error(`[Proxy ${projectId}] Exited with code ${code}`);

  if (code !== 0) {
    // 通知用户或重启
    notifyProxyFailure(session);
  }
});

proxy.stderr.on('data', (data) => {
  const log = data.toString();

  if (log.includes('Connected to TapTap MCP Server')) {
    console.log(`[Proxy ${projectId}] ✅ Connected`);
  } else if (log.includes('Fatal error')) {
    console.error(`[Proxy ${projectId}] ❌ Fatal error: ${log}`);
  }
});
```

### 3. 配置调试模式

```typescript
// 开发环境：启用详细日志
const config = generateProxyConfig(session, macToken, {
  verbose: process.env.NODE_ENV === 'development'
});
```

## 故障排查

### 问题 1：找不到 Proxy 文件

**症状**：
```
Error: Cannot find module '/srv/mcp-proxy/index.js'
```

**解决**：
```bash
# 检查挂载路径
docker exec <container> ls -la /srv/mcp-proxy/

# 检查 NPM 包安装
npm list -g @mikoto_zero/minigame-open-mcp
```

---

### 问题 2：配置格式错误

**症状**：
```
[Proxy] Fatal error: Invalid configuration:
- Missing required field: server.url
```

**解决**：
检查生成的配置 JSON 是否完整，打印配置到日志：
```typescript
console.log('Generated config:', JSON.stringify(config, null, 2));
```

---

### 问题 3：Token 无效

**症状**：
```
[Proxy] HTTP 403 - Authorization failed
```

**解决**：
- 检查数据库中的 Token 是否有效
- 验证 `kid` 和 `mac_key` 是否正确
- 确认 Token 未过期

---

## 性能优化

### 1. 预加载 NPM 包

```typescript
// TapCode 平台初始化时预安装
async function initializePlatform() {
  await exec('npm install -g @mikoto_zero/minigame-open-mcp@latest');
  console.log('✅ MCP Proxy ready');
}
```

### 2. 缓存挂载路径

```typescript
// 缓存 NPM 包路径，避免重复计算
class ProxyManager {
  private static proxyPath: string | null = null;

  static getProxyPath(): string {
    if (!this.proxyPath) {
      const npmRoot = execSync('npm root -g').toString().trim();
      this.proxyPath = path.join(
        npmRoot,
        '@mikoto_zero/minigame-open-mcp/dist/mcp-proxy'
      );
    }
    return this.proxyPath;
  }
}
```

### 3. 连接池（复用 MCP Server）

```
多个 Proxy 实例 → 单个 TapTap MCP Server
- Proxy 1 (Project A) ──┐
- Proxy 2 (Project B) ──┼─→ MCP Server (SSE)
- Proxy 3 (Project C) ──┘
```

---

## 安全考虑

### 1. Token 安全

**✅ Token 不落盘**：
- Token 通过命令行参数传递
- 仅在进程内存中
- 进程结束自动清理

**✅ 只读挂载**：
```typescript
volumes: [
  `${proxyPath}:/srv/mcp-proxy:ro`,  // :ro 防止篡改
]
```

### 2. 配置验证

```typescript
// 在启动前验证配置
function validateProxyConfig(config: ProxyConfig): void {
  if (!config.auth?.kid || !config.auth?.mac_key) {
    throw new Error('Invalid Token in config');
  }

  if (!config.server?.url) {
    throw new Error('Missing server URL');
  }
}

const config = generateProxyConfig(session, macToken);
validateProxyConfig(config);  // ✅ 先验证

const proxy = spawn('node', ['/srv/mcp-proxy/index.js', JSON.stringify(config)]);
```

---

## 监控和日志

### 1. 收集 Proxy 日志

```typescript
const logs: string[] = [];

proxy.stderr.on('data', (data) => {
  const log = data.toString();
  logs.push(`[${new Date().toISOString()}] ${log}`);

  // 实时推送到前端（可选）
  ws.send({ type: 'proxy-log', data: log });
});
```

### 2. 监控指标

```typescript
class ProxyMetrics {
  private metrics = new Map<string, {
    startTime: number;
    requestCount: number;
    errorCount: number;
    lastActivity: number;
  }>();

  trackRequest(projectId: string, success: boolean) {
    const metric = this.metrics.get(projectId)!;
    metric.requestCount++;
    if (!success) metric.errorCount++;
    metric.lastActivity = Date.now();
  }

  getStats(projectId: string) {
    const metric = this.metrics.get(projectId);
    if (!metric) return null;

    return {
      uptime: Date.now() - metric.startTime,
      requests: metric.requestCount,
      errors: metric.errorCount,
      successRate: (metric.requestCount - metric.errorCount) / metric.requestCount,
      lastActivity: new Date(metric.lastActivity),
    };
  }
}
```

---

## 示例代码

### 完整的 Agent Session 启动

```typescript
import { AgentClient } from '@agentclientprotocol/sdk';
import { execSync } from 'child_process';
import * as path from 'path';

class TapCodeAgentManager {
  private proxyPath: string;

  constructor() {
    // 初始化：获取 Proxy 路径
    const npmRoot = execSync('npm root -g').toString().trim();
    this.proxyPath = path.join(
      npmRoot,
      '@mikoto_zero/minigame-open-mcp/dist/mcp-proxy'
    );
  }

  async createSession(
    userId: string,
    projectId: string,
    macToken: UserToken
  ) {
    // 生成配置
    const config = {
      server: {
        url: 'http://host.docker.internal:5003',
        env: 'rnd',
      },
      tenant: {
        user_id: userId,
        project_id: projectId,
        workspace_path: '/workspace',
      },
      auth: macToken,
      options: {
        verbose: false,
      },
    };

    // 创建 Agent Session
    const client = new AgentClient({
      url: 'http://localhost:8080',
    });

    const connection = await client.connect();

    const session = await connection.newSession({
      cwd: '/workspace',
      mcpServers: [
        {
          name: 'taptap',
          command: 'node',
          args: [
            '/srv/mcp-proxy/index.js',
            JSON.stringify(config)
          ],
        }
      ],
      volumes: [
        `${this.proxyPath}:/srv/mcp-proxy:ro`,
        `${userWorkspace}:/workspace:ro`,
      ],
    });

    return session;
  }
}
```

---

## 相关文档

- [../src/mcp-proxy/README.md](../src/mcp-proxy/README.md) - MCP Proxy 详细说明
- [../src/mcp-proxy/config.example.json](../src/mcp-proxy/config.example.json) - 配置示例
- [MCP_PROXY_GUIDE.md](MCP_PROXY_GUIDE.md) - Proxy 开发指引
- [PRIVATE_PROTOCOL.md](PRIVATE_PROTOCOL.md) - 私有参数协议

---

## 常见问题

### Q: 是否需要安装两个包？

A: 不需要。`@mikoto_zero/minigame-open-mcp` 包含 Server 和 Proxy，TapCode 只需安装这一个包，然后只挂载 `dist/mcp-proxy/` 目录即可。

### Q: Proxy 和 Server 版本如何对应？

A: 使用相同的版本号。例如安装 `1.4.1` 版本，同时获得 `1.4.1` 的 Server 和 Proxy。

### Q: 如何更新 Proxy？

A: 更新 NPM 包即可：
```bash
npm update -g @mikoto_zero/minigame-open-mcp
```

### Q: 能否只下载 Proxy 部分？

A: 当前不支持。如果包大小成为问题，可以考虑拆分为两个独立的 NPM 包，但会增加维护成本。

---

**需要帮助？** 提交 Issue：https://github.com/taptap/minigame-open-mcp/issues
