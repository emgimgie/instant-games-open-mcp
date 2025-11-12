#!/usr/bin/env node

/**
 * TapTap MCP Proxy - stdio 模式
 *
 * 作为 Claude Agent 的子进程运行，通过 stdio 通信
 * 连接到 TapTap MCP Server，自动注入 MAC Token
 */

import { TapTapMCPProxy } from './proxy.js';
import type { ProxyConfig } from './types.js';

/**
 * 从环境变量读取配置
 */
function loadConfig(): ProxyConfig {
  const serverUrl = process.env.TAPTAP_SERVER_URL;
  const tokenFile = process.env.TOKEN_FILE;
  const projectId = process.env.PROJECT_ID;
  const userId = process.env.USER_ID;

  // 验证必需参数
  if (!serverUrl) {
    console.error('[Proxy] Error: TAPTAP_SERVER_URL is required');
    process.exit(1);
  }
  if (!tokenFile) {
    console.error('[Proxy] Error: TOKEN_FILE is required');
    process.exit(1);
  }
  if (!projectId) {
    console.error('[Proxy] Error: PROJECT_ID is required');
    process.exit(1);
  }
  if (!userId) {
    console.error('[Proxy] Error: USER_ID is required');
    process.exit(1);
  }

  const config: ProxyConfig = {
    serverUrl,
    tokenFile,
    projectId,
    userId,
    workspacePath: process.env.WORKSPACE_PATH || '/workspace',
    env: (process.env.TDS_ENV === 'production' ? 'production' : 'rnd') as 'rnd' | 'production',
  };

  return config;
}

/**
 * 主函数
 */
async function main() {
  try {
    // 1. 加载配置
    const config = loadConfig();

    // 2. 创建并启动 Proxy
    const proxy = new TapTapMCPProxy(config);
    await proxy.start();

    // 3. 处理进程信号
    process.on('SIGINT', () => {
      console.error('[Proxy] Received SIGINT, exiting...');
      proxy.cleanup();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.error('[Proxy] Received SIGTERM, exiting...');
      proxy.cleanup();
      process.exit(0);
    });
  } catch (error) {
    console.error('[Proxy] Fatal error:', error);
    process.exit(1);
  }
}

// 启动
main();
