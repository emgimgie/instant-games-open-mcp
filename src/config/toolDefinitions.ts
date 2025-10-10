/**
 * MCP Tool Definitions
 * Centralized tool definitions for the MCP server
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * Get all tool definitions
 */
export function getToolDefinitions(): Tool[] {
  return [
    // 🎯 Workflow Guidance Tool
    {
      name: 'start_leaderboard_integration',
      description: `START HERE when user asks about integrating leaderboards, implementing rankings, or "接入排行榜".

This tool guides the complete leaderboard integration workflow:
1. Check if leaderboards already exist on server
2. Guide user to create one if needed (server-side only, via this MCP tool)
3. Provide client-side implementation code and docs

IMPORTANT: TapTap leaderboard integration does NOT require npm packages or external JS SDKs!
- Client code uses the global 'tap' object (provided by TapTap runtime)
- Access via: tap.getLeaderboardManager()
- No imports or dependencies needed
- Works directly in TapTap minigame environment

Use this as the first step for any leaderboard integration request.`,
      inputSchema: {
        type: 'object',
        properties: {
          purpose: {
            type: 'string',
            description: 'What the user wants to do with leaderboards (optional, for context)'
          }
        }
      }
    },

    // 📖 Core LeaderboardManager API Documentation Tools (one tool per API)
    {
      name: 'get_leaderboard_manager',
      description: 'Get documentation for tap.getLeaderboardManager() - how to obtain the LeaderboardManager instance. Use this when user asks how to initialize or access the leaderboard system.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'open_leaderboard',
      description: 'Get documentation for leaderboardManager.openLeaderboard() - how to display the TapTap leaderboard UI. Use this when user wants to show leaderboard interface to players.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'submit_scores',
      description: 'Get documentation for leaderboardManager.submitScores() - how to submit player scores to leaderboards. Use this when user wants to upload scores or update rankings.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'load_leaderboard_scores',
      description: 'Get documentation for leaderboardManager.loadLeaderboardScores() - how to retrieve paginated leaderboard data. Use this when user wants to fetch top scores or implement custom leaderboard UI.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'load_current_player_score',
      description: 'Get documentation for leaderboardManager.loadCurrentPlayerLeaderboardScore() - how to get current player\'s score and rank. Use this when user wants to show player their own ranking.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'load_player_centered_scores',
      description: 'Get documentation for leaderboardManager.loadPlayerCenteredScores() - how to load scores of players near current user. Use this when user wants to display surrounding competitors.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },

    // 🔍 Helper Tools
    {
      name: 'search_leaderboard_docs',
      description: 'Search all leaderboard documentation by keyword. Use this when user asks a general question or you\'re not sure which specific API they need.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search keyword, such as: leaderboard, score, ranking, submission, etc.'
          }
        },
        required: ['query']
      }
    },
    {
      name: 'get_leaderboard_overview',
      description: 'Get comprehensive overview of all TapTap leaderboard APIs and features. Use this when user wants to understand what leaderboard functionality is available.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'get_leaderboard_patterns',
      description: 'Get complete implementation examples and best practices for leaderboards. Use this when user wants to see full integration code or common usage patterns.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },

    // 🔧 Environment Check Tool
    {
      name: 'check_environment',
      description: 'Check environment configuration and user authentication status. Use this to verify if TAPTAP_MAC_TOKEN and TAPTAP_CLIENT_ID are configured.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },

    // 📱 Developer & App Management Tools
    {
      name: 'list_developers_and_apps',
      description: 'List all developers and their apps/games for the current user. Use this when multiple developers or apps exist and you need to let user/AI choose which one to use.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'select_app',
      description: 'Select a specific developer and app to use for subsequent operations. This will cache the selection. Use this after listing developers and apps with list_developers_and_apps.',
      inputSchema: {
        type: 'object',
        properties: {
          developer_id: {
            type: 'number',
            description: 'Developer ID to select (required)'
          },
          app_id: {
            type: 'number',
            description: 'App/Game ID to select (required)'
          }
        },
        required: ['developer_id', 'app_id']
      }
    },

    // ⚙️ Leaderboard Management Tools (requires TAPTAP_MAC_TOKEN, TAPTAP_CLIENT_ID, TAPTAP_CLIENT_SECRET)
    {
      name: 'create_leaderboard',
      description: `Create a new leaderboard on TapTap server. Use this AFTER checking existing leaderboards with list_leaderboards.

⚠️ CRITICAL: ALL enum values CANNOT be 0 (0 = UNSPECIFIED/invalid)! Use values 1-4 only!

Required parameters (MUST provide all 5 with VALID values):
1. title: Leaderboard name/title (string)
2. period_type: MUST be 1-4 (DO NOT use 0!)
   - 1=Always/永久, 2=Daily/每天, 3=Weekly/每周, 4=Monthly/每月
3. score_type: MUST be 1-2 (DO NOT use 0!)
   - 1=Integer/数值型, 2=Time/时间型
4. score_order: MUST be 1-2 (DO NOT use 0!)
   - 1=Descending/降序(higher better), 2=Ascending/升序(lower better)
5. calc_type: MUST be 1-3 (DO NOT use 0!)
   - 1=Sum/累计分, 2=Best/最佳分, 3=Latest/最新分

Example configurations:
- High score game: period_type=3, score_type=1, score_order=1, calc_type=2
- Racing game: period_type=3, score_type=2, score_order=2, calc_type=2
- Cumulative points: period_type=1, score_type=1, score_order=1, calc_type=1

Auto-fetches developer_id and app_id if not provided. Returns leaderboard_id for client-side APIs.`,
      inputSchema: {
        type: 'object',
        properties: {
          developer_id: {
            type: 'number',
            description: 'Developer ID (optional, auto-fetched from /level/v1/list API if not provided)'
          },
          app_id: {
            type: 'number',
            description: 'Application/Game ID (optional, auto-fetched from /level/v1/list API if not provided)'
          },
          title: {
            type: 'string',
            description: 'Leaderboard title/name, e.g., "Weekly High Score", "Best Time Trial" (REQUIRED)'
          },
          period_type: {
            type: 'number',
            description: 'Reset period (CANNOT be 0!): 1=Always/永久, 2=Daily/每天, 3=Weekly/每周, 4=Monthly/每月 (REQUIRED, must be 1-4)',
            enum: [1, 2, 3, 4]
          },
          score_type: {
            type: 'number',
            description: 'Score data type (CANNOT be 0!): 1=Integer/数值型 (points, kills), 2=Time/时间型 (milliseconds) (REQUIRED, must be 1 or 2)',
            enum: [1, 2]
          },
          score_order: {
            type: 'number',
            description: 'Ranking order (CANNOT be 0!): 1=Descending/降序 (higher is better, e.g., points), 2=Ascending/升序 (lower is better, e.g., time) (REQUIRED, must be 1 or 2)',
            enum: [1, 2]
          },
          calc_type: {
            type: 'number',
            description: 'Score calculation method (CANNOT be 0!): 1=Sum/累计分 (add all), 2=Best/最佳分 (keep best), 3=Latest/最新分 (keep latest) (REQUIRED, must be 1-3)',
            enum: [1, 2, 3]
          },
          display_limit: {
            type: 'number',
            description: 'Maximum number of entries to display in leaderboard UI (optional, default 100, range 1-1000)'
          },
          period_time: {
            type: 'string',
            description: 'Daily/weekly/monthly reset time in HH:MM:SS format, e.g., "00:00:00" for midnight (optional, only for period_type 0/1/2)'
          },
          score_unit: {
            type: 'string',
            description: 'Unit text displayed with score, e.g., "分" (points), "秒" (seconds), "kills" (optional)'
          }
        },
        required: ['title', 'period_type', 'score_type', 'score_order', 'calc_type']
      }
    },
    {
      name: 'list_leaderboards',
      description: 'List all leaderboards created for the current app/game. Use this to check existing leaderboards before creating new ones or when user asks "我有哪些排行榜" or wants to see leaderboard IDs. Auto-fetches developer_id and app_id if not provided.',
      inputSchema: {
        type: 'object',
        properties: {
          developer_id: {
            type: 'number',
            description: 'Developer ID (optional, will be auto-fetched if not provided)'
          },
          app_id: {
            type: 'number',
            description: 'Application/Game ID (optional, will be auto-fetched if not provided)'
          },
          page: {
            type: 'number',
            description: 'Page number, starts from 1 (optional, default 1)'
          },
          page_size: {
            type: 'number',
            description: 'Results per page (optional, default 10)'
          }
        }
      }
    },

    // 🔑 User Data Tools (requires TAPTAP_MAC_TOKEN)
    {
      name: 'get_user_leaderboard_scores',
      description: 'Get actual user leaderboard score data from TapTap API (requires user login). Use this when user wants to see their own scores or ranking positions. Falls back to documentation mode if token is not provided.',
      inputSchema: {
        type: 'object',
        properties: {
          leaderboardId: {
            type: 'string',
            description: 'The specific leaderboard ID to query. Leave empty to get all leaderboards associated with the user.'
          },
          limit: {
            type: 'number',
            description: 'Maximum number of score entries to return. Default is 10.',
            default: 10
          }
        }
      }
    }
  ];
}
