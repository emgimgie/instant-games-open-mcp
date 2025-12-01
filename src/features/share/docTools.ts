/**
 * TapTap Minigame Share Documentation Tools
 * Each Share API has its own dedicated tool
 */

import {
  generateAPIDoc,
  generateCategoryDoc,
  searchDocumentation,
  generateOverview,
  generateSearchSuggestions,
  type ResourceSuggestion,
} from '../../core/utils/docHelpers.js';

import { SHARE_DOCUMENTATION } from './docs.js';

interface ToolArgs {
  query?: string;
}

// ============ Core API Tools (one for each Share API) ============

/**
 * Get documentation for tap.setShareboardHidden()
 */
async function setShareboardHidden(): Promise<string> {
  return generateAPIDoc(SHARE_DOCUMENTATION, 'share_panel', 'tap.setShareboardHidden');
}

/**
 * Get documentation for tap.showShareboard()
 */
async function showShareboard(): Promise<string> {
  return generateAPIDoc(SHARE_DOCUMENTATION, 'share_panel', 'tap.showShareboard');
}

/**
 * Get documentation for tap.onShareMessage()
 */
async function onShareMessage(): Promise<string> {
  return generateAPIDoc(SHARE_DOCUMENTATION, 'share_events', 'tap.onShareMessage');
}

/**
 * Get documentation for tap.offShareMessage()
 */
async function offShareMessage(): Promise<string> {
  return generateAPIDoc(SHARE_DOCUMENTATION, 'share_events', 'tap.offShareMessage');
}

// ============ Helper Tools ============

/**
 * Resource suggestions for share
 */
const SHARE_SUGGESTIONS: ResourceSuggestion[] = [
  {
    keywords: ['show', 'display', 'panel', 'shareboard'],
    uri: 'docs://share/api/show-shareboard',
    description: '如何显示分享面板',
  },
  {
    keywords: ['hide', 'hidden', 'setShareboardHidden'],
    uri: 'docs://share/api/set-shareboard-hidden',
    description: '如何隐藏分享面板',
  },
  {
    keywords: ['listen', 'on', 'event', 'message'],
    uri: 'docs://share/api/on-share-message',
    description: '如何监听分享事件',
  },
  {
    keywords: ['off', 'cancel', 'remove', 'listener'],
    uri: 'docs://share/api/off-share-message',
    description: '如何取消分享监听',
  },
];

/**
 * Search share documentation by keyword
 */
async function searchShareDocs(args: ToolArgs): Promise<string> {
  const query = args.query?.toLowerCase() || '';

  if (!query) {
    return 'Please provide a search keyword.';
  }

  const results = searchDocumentation(SHARE_DOCUMENTATION, query);

  if (results.length === 0) {
    return generateSearchSuggestions(query, SHARE_SUGGESTIONS, 'docs://share/overview');
  }

  return `**📤 Search Results for "${query}"**\n\n` + results.join('\n---\n\n');
}

/**
 * Get integration workflow guide
 */
