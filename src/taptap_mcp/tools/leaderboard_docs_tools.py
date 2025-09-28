"""TapTap 排行榜 API 文档查询工具"""

from typing import List
from mcp.types import TextContent

from ..data.leaderboard_docs import LEADERBOARD_API_DOCUMENTATION, LEADERBOARD_SEARCH_INDEX


async def handle_search_leaderboard_docs(arguments: dict) -> List[TextContent]:
    """搜索排行榜 API 文档"""
    query = arguments.get("query", "").lower()
    method = arguments.get("method")

    if not query and not method:
        return [TextContent(
            type="text",
            text="请提供搜索关键词或指定方法名（如：openLeaderboard、submitScores等）"
        )]

    # 如果指定了方法，直接返回该方法的文档
    if method:
        return await get_method_documentation(method)

    # 关键词搜索
    leaderboard_section = LEADERBOARD_API_DOCUMENTATION["leaderboard_system"]

    # 搜索匹配的内容
    results = []
    for keyword in LEADERBOARD_SEARCH_INDEX["keywords"]:
        if keyword in query or query in keyword:
            content = format_leaderboard_overview(leaderboard_section)
            return [TextContent(type="text", text=content)]

    # 如果没有找到关键词匹配，返回概览
    if not results:
        overview = format_leaderboard_overview(leaderboard_section)
        return [TextContent(
            type="text",
            text=f"**搜索结果：'{query}'**\n\n{overview}\n\n💡 使用具体方法名获取详细文档，如：get_leaderboard_method_docs(method=\"submitScores\")"
        )]


async def handle_get_leaderboard_methods(arguments: dict) -> List[TextContent]:
    """获取所有排行榜方法概览"""
    leaderboard_section = LEADERBOARD_API_DOCUMENTATION["leaderboard_system"]

    content = "**TapTap 排行榜 API 方法概览**\n\n"
    content += f"{leaderboard_section['description']}\n\n"

    content += "**管理器获取方式：**\n"
    content += f"```javascript\n{leaderboard_section['overview']['manager_access']}\n```\n\n"

    content += "**核心功能：**\n"
    for feature in leaderboard_section['overview']['core_features']:
        content += f"- {feature}\n"
    content += "\n"

    content += "**可用方法：**\n"
    for method_name, description in LEADERBOARD_SEARCH_INDEX["methods"].items():
        content += f"- `{method_name}()` - {description}\n"

    content += "\n💡 使用 `get_leaderboard_method_docs` 获取具体方法的详细文档和代码示例"

    return [TextContent(type="text", text=content)]


async def handle_get_leaderboard_method_docs(arguments: dict) -> List[TextContent]:
    """获取指定排行榜方法的详细文档"""
    method = arguments.get("method")

    if not method:
        return [TextContent(
            type="text",
            text="请指定要查看的方法名，可用方法：\n" +
                 "\n".join([f"- {name}" for name in LEADERBOARD_SEARCH_INDEX["methods"].keys()])
        )]

    return await get_method_documentation(method)


async def handle_get_leaderboard_patterns(arguments: dict) -> List[TextContent]:
    """获取排行榜常用开发模式"""
    pattern_type = arguments.get("pattern", "").lower()

    leaderboard_section = LEADERBOARD_API_DOCUMENTATION["leaderboard_system"]
    patterns = leaderboard_section.get("common_patterns", {})

    if pattern_type and pattern_type in patterns:
        # 返回指定模式
        pattern = patterns[pattern_type]
        content = f"**{pattern['name']}**\n\n{pattern['description']}\n\n"
        content += f"```javascript\n{pattern['code']}\n```\n"
        return [TextContent(type="text", text=content)]

    # 返回所有模式概览
    content = "**TapTap 排行榜常用开发模式**\n\n"

    for pattern_key, pattern in patterns.items():
        content += f"## {pattern['name']}\n\n"
        content += f"{pattern['description']}\n\n"
        content += "**主要功能：**\n"

        # 提取代码中的主要功能点
        if "leaderboard_integration" in pattern_key:
            content += "- 游戏开始时初始化排行榜\n"
            content += "- 提交游戏分数并检查排名变化\n"
            content += "- 显示当前排名和竞争对手\n"
            content += "- 处理网络错误和重试机制\n"
        elif "real_time_leaderboard" in pattern_key:
            content += "- 实时更新排行榜数据\n"
            content += "- 页面可见性优化\n"
            content += "- 并行数据获取\n"
            content += "- 错误处理和降级\n"

        content += f"\n💡 使用 `get_leaderboard_patterns(pattern=\"{pattern_key}\")` 获取完整代码\n\n"

    return [TextContent(type="text", text=content)]


