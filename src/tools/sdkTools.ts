/**
 * TapTap SDK 集成相关文档工具
 */

import { SDK_DOCUMENTATION, SDK_SEARCH_INDEX, SDKCategory } from '../data/sdkDocs.js';

interface ToolArgs {
  query?: string;
  platform?: string;
}

/**
 * 格式化 SDK 文档区块
 */
function formatSDKSection(platformKey: string, section: SDKCategory, detailed = false): string {
  let content = `## 🔧 ${section.title}\n\n`;
  content += `${section.description}\n\n`;

  // 安装和配置
  if (section.setup) {
    content += '### 安装和配置\n\n';

    const setupInfo = section.setup;
    if (setupInfo.steps) {
      content += '**集成步骤：**\n';
      setupInfo.steps.forEach((step, index) => {
        content += `${index + 1}. ${step}\n`;
      });
      content += '\n';
    }

    if (detailed && setupInfo.example) {
      content += '**初始化代码：**\n';
      content += `\`\`\`javascript${setupInfo.example}\n\`\`\`\n\n`;
    }
  }

  // 功能特性
  if (section.features && detailed) {
    content += '### 功能特性\n\n';

    for (const [featureKey, featureInfo] of Object.entries(section.features)) {
      content += `#### ${featureInfo.title}\n`;
      content += `${featureInfo.description}\n\n`;

      if (featureInfo.example) {
        content += '**代码示例：**\n';
        content += `\`\`\`javascript${featureInfo.example}\n\`\`\`\n\n`;
      }
    }
  }

  if (!detailed) {
    content += `💡 使用 \`get_sdk_platform_docs(platform="${platformKey}")\` 获取完整集成指南和代码示例\n`;
  }

  return content;
}

/**
 * 搜索 SDK 集成相关文档
 */
async function searchSDKDocs(args: ToolArgs): Promise<string> {
  const query = args.query?.toLowerCase() || '';
  const platform = args.platform;

  if (!query && !platform) {
    return '请提供搜索关键词或指定平台名称';
  }

  // 如果指定了平台，直接返回该平台的文档
  if (platform && platform in SDK_DOCUMENTATION.categories) {
    const section = SDK_DOCUMENTATION.categories[platform];
    return formatSDKSection(platform, section);
  }

  // 关键词搜索
  const matchingPlatforms = new Set<string>();

  // 在搜索索引中查找匹配的平台
  for (const [keyword, platforms] of Object.entries(SDK_SEARCH_INDEX)) {
    if (keyword.toLowerCase().includes(query) || query.includes(keyword.toLowerCase())) {
      platforms.forEach(platform => matchingPlatforms.add(platform));
    }
  }

  if (matchingPlatforms.size === 0) {
    return `没有找到与 '${query}' 相关的 SDK 文档。\n\n支持的平台：\n` +
           Object.entries(SDK_DOCUMENTATION.categories)
             .filter(([platform]) => platform !== 'best_practices')
             .map(([platform, info]) => `- ${platform}: ${info.title}`)
             .join('\n');
  }

  // 格式化搜索结果
  let resultText = `**🔧 TapTap SDK 集成文档搜索结果：'${query}'**\n\n`;

  for (const platform of matchingPlatforms) {
    if (platform in SDK_DOCUMENTATION.categories) {
      const section = SDK_DOCUMENTATION.categories[platform];
      resultText += formatSDKSection(platform, section) + '\n\n';
    }
  }

  return resultText;
}

/**
 * 获取支持的 SDK 平台列表
 */
async function getSDKPlatforms(args: ToolArgs): Promise<string> {
  let content = `**🔧 ${SDK_DOCUMENTATION.title}**\n\n`;
  content += `${SDK_DOCUMENTATION.description}\n\n`;

  content += '## 支持的平台\n\n';

  for (const [platformKey, platformInfo] of Object.entries(SDK_DOCUMENTATION.categories)) {
    if (platformKey === 'best_practices') {
      continue;
    }

    content += `### ${platformInfo.title}\n`;
    content += `${platformInfo.description}\n\n`;

    if (platformInfo.setup) {
      content += '**集成步骤：**\n';
      platformInfo.setup.steps.forEach((step, index) => {
        content += `${index + 1}. ${step}\n`;
      });
    }

    content += `\n💡 使用 \`get_sdk_platform_docs(platform="${platformKey}")\` 获取详细集成指南\n\n`;
  }

  // 最佳实践
  content += '## 开发最佳实践\n\n';
  content += '💡 使用 `get_sdk_best_practices()` 获取 SDK 集成的最佳实践和建议\n\n';

  return content;
}

/**
 * 获取指定平台的详细 SDK 集成文档
 */
async function getSDKPlatformDocs(args: ToolArgs): Promise<string> {
  const platform = args.platform;

  if (!platform) {
    return '请指定要查看的平台，支持的平台：\n' +
           Object.entries(SDK_DOCUMENTATION.categories)
             .filter(([p]) => p !== 'best_practices')
             .map(([p, info]) => `- ${p}: ${info.title}`)
             .join('\n');
  }

  if (!(platform in SDK_DOCUMENTATION.categories) || platform === 'best_practices') {
    return `未找到平台 '${platform}'。支持的平台：\n` +
           Object.entries(SDK_DOCUMENTATION.categories)
             .filter(([p]) => p !== 'best_practices')
             .map(([p, info]) => `- ${p}: ${info.title}`)
             .join('\n');
  }

  const section = SDK_DOCUMENTATION.categories[platform];
  return formatSDKSection(platform, section, true);
}

/**
 * 获取 SDK 集成的最佳实践
 */
async function getSDKBestPractices(args: ToolArgs): Promise<string> {
  const bestPractices = SDK_DOCUMENTATION.best_practices;

  let content = `**🔧 ${bestPractices.title}**\n\n`;
  content += `${bestPractices.description}\n\n`;

  for (const practiceGroup of bestPractices.practices) {
    content += `## ${practiceGroup.category}\n\n`;
    for (const item of practiceGroup.items) {
      content += `- ${item}\n`;
    }
    content += '\n';
  }

  return content;
}

export const sdkTools = {
  searchSDKDocs,
  getSDKPlatforms,
  getSDKPlatformDocs,
  getSDKBestPractices
};