"""TapTap 小游戏 MCP 服务器主程序"""

import asyncio
import sys
from typing import Any, Dict, List, Sequence
import structlog
from mcp.server import Server
from mcp.types import Tool, TextContent

from .config import settings
from .tools import (
    MINIGAME_TOOLS,
    handle_search_minigames,
    handle_get_minigame_details,
    handle_get_minigame_reviews,
    handle_get_featured_minigames
)
from .tools.documentation_tools import (
    handle_search_api_docs,
    handle_get_api_categories,
    handle_get_code_examples,
    handle_get_api_best_practices
)
from .tools.leaderboard_docs_tools import (
    handle_search_leaderboard_docs,
    handle_get_leaderboard_methods,
    handle_get_leaderboard_method_docs,
    handle_get_leaderboard_patterns,
    handle_get_leaderboard_best_practices
)

# 配置日志
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger(__name__)

# 创建 MCP 服务器实例
app = Server(name=settings.server_name)

# 文档工具定义
DOCUMENTATION_TOOLS = [
    Tool(
        name="search_api_docs",
        description="搜索 TapTap 小游戏 API 文档",
        inputSchema={
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "搜索关键词，如：登录、认证、游戏、用户等"
                },
                "category": {
                    "type": "string",
                    "description": "文档分类，如：authentication、user_system、game_lifecycle 等",
                    "enum": ["authentication", "game_lifecycle", "asset_management",
                            "user_system", "analytics", "monetization", "sdk_integration", "common_patterns"]
                }
            }
        }
    ),
    Tool(
        name="get_api_categories",
        description="获取所有 API 文档分类和概览",
        inputSchema={
            "type": "object",
            "properties": {}
        }
    ),
    Tool(
        name="get_code_examples",
        description="获取特定分类的详细代码示例",
        inputSchema={
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "description": "API 分类名称",
                    "enum": ["authentication", "game_lifecycle", "asset_management",
                            "user_system", "analytics", "monetization", "sdk_integration", "common_patterns"]
                },
                "platform": {
                    "type": "string",
                    "description": "平台名称（仅用于 SDK 集成），如：unity、cocos",
                    "enum": ["unity", "cocos"]
                }
            },
            "required": ["category"]
        }
    ),
    Tool(
        name="get_api_best_practices",
        description="获取 TapTap API 使用的最佳实践和开发建议",
        inputSchema={
            "type": "object",
            "properties": {}
        }
    )
]

# 排行榜文档工具定义
LEADERBOARD_TOOLS = [
    Tool(
        name="search_minigame_leaderboard_docs",
        description="搜索 TapTap 小游戏内排行榜 API 文档 - 专用于游戏内玩家竞技排名功能",
        inputSchema={
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "搜索关键词，如：排行榜、分数、排名等"
                },
                "method": {
                    "type": "string",
                    "description": "具体方法名",
                    "enum": ["openLeaderboard", "submitScores", "loadLeaderboardScores",
                            "loadCurrentPlayerLeaderboardScore", "loadPlayerCenteredScores"]
                }
            }
        }
    ),
    Tool(
        name="get_minigame_leaderboard_methods",
        description="获取小游戏内排行榜系统的所有方法概览 - 专用于游戏内玩家竞技排名功能",
        inputSchema={
            "type": "object",
            "properties": {}
        }
    ),
    Tool(
        name="get_minigame_leaderboard_method_docs",
        description="获取指定小游戏内排行榜方法的详细文档和代码示例 - 专用于游戏内玩家竞技排名功能",
        inputSchema={
            "type": "object",
            "properties": {
                "method": {
                    "type": "string",
                    "description": "排行榜方法名",
                    "enum": ["openLeaderboard", "submitScores", "loadLeaderboardScores",
                            "loadCurrentPlayerLeaderboardScore", "loadPlayerCenteredScores"],
                    "required": True
                }
            },
            "required": ["method"]
        }
    ),
    Tool(
        name="get_leaderboard_patterns",
        description="获取排行榜常用开发模式和完整示例",
        inputSchema={
            "type": "object",
            "properties": {
                "pattern": {
                    "type": "string",
                    "description": "开发模式类型",
                    "enum": ["leaderboard_integration", "real_time_leaderboard"]
                }
            }
        }
    ),
    Tool(
        name="get_minigame_leaderboard_best_practices",
        description="获取排行榜开发最佳实践和错误处理指南",
        inputSchema={
            "type": "object",
            "properties": {}
        }
    )
]

# 工具处理函数映射
TOOL_HANDLERS = {
    "search_minigames": handle_search_minigames,
    "get_minigame_details": handle_get_minigame_details,
    "get_minigame_reviews": handle_get_minigame_reviews,
    "get_featured_minigames": handle_get_featured_minigames,
    "search_api_docs": handle_search_api_docs,
    "get_api_categories": handle_get_api_categories,
    "get_code_examples": handle_get_code_examples,
    "get_api_best_practices": handle_get_api_best_practices,
    "search_minigame_leaderboard_docs": handle_search_leaderboard_docs,
    "get_minigame_leaderboard_methods": handle_get_leaderboard_methods,
    "get_minigame_leaderboard_method_docs": handle_get_leaderboard_method_docs,
    "get_leaderboard_patterns": handle_get_leaderboard_patterns,
    "get_minigame_leaderboard_best_practices": handle_get_leaderboard_best_practices,
}


@app.list_tools()
async def list_tools() -> List[Tool]:
    """列出所有可用的工具"""
    logger.info("列出可用工具", tool_count=len(MINIGAME_TOOLS))

    # 合并所有工具
    all_tools = []
    all_tools.extend(MINIGAME_TOOLS)
    all_tools.extend(DOCUMENTATION_TOOLS)
    all_tools.extend(LEADERBOARD_TOOLS)

    return all_tools


@app.call_tool()
async def call_tool(name: str, arguments: Dict[str, Any]) -> Sequence[TextContent]:
    """处理工具调用"""
    logger.info("工具调用", tool_name=name, arguments=arguments)

    try:
        # 检查工具是否存在
        if name not in TOOL_HANDLERS:
            logger.error("未知工具", tool_name=name)
            return [TextContent(
                type="text",
                text=f"错误: 未知的工具 '{name}'"
            )]

        # 调用对应的处理函数
        handler = TOOL_HANDLERS[name]
        result = await handler(arguments)

        logger.info("工具调用成功", tool_name=name)
        return result

    except Exception as e:
        logger.error("工具调用失败", tool_name=name, error=str(e), exc_info=True)
        return [TextContent(
            type="text",
            text=f"工具调用失败: {str(e)}"
        )]


async def main():
    """主程序入口"""
    logger.info(
        "启动 TapTap 小游戏 MCP 服务器",
        server_name=settings.server_name,
        version=settings.server_version,
        environment=settings.environment
    )

    try:
        # 从标准输入输出运行 MCP 服务器
        from mcp.server.stdio import stdio_server

        async with stdio_server() as streams:
            await app.run(
                streams[0],  # stdin
                streams[1],  # stdout
                app.create_initialization_options()
            )

    except KeyboardInterrupt:
        logger.info("收到中断信号，关闭服务器")
    except Exception as e:
        logger.error("服务器运行失败", error=str(e), exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    # 检查必需的配置
    if not settings.api_key:
        logger.error("缺少 TAPTAP_API_KEY 环境变量")
        sys.exit(1)

    # 运行服务器
    asyncio.run(main())