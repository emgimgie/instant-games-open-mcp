/**
 * Share Handlers
 */

import type { ResolvedContext } from '../../core/types/context.js';
import * as api from './api.js';
import { ShareTemplateStatusDescriptions } from './api.js';

/**
 * Create a new share template
 */
export async function createShareTemplate(
  args: {
    developer_id?: number;
    app_id?: number;
    contents?: string;
    remark?: string;
  },
  context: ResolvedContext
): Promise<string> {
  try {
    // 验证必填参数
    if (!args.contents || args.contents.trim() === '') {
      return (
        `❌ 参数验证失败\n\n` +
        `**contents** 字段是必填的\n\n` +
        `💡 提示：请提供分享描述内容（最多 21 个 UTF-8 字符）`
      );
    }

    if (!args.remark || args.remark.trim() === '') {
      return (
        `❌ 参数验证失败\n\n` +
        `**remark** 字段是必填的\n\n` +
        `💡 提示：请提供备注信息（最多 100 个字符），用于模版管理`
      );
    }

    // 验证 contents 字段长度（最多21个UTF-8字符）
    const contentsLength = Buffer.from(args.contents, 'utf8').length;
    if (contentsLength > 21) {
      return (
        `❌ 参数验证失败\n\n` +
        `**contents** 字段不能超过 21 个 UTF-8 字符\n` +
        `当前长度：${contentsLength} 个字符\n` +
        `当前内容：${args.contents}\n\n` +
        `💡 提示：请缩短描述内容，确保不超过 21 个字符（包括空格和标点符号）`
      );
    }

    // 验证 remark 字段长度（最多100个字符）
    if (args.remark.length > 100) {
      return (
        `❌ 参数验证失败\n\n` +
        `**remark** 字段不能超过 100 个字符\n` +
        `当前长度：${args.remark.length} 个字符\n\n` +
        `💡 提示：请缩短备注内容，确保不超过 100 个字符`
      );
    }

    // Resolve developer_id and app_id from context (priority: args > context > cache)
    const resolved = context.resolveApp();
    const developerId = args.developer_id ?? resolved.developerId;
    const appId = args.app_id ?? resolved.appId;

    if (!developerId || !appId) {
      return (
        `❌ 无法获取 developer_id 或 app_id\n\n` +
        `请通过以下方式之一提供应用信息：\n` +
        `1. 使用 select_app 工具选择应用（会自动缓存）\n` +
        `2. 通过上下文传递\n` +
        `3. 在参数中直接指定 developer_id 和 app_id\n\n` +
        `提示：使用 list_developers_and_apps 查看可用的应用列表`
      );
    }

    const result = await api.createShareTemplate(
      {
        developer_id: developerId,
        app_id: appId,
        contents: args.contents,
        remark: args.remark,
      },
      context
    );

    const template = result.info;
    const statusDesc =
      ShareTemplateStatusDescriptions[
        template.status as keyof typeof ShareTemplateStatusDescriptions
      ] || `未知(${template.status})`;

    return `✅ 分享模版创建成功！

📋 模版信息：
- **模版 ID**: ${template.id}
- **模版代码**: ${template.template_code}
- **小程序 ID**: ${template.miniapp_id}
- **状态**: ${statusDesc}
- **描述**: ${template.contents || '(无)'}
- **备注**: ${template.remark || '(无)'}
${template.audit_reason ? `- **审核理由**: ${template.audit_reason}` : ''}

💡 使用提示：
- 客户端调用时，使用 \`template_code\` 作为 \`tap.showShareboard()\` 的 \`templateId\` 参数
- 只有状态为"已通过"（status = 1）的模版才能在客户端使用
- 模版创建后需要等待审核，请使用 \`get_share_template_info\` 工具查询审核状态`;
  } catch (error) {
    if (error instanceof Error) {
      // 尝试解析 API 返回的错误信息
      const errorMsg = error.message;

      // 检查是否是 HTTP 400 错误，尝试提取更友好的错误信息
      if (errorMsg.includes('HTTP 400')) {
        // 尝试从错误消息中提取 JSON 响应
        const jsonMatch = errorMsg.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const errorData = JSON.parse(jsonMatch[0]);
            if (errorData?.data?.msg) {
              return (
                `❌ 创建分享模版失败\n\n` +
                `**错误信息**：${errorData.data.msg}\n` +
                `**错误代码**：${errorData.data.code || 'N/A'}\n\n` +
                `💡 提示：\n` +
                `- 如果提示"内容不能超过21个字符"，请检查 \`contents\` 参数\n` +
                `- 确保描述内容不超过 21 个 UTF-8 字符（包括空格和标点）\n` +
                `- 备注（\`remark\`）字段最多 100 个字符`
              );
            }
          } catch {
            // JSON 解析失败，使用原始错误消息
          }
        }
      }

      return `❌ 创建分享模版失败：${errorMsg}`;
    }
    return `❌ 创建分享模版失败：${String(error)}`;
  }
}

