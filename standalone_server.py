#!/usr/bin/env python3
"""
独立的 TapTap 排行榜 MCP SHTTP 服务器
"""

import asyncio
import os
import sys
from typing import Annotated

from fastmcp import FastMCP
from pydantic import Field

# 添加src目录到路径
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

try:
    from taptap_mcp.data.leaderboard_docs import LEADERBOARD_API_DOCUMENTATION
except ImportError:
    # 如果导入失败，使用简化的文档数据
    LEADERBOARD_API_DOCUMENTATION = {
        "leaderboard_system": {
            "description": "TapTap 排行榜系统为小游戏提供完整的排名功能",
            "methods": {
                "openLeaderboard": {
                    "description": "打开排行榜界面",
                    "syntax": "leaderboard.openLeaderboard(leaderboardId)",
                    "parameters": [{"name": "leaderboardId", "type": "string", "description": "排行榜ID"}],
                    "example": """
```javascript
leaderboard.openLeaderboard("weekly_score", {
    success: function() { console.log("排行榜界面已打开"); },
    fail: function(error) { console.error("打开排行榜失败:", error); }
});
```"""
                },
                "submitScores": {
                    "description": "提交玩家分数到排行榜",
                    "syntax": "leaderboard.submitScores(scores)",
                    "parameters": [{"name": "scores", "type": "Array", "description": "分数数据数组"}],
                    "example": """
```javascript
leaderboard.submitScores([{
    leaderboardId: "weekly_score",
    score: 1200,
    metadata: { level: 5, time: 120 }
}], {
    success: function(result) { console.log("分数提交成功:", result); },
    fail: function(error) { console.error("分数提交失败:", error); }
});
```"""
                }
            }
        }
    }

# 创建独立的MCP服务器
app = FastMCP(
    name="taptap-minigame-leaderboard-mcp"
)


@app.tool()
async def search_minigame_leaderboard_docs(
    query: Annotated[str, Field(description="搜索小游戏内排行榜功能相关关键词，如：排行榜、分数提交、排名查询、游戏排行等")],
    method: Annotated[str | None, Field(description="小游戏排行榜具体方法名", json_schema_extra={"enum": ["openLeaderboard", "submitScores", "loadLeaderboardScores", "loadCurrentPlayerLeaderboardScore", "loadPlayerCenteredScores"]})] = None,
) -> str:
    """搜索 TapTap 小游戏内排行榜系统 API 文档 - 专用于游戏内玩家竞技排名功能"""

    leaderboard_methods = LEADERBOARD_API_DOCUMENTATION["leaderboard_system"]["methods"]

    if method and method in leaderboard_methods:
        method_doc = leaderboard_methods[method]
        return f"""
# {method} 方法详细文档

## 描述
{method_doc["description"]}

## 语法
{method_doc["syntax"]}

## 参数
{chr(10).join([f"- **{p['name']}** ({p['type']}): {p['description']}" for p in method_doc["parameters"]])}

## 示例代码
{method_doc["example"]}
"""

    # 返回概览
    content = "# TapTap 小游戏内排行榜系统 API 文档\n\n"
    content += "🎮 **专用于游戏内玩家竞技排名功能** 🎮\n\n"
    content += f"{LEADERBOARD_API_DOCUMENTATION['leaderboard_system']['description']}\n\n"
    content += "## 可用方法\n"

    for name, info in leaderboard_methods.items():
        content += f"- **{name}**: {info['description']}\n"

    content += "\n💡 使用 get_minigame_leaderboard_method_docs 获取具体方法的详细文档\n"
    content += "\n⚠️ 注意：此工具专门用于游戏内排行榜功能，不用于 TapTap 平台管理"
    return content


@app.tool()
async def get_minigame_leaderboard_methods() -> str:
    """获取小游戏内排行榜系统的所有方法概览 - 专用于游戏内玩家竞技排名功能"""

    content = "# TapTap 小游戏内排行榜系统方法概览\n\n"
    content += "🎮 **专用于游戏内玩家竞技排名功能** 🎮\n\n"
    content += f"{LEADERBOARD_API_DOCUMENTATION['leaderboard_system']['description']}\n\n"
    content += "## 管理器获取\n```javascript\nconst leaderboard = tap.getLeaderboardManager();\n```\n\n"
    content += "## 小游戏内排行榜方法\n"

    for method_name, method_info in LEADERBOARD_API_DOCUMENTATION["leaderboard_system"]["methods"].items():
        content += f"\n### {method_name}\n"
        content += f"**描述**: {method_info['description']}\n"
        content += f"**语法**: `{method_info['syntax']}`\n"

    return content


@app.tool()
async def get_minigame_leaderboard_method_docs(
    method: Annotated[str, Field(description="小游戏排行榜方法名", json_schema_extra={"enum": ["openLeaderboard", "submitScores", "loadLeaderboardScores", "loadCurrentPlayerLeaderboardScore", "loadPlayerCenteredScores"]})],
) -> str:
    """获取指定小游戏内排行榜方法的详细文档和代码示例 - 专用于游戏内玩家竞技排名功能"""

    leaderboard_methods = LEADERBOARD_API_DOCUMENTATION["leaderboard_system"]["methods"]

    if method not in leaderboard_methods:
        return f"错误: 方法 '{method}' 不存在。可用方法: {', '.join(leaderboard_methods.keys())}"

    method_doc = leaderboard_methods[method]
    return f"""
# {method} 小游戏内排行榜方法完整文档

🎮 **小游戏内玩家竞技排名功能专用方法** 🎮

## 描述
{method_doc["description"]}

## 语法
```javascript
{method_doc["syntax"]}
```

## 参数详解
{chr(10).join([f"### {p['name']} ({p['type']})\n{p['description']}" for p in method_doc["parameters"]])}

## 完整示例
{method_doc["example"]}

⚠️ **重要提示**：此方法专门用于游戏内排行榜功能，用于玩家之间的竞技排名
"""


@app.tool()
async def get_minigame_leaderboard_best_practices() -> str:
    """获取小游戏内排行榜开发最佳实践和错误处理指南 - 专用于游戏内玩家竞技排名功能"""

    return """
# TapTap 小游戏内排行榜开发最佳实践

🎮 **专用于游戏内玩家竞技排名功能** 🎮

## 1. 分数提交策略
- **批量提交**: 避免频繁的单次提交，建议批量提交分数
- **错误重试**: 实现网络失败时的自动重试机制
- **本地缓存**: 在网络不佳时本地缓存分数，待网络恢复后提交

## 2. 排行榜查询优化
- **分页加载**: 使用 limit 和 offset 实现分页
- **缓存策略**: 合理缓存排行榜数据，避免过于频繁的请求
- **懒加载**: 按需加载排行榜数据

## 3. 用户体验优化
- **加载状态**: 显示加载中状态，提升用户体验
- **错误处理**: 友好的错误提示和处理
- **网络状态检测**: 根据网络状态调整更新频率

## 4. 错误处理示例
```javascript
function handleLeaderboardError(error) {
    switch(error.code) {
        case 'NETWORK_ERROR':
            showMessage("网络连接失败，请检查网络设置");
            break;
        case 'INVALID_SCORE':
            showMessage("分数数据无效，请重试");
            break;
        case 'RATE_LIMIT':
            showMessage("请求过于频繁，请稍后再试");
            break;
        default:
            showMessage("操作失败，请稍后重试");
    }
}
```
"""


if __name__ == "__main__":
    # 使用FastMCP的stdio模式，适用于OpenHands的MCP集成
    app.run()