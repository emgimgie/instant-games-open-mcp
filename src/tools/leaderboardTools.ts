/**
 * TapTap 排行榜相关文档工具
 */

import { LEADERBOARD_DOCUMENTATION, LEADERBOARD_SEARCH_INDEX, LeaderboardCategory } from '../data/leaderboardDocs.js';

interface ToolArgs {
  query?: string;
  category?: string;
}

/**
 * 格式化排行榜文档区块
 */
function formatLeaderboardSection(categoryKey: string, section: LeaderboardCategory, detailed = false): string {
  let content = `## 🏆 ${section.title}\n\n`;
  content += `${section.description}\n\n`;

  if (section.apis) {
    content += '### API 方法\n\n';
    for (const api of section.apis) {
      const methodName = api.method || api.name;
      content += `#### ${api.name}\n`;
      content += `**方法**: \`${methodName}()\`\n\n`;
      content += `${api.description}\n\n`;

      if (api.parameters) {
        content += '**参数：**\n';
        for (const [param, desc] of Object.entries(api.parameters)) {
          content += `- \`${param}\`: ${desc}\n`;
        }
        content += '\n';
      }

      if (detailed && api.example) {
        content += '**代码示例：**\n';
        content += `\`\`\`javascript${api.example}\n\`\`\`\n\n`;
      }
    }
  }

  if (!detailed) {
    content += `💡 使用 \`get_leaderboard_category_docs(category="${categoryKey}")\` 获取完整代码示例\n`;
  }

  return content;
}

/**
 * 搜索排行榜相关文档
 */
async function searchLeaderboardDocs(args: ToolArgs): Promise<string> {
  const query = args.query?.toLowerCase() || '';
  const category = args.category;

  if (!query && !category) {
    return '请提供搜索关键词或指定文档分类';
  }

  // 如果指定了分类，直接返回该分类的文档
  if (category && category in LEADERBOARD_DOCUMENTATION.categories) {
    const section = LEADERBOARD_DOCUMENTATION.categories[category];
    return formatLeaderboardSection(category, section);
  }

  // 关键词搜索
  const matchingCategories = new Set<string>();

  // 在搜索索引中查找匹配的分类
  for (const [keyword, categories] of Object.entries(LEADERBOARD_SEARCH_INDEX)) {
    if (keyword.includes(query) || query.includes(keyword)) {
      categories.forEach(cat => matchingCategories.add(cat));
    }
  }

  if (matchingCategories.size === 0) {
    return `没有找到与 '${query}' 相关的排行榜文档。\n\n可用分类：\n` +
           Object.entries(LEADERBOARD_DOCUMENTATION.categories)
             .map(([cat, info]) => `- ${cat}: ${info.title}`)
             .join('\n');
  }

  // 格式化搜索结果
  let resultText = `**🏆 TapTap 排行榜文档搜索结果：'${query}'**\n\n`;

  for (const category of matchingCategories) {
    if (category in LEADERBOARD_DOCUMENTATION.categories) {
      const section = LEADERBOARD_DOCUMENTATION.categories[category];
      resultText += formatLeaderboardSection(category, section) + '\n\n';
    }
  }

  return resultText;
}

/**
 * 获取排行榜功能概览
 */
async function getLeaderboardOverview(args: ToolArgs): Promise<string> {
  let content = `**🏆 ${LEADERBOARD_DOCUMENTATION.title}**\n\n`;
  content += `${LEADERBOARD_DOCUMENTATION.description}\n\n`;

  content += '## 核心功能分类\n\n';

  for (const [categoryKey, categoryInfo] of Object.entries(LEADERBOARD_DOCUMENTATION.categories)) {
    content += `### ${categoryInfo.title}\n`;
    content += `${categoryInfo.description}\n\n`;

    if (categoryInfo.apis) {
      content += '**主要 API：**\n';
      for (const api of categoryInfo.apis) {
        const methodName = api.method || api.name;
        content += `- \`${methodName}()\`: ${api.description}\n`;
      }
    }

    content += `\n💡 使用 \`get_leaderboard_category_docs(category="${categoryKey}")\` 获取详细文档\n\n`;
  }

  // 添加集成模式
  content += '## 常用集成模式\n\n';
  for (const pattern of LEADERBOARD_DOCUMENTATION.integration_patterns.patterns) {
    content += `- **${pattern.name}**: ${pattern.description}\n`;
  }
  content += '\n💡 使用 `get_leaderboard_patterns()` 获取集成模式的完整代码示例\n\n';

  return content;
}

/**
 * 获取指定排行榜分类的详细文档
 */
async function getLeaderboardCategoryDocs(args: ToolArgs): Promise<string> {
  const category = args.category;

  if (!category) {
    return '请指定要查看的排行榜分类，可用分类：\n' +
           Object.entries(LEADERBOARD_DOCUMENTATION.categories)
             .map(([cat, info]) => `- ${cat}: ${info.title}`)
             .join('\n');
  }

  if (!(category in LEADERBOARD_DOCUMENTATION.categories)) {
    return `未找到分类 '${category}'。可用分类：\n` +
           Object.entries(LEADERBOARD_DOCUMENTATION.categories)
             .map(([cat, info]) => `- ${cat}: ${info.title}`)
             .join('\n');
  }

  const section = LEADERBOARD_DOCUMENTATION.categories[category];
  return formatLeaderboardSection(category, section, true);
}

/**
 * 获取排行榜集成模式和最佳实践
 */
async function getLeaderboardPatterns(args: ToolArgs): Promise<string> {
  let content = `**🏆 ${LEADERBOARD_DOCUMENTATION.integration_patterns.title}**\n\n`;
  content += `${LEADERBOARD_DOCUMENTATION.integration_patterns.description}\n\n`;

  // 集成模式
  for (const pattern of LEADERBOARD_DOCUMENTATION.integration_patterns.patterns) {
    content += `## ${pattern.name}\n\n`;
    content += `${pattern.description}\n\n`;
    content += `\`\`\`javascript${pattern.example}\n\`\`\`\n\n`;
  }

  // 最佳实践
  content += `## ${LEADERBOARD_DOCUMENTATION.best_practices.title}\n\n`;
  content += `${LEADERBOARD_DOCUMENTATION.best_practices.description}\n\n`;

  for (const practiceGroup of LEADERBOARD_DOCUMENTATION.best_practices.practices) {
    content += `### ${practiceGroup.category}\n`;
    for (const item of practiceGroup.items) {
      content += `- ${item}\n`;
    }
    content += '\n';
  }

  return content;
}

export const leaderboardTools = {
  searchLeaderboardDocs,
  getLeaderboardOverview,
  getLeaderboardCategoryDocs,
  getLeaderboardPatterns
};