/**
 * TapTap Multiplayer Documentation Tools
 * 提供文档查询、搜索、生成等功能
 * 
 * 按实际使用流程组织：
 * 初始化和连接 → 匹配进入房间 → 游戏数据互通流转循环 → 退出房间
 */

import {
  generateAPIDoc,
  generateCategoryDoc,
  searchDocumentation,
  generateOverview,
  generateSearchSuggestions,
  type ResourceSuggestion
} from '../../core/utils/docHelpers.js';

import { MULTIPLAYER_DOCUMENTATION } from './docs.js';

interface ToolArgs {
  query?: string;
}

// ============ 已删除的废弃函数 ============
// 以下函数已删除，功能整合到核心工具中：
// - getStep1Init ~ getStep7Exit (整合到 getIntegrationWorkflow)
// - getDataStructures (整合到 getApiDataStructures)
// - getCommonPatterns (整合到 getCompleteExample)

/**
 * API-事件关系表文档
 */
async function getApiEventRelations(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'api_event_relations');
}

/**
 * 协议模板规范文档
 */
async function getProtocolTemplate(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'protocol_template');
}

/**
 * 完整联机功能示例
 */
async function getCompleteExample(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'complete_example');
}

// ============ 已删除的单 API 文档函数 ============
// 以下函数已删除，功能整合到 get_code_template 的代码注释中：
// - getGetOnlineBattleManager, getRegisterListener, getConnect
// - getMatchRoom, getUpdatePlayerCustomProperties, getUpdateRoomProperties
// - getSendCustomMessage, getLeaveRoom

// ============ 已删除的辅助工具函数 ============
// - searchMultiplayerDocs (使用率低，已删除)
// - getMultiplayerOverview (整合到 getIntegrationWorkflow)

/**
 * 获取完整集成流程指南
 */
async function getIntegrationWorkflow(): Promise<string> {
  // 直接嵌入完整代码模板
  const codeTemplate = await getCompleteExample();

  return `# TapTap 多人联机集成指南

---

## 🚀 快速开始（3步上手）

### 步骤1：复制完整代码模板

以下是经过3款真实游戏验证的生产级代码模板，**直接复制到项目中即可使用**：

${codeTemplate}

---

### 步骤2：初始化

\`\`\`javascript
const multiplayer = new MultiplayerManager();

// 设置回调
multiplayer.onPlayerJoined = (playerInfo) => {
  // 创建远程玩家（游戏逻辑）
  const player = createPlayer(playerInfo.id);
};

multiplayer.onPlayerLeft = (playerId) => {
  // 移除玩家（游戏逻辑）
  removePlayer(playerId);
};

multiplayer.onDataReceived = (data, fromPlayerId) => {
  // 处理数据（游戏逻辑）
  if (data.type === 'position') {
    updatePlayerPosition(fromPlayerId, data.x, data.y);
  }
};

// 初始化并匹配房间
await multiplayer.init();
await multiplayer.matchRoom(2, 'pvp');
\`\`\`

---

### 步骤3：在游戏循环中同步

\`\`\`javascript
function gameLoop() {
  player.update();

  // ✅ 可以每帧调用，内部已处理频率限制和变化检测
  multiplayer.syncPosition(player.x, player.y);

  requestAnimationFrame(gameLoop);
}
\`\`\`

---

## 🚨 常见问题速查

| 问题 | 解决方案 |
|------|---------|
| 看不到其他玩家 | 确保在 onPlayerJoined 中创建玩家对象 |
| 位置不同步 | 确保使用 syncPosition() 方法 |
| playerId undefined | 已内置字段兼容，检查其他原因 |
| 游戏卡顿 | syncPosition 内置变化检测，已优化 |

遇到其他问题？调用 \`diagnose_multiplayer_issues\` 工具

---

## 📋 7步骤流程（参考）

代码模板已实现以下步骤，无需手动编写：

1️⃣ 获取管理器 - ✅ 在 init() 中
2️⃣ 注册事件 - ✅ 在 _registerListeners() 中
3️⃣ 连接服务器 - ✅ 在 init() 中
4️⃣ 匹配房间 - ✅ 调用 matchRoom()
5️⃣ 数据同步 - ✅ 调用 syncPosition() / sendData()
6️⃣ 事件处理 - ✅ 已内置，通过回调函数
7️⃣ 退出房间 - ✅ 调用 leaveRoom()

---

## 🔧 代码模板特性

✅ **开箱即用** - 直接复制，立即可用
✅ **防御性强** - 内置频率限制、字段兼容、变化检测
✅ **支持调试** - 单机模式降级，无需真实环境
✅ **可扩展** - MSG_TYPES 可自定义，sendEvent() 支持任意事件

---

## 💡 一键生成方案

**更快捷的方式**：调用 \`generate_multiplayer_code\` 工具，自动创建文件：
- \`js/MultiplayerManager.js\` - 完整代码
- \`MULTIPLAYER_GUIDE.md\` - 本地规范文档

---

## 🟡 扩展功能（可选）

需要房间列表、好友邀请等功能时，调用 \`get_extended_apis\` 工具
`;
}

