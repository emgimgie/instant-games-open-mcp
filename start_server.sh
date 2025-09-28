#!/bin/bash

# TapTap MCP 服务器启动脚本

# 获取脚本所在目录
SCRIPT_DIR=$(cd $(dirname "$0") && pwd)

# 虚拟环境路径
VIRTUAL_ENV_PATH="$SCRIPT_DIR/.python-env"

# 激活虚拟环境
if [ -d "$VIRTUAL_ENV_PATH" ]; then
    source "$VIRTUAL_ENV_PATH/bin/activate"
else
    echo "虚拟环境不存在: $VIRTUAL_ENV_PATH"
    exit 1
fi

# 切换到服务器目录
cd "$SCRIPT_DIR"

# 启动 MCP 服务器 (使用模块方式运行以避免相对导入问题)
python -m src.taptap_mcp.server