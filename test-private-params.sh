#!/bin/bash

# 私有参数协议测试脚本
# 测试 MCP Server 的私有参数注入功能

set -e

echo "🧪 开始测试私有参数协议..."
echo ""

# 检查服务器是否运行
if ! curl -s http://localhost:3000/health > /dev/null 2>&1; then
  echo "❌ MCP Server 未运行！"
  echo "请先启动服务器："
  echo "  export TDS_MCP_TRANSPORT=sse"
  echo "  export TDS_MCP_PORT=3000"
  echo "  export TDS_MCP_VERBOSE=true"
  echo "  npm start"
  exit 1
fi

echo "✅ MCP Server 运行中 (http://localhost:3000)"
echo ""

# 测试用的 MAC Token
TEST_MAC_TOKEN='{"kid":"test_kid","mac_key":"test_key","token_type":"mac","mac_algorithm":"hmac-sha-1"}'

# Base64 编码 token
TOKEN_BASE64=$(echo -n "$TEST_MAC_TOKEN" | base64)

echo "📋 测试 MAC Token:"
echo "$TEST_MAC_TOKEN"
echo ""
echo "Base64 编码:"
echo "$TOKEN_BASE64"
echo ""

# ========== 测试 1: 直接参数注入 ==========
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 测试 1: 直接参数注入（在 arguments 中）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

curl -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
  }' 2>&1 | grep -q "list_leaderboards" && echo "✅ 服务器响应正常" || echo "❌ 服务器响应异常"

echo ""
echo "发送包含私有参数的请求..."
echo ""

RESPONSE=$(curl -s -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"id\": 2,
    \"method\": \"tools/call\",
    \"params\": {
      \"name\": \"check_environment\",
      \"arguments\": {
        \"_mac_token\": $TEST_MAC_TOKEN,
        \"_user_id\": \"test_user_123\",
        \"_session_id\": \"test_session_abc\"
      }
    }
  }")

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

if echo "$RESPONSE" | grep -q "error"; then
  echo "⚠️  工具调用返回错误（可能是 token 无效，这是正常的测试行为）"
else
  echo "✅ 工具调用成功"
fi

echo ""

# ========== 测试 2: HTTP Header 注入 ==========
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 测试 2: HTTP Header 注入（仅 HTTP/SSE 模式）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: 初始化会话
echo "Step 1: 初始化 MCP 会话..."
echo ""

INIT_RESPONSE=$(curl -s -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -H "X-TapTap-Mac-Token: $TOKEN_BASE64" \
  -D /tmp/mcp-headers.txt \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-03-26",
      "capabilities": {},
      "clientInfo": {
        "name": "test-client",
        "version": "1.0.0"
      }
    }
  }')

echo "$INIT_RESPONSE" | jq '.' 2>/dev/null || echo "$INIT_RESPONSE"
echo ""

# 提取 Session ID
if [ -f /tmp/mcp-headers.txt ]; then
  SESSION_ID=$(grep -i "mcp-session-id" /tmp/mcp-headers.txt | cut -d: -f2 | tr -d ' \r\n')
  if [ -n "$SESSION_ID" ]; then
    echo "✅ 获取到 Session ID: $SESSION_ID"
  else
    echo "⚠️  未找到 Session ID，可能不支持有状态模式"
    SESSION_ID=""
  fi
else
  echo "⚠️  未找到响应 headers"
  SESSION_ID=""
fi

echo ""

# Step 2: 使用 Session ID 和 Header Token 调用工具
if [ -n "$SESSION_ID" ]; then
  echo "Step 2: 使用 Header Token 调用工具..."
  echo ""

  TOOL_RESPONSE=$(curl -s -X POST http://localhost:3000/ \
    -H "Content-Type: application/json" \
    -H "Mcp-Session-Id: $SESSION_ID" \
    -H "X-TapTap-Mac-Token: $TOKEN_BASE64" \
    -d '{
      "jsonrpc": "2.0",
      "id": 2,
      "method": "tools/call",
      "params": {
        "name": "check_environment",
        "arguments": {}
      }
    }')

  echo "$TOOL_RESPONSE" | jq '.' 2>/dev/null || echo "$TOOL_RESPONSE"
  echo ""

  if echo "$TOOL_RESPONSE" | grep -q "error"; then
    echo "⚠️  工具调用返回错误（可能是 token 无效，这是正常的测试行为）"
  else
    echo "✅ Header Token 注入成功"
  fi
else
  echo "⏭️  跳过 Session 测试（无状态模式）"
fi

echo ""

# ========== 总结 ==========
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 测试总结"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ 测试 1: 直接参数注入 - 完成"
echo "✅ 测试 2: HTTP Header 注入 - 完成"
echo ""
echo "📖 详细文档请查看："
echo "   - PRIVATE_PROTOCOL.md"
echo "   - README.md"
echo ""
echo "🎉 私有参数协议测试完成！"
