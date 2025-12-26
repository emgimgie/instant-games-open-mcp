/**
 * TapTap Ads - 文档生成工具
 * 提供分层的广告接入指南（激励视频为核心，其他广告为额外内容）
 */

import {
  AD_MANAGER_CORE_CODE,
  REWARDED_VIDEO_EXAMPLES,
  INTERSTITIAL_EXAMPLES,
  BANNER_EXAMPLES,
} from './docs.js';

/**
 * 获取完整的广告接入指南
 * 默认重点展示激励视频广告，其他广告作为额外内容
 */
async function getAdIntegrationGuide(): Promise<string> {
  return `# 🎮 TapTap 小游戏广告接入指南

## 📌 核心理念

**超简单接入！复制 → 初始化 → 显示**

- ✅ 使用封装好的 AdManager 工具类
- ✅ 核心功能：激励视频广告（最常用）
- ✅ 额外功能：插屏广告、Banner 广告（可选）

---

## 🎯 第一部分：激励视频广告（核心，必读）

### 🚀 三步完成激励视频接入

#### 步骤 1️⃣：复制 AdManager.js 到项目

将下面的 AdManager.js 代码复制到你的项目中（如 \`js/AdManager.js\`）

#### 步骤 2️⃣：在游戏启动时初始化

\`\`\`javascript
// main.js 或游戏入口文件
async function initGame() {
  // 初始化广告管理器（会自动获取广告位配置）
  await adManager.init();
  console.log('广告初始化完成');
}

initGame();
\`\`\`

#### 步骤 3️⃣：绑定奖励回调 + 显示广告

\`\`\`javascript
// 绑定奖励回调（用户看完广告后自动调用）
adManager.onReward(() => {
  console.log('用户看完广告，发放奖励');
  player.coins += 100;  // 发放金币
  showRewardMessage('获得 100 金币！');
});

// 在需要的时候显示广告
function onGetCoinsButtonClick() {
  adManager.showRewardedVideo();
}
\`\`\`

### 📦 AdManager.js 完整源码

\`\`\`javascript
${AD_MANAGER_CORE_CODE}
\`\`\`

---

### 💡 激励视频广告使用示例（核心场景）

${REWARDED_VIDEO_EXAMPLES}

---

### ⚠️ 核心接口说明

| 方法 | 说明 | 示例 |
|------|------|------|
| \`init()\` | 初始化广告管理器（必须在使用前调用） | \`adManager.init();\` |
| \`onReward(callback)\` | 绑定奖励回调（用户看完广告后自动调用） | \`adManager.onReward(() => { player.coins += 100; });\` |
| \`showRewardedVideo()\` | 显示激励视频广告 | \`adManager.showRewardedVideo();\` |

---

### 🔑 核心逻辑解释

**AdManager 如何判断用户是否看完广告？**

\`\`\`javascript
// 在 AdManager 内部，onClose 回调会接收 res 参数
this.rewardedVideoAd.onClose((res) => {
  if (res.isEnded) {
    // ✅ 用户看完广告，调用你绑定的奖励回调
    this.rewardCallback();
  } else {
    // ⚠️ 用户提前关闭，不发放奖励
  }
});
\`\`\`

**你只需要：**
1. 调用 \`onReward()\` 绑定奖励回调
2. 调用 \`showRewardedVideo()\` 显示广告
3. AdManager 自动判断并调用你的回调

---

## 📦 第二部分：其他广告类型（可选，按需使用）

> ⚠️ **注意**：插屏广告和 Banner 广告使用率较低，仅在用户明确需要时提供。
>
> 如果你只需要激励视频广告，**可以跳过这部分**。

---

### 插屏广告（Interstitial Ad）

**使用场景：** 关卡结束、游戏暂停、返回主菜单等

**特点：**
- 无需预初始化
- 每次创建新实例
- 自动销毁

**代码示例：**

${INTERSTITIAL_EXAMPLES}

**接口说明：**

| 方法 | 说明 | 示例 |
|------|------|------|
| \`showInterstitial()\` | 显示插屏广告（无需预初始化） | \`adManager.showInterstitial();\` |

---

### Banner 广告（Banner Ad）

**使用场景：** 主菜单底部、游戏界面底部等

**特点：**
- 需要先调用 \`initBanner()\` 初始化
- 可以显示/隐藏
- 支持自定义位置和大小

**代码示例：**

${BANNER_EXAMPLES}

**接口说明：**

| 方法 | 说明 | 示例 |
|------|------|------|
| \`initBanner(options)\` | 初始化 Banner 广告 | \`adManager.initBanner({ position: 'bottom' });\` |
| \`showBanner()\` | 显示 Banner 广告 | \`adManager.showBanner();\` |
| \`hideBanner()\` | 隐藏 Banner 广告 | \`adManager.hideBanner();\` |
| \`refreshBanner(options)\` | 刷新 Banner（销毁旧的并创建新的） | \`adManager.refreshBanner();\` |

**配置选项：**

\`\`\`javascript
adManager.initBanner({
  width: 320,              // 可选，默认：屏幕宽度
  height: 100,             // 可选，默认：100
  position: 'bottom'       // 可选，'top' | 'bottom'，默认：'bottom'
});
\`\`\`

---

## ✅ 完成！

### 快速回顾：

**激励视频广告（核心，必须）：**
\`\`\`javascript
await adManager.init();
adManager.onReward(() => { giveReward(); });
adManager.showRewardedVideo();
\`\`\`

**插屏广告（可选）：**
\`\`\`javascript
await adManager.init();
adManager.showInterstitial();
\`\`\`

**Banner 广告（可选）：**
\`\`\`javascript
await adManager.init();
adManager.initBanner();
adManager.showBanner();
adManager.hideBanner();
\`\`\`

---

## 🔍 常见问题

### Q1: 必须使用所有 3 种广告吗？

**A**: 不需要！大部分游戏只使用激励视频广告就足够了。插屏和 Banner 广告是可选的。

### Q2: 可以动态更改奖励回调吗？

**A**: 可以！每次调用 \`onReward()\` 都会更新回调函数，适合多场景使用。

\`\`\`javascript
// 场景 1：复活
function showReviveAd() {
  adManager.onReward(() => player.revive());
  adManager.showRewardedVideo();
}

// 场景 2：金币
function showCoinsAd() {
  adManager.onReward(() => player.coins += 100);
  adManager.showRewardedVideo();
}
\`\`\`

### Q3: 广告加载失败怎么办？

**A**: AdManager 已经内置了错误处理，会在控制台输出详细日志。你可以通过监听 \`onError\` 回调来自定义错误处理（高级用法）。

### Q4: 如何预加载广告？

**A**: AdManager 在 \`init()\` 时会自动获取广告位配置并预加载激励视频广告，无需手动操作。每次播放后也会自动重新加载。

---

## 📚 官方文档链接

更多底层 API 细节，请参考 TapTap 官方文档：
- **激励视频广告**: https://developer.taptap.cn/minigameapidoc/dev/tutorial/open-capabilities/ad/rewarded-video-ad/
- **插屏广告**: https://developer.taptap.cn/minigameapidoc/dev/tutorial/open-capabilities/ad/interstitial-ad/
- **Banner 广告**: https://developer.taptap.cn/minigameapidoc/dev/tutorial/open-capabilities/ad/banner-ad/
`;
}

export const adsTools = {
  getAdIntegrationGuide,
};