// ============ 已删除的扩展 API 函数 ============
// 以下函数已删除，功能整合到 getExtendedApis：
// - getExtendedRoomManagement, getExtendedConnection
// - getExtendedPlayerStatus, getExtendedEvents
// - getCreateRoom, getGetRoomList, getJoinRoom
// - getKickRoomPlayer, getDisconnect, getUpdatePlayerCustomStatus

// ============ 专题指南文档 ============

/**
 * 玩家 ID 完整指南
 */
async function getPlayerIdGuide(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'player_id_guide');
}

// ============ 已删除/重命名的专题函数 ============
// - getJoystickSyncPattern → getSyncStrategy（重命名并优化）
// - getLocalGuideTemplate（已删除，功能在 generateLocalMultiplayerGuide 中）
// - getModularTemplates（已删除，功能整合到 getSyncStrategy）

/**
 * 生成本地多人联机指南文档
 * 返回可直接保存到项目根目录的 MULTIPLAYER_GUIDE.md 内容
 */
async function generateLocalMultiplayerGuide(): Promise<string> {
  const timestamp = new Date().toISOString().split('T')[0];
  const version = '1.0.0';
  
  return `# 多人联机使用指引和规范

> ⚠️ **重要**：本文档是多人联机开发的核心规范，所有联机相关代码都必须遵循。
> 如果 AI 生成的代码违背本规范，请主动告知开发者！

---

## 🚨 API 频率限制

**共享限制：15 次/秒**

以下 3 个 API 共享频率限制：
- \`sendCustomMessage()\`
- \`updatePlayerCustomProperties()\`
- \`updateRoomProperties()\`

### 解决方案：定时同步

\`\`\`javascript
let lastSyncTime = 0;
const SYNC_INTERVAL = 100;  // 100ms = 10次/秒

function syncData() {
  const now = Date.now();
  if (now - lastSyncTime >= SYNC_INTERVAL) {
    manager.sendCustomMessage({...});
    lastSyncTime = now;
  }
}
\`\`\`

---

## 🔑 玩家 ID 使用规范

### 获取本地玩家 ID
\`\`\`javascript
// connect() 返回的 playerId 必须保存！
const res = await manager.connect();
this.myPlayerId = res.playerId;  // ← 关键
\`\`\`

### 判断是否是自己
\`\`\`javascript
const isMe = (playerId === this.myPlayerId);
\`\`\`

### 字段名兼容
\`\`\`javascript
// 发送者ID可能有多种字段名
const fromId = info.fromPlayerId || info.playerId || info.fromUserId;

// playerInfo 可能有包装层
const playerInfo = info.playerInfo || info;
const playerId = playerInfo.id || playerInfo.playerId;
\`\`\`

---

## 📦 数据结构

### matchRoom 返回值
\`\`\`javascript
const res = await manager.matchRoom({...});
// res.roomInfo.players  ← 所有玩家数组
// res.roomInfo.ownerId  ← 房主 ID
\`\`\`

### playerEnterRoom 事件
\`\`\`javascript
playerEnterRoom: (info) => {
  // info.playerInfo.id              ← 玩家 ID
  // info.playerInfo.customProperties ← 玩家属性
}
\`\`\`

### sendCustomMessage 格式
\`\`\`javascript
manager.sendCustomMessage({
  data: {
    msg: JSON.stringify({ type: 'move', x: 100 }),
    type: 0  // 0=所有人（不包括自己）
  }
});
\`\`\`

---

## 🎮 摇杆同步策略

### 推荐方案
\`\`\`javascript
// 定时同步 + 位置变化检测
const SYNC_INTERVAL = 100;  // 100ms
let lastSyncTime = 0;
let lastX = 0, lastY = 0;

function update() {
  const now = Date.now();
  const posChanged = Math.abs(player.x - lastX) > 0.5 || 
                     Math.abs(player.y - lastY) > 0.5;
  
  if (posChanged && now - lastSyncTime >= SYNC_INTERVAL) {
    syncPosition();
    lastSyncTime = now;
    lastX = player.x;
    lastY = player.y;
  }
}
\`\`\`

---

## 📝 代码注释规范

**所有多人联机相关的代码文件顶部必须添加以下注释：**

\`\`\`javascript
/**
 * 多人联机模块
 * 
 * ⚠️ SDK 使用规范请参阅项目中的 MULTIPLAYER_GUIDE.md
 * ⚠️ API 频率限制：sendCustomMessage 等共享每秒 15 次
 */
\`\`\`

---

## 💡 AI 开发提示

**如果你是 AI 助手，实现多人联机时：**

1. 先调用 \`generate_local_guide\` 生成本文档
2. 调用 \`get_code_template\` 获取完整代码模板
3. 使用定时器控制同步频率（100ms 间隔）
4. 正确使用数据结构（res.roomInfo.players、info.playerInfo.id）
5. 保存 connect() 返回的 playerId

---

*文档生成时间：${timestamp}*
*TapTap MiniGame MCP 版本：${version}*
`;
}

