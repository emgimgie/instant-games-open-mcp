"""小游戏相关 MCP 工具"""

from typing import Any, Dict, List, Sequence
import structlog
from mcp.types import Tool, TextContent
from ..api import api_client, TapTapAPIError

logger = structlog.get_logger(__name__)

# 小游戏工具定义
MINIGAME_TOOLS = [
    Tool(
        name="search_minigames",
        description="搜索 TapTap 小游戏，支持关键词搜索和分类筛选",
        inputSchema={
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "搜索关键词，如游戏名称、标签等"
                },
                "category": {
                    "type": "string",
                    "description": "游戏分类",
                    "enum": ["puzzle", "action", "strategy", "rpg", "casual", "arcade", "adventure", "simulation"]
                },
                "limit": {
                    "type": "integer",
                    "description": "返回结果数量，默认10，最大50",
                    "minimum": 1,
                    "maximum": 50,
                    "default": 10
                }
            },
            "required": ["query"]
        }
    ),

    Tool(
        name="get_minigame_details",
        description="获取指定小游戏的详细信息，包括游戏描述、评分、下载量等",
        inputSchema={
            "type": "object",
            "properties": {
                "game_id": {
                    "type": "string",
                    "description": "小游戏的唯一标识符"
                }
            },
            "required": ["game_id"]
        }
    ),

    Tool(
        name="get_minigame_reviews",
        description="获取小游戏的用户评论和评分",
        inputSchema={
            "type": "object",
            "properties": {
                "game_id": {
                    "type": "string",
                    "description": "小游戏ID"
                },
                "sort": {
                    "type": "string",
                    "description": "评论排序方式",
                    "enum": ["newest", "oldest", "helpful", "rating_high", "rating_low"],
                    "default": "newest"
                },
                "limit": {
                    "type": "integer",
                    "description": "返回评论数量，默认20，最大100",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20
                }
            },
            "required": ["game_id"]
        }
    ),

    Tool(
        name="get_featured_minigames",
        description="获取 TapTap 精选推荐的小游戏",
        inputSchema={
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "description": "游戏分类筛选",
                    "enum": ["puzzle", "action", "strategy", "rpg", "casual", "arcade", "adventure", "simulation"]
                },
                "limit": {
                    "type": "integer",
                    "description": "返回结果数量，默认20，最大50",
                    "minimum": 1,
                    "maximum": 50,
                    "default": 20
                }
            }
        }
    )
]


async def handle_search_minigames(arguments: Dict[str, Any]) -> Sequence[TextContent]:
    """处理搜索小游戏请求"""
    try:
        query = arguments["query"]
        category = arguments.get("category")
        limit = arguments.get("limit", 10)

        logger.info("搜索小游戏", query=query, category=category, limit=limit)

        result = await api_client.search_minigames(
            query=query,
            category=category,
            limit=limit
        )

        games = result.get("games", [])
        total = result.get("total", 0)

        if not games:
            return [TextContent(
                type="text",
                text=f"没有找到匹配 '{query}' 的小游戏。"
            )]

        # 格式化搜索结果
        response_text = f"找到 {total} 个匹配的小游戏（显示前 {len(games)} 个）:\n\n"

        for i, game in enumerate(games, 1):
            response_text += f"{i}. **{game.get('name', '未知游戏')}**\n"
            response_text += f"   - ID: {game.get('id', 'N/A')}\n"
            response_text += f"   - 分类: {game.get('category', '未知')}\n"
            response_text += f"   - 评分: {game.get('rating', 'N/A')}/10\n"
            response_text += f"   - 下载量: {game.get('downloads', 'N/A')}\n"
            response_text += f"   - 简介: {game.get('description', '暂无简介')[:100]}...\n\n"

        return [TextContent(type="text", text=response_text)]

    except TapTapAPIError as e:
        logger.error("API 错误", error=str(e), status_code=e.status_code)
        return [TextContent(
            type="text",
            text=f"搜索失败: {str(e)}"
        )]
    except Exception as e:
        logger.error("未知错误", error=str(e))
        return [TextContent(
            type="text",
            text=f"搜索过程中发生错误: {str(e)}"
        )]


async def handle_get_minigame_details(arguments: Dict[str, Any]) -> Sequence[TextContent]:
    """处理获取游戏详情请求"""
    try:
        game_id = arguments["game_id"]

        logger.info("获取游戏详情", game_id=game_id)

        game = await api_client.get_minigame_details(game_id)

        # 格式化游戏详情
        response_text = f"""**{game.get('name', '未知游戏')}** 游戏详情

**基本信息:**
- 游戏ID: {game.get('id', 'N/A')}
- 开发商: {game.get('developer', '未知')}
- 发布日期: {game.get('release_date', '未知')}
- 分类: {game.get('category', '未知')}
- 标签: {', '.join(game.get('tags', []))}

**评价数据:**
- 评分: {game.get('rating', 'N/A')}/10 ({game.get('rating_count', 0)} 个评分)
- 下载量: {game.get('downloads', 'N/A')}
- 收藏数: {game.get('favorites', 'N/A')}

**版本信息:**
- 当前版本: {game.get('version', 'N/A')}
- 更新时间: {game.get('last_updated', '未知')}
- 文件大小: {game.get('size', 'N/A')}

**游戏描述:**
{game.get('description', '暂无描述')}

**系统要求:**
- 最低系统版本: {game.get('min_os_version', '未知')}
- 支持平台: {', '.join(game.get('platforms', []))}
"""

        return [TextContent(type="text", text=response_text)]

    except TapTapAPIError as e:
        logger.error("API 错误", error=str(e), status_code=e.status_code)
        return [TextContent(
            type="text",
            text=f"获取游戏详情失败: {str(e)}"
        )]
    except Exception as e:
        logger.error("未知错误", error=str(e))
        return [TextContent(
            type="text",
            text=f"获取游戏详情时发生错误: {str(e)}"
        )]