async def handle_get_leaderboard_best_practices(arguments: dict) -> List[TextContent]:
    """获取排行榜最佳实践"""
    leaderboard_section = LEADERBOARD_API_DOCUMENTATION["leaderboard_system"]
    best_practices = leaderboard_section.get("best_practices", {})

    content = f"**{best_practices['title']}**\n\n"

    for practice_group in best_practices['practices']:
        content += f"## {practice_group['category']}\n\n"
        for item in practice_group['items']:
            content += f"- {item}\n"
        content += "\n"

    # 添加错误处理指南
    error_codes = leaderboard_section.get("error_codes", {})
    if error_codes:
        content += "## 常见错误处理\n\n"
        for error in error_codes.get("common_errors", []):
            content += f"**{error['code']}**: {error['description']}\n"
            content += f"解决方案: {error['solution']}\n\n"

    return [TextContent(type="text", text=content)]


async def get_method_documentation(method: str) -> List[TextContent]:
    """获取指定方法的详细文档"""
    leaderboard_section = LEADERBOARD_API_DOCUMENTATION["leaderboard_system"]

    # 查找对应的API方法
    method_doc = None
    for api in leaderboard_section.get("apis", []):
        if api["method"] == method:
            method_doc = api
            break

    if not method_doc:
        available_methods = [api["method"] for api in leaderboard_section.get("apis", [])]
        return [TextContent(
            type="text",
            text=f"未找到方法 '{method}'。\n\n可用方法：\n" +
                 "\n".join([f"- {m}" for m in available_methods])
        )]

    # 格式化方法文档
    content = f"# {method_doc['name']}\n\n"
    content += f"**方法签名**: `{method_doc['signature']}`\n\n"
    content += f"{method_doc['description']}\n\n"

    # 参数说明
    if method_doc.get("parameters"):
        content += "## 参数\n\n"
        for param_name, param_info in method_doc["parameters"].items():
            if isinstance(param_info, dict):
                content += f"- `{param_name}` ({param_info['type']}): {param_info['description']}\n"
                if param_info.get("required"):
                    content += "  - **必需参数**\n"
                if param_info.get("properties"):
                    content += "  - 属性：\n"
                    for prop, desc in param_info["properties"].items():
                        content += f"    - `{prop}`: {desc}\n"
            else:
                content += f"- `{param_name}`: {param_info}\n"
        content += "\n"

    # 返回值说明
    if method_doc.get("returns"):
        returns = method_doc["returns"]
        content += "## 返回值\n\n"
        content += f"**类型**: `{returns['type']}`\n\n"
        content += f"{returns['description']}\n\n"

        if returns.get("properties"):
            content += "**返回对象属性**:\n"
            for prop, desc in returns["properties"].items():
                content += f"- `{prop}`: {desc}\n"
            content += "\n"

    # 代码示例
    if method_doc.get("example"):
        content += "## 代码示例\n\n"
        content += f"```javascript{method_doc['example']}\n```\n\n"

    # 使用场景
    if method_doc.get("use_cases"):
        content += "## 使用场景\n\n"
        for use_case in method_doc["use_cases"]:
            content += f"- {use_case}\n"
        content += "\n"

    # 最佳实践
    if method_doc.get("best_practices"):
        content += "## 最佳实践\n\n"
        for practice in method_doc["best_practices"]:
            content += f"- {practice}\n"
        content += "\n"

    # 错误处理
    if method_doc.get("error_handling"):
        content += "## 错误处理\n\n"
        for error_type, handling in method_doc["error_handling"].items():
            content += f"**{error_type}**: {handling}\n"
        content += "\n"

    return [TextContent(type="text", text=content)]


def format_leaderboard_overview(section: dict) -> str:
    """格式化排行榜概览"""
    content = f"## {section['title']}\n\n{section['description']}\n\n"

    # 管理器访问方式
    content += "**管理器获取**:\n"
    content += f"```javascript\n{section['overview']['manager_access']}\n```\n\n"

    # 核心功能
    content += "**核心功能**:\n"
    for feature in section['overview']['core_features']:
        content += f"- {feature}\n"
    content += "\n"

    # 数据类型
    content += "**主要数据类型**:\n"
    for data_type, desc in section['overview']['data_types'].items():
        content += f"- `{data_type}`: {desc}\n"
    content += "\n"

    # 可用方法
    content += "**可用方法**:\n"
    for api in section.get("apis", []):
        content += f"- `{api['method']}()` - {api['name']}\n"
    content += "\n"

    return content