/**
 * 扩展 API 速查（合并所有扩展 API）
 */
async function getExtendedApis(): Promise<string> {
  return `# 扩展 API 速查手册

⚠️ **使用原则**：仅在用户明确提出需求时使用

---

## 🏠 房间管理增强

### createRoom() - 创建自定义房间

**使用场景**：需要固定房间ID（邀请好友）

\`\`\`javascript
const res = await manager.createRoom({
  data: {
    roomCfg: {
      maxPlayerCount: 4,
      type: 'custom',
      roomId: 'ROOM_12345'  // 自定义房间ID
    },
    playerCfg: {
      customProperties: JSON.stringify({ nickname: 'Player' })
    }
  }
});

// 返回值结构：
// res.roomInfo.roomId  ← 房间 ID
\`\`\`

---

### getRoomList() - 获取房间列表

**使用场景**：显示房间列表 UI

\`\`\`javascript
const res = await manager.getRoomList({
  data: {
    pageIndex: 1,
    pageSize: 20,
    roomType: 'pvp'
  }
});

// 返回值结构：
// res.rooms  ← 房间数组
// res.rooms[].roomId
// res.rooms[].currentPlayerCount
// res.rooms[].maxPlayerCount
\`\`\`

---

### joinRoom() - 加入指定房间

**使用场景**：通过房间ID邀请好友

\`\`\`javascript
const res = await manager.joinRoom({
  data: {
    roomId: 'ROOM_12345',
    playerCfg: {
      customProperties: JSON.stringify({ nickname: 'Player' })
    }
  }
});

// 返回值结构：
// res.roomInfo  ← 房间信息（同 matchRoom）
\`\`\`

---

### kickRoomPlayer() - 踢出玩家

**使用场景**：房主踢人功能

\`\`\`javascript
// 仅房主可调用
await manager.kickRoomPlayer({
  data: { kickedPlayerId: 'player_123' }
});

// 返回值：无（void）
// 被踢玩家会收到 onPlayerKicked 事件
\`\`\`

---

## 🔌 连接控制

### disconnect() - 主动断开连接

**使用场景**：游戏切后台时断开

\`\`\`javascript
await manager.disconnect();

// 返回值：无（void）
\`\`\`

---

## 📊 玩家状态扩展

### updatePlayerCustomStatus() - 更新简单状态

**使用场景**：需要额外的数字状态字段

\`\`\`javascript
await manager.updatePlayerCustomStatus({
  data: { customStatus: 1 }  // 只能是数字
});

// 返回值：无（void）
// 所有人会收到 onPlayerCustomStatusChange 事件
\`\`\`

---

## 🚨 扩展事件

### onBattleServiceError - 服务错误

\`\`\`javascript
manager.registerListener({
  onBattleServiceError: (info) => {
    // info.code
    // info.message
  }
});
\`\`\`

### onPlayerKicked - 被踢事件

\`\`\`javascript
manager.registerListener({
  onPlayerKicked: (info) => {
    // 玩家被房主踢出
  }
});
\`\`\`

### onPlayerCustomStatusChange - 状态变更

\`\`\`javascript
manager.registerListener({
  onPlayerCustomStatusChange: (info) => {
    // info.playerInfo.id
    // info.playerInfo.customStatus
  }
});
\`\`\`

---

## 📋 完整扩展 API 清单

| API | 用途 | 使用场景 |
|-----|------|---------|
| createRoom | 创建自定义房间 | 邀请好友 |
| getRoomList | 获取房间列表 | 房间列表UI |
| joinRoom | 加入指定房间 | 好友邀请 |
| kickRoomPlayer | 踢出玩家 | 房主管理 |
| disconnect | 主动断开 | 切后台 |
| updatePlayerCustomStatus | 更新状态 | 额外状态字段 |
`;
}

