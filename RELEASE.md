# Release Notes for v1.0.3

## 发布准备

所有更改已提交到 git，准备发布到 npm。

### 版本信息
- **版本号**: 1.0.3
- **发布日期**: 2025-10-09
- **包名**: @mikoto_zero/minigame-open-mcp

### 新增功能

#### 🔍 详细日志模式
通过环境变量 `TAPTAP_MINIGAME_MCP_VERBOSE` 控制的完整日志系统：

**日志内容：**
- ✅ 工具调用日志（输入/输出）
- ✅ HTTP 请求日志（headers + body）
- ✅ HTTP 响应日志（status + data）
- ✅ 自动脱敏敏感信息
- ✅ ISO 格式时间戳
- ✅ 结构化格式输出

**使用方式：**
```bash
# 启用详细日志
export TAPTAP_MINIGAME_MCP_VERBOSE=true
npm start
```

**在 MCP 配置中：**
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

### 文件更改

- ✅ 新增 `src/utils/logger.ts` - Logger 工具类
- ✅ 更新 `src/network/httpClient.ts` - 添加请求/响应日志
- ✅ 更新 `src/server.ts` - 添加工具调用日志
- ✅ 更新 `CLAUDE.md` - 添加日志和调试章节
- ✅ 更新 `README.md` - 更新环境变量和配置说明
- ✅ 新增 `CHANGELOG.md` - 版本变更记录
- ✅ 新增 `test-verbose.sh` - 测试脚本

### Git 提交

```
commit 1c0790c9e171d8b0b371a84f6c011ca10afce088
feat: 添加详细日志功能，支持工具调用和 HTTP 请求响应日志记录
```

### 发布命令

由于需要 OTP（一次性密码），请使用以下命令发布：

```bash
# 方式 1: 交互式发布（推荐）
npm publish --access public --otp=<your_otp_code>

# 方式 2: 如果已经登录并配置了 2FA
npm publish --access public
# 然后输入 OTP 代码
```

### 验证发布

发布后验证：
```bash
# 查看 npm 包信息
npm view @mikoto_zero/minigame-open-mcp

# 安装测试
npm install -g @mikoto_zero/minigame-open-mcp

# 测试运行（需要环境变量）
export TAPTAP_MAC_TOKEN='{"kid":"test","token_type":"mac","mac_key":"test","mac_algorithm":"hmac-sha-1"}'
export TAPTAP_CLIENT_ID="test"
export TAPTAP_CLIENT_SECRET="test"
export TAPTAP_MINIGAME_MCP_VERBOSE=true
minigame-open-mcp
```

### 发布后任务

- [ ] 验证 npm 包可以正常安装
- [ ] 测试 verbose 模式工作正常
- [ ] 更新 GitHub Release（如果有 repo）
- [ ] 通知相关团队成员

### 包信息

- **包大小**: 40.3 KB (gzipped)
- **解压大小**: 175.4 KB
- **文件数量**: 51
- **Node.js 要求**: >=16.0.0

### 相关链接

- NPM 包地址: https://www.npmjs.com/package/@mikoto_zero/minigame-open-mcp
- 文档: 参见 README.md 和 CLAUDE.md
- 变更日志: 参见 CHANGELOG.md
