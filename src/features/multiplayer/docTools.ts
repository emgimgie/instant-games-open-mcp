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

// ============ 阶段分类文档工具 ============

/**
 * 阶段1：初始化和连接 API 文档
 */
async function getStep1Init(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'step1_init');
}

/**
 * 阶段2：匹配进入房间 API 文档
 */
async function getStep2Room(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'step2_room');
}

/**
 * 阶段3：玩家数据更新 API 文档
 */
async function getStep3PlayerData(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'step3_player_data');
}

/**
 * 阶段4：房间数据更新 API 文档
 */
async function getStep4RoomData(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'step4_room_data');
}

/**
 * 阶段5：数据广播转发 API 文档
 */
async function getStep5Broadcast(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'step5_broadcast');
}

/**
 * 阶段6：事件通知文档
 */
async function getStep6Events(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'step6_events');
}

/**
 * 阶段7：退出房间 API 文档
 */
async function getStep7Exit(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'step7_exit');
}

/**
 * 数据结构文档
 */
async function getDataStructures(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'data_structures');
}

/**
 * 通用流程模板文档
 */
async function getCommonPatterns(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'common_patterns');
}

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

// ============ 单个 API 文档工具 ============

/**
 * tap.getOnlineBattleManager() 文档
 */
async function getGetOnlineBattleManager(): Promise<string> {
  return generateAPIDoc(MULTIPLAYER_DOCUMENTATION, 'step1_init', 'tap.getOnlineBattleManager');
}

/**
 * registerListener() 文档
 */
async function getRegisterListener(): Promise<string> {
  return generateAPIDoc(MULTIPLAYER_DOCUMENTATION, 'step1_init', 'OnlineBattleManager.registerListener');
}

/**
 * connect() 文档
 */
async function getConnect(): Promise<string> {
  return generateAPIDoc(MULTIPLAYER_DOCUMENTATION, 'step1_init', 'OnlineBattleManager.connect');
}

/**
 * matchRoom() 文档
 */
async function getMatchRoom(): Promise<string> {
  return generateAPIDoc(MULTIPLAYER_DOCUMENTATION, 'step2_room', 'OnlineBattleManager.matchRoom');
}

/**
 * updatePlayerCustomProperties() 文档
 */
async function getUpdatePlayerCustomProperties(): Promise<string> {
  return generateAPIDoc(MULTIPLAYER_DOCUMENTATION, 'step3_player_data', 'OnlineBattleManager.updatePlayerCustomProperties');
}

/**
 * updateRoomProperties() 文档
 */
async function getUpdateRoomProperties(): Promise<string> {
  return generateAPIDoc(MULTIPLAYER_DOCUMENTATION, 'step4_room_data', 'OnlineBattleManager.updateRoomProperties');
}

/**
 * sendCustomMessage() 文档
 */
async function getSendCustomMessage(): Promise<string> {
  return generateAPIDoc(MULTIPLAYER_DOCUMENTATION, 'step5_broadcast', 'OnlineBattleManager.sendCustomMessage');
}

/**
 * leaveRoom() 文档
 */
async function getLeaveRoom(): Promise<string> {
  return generateAPIDoc(MULTIPLAYER_DOCUMENTATION, 'step7_exit', 'OnlineBattleManager.leaveRoom');
}

// ============ 辅助工具 ============

/**
 * 资源建议列表（用于搜索建议）
 */