/**
 * 同步策略指南（合并摇杆同步 + 节流）
 */
async function getSyncStrategy(): Promise<string> {
  return `# 同步策略指南

## 🎯 策略选择

### 策略1：定时同步（摇杆/WASD控制）

**适用场景**：虚拟摇杆、WASD 键盘控制

**实现方案**：定时同步 + 位置变化检测

\`\`\`javascript
class MultiplayerManager {
  constructor() {
    this.SYNC_INTERVAL = 100;  // 100ms = 10次/秒
    this.lastSyncTime = 0;
    this.lastX = 0;
    this.lastY = 0;
  }

  // 在游戏主循环中调用
  update(player) {
    const now = Date.now();

    // 检查位置是否变化
    const posChanged = Math.abs(player.x - this.lastX) > 0.5 ||
                       Math.abs(player.y - this.lastY) > 0.5;

    // 定时同步 + 位置变化检测
    if (posChanged && now - this.lastSyncTime >= this.SYNC_INTERVAL) {
      this.syncPosition(player);
      this.lastSyncTime = now;
      this.lastX = player.x;
      this.lastY = player.y;
    }
  }

  syncPosition(player) {
    this.manager.sendCustomMessage({
      data: {
        msg: JSON.stringify({ type: 'position', x: player.x, y: player.y }),
        type: 0
      }
    });
  }
}

// 使用
function gameLoop() {
  player.update();  // 应用摇杆输入
  multiplayerManager.update(player);  // 同步位置
  requestAnimationFrame(gameLoop);
}
\`\`\`

---

### 策略2：事件驱动同步（点击移动）

**适用场景**：点击目标、技能释放

**实现方案**：直接在事件中同步

\`\`\`javascript
player.onClick = (targetX, targetY) => {
  // 1. 本地立即执行
  player.moveTo(targetX, targetY);

  // 2. 发送给其他玩家
  manager.sendCustomMessage({
    data: {
      msg: JSON.stringify({ type: 'move_to', targetX, targetY }),
      type: 0
    }
  });
};
\`\`\`

---

## 🔴 频率限制处理

**关键**：sendCustomMessage 有 15次/秒限制（与其他 API 共享）

**解决方案**：使用定时器控制

\`\`\`javascript
// 方案1：简单定时器
let lastSyncTime = 0;
const SYNC_INTERVAL = 100;  // 100ms = 10次/秒

function syncData(data) {
  const now = Date.now();
  if (now - lastSyncTime >= SYNC_INTERVAL) {
    manager.sendCustomMessage({...});
    lastSyncTime = now;
  }
}

// 方案2：封装为类方法（在 MultiplayerManager 中）
constructor() {
  this.lastSyncTime = 0;
  this.SYNC_INTERVAL = 100;
}

canSync() {
  const now = Date.now();
  if (now - this.lastSyncTime >= this.SYNC_INTERVAL) {
    this.lastSyncTime = now;
    return true;
  }
  return false;
}

syncData() {
  if (this.canSync()) {
    this.manager.sendCustomMessage({...});
  }
}
\`\`\`
`;
}

/**
 * API 数据结构完整参考（新增）
 */
