#!/usr/bin/env python3
"""TapTap 小游戏 MCP 服务器入口点"""

import os
import sys

# 添加 src 目录到 Python 路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from taptap_mcp.server import main

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())