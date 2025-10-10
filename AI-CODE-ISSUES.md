# AI 生成代码问题分析

## AI 生成的代码中的问题

### ❌ 问题 1: 使用了错误的字段名 `leaderboardName`

**错误代码：**
```javascript
await this.tapManager.submitScores([{
  leaderboardName: this.leaderboardName,  // ❌ 错误
  score: score,
  extraInfo: JSON.stringify({...})
}])
```

**正确代码：**
```javascript
await leaderboardManager.submitScores({
  scores: [{
    leaderboardId: "your_leaderboard_id",  // ✅ 正确，使用 leaderboardId
    score: 1000
  }]
})
```

**或者使用 Promise 版本（不传 callback）：**
```javascript
const result = await leaderboardManager.submitScores({
  scores: [{
    leaderboardId: "your_leaderboard_id",
    score: 1000
  }]
})
```

### ❌ 问题 2: 参数格式不正确

**错误：** AI 直接传数组，没有包装在对象中

**正确格式：**
```javascript
// 方式1: 使用回调
leaderboardManager.submitScores({
  scores: [...],      // scores 数组
  callback: {...}     // 回调对象
})

// 方式2: 使用 Promise（不传 callback）
const result = await leaderboardManager.submitScores({
  scores: [...]       // scores 数组
})
```

### ❌ 问题 3: API 参数不完整

**AI 生成的代码缺少参数：**
```javascript
// ❌ loadCurrentPlayerLeaderboardScore 缺少参数
const playerScore = await this.tapManager.loadCurrentPlayerLeaderboardScore(this.leaderboardName)

// ✅ 正确的调用
const result = await leaderboardManager.loadCurrentPlayerLeaderboardScore({
  leaderboardId: "your_leaderboard_id",
  collection: "public"  // 可选
})
```

### ✅ 正确：使用 await

**AI 使用 await 是正确的！**
- TapTap API 支持两种模式：
  - 传递 callback → 回调模式
  - 不传 callback → Promise 模式（可以用 await）

## 文档中的不一致

### 问题：文档示例不统一

**leaderboardDocs.ts 中的问题：**

1. **第 348 行** - 使用了 `leaderboardName`（错误）
   ```javascript
   await leaderboardManager.submitScores([{
     leaderboardName: 'daily_ranking',  // ❌ 应该是 leaderboardId
     score: finalScore
   }])
   ```

2. **第 557 行** - 同样的问题
   ```javascript
   await leaderboardManager.submitScores([{
     leaderboardName: 'my_leaderboard',  // ❌ 应该是 leaderboardId
     score: 1000
   }])
   ```

3. **第 562、566 行** - 缺少参数对象包装
   ```javascript
   // ❌ 错误：直接传字符串
   await leaderboardManager.loadCurrentPlayerLeaderboardScore('my_leaderboard')
   leaderboardManager.openLeaderboard()

   // ✅ 正确：应该传对象
   await leaderboardManager.loadCurrentPlayerLeaderboardScore({
     leaderboardId: 'my_leaderboard'
   })
   leaderboardManager.openLeaderboard({
     leaderboardId: 'my_leaderboard'
   })
   ```

## 需要修复的文档位置

### 1. submitScores 示例（第 124-165 行）

**当前：** 正确使用了 `leaderboardId` 和对象格式 ✅

### 2. common_scenarios 中的 submitScores（第 348 行）

**当前：** 使用了错误的 `leaderboardName` ❌

**需要改为：**
```javascript
const result = await leaderboardManager.submitScores({
  scores: [{
    leaderboardId: 'daily_ranking',
    score: finalScore,
    extraInfo: JSON.stringify({
      timestamp: Date.now(),
      gameMode: 'classic'
    })
  }]
})
```

### 3. Quick Start 示例（第 557-566 行）

**当前：** 使用了错误的字段名和参数格式 ❌

**需要改为：**
```javascript
// 1. Get manager
const leaderboardManager = tap.getLeaderboardManager();

// 2. Submit score
await leaderboardManager.submitScores({
  scores: [{
    leaderboardId: 'my_leaderboard',
    score: 1000
  }]
});

// 3. Query current player's rank
const playerScore = await leaderboardManager.loadCurrentPlayerLeaderboardScore({
  leaderboardId: 'my_leaderboard'
});
console.log('Your rank:', playerScore.rank);

// 4. Open leaderboard UI
leaderboardManager.openLeaderboard({
  leaderboardId: 'my_leaderboard'
});
```

## 优化建议

### 1. 统一文档示例

所有示例都应该：
- ✅ 使用 `leaderboardId`（不是 leaderboardName）
- ✅ 使用对象参数格式 `{ leaderboardId: "...", ... }`
- ✅ 可以使用 `await`（Promise 模式）
- ✅ 或使用 callback（回调模式）
- ✅ 两种模式都提供示例

### 2. 添加注意事项

在每个 API 文档中添加：
```
⚠️ IMPORTANT:
- Use leaderboardId (not leaderboardName)
- Wrap all parameters in an object
- Can use await (returns Promise) or provide callback
```

### 3. 添加完整的类示例

提供一个正确的 LeaderboardManager 封装类示例，作为参考实现。

## 为什么 AI 会生成错误代码？

1. **文档不一致** - 有些示例用 `leaderboardName`，有些用 `leaderboardId`
2. **参数格式混乱** - 有些示例直接传字符串，有些传对象
3. **缺少明确说明** - 没有明确强调 leaderboardId vs leaderboardName
4. **示例过于复杂** - AI 可能混淆了不同示例的写法
