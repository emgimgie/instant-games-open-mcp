/**
 * MCP Proxy 类型定义
 */

/**
 * MAC Token 结构
 */
export interface MacToken {
  kid: string;
  mac_key: string;
  token_type: 'mac';
  mac_algorithm: 'hmac-sha-1';
}

/**
 * Proxy 配置
 */
export interface ProxyConfig {
  /** TapTap MCP Server 地址 */
  serverUrl: string;

  /** Token 文件路径 */
  tokenFile: string;

  /** 项目 ID */
  projectId: string;

  /** 用户 ID */
  userId: string;

  /** 工作空间路径（默认 /workspace） */
  workspacePath: string;

  /** TapTap 环境（rnd 或 production） */
  env: 'rnd' | 'production';
}
