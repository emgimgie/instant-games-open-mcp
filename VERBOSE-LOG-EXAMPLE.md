# Verbose 日志示例

本文档展示启用 `TAPTAP_MINIGAME_MCP_VERBOSE=true` 后的详细日志格式。

## 工具调用日志

### 工具调用输入
```
================================================================================
[2025-10-09T06:30:45.123Z] [TOOL CALL] create_leaderboard
================================================================================
📥 Input:
{
  "name": "Weekly Ranking",
  "score_type": "better_than",
  "score_order": 1,
  "period_type": 1
}
```

### 工具调用输出
```
--------------------------------------------------------------------------------
[2025-10-09T06:30:45.456Z] [TOOL RESPONSE] create_leaderboard - ✅ SUCCESS
--------------------------------------------------------------------------------
📤 Output:
Leaderboard created successfully!
Leaderboard ID: 123456

You can now use this leaderboard_id in your client code.
================================================================================
```

## HTTP 请求日志

### 详细的请求信息
```
====================================================================================================
[2025-10-09T06:30:45.500Z] [HTTP REQUEST]
====================================================================================================
📤 Method: POST
📤 URL: https://agent.tapapis.cn/level/v1/create?client_id=your_client_id

🔐 Authorization:
MAC id="abc123def456", ts="1234567890", nonce="random123456", mac="***REDACTED***"

📋 Headers (6 total):
{
  "Content-Type": "application/json",
  "Authorization": "MAC id=\"abc123def456\", ts=\"1234567890\", nonce=\"random123456\", mac=\"***REDACTED***\"",
  "X-Tap-Ts": "1234567890",
  "X-Tap-Nonce": "random123",
  "X-Tap-Sign": "***REDACTED***"
}

📦 Request Body (JSON):
{
  "name": "Weekly Ranking",
  "score_type": 0,
  "score_order": 1,
  "period_type": 1,
  "reset_time": "00:00:00",
  "member_order": 0,
  "calc_type": 0
}
```

## HTTP 响应日志

### 成功响应
```
----------------------------------------------------------------------------------------------------
[2025-10-09T06:30:45.789Z] [HTTP RESPONSE] ✅ SUCCESS
----------------------------------------------------------------------------------------------------
📥 Method: POST
📥 URL: https://agent.tapapis.cn/level/v1/create?client_id=your_client_id
📥 Status: 200 OK

📋 Response Headers (5 total):
{
  "content-type": "application/json; charset=utf-8",
  "content-length": "156",
  "connection": "keep-alive",
  "date": "Thu, 09 Oct 2025 06:30:45 GMT",
  "x-request-id": "req-abc123"
}

📦 Response Body (JSON):
{
  "success": true,
  "data": {
    "leaderboard_id": "123456",
    "name": "Weekly Ranking",
    "score_type": 0,
    "score_order": 1,
    "period_type": 1,
    "status": "active",
    "created_at": "2025-10-09T06:30:45.789Z"
  }
}
====================================================================================================
```

### 错误响应
```
----------------------------------------------------------------------------------------------------
[2025-10-09T06:30:50.123Z] [HTTP RESPONSE] ❌ FAILED
----------------------------------------------------------------------------------------------------
📥 Method: POST
📥 URL: https://agent.tapapis.cn/level/v1/create?client_id=invalid_client_id
📥 Status: 401 Unauthorized

📋 Response Headers (4 total):
{
  "content-type": "application/json; charset=utf-8",
  "content-length": "87",
  "connection": "keep-alive",
  "date": "Thu, 09 Oct 2025 06:30:50 GMT"
}

📦 Response Body (JSON):
{
  "success": false,
  "error": "Invalid authentication",
  "error_code": "AUTH_INVALID",
  "message": "The provided MAC token or client credentials are invalid"
}
====================================================================================================
```

## 日志特性

### ✅ 详细信息
- **完整的 URL** - 包括查询参数
- **所有请求头** - 显示完整的 headers（敏感信息已脱敏）
- **请求体** - JSON 自动格式化，或显示原始文本
- **响应头** - 完整的响应 headers
- **响应体** - JSON 自动格式化
- **时间戳** - ISO 8601 格式，精确到毫秒

### 🔒 安全脱敏
- **MAC 签名** - `mac="signature"` → `mac="***REDACTED***"`
- **X-Tap-Sign** - 完整签名 → `***REDACTED***`
- **保留结构** - Authorization header 的其他部分（id, ts, nonce）仍可见，便于调试

### 📊 统计信息
- **Headers 数量** - 显示总共有多少个 header
- **请求方法** - GET, POST, PUT, DELETE 等
- **状态码** - 200, 201, 400, 401, 500 等
- **成功/失败标识** - ✅ SUCCESS 或 ❌ FAILED

### 📦 智能解析
- **JSON 自动格式化** - 自动检测并格式化 JSON
- **文本保持原样** - 非 JSON 内容显示为原始文本
- **空值提示** - 明确显示 "(empty)" 当内容为空时

## 使用场景

### 🔍 调试 API 调用问题
查看完整的请求和响应，快速定位问题：
- 请求参数是否正确？
- 认证信息是否有效？
- 服务器返回了什么错误？

### 📚 学习 API 使用
了解完整的 API 交互过程：
- 需要哪些 headers？
- Body 格式是什么？
- 响应结构如何？

### 🛠️ 开发新功能
验证新实现的正确性：
- 签名算法是否正确？
- 请求格式是否符合要求？
- 响应处理是否完整？

### 🐛 问题排查
快速定位和修复 bug：
- 完整的请求/响应历史
- 清晰的错误信息
- 时间戳帮助追踪时序问题

## 启用方式

### 命令行
```bash
export TAPTAP_MINIGAME_MCP_VERBOSE=true
npm start
```

### Claude Desktop 配置
```json
{
  "mcpServers": {
    "taptap-minigame": {
      "env": {
        "TAPTAP_MINIGAME_MCP_VERBOSE": "true"
      }
    }
  }
}
```

### OpenHands 配置
```json
{
  "mcpServers": {
    "taptap-minigame": {
      "env": {
        "TAPTAP_MINIGAME_MCP_VERBOSE": "true"
      }
    }
  }
}
```

## 性能影响

- **最小化** - 日志输出到 stderr，不影响 MCP 协议通信
- **可控** - 默认关闭，只在需要时启用
- **异步** - 不阻塞主要业务逻辑
- **格式化** - JSON 格式化性能开销可忽略不计

## 注意事项

1. **生产环境建议关闭** - 避免大量日志输出
2. **敏感信息已脱敏** - MAC token 和签名不会泄露
3. **日志输出到 stderr** - 不会干扰 MCP 协议通信
4. **文件大小** - 长时间运行可能产生大量日志，注意磁盘空间
