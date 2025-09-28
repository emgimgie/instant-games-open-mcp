"""API 文档工具测试"""

import pytest
from mcp.types import TextContent

from taptap_mcp.tools.documentation_tools import (
    handle_search_api_docs,
    handle_get_api_categories,
    handle_get_code_examples,
    handle_get_api_best_practices
)


@pytest.mark.asyncio
class TestDocumentationTools:
    """API 文档工具测试类"""

    async def test_search_api_docs_by_keyword(self):
        """测试通过关键词搜索文档"""
        result = await handle_search_api_docs({"query": "登录"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "搜索结果" in result[0].text
        assert "认证" in result[0].text or "用户" in result[0].text

    async def test_search_api_docs_by_category(self):
        """测试通过分类搜索文档"""
        result = await handle_search_api_docs({"category": "authentication"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "认证方式" in result[0].text
        assert "OAuth 2.0" in result[0].text

    async def test_search_api_docs_no_query(self):
        """测试没有提供搜索条件"""
        result = await handle_search_api_docs({})

        assert len(result) == 1
        assert "请提供搜索关键词" in result[0].text

    async def test_search_api_docs_no_results(self):
        """测试搜索无结果"""
        result = await handle_search_api_docs({"query": "不存在的关键词"})

        assert len(result) == 1
        assert "没有找到" in result[0].text
        assert "可用分类" in result[0].text

    async def test_get_api_categories(self):
        """测试获取所有文档分类"""
        result = await handle_get_api_categories({})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "TapTap 小游戏 API 文档分类" in result[0].text
        assert "authentication" in result[0].text
        assert "user_system" in result[0].text

    async def test_get_code_examples_authentication(self):
        """测试获取认证相关代码示例"""
        result = await handle_get_code_examples({"category": "authentication"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "认证方式 - 代码示例" in result[0].text
        assert "Authorization: Bearer" in result[0].text

    async def test_get_code_examples_user_system(self):
        """测试获取用户系统代码示例"""
        result = await handle_get_code_examples({"category": "user_system"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "用户系统集成 - 代码示例" in result[0].text
        assert "GET /v1/user/profile" in result[0].text

    async def test_get_code_examples_sdk_integration_unity(self):
        """测试获取 Unity SDK 集成示例"""
        result = await handle_get_code_examples({
            "category": "sdk_integration",
            "platform": "unity"
        })

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "Unity 集成" in result[0].text
        assert "TapTapSDK.Init" in result[0].text

    async def test_get_code_examples_sdk_integration_cocos(self):
        """测试获取 Cocos Creator SDK 集成示例"""
        result = await handle_get_code_examples({
            "category": "sdk_integration",
            "platform": "cocos"
        })

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "Cocos Creator 集成" in result[0].text
        assert "require('taptap-sdk')" in result[0].text

    async def test_get_code_examples_invalid_category(self):
        """测试无效分类"""
        result = await handle_get_code_examples({"category": "invalid_category"})

        assert len(result) == 1
        assert "未找到分类" in result[0].text
        assert "get_api_categories" in result[0].text

    async def test_get_code_examples_no_category(self):
        """测试没有提供分类"""
        result = await handle_get_code_examples({})

        assert len(result) == 1
        assert "请指定要查看的 API 分类" in result[0].text

    async def test_get_api_best_practices(self):
        """测试获取最佳实践"""
        result = await handle_get_api_best_practices({})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "TapTap 小游戏 API 使用最佳实践" in result[0].text
        assert "认证和安全" in result[0].text
        assert "错误处理" in result[0].text
        assert "性能优化" in result[0].text
        assert "APIClient" in result[0].text

    async def test_get_code_examples_common_patterns(self):
        """测试获取常用开发模式"""
        result = await handle_get_code_examples({"category": "common_patterns"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "常用开发模式 - 代码示例" in result[0].text
        assert "用户登录流程" in result[0].text
        assert "游戏数据同步" in result[0].text
        assert "UserManager" in result[0].text

    async def test_get_code_examples_monetization(self):
        """测试获取商业化功能示例"""
        result = await handle_get_code_examples({"category": "monetization"})

        assert len(result) == 1
        assert isinstance(result[0], TextContent)
        assert "商业化功能 - 代码示例" in result[0].text
        assert "创建支付订单" in result[0].text
        assert "/v1/payments/orders" in result[0].text