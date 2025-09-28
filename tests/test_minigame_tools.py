"""小游戏工具测试"""

import pytest
from unittest.mock import AsyncMock, patch
from mcp.types import TextContent

from taptap_mcp.tools.minigame_tools import (
    handle_search_minigames,
    handle_get_minigame_details,
    handle_get_minigame_reviews,
    handle_get_featured_minigames
)


@pytest.mark.asyncio
class TestMinigameTools:
    """小游戏工具测试类"""

    @patch('taptap_mcp.tools.minigame_tools.api_client')
    async def test_search_minigames_success(self, mock_api_client):
        """测试搜索小游戏成功"""
        # 模拟 API 响应
        mock_api_client.search_minigames.return_value = {
            "games": [
                {
                    "id": "game1",
                    "name": "测试游戏1",
                    "category": "puzzle",
                    "rating": 8.5,
                    "downloads": "10万+",
                    "description": "这是一个有趣的益智游戏"
                },
                {
                    "id": "game2",
                    "name": "测试游戏2",
                    "category": "action",
                    "rating": 9.0,
                    "downloads": "50万+",
                    "description": "动作冒险游戏"
                }
            ],
            "total": 2
        }

        # 调用函数
        result = await handle_search_minigames({
            "query": "测试",
            "category": "puzzle",
            "limit": 10
        })

        # 验证结果
        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "找到 2 个匹配的小游戏" in result[0].text
        assert "测试游戏1" in result[0].text
        assert "测试游戏2" in result[0].text

        # 验证 API 调用
        mock_api_client.search_minigames.assert_called_once_with(
            query="测试",
            category="puzzle",
            limit=10
        )

    @patch('taptap_mcp.tools.minigame_tools.api_client')
    async def test_search_minigames_no_results(self, mock_api_client):
        """测试搜索小游戏无结果"""
        mock_api_client.search_minigames.return_value = {
            "games": [],
            "total": 0
        }

        result = await handle_search_minigames({
            "query": "不存在的游戏"
        })

        assert len(result) == 1
        assert "没有找到匹配" in result[0].text

    @patch('taptap_mcp.tools.minigame_tools.api_client')
    async def test_get_minigame_details_success(self, mock_api_client):
        """测试获取游戏详情成功"""
        mock_api_client.get_minigame_details.return_value = {
            "id": "game1",
            "name": "测试游戏",
            "developer": "测试开发商",
            "category": "puzzle",
            "rating": 8.5,
            "rating_count": 1000,
            "downloads": "10万+",
            "version": "1.0.0",
            "description": "这是一个测试游戏的详细描述",
            "tags": ["益智", "休闲"],
            "platforms": ["iOS", "Android"]
        }

        result = await handle_get_minigame_details({"game_id": "game1"})

        assert len(result) == 1
        assert "**测试游戏** 游戏详情" in result[0].text
        assert "测试开发商" in result[0].text
        assert "8.5/10" in result[0].text

    @patch('taptap_mcp.tools.minigame_tools.api_client')
    async def test_get_minigame_reviews_success(self, mock_api_client):
        """测试获取游戏评论成功"""
        mock_api_client.get_minigame_reviews.return_value = {
            "reviews": [
                {
                    "username": "测试用户1",
                    "rating": 9,
                    "content": "非常好玩的游戏！",
                    "created_at": "2024-01-01",
                    "helpful_count": 10
                }
            ],
            "stats": {
                "total_reviews": 100,
                "average_rating": 8.5,
                "rating_5": 50,
                "rating_4": 30,
                "rating_3": 15,
                "rating_2": 3,
                "rating_1": 2
            }
        }

        result = await handle_get_minigame_reviews({
            "game_id": "game1",
            "sort": "newest",
            "limit": 20
        })

        assert len(result) == 1
        assert "**游戏评论**" in result[0].text
        assert "测试用户1" in result[0].text
        assert "总评论数: 100" in result[0].text

    @patch('taptap_mcp.tools.minigame_tools.api_client')
    async def test_get_featured_minigames_success(self, mock_api_client):
        """测试获取精选游戏成功"""
        mock_api_client.get_featured_minigames.return_value = {
            "games": [
                {
                    "id": "featured1",
                    "name": "精选游戏1",
                    "category": "action",
                    "rating": 9.2,
                    "featured_reason": "编辑推荐",
                    "description": "精选动作游戏"
                }
            ]
        }

        result = await handle_get_featured_minigames({
            "category": "action",
            "limit": 20
        })

        assert len(result) == 1
        assert "**TapTap 精选小游戏 - action 分类**" in result[0].text
        assert "精选游戏1" in result[0].text
        assert "编辑推荐" in result[0].text

    @patch('taptap_mcp.tools.minigame_tools.api_client')
    async def test_api_error_handling(self, mock_api_client):
        """测试 API 错误处理"""
        from taptap_mcp.api import TapTapAPIError

        mock_api_client.search_minigames.side_effect = TapTapAPIError(
            "API 请求失败",
            status_code=500
        )

        result = await handle_search_minigames({"query": "测试"})

        assert len(result) == 1
        assert "搜索失败" in result[0].text
        assert "API 请求失败" in result[0].text