async function getApiDataStructures(): Promise<string> {
  return `# API 返回数据结构完整参考

## 核心 API 返回值

### connect() - 连接服务器

\`\`\`javascript
const res = await manager.connect();

// 返回值结构：
{
  playerId: "player_123456",  // 本地玩家 ID（必须保存）
  errMsg: ""                  // 错误信息（空字符串表示成功）
}
\`\`\`

---

### matchRoom() - 匹配房间

\`\`\`javascript
const res = await manager.matchRoom({...});

// 返回值结构：
{
  roomInfo: {
    roomId: "room_abc123",           // 房间 ID
    ownerId: "player_123456",        // 房主 ID
    maxPlayerCount: 4,               // 最大人数
    currentPlayerCount: 2,           // 当前人数
    customProperties: "{...}",       // 房间自定义属性（JSON字符串）
    players: [                       // 所有玩家数组
      {
        id: "player_123456",         // 玩家 ID
        customProperties: "{...}"    // 玩家属性（JSON字符串）
      }
    ]
  }
}
\`\`\`

---

### sendCustomMessage() - 发送消息

\`\`\`javascript
await manager.sendCustomMessage({
  data: {
    msg: JSON.stringify({ type: 'position', x: 100, y: 200 }),
    type: 0  // 0=所有人（不包括自己），1=指定玩家
  }
});

// 返回值：无（void）
// 注意：发送者自己不会收到 onCustomMessage 事件
\`\`\`

---

### updatePlayerCustomProperties() - 更新玩家属性

\`\`\`javascript
await manager.updatePlayerCustomProperties({
  properties: JSON.stringify({ score: 100, level: 5 })
});

// 返回值：无（void）
// 注意：所有人会收到 onPlayerCustomPropertiesChange 事件（包括自己）
\`\`\`

---

### updateRoomProperties() - 更新房间属性

\`\`\`javascript
await manager.updateRoomProperties({
  data: {
    customProperties: JSON.stringify({ map: 'level_2' })
  }
});

// 返回值：无（void）
// 注意：只有房主能调用；所有人会收到 onRoomPropertiesChange 事件
\`\`\`

---

### leaveRoom() - 退出房间

\`\`\`javascript
await manager.leaveRoom();

// 返回值：无（void）
// 注意：其他玩家会收到 playerLeaveRoom 事件
\`\`\`

---

## 事件回调数据结构

### playerEnterRoom - 玩家进入房间

\`\`\`javascript
playerEnterRoom: (info) => {
  // info 结构：
  {
    playerInfo: {
      id: "player_789012",         // 新玩家 ID
      customProperties: "{...}"    // 新玩家属性（JSON字符串）
    }
  }

  // 使用：
  const playerId = info.playerInfo.id;
  const props = JSON.parse(info.playerInfo.customProperties);
}
\`\`\`

---

### playerLeaveRoom - 玩家离开房间

\`\`\`javascript
playerLeaveRoom: (info) => {
  // info 结构：
  {
    playerInfo: {
      id: "player_789012"          // 离开的玩家 ID
    }
  }
}
\`\`\`

---

### playerOffline - 玩家掉线

\`\`\`javascript
playerOffline: (info) => {
  // info 结构：
  {
    playerInfo: {
      id: "player_789012"          // 掉线的玩家 ID
    }
  }
}
\`\`\`

---

### onCustomMessage - 收到自定义消息

\`\`\`javascript
onCustomMessage: (info) => {
  // info 结构：
  {
    fromPlayerId: "player_789012", // 发送者 ID
    msg: "{...}"                   // 消息内容（JSON字符串）
  }

  // 使用：
  const message = JSON.parse(info.msg);
}
\`\`\`

---

### onPlayerCustomPropertiesChange - 玩家属性变更

\`\`\`javascript
onPlayerCustomPropertiesChange: (info) => {
  // info 结构：
  {
    playerInfo: {
      id: "player_789012",         // 玩家 ID
      customProperties: "{...}"    // 更新后的属性（JSON字符串）
    }
  }

  // 使用：
  const playerId = info.playerInfo.id;
  const props = JSON.parse(info.playerInfo.customProperties);
}
\`\`\`

---

### onRoomPropertiesChange - 房间属性变更

\`\`\`javascript
onRoomPropertiesChange: (info) => {
  // info 结构：
  {
    customProperties: "{...}",     // 更新后的房间属性（JSON字符串）
    ownerId: "player_123456"       // 房主 ID（可能变更）
  }

  // 使用：
  const props = JSON.parse(info.customProperties);
  const newOwnerId = info.ownerId;
}
\`\`\`

---

### onDisconnected - 连接断开

\`\`\`javascript
onDisconnected: (info) => {
  // info 结构：
  {
    code: 1000,                    // 错误代码
    reason: "connection lost"      // 断开原因
  }
}
\`\`\`

---

## 📋 扩展 API 完整清单

| API | 用途 | 使用场景 | 返回值 |
|-----|------|---------|-------|
| createRoom | 创建自定义房间 | 邀请好友 | roomInfo |
| getRoomList | 获取房间列表 | 房间列表UI | rooms 数组 |
| joinRoom | 加入指定房间 | 好友邀请 | roomInfo |
| kickRoomPlayer | 踢出玩家 | 房主管理 | void |
| disconnect | 主动断开 | 切后台 | void |
| updatePlayerCustomStatus | 更新状态 | 额外状态字段 | void |
`;
}

