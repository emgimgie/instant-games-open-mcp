"""MCP 工具模块"""

from .minigame_tools import (
    MINIGAME_TOOLS,
    handle_search_minigames,
    handle_get_minigame_details,
    handle_get_minigame_reviews,
    handle_get_featured_minigames
)

# 导出所有工具和处理函数
__all__ = [
    "MINIGAME_TOOLS",
    "handle_search_minigames",
    "handle_get_minigame_details",
    "handle_get_minigame_reviews",
    "handle_get_featured_minigames"
]