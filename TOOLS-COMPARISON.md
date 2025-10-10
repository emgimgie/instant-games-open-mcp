# 三个工具的作用和差异说明

## 概述

这三个工具都与排行榜相关，但作用不同，适用于不同的使用场景。

## 工具对比

| 工具 | 作用 | 何时使用 | 返回内容 |
|------|------|---------|---------|
| **start_leaderboard_integration** | 工作流引导 | 用户首次接入排行榜 | 检查服务器端排行榜状态，引导创建或选择 |
| **get_leaderboard_overview** | 系统概览文档 | 需要了解整个系统架构 | 所有 API 的完整列表和简介 |
| **get_leaderboard_patterns** | 集成模式和最佳实践 | 需要实现完整功能 | 常见场景的代码示例和最佳实践 |

## 详细说明

### 1. start_leaderboard_integration（工作流引导）

**定位：** 排行榜接入的起点工具

**功能：**
1. 检查服务器端是否已有排行榜
2. 如果没有 → 引导用户创建（使用 create_leaderboard）
3. 如果有 → 列出现有排行榜供选择
4. 提供下一步操作建议

**适用场景：**
- ✅ 用户问："我想接入排行榜"
- ✅ 用户问："如何实现排行榜功能"
- ✅ 首次集成，不知道从哪开始
- ✅ 需要系统性的指导流程

**返回示例：**
```
🎯 排行榜接入流程

📋 **当前状态：** 暂无排行榜

**下一步操作：**
您需要先在服务器端创建一个排行榜...

⚠️ **重要：** TapTap 排行榜不需要引入任何 npm 包或 JS SDK！
- 客户端直接使用全局 tap 对象
- 无需 import 或 require

**创建排行榜需要配置：**
1. title - 排行榜名称
2. period_type - 周期：1=永久, 2=每日, 3=每周, 4=每月
...
```

**特点：**
- 交互式引导
- 检查实际状态（调用服务器 API）
- 提供具体的下一步操作
- 包含正确的枚举值说明

### 2. get_leaderboard_overview（系统概览）

**定位：** 知识库/参考文档

**功能：**
1. 返回所有 LeaderboardManager API 的列表
2. 每个 API 的简介
3. 系统架构说明
4. 不调用任何服务器 API，纯文档

**适用场景：**
- ✅ 用户问："排行榜有哪些 API？"
- ✅ 用户问："排行榜系统怎么工作的？"
- ✅ 需要快速浏览所有功能
- ✅ 需要了解 API 结构

**返回示例：**
```
# TapTap Minigame Leaderboard API

Complete leaderboard functionality for TapTap minigames...

## Available Categories

### Initialization
Get the LeaderboardManager instance
Available methods: `tap.getLeaderboardManager`

### Display Leaderboard
Open and display the leaderboard UI page
Available methods: `openLeaderboard`

### Score Submission
Submit player scores to leaderboards
Available methods: `submitScores`

...（列出所有 API）
```

**特点：**
- 静态文档
- 不执行任何 API 调用
- 快速概览
- 适合初步了解

### 3. get_leaderboard_patterns（集成模式）

**定位：** 最佳实践和代码示例

**功能：**
1. 提供常见使用场景的完整代码
2. 最佳实践建议
3. 实际的可运行示例
4. 不调用服务器 API，纯文档

**适用场景：**
- ✅ 用户问："如何实现完整的排行榜功能？"
- ✅ 用户问："有没有示例代码？"
- ✅ 需要端到端的实现参考
- ✅ 需要最佳实践指导

**返回示例：**
```
# Common Integration Scenarios

常见的排行榜集成场景和最佳实践

## Complete Integration Example

完整的排行榜集成示例，包括初始化、提交分数、显示榜单

```javascript
// 1. Get LeaderboardManager
const leaderboardManager = await tap.getLeaderboardManager();

// 2. Submit score
const score = {
  leaderboardId: "your_leaderboard_id",
  value: 1000
};
leaderboardManager.submitScores([score], (result) => {
  console.log("Score submitted:", result);
});

// 3. Open leaderboard
leaderboardManager.openLeaderboard("your_leaderboard_id");
```

## Score Submission with Error Handling

带错误处理的分数提交示例...
```

**特点：**
- 完整代码示例
- 包含错误处理
- 实际可运行
- 最佳实践建议

## 使用建议

### 推荐使用流程

```
用户："我想接入排行榜"
  ↓
AI 调用: start_leaderboard_integration
  ↓
工具返回：检查状态 + 引导创建/选择
  ↓
用户："创建一个每周高分榜"
  ↓
AI 调用: create_leaderboard (服务器端)
  ↓
创建成功，获得 leaderboard_id
  ↓
用户："怎么在客户端提交分数？"
  ↓
AI 调用: submit_scores (获取客户端代码)
  ↓
返回完整的客户端实现代码
```

### 什么时候用哪个工具？

**1. 用户首次接入排行榜**
```
推荐: start_leaderboard_integration
原因: 系统性引导，检查实际状态，提供下一步操作
```

**2. 用户想了解有哪些功能**
```
推荐: get_leaderboard_overview
原因: 快速浏览所有 API，不执行调用
```

**3. 用户需要实现代码**
```
推荐: get_leaderboard_patterns 或具体的 API 工具
原因: 提供完整的可运行示例代码
```

**4. 用户问具体 API 用法**
```
推荐: 具体的 API 工具（如 submit_scores, open_leaderboard）
原因: 针对性的文档，包含参数说明和示例
```

## 三个工具的协作关系

```
start_leaderboard_integration (入口)
  ├─ 检查服务器端排行榜
  ├─ 引导创建（如需要）
  └─ 推荐下一步查看的文档工具
      ├─ get_leaderboard_overview (快速了解)
      ├─ get_leaderboard_patterns (完整示例)
      └─ 具体 API 工具 (针对性文档)
```

## 检查工具描述中的问题

### ✅ start_leaderboard_integration

**已修复的问题：**
- ✅ 添加了"不需要 npm 包或 JS SDK"的说明
- ✅ 更正了枚举值（1=永久, 2=每日, 3=每周, 4=每月）
- ✅ 强调客户端使用全局 tap 对象

### ❓ get_leaderboard_overview

**需要检查：**
- 内部是否有旧的枚举值说明
- 是否提到 npm 包依赖

### ❓ get_leaderboard_patterns

**需要检查：**
- 示例代码是否使用了 import/require
- 是否强调使用全局 tap 对象
- 是否有旧的枚举值

## 建议

1. **start_leaderboard_integration** 是入口，应该最先调用
2. **get_leaderboard_overview** 用于快速了解，可选
3. **get_leaderboard_patterns** 用于实现参考，需要代码时调用
4. 三个工具互不冲突，可以组合使用