async def handle_get_minigame_reviews(arguments: Dict[str, Any]) -> Sequence[TextContent]:
    """处理获取游戏评论请求"""
    try:
        game_id = arguments["game_id"]
        sort = arguments.get("sort", "newest")
        limit = arguments.get("limit", 20)

        logger.info("获取游戏评论", game_id=game_id, sort=sort, limit=limit)

        result = await api_client.get_minigame_reviews(
            game_id=game_id,
            sort=sort,
            limit=limit
        )

        reviews = result.get("reviews", [])
        stats = result.get("stats", {})

        if not reviews:
            return [TextContent(
                type="text",
                text=f"暂无评论数据。"
            )]

        # 格式化评论数据
        response_text = f"""**游戏评论** (按 {sort} 排序)\n\n"""

        # 添加统计信息
        if stats:
            response_text += f"**评论统计:**\n"
            response_text += f"- 总评论数: {stats.get('total_reviews', 0)}\n"
            response_text += f"- 平均评分: {stats.get('average_rating', 'N/A')}/10\n"
            response_text += f"- 五星评分: {stats.get('rating_5', 0)} 个\n"
            response_text += f"- 四星评分: {stats.get('rating_4', 0)} 个\n"
            response_text += f"- 三星评分: {stats.get('rating_3', 0)} 个\n"
            response_text += f"- 二星评分: {stats.get('rating_2', 0)} 个\n"
            response_text += f"- 一星评分: {stats.get('rating_1', 0)} 个\n\n"

        response_text += f"**用户评论 (显示前 {len(reviews)} 条):**\n\n"

        for i, review in enumerate(reviews, 1):
            response_text += f"{i}. **用户: {review.get('username', '匿名用户')}**\n"
            response_text += f"   - 评分: {review.get('rating', 'N/A')}/10\n"
            response_text += f"   - 时间: {review.get('created_at', '未知')}\n"
            response_text += f"   - 内容: {review.get('content', '无内容')}\n"

            if review.get('helpful_count', 0) > 0:
                response_text += f"   - 有用数: {review.get('helpful_count', 0)}\n"

            response_text += "\n"

        return [TextContent(type="text", text=response_text)]

    except TapTapAPIError as e:
        logger.error("API 错误", error=str(e), status_code=e.status_code)
        return [TextContent(
            type="text",
            text=f"获取评论失败: {str(e)}"
        )]
    except Exception as e:
        logger.error("未知错误", error=str(e))
        return [TextContent(
            type="text",
            text=f"获取评论时发生错误: {str(e)}"
        )]


async def handle_get_featured_minigames(arguments: Dict[str, Any]) -> Sequence[TextContent]:
    """处理获取精选游戏请求"""
    try:
        category = arguments.get("category")
        limit = arguments.get("limit", 20)

        logger.info("获取精选游戏", category=category, limit=limit)

        result = await api_client.get_featured_minigames(
            category=category,
            limit=limit
        )

        games = result.get("games", [])

        if not games:
            category_text = f"分类 '{category}' 的" if category else ""
            return [TextContent(
                type="text",
                text=f"暂无{category_text}精选游戏。"
            )]

        # 格式化精选游戏列表
        category_text = f" - {category} 分类" if category else ""
        response_text = f"**TapTap 精选小游戏{category_text}** (共 {len(games)} 个):\n\n"

        for i, game in enumerate(games, 1):
            response_text += f"{i}. **{game.get('name', '未知游戏')}**\n"
            response_text += f"   - ID: {game.get('id', 'N/A')}\n"
            response_text += f"   - 分类: {game.get('category', '未知')}\n"
            response_text += f"   - 评分: {game.get('rating', 'N/A')}/10\n"
            response_text += f"   - 特色: {game.get('featured_reason', '官方推荐')}\n"
            response_text += f"   - 简介: {game.get('description', '暂无简介')[:80]}...\n\n"

        return [TextContent(type="text", text=response_text)]

    except TapTapAPIError as e:
        logger.error("API 错误", error=str(e), status_code=e.status_code)
        return [TextContent(
            type="text",
            text=f"获取精选游戏失败: {str(e)}"
        )]
    except Exception as e:
        logger.error("未知错误", error=str(e))
        return [TextContent(
            type="text",
            text=f"获取精选游戏时发生错误: {str(e)}"
        )]