/**
 * 一键生成多人联机代码（新增）
 */
async function generateMultiplayerCode(): Promise<string> {
  const codeTemplate = await getCompleteExample();
  const guideTemplate = await generateLocalMultiplayerGuide();

  return `# 一键生成多人联机代码

已为你生成以下文件，请保存到项目中：

---

## 📄 文件1：js/MultiplayerManager.js

**路径**：\`js/MultiplayerManager.js\` 或 \`game/js/MultiplayerManager.js\`

**内容**：

${codeTemplate}

---

## 📄 文件2：MULTIPLAYER_GUIDE.md

**路径**：项目根目录 \`MULTIPLAYER_GUIDE.md\`

**内容**：

${guideTemplate}

---

## ✅ 下一步

1. **保存文件**：将以上内容保存到对应路径
2. **引入代码**：在 main.js 或 game.js 中引入
   \`\`\`javascript
   // 引入多人联机管理器（根据你的文件路径调整）
   // <script src="js/MultiplayerManager.js"></script>
   \`\`\`
3. **开始使用**：参考 MULTIPLAYER_GUIDE.md 中的使用示例

---

## 🎯 快速验证

\`\`\`javascript
const mp = new MultiplayerManager();
await mp.init();
console.log('初始化成功，playerId:', mp.myPlayerId);
\`\`\`
`;
}

/**
 * 问题诊断工具（新增 - 可扩展）
 */
