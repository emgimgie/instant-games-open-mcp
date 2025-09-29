#!/usr/bin/env node

/**
 * TapTap 小游戏开发文档 MCP 服务器 - Node.js 版本
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
  Tool
} from '@modelcontextprotocol/sdk/types.js';

// 导入工具处理器
import { authTools } from './tools/authTools.js';
import { cloudSaveTools } from './tools/cloudSaveTools.js';
import { leaderboardTools } from './tools/leaderboardTools.js';
import { sdkTools } from './tools/sdkTools.js';

/**
 * MCP 服务器类
 */
class TapTapDocsMCPServer {
  private server: Server;
  private tools: Tool[] = [];
  private toolHandlers: Map<string, (args: any) => Promise<string>> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: 'taptap-docs-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupTools();
    this.setupHandlers();
  }

  /**
   * 设置所有工具定义
   */
  private setupTools(): void {
    this.tools = [
      // 🔐 认证工具
      {
        name: 'search_auth_docs',
        description: '搜索 TapTap 认证相关文档（OAuth、API Key、令牌管理）',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: '搜索关键词，如：认证、授权、登录、令牌等'
            },
            category: {
              type: 'string',
              description: '认证分类',
              enum: ['oauth', 'api_key', 'token_management']
            }
          }
        }
      },
      {
        name: 'get_auth_methods',
        description: '获取所有 TapTap 认证方式概览',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_auth_category_docs',
        description: '获取指定认证分类的详细文档和代码示例',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: '认证分类名称',
              enum: ['oauth', 'api_key', 'token_management']
            }
          },
          required: ['category']
        }
      },

      // ☁️ 云存档工具
      {
        name: 'search_cloud_save_docs',
        description: '搜索 TapTap 云存档相关文档（同步、备份、冲突处理）',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: '搜索关键词，如：云存档、同步、备份等'
            },
            category: {
              type: 'string',
              description: '云存档功能分类',
              enum: ['basic_operations', 'advanced_features', 'best_practices']
            }
          }
        }
      },
      {
        name: 'get_cloud_save_overview',
        description: '获取 TapTap 云存档功能概览',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_cloud_save_category_docs',
        description: '获取指定云存档分类的详细文档和 API 示例',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: '云存档分类名称',
              enum: ['basic_operations', 'advanced_features', 'best_practices']
            }
          },
          required: ['category']
        }
      },

      // 🏆 排行榜工具
      {
        name: 'search_leaderboard_docs',
        description: '搜索 TapTap 排行榜相关文档（分数提交、排名查询、界面显示）',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: '搜索关键词，如：排行榜、分数、排名等'
            },
            category: {
              type: 'string',
              description: '排行榜功能分类',
              enum: ['score_submission', 'ranking_query', 'leaderboard_ui']
            }
          }
        }
      },
      {
        name: 'get_leaderboard_overview',
        description: '获取 TapTap 排行榜功能概览',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_leaderboard_category_docs',
        description: '获取指定排行榜分类的详细文档',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: '排行榜分类名称',
              enum: ['score_submission', 'ranking_query', 'leaderboard_ui']
            }
          },
          required: ['category']
        }
      },
      {
        name: 'get_leaderboard_patterns',
        description: '获取排行榜集成模式和最佳实践',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },

      // 🔧 SDK 工具
      {
        name: 'search_sdk_docs',
        description: '搜索 TapTap SDK 集成相关文档（Unity、Cocos、Web）',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: '搜索关键词，如：SDK、集成、Unity、Cocos等'
            },
            platform: {
              type: 'string',
              description: '开发平台',
              enum: ['unity', 'cocos', 'web']
            }
          }
        }
      },
      {
        name: 'get_sdk_platforms',
        description: '获取支持的 SDK 平台列表',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_sdk_platform_docs',
        description: '获取指定平台的 SDK 集成指南',
        inputSchema: {
          type: 'object',
          properties: {
            platform: {
              type: 'string',
              description: '开发平台名称',
              enum: ['unity', 'cocos', 'web']
            }
          },
          required: ['platform']
        }
      },
      {
        name: 'get_sdk_best_practices',
        description: '获取 SDK 集成的最佳实践',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ];
  }

  /**
   * 设置工具处理器
   */
  private setupHandlers(): void {
    // 认证工具处理器
    this.toolHandlers.set('search_auth_docs', authTools.searchAuthDocs);
    this.toolHandlers.set('get_auth_methods', authTools.getAuthMethods);
    this.toolHandlers.set('get_auth_category_docs', authTools.getAuthCategoryDocs);

    // 云存档工具处理器
    this.toolHandlers.set('search_cloud_save_docs', cloudSaveTools.searchCloudSaveDocs);
    this.toolHandlers.set('get_cloud_save_overview', cloudSaveTools.getCloudSaveOverview);
    this.toolHandlers.set('get_cloud_save_category_docs', cloudSaveTools.getCloudSaveCategoryDocs);

    // 排行榜工具处理器
    this.toolHandlers.set('search_leaderboard_docs', leaderboardTools.searchLeaderboardDocs);
    this.toolHandlers.set('get_leaderboard_overview', leaderboardTools.getLeaderboardOverview);
    this.toolHandlers.set('get_leaderboard_category_docs', leaderboardTools.getLeaderboardCategoryDocs);
    this.toolHandlers.set('get_leaderboard_patterns', leaderboardTools.getLeaderboardPatterns);

    // SDK 工具处理器
    this.toolHandlers.set('search_sdk_docs', sdkTools.searchSDKDocs);
    this.toolHandlers.set('get_sdk_platforms', sdkTools.getSDKPlatforms);
    this.toolHandlers.set('get_sdk_platform_docs', sdkTools.getSDKPlatformDocs);
    this.toolHandlers.set('get_sdk_best_practices', sdkTools.getSDKBestPractices);

    // 设置 MCP 服务器处理器
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.tools
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const handler = this.toolHandlers.get(name);
      if (!handler) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `未知工具: ${name}`
        );
      }

      try {
        const result = await handler(args || {});
        return {
          content: [
            {
              type: 'text',
              text: result
            }
          ]
        };
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `工具执行失败: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  /**
   * 启动服务器
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.error('🚀 TapTap 文档 MCP 服务器已启动');
    console.error(`📚 提供 ${this.tools.length} 个文档工具`);
    console.error('🔧 支持功能: 认证、云存档、排行榜、SDK集成');
  }
}

// 启动服务器
async function main(): Promise<void> {
  const server = new TapTapDocsMCPServer();

  // 处理优雅关闭
  process.on('SIGINT', () => {
    console.error('\\n📴 收到中断信号，正在关闭服务器...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.error('\\n📴 收到终止信号，正在关闭服务器...');
    process.exit(0);
  });

  try {
    await server.start();
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ 服务器运行失败:', error);
    process.exit(1);
  });
}