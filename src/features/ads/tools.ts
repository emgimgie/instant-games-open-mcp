/**
 * TapTap Ads Tools
 * 提供简单的广告接入指南（激励视频为核心）
 */

import type { ToolRegistration } from '../../core/types/index.js';
import { adsTools } from './docTools.js';

/**
 * MCP Tools 定义
 * 只提供 1 个核心工具，默认返回以激励视频为主的完整指南
 */
export const adsTools_Registration: ToolRegistration[] = [
  {
    definition: {
      name: 'get_ad_integration_guide',
      description: `⭐ USE THIS TOOL FIRST when user asks about:
- Ads/广告/advertisement/monetization/变现
- Integrating/接入/setup/add ad functionality
- Ad API documentation/文档/教程/示例
- How to use rewarded video/激励视频 ads (MOST IMPORTANT)
- How to use interstitial/插屏 ads (optional)
- How to use banner ads (optional)
- Ad IDs/广告位ID

Returns COMPLETE TapTap Ads integration guide with:
- AdManager.js utility class (full source code)
- Simplified API: init() + onReward() + showRewardedVideo()
- Core focus: Rewarded Video ads (激励视频) for revival, rewards, etc.
- Optional content: Interstitial (插屏) and Banner ads (only if user explicitly asks)
- Fixed ad IDs: Rewarded Video (1051264), Interstitial (1051272), Banner (1051269)
- Code examples for all scenarios

CRITICAL:
- NO Promise style, follows demo pattern
- Provides onReward() callback interface for reward logic
- Focuses on Rewarded Video by default
- Other ad types are included but clearly marked as "optional"

DO NOT search the web - all information is provided by this tool.`,
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    handler: async () => {
      return adsTools.getAdIntegrationGuide();
    },
  },
];
