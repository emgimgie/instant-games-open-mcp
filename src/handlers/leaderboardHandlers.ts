/**
 * Leaderboard Management Handlers
 * Handles leaderboard operations including creation, listing, and workflow guidance
 */

import {
  createLeaderboard as createLeaderboardApi,
  listLeaderboards as listLeaderboardsApi,
  ensureAppInfo,
  SelectionRequiredError,
  PeriodType,
  ScoreType,
  ScoreOrder,
  CalcType
} from '../network/leaderboardApi.js';
import { leaderboardTools } from '../tools/leaderboardTools.js';

/**
 * Handler context for accessing environment variables
 */
export interface HandlerContext {
  projectPath?: string;
  macToken?: any;
}

/**
 * Start leaderboard integration workflow - guides user through the process
 */
export async function startLeaderboardIntegration(
  args: { purpose?: string },
  context: HandlerContext
): Promise<string> {
  try {
    // Step 1: Check existing leaderboards (autoSelect = false to detect multiple apps)
    let leaderboardsResult;
    try {
      leaderboardsResult = await listLeaderboardsApi({}, context.projectPath);
    } catch (error) {
      // Check if this is a SelectionRequiredError
      if (error instanceof SelectionRequiredError) {
        return `🎯 排行榜接入流程\n\n` +
               `⚠️ **检测到多个开发者或应用**\n\n` +
               error.message + `\n\n` +
               `**流程说明：**\n` +
               `1. 使用 list_developers_and_apps 查看所有开发者和应用\n` +
               `2. 使用 select_app 选择要使用的应用\n` +
               `3. 再次运行 start_leaderboard_integration 继续排行榜接入流程`;
      }
      throw error;
    }

    if (!leaderboardsResult.list || leaderboardsResult.list.length === 0) {
      // No leaderboards exist - guide to create one
      return `🎯 排行榜接入流程\n\n` +
             `📋 **当前状态：** 暂无排行榜\n\n` +
             `**下一步操作：**\n` +
             `您需要先在服务器端创建一个排行榜（使用 create_leaderboard 工具）。\n\n` +
             `⚠️ **重要：** TapTap 排行榜不需要引入任何 npm 包或 JS SDK！\n` +
             `- 客户端直接使用全局 tap 对象\n` +
             `- 无需 import 或 require\n` +
             `- TapTap 运行环境自动提供\n\n` +
             `**创建排行榜需要配置（所有值不能为 0）：**\n` +
             `1. title - 排行榜名称（如 "每周高分榜"）\n` +
             `2. period_type - 周期类型：\n` +
             `   - 1=永久（不重置）\n` +
             `   - 2=每天（每天重置）\n` +
             `   - 3=每周（每周一重置）\n` +
             `   - 4=每月（每月1日重置）\n` +
             `3. score_type - 分数类型：1=数值型, 2=时间型\n` +
             `4. score_order - 排序：1=降序（越高越好）, 2=升序（越低越好）\n` +
             `5. calc_type - 计算：1=累计, 2=最佳, 3=最新\n` +
             `6. period_time - 重置时间（⚠️ 当 period_type 为 2/3/4 时必填！）\n` +
             `   - 格式：HH:MM:SS（如 "08:00:00" 表示早上8点）\n` +
             `   - 如果不提供，系统会自动设置为 "08:00:00"\n\n` +
             `💡 **示例配置（每周高分榜）：**\n` +
             `\`\`\`\n` +
             `title: "每周高分榜"\n` +
             `period_type: 3 (每周一重置)\n` +
             `score_type: 1 (数值型)\n` +
             `score_order: 1 (降序，分数越高越好)\n` +
             `calc_type: 2 (保留最佳成绩)\n` +
             `period_time: "08:00:00" (每周一早上8点重置)\n` +
             `\`\`\``;
    }

    // Leaderboards exist - present options
    let output = `🎯 排行榜接入流程\n\n`;
    output += `📋 **当前状态：** 已有 ${leaderboardsResult.total} 个排行榜\n\n`;

    if (leaderboardsResult.list.length === 1) {
      // Only one leaderboard - recommend using it
      const lb = leaderboardsResult.list[0];
      output += `**推荐使用现有排行榜：**\n`;
      output += `- 名称: ${lb.title}\n`;
      output += `- ID: ${lb.leaderboard_open_id}\n`;
      output += `- 周期: ${lb.period}\n`;
      output += `- 默认: ${lb.is_default ? '是' : '否'}\n\n`;
      output += `**下一步：选择要实现的功能**\n`;
      output += `请告诉我您想实现以下哪个功能，我会提供相应的代码示例：\n\n`;
    } else {
      // Multiple leaderboards - let AI/user choose
      output += `**现有排行榜列表：**\n\n`;
      leaderboardsResult.list.forEach((lb, index) => {
        output += `${index + 1}. **${lb.title}**\n`;
        output += `   - ID: ${lb.leaderboard_open_id}\n`;
        output += `   - 周期: ${lb.period}\n`;
        output += `   - 默认: ${lb.is_default ? '是' : '否'}\n`;
        output += `   - 白名单: ${lb.whitelist_only ? '是' : '否'}\n\n`;
      });
      output += `**下一步：**\n`;
      output += `请选择要使用的排行榜 (通过 leaderboard_open_id)，或者告诉我您想创建新的排行榜。\n\n`;
    }

    output += `**可实现的功能：**\n`;
    output += `1. 📊 **打开排行榜界面** - 使用 open_leaderboard 工具查看文档\n`;
    output += `2. 📤 **提交玩家分数** - 使用 submit_scores 工具查看文档\n`;
    output += `3. 📥 **查询排行榜数据** - 使用 load_leaderboard_scores 工具查看文档\n`;
    output += `4. 🎯 **查询玩家排名** - 使用 load_current_player_score 工具查看文档\n`;
    output += `5. 👥 **查询周围玩家** - 使用 load_player_centered_scores 工具查看文档\n`;

    return output;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return `❌ 无法获取排行榜信息:\n${errorMsg}\n\n` +
           `这可能是因为：\n` +
           `1. 用户还没有创建应用/游戏\n` +
           `2. 环境变量配置不正确\n` +
           `3. 有多个开发者或应用需要选择\n\n` +
           `请使用 list_developers_and_apps 查看可用的开发者和应用列表。`;
  }
}

