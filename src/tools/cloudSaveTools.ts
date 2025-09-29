/**
 * TapTap 云存档相关文档工具
 */

import { CLOUD_SAVE_DOCUMENTATION, CLOUD_SAVE_SEARCH_INDEX, CloudSaveCategory } from '../data/cloudSaveDocs.js';

interface ToolArgs {
  query?: string;
  category?: string;
}

/**
 * 格式化云存档文档区块
 */
function formatCloudSaveSection(categoryKey: string, section: CloudSaveCategory, detailed = false): string {
  let content = `## ☁️ ${section.title}\n\n`;
  content += `${section.description}\n\n`;

  // 处理 API 列表
  if (section.apis) {
    content += '### API 接口\n\n';
    for (const api of section.apis) {
      content += `#### ${api.name}\n`;

      if (api.endpoint) {
        content += `**接口**: \`${api.endpoint}\`\n\n`;
      }

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

  // 处理高级功能
  if (section.features) {
    content += '### 高级功能\n\n';
    for (const feature of section.features) {
      content += `#### ${feature.name}\n`;
      content += `${feature.description}\n\n`;

      if (detailed && feature.example) {
        content += '**实现示例：**\n';
        content += `\`\`\`javascript${feature.example}\n\`\`\`\n\n`;
      }
    }
  }

  // 处理最佳实践
  if (section.practices) {
    content += '### 最佳实践指南\n\n';
    for (const practiceGroup of section.practices) {
      content += `#### ${practiceGroup.category}\n`;
      for (const item of practiceGroup.items) {
        content += `- ${item}\n`;
      }
      content += '\n';
    }
  }

  if (!detailed) {
    content += `💡 使用 \`get_cloud_save_category_docs(category="${categoryKey}")\` 获取完整代码示例\n`;
  }

  return content;
}

/**
 * 搜索云存档相关文档
 */
async function searchCloudSaveDocs(args: ToolArgs): Promise<string> {
  const query = args.query?.toLowerCase() || '';
  const category = args.category;

  if (!query && !category) {
    return '请提供搜索关键词或指定文档分类';
  }

  // 如果指定了分类，直接返回该分类的文档
  if (category && category in CLOUD_SAVE_DOCUMENTATION.categories) {
    const section = CLOUD_SAVE_DOCUMENTATION.categories[category];
    return formatCloudSaveSection(category, section);
  }

  // 关键词搜索
  const matchingCategories = new Set<string>();

  // 在搜索索引中查找匹配的分类
  for (const [keyword, categories] of Object.entries(CLOUD_SAVE_SEARCH_INDEX)) {
    if (keyword.includes(query) || query.includes(keyword)) {
      categories.forEach(cat => matchingCategories.add(cat));
    }
  }

  if (matchingCategories.size === 0) {
    return `没有找到与 '${query}' 相关的云存档文档。\n\n可用分类：\n` +
           Object.entries(CLOUD_SAVE_DOCUMENTATION.categories)
             .map(([cat, info]) => `- ${cat}: ${info.title}`)
             .join('\n');
  }

  // 格式化搜索结果
  let resultText = `**☁️ TapTap 云存档文档搜索结果：'${query}'**\n\n`;

  for (const category of matchingCategories) {
    if (category in CLOUD_SAVE_DOCUMENTATION.categories) {
      const section = CLOUD_SAVE_DOCUMENTATION.categories[category];
      resultText += formatCloudSaveSection(category, section) + '\n\n';
    }
  }

  return resultText;
}

/**
 * 获取云存档功能概览
 */
async function getCloudSaveOverview(args: ToolArgs): Promise<string> {
  let content = `**☁️ ${CLOUD_SAVE_DOCUMENTATION.title}**\n\n`;
  content += `${CLOUD_SAVE_DOCUMENTATION.description}\n\n`;

  content += '## 核心功能分类\n\n';

  for (const [categoryKey, categoryInfo] of Object.entries(CLOUD_SAVE_DOCUMENTATION.categories)) {
    content += `### ${categoryInfo.title}\n`;
    content += `${categoryInfo.description}\n\n`;

    // 显示主要功能点
    if (categoryInfo.apis) {
      content += '**主要 API：**\n';
      for (const api of categoryInfo.apis) {
        content += `- \`${api.name}\`: ${api.description}\n`;
      }
    } else if (categoryInfo.features) {
      content += '**主要功能：**\n';
      for (const feature of categoryInfo.features) {
        content += `- \`${feature.name}\`: ${feature.description}\n`;
      }
    } else if (categoryInfo.practices) {
      content += '**实践分类：**\n';
      for (const practice of categoryInfo.practices) {
        content += `- \`${practice.category}\`: ${practice.items.length} 个建议\n`;
      }
    }

    content += `\n💡 使用 \`get_cloud_save_category_docs(category="${categoryKey}")\` 获取详细文档\n\n`;
  }

  return content;
}

/**
 * 获取指定云存档分类的详细文档
 */
async function getCloudSaveCategoryDocs(args: ToolArgs): Promise<string> {
  const category = args.category;

  if (!category) {
    return '请指定要查看的云存档分类，可用分类：\n' +
           Object.entries(CLOUD_SAVE_DOCUMENTATION.categories)
             .map(([cat, info]) => `- ${cat}: ${info.title}`)
             .join('\n');
  }

  if (!(category in CLOUD_SAVE_DOCUMENTATION.categories)) {
    return `未找到分类 '${category}'。可用分类：\n` +
           Object.entries(CLOUD_SAVE_DOCUMENTATION.categories)
             .map(([cat, info]) => `- ${cat}: ${info.title}`)
             .join('\n');
  }

  const section = CLOUD_SAVE_DOCUMENTATION.categories[category];
  return formatCloudSaveSection(category, section, true);
}

export const cloudSaveTools = {
  searchCloudSaveDocs,
  getCloudSaveOverview,
  getCloudSaveCategoryDocs
};