"""TapTap 小游戏 API 文档数据"""

API_DOCUMENTATION = {
    "authentication": {
        "title": "认证方式",
        "description": "TapTap 小游戏 API 使用 OAuth 2.0 或 API Key 进行认证",
        "methods": [
            {
                "name": "API Key 认证",
                "description": "在请求头中添加 Authorization: Bearer {api_key}",
                "example": """
// JavaScript 示例
const response = await fetch('https://api.taptap.com/v1/minigames', {
    headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    }
});
"""
            }
        ]
    },

    "game_lifecycle": {
        "title": "游戏生命周期管理",
        "description": "管理小游戏的创建、更新、发布和下架",
        "apis": [
            {
                "endpoint": "POST /v1/minigames",
                "name": "创建游戏",
                "description": "创建新的小游戏项目",
                "parameters": {
                    "name": "string, 游戏名称",
                    "category": "string, 游戏分类 (action/puzzle/rpg/casual)",
                    "description": "string, 游戏描述",
                    "tags": "array, 游戏标签"
                },
                "example": """
// 创建游戏示例
const gameData = {
    name: "我的益智游戏",
    category: "puzzle",
    description: "一个有趣的益智游戏",
    tags: ["益智", "休闲", "单人"]
};

const response = await fetch('https://api.taptap.com/v1/minigames', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(gameData)
});

const result = await response.json();
console.log('游戏ID:', result.game_id);
"""
            },
            {
                "endpoint": "PUT /v1/minigames/{game_id}",
                "name": "更新游戏信息",
                "description": "更新已存在游戏的基本信息",
                "parameters": {
                    "game_id": "string, 游戏唯一标识",
                    "name": "string, 可选，游戏名称",
                    "description": "string, 可选，游戏描述",
                    "version": "string, 可选，版本号"
                },
                "example": """
// 更新游戏信息
const updateData = {
    description: "更新后的游戏描述",
    version: "1.1.0"
};

await fetch(`https://api.taptap.com/v1/minigames/${gameId}`, {
    method: 'PUT',
    headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
});
"""
            }
        ]
    },

    "asset_management": {
        "title": "游戏资源管理",
        "description": "上传和管理游戏图标、截图、视频等资源",
        "apis": [
            {
                "endpoint": "POST /v1/minigames/{game_id}/assets",
                "name": "上传游戏资源",
                "description": "上传游戏图标、截图或视频",
                "parameters": {
                    "game_id": "string, 游戏ID",
                    "type": "string, 资源类型 (icon/screenshot/video)",
                    "file": "file, 资源文件"
                },
                "example": """
// 上传游戏图标
const formData = new FormData();
formData.append('type', 'icon');
formData.append('file', iconFile);

const response = await fetch(`https://api.taptap.com/v1/minigames/${gameId}/assets`, {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: formData
});

const result = await response.json();
console.log('资源URL:', result.asset_url);
"""
            }
        ]
    },

    "user_system": {
        "title": "用户系统集成",
        "description": "集成 TapTap 用户登录、好友、成就等功能",
        "apis": [
            {
                "endpoint": "GET /v1/user/profile",
                "name": "获取用户信息",
                "description": "获取当前登录用户的基本信息",
                "parameters": {
                    "access_token": "string, 用户访问令牌"
                },
                "example": """
// 获取用户信息
const response = await fetch('https://api.taptap.com/v1/user/profile', {
    headers: {
        'Authorization': `Bearer ${userAccessToken}`
    }
});

const user = await response.json();
console.log('用户信息:', user);
// 返回: { user_id, nickname, avatar_url, level, ... }
"""
            },
            {
                "endpoint": "POST /v1/user/achievements",
                "name": "解锁成就",
                "description": "为用户解锁游戏成就",
                "parameters": {
                    "user_id": "string, 用户ID",
                    "achievement_id": "string, 成就ID",
                    "game_id": "string, 游戏ID"
                },
                "example": """
// 解锁成就
const achievementData = {
    user_id: "user123",
    achievement_id: "first_win",
    game_id: "game456"
};

await fetch('https://api.taptap.com/v1/user/achievements', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(achievementData)
});
"""
            }
        ]
    },

    "analytics": {
        "title": "数据分析",
        "description": "游戏数据统计和分析功能",
        "apis": [
            {
                "endpoint": "POST /v1/analytics/events",
                "name": "发送游戏事件",
                "description": "记录游戏内的用户行为事件",
                "parameters": {
                    "game_id": "string, 游戏ID",
                    "user_id": "string, 用户ID",
                    "event_type": "string, 事件类型",
                    "properties": "object, 事件属性"
                },
                "example": """
// 记录游戏事件
const eventData = {
    game_id: "game123",
    user_id: "user456",
    event_type: "level_completed",
    properties: {
        level: 5,
        score: 1500,
        time_spent: 120
    }
};

await fetch('https://api.taptap.com/v1/analytics/events', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventData)
});
"""
            }
        ]
    },

    "monetization": {
        "title": "商业化功能",
        "description": "游戏内购买、广告、订阅等商业化功能",
        "apis": [
            {
                "endpoint": "POST /v1/payments/orders",
                "name": "创建支付订单",
                "description": "为游戏内购买创建支付订单",
                "parameters": {
                    "game_id": "string, 游戏ID",
                    "user_id": "string, 用户ID",
                    "item_id": "string, 商品ID",
                    "amount": "number, 金额（分）"
                },
                "example": """
// 创建支付订单
const orderData = {
    game_id: "game123",
    user_id: "user456",
    item_id: "premium_pack",
    amount: 999  // 9.99元
};

const response = await fetch('https://api.taptap.com/v1/payments/orders', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
});

const order = await response.json();
console.log('订单ID:', order.order_id);
console.log('支付URL:', order.payment_url);
"""
            }
        ]
    },

    "sdk_integration": {
        "title": "SDK 集成指南",
        "description": "如何在游戏中集成 TapTap SDK",
        "guides": [
            {
                "platform": "Unity",
                "description": "Unity 游戏引擎集成指南",
                "setup": """
1. 下载 TapTap Unity SDK
2. 导入 .unitypackage 文件到项目
3. 在 TapTap 开发者后台配置应用信息
4. 初始化 SDK

// 初始化代码
using TapTap.Common;
using TapTap.Login;

public class GameManager : MonoBehaviour
{
    void Start()
    {
        // 初始化 TapTap SDK
        TapTapSDK.Init("your_client_id", "your_client_token", TapTapRegionType.CN);

        // 初始化登录模块
        TapLogin.Init("your_client_id");
    }

    // 用户登录
    public async void LoginWithTapTap()
    {
        try
        {
            var accessToken = await TapLogin.Login();
            Debug.Log("登录成功: " + accessToken.kid);
        }
        catch (Exception e)
        {
            Debug.LogError("登录失败: " + e.Message);
        }
    }
}
""",
                "best_practices": [
                    "在游戏启动时初始化 SDK",
                    "处理登录失败的情况",
                    "定期检查用户登录状态",
                    "遵循 TapTap 用户体验指南"
                ]
            },
            {
                "platform": "Cocos Creator",
                "description": "Cocos Creator 游戏引擎集成指南",
                "setup": """
1. 安装 TapTap Cocos Creator SDK
2. 在项目设置中配置 SDK
3. 初始化并使用 API

// JavaScript 示例
const { TapTapSDK, TapLogin } = require('taptap-sdk');

cc.Class({
    extends: cc.Component,

    onLoad() {
        // 初始化 SDK
        TapTapSDK.init({
            clientId: 'your_client_id',
            clientToken: 'your_client_token',
            region: 'CN'
        });
    },

    // 登录方法
    async loginWithTapTap() {
        try {
            const result = await TapLogin.login();
            console.log('登录成功:', result);
        } catch (error) {
            console.error('登录失败:', error);
        }
    }
});
"""
            }
        ]
    },

    "common_patterns": {
        "title": "常用开发模式",
        "description": "TapTap 小游戏开发中的常见模式和最佳实践",
        "patterns": [
            {
                "name": "用户登录流程",
                "description": "标准的用户登录和状态管理流程",
                "code": """
class UserManager {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
    }

    // 检查登录状态
    async checkLoginStatus() {
        const token = localStorage.getItem('taptap_token');
        if (token) {
            try {
                const user = await this.validateToken(token);
                this.setCurrentUser(user);
                return true;
            } catch (error) {
                this.logout();
                return false;
            }
        }
        return false;
    }

    // 登录
    async login() {
        try {
            const result = await TapLogin.login();
            localStorage.setItem('taptap_token', result.accessToken);
            this.setCurrentUser(result.profile);
            return result;
        } catch (error) {
            throw new Error('登录失败: ' + error.message);
        }
    }

    // 登出
    logout() {
        localStorage.removeItem('taptap_token');
        this.currentUser = null;
        this.isLoggedIn = false;
    }

    setCurrentUser(user) {
        this.currentUser = user;
        this.isLoggedIn = true;
    }
}
"""
            },
            {
                "name": "游戏数据同步",
                "description": "本地数据与云端数据的同步机制",
                "code": """
class GameDataSync {
    constructor(gameId, apiKey) {
        this.gameId = gameId;
        this.apiKey = apiKey;
        this.localData = {};
        this.syncInterval = null;
    }

    // 启动自动同步
    startAutoSync(intervalMs = 30000) {
        this.syncInterval = setInterval(() => {
            this.syncToCloud();
        }, intervalMs);
    }

    // 同步到云端
    async syncToCloud() {
        try {
            const response = await fetch(`https://api.taptap.com/v1/minigames/${this.gameId}/userdata`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.localData)
            });

            if (response.ok) {
                console.log('数据同步成功');
            }
        } catch (error) {
            console.error('数据同步失败:', error);
        }
    }

    // 从云端拉取数据
    async pullFromCloud() {
        try {
            const response = await fetch(`https://api.taptap.com/v1/minigames/${this.gameId}/userdata`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            if (response.ok) {
                this.localData = await response.json();
                return this.localData;
            }
        } catch (error) {
            console.error('拉取数据失败:', error);
        }
    }
}
"""
            }
        ]
    }
}

# API 搜索索引
API_SEARCH_INDEX = {
    "keywords": {
        "登录": ["authentication", "user_system"],
        "认证": ["authentication"],
        "用户": ["user_system"],
        "游戏": ["game_lifecycle"],
        "创建": ["game_lifecycle"],
        "更新": ["game_lifecycle"],
        "资源": ["asset_management"],
        "上传": ["asset_management"],
        "图标": ["asset_management"],
        "截图": ["asset_management"],
        "成就": ["user_system"],
        "数据": ["analytics"],
        "统计": ["analytics"],
        "事件": ["analytics"],
        "支付": ["monetization"],
        "内购": ["monetization"],
        "订单": ["monetization"],
        "SDK": ["sdk_integration"],
        "Unity": ["sdk_integration"],
        "Cocos": ["sdk_integration"],
        "同步": ["common_patterns"],
        "模式": ["common_patterns"]
    },

    "categories": {
        "authentication": "认证相关",
        "game_lifecycle": "游戏生命周期",
        "asset_management": "资源管理",
        "user_system": "用户系统",
        "analytics": "数据分析",
        "monetization": "商业化",
        "sdk_integration": "SDK集成",
        "common_patterns": "常用模式"
    }
}