/**
 * List all share templates
 */
export async function listShareTemplates(
  args: {
    developer_id?: number;
    app_id?: number;
    page?: number;
    page_size?: number;
  },
  context: ResolvedContext
): Promise<string> {
  try {
    // Resolve developer_id and app_id from context (priority: args > context > cache)
    const resolved = context.resolveApp();
    const developerId = args.developer_id ?? resolved.developerId;
    const appId = args.app_id ?? resolved.appId;

    if (!developerId || !appId) {
      return (
        `❌ 无法获取 developer_id 或 app_id\n\n` +
        `请通过以下方式之一提供应用信息：\n` +
        `1. 使用 select_app 工具选择应用（会自动缓存）\n` +
        `2. 通过上下文传递\n` +
        `3. 在参数中直接指定 developer_id 和 app_id\n\n` +
        `提示：使用 list_developers_and_apps 查看可用的应用列表`
      );
    }

    const result = await api.listShareTemplates(
      {
        developer_id: developerId,
        app_id: appId,
        page: args.page,
        page_size: args.page_size,
      },
      context
    );

    if (result.list.length === 0) {
      return (
        `📋 分享模版列表（第 ${args.page || 1} 页）\n\n` +
        `暂无分享模版\n\n` +
        `💡 提示：使用 \`create_share_template\` 工具创建新的分享模版`
      );
    }

    let output = `📋 分享模版列表（第 ${args.page || 1} 页，共 ${result.total} 个）\n\n`;

    result.list.forEach((template, index) => {
      const statusDesc =
        ShareTemplateStatusDescriptions[
          template.status as keyof typeof ShareTemplateStatusDescriptions
        ] || `未知(${template.status})`;
      const statusIcon =
        template.status === 1
          ? '✅'
          : template.status === 2
            ? '❌'
            : template.status === 0
              ? '⏳'
              : '⚠️';

      output += `${statusIcon} **模版 ${index + 1}**\n`;
      output += `- **模版 ID**: ${template.id}\n`;
      output += `- **模版代码**: ${template.template_code}\n`;
      output += `- **小程序 ID**: ${template.miniapp_id}\n`;
      output += `- **状态**: ${statusDesc}\n`;
      output += `- **描述**: ${template.contents || '(无)'}\n`;
      output += `- **备注**: ${template.remark || '(无)'}\n`;
      if (template.audit_reason) {
        output += `- **审核理由**: ${template.audit_reason}\n`;
      }
      output += '\n';
    });

    output += `💡 提示：\n`;
    output += `- 使用 \`get_share_template_info\` 工具查询指定模版的详细信息\n`;
    output += `- 只有状态为"已通过"（status = 1）的模版才能在客户端使用\n`;
    output += `- 客户端调用时，使用 \`template_code\` 作为 \`tap.showShareboard()\` 的 \`templateId\` 参数\n\n`;
    output += `⚠️ **模版管理说明**：\n`;
    output += `- 如需修改或删除模版，请前往 TapTap 开发者中心操作\n`;
    output += `- 开发者中心地址：https://developer.taptap.cn\n`;
    output += `- 登录后进入应用管理 → 分享模版管理`;

    return output;
  } catch (error) {
    if (error instanceof Error) {
      return `❌ 查询分享模版列表失败：${error.message}`;
    }
    return `❌ 查询分享模版列表失败：${String(error)}`;
  }
}

