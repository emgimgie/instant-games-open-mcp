# TapTap 排行榜 API 枚举值说明

## ⚠️ 重要：0 值是无效的！

根据 TapTap 官方 API 文档，**所有枚举参数的 0 值都表示"未指定/UNSPECIFIED"，是无效值**。

API 会拒绝包含 0 值的请求，返回类似错误：
```
「score_type」必填
```

## 📋 正确的枚举值

### period_type (重置周期类型)

**有效值：1-4**

| 值 | 含义 | 说明 |
|----|------|------|
| 0 | ❌ 未指定 | **无效值，不可使用** |
| 1 | ✅ 永久 | 不重置，永久榜单 |
| 2 | ✅ 每天 | 每天重置一次 |
| 3 | ✅ 每周 | 每周重置一次 |
| 4 | ✅ 每月 | 每月重置一次 |

**常用：** 3 (每周) - 适合大多数游戏

### score_type (数据类型)

**有效值：1-2**

| 值 | 含义 | 说明 | 适用场景 |
|----|------|------|----------|
| 0 | ❌ 未指定 | **无效值，不可使用** | - |
| 1 | ✅ 数值型 | 整数或小数分数 | 分数、金币、击杀数等 |
| 2 | ✅ 时间型 | 毫秒数 | 竞速、计时挑战等 |

**常用：** 1 (数值型) - 适合分数类游戏

### score_order (数据排序方式)

**有效值：1-2**

| 值 | 含义 | 说明 | 适用场景 |
|----|------|------|----------|
| 0 | ❌ 未指定 | **无效值，不可使用** | - |
| 1 | ✅ 降序 | 数值越大越好，排名越高 | 高分游戏、击杀榜 |
| 2 | ✅ 升序 | 数值越小越好，排名越高 | 竞速游戏、用时榜 |

**常用：**
- 分数类：1 (降序)
- 时间类：2 (升序)

### calc_type (成绩计算方式)

**有效值：1-3**

| 值 | 含义 | 说明 | 适用场景 |
|----|------|------|----------|
| 0 | ❌ 未指定 | **无效值，不可使用** | - |
| 1 | ✅ 累计分 | 将所有成绩相加 | 累积积分、总击杀数 |
| 2 | ✅ 最佳分 | 保留最好的成绩 | 最高分、最快时间 |
| 3 | ✅ 最新分 | 保留最新提交的成绩 | 实时更新的榜单 |

**常用：** 2 (最佳分) - 适合竞技类游戏

## 🎮 游戏类型配置示例

### 1. 贪吃蛇（高分游戏）

```javascript
{
  title: "贪吃蛇每周高分榜",
  period_type: 3,    // Weekly/每周
  score_type: 1,     // Integer/数值型
  score_order: 1,    // Descending/降序 (分数越高越好)
  calc_type: 2,      // Best/最佳分 (保留最高分)
  score_unit: "分"
}
```

### 2. 赛车游戏（竞速）

```javascript
{
  title: "赛道最快圈速",
  period_type: 3,    // Weekly/每周
  score_type: 2,     // Time/时间型
  score_order: 2,    // Ascending/升序 (时间越短越好)
  calc_type: 2,      // Best/最佳分 (保留最快时间)
  score_unit: "秒"
}
```

### 3. RPG 游戏（累积经验）

```javascript
{
  title: "全服经验总榜",
  period_type: 1,    // Always/永久 (不重置)
  score_type: 1,     // Integer/数值型
  score_order: 1,    // Descending/降序 (经验越多越好)
  calc_type: 1,      // Sum/累计分 (累加所有经验)
  score_unit: "经验"
}
```

### 4. 每日挑战

```javascript
{
  title: "今日挑战榜",
  period_type: 2,    // Daily/每天 (每天重置)
  score_type: 1,     // Integer/数值型
  score_order: 1,    // Descending/降序
  calc_type: 2,      // Best/最佳分
  score_unit: "分"
}
```

## ❌ 常见错误

### 错误 1：使用 0 值

```javascript
// ❌ 错误
{
  score_type: 0,  // 0 表示"未指定"，API 会拒绝
  calc_type: 0
}

// ✅ 正确
{
  score_type: 1,  // 1 表示"数值型"
  calc_type: 2    // 2 表示"最佳分"
}
```

### 错误 2：混淆枚举值顺序

```javascript
// ❌ 错误（旧版本的枚举）
{
  period_type: 1,  // 旧版本中 1=Weekly，但现在 1=Always
  score_type: 0    // 旧版本中 0=Integer，但现在 0=UNSPECIFIED
}

// ✅ 正确（新版本的枚举）
{
  period_type: 3,  // 3=Weekly
  score_type: 1    // 1=Integer
}
```

## 🔧 调试建议

### 如果遇到「必填」错误

1. **检查所有枚举参数是否为 0**
   - score_type、score_order、calc_type、period_type
   - 将所有 0 值改为 1 或更大的有效值

2. **启用 verbose 日志查看实际请求**
   ```bash
   export TAPTAP_MINIGAME_MCP_VERBOSE=true
   ```

3. **参考上述示例配置**
   - 根据游戏类型选择合适的配置
   - 确保所有值都在有效范围内

## 📚 参考

- TapTap 官方 API 文档：https://developer.taptap.cn/minigameapidoc/dev/api/open-api/leaderboard/
- 排行榜创建接口：`/open/leaderboard/v1/create`

## 🔄 版本历史

- **v1.0.6 及之前**：枚举从 0 开始（错误）
- **v1.0.7 及之后**：枚举从 1 开始（正确）

如果您使用的是旧版本代码或文档，请升级到 1.0.7 或更高版本。
