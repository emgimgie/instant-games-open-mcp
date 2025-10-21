/**
 * Environment Check Handlers
 * Handles environment variable checking and validation
 */

import { ApiConfig } from '../network/httpClient.js';

/**
 * Handler context for accessing environment variables
 */
export interface HandlerContext {
  projectPath?: string;
}

/**
 * Check environment configuration and authentication status
 */
export async function checkEnvironment(context: HandlerContext): Promise<string> {
  const apiConfig = ApiConfig.getInstance();
  const configStatus = apiConfig.getConfigStatus();
  const envInfo = {
    ...configStatus,
    'TAPTAP_PROJECT_PATH': context.projectPath ? '✅ 已配置' : '❌ 未配置 (可选)'
  };

  const envResult = Object.entries(envInfo)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  // Check if MAC Token is configured
  const hasMacToken = apiConfig.macToken.kid && apiConfig.macToken.mac_key;

  let statusMessage = '';
  if (hasMacToken) {
    statusMessage = '\n✅ 认证配置完整，可以使用所有功能';
  } else {
    statusMessage = '\n⚠️  MAC Token 未配置\n' +
                   '   📖 文档功能可用（Resources, Prompts, 搜索等）\n' +
                   '   🔐 管理功能需要授权（创建排行榜、列表等）\n' +
                   '   💡 首次调用管理工具时将自动触发 OAuth 授权流程';
  }

  return `🔧 环境配置检查结果:\n\n${envResult}${statusMessage}`;
}
