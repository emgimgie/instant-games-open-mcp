# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Model Context Protocol (MCP) 的 TapTap 小游戏生态 API 服务器。该项目为 AI 助手提供了访问 TapTap 小游戏平台功能的能力，包括游戏搜索、用户管理、排行榜、数据分析和 API 文档服务。项目支持多种运行模式，包括标准 MCP 服务器模式和独立 HTTP 服务器模式。

## 架构概览

项目采用分层架构设计：

### 核心服务器层
- **`src/taptap_mcp/server.py`** - 主 MCP 服务器，使用标准 MCP 协议（stdio 模式）
- **`standalone_server.py`** - 独立 HTTP 服务器，使用 FastMCP 框架，专注排行榜功能
- **`server.py`** - 项目入口点，负责启动主服务器

### 工具实现层
- **`src/taptap_mcp/tools/`** - 功能工具集
  - `minigame_tools.py` - 小游戏搜索、详情、评论、精选功能
  - `documentation_tools.py` - TapTap API 文档查询和搜索工具
  - `leaderboard_docs_tools.py` - 小游戏内排行榜 API 文档工具

### API 和数据层
- **`src/taptap_mcp/api/client.py`** - TapTap API 客户端，支持异步调用和错误处理
- **`src/taptap_mcp/config/settings.py`** - 基于 Pydantic 的配置管理
- **`src/taptap_mcp/data/`** - 结构化 API 文档数据
  - `api_docs.py` - 完整 TapTap API 文档数据和搜索索引
  - `leaderboard_docs.py` - 排行榜 API 文档数据

## 常用命令

### 开发环境设置
```bash
# 创建并激活虚拟环境
python -m venv .python-env
source .python-env/bin/activate  # Linux/Mac
# 或 .python-env\Scripts\activate  # Windows

# 安装核心依赖（推荐使用 pyproject.toml）
pip install -e .

# 或安装所有依赖（包含可选依赖）
pip install -r requirements.txt

# 安装开发依赖
pip install -e .[dev]

# 安装缓存支持（可选）
pip install -e .[cache]

# 安装监控支持（可选）
pip install -e .[monitoring]
```

### 启动服务器
```bash
# 使用启动脚本（推荐）
./start_server.sh

# 直接启动主服务器（标准 MCP 模式）
python server.py

# 启动独立 HTTP 服务器（FastMCP 模式）
python standalone_server.py

# 使用运行脚本（MCP stdio 模式）
./run_mcp.sh
```

### 环境配置
```bash
# 复制环境配置模板
cp .env.example .env
# 然后编辑 .env 文件设置 TAPTAP_API_KEY
```

### 测试
```bash
# 运行所有测试
python -m pytest tests/

# 运行特定测试文件
python -m pytest tests/test_minigame_tools.py

# 运行测试并显示覆盖率
python -m pytest --cov=taptap_mcp --cov-report=html

# 测试 MCP 连接
python test_mcp.py
```

### 代码质量检查
```bash
# 代码格式化
black src/ tests/ --line-length=100

# 导入排序
isort src/ tests/ --profile=black

# 类型检查
mypy src/

# 组合命令（开发时使用）
black src/ tests/ --line-length=100 && isort src/ tests/ --profile=black && mypy src/
```

## MCP 集成配置

### Claude Desktop 集成
在 `~/.config/claude-desktop/config.json` 中添加：
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

### 工具分类

#### 小游戏管理工具
- **`search_minigames`** - 搜索小游戏，支持分类筛选和关键词搜索
- **`get_minigame_details`** - 获取游戏详细信息（评分、下载量、版本等）
- **`get_minigame_reviews`** - 获取用户评论，支持多种排序方式
- **`get_featured_minigames`** - 获取官方精选推荐游戏

#### API 文档工具
- **`search_api_docs`** - 搜索 TapTap API 文档，支持关键词和分类搜索
- **`get_api_categories`** - 获取所有 API 文档分类概览
- **`get_code_examples`** - 获取特定分类的详细代码示例
- **`get_api_best_practices`** - 获取 API 使用最佳实践和开发建议