const MULTIPLAYER_SUGGESTIONS: ResourceSuggestion[] = [
  {
    keywords: ['初始化', 'init', 'manager', '管理器', 'getOnlineBattleManager', '连接', 'connect'],
    uri: 'docs://multiplayer/step1-init',
    description: '阶段1：初始化和连接 - getOnlineBattleManager、registerListener、connect'
  },
  {
    keywords: ['房间', 'room', '匹配', 'match', '加入', 'join'],
    uri: 'docs://multiplayer/step2-room',
    description: '阶段2：匹配进入房间 - matchRoom'
  },
  {
    keywords: ['玩家', 'player', '属性', 'properties', 'customProperties'],
    uri: 'docs://multiplayer/step3-player-data',
    description: '阶段3：玩家数据更新 - updatePlayerCustomProperties'
  },
  {
    keywords: ['房间属性', 'room properties', '更新房间'],
    uri: 'docs://multiplayer/step4-room-data',
    description: '阶段4：房间数据更新 - updateRoomProperties'
  },
  {
    keywords: ['消息', 'message', '发送', 'send', '同步', 'sync', '广播', 'broadcast'],
    uri: 'docs://multiplayer/step5-broadcast',
    description: '阶段5：数据广播转发 - sendCustomMessage'
  },
  {
    keywords: ['事件', 'event', '监听', 'listener', '回调', 'callback'],
    uri: 'docs://multiplayer/step6-events',
    description: '阶段6：事件通知 - onDisconnected、playerEnterRoom 等'
  },
  {
    keywords: ['退出', 'leave', '离开', 'exit'],
    uri: 'docs://multiplayer/step7-exit',
    description: '阶段7：退出房间 - leaveRoom'
  },
  {
    keywords: ['数据', 'data', '结构', 'structure', 'PlayerInfo', 'RoomInfo'],
    uri: 'docs://multiplayer/data-structures',
    description: '数据结构 - PlayerInfo、RoomInfo'
  },
  {
    keywords: ['断线', 'disconnect', '断开', 'offline'],
    uri: 'docs://multiplayer/step6-events',
    description: '断线事件 - onDisconnected、playerOffline'
  }
];

/**
 * 搜索多人联机文档
 */
async function searchMultiplayerDocs(args: ToolArgs): Promise<string> {
  const query = args.query?.toLowerCase() || '';

  if (!query) {
    return 'Please provide a search keyword. 请提供搜索关键词。';
  }

  const results = searchDocumentation(MULTIPLAYER_DOCUMENTATION, query);

  if (results.length === 0) {
    return generateSearchSuggestions(
      query,
      MULTIPLAYER_SUGGESTIONS,
      'docs://multiplayer/overview'
    );
  }

  return `**🎮 搜索结果 "${query}"**\n\n` + results.join('\n---\n\n');
}

/**
 * 获取完整概览
 */
async function getMultiplayerOverview(): Promise<string> {
  return generateOverview(MULTIPLAYER_DOCUMENTATION);
}

/**
 * 获取完整集成流程指南
 */
