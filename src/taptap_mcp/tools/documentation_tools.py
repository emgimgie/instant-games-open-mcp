"""TapTap API 文档查询工具"""

from typing import List
from mcp.types import TextContent

from ..data.api_docs import API_DOCUMENTATION, API_SEARCH_INDEX


async def handle_search_api_docs(arguments: dict) -> List[TextContent]:
    """搜索 API 文档"""
    query = arguments.get("query", "").lower()
    category = arguments.get("category")

    if not query and not category:
        return [TextContent(
            type="text",
            text="请提供搜索关键词或指定文档分类"
        )]

    results = []

    # 如果指定了分类，直接返回该分类的文档
    if category and category in API_DOCUMENTATION:
        section = API_DOCUMENTATION[category]
        content = format_documentation_section(category, section)
        return [TextContent(type="text", text=content)]

    # 关键词搜索
    matching_categories = set()

    # 在搜索索引中查找匹配的分类
    for keyword, categories in API_SEARCH_INDEX["keywords"].items():
        if keyword in query:
            matching_categories.update(categories)

    # 如果没有找到匹配的关键词，进行模糊搜索
    if not matching_categories:
        for keyword in API_SEARCH_INDEX["keywords"]:
            if query in keyword or keyword in query:
                matching_categories.update(API_SEARCH_INDEX["keywords"][keyword])

    if not matching_categories:
        return [TextContent(
            type="text",
            text=f"没有找到与 '{query}' 相关的 API 文档。\n\n可用分类：\n" +
                 "\n".join([f"- {cat}: {desc}" for cat, desc in API_SEARCH_INDEX["categories"].items()])
        )]

    # 格式化搜索结果
    result_text = f"**搜索结果：'{query}'**\n\n"

    for category in matching_categories:
        if category in API_DOCUMENTATION:
            section = API_DOCUMENTATION[category]
            result_text += format_documentation_section(category, section) + "\n\n"

    return [TextContent(type="text", text=result_text)]


async def handle_get_api_categories(arguments: dict) -> List[TextContent]:
    """获取所有 API 文档分类"""
    categories_text = "**TapTap 小游戏 API 文档分类**\n\n"

    for category, description in API_SEARCH_INDEX["categories"].items():
        categories_text += f"**{category}**: {description}\n"
        if category in API_DOCUMENTATION:
            section = API_DOCUMENTATION[category]
            categories_text += f"  - {section['title']}\n"
            categories_text += f"  - {section['description']}\n\n"

    return [TextContent(type="text", text=categories_text)]


async def handle_get_code_examples(arguments: dict) -> List[TextContent]:
    """获取代码示例"""
    category = arguments.get("category")
    platform = arguments.get("platform", "").lower()

    if not category:
        return [TextContent(
            type="text",
            text="请指定要查看的 API 分类，例如：authentication, user_system, game_lifecycle 等"
        )]

    if category not in API_DOCUMENTATION:
        return [TextContent(
            type="text",
            text=f"未找到分类 '{category}'。请使用 get_api_categories 查看可用分类。"
        )]

    section = API_DOCUMENTATION[category]
    examples_text = f"**{section['title']} - 代码示例**\n\n"

    # 如果是 SDK 集成分类，根据平台过滤
    if category == "sdk_integration" and platform:
        guides = section.get("guides", [])
        matching_guides = [g for g in guides if platform in g["platform"].lower()]

        if matching_guides:
            for guide in matching_guides:
                examples_text += f"## {guide['platform']} 集成\n\n"
                examples_text += f"{guide['description']}\n\n"
                examples_text += f"```javascript\n{guide['setup']}\n```\n\n"

                if "best_practices" in guide:
                    examples_text += "**最佳实践：**\n"
                    for practice in guide["best_practices"]:
                        examples_text += f"- {practice}\n"
                    examples_text += "\n"
        else:
            examples_text += f"未找到 {platform} 平台的集成指南。\n\n可用平台："
            for guide in guides:
                examples_text += f"\n- {guide['platform']}"

    # 其他分类显示 API 示例
    elif "apis" in section:
        for api in section["apis"]:
            examples_text += f"## {api['name']}\n\n"
            examples_text += f"**端点**: `{api['endpoint']}`\n\n"
            examples_text += f"{api['description']}\n\n"

            if "parameters" in api:
                examples_text += "**参数：**\n"
                for param, desc in api["parameters"].items():
                    examples_text += f"- `{param}`: {desc}\n"
                examples_text += "\n"

            if "example" in api:
                examples_text += "**示例代码：**\n"
                examples_text += f"```javascript{api['example']}\n```\n\n"

    # 常用模式显示代码模式
    elif "patterns" in section:
        for pattern in section["patterns"]:
            examples_text += f"## {pattern['name']}\n\n"
            examples_text += f"{pattern['description']}\n\n"
            examples_text += f"```javascript\n{pattern['code']}\n```\n\n"

    # 认证方式显示方法示例
    elif "methods" in section:
        for method in section["methods"]:
            examples_text += f"## {method['name']}\n\n"
            examples_text += f"{method['description']}\n\n"
            examples_text += f"```javascript{method['example']}\n```\n\n"

    return [TextContent(type="text", text=examples_text)]