#### 排行榜文档工具（独立服务器支持）
- **`search_minigame_leaderboard_docs`** - 搜索小游戏内排行榜 API 文档
- **`get_minigame_leaderboard_methods`** - 获取排行榜系统所有方法概览
- **`get_minigame_leaderboard_method_docs`** - 获取特定方法的详细文档
- **`get_leaderboard_patterns`** - 获取排行榜开发模式和完整示例
- **`get_minigame_leaderboard_best_practices`** - 获取排行榜开发最佳实践

## 核心技术栈

- **MCP Framework**: 基于 Model Context Protocol 的工具服务
- **FastMCP**: fastmcp>=0.2.0 (快速 MCP 服务器框架)
- **Web 服务器**: uvicorn>=0.20.0 (ASGI 服务器)
- **HTTP 客户端**: httpx>=0.24.0 (异步 HTTP 客户端)
- **数据验证**: Pydantic v2 + pydantic-settings
- **日志系统**: structlog>=23.0.0 (结构化日志)
- **配置管理**: python-dotenv (环境变量管理)
- **测试框架**: pytest + pytest-asyncio + pytest-cov
- **代码质量**: black (格式化) + isort (导入排序) + mypy (类型检查)

## 环境变量配置

必需：
- `TAPTAP_API_KEY`: TapTap API 密钥

可选：
- `TAPTAP_API_BASE_URL`: API 基础 URL (默认: https://api.taptap.com/v1)
- `TAPTAP_ENVIRONMENT`: 环境标识 (production/staging/development)
- `TAPTAP_LOG_LEVEL`: 日志级别 (默认: INFO)
- `TAPTAP_DEBUG`: 调试模式 (默认: false)
- `TAPTAP_REDIS_URL`: Redis 缓存 URL
- `TAPTAP_DATABASE_URL`: 数据库连接 URL

## 开发注意事项

### 代码规范
- 所有异步函数需要使用 `async/await` 语法
- 使用 Pydantic v2 进行数据验证和设置管理
- 遵循 Python 类型提示规范，所有函数都应有类型注解
- 使用 structlog 进行结构化日志记录

### MCP 工具开发
- 工具处理函数必须返回 `Sequence[TextContent]` 类型（标准 MCP）或字符串（FastMCP）
- 新增工具需要在相应服务器中注册工具定义和处理函数
- 工具定义需要包含完整的 JSON Schema 输入验证
- 支持两种服务器模式：
  - 标准 MCP（`src/taptap_mcp/server.py`）- 使用 stdio 通信
  - FastMCP（`standalone_server.py`）- 使用 HTTP/WebSocket

### API 客户端使用
- 所有 TapTap API 调用通过 `TapTapAPIClient` 进行
- 客户端内置请求限流（并发限制 10 个请求）
- 自定义异常 `TapTapAPIError` 用于 API 错误处理
- 支持超时控制（默认 30 秒）

### 配置管理
- 使用 `pydantic-settings` 管理环境变量
- 配置项应添加到 `TapTapSettings` 类中
- 支持 `.env` 文件和环境变量两种配置方式
- 所有环境变量以 `TAPTAP_` 为前缀

### 测试指南
- 使用 pytest 进行单元测试
- 测试文件位于 `tests/` 目录
- 使用 `pytest-asyncio` 测试异步代码
- 使用 `pytest-cov` 生成覆盖率报告

## 项目特色功能

### 双服务器架构
项目同时提供两种服务器实现：
1. **标准 MCP 服务器** - 完整功能支持，适用于 Claude Desktop 等 MCP 客户端
2. **FastMCP HTTP 服务器** - 轻量级实现，专注排行榜功能，支持 Web 集成

### 丰富的文档数据
- 内置完整的 TapTap API 文档数据（`api_docs.py`）
- 详细的排行榜 API 文档（`leaderboard_docs.py`）
- 支持关键词搜索和分类浏览
- 包含代码示例和最佳实践

### 模拟 API 响应
当前版本使用模拟的 API 响应数据，便于开发和测试：
- `search_minigames` - 返回模拟的游戏搜索结果
- `get_minigame_details` - 返回模拟的游戏详情
- `get_minigame_reviews` - 返回模拟的用户评论
- `get_featured_minigames` - 返回模拟的精选游戏

实际部署时需要替换为真实的 TapTap API 端点。