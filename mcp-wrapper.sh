#!/bin/bash

# MCP Server Wrapper - Logs all stderr to file
LOG_FILE="/tmp/taptap-mcp-$(date +%Y%m%d-%H%M%S).log"

echo "🔍 MCP Server starting, logging to: $LOG_FILE" >&2
echo "📄 View logs: tail -f $LOG_FILE" >&2

# Run server and log stderr
node "$(dirname "$0")/dist/server.js" 2>&1 | tee -a "$LOG_FILE"