/**
 * Get share template information
 */
export async function getShareTemplateInfo(
  args: {
    developer_id?: number;
    app_id?: number;
    template_code: string;
  },
  context: ResolvedContext
): Promise<string> {
  try {
    // Resolve developer_id and app_id from context (priority: args > context > cache)
    const resolved = context.resolveApp();
    const developerId = args.developer_id ?? resolved.developerId;
    const appId = args.app_id ?? resolved.appId;

    if (!developerId || !appId) {
      return (
        `❌ 无法获取 developer_id 或 app_id\n\n` +
        `请通过以下方式之一提供应用信息：\n` +
        `1. 使用 select_app 工具选择应用（会自动缓存）\n` +
        `2. 通过上下文传递\n` +
        `3. 在参数中直接指定 developer_id 和 app_id\n\n` +
        `提示：使用 list_developers_and_apps 查看可用的应用列表`
      );
    }

    if (!args.template_code) {
      return `❌ 缺少必填参数：template_code\n\n` + `请提供模版代码（template_code）`;
    }

    const result = await api.getShareTemplateInfo(
      {
        developer_id: developerId,
        app_id: appId,
        template_code: args.template_code,
      },
      context
    );

    const template = result.info;
    const statusDesc =
      ShareTemplateStatusDescriptions[
        template.status as keyof typeof ShareTemplateStatusDescriptions
      ] || `未知(${template.status})`;
    const statusIcon =
      template.status === 1
        ? '✅'
        : template.status === 2
          ? '❌'
          : template.status === 0
            ? '⏳'
            : '⚠️';

    let output = `${statusIcon} **分享模版信息**\n\n`;
    output += `- **模版 ID**: ${template.id}\n`;
    output += `- **模版代码**: ${template.template_code}\n`;
    output += `- **小程序 ID**: ${template.miniapp_id}\n`;
    output += `- **状态**: ${statusDesc}\n`;
    output += `- **描述**: ${template.contents || '(无)'}\n`;
    output += `- **备注**: ${template.remark || '(无)'}\n`;
    if (template.audit_reason) {
      output += `- **审核理由**: ${template.audit_reason}\n`;
    }

    output += '\n💡 使用提示：\n';
    if (template.status === 1) {
      output += `- ✅ 模版已通过审核，可以在客户端使用\n`;
    } else if (template.status === 0) {
      output += `- ⏳ 模版待审核，请等待审核通过后再使用\n`;
    } else if (template.status === 2) {
      output += `- ❌ 模版审核被拒绝，请查看审核理由并修改后重新提交\n`;
    } else {
      output += `- ⚠️ 模版审核异常，请联系 TapTap 客服\n`;
    }
    output += `- 客户端调用时，使用 \`template_code\` 作为 \`tap.showShareboard()\` 的 \`templateId\` 参数\n`;
    output += `\`\`\`javascript\n`;
    output += `tap.showShareboard({\n`;
    output += `  templateId: "${template.template_code}",\n`;
    output += `  sceneParam: "your_scene_param",\n`;
    output += `  success: function (res) {\n`;
    output += `    console.log("分享面板已显示");\n`;
    output += `  }\n`;
    output += `});\n`;
    output += `\`\`\`\n\n`;
    output += `⚠️ **模版管理说明**：\n`;
    output += `- 如需修改或删除此模版，请前往 TapTap 开发者中心操作\n`;
    output += `- 开发者中心地址：https://developer.taptap.cn\n`;
    output += `- 登录后进入应用管理 → 分享模版管理`;

    return output;
  } catch (error) {
    if (error instanceof Error) {
      return `❌ 查询分享模版信息失败：${error.message}`;
    }
    return `❌ 查询分享模版信息失败：${String(error)}`;
  }
}
