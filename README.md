# TapTap 小游戏 MCP 服务器

基于 Model Context Protocol (MCP) 的 TapTap 小游戏生态能力 API 服务器。

## 功能特性

### 🎮 小游戏管理
- 小游戏搜索和发现
- 游戏详情和元数据
- 游戏评分和评论
- 游戏分类和标签

### 👤 用户系统
- 用户资料管理
- 游戏库和收藏
- 成就和进度
- 好友和社交

### 🏆 排行榜系统
- 实时排行榜
- 历史最佳成绩
- 多维度排名
- 竞赛和活动

### 📊 数据分析
- 游戏数据统计
- 用户行为分析
- 市场趋势洞察
- 性能监控

### 🛠️ 开发者工具
- 游戏发布管理
- 数据分析仪表板
- A/B 测试支持
- 版本管理

### 📚 API 文档支持
- 智能文档搜索
- 代码示例生成
- 最佳实践指导
- SDK 集成指南

## 快速开始

### 安装依赖
```bash
pip install -r requirements.txt
```

### 配置环境
```bash
cp .env.example .env
# 编辑 .env 文件，添加 TapTap API 密钥
```

### 启动服务器
```bash
python server.py
```

## 集成到 Claude Desktop

在 Claude Desktop 的配置文件中添加：

```json
{
  "mcpServers": {
    "taptap-minigame": {
      "command": "python",
      "args": ["/path/to/taptap-minigame-mcp-server/server.py"],
      "env": {
        "TAPTAP_API_KEY": "your-api-key"
      }
    }
  }
}
```

## API 工具

### 小游戏相关
- `search_minigames` - 搜索小游戏
- `get_minigame_details` - 获取游戏详情
- `get_minigame_reviews` - 获取游戏评论
- `get_featured_minigames` - 获取精选游戏

### 用户相关
- `get_user_profile` - 获取用户资料
- `get_user_minigames` - 获取用户游戏库
- `get_user_achievements` - 获取用户成就
- `update_user_progress` - 更新游戏进度

### 排行榜相关
- `get_leaderboards` - 获取排行榜
- `submit_score` - 提交分数
- `get_user_rank` - 获取用户排名

### 数据分析
- `get_game_analytics` - 获取游戏分析数据
- `get_market_trends` - 获取市场趋势
- `get_user_behavior` - 获取用户行为数据

### API 文档工具
- `search_api_docs` - 搜索 API 文档
- `get_api_categories` - 获取文档分类
- `get_code_examples` - 获取代码示例
- `get_api_best_practices` - 获取最佳实践

### 排行榜 API 工具
- `search_leaderboard_docs` - 搜索排行榜文档
- `get_leaderboard_methods` - 获取排行榜方法概览
- `get_leaderboard_method_docs` - 获取具体方法详细文档
- `get_leaderboard_patterns` - 获取开发模式和完整示例
- `get_leaderboard_best_practices` - 获取最佳实践和错误处理

## 使用示例

### 搜索 API 文档
```
AI: 我想了解如何在游戏中集成 TapTap 登录功能

MCP Server (使用 search_api_docs):
- query: "登录"
→ 返回认证相关的 API 文档和代码示例
```

### 获取具体代码示例
```
AI: 请给我 Unity 集成 TapTap SDK 的详细步骤

MCP Server (使用 get_code_examples):
- category: "sdk_integration"
- platform: "unity"
→ 返回完整的 Unity 集成代码和最佳实践
```

### 查看最佳实践
```
AI: 在使用 TapTap API 时有什么需要注意的吗？

MCP Server (使用 get_api_best_practices):
→ 返回安全、性能、用户体验等方面的最佳实践指南
```

### 排行榜功能开发
```
AI: 我想在游戏中添加排行榜功能，怎么实现？

MCP Server (使用 get_leaderboard_methods):
→ 返回所有排行榜方法概览和核心功能介绍

AI: submitScores 方法怎么使用？

MCP Server (使用 get_leaderboard_method_docs):
- method: "submitScores"
→ 返回详细的参数说明、代码示例和最佳实践
```

### 完整开发模式
```
AI: 给我一个完整的排行榜集成示例

MCP Server (使用 get_leaderboard_patterns):
- pattern: "leaderboard_integration"
→ 返回完整的 GameLeaderboard 类实现和使用方法
```

## AI Agent 集成方案

### 方案一：MCP 工具集成 (推荐)
- AI agent 通过 MCP 协议调用文档工具
- 实时获取最新的 API 文档和代码示例
- 支持智能搜索和上下文感知

### 方案二：知识库注入
- 将 API 文档内容注入到 AI 模型的上下文中
- 适合需要离线使用的场景
- 可以通过 `get_api_categories` 导出完整文档

### 方案三：混合模式
- 核心 API 文档预加载到 AI 上下文
- 详细代码示例通过 MCP 工具动态获取
- 平衡响应速度和内容完整性

## 开发和测试

### 运行测试
```bash
python -m pytest tests/
```

### 开发模式
```bash
python server.py --dev
```

## 许可证

MIT License