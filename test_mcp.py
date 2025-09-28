#!/usr/bin/env python3
"""简单的 MCP 服务器测试脚本"""

import asyncio
import json
import sys
import os

# 添加 src 目录到 Python 路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from taptap_mcp.server import list_tools, call_tool


async def test_mcp_server():
    """测试 MCP 服务器基本功能"""
    try:
        # 测试列出工具
        tools = await list_tools()
        print(f"✅ 服务器启动成功，发现 {len(tools)} 个工具:")

        for tool in tools:
            print(f"  - {tool.name}: {tool.description}")

        # 测试调用一个简单的工具
        print("\n🔍 测试获取排行榜方法概览...")
        result = await call_tool("get_leaderboard_methods", {})

        if result and len(result) > 0:
            print("✅ 排行榜方法概览测试成功")
            print(f"返回内容长度: {len(result[0].text)} 字符")
        else:
            print("❌ 排行榜方法概览测试失败")

        # 测试搜索文档
        print("\n🔍 测试搜索排行榜文档...")
        result = await call_tool("search_leaderboard_docs", {"query": "排行榜"})

        if result and len(result) > 0:
            print("✅ 搜索排行榜文档测试成功")
            print(f"返回内容长度: {len(result[0].text)} 字符")
        else:
            print("❌ 搜索排行榜文档测试失败")

        print("\n🎉 MCP 服务器测试完成！")

    except Exception as e:
        print(f"❌ 测试失败: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_mcp_server())