async function getIntegrationWorkflow(): Promise<string> {
  return `# TapTap 多人联机 SDK 完整接入流程

---

## 🚨 第一步：创建独立联机模块 + 本地指南文档（强制要求）

### ⚠️ 【强制规范】多人联机必须使用独立代码模块

**多人联机功能必须放在独立的代码文件中**（如 \`MultiplayerManager.js\`），严禁将联机代码散落在各处！

### 步骤 1：生成本地指南文档

1. **调用 \`generate_local_multiplayer_guide\` 工具**
2. **将内容保存为项目根目录的 \`MULTIPLAYER_GUIDE.md\`**

### 步骤 2：创建独立联机模块并添加强制性头部注释

**在联机模块文件顶部必须添加以下注释**：

\`\`\`javascript
// ========== MultiplayerManager.js ==========
/**
 * ⚠️ 【强制规范】多人联机独立模块
 * 所有多人联机开发必须遵循项目中的 "MULTIPLAYER_GUIDE.md"
 * 如有冲突，需要告知开发者！
 * 
 * 🔴 API 频率限制：sendCustomMessage / updatePlayerCustomProperties / updateRoomProperties
 *    三个 API 共享每秒 15 次限制！严禁超频调用！
 */
\`\`\`

### 步骤 3：在频率限制 API 调用处添加注释

**每次调用以下 API 时，必须在调用代码旁添加频率限制注释**：

\`\`\`javascript
// 示例：sendCustomMessage 调用
manager.sendCustomMessage({  // 🔴 频率限制：共享 15次/秒
  data: { msg: JSON.stringify(data), type: 0 }
});

// 示例：updatePlayerCustomProperties 调用
manager.updatePlayerCustomProperties({  // 🔴 频率限制：共享 15次/秒
  properties: JSON.stringify(props)
});

// 示例：updateRoomProperties 调用
manager.updateRoomProperties({  // 🔴 频率限制：共享 15次/秒
  data: { customProperties: JSON.stringify(props) }
});
\`\`\`

### 为什么要这样做？

1. **保持 MCP 上下文** - 即使后续对话没有触发 MCP，AI 读取代码时也能看到规范
2. **防止违反频率限制** - 这是最常见的错误，注释就在调用处，无法忽视
3. **代码组织清晰** - 独立模块便于维护和复用
4. **主动告知机制** - 如果开发内容违背规范，AI 会主动告知开发者

---

## ⚠️ 关键时序说明（必读）

### 正确的初始化顺序（必须严格遵守）

\`\`\`
1. tap.getOnlineBattleManager()  → 获取管理器实例
2. registerListener()            → 注册事件监听（必须在 connect 之前！）
3. connect()                     → 连接服务器，获取 playerId
4. matchRoom()                   → 匹配房间，获取 roomInfo
5. 处理 roomInfo.players        → 初始化房间内已有的所有玩家
\`\`\`

❌ **错误顺序**：connect → registerListener（会错过连接过程中的事件）
✅ **正确顺序**：registerListener → connect（确保不遗漏任何事件）

### matchRoom 与 playerEnterRoom 的区别（核心理解点）

| 场景 | 新加入的玩家 | 房间内其他玩家 |
|------|-------------|---------------|
| API/事件 | matchRoom 回调返回 | playerEnterRoom 事件触发 |
| 获得数据 | RoomInfo（包含房间内所有玩家） | PlayerInfo（仅新玩家信息） |
| 处理逻辑 | 遍历 players 初始化所有已有玩家 | 只添加这一个新玩家 |

\`\`\`javascript
// 新玩家自己（通过 matchRoom 回调）
const res = await tapOnlineBattle.matchRoom({...});
res.roomInfo.players.forEach(player => {
  if (player.id !== myPlayerId) {
    createRemotePlayer(player);  // 初始化所有已有玩家
  }
});

// 房间内其他玩家（通过 playerEnterRoom 事件）
tapOnlineBattle.registerListener({
  playerEnterRoom: (info) => {
    createRemotePlayer(info.playerInfo);  // 只添加新玩家
  }
});
\`\`\`

---

## 🔍 实施前需求确认清单

**⚠️ AI 在开始实现多人联机功能前，必须先向用户确认以下问题：**

### 基础信息
- [ ] 游戏最大支持多少玩家同时在线？（影响 maxPlayerCount 配置）
- [ ] 房间类型(type)如何划分？（如按游戏模式、难度等级）

### 数据同步需求
- [ ] 需要同步哪些玩家数据？（状态、分数、属性等）
- [ ] 是否有房间级别的共享数据需要同步？（如游戏进度、地图状态）
- [ ] ⚠️ 重要：数据同步必须按需同步或低频定时同步，禁止高频同步

### 交互玩法
- [ ] 有哪些玩家间的交互行为？（攻击、道具、技能、碰撞等）
- [ ] 这些交互是否需要定义通讯协议？（建议复杂交互需要协议文档）
- [ ] 是否需要生成协议模板文件？（推荐：docs/multiplayer-protocol.md）

**💡 提示**：
- 默认不需要匹配界面，只有玩家明确提出时才实现
- SDK 支持中途加入游戏
- 玩家掉线会自动触发 playerOffline 事件，1v1 游戏可直接判负
- 房主离开后，SDK 会通过 onRoomPropertiesChange 事件通知新的房主 ID（通过 ownerId 字段）
- 确认以上问题后，可获取详细的通用流程模板（get_multiplayer_common_patterns）和 API-事件关系表（get_api_event_relations）来辅助开发

---

## 📋 总流程

\`\`\`
初始化和连接 → 匹配进入房间 → 游戏数据互通流转循环 → 退出房间
\`\`\`

⚠️ **关键约束：必须进入房间后才能进行联机通信！**

---

## ⚠️ 关键原则

**客户端 API（无需安装）**：
- ❌ 不需要 npm install
- ❌ 不需要 import 语句
- ✅ \`tap\` 是全局对象，由 TapTap 运行时自动提供

**🚨 API 频率限制（极其重要）**：
- ⚠️ **所有 API 都不适合高频调用！游戏设计必须避免高频次使用 API！**
- \`sendCustomMessage\`、\`updatePlayerCustomProperties\`、\`updateRoomProperties\` 共享每秒 **15次** 的频率限制
- ❌ **禁止**：在游戏主循环的每帧都调用 API（例如 60fps 游戏中每帧调用会触发限制）
- ✅ **推荐**：使用定时器控制调用频率（建议 100-200ms 间隔，每秒 5-10 次，留有安全余量）
- ✅ **最佳实践**：
  - 实现节流函数，确保不会超过频率限制
  - 对于快速变化的数据（如位置），使用客户端插值技术减少同步频率
  - 仅在状态真正变化时才调用 API，避免重复同步相同数据

---

## 阶段1：初始化和连接

**目的**：获取管理器、注册事件监听、连接服务器

\`\`\`javascript
// 1. 获取多人联机管理器（全局单例）
let tapOnlineBattle = tap.getOnlineBattleManager();

// 2. 注册事件监听（必须在 connect 之前）
tapOnlineBattle.registerListener({
  onDisconnected: (errorInfo) => {
    // 处理断线
  },
  playerEnterRoom: (info) => {
    // 处理新玩家进入
  },
  playerLeaveRoom: (info) => {
    // 处理玩家离开
  },
  playerOffline: (info) => {
    // 处理玩家掉线
  },
  onCustomMessage: (info) => {
    // 处理实时消息
  },
  onPlayerCustomPropertiesChange: (info) => {
    // 处理玩家属性变更
  },
  onRoomPropertiesChange: (info) => {
    // 处理房间属性变更
  }
});

// 3. 连接服务器，获取 playerId
const res = await tapOnlineBattle.connect();
const myPlayerId = res.playerId;
\`\`\`

---

## 阶段2：匹配进入房间

**目的**：自动匹配或创建房间

⚠️ **必须进入房间后才能进行联机通信！**

💡 **单人开始说明**：
- matchRoom 100% 成功（要么匹配到现有房间，要么创建新房间）
- 如果游戏没有队伍等待/匹配界面，无需等待其他玩家加入
- 单人即可直接开始联机游戏，后续有新玩家加入时会触发 playerEnterRoom 事件

\`\`\`javascript
const res = await tapOnlineBattle.matchRoom({
  data: {
    roomCfg: {
      maxPlayerCount: 4,        // 最大人数
      type: "game_mode",        // 房间类型（用于匹配分组）
      matchParams: {
        level: "1"              // 匹配参数
      }
    },
    playerCfg: {
      customProperties: JSON.stringify({
        nickname: '玩家昵称'
      })
    }
  }
});

const roomInfo = res.roomInfo;
// 初始化房间内已有的玩家
roomInfo.players.forEach(player => {
  // 游戏逻辑自行实现
});
\`\`\`

---

## 阶段3-5：游戏数据互通流转循环

### 3. 玩家数据更新

**目的**：同步玩家属性变化（如分数、等级）

\`\`\`javascript
await tapOnlineBattle.updatePlayerCustomProperties({
  properties: JSON.stringify({
    score: 100,
    level: 5
  })
});
// 所有玩家会收到 onPlayerCustomPropertiesChange 事件
\`\`\`

### 4. 房间数据更新（可选，仅房主）

**目的**：同步房间级别数据

\`\`\`javascript
await tapOnlineBattle.updateRoomProperties({
  data: {
    customProperties: JSON.stringify({
      map: 'level_2'
    })
  }
});
// 所有玩家会收到 onRoomPropertiesChange 事件
\`\`\`

### 5. 数据广播转发

**目的**：实时同步游戏数据（如位置、动作）

\`\`\`javascript
// 注意频率限制：每秒最多50次
let lastSyncTime = 0;
const SYNC_INTERVAL = 50; // 50ms

function gameLoop() {
  // 游戏逻辑自行实现
  
  const now = Date.now();
  if (now - lastSyncTime >= SYNC_INTERVAL) {
    tapOnlineBattle.sendCustomMessage({
      data: {
        msg: JSON.stringify({
          type: 'player_state',
          x: player.x,
          y: player.y
        }),
        type: 0  // 发给房间所有人
      }
    });
    lastSyncTime = now;
  }
  
  requestAnimationFrame(gameLoop);
}
\`\`\`

---

## 阶段6：事件通知

**目的**：响应服务器推送的各种事件

事件通过 registerListener 在阶段1注册，主要包括：
- \`onDisconnected\` - 断线
- \`playerEnterRoom\` - 新玩家进入
- \`playerLeaveRoom\` - 玩家离开
- \`playerOffline\` - 玩家掉线
- \`onCustomMessage\` - 收到实时消息
- \`onPlayerCustomPropertiesChange\` - 玩家属性变更
- \`onRoomPropertiesChange\` - 房间属性变更

---

## 阶段7：退出房间

**目的**：结束游戏或开始下一局

\`\`\`javascript
await tapOnlineBattle.leaveRoom();
// 可以重新匹配下一局
// await tapOnlineBattle.matchRoom({ ... });
\`\`\`

---

## 💡 注意事项

1. **频率限制**：sendCustomMessage 和 updateRoomProperties 共享每秒15次限制
2. **数据大小**：消息内容和属性最大2048字节
3. **事件顺序**：先 registerListener，后 connect
4. **房主权限**：只有房主可以调用 updateRoomProperties
5. **进房约束**：必须进入房间后才能联机通信

---

## 🟡 扩展功能（可选，仅在明确需求时使用）

⚠️ **重要警告**：以下 API 不是必须的，只有在用户明确提出对应需求时才使用！严禁主动添加！

### 房间管理增强

**使用场景**：需要房间列表界面、自定义创建房间、通过房间 ID 邀请好友

**相关 API**：
- \`createRoom()\` - 创建自定义房间
- \`getRoomList()\` - 获取房间列表
- \`joinRoom()\` - 加入指定房间
- \`kickRoomPlayer()\` - 踢出玩家（房主权限）

**获取文档**：调用 \`get_extended_room_management_apis\`

**典型流程**：
1. 用户点击"创建房间" → 调用 \`createRoom()\`
2. 用户点击"房间列表" → 调用 \`getRoomList()\` → 显示列表
3. 用户选择房间 → 调用 \`joinRoom(roomId)\`

---

### 连接控制

**使用场景**：需要手动控制连接状态（如游戏切换到后台时断开连接）

**相关 API**：
- \`disconnect()\` - 主动断开连接

**获取文档**：调用 \`get_extended_connection_apis\`

**注意**：大部分情况下不需要主动断开连接，\`leaveRoom()\` 会自动断开

---

### 玩家状态扩展

**使用场景**：需要额外的简单数字状态字段（与 customProperties 分离）

**相关 API**：
- \`updatePlayerCustomStatus()\` - 更新玩家自定义状态（数字）

**相关事件**：
- \`onPlayerCustomStatusChange\` - 监听状态变更

**获取文档**：调用 \`get_extended_player_status_apis\`

**注意**：大部分情况下使用 \`customProperties\` 即可，无需额外状态字段

---

### 扩展事件

**使用场景**：需要详细错误处理、踢人事件处理

**相关事件**：
- \`onBattleServiceError\` - 服务错误事件
- \`onPlayerKicked\` - 玩家被踢事件（配合 kickRoomPlayer 使用）
- \`onPlayerCustomStatusChange\` - 状态变更事件（配合 updatePlayerCustomStatus 使用）

**获取文档**：调用 \`get_extended_events_docs\`

---

## 📚 详细文档

### 核心 API（必须实现）
- **docs://multiplayer/overview** - 完整概览
- **docs://multiplayer/step1-init** - 阶段1：初始化和连接
- **docs://multiplayer/step2-room** - 阶段2：匹配进入房间
- **docs://multiplayer/step3-player-data** - 阶段3：玩家数据更新
- **docs://multiplayer/step4-room-data** - 阶段4：房间数据更新
- **docs://multiplayer/step5-broadcast** - 阶段5：数据广播转发
- **docs://multiplayer/step6-events** - 阶段6：事件通知
- **docs://multiplayer/step7-exit** - 阶段7：退出房间
- **docs://multiplayer/data-structures** - 数据结构

### 扩展 API（可选）
- **docs://multiplayer/extended-room-management** - 房间管理增强
- **docs://multiplayer/extended-connection** - 连接控制
- **docs://multiplayer/extended-player-status** - 玩家状态扩展
- **docs://multiplayer/extended-events** - 扩展事件
`;
}

