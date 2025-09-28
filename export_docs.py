#!/usr/bin/env python3
"""导出完整的 TapTap API 文档，用于 AI 知识库注入"""

import sys
import os
import json

# 添加 src 目录到 Python 路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from taptap_mcp.data.api_docs import API_DOCUMENTATION, API_SEARCH_INDEX


def export_to_markdown():
    """导出为 Markdown 格式"""
    content = """# TapTap 小游戏 API 完整文档

本文档包含 TapTap 小游戏生态的完整 API 文档，用于 AI 开发助手的知识库。

"""

    for category, section in API_DOCUMENTATION.items():
        content += f"## {section['title']} ({category})\n\n"
        content += f"{section['description']}\n\n"

        # 认证方法
        if "methods" in section:
            content += "### 认证方法\n\n"
            for method in section["methods"]:
                content += f"#### {method['name']}\n\n"
                content += f"{method['description']}\n\n"
                content += "**示例代码：**\n"
                content += f"```javascript{method['example']}\n```\n\n"

        # API 端点
        if "apis" in section:
            content += "### API 端点\n\n"
            for api in section["apis"]:
                content += f"#### {api['name']}\n\n"
                content += f"**端点**: `{api['endpoint']}`\n\n"
                content += f"{api['description']}\n\n"

                if "parameters" in api:
                    content += "**参数：**\n"
                    for param, desc in api["parameters"].items():
                        content += f"- `{param}`: {desc}\n"
                    content += "\n"

                if "example" in api:
                    content += "**示例代码：**\n"
                    content += f"```javascript{api['example']}\n```\n\n"

        # SDK 集成指南
        if "guides" in section:
            content += "### SDK 集成指南\n\n"
            for guide in section["guides"]:
                content += f"#### {guide['platform']} 平台\n\n"
                content += f"{guide['description']}\n\n"
                content += "**集成步骤和代码：**\n"
                content += f"```javascript\n{guide['setup']}\n```\n\n"

                if "best_practices" in guide:
                    content += "**最佳实践：**\n"
                    for practice in guide["best_practices"]:
                        content += f"- {practice}\n"
                    content += "\n"

        # 常用模式
        if "patterns" in section:
            content += "### 常用开发模式\n\n"
            for pattern in section["patterns"]:
                content += f"#### {pattern['name']}\n\n"
                content += f"{pattern['description']}\n\n"
                content += "**实现代码：**\n"
                content += f"```javascript\n{pattern['code']}\n```\n\n"

        content += "---\n\n"

    return content


def export_to_json():
    """导出为 JSON 格式"""
    return {
        "documentation": API_DOCUMENTATION,
        "search_index": API_SEARCH_INDEX,
        "metadata": {
            "title": "TapTap 小游戏 API 文档",
            "description": "完整的 TapTap 小游戏开发 API 文档和示例",
            "version": "1.0.0",
            "categories": list(API_DOCUMENTATION.keys())
        }
    }


def export_for_ai_context():
    """导出为适合 AI 上下文的格式"""
    content = """# TapTap 小游戏 API 开发指南

你是一个专业的游戏开发助手，专门帮助开发者使用 TapTap 小游戏 API。以下是完整的 API 文档和最佳实践。

## API 概览

TapTap 小游戏 API 提供以下主要功能：
- 用户认证和管理
- 游戏生命周期管理
- 资源上传和管理
- 数据分析和统计
- 商业化功能
- SDK 集成支持

## 开发者常见问题和解决方案

### Q: 如何实现用户登录？
A: 使用 TapTap OAuth 2.0 或 API Key 认证。推荐使用 SDK 集成：

```javascript
// Unity 示例
await TapLogin.Login();

// JavaScript 示例
const result = await fetch('https://api.taptap.com/v1/user/profile', {
    headers: { 'Authorization': 'Bearer TOKEN' }
});
```

### Q: 如何上传游戏资源？
A: 使用 multipart/form-data 格式上传：

```javascript
const formData = new FormData();
formData.append('type', 'icon');
formData.append('file', iconFile);

await fetch(`https://api.taptap.com/v1/minigames/${gameId}/assets`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer API_KEY' },
    body: formData
});
```

### Q: 如何处理 API 错误？
A: 实现重试机制和错误处理：

```javascript
class APIClient {
    async callAPI(url, options, retryCount = 0) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new APIError(response.status);
            return await response.json();
        } catch (error) {
            if (retryCount < 3 && error.status >= 500) {
                await this.sleep(1000 * Math.pow(2, retryCount));
                return this.callAPI(url, options, retryCount + 1);
            }
            throw error;
        }
    }
}
```

## 详细 API 文档

"""

    # 添加完整的 API 文档
    for category, section in API_DOCUMENTATION.items():
        content += f"### {section['title']}\n\n"
        content += f"{section['description']}\n\n"

        if "apis" in section:
            for api in section["apis"]:
                content += f"**{api['name']}** (`{api['endpoint']}`)\n"
                content += f"{api['description']}\n\n"

        if "methods" in section:
            for method in section["methods"]:
                content += f"**{method['name']}**: {method['description']}\n\n"

    content += """
## 开发建议

当用户询问 TapTap API 相关问题时：

1. **优先提供代码示例** - 用户最需要可直接使用的代码
2. **考虑安全性** - 提醒不要在客户端硬编码 API Key
3. **错误处理** - 总是包含错误处理和重试逻辑
4. **最佳实践** - 提供性能优化和用户体验建议
5. **平台特性** - 根据用户的开发平台（Unity、Cocos等）提供对应示例

## 关键词映射

用户可能使用这些词语询问相关功能：
"""

    for keyword, categories in API_SEARCH_INDEX["keywords"].items():
        category_names = [API_SEARCH_INDEX["categories"][cat] for cat in categories if cat in API_SEARCH_INDEX["categories"]]
        content += f"- \"{keyword}\" → {', '.join(category_names)}\n"

    return content


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法: python export_docs.py <format>")
        print("格式: markdown | json | ai-context")
        sys.exit(1)

    format_type = sys.argv[1].lower()

    if format_type == "markdown":
        content = export_to_markdown()
        filename = "taptap_api_docs.md"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)

    elif format_type == "json":
        content = export_to_json()
        filename = "taptap_api_docs.json"
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(content, f, ensure_ascii=False, indent=2)

    elif format_type == "ai-context":
        content = export_for_ai_context()
        filename = "taptap_api_for_ai.md"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)

    else:
        print(f"不支持的格式: {format_type}")
        sys.exit(1)

    print(f"文档已导出到: {filename}")


if __name__ == "__main__":
    main()