/**
 * Create a new leaderboard
 */
export async function createLeaderboard(
  args: {
    developer_id?: number;
    app_id?: number;
    title: string;
    period_type: number;
    score_type: number;
    score_order: number;
    calc_type: number;
    display_limit?: number;
    period_time?: string;
    score_unit?: string;
  },
  context: HandlerContext
): Promise<string> {
  try {
    // Ensure developer_id and app_id are available
    let developerId = args.developer_id;
    let appId = args.app_id;

    // If not provided, try to get from cache or API
    if (!developerId || !appId) {
      try {
        const appInfo = await ensureAppInfo(context.projectPath, true);

        if (!developerId) {
          developerId = appInfo.developer_id;
        }

        if (!appId) {
          appId = appInfo.app_id;
        }
      } catch (error) {
        if (error instanceof SelectionRequiredError) {
          return `❌ 无法创建排行榜：需要选择应用\n\n` +
                 error.message + `\n\n` +
                 `**操作步骤：**\n` +
                 `1. 使用 list_developers_and_apps 查看所有可用的应用\n` +
                 `2. 使用 select_app 选择要使用的应用\n` +
                 `3. 再次调用 create_leaderboard 创建排行榜`;
        }
        throw error;
      }

      if (!developerId || !appId) {
        return `❌ 无法获取 developer_id 或 app_id\n\n` +
               `系统会自动从 /level/v1/list 接口获取您的应用信息。\n` +
               `如果失败，请检查：\n` +
               `1. 用户是否已创建应用/游戏\n` +
               `2. TDS_MCP_MAC_TOKEN 是否有效\n` +
               `3. 您也可以手动指定 developer_id 和 app_id 参数`;
      }
    }

    const result = await createLeaderboardApi({
      developer_id: developerId,
      app_id: appId,
      title: args.title,
      period_type: args.period_type as PeriodType,
      score_type: args.score_type as ScoreType,
      score_order: args.score_order as ScoreOrder,
      calc_type: args.calc_type as CalcType,
      display_limit: args.display_limit,
      period_time: args.period_time,
      score_unit: args.score_unit
    });

    return `✅ 排行榜创建成功!\n\n` +
           `📊 排行榜信息:\n` +
           `- Leaderboard ID: ${result.leaderboard_id}\n` +
           `- Open ID: ${result.open_id}\n` +
           `- Title: ${result.title}\n` +
           `- Status: ${result.default_status}\n\n` +
           `📝 应用信息（已缓存）:\n` +
           `- Developer ID: ${developerId}\n` +
           `- App ID: ${appId}\n\n` +
           `🎮 使用方法:\n` +
           `在小游戏中使用 leaderboardId "${result.leaderboard_id}" 来调用排行榜 API`;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    // 解析具体错误，提供更有针对性的建议
    let specificHelp = '';

    if (errorMsg.includes('score_type') || errorMsg.includes('period_type') ||
        errorMsg.includes('score_order') || errorMsg.includes('calc_type')) {
      specificHelp = `\n⚠️ **参数错误：**\n` +
                     `所有枚举参数的值不能为 0！（0 = 未指定/无效）\n` +
                     `正确的值：\n` +
                     `- period_type: 1=永久, 2=每日, 3=每周, 4=每月\n` +
                     `- score_type: 1=数值型, 2=时间型\n` +
                     `- score_order: 1=降序(越高越好), 2=升序(越低越好)\n` +
                     `- calc_type: 1=累计, 2=最佳, 3=最新\n\n` +
                     `请使用正确的枚举值重试。`;
    } else if (errorMsg.includes('Unauthorized') || errorMsg.includes('401')) {
      specificHelp = `\n🔑 **认证错误：**\n` +
                     `请检查环境变量:\n` +
                     `- TDS_MCP_MAC_TOKEN\n` +
                     `- TDS_MCP_CLIENT_ID\n` +
                     `- TDS_MCP_CLIENT_TOKEN`;
    } else if (errorMsg.includes('403') || errorMsg.includes('Forbidden')) {
      specificHelp = `\n🚫 **权限错误：**\n` +
                     `当前用户可能没有创建排行榜的权限，请检查开发者账号权限。`;
    }

    return `❌ 创建排行榜失败\n\n` +
           `**错误信息：**\n${errorMsg}\n${specificHelp}\n\n` +
           `**常见问题检查：**\n` +
           `1. 所有枚举参数是否使用了正确的值（不能为 0）\n` +
           `2. 环境变量是否正确配置\n` +
           `3. 用户是否有创建排行榜的权限\n` +
           `4. 是否有多个应用需要选择`;
  }
}