// ============ 扩展 API 文档工具（中等优先级）============

/**
 * 扩展 API - 房间管理增强
 */
async function getExtendedRoomManagement(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'extended_room_management');
}

/**
 * 扩展 API - 连接控制
 */
async function getExtendedConnection(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'extended_connection');
}

/**
 * 扩展 API - 玩家状态
 */
async function getExtendedPlayerStatus(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'extended_player_status');
}

/**
 * 扩展 API - 扩展事件
 */
async function getExtendedEvents(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'extended_events');
}

/**
 * 单个扩展 API - createRoom
 */
async function getCreateRoom(): Promise<string> {
  return generateAPIDoc(MULTIPLAYER_DOCUMENTATION, 'extended_room_management', 'OnlineBattleManager.createRoom');
}

/**
 * 单个扩展 API - getRoomList
 */
async function getGetRoomList(): Promise<string> {
  return generateAPIDoc(MULTIPLAYER_DOCUMENTATION, 'extended_room_management', 'OnlineBattleManager.getRoomList');
}

/**
 * 单个扩展 API - joinRoom
 */
async function getJoinRoom(): Promise<string> {
  return generateAPIDoc(MULTIPLAYER_DOCUMENTATION, 'extended_room_management', 'OnlineBattleManager.joinRoom');
}

