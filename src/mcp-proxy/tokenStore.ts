import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import type { MacToken } from './types.js';

/**
 * 基于文件的 Token 存储
 */
export class FileTokenStore {
  private tokenFile: string;

  constructor(tokenFile: string) {
    this.tokenFile = tokenFile;
  }

  /**
   * 获取 MAC Token
   */
  async get(): Promise<MacToken | null> {
    try {
      if (!this.has()) {
        return null;
      }

      const content = await readFile(this.tokenFile, 'utf-8');
      const token = JSON.parse(content) as MacToken;

      // 验证 Token 格式
      if (
        !token.kid ||
        !token.mac_key ||
        token.token_type !== 'mac' ||
        token.mac_algorithm !== 'hmac-sha-1'
      ) {
        console.error('[TokenStore] Invalid token format');
        return null;
      }

      return token;
    } catch (error) {
      console.error('[TokenStore] Failed to read token:', error);
      return null;
    }
  }

  /**
   * 检查 Token 文件是否存在
   */
  has(): boolean {
    return existsSync(this.tokenFile);
  }
}
