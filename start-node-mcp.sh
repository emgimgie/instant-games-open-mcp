#!/bin/bash

# TapTap 文档 MCP 服务器启动脚本 (Node.js 版本)

# 获取脚本所在目录
SCRIPT_DIR=$(cd $(dirname "$0") && pwd)

echo "检查 Node.js 环境..."

# 检查 Node.js 是否存在
if command -v node > /dev/null; then
    NODE_VERSION=$(node --version)
    echo "Node.js 已安装: $NODE_VERSION"
else
    echo "❌ 请安装 Node.js (推荐版本 16.0+)"
    echo "   下载地址: https://nodejs.org/"
    exit 1
fi

# 检查 npm 是否存在
if command -v npm > /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "npm 已安装: $NPM_VERSION"
else
    echo "❌ npm 未找到，请重新安装 Node.js"
    exit 1
fi

# 切换到项目目录
cd "$SCRIPT_DIR"

echo "检查依赖..."

# 检查 package.json 是否存在
if [ ! -f "package.json" ]; then
    echo "❌ 未找到 package.json 文件"
    exit 1
fi

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

echo "启动 TapTap 文档 MCP 服务器..."

# 检查是否已编译
if [ -f "dist/server.js" ]; then
    echo "🚀 使用编译版本启动..."
    node dist/server.js
elif [ -f "src/server.ts" ]; then
    echo "🛠️  使用开发模式启动..."
    if command -v ts-node > /dev/null; then
        npx ts-node src/server.ts
    else
        echo "📦 安装 ts-node..."
        npm install -g ts-node
        npx ts-node src/server.ts
    fi
else
    echo "❌ 未找到服务器文件"
    exit 1
fi