/**
 * 单个扩展 API - kickRoomPlayer
 */
async function getKickRoomPlayer(): Promise<string> {
  return generateAPIDoc(MULTIPLAYER_DOCUMENTATION, 'extended_room_management', 'OnlineBattleManager.kickRoomPlayer');
}

/**
 * 单个扩展 API - disconnect
 */
async function getDisconnect(): Promise<string> {
  return generateAPIDoc(MULTIPLAYER_DOCUMENTATION, 'extended_connection', 'OnlineBattleManager.disconnect');
}

/**
 * 单个扩展 API - updatePlayerCustomStatus
 */
async function getUpdatePlayerCustomStatus(): Promise<string> {
  return generateAPIDoc(MULTIPLAYER_DOCUMENTATION, 'extended_player_status', 'OnlineBattleManager.updatePlayerCustomStatus');
}

// ============ 新增：专题指南文档 ============

/**
 * 玩家 ID 完整指南
 */
async function getPlayerIdGuide(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'player_id_guide');
}

/**
 * 摇杆同步策略
 */
async function getJoystickSyncPattern(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'joystick_sync_pattern');
}

/**
 * 本地指南文档模板
 */
async function getLocalGuideTemplate(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'local_guide_template');
}

/**
 * 模块化代码模板
 */
async function getModularTemplates(): Promise<string> {
  return generateCategoryDoc(MULTIPLAYER_DOCUMENTATION, 'modular_templates');
}

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

