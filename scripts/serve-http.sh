#!/bin/bash

##
# Quick deployment script for HTTP JSON mode MCP server
#
# Usage:
#   ./scripts/serve-http.sh [port] [verbose]
#
# Examples:
#   ./scripts/serve-http.sh                 # Port 3000, verbose off
#   ./scripts/serve-http.sh 8080            # Port 8080, verbose off
#   ./scripts/serve-http.sh 3000 true       # Port 3000, verbose on
##

set -e

PORT=${1:-3000}
VERBOSE=${2:-false}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 TapTap MCP Server - HTTP JSON Mode Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Configuration:"
echo "   Transport: HTTP (JSON Only)"
echo "   Port: $PORT"
echo "   Verbose: $VERBOSE"
echo "   Features:"
echo "      ✅ Multi-client concurrent connections"
echo "      ✅ JSON responses (Content-Type: application/json)"
echo "      ✅ Two-step authorization"
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
TDS_MCP_TRANSPORT=http \
TDS_MCP_PORT=$PORT \
TDS_MCP_VERBOSE=$VERBOSE \
node dist/server.js
