/**
 * TapTap 认证相关文档工具
 */

import { AUTH_DOCUMENTATION, AUTH_SEARCH_INDEX, AuthCategory } from '../data/authDocs.js';

interface ToolArgs {
  query?: string;
  category?: string;
}

/**
 * 格式化认证文档区块
 */
function formatAuthSection(categoryKey: string, section: AuthCategory, detailed = false): string {
  let content = `## 🔐 ${section.title}\n\n`;
  content += `${section.description}\n\n`;

  if (section.methods) {
    content += '### 认证方法\n\n';
    for (const method of section.methods) {
      content += `**${method.name}**\n`;
      content += `${method.description}\n\n`;

      if (detailed && method.example) {
        content += '**代码示例：**\n';
        content += `\`\`\`javascript${method.example}\n\`\`\`\n\n`;
      }
    }
  }

  if (section.best_practices) {
    content += '### 最佳实践\n\n';
    for (const practice of section.best_practices) {
      content += `- ${practice}\n`;
    }
    content += '\n';

    if (detailed && section.example) {
      content += '**实现示例：**\n';
      content += `\`\`\`javascript${section.example}\n\`\`\`\n\n`;
    }
  }

  if (!detailed) {
    content += `💡 使用 \`get_auth_category_docs(category="${categoryKey}")\` 获取完整代码示例\n`;
  }

  return content;
}

/**
 * 搜索认证相关文档
 */
async function searchAuthDocs(args: ToolArgs): Promise<string> {
  const query = args.query?.toLowerCase() || '';
  const category = args.category;

  if (!query && !category) {
    return '请提供搜索关键词或指定文档分类';
  }

  // 如果指定了分类，直接返回该分类的文档
  if (category && category in AUTH_DOCUMENTATION.categories) {
    const section = AUTH_DOCUMENTATION.categories[category];
    return formatAuthSection(category, section);
  }

  // 关键词搜索
  const matchingCategories = new Set<string>();

  // 在搜索索引中查找匹配的分类
  for (const [keyword, categories] of Object.entries(AUTH_SEARCH_INDEX)) {
    if (keyword.includes(query) || query.includes(keyword)) {
      categories.forEach(cat => matchingCategories.add(cat));
    }
  }

  if (matchingCategories.size === 0) {
    return `没有找到与 '${query}' 相关的认证文档。\n\n可用分类：\n` +
           Object.entries(AUTH_DOCUMENTATION.categories)
             .map(([cat, info]) => `- ${cat}: ${info.title}`)
             .join('\n');
  }

  // 格式化搜索结果
  let resultText = `**🔐 TapTap 认证文档搜索结果：'${query}'**\n\n`;

  for (const category of matchingCategories) {
    if (category in AUTH_DOCUMENTATION.categories) {
      const section = AUTH_DOCUMENTATION.categories[category];
      resultText += formatAuthSection(category, section) + '\n\n';
    }
  }

  return resultText;
}

/**
 * 获取所有认证方式
 */
async function getAuthMethods(args: ToolArgs): Promise<string> {
  let content = `**🔐 ${AUTH_DOCUMENTATION.title}**\n\n`;
  content += `${AUTH_DOCUMENTATION.description}\n\n`;

  content += '## 可用认证方式\n\n';

  for (const [categoryKey, categoryInfo] of Object.entries(AUTH_DOCUMENTATION.categories)) {
    content += `### ${categoryInfo.title}\n`;
    content += `${categoryInfo.description}\n\n`;

    if (categoryInfo.methods) {
      for (const method of categoryInfo.methods) {
        content += `**${method.name}**: ${method.description}\n`;
      }
    }

    content += `💡 使用 \`get_auth_category_docs(category="${categoryKey}")\` 获取详细文档\n\n`;
  }

  return content;
}

/**
 * 获取指定认证分类的详细文档
 */
async function getAuthCategoryDocs(args: ToolArgs): Promise<string> {
  const category = args.category;

  if (!category) {
    return '请指定要查看的认证分类，可用分类：\n' +
           Object.entries(AUTH_DOCUMENTATION.categories)
             .map(([cat, info]) => `- ${cat}: ${info.title}`)
             .join('\n');
  }

  if (!(category in AUTH_DOCUMENTATION.categories)) {
    return `未找到分类 '${category}'。可用分类：\n` +
           Object.entries(AUTH_DOCUMENTATION.categories)
             .map(([cat, info]) => `- ${cat}: ${info.title}`)
             .join('\n');
  }

  const section = AUTH_DOCUMENTATION.categories[category];
  return formatAuthSection(category, section, true);
}

export const authTools = {
  searchAuthDocs,
  getAuthMethods,
  getAuthCategoryDocs
};