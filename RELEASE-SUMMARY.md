# 🎉 版本 1.0.3 发布成功！

## 📦 包信息

- **包名**: `@mikoto_zero/minigame-open-mcp`
- **版本**: 1.0.3
- **发布时间**: 2025-10-09
- **包大小**: 40.3 KB (gzipped)
- **解压大小**: 175.4 kB
- **文件数量**: 51

## 🔗 链接

- **npm 包**: https://www.npmjs.com/package/@mikoto_zero/minigame-open-mcp
- **文档**: https://github.com/taptap/minigame-open-mcp#readme

## ✨ 新功能

### 🔍 详细日志模式

通过环境变量 `TAPTAP_MINIGAME_MCP_VERBOSE` 控制的完整日志系统：

**功能特点：**
- ✅ 记录所有工具调用的输入和输出
- ✅ 记录所有 HTTP 请求（method, URL, headers, body）
- ✅ 记录所有 HTTP 响应（status, data）
- ✅ 自动脱敏敏感信息（MAC token、签名等）
- ✅ ISO 格式时间戳
- ✅ 结构化格式输出，便于阅读和调试

**启用方式：**

```bash
# 方式 1: 环境变量
export TAPTAP_MINIGAME_MCP_VERBOSE=true
npm start

# 方式 2: 在 Claude Desktop 配置中
{
  "mcpServers": {
    "taptap-minigame": {
      "env": {
        "TAPTAP_MINIGAME_MCP_VERBOSE": "true"
      }
    }
  }
}

# 方式 3: 在 OpenHands 配置中
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

## 📝 文件更改

| 文件 | 状态 | 说明 |
|------|------|------|
| `src/utils/logger.ts` | 新增 | Logger 工具类，提供完整日志功能 |
| `src/network/httpClient.ts` | 更新 | 添加 HTTP 请求/响应日志 |
| `src/server.ts` | 更新 | 添加工具调用日志和版本号更新 |
| `CLAUDE.md` | 更新 | 添加"日志和调试"章节 |
| `README.md` | 更新 | 更新环境变量和配置说明 |
| `CHANGELOG.md` | 新增 | 版本变更记录 |
| `package.json` | 更新 | 版本号更新至 1.0.3 |

## 🔄 升级方式

### 全局安装用户

```bash
npm update -g @mikoto_zero/minigame-open-mcp
```

### npx 用户

npx 会自动使用最新版本，无需手动更新：

```bash
npx @mikoto_zero/minigame-open-mcp
```

### MCP 配置用户

如果使用 npx，配置会自动使用最新版本。如果使用全局安装，需要手动更新。

## 📊 统计信息

- **代码行数**: +443 行
- **新增文件**: 3 个（logger.ts, CHANGELOG.md, RELEASE.md）
- **更新文件**: 4 个
- **Git 提交**: 1c0790c

## 🎯 适用场景

这个版本特别适合：
- 🔍 需要调试 MCP 工具调用的开发者
- 🐛 排查 API 调用问题的开发者
- 📚 学习 MCP 协议和 TapTap API 的开发者
- 🛠️ 需要了解完整请求/响应流程的开发者

## 🛡️ 安全性

- 所有敏感信息（MAC token、签名）自动脱敏
- 日志只在启用 VERBOSE 模式时输出
- 默认关闭，对生产环境无影响

## 📞 支持

如有问题或建议，请：
- 提交 Issue: https://github.com/taptap/minigame-open-mcp/issues
- 查看文档: README.md 和 CLAUDE.md

---

**感谢使用 TapTap Minigame Open MCP Server！** 🚀