async function diagnoseIssues(): Promise<string> {
  return `# 多人联机问题诊断工具

---

## 🎯 快速诊断流程

### 步骤1：确认问题类型

| 问题类型 | 典型症状 |
|---------|---------|
| A. 看不到其他玩家 | 房间内有多人，但只能看到自己 |
| B. 位置不同步 | 远程玩家位置不更新或延迟严重 |
| C. 连接失败 | connect() 或 matchRoom() 调用失败 |
| D. API 调用失败 | sendCustomMessage 等 API 报错 |

---

## 🔍 问题A：看不到其他玩家

### 检查点1：playerEnterRoom 事件是否触发？

\`\`\`javascript
// 在事件中添加日志
playerEnterRoom: (info) => {
  console.log('✅ playerEnterRoom 触发:', info);  // 添加这行
  // ...
}
\`\`\`

**如果没有触发**：
- 原因：registerListener 可能在 connect 之后调用
- 解决：确保顺序：registerListener → connect

**如果触发了**：继续检查点2

---

### 检查点2：是否正确提取 playerId？

\`\`\`javascript
// 检查 playerId 是否正确
playerEnterRoom: (info) => {
  console.log('原始 info:', info);
  const playerId = info.playerInfo.id;  // ✅ 正确
  console.log('提取的 playerId:', playerId);

  if (!playerId) {
    console.error('❌ playerId 提取失败！');
  }
}
\`\`\`

**常见错误**：
- ❌ \`info.playerId\`（错误）
- ❌ \`info.id\`（错误）
- ✅ \`info.playerInfo.id\`（正确）

**解决方案**：使用 MultiplayerManager 代码模板（已内置兼容函数）

---

### 检查点3：是否初始化了房间内已有玩家？

\`\`\`javascript
// matchRoom 成功后
const res = await manager.matchRoom({...});
const roomInfo = res.roomInfo;

console.log('房间内玩家数:', roomInfo.players.length);

// ✅ 必须遍历初始化
roomInfo.players.forEach(player => {
  if (player.id !== myPlayerId) {
    console.log('初始化已有玩家:', player.id);
    createRemotePlayer(player);  // 创建玩家对象
  }
});
\`\`\`

**常见错误**：
- 只处理了 playerEnterRoom（新玩家加入）
- 忘记初始化房间内已有的玩家

---

## 🔍 问题B：位置不同步

### 检查点1：是否在发送位置？

\`\`\`javascript
// 添加日志
multiplayer.syncPosition(player.x, player.y);
console.log('✅ 发送位置:', player.x, player.y);
\`\`\`

**如果日志频率很低**：
- 可能：变化检测导致跳过（位置没变）
- 解决：移动玩家，观察日志

**如果根本没日志**：
- 可能：频率限制导致全部跳过
- 检查：SYNC_INTERVAL 设置

---

### 检查点2：是否接收到位置消息？

\`\`\`javascript
// 添加日志
onCustomMessage: (info) => {
  console.log('✅ 收到消息:', info);  // 添加这行

  const data = JSON.parse(info.msg);
  console.log('解析后:', data);

  if (data.type === 'position') {
    console.log('位置消息:', data.x, data.y);
  }
}
\`\`\`

**如果没收到**：
- 检查：发送端和接收端的 type 字段是否一致
- 检查：是否进入了同一个房间

---

### 检查点3：是否更新了远程玩家对象？

\`\`\`javascript
// 更新位置
if (data.type === 'position') {
  const remotePlayer = remotePlayers[fromPlayerId];

  if (!remotePlayer) {
    console.error('❌ 远程玩家对象不存在:', fromPlayerId);
    return;
  }

  console.log('✅ 更新位置:', fromPlayerId, data.x, data.y);
  remotePlayer.x = data.x;
  remotePlayer.y = data.y;
}
\`\`\`

---

## 🔍 问题C：连接失败

### 检查点1：TapTap SDK 是否可用？

\`\`\`javascript
// 检查 SDK
console.log('tap 对象:', typeof tap);
console.log('getOnlineBattleManager:', tap?.getOnlineBattleManager);

if (typeof tap === 'undefined') {
  console.error('❌ TapTap SDK 不可用');
  // 使用单机模式或提示用户
}
\`\`\`

**解决方案**：
- 确保在 TapTap 小游戏环境中运行
- 或使用 MultiplayerManager（已内置单机降级）

---

### 检查点2：网络连接是否正常？

\`\`\`javascript
try {
  const res = await manager.connect();
  console.log('✅ 连接成功:', res);
} catch (error) {
  console.error('❌ 连接失败:', error);
  // 检查错误类型
}
\`\`\`

---

## 🔍 问题D：API 调用失败

### 常见原因1：超过频率限制

**症状**：sendCustomMessage 报错

**解决方案**：
- 使用 MultiplayerManager.syncPosition()（已内置节流）
- 或手动添加频率限制（100ms 间隔）

---

### 常见原因2：未进入房间

**症状**：调用 sendCustomMessage 提示"未进入房间"

**解决方案**：
- 确保 matchRoom() 成功后再发送数据
- 检查 isInRoom 状态

---

### 常见原因3：消息格式错误

**症状**：msg 参数错误

**解决方案**：
- msg 必须是字符串：\`JSON.stringify(data)\`
- 必须包装在 data 对象中

---

## 📋 诊断总结

如果以上检查都通过，但仍有问题，请提供：
1. 完整的错误消息
2. 相关代码片段
3. 控制台日志

---

## 🔧 快速修复工具

| 问题 | 调用工具 |
|------|---------|
| 字段名不确定 | get_api_data_structures |
| 需要完整示例 | get_code_template |
| playerId 使用问题 | get_player_id_guide |
| 位置同步策略 | get_sync_strategy |
| 验证代码正确性 | check_multiplayer_code |

---

**💡 提示**：大部分问题都能通过使用 MultiplayerManager 代码模板避免。
`;
}

/**
 * 代码检查工具（新增）
 */
