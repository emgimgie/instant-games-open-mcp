"""TapTap 排行榜文档工具测试"""

import pytest
from mcp.types import TextContent

from taptap_mcp.tools.leaderboard_docs_tools import (
    handle_search_leaderboard_docs,
    handle_get_leaderboard_methods,
    handle_get_leaderboard_method_docs,
    handle_get_leaderboard_patterns,
    handle_get_leaderboard_best_practices
)


@pytest.mark.asyncio
class TestLeaderboardDocsTools:
    """排行榜文档工具测试类"""

    async def test_search_leaderboard_docs_by_keyword(self):
        """测试通过关键词搜索排行榜文档"""
        result = await handle_search_leaderboard_docs({"query": "排行榜"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "TapTap 排行榜系统" in result[0].text
        assert "tap.getLeaderboardManager()" in result[0].text

    async def test_search_leaderboard_docs_by_method(self):
        """测试通过方法名搜索文档"""
        result = await handle_search_leaderboard_docs({"method": "submitScores"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "批量提交分数" in result[0].text
        assert "submitScores" in result[0].text

    async def test_search_leaderboard_docs_no_params(self):
        """测试没有提供搜索参数"""
        result = await handle_search_leaderboard_docs({})

        assert len(result) == 1
        assert "请提供搜索关键词" in result[0].text

    async def test_get_leaderboard_methods(self):
        """测试获取所有排行榜方法概览"""
        result = await handle_get_leaderboard_methods({})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "TapTap 排行榜 API 方法概览" in result[0].text
        assert "openLeaderboard" in result[0].text
        assert "submitScores" in result[0].text
        assert "loadLeaderboardScores" in result[0].text

    async def test_get_leaderboard_method_docs_submit_scores(self):
        """测试获取 submitScores 方法详细文档"""
        result = await handle_get_leaderboard_method_docs({"method": "submitScores"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "批量提交分数" in result[0].text
        assert "ScoreSubmission[]" in result[0].text
        assert "leaderboardId" in result[0].text
        assert "代码示例" in result[0].text

    async def test_get_leaderboard_method_docs_load_scores(self):
        """测试获取 loadLeaderboardScores 方法文档"""
        result = await handle_get_leaderboard_method_docs({"method": "loadLeaderboardScores"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "加载排行榜数据" in result[0].text
        assert "分页获取" in result[0].text
        assert "LeaderboardEntry[]" in result[0].text

    async def test_get_leaderboard_method_docs_current_player(self):
        """测试获取当前用户排名方法文档"""
        result = await handle_get_leaderboard_method_docs({"method": "loadCurrentPlayerLeaderboardScore"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "获取当前用户排名" in result[0].text
        assert "PlayerLeaderboardScore" in result[0].text
        assert "rank" in result[0].text

    async def test_get_leaderboard_method_docs_centered_scores(self):
        """测试获取附近玩家分数方法文档"""
        result = await handle_get_leaderboard_method_docs({"method": "loadPlayerCenteredScores"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "查询附近玩家分数" in result[0].text
        assert "isCurrentPlayer" in result[0].text
        assert "以当前用户为中心" in result[0].text

    async def test_get_leaderboard_method_docs_open_leaderboard(self):
        """测试获取打开排行榜方法文档"""
        result = await handle_get_leaderboard_method_docs({"method": "openLeaderboard"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "打开排行榜页面" in result[0].text
        assert "Promise<void>" in result[0].text

    async def test_get_leaderboard_method_docs_invalid_method(self):
        """测试无效方法名"""
        result = await handle_get_leaderboard_method_docs({"method": "invalidMethod"})

        assert len(result) == 1
        assert "未找到方法" in result[0].text
        assert "可用方法" in result[0].text

    async def test_get_leaderboard_method_docs_no_method(self):
        """测试没有提供方法名"""
        result = await handle_get_leaderboard_method_docs({})

        assert len(result) == 1
        assert "请指定要查看的方法名" in result[0].text

    async def test_get_leaderboard_patterns_overview(self):
        """测试获取排行榜开发模式概览"""
        result = await handle_get_leaderboard_patterns({})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "TapTap 排行榜常用开发模式" in result[0].text
        assert "完整排行榜功能集成" in result[0].text
        assert "实时排行榜更新" in result[0].text

    async def test_get_leaderboard_patterns_integration(self):
        """测试获取排行榜集成模式"""
        result = await handle_get_leaderboard_patterns({"pattern": "leaderboard_integration"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "完整排行榜功能集成" in result[0].text
        assert "GameLeaderboard" in result[0].text
        assert "submitGameScore" in result[0].text

    async def test_get_leaderboard_patterns_real_time(self):
        """测试获取实时排行榜模式"""
        result = await handle_get_leaderboard_patterns({"pattern": "real_time_leaderboard"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "实时排行榜更新" in result[0].text
        assert "RealTimeLeaderboard" in result[0].text
        assert "startRealTimeUpdates" in result[0].text

    async def test_get_leaderboard_best_practices(self):
        """测试获取排行榜最佳实践"""
        result = await handle_get_leaderboard_best_practices({})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "排行榜最佳实践" in result[0].text
        assert "性能优化" in result[0].text
        assert "用户体验" in result[0].text
        assert "错误处理" in result[0].text
        assert "安全性" in result[0].text
        assert "常见错误处理" in result[0].text

    async def test_search_leaderboard_docs_score_keyword(self):
        """测试搜索分数相关文档"""
        result = await handle_search_leaderboard_docs({"query": "分数"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "TapTap 排行榜系统" in result[0].text
        assert "分数提交" in result[0].text

    async def test_search_leaderboard_docs_ranking_keyword(self):
        """测试搜索排名相关文档"""
        result = await handle_search_leaderboard_docs({"query": "排名"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "排行榜系统" in result[0].text