async def handle_get_api_best_practices(arguments: dict) -> List[TextContent]:
    """获取 API 使用最佳实践"""
    best_practices_text = """**TapTap 小游戏 API 使用最佳实践**

## 1. 认证和安全
- 🔐 **API Key 安全**: 绝不在客户端代码中硬编码 API Key
- 🔄 **Token 管理**: 定期刷新访问令牌，处理过期情况
- 🛡️ **HTTPS 传输**: 所有 API 请求必须使用 HTTPS
- 📝 **日志安全**: 避免在日志中记录敏感信息

## 2. 错误处理
- ⚡ **优雅降级**: API 失败时提供本地缓存或默认行为
- 🔄 **重试机制**: 实现指数退避的重试策略
- 📊 **错误监控**: 监控 API 调用成功率和响应时间
- 👥 **用户友好**: 向用户显示友好的错误信息

## 3. 性能优化
- 💾 **数据缓存**: 缓存不经常变化的数据（用户信息、游戏配置）
- 📦 **批量操作**: 尽可能使用批量 API 减少请求次数
- ⏱️ **请求超时**: 设置合理的请求超时时间
- 🔄 **数据同步**: 实现增量同步减少数据传输

## 4. 用户体验
- 🎯 **渐进加载**: 优先加载核心功能，延迟加载次要功能
- 📱 **离线支持**: 为网络不稳定场景提供离线模式
- 🔄 **状态同步**: 确保多设备间的游戏状态同步
- 📊 **进度反馈**: 为长时间操作提供进度指示

## 5. 开发建议
- 🧪 **测试环境**: 在开发环境充分测试所有 API 集成
- 📚 **版本管理**: 使用语义化版本号管理 API 版本
- 📖 **文档维护**: 保持 API 使用文档的更新
- 🔍 **监控告警**: 设置 API 调用异常的监控告警

## 6. 数据分析
- 📈 **事件追踪**: 合理设计游戏事件追踪体系
- 👤 **用户行为**: 分析用户行为优化游戏体验
- 💰 **商业指标**: 跟踪关键商业指标（留存、付费等）
- 🎯 **A/B 测试**: 使用数据驱动的方式优化功能

## 示例：错误处理最佳实践

```javascript
class APIClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.maxRetries = 3;
        this.baseDelay = 1000;
    }

    async callAPI(url, options = {}, retryCount = 0) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                timeout: 10000
            });

            if (!response.ok) {
                throw new APIError(response.status, await response.text());
            }

            return await response.json();
        } catch (error) {
            if (retryCount < this.maxRetries && this.shouldRetry(error)) {
                const delay = this.baseDelay * Math.pow(2, retryCount);
                await this.sleep(delay);
                return this.callAPI(url, options, retryCount + 1);
            }

            // 记录错误但不暴露敏感信息
            console.error('API 调用失败:', {
                url: url.replace(/\\/[a-zA-Z0-9]+/g, '/***'),
                status: error.status,
                retryCount
            });

            throw error;
        }
    }

    shouldRetry(error) {
        // 只对网络错误和服务器错误重试
        return error.status >= 500 || error.name === 'NetworkError';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
```
"""

    return [TextContent(type="text", text=best_practices_text)]


def format_documentation_section(category: str, section: dict) -> str:
    """格式化文档区块"""
    content = f"## {section['title']}\n\n{section['description']}\n\n"

    if "apis" in section:
        content += "**可用 API:**\n"
        for api in section["apis"]:
            content += f"- `{api['endpoint']}` - {api['name']}\n"
        content += "\n"

    if "methods" in section:
        content += "**认证方法:**\n"
        for method in section["methods"]:
            content += f"- {method['name']}: {method['description']}\n"
        content += "\n"

    if "guides" in section:
        content += "**支持平台:**\n"
        for guide in section["guides"]:
            content += f"- {guide['platform']}: {guide['description']}\n"
        content += "\n"

    if "patterns" in section:
        content += "**常用模式:**\n"
        for pattern in section["patterns"]:
            content += f"- {pattern['name']}: {pattern['description']}\n"
        content += "\n"

    content += f"💡 使用 `get_code_examples` 查看 {category} 的详细代码示例\n"

    return content