async function checkCode(args: { code: string }): Promise<string> {
  const code = args.code;
  const issues = [];

  // 检测1：是否保存 playerId
  if (code.includes('connect()') && !code.includes('playerId')) {
    issues.push({
      severity: 'high',
      issue: '未保存 connect() 返回的 playerId',
      location: 'connect() 调用处',
      fix: 'const res = await manager.connect(); this.myPlayerId = res.playerId;',
      reference: '调用 get_player_id_guide 了解详情'
    });
  }

  // 检测2：是否使用了错误的字段名
  const wrongFields = [
    { pattern: /playerLeaveRoom.*info\.playerId/, correct: 'info.playerInfo.id' },
    { pattern: /playerOffline.*info\.playerId/, correct: 'info.playerInfo.id' },
    { pattern: /onCustomMessage.*info\.playerId/, correct: 'info.fromPlayerId' },
    { pattern: /onCustomMessage.*info\.message/, correct: 'info.msg' }
  ];

  wrongFields.forEach(({ pattern, correct }) => {
    if (pattern.test(code)) {
      issues.push({
        severity: 'high',
        issue: '字段名错误',
        location: pattern.source,
        fix: `应使用 ${correct}`,
        reference: '调用 get_api_data_structures 查看正确字段'
      });
    }
  });

  // 检测3：是否有频率限制
  if (code.includes('sendCustomMessage') && code.includes('requestAnimationFrame')) {
    if (!code.includes('lastSyncTime') && !code.includes('SYNC_INTERVAL') && !code.includes('syncPosition')) {
      issues.push({
        severity: 'high',
        issue: '在游戏循环中调用 sendCustomMessage 但无频率限制',
        location: 'gameLoop 或 requestAnimationFrame 内部',
        fix: '使用 MultiplayerManager.syncPosition() 方法（已内置频率限制）',
        reference: '调用 get_sync_strategy 了解同步策略'
      });
    }
  }

  // 检测4：是否初始化房间内已有玩家
  if (code.includes('matchRoom') && !code.includes('roomInfo.players')) {
    issues.push({
      severity: 'medium',
      issue: '未初始化房间内已有的玩家',
      location: 'matchRoom 成功后',
      fix: 'roomInfo.players.forEach(p => { if (p.id !== myPlayerId) createPlayer(p); })',
      reference: '查看 get_code_template 中的完整示例'
    });
  }

  // 检测5：registerListener 是否在 connect 之前
  const connectIndex = code.indexOf('connect()');
  const registerIndex = code.indexOf('registerListener');
  if (connectIndex > 0 && registerIndex > 0 && connectIndex < registerIndex) {
    issues.push({
      severity: 'high',
      issue: 'registerListener 必须在 connect 之前调用',
      location: '初始化流程',
      fix: '调整顺序：1. getOnlineBattleManager → 2. registerListener → 3. connect',
      reference: '查看 get_code_template 中的正确顺序'
    });
  }

  if (issues.length === 0) {
    return `✅ 代码检查通过！

未发现常见问题。你的代码看起来不错！

建议：
- 在真实环境中测试
- 使用 diagnose_multiplayer_issues 工具排查运行时问题
`;
  }

  return `# 代码检查结果

发现 ${issues.length} 个潜在问题：

---

${issues.map((issue, index) => `
## 问题 ${index + 1}：${issue.issue}

**严重程度**：${issue.severity === 'high' ? '🔴 高' : '🟡 中'}
**位置**：${issue.location}

**修复方案**：
\`\`\`
${issue.fix}
\`\`\`

**参考**：${issue.reference}

---
`).join('\n')}

## 💡 建议

修复以上问题后，重新调用 check_multiplayer_code 验证。

或直接使用 MultiplayerManager 代码模板（已避免所有常见问题）：
\`\`\`
get_code_template
\`\`\`
`;
}

// 导出所有文档工具
export const multiplayerDocTools = {
  // 核心工具（保留）
  getIntegrationWorkflow,
  getCompleteExample,
  getApiEventRelations,
  getProtocolTemplate,

  // 专题工具（保留并优化）
  getPlayerIdGuide,
  getSyncStrategy,
  generateLocalMultiplayerGuide,

  // 实战优化工具
  getExtendedApis,
  getApiDataStructures,

  // 新增工具
  generateMultiplayerCode,
  diagnoseIssues,
  checkCode
};
