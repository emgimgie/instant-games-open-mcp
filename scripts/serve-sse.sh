#!/bin/bash

##
# Quick deployment script for SSE mode MCP server
#
# Usage:
#   ./scripts/serve-sse.sh [port] [verbose]
#
# Examples:
#   ./scripts/serve-sse.sh                  # Port 3000, verbose off
#   ./scripts/serve-sse.sh 8080             # Port 8080, verbose off
#   ./scripts/serve-sse.sh 3000 true        # Port 3000, verbose on
##

set -e

PORT=${1:-3000}
VERBOSE=${2:-false}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 TapTap MCP Server - SSE Mode Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Configuration:"
echo "   Transport: SSE (Streamable HTTP)"
echo "   Port: $PORT"
echo "   Verbose: $VERBOSE"
echo "   Features:"
echo "      ✅ Multi-client concurrent connections"
echo "      ✅ Smart auto-authorization"
echo "      ✅ Real-time progress streaming"
echo "      ✅ Connection logging"
echo ""
echo "📡 Server will be available at:"
echo "   MCP Endpoint: http://localhost:$PORT/"
echo "   Health Check: http://localhost:$PORT/health"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if dist exists
if [ ! -d "dist" ]; then
  echo "⚠️  dist/ not found. Building..."
  npm run build
fi

# Start server
TDS_MCP_TRANSPORT=sse \
TDS_MCP_PORT=$PORT \
TDS_MCP_VERBOSE=$VERBOSE \
node dist/server.js
