"""TapTap API 客户端"""

import asyncio
import json
from typing import Any, Dict, List, Optional
import httpx
import structlog
from ..config import settings

logger = structlog.get_logger(__name__)


class TapTapAPIError(Exception):
    """TapTap API 错误"""

    def __init__(self, message: str, status_code: Optional[int] = None, response_data: Optional[Dict] = None):
        super().__init__(message)
        self.status_code = status_code
        self.response_data = response_data


class TapTapAPIClient:
    """TapTap API 客户端"""

    def __init__(self):
        self.base_url = settings.api_base_url
        self.api_key = settings.api_key
        self.timeout = httpx.Timeout(30.0)

        # 请求限流
        self._request_semaphore = asyncio.Semaphore(10)  # 最多并发10个请求

    async def _make_request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        json_data: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """发起 API 请求"""

        async with self._request_semaphore:
            url = f"{self.base_url.rstrip('/')}/{endpoint.lstrip('/')}"

            # 设置默认头部
            default_headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "User-Agent": f"TapTap-MCP-Server/{settings.server_version}"
            }

            if headers:
                default_headers.update(headers)

            logger.info("API request", method=method, url=url, params=params)

            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.request(
                        method=method,
                        url=url,
                        params=params,
                        json=json_data,
                        headers=default_headers
                    )

                    if response.status_code >= 400:
                        error_data = None
                        try:
                            error_data = response.json()
                        except:
                            pass

                        raise TapTapAPIError(
                            f"API request failed: {response.status_code} {response.reason_phrase}",
                            status_code=response.status_code,
                            response_data=error_data
                        )

                    return response.json()

            except httpx.TimeoutException:
                raise TapTapAPIError("Request timeout")
            except httpx.RequestError as e:
                raise TapTapAPIError(f"Request error: {str(e)}")

    # 小游戏相关 API
    async def search_minigames(
        self,
        query: str,
        category: Optional[str] = None,
        limit: int = 10,
        offset: int = 0
    ) -> Dict[str, Any]:
        """搜索小游戏"""
        params = {
            "q": query,
            "limit": limit,
            "offset": offset
        }

        if category:
            params["category"] = category

        return await self._make_request("GET", "/minigames/search", params=params)

    async def get_minigame_details(self, game_id: str) -> Dict[str, Any]:
        """获取小游戏详情"""
        return await self._make_request("GET", f"/minigames/{game_id}")

    async def get_minigame_reviews(
        self,
        game_id: str,
        sort: str = "newest",
        limit: int = 20,
        offset: int = 0
    ) -> Dict[str, Any]:
        """获取小游戏评论"""
        params = {
            "sort": sort,
            "limit": limit,
            "offset": offset
        }
        return await self._make_request("GET", f"/minigames/{game_id}/reviews", params=params)

    async def get_featured_minigames(
        self,
        category: Optional[str] = None,
        limit: int = 20
    ) -> Dict[str, Any]:
        """获取精选小游戏"""
        params = {"limit": limit}
        if category:
            params["category"] = category

        return await self._make_request("GET", "/minigames/featured", params=params)

    # 用户相关 API
    async def get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """获取用户资料"""
        return await self._make_request("GET", f"/users/{user_id}")

    async def get_user_minigames(
        self,
        user_id: str,
        status: Optional[str] = None,
        limit: int = 50
    ) -> Dict[str, Any]:
        """获取用户小游戏库"""
        params = {"limit": limit}
        if status:
            params["status"] = status

        return await self._make_request("GET", f"/users/{user_id}/minigames", params=params)

    async def get_user_achievements(self, user_id: str, game_id: Optional[str] = None) -> Dict[str, Any]:
        """获取用户成就"""
        params = {}
        if game_id:
            params["game_id"] = game_id

        return await self._make_request("GET", f"/users/{user_id}/achievements", params=params)

    async def update_user_progress(
        self,
        user_id: str,
        game_id: str,
        progress_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """更新用户游戏进度"""
        return await self._make_request(
            "POST",
            f"/users/{user_id}/games/{game_id}/progress",
            json_data=progress_data
        )

    # 排行榜相关 API
    async def get_leaderboards(
        self,
        game_id: str,
        leaderboard_type: str = "global",
        time_range: str = "all_time",
        limit: int = 100
    ) -> Dict[str, Any]:
        """获取排行榜"""
        params = {
            "type": leaderboard_type,
            "time_range": time_range,
            "limit": limit
        }
        return await self._make_request("GET", f"/minigames/{game_id}/leaderboards", params=params)

    async def submit_score(
        self,
        user_id: str,
        game_id: str,
        score: int,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """提交分数"""
        data = {
            "score": score,
            "metadata": metadata or {}
        }
        return await self._make_request(
            "POST",
            f"/users/{user_id}/games/{game_id}/scores",
            json_data=data
        )

    async def get_user_rank(
        self,
        user_id: str,
        game_id: str,
        leaderboard_type: str = "global"
    ) -> Dict[str, Any]:
        """获取用户排名"""
        params = {"type": leaderboard_type}
        return await self._make_request(
            "GET",
            f"/users/{user_id}/games/{game_id}/rank",
            params=params
        )

    # 数据分析 API
    async def get_game_analytics(
        self,
        game_id: str,
        metrics: List[str],
        date_range: str = "30d"
    ) -> Dict[str, Any]:
        """获取游戏分析数据"""
        params = {
            "metrics": ",".join(metrics),
            "date_range": date_range
        }
        return await self._make_request("GET", f"/analytics/games/{game_id}", params=params)

    async def get_market_trends(
        self,
        category: Optional[str] = None,
        time_period: str = "weekly"
    ) -> Dict[str, Any]:
        """获取市场趋势"""
        params = {"time_period": time_period}
        if category:
            params["category"] = category

        return await self._make_request("GET", "/analytics/market-trends", params=params)

    async def get_user_behavior(
        self,
        user_id: str,
        behavior_type: str,
        date_range: str = "30d"
    ) -> Dict[str, Any]:
        """获取用户行为数据"""
        params = {
            "type": behavior_type,
            "date_range": date_range
        }
        return await self._make_request("GET", f"/analytics/users/{user_id}/behavior", params=params)


# 全局 API 客户端实例
api_client = TapTapAPIClient()