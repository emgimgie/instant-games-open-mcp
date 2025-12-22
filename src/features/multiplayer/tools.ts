/**
 * Multiplayer Tools
 * Unified definitions and handlers for multiplayer functionality
 * 
 * TapTap 小游戏多人联机 SDK MCP 工具
 * 
 * 按实际使用流程组织：
 * 初始化和连接 → 匹配进入房间 → 游戏数据互通流转循环 → 退出房间
 */

import type { ToolRegistration } from '../../core/types/index.js';

import { multiplayerDocTools } from './docTools.js';

/**
 * Multiplayer Tools Registration
 * Each tool combines its definition and handler in one place
 */
export const multiplayerTools: (ToolRegistration & { requiresAuth?: boolean })[] = [
  // ⭐ 主入口工具
  {
    definition: {
      name: 'get_multiplayer_guide',
      description: '⭐ CALL THIS FIRST when user wants: players to play together/一起玩/两个人玩, add online/network features/联网功能/网络功能, players can see each other/互相看到对方, sync players/同步玩家/实时互动, multiplayer/多人联机/双人游戏/PVP/合作玩法/对战模式. Returns complete code template + usage examples. Primary entry!',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async () => {
      return multiplayerDocTools.getIntegrationWorkflow();
    },
    requiresAuth: false
  },

  // 📦 完整代码模板
  {
    definition: {
      name: 'get_code_template',
      description: 'Get complete MultiplayerManager.js template with built-in rate limiting. Copy-paste ready code for: initialization, event registration, room matching, data sync, room exit. Use when user wants implementation reference or needs reusable multiplayer class.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async () => {
      return multiplayerDocTools.getCompleteExample();
    },
    requiresAuth: false
  },

  // 📊 API-事件关系表
  {
    definition: {
      name: 'get_api_event_table',
      description: 'Get API-to-Event relationship table. Shows which events are triggered by which API calls and who receives them. CRITICAL for understanding: matchRoom vs playerEnterRoom, updatePlayerCustomProperties (all receive) vs sendCustomMessage (sender does not receive). Use when implementing event handling logic.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async () => {
      return multiplayerDocTools.getApiEventRelations();
    },
    requiresAuth: false
  },

  // 📝 通讯协议模板
  {
    definition: {
      name: 'get_protocol_template',
      description: 'Get communication protocol template for games with 4+ interaction types. Returns markdown template for generating protocol docs (docs/multiplayer-protocol.md) in user project. Use when team collaboration requires clear protocol definition.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async () => {
      return multiplayerDocTools.getProtocolTemplate();
    },
    requiresAuth: false
  },

  // 🔧 扩展 API 速查
  {
    definition: {
      name: 'get_extended_apis',
      description: '🟡 Get extended APIs quick reference: createRoom, getRoomList, joinRoom, kickRoomPlayer, disconnect, updatePlayerCustomStatus. ONLY use when user explicitly requests room list UI, custom room creation, friend invitation, or player kick functionality. These are OPTIONAL.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async () => {
      return multiplayerDocTools.getExtendedApis();
    },
    requiresAuth: false
  },

  // ====== 专题指南工具 ======

  // 🔑 玩家 ID 指南
  {
    definition: {
      name: 'get_player_id_guide',
      description: '🔑 Get Player ID usage guide: how to get local player ID from connect(), check "is this me?", handle field name differences (fromPlayerId/playerId/id). Use when implementing player identification logic or debugging player-related issues.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async () => {
      return multiplayerDocTools.getPlayerIdGuide();
    },
    requiresAuth: false
  },

  // 🎮 同步策略指南
  {
    definition: {
      name: 'get_sync_strategy',
      description: '🎮 Get synchronization strategy guide for joystick/WASD controls and click-based movement. Includes timer-based sync pattern (100ms interval) and change detection. Use when implementing position synchronization or continuous input handling.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async () => {
      return multiplayerDocTools.getSyncStrategy();
    },
    requiresAuth: false
  },

  // 📄 生成本地指南文档
  {
    definition: {
      name: 'generate_local_guide',
      description: '📄 Generate MULTIPLAYER_GUIDE.md for user project root. Creates persistent reference with API rate limits, playerId rules, data structures. Enables context persistence across conversations. Use at project start.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async () => {
      return multiplayerDocTools.generateLocalMultiplayerGuide();
    },
    requiresAuth: false
  },

  // 📊 API 数据结构
  {
    definition: {
      name: 'get_api_data_structures',
      description: '📊 Get complete API return value structures and event callback data structures. Includes all core APIs (connect, matchRoom, sendCustomMessage, etc) and events (playerEnterRoom, onCustomMessage, etc). Use when implementing API calls to avoid guessing data structures.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async () => {
      return multiplayerDocTools.getApiDataStructures();
    },
    requiresAuth: false
  },

  // 🎯 一键生成工具
  {
    definition: {
      name: 'generate_multiplayer_code',
      description: '🎯 One-click solution: Generate complete multiplayer files ready to save. Creates MultiplayerManager.js + MULTIPLAYER_GUIDE.md. Use when user wants quick setup or asks "generate multiplayer code/生成多人联机代码". Returns file paths and contents.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async () => {
      return multiplayerDocTools.generateMultiplayerCode();
    },
    requiresAuth: false
  },

  // 🔍 问题诊断工具
  {
    definition: {
      name: 'diagnose_multiplayer_issues',
      description: '🔍 Diagnose common multiplayer issues. Use when user reports: players not visible/看不到其他玩家, position not syncing/位置不同步, connection failed/连接失败, API errors. Returns detailed checklist and solutions. Extensible for future issue types.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async () => {
      return multiplayerDocTools.diagnoseIssues();
    },
    requiresAuth: false
  },

  // ✅ 代码检查工具
  {
    definition: {
      name: 'check_multiplayer_code',
      description: '✅ Check multiplayer code for common issues before deployment. Detects: missing rate limiting, wrong field names, missing playerId save, uninitialized players. Use before finalizing code or when debugging.',
      inputSchema: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'The multiplayer code to check'
          }
        },
        required: ['code']
      }
    },
    handler: async (args) => {
      return multiplayerDocTools.checkCode(args as { code: string });
    },
    requiresAuth: false
  }
];