async function getIntegrationWorkflow(): Promise<string> {
  const doc = SHARE_DOCUMENTATION;

  return `# ${doc.title} 完整接入工作流

${doc.description}

## ⚠️ 关键原则：客户端无需安装 SDK

客户端只需要使用全局 \`tap\` 对象，无需任何 npm 包或 SDK 安装。

## 📋 接入步骤

### 1️⃣ 服务端配置（使用 MCP 工具）

1. **创建分享模版**
   - 使用 \`create_share_template\` 工具创建分享模版
   - 填写描述内容（contents）和备注（remark）
   - 记录返回的 \`template_code\`（用于客户端调用）

2. **查询分享模版列表**
   - 使用 \`list_share_templates\` 工具查看所有模版
   - 查看模版状态（0-待审核，1-已通过，2-已拒绝，3-审核异常）

3. **查询指定模版信息**
   - 使用 \`get_share_template_info\` 工具查询模版详情
   - 确认模版状态为已通过（status = 1）后才能在客户端使用

### 2️⃣ 客户端实现

\`\`\`javascript
// ⚠️ IMPORTANT: 'tap' is a global object, NO imports needed!
// This works ONLY in TapTap minigame environment

// 1. 显示分享面板（使用服务端返回的 template_code）
tap.showShareboard({
  templateId: "your_template_code",  // 使用 create_share_template 返回的 template_code
  sceneParam: "custom_param",        // 可选：透传参数
  success: function (res) {
    console.log("分享面板已显示");
  },
  fail: function (res) {
    console.log("显示失败:", res.errMsg);
  }
});

// 2. 监听分享事件
tap.onShareMessage({
  success: function (res) {
    console.log("分享渠道:", res.channel);
    console.log("分享成功");
  },
  fail: function (res) {
    console.log("分享失败:", res.errMsg);
  }
});

// 3. 控制用户菜单中的分享面板显示/隐藏
tap.setShareboardHidden({
  hidden: false,  // false: 显示, true: 隐藏
  success: function (res) {
    console.log("设置成功");
  }
});

// 4. 取消分享监听（不再需要时）
tap.offShareMessage();
\`\`\`

### 3️⃣ 完整示例

\`\`\`javascript
// 完整的分享流程示例
function shareGame() {
  // 显示分享面板
  tap.showShareboard({
    templateId: "your_template_code",
    sceneParam: JSON.stringify({ level: 10, score: 1000 }),
    success: function (res) {
      console.log("分享面板已显示");
    },
    fail: function (res) {
      console.error("显示失败:", res.errMsg);
    }
  });
}

// 监听分享行为
tap.onShareMessage({
  success: function (res) {
    console.log("用户通过", res.channel, "渠道分享了游戏");
    // 可以在这里处理分享成功后的逻辑，比如奖励
  },
  fail: function (res) {
    console.log("分享失败:", res.errMsg);
  }
});

// 调用分享
shareGame();
\`\`\`

### 4️⃣ 测试验证

1. 在 TapTap 开发者中心创建分享模版并等待审核通过
2. 在客户端调用 \`tap.showShareboard()\` 显示分享面板
3. 测试分享到不同渠道
4. 验证 \`tap.onShareMessage()\` 回调是否正常触发

## 📚 需要详细 API 文档？

- **docs://share/overview** - 完整概览
- **docs://share/api/show-shareboard** - tap.showShareboard() API
- **docs://share/api/set-shareboard-hidden** - tap.setShareboardHidden() API
- **docs://share/api/on-share-message** - tap.onShareMessage() API
- **docs://share/api/off-share-message** - tap.offShareMessage() API

## 🔧 可用的 MCP 工具

### 服务端管理工具
- \`create_share_template\` - 创建分享模版
- \`list_share_templates\` - 查询分享模版列表
- \`get_share_template_info\` - 查询指定分享模版信息

⚠️ **注意**：修改或删除分享模版需要在 TapTap 开发者中心操作，MCP 工具不支持修改/删除操作。
- 开发者中心地址：https://developer.taptap.cn
- 操作路径：登录后进入应用管理 → 分享模版管理

### 文档工具
- \`get_share_integration_guide\` - 本指引
- \`search_share_docs\` - 搜索分享文档

## 🔗 参考链接

- **官方 API 文档**: ${doc.apiReference}
- **TapTap 开发者中心**: https://developer.taptap.cn/

## ⚠️ 重要提示

1. **templateId 对应关系**: 客户端 \`tap.showShareboard()\` 的 \`templateId\` 参数对应服务端 API 返回的 \`template_code\`
2. **审核状态**: 只有状态为"已通过"（status = 1）的模版才能在客户端使用
3. **回调说明**: \`tap.showShareboard()\` 的回调是拉起面板的回调，不是分享成功/失败的回调。分享行为的回调需要使用 \`tap.onShareMessage()\`
4. **隐藏面板**: \`tap.setShareboardHidden()\` 只影响用户菜单中的分享面板，不影响通过 API 调用的分享面板

`;
}

export const shareTools = {
  // Core API documentation tools
  setShareboardHidden,
  showShareboard,
  onShareMessage,
  offShareMessage,

  // Helper tools
  getOverview: () => generateOverview(SHARE_DOCUMENTATION),
  getIntegrationWorkflow,
  searchShareDocs,
};