/**
 * List all leaderboards for the current app
 */
export async function listLeaderboards(
  args: {
    developer_id?: number;
    app_id?: number;
    page?: number;
    page_size?: number;
  },
  context: HandlerContext
): Promise<string> {
  try {
    const result = await listLeaderboardsApi({
      developer_id: args.developer_id,
      app_id: args.app_id,
      page: args.page,
      page_size: args.page_size
    }, context.projectPath);

    if (!result.list || result.list.length === 0) {
      return `📋 暂无排行榜\n\n您还没有创建任何排行榜。使用 create_leaderboard 工具创建第一个排行榜。`;
    }

    let output = `📋 排行榜列表 (共 ${result.total} 个)\n\n`;

    result.list.forEach((item, index) => {
      output += `${index + 1}. **${item.title}**\n`;
      output += `   - ID: ${item.id}\n`;
      output += `   - Open ID: ${item.leaderboard_open_id}\n`;
      output += `   - Period: ${item.period}\n`;
      output += `   - Default: ${item.is_default ? 'Yes' : 'No'}\n`;
      output += `   - Whitelist Only: ${item.whitelist_only ? 'Yes' : 'No'}\n\n`;
    });

    const currentPage = args.page || 1;
    const pageSize = args.page_size || 10;
    const totalPages = Math.ceil(result.total / pageSize);

    if (totalPages > 1) {
      output += `\n📄 Page ${currentPage} of ${totalPages}\n`;
      if (currentPage < totalPages) {
        output += `Use page=${currentPage + 1} to see more results.\n`;
      }
    }

    return output;
  } catch (error) {
    if (error instanceof SelectionRequiredError) {
      return `❌ 无法查询排行榜列表：需要选择应用\n\n` +
             error.message + `\n\n` +
             `**操作步骤：**\n` +
             `1. 使用 list_developers_and_apps 查看所有可用的应用\n` +
             `2. 使用 select_app 选择要使用的应用\n` +
             `3. 再次调用 list_leaderboards 查询排行榜列表`;
    }

    const errorMsg = error instanceof Error ? error.message : String(error);
    return `❌ 查询排行榜列表失败:\n${errorMsg}`;
  }
}

/**
 * Get user leaderboard scores (requires user token)
 */
export async function getUserLeaderboardScores(
  args: { leaderboardId?: string; limit?: number },
  context: HandlerContext
): Promise<string> {
  if (!context.macToken || !context.macToken.kid) {
    return `❌ 此功能需要用户登录 TapTap\n请设置 TDS_MCP_MAC_TOKEN 环境变量\n\n降级为文档模式:\n${await leaderboardTools.getLeaderboardOverview()}`;
  }

  try {
    // 模拟 API 调用（实际项目中替换为真实 API）
    const url = args.leaderboardId
      ? `https://api.taptap.com/leaderboard/${args.leaderboardId}/scores`
      : 'https://api.taptap.com/leaderboard/user-scores';

    // @ts-ignore - fetch 在 Node.js 18+ 中可用
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `MAC id="${context.macToken.kid}"`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API 调用失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return `🏆 用户排行榜数据:\n${JSON.stringify(data, null, 2)}`;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return `❌ API 调用失败: ${errorMsg}\n\n降级为文档模式:\n${await leaderboardTools.getLeaderboardOverview()}`;
  }
}