## 🚨 API 频率限制（最重要！）

\`\`\`
sendCustomMessage + updatePlayerCustomProperties + updateRoomProperties
共享每秒 15 次限制！
\`\`\`

### 禁止的做法
- ❌ 在游戏主循环的每帧调用 API（60fps = 严重超限）
- ❌ 不加限制地发送位置同步消息
- ❌ 同时高频调用多个同步 API

### 推荐的做法
- ✅ 使用 100-200ms 间隔（每秒 5-10 次）
- ✅ 只在数据真正变化时才发送
- ✅ 实现节流函数控制调用频率

### 节流函数示例
\`\`\`javascript
class SyncThrottle {
  constructor(interval = 100) {
    this.interval = interval;
    this.lastTime = 0;
  }
  
  canSync() {
    const now = Date.now();
    if (now - this.lastTime >= this.interval) {
      this.lastTime = now;
      return true;
    }
    return false;
  }
}

// 使用
const throttle = new SyncThrottle(100);
function sendPosition() {
  if (throttle.canSync()) {
    manager.sendCustomMessage({...});
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

## 📦 数据结构注意事项

### matchRoom() 返回值
\`\`\`javascript
// ⚠️ 有 roomInfo 包装层！
const result = await manager.matchRoom({...});
const roomInfo = result.roomInfo;  // ← 注意！
const players = roomInfo.players;  // 不是 result.players
\`\`\`

### playerEnterRoom 回调
\`\`\`javascript
// ⚠️ 有 playerInfo 包装层！
playerEnterRoom: (info) => {
  const playerId = info.playerInfo.id;  // ← 注意！
  // 不是 info.id
}
\`\`\`

### sendCustomMessage 格式
\`\`\`javascript
// ⚠️ 必须有 data 包装层，msg 必须是字符串！
manager.sendCustomMessage({
  data: {
    msg: JSON.stringify({ type: 'move', x: 100 }),
    type: 0
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

## ⚠️ AI 开发注意事项

**如果你是 AI 助手，请注意：**

1. 生成联机代码前，先检查是否存在本文档
2. 生成的代码必须包含频率控制逻辑
3. 如果用户的需求会导致超过频率限制，主动提醒
4. 使用正确的数据结构（注意包装层）
5. 在代码文件顶部添加规范注释

**违规情况示例（需要主动告知用户）**：
- 在每帧调用 sendCustomMessage
- 没有对同步频率做任何限制
- 直接使用 result.players 而不是 result.roomInfo.players

---

*文档生成时间：${timestamp}*
*TapTap MiniGame MCP 版本：${version}*
`;
}

// 导出所有文档工具
export const multiplayerDocTools = {
  // 阶段分类文档
  getStep1Init,
  getStep2Room,
  getStep3PlayerData,
  getStep4RoomData,
  getStep5Broadcast,
  getStep6Events,
  getStep7Exit,
  getDataStructures,

  // 单个 API 文档
  getGetOnlineBattleManager,
  getRegisterListener,
  getConnect,
  getMatchRoom,
  getUpdatePlayerCustomProperties,
  getUpdateRoomProperties,
  getSendCustomMessage,
  getLeaveRoom,

  // 辅助工具
  searchMultiplayerDocs,
  getMultiplayerOverview,
  getIntegrationWorkflow,

  // 新增：通用模板和关系表
  getCommonPatterns,
  getApiEventRelations,
  getProtocolTemplate,
  
  // 完整联机示例
  getCompleteExample,

  // 扩展 API（中等优先级）
  getExtendedRoomManagement,
  getExtendedConnection,
  getExtendedPlayerStatus,
  getExtendedEvents,
  
  // 扩展 API - 单个 API
  getCreateRoom,
  getGetRoomList,
  getJoinRoom,
  getKickRoomPlayer,
  getDisconnect,
  getUpdatePlayerCustomStatus,

  // 新增：专题指南文档
  getPlayerIdGuide,
  getJoystickSyncPattern,
  getLocalGuideTemplate,
  getModularTemplates,
  generateLocalMultiplayerGuide
};
