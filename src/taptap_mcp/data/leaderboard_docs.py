"""TapTap 排行榜 API 文档数据"""

LEADERBOARD_API_DOCUMENTATION = {
    "leaderboard_system": {
        "title": "TapTap 排行榜系统",
        "description": "TapTap 小游戏排行榜系统提供完整的竞技排名功能，支持分数提交、排名查询、榜单展示等核心功能",
        "overview": {
            "manager_access": "通过 tap.getLeaderboardManager() 获取排行榜管理器实例",
            "core_features": [
                "分数批量提交",
                "排行榜数据分页查询",
                "当前用户排名查询",
                "附近玩家分数查询",
                "排行榜页面展示"
            ],
            "data_types": {
                "LeaderboardEntry": "排行榜条目，包含用户信息、分数、排名等",
                "ScoreSubmission": "分数提交对象，包含排行榜ID、分数值等",
                "LeaderboardConfig": "排行榜配置，包含排序规则、显示设置等"
            }
        },
        "apis": [
            {
                "method": "openLeaderboard",
                "name": "打开排行榜页面",
                "description": "打开 TapTap 排行榜列表页面，展示游戏的所有排行榜",
                "signature": "openLeaderboard(): Promise<void>",
                "parameters": {},
                "returns": {
                    "type": "Promise<void>",
                    "description": "异步操作，无返回值"
                },
                "example": """
// 打开排行榜页面
const leaderboardManager = tap.getLeaderboardManager();

try {
    await leaderboardManager.openLeaderboard();
    console.log('排行榜页面已打开');
} catch (error) {
    console.error('打开排行榜失败:', error);
}

// 结合游戏UI使用
const showLeaderboardButton = document.getElementById('leaderboard-btn');
showLeaderboardButton.onclick = async () => {
    try {
        await leaderboardManager.openLeaderboard();
    } catch (error) {
        alert('无法打开排行榜，请稍后重试');
    }
};
""",
                "use_cases": [
                    "游戏主菜单添加排行榜入口",
                    "游戏结束后展示排行榜",
                    "成就解锁后查看排名变化"
                ],
                "best_practices": [
                    "在网络良好时调用",
                    "添加加载状态提示",
                    "处理打开失败的情况"
                ]
            },
            {
                "method": "submitScores",
                "name": "批量提交分数",
                "description": "批量提交用户在多个排行榜中的分数，支持一次性更新多个榜单",
                "signature": "submitScores(scoreSubmissions: ScoreSubmission[]): Promise<void>",
                "parameters": {
                    "scoreSubmissions": {
                        "type": "ScoreSubmission[]",
                        "description": "分数提交数组",
                        "required": True,
                        "properties": {
                            "leaderboardId": "string, 排行榜唯一标识",
                            "score": "number, 用户分数值",
                            "extraData": "string, 可选，额外数据（如关卡信息）"
                        }
                    }
                },
                "returns": {
                    "type": "Promise<void>",
                    "description": "异步操作，成功时无返回值"
                },
                "example": """
// 单个分数提交
const leaderboardManager = tap.getLeaderboardManager();

const scoreSubmission = {
    leaderboardId: 'weekly_high_score',
    score: 15800,
    extraData: JSON.stringify({ level: 5, time: 120 })
};

try {
    await leaderboardManager.submitScores([scoreSubmission]);
    console.log('分数提交成功');
} catch (error) {
    console.error('分数提交失败:', error);
}

// 批量分数提交
const multipleScores = [
    {
        leaderboardId: 'total_score',
        score: 98500,
        extraData: JSON.stringify({ sessionId: 'game_123' })
    },
    {
        leaderboardId: 'daily_challenge',
        score: 2400,
        extraData: JSON.stringify({ challengeDate: '2024-01-15' })
    }
];

try {
    await leaderboardManager.submitScores(multipleScores);
    console.log('批量分数提交成功');
} catch (error) {
    console.error('批量提交失败:', error);
    // 可能需要重试或分别提交
}

// 游戏结束时提交分数
class GameSession {
    async endGame(finalScore, levelData) {
        const scoreData = {
            leaderboardId: 'main_leaderboard',
            score: finalScore,
            extraData: JSON.stringify({
                level: levelData.level,
                duration: levelData.playTime,
                achievements: levelData.achievements
            })
        };

        try {
            await leaderboardManager.submitScores([scoreData]);
            // 显示成功提示
            this.showScoreSubmittedNotification();
        } catch (error) {
            // 本地缓存，稍后重试
            this.cacheScoreForRetry(scoreData);
        }
    }
}
""",
                "error_handling": {
                    "network_error": "网络错误时本地缓存，稍后重试",
                    "invalid_score": "验证分数有效性后再提交",
                    "rate_limit": "避免频繁提交，添加防抖机制"
                },
                "best_practices": [
                    "验证分数的合法性（防作弊）",
                    "添加重试机制处理网络错误",
                    "使用 extraData 存储有用的游戏数据",
                    "避免在短时间内重复提交相同分数"
                ]
            },
            {
                "method": "loadLeaderboardScores",
                "name": "加载排行榜数据",
                "description": "分页获取指定排行榜的数据，支持按排名范围查询",
                "signature": "loadLeaderboardScores(leaderboardId: string, start: number, count: number): Promise<LeaderboardEntry[]>",
                "parameters": {
                    "leaderboardId": {
                        "type": "string",
                        "description": "排行榜唯一标识",
                        "required": True
                    },
                    "start": {
                        "type": "number",
                        "description": "起始排名（从1开始）",
                        "required": True
                    },
                    "count": {
                        "type": "number",
                        "description": "获取数量（建议1-100）",
                        "required": True
                    }
                },
                "returns": {
                    "type": "Promise<LeaderboardEntry[]>",
                    "description": "排行榜条目数组",
                    "properties": {
                        "userId": "string, 用户ID",
                        "userName": "string, 用户昵称",
                        "userAvatar": "string, 用户头像URL",
                        "score": "number, 用户分数",
                        "rank": "number, 排名",
                        "extraData": "string, 提交时的额外数据",
                        "timestamp": "number, 分数提交时间戳"
                    }
                },
                "example": """
// 加载排行榜前10名
const leaderboardManager = tap.getLeaderboardManager();

try {
    const topScores = await leaderboardManager.loadLeaderboardScores(
        'weekly_leaderboard',
        1,  // 从第1名开始
        10  // 获取10个条目
    );

    console.log('前10名玩家:');
    topScores.forEach(entry => {
        console.log(`${entry.rank}. ${entry.userName}: ${entry.score}分`);
    });

    // 显示在UI中
    displayLeaderboard(topScores);
} catch (error) {
    console.error('加载排行榜失败:', error);
}

// 分页加载排行榜
class LeaderboardUI {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 20;
        this.leaderboardId = 'main_leaderboard';
    }

    async loadPage(page = 1) {
        const start = (page - 1) * this.pageSize + 1;

        try {
            const entries = await leaderboardManager.loadLeaderboardScores(
                this.leaderboardId,
                start,
                this.pageSize
            );

            this.renderLeaderboardEntries(entries);
            this.currentPage = page;
        } catch (error) {
            this.showErrorMessage('加载排行榜失败，请稍后重试');
        }
    }

    renderLeaderboardEntries(entries) {
        const container = document.getElementById('leaderboard-list');
        container.innerHTML = '';

        entries.forEach(entry => {
            const entryElement = this.createEntryElement(entry);
            container.appendChild(entryElement);
        });
    }

    createEntryElement(entry) {
        return `
            <div class="leaderboard-entry">
                <span class="rank">#${entry.rank}</span>
                <img src="${entry.userAvatar}" class="avatar" />
                <span class="name">${entry.userName}</span>
                <span class="score">${entry.score.toLocaleString()}</span>
            </div>
        `;
    }
}

// 实时刷新排行榜
class LiveLeaderboard {
    constructor(leaderboardId) {
        this.leaderboardId = leaderboardId;
        this.refreshInterval = null;
    }

    startAutoRefresh(intervalMs = 30000) {
        this.refreshInterval = setInterval(async () => {
            try {
                await this.refreshTopEntries();
            } catch (error) {
                console.warn('自动刷新失败:', error);
            }
        }, intervalMs);
    }

    async refreshTopEntries() {
        const topEntries = await leaderboardManager.loadLeaderboardScores(
            this.leaderboardId, 1, 10
        );
        this.updateUI(topEntries);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
}
""",
                "best_practices": [
                    "合理设置分页大小（建议20-50条）",
                    "添加加载状态和错误处理",
                    "实现虚拟滚动优化大数据渲染",
                    "缓存数据减少重复请求"
                ]
            },
            {
                "method": "loadCurrentPlayerLeaderboardScore",
                "name": "获取当前用户排名",
                "description": "获取当前登录用户在指定排行榜中的分数和排名信息",
                "signature": "loadCurrentPlayerLeaderboardScore(leaderboardId: string): Promise<PlayerLeaderboardScore>",
                "parameters": {
                    "leaderboardId": {
                        "type": "string",
                        "description": "排行榜唯一标识",
                        "required": True
                    }
                },
                "returns": {
                    "type": "Promise<PlayerLeaderboardScore>",
                    "description": "当前用户排行榜信息",
                    "properties": {
                        "score": "number, 用户当前分数",
                        "rank": "number, 用户当前排名，0表示未上榜",
                        "formattedRank": "string, 格式化的排名显示（如 '42nd'）",
                        "lastSubmitTime": "number, 最后提交时间戳",
                        "extraData": "string, 提交时的额外数据"
                    }
                },
                "example": """
// 获取当前用户排名
const leaderboardManager = tap.getLeaderboardManager();

try {
    const myScore = await leaderboardManager.loadCurrentPlayerLeaderboardScore('weekly_challenge');

    if (myScore.rank > 0) {
        console.log(`你的排名: 第${myScore.rank}名，分数: ${myScore.score}`);

        // 显示排名信息
        document.getElementById('my-rank').textContent = myScore.formattedRank;
        document.getElementById('my-score').textContent = myScore.score.toLocaleString();
    } else {
        console.log('你还没有分数记录，快去挑战吧！');
        document.getElementById('my-rank').textContent = '未上榜';
    }
} catch (error) {
    console.error('获取排名失败:', error);
}

// 游戏开始时显示当前排名
class GameStartScreen {
    async showPlayerStatus(leaderboardId) {
        try {
            const playerScore = await leaderboardManager.loadCurrentPlayerLeaderboardScore(leaderboardId);

            const statusMessage = playerScore.rank > 0
                ? `当前排名: ${playerScore.formattedRank} (${playerScore.score}分)`
                : '暂无排名，开始游戏挑战排行榜！';

            this.displayPlayerStatus(statusMessage);

            // 设置目标排名
            if (playerScore.rank > 1) {
                this.setRankingGoal(playerScore.rank - 1);
            }
        } catch (error) {
            this.displayPlayerStatus('无法获取排名信息');
        }
    }

    setRankingGoal(targetRank) {
        const goalText = `目标：超越第${targetRank}名！`;
        document.getElementById('ranking-goal').textContent = goalText;
    }
}

// 分数提交后检查排名变化
class ScoreTracker {
    constructor(leaderboardId) {
        this.leaderboardId = leaderboardId;
        this.previousRank = null;
    }

    async trackRankingChange(newScore) {
        // 提交新分数
        await leaderboardManager.submitScores([{
            leaderboardId: this.leaderboardId,
            score: newScore
        }]);

        // 获取新排名
        const currentScore = await leaderboardManager.loadCurrentPlayerLeaderboardScore(this.leaderboardId);

        if (this.previousRank && currentScore.rank < this.previousRank) {
            const improvement = this.previousRank - currentScore.rank;
            this.showRankImprovement(improvement, currentScore.rank);
        }

        this.previousRank = currentScore.rank;
        return currentScore;
    }

    showRankImprovement(improvement, newRank) {
        const message = `恭喜！排名提升${improvement}位，当前第${newRank}名！`;
        this.displayNotification(message, 'success');
    }
}
""",
                "best_practices": [
                    "在游戏开始和结束时检查排名",
                    "友好展示未上榜的情况",
                    "追踪排名变化并给予反馈",
                    "缓存排名信息避免频繁查询"
                ]
            },
            {
                "method": "loadPlayerCenteredScores",
                "name": "查询附近玩家分数",
                "description": "查询当前用户相近排名的其他用户成绩，用于显示竞争对手",
                "signature": "loadPlayerCenteredScores(leaderboardId: string, count: number): Promise<LeaderboardEntry[]>",
                "parameters": {
                    "leaderboardId": {
                        "type": "string",
                        "description": "排行榜唯一标识",
                        "required": True
                    },
                    "count": {
                        "type": "number",
                        "description": "返回的总用户数（包含当前用户），建议奇数以当前用户为中心",
                        "required": True
                    }
                },
                "returns": {
                    "type": "Promise<LeaderboardEntry[]>",
                    "description": "以当前用户为中心的排行榜条目数组",
                    "properties": {
                        "userId": "string, 用户ID",
                        "userName": "string, 用户昵称",
                        "userAvatar": "string, 用户头像URL",
                        "score": "number, 用户分数",
                        "rank": "number, 排名",
                        "isCurrentPlayer": "boolean, 是否为当前用户",
                        "extraData": "string, 额外数据"
                    }
                },
                "example": """
// 查询附近玩家（以当前用户为中心的9个玩家）
const leaderboardManager = tap.getLeaderboardManager();

try {
    const nearbyPlayers = await leaderboardManager.loadPlayerCenteredScores('main_leaderboard', 9);

    console.log('附近玩家排名:');
    nearbyPlayers.forEach(player => {
        const marker = player.isCurrentPlayer ? ' (你)' : '';
        console.log(`${player.rank}. ${player.userName}${marker}: ${player.score}分`);
    });

    // 显示竞争对手
    displayCompetitors(nearbyPlayers);
} catch (error) {
    console.error('获取附近玩家失败:', error);
}

// 竞争对手界面
class CompetitorView {
    constructor(leaderboardId) {
        this.leaderboardId = leaderboardId;
    }

    async showCompetitors() {
        try {
            const competitors = await leaderboardManager.loadPlayerCenteredScores(this.leaderboardId, 7);

            // 找到当前用户
            const currentPlayer = competitors.find(p => p.isCurrentPlayer);
            const others = competitors.filter(p => !p.isCurrentPlayer);

            this.renderCompetitorList(currentPlayer, others);
        } catch (error) {
            this.showErrorMessage('无法加载竞争对手信息');
        }
    }

    renderCompetitorList(currentPlayer, competitors) {
        const container = document.getElementById('competitors-list');
        container.innerHTML = '';

        // 当前用户（突出显示）
        if (currentPlayer) {
            const playerElement = this.createPlayerElement(currentPlayer, true);
            container.appendChild(playerElement);
        }

        // 其他竞争者
        competitors.forEach(competitor => {
            const competitorElement = this.createPlayerElement(competitor, false);
            container.appendChild(competitorElement);
        });
    }

    createPlayerElement(player, isCurrentPlayer) {
        const className = isCurrentPlayer ? 'current-player' : 'competitor';
        const scoreDiff = isCurrentPlayer ? '' : this.calculateScoreDifference(player);

        return `
            <div class="${className}">
                <span class="rank">#${player.rank}</span>
                <img src="${player.userAvatar}" class="avatar" />
                <span class="name">${player.userName}</span>
                <span class="score">${player.score.toLocaleString()}</span>
                ${scoreDiff}
            </div>
        `;
    }
}

// 实时竞争追踪
class RivalTracker {
    constructor(leaderboardId) {
        this.leaderboardId = leaderboardId;
        this.rivals = [];
    }

    async updateRivalStatus() {
        try {
            const nearbyPlayers = await leaderboardManager.loadPlayerCenteredScores(this.leaderboardId, 5);
            const currentPlayer = nearbyPlayers.find(p => p.isCurrentPlayer);

            if (!currentPlayer) return;

            // 找到直接竞争对手（排名相近的玩家）
            const directRivals = nearbyPlayers.filter(p =>
                !p.isCurrentPlayer &&
                Math.abs(p.rank - currentPlayer.rank) <= 2
            );

            this.updateRivalsList(directRivals, currentPlayer);
        } catch (error) {
            console.warn('更新竞争对手状态失败:', error);
        }
    }

    updateRivalsList(rivals, currentPlayer) {
        this.rivals = rivals.map(rival => ({
            ...rival,
            scoreDifference: rival.score - currentPlayer.score,
            rankDifference: rival.rank - currentPlayer.rank
        }));

        this.displayRivalChallenges();
    }

    displayRivalChallenges() {
        const challenges = this.rivals.map(rival => {
            if (rival.rankDifference < 0) {
                // 需要超越的对手
                const pointsNeeded = rival.score - this.getCurrentPlayerScore() + 1;
                return `超越 ${rival.userName}，还需 ${pointsNeeded} 分`;
            } else {
                // 后面追赶的对手
                const lead = this.getCurrentPlayerScore() - rival.score;
                return `领先 ${rival.userName} ${lead} 分`;
            }
        });

        this.showChallengeNotifications(challenges);
    }
}

// 分数差距计算
function calculateScoreGap(playerScore, targetScore) {
    const gap = targetScore - playerScore;
    if (gap > 0) {
        return `还需 ${gap} 分超越`;
    } else if (gap < 0) {
        return `领先 ${Math.abs(gap)} 分`;
    } else {
        return '分数相同';
    }
}
""",
                "best_practices": [
                    "使用奇数count值以当前用户为中心展示",
                    "突出显示当前用户在列表中的位置",
                    "计算并显示与其他玩家的分数差距",
                    "提供超越目标的激励信息"
                ]
            }
        ],
        "common_patterns": {
            "leaderboard_integration": {
                "name": "完整排行榜功能集成",
                "description": "在游戏中集成完整的排行榜功能",
                "code": """
class GameLeaderboard {
    constructor(leaderboardId) {
        this.leaderboardId = leaderboardId;
        this.leaderboardManager = tap.getLeaderboardManager();
        this.currentPlayerScore = null;
    }

    // 游戏开始时初始化
    async initializeLeaderboard() {
        try {
            // 获取当前用户排名
            this.currentPlayerScore = await this.leaderboardManager.loadCurrentPlayerLeaderboardScore(this.leaderboardId);

            // 显示当前排名
            this.displayCurrentRanking();

            // 加载排行榜前列
            const topScores = await this.leaderboardManager.loadLeaderboardScores(this.leaderboardId, 1, 10);
            this.displayTopScores(topScores);

            // 加载附近竞争对手
            const competitors = await this.leaderboardManager.loadPlayerCenteredScores(this.leaderboardId, 7);
            this.displayCompetitors(competitors);

        } catch (error) {
            console.error('初始化排行榜失败:', error);
            this.showOfflineMode();
        }
    }

    // 提交游戏分数
    async submitGameScore(score, gameData) {
        const scoreSubmission = {
            leaderboardId: this.leaderboardId,
            score: score,
            extraData: JSON.stringify(gameData)
        };

        try {
            await this.leaderboardManager.submitScores([scoreSubmission]);

            // 获取新排名
            const newRanking = await this.leaderboardManager.loadCurrentPlayerLeaderboardScore(this.leaderboardId);

            // 检查排名变化
            this.checkRankingImprovement(newRanking);

            this.currentPlayerScore = newRanking;
            return newRanking;

        } catch (error) {
            console.error('分数提交失败:', error);
            // 本地缓存稍后重试
            this.cacheScoreForRetry(scoreSubmission);
            throw error;
        }
    }

    // 检查排名提升
    checkRankingImprovement(newRanking) {
        if (this.currentPlayerScore && newRanking.rank < this.currentPlayerScore.rank) {
            const improvement = this.currentPlayerScore.rank - newRanking.rank;
            this.showRankImprovementDialog(improvement, newRanking.rank);
        }
    }

    // 显示排名提升对话框
    showRankImprovementDialog(improvement, newRank) {
        const dialog = document.createElement('div');
        dialog.className = 'rank-improvement-dialog';
        dialog.innerHTML = `
            <h3>排名提升！</h3>
            <p>恭喜！你的排名提升了 ${improvement} 位</p>
            <p>当前排名：第 ${newRank} 名</p>
            <button onclick="this.parentElement.remove()">继续</button>
        `;
        document.body.appendChild(dialog);
    }

    // 显示当前排名
    displayCurrentRanking() {
        const rankingElement = document.getElementById('current-ranking');
        if (this.currentPlayerScore && this.currentPlayerScore.rank > 0) {
            rankingElement.innerHTML = `
                <div class="current-rank">
                    <span class="rank-number">#${this.currentPlayerScore.rank}</span>
                    <span class="score">${this.currentPlayerScore.score.toLocaleString()}</span>
                </div>
            `;
        } else {
            rankingElement.innerHTML = '<div class="no-rank">暂无排名</div>';
        }
    }

    // 本地缓存重试机制
    cacheScoreForRetry(scoreSubmission) {
        const cached = JSON.parse(localStorage.getItem('cached_scores') || '[]');
        cached.push({ ...scoreSubmission, timestamp: Date.now() });
        localStorage.setItem('cached_scores', JSON.stringify(cached));
    }

    // 重试缓存的分数
    async retryCachedScores() {
        const cached = JSON.parse(localStorage.getItem('cached_scores') || '[]');
        if (cached.length === 0) return;

        try {
            await this.leaderboardManager.submitScores(cached);
            localStorage.removeItem('cached_scores');
            console.log('缓存分数提交成功');
        } catch (error) {
            console.error('重试缓存分数失败:', error);
        }
    }
}

// 使用示例
const gameLeaderboard = new GameLeaderboard('main_game_leaderboard');

// 游戏开始
gameLeaderboard.initializeLeaderboard();

// 游戏结束
async function onGameEnd(finalScore, gameData) {
    try {
        const newRanking = await gameLeaderboard.submitGameScore(finalScore, gameData);
        showGameEndScreen(finalScore, newRanking);
    } catch (error) {
        showGameEndScreen(finalScore, null, '分数提交失败，稍后将自动重试');
    }
}
"""
            },
            "real_time_leaderboard": {
                "name": "实时排行榜更新",
                "description": "实现实时更新的排行榜显示",
                "code": """
class RealTimeLeaderboard {
    constructor(leaderboardId, updateInterval = 30000) {
        this.leaderboardId = leaderboardId;
        this.updateInterval = updateInterval;
        this.leaderboardManager = tap.getLeaderboardManager();
        this.isActive = false;
        this.intervalId = null;
    }

    // 启动实时更新
    startRealTimeUpdates() {
        if (this.isActive) return;

        this.isActive = true;
        this.updateLeaderboard(); // 立即更新一次

        this.intervalId = setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.updateLeaderboard();
            }
        }, this.updateInterval);
    }

    // 停止实时更新
    stopRealTimeUpdates() {
        this.isActive = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    // 更新排行榜数据
    async updateLeaderboard() {
        try {
            // 并行获取多种数据
            const [topScores, myScore, nearbyPlayers] = await Promise.all([
                this.leaderboardManager.loadLeaderboardScores(this.leaderboardId, 1, 10),
                this.leaderboardManager.loadCurrentPlayerLeaderboardScore(this.leaderboardId),
                this.leaderboardManager.loadPlayerCenteredScores(this.leaderboardId, 7)
            ]);

            this.updateUI(topScores, myScore, nearbyPlayers);
        } catch (error) {
            console.warn('更新排行榜失败:', error);
            this.handleUpdateError();
        }
    }

    // 更新UI显示
    updateUI(topScores, myScore, nearbyPlayers) {
        // 更新前十名
        this.updateTopScoresDisplay(topScores);

        // 更新我的排名
        this.updateMyRankDisplay(myScore);

        // 更新附近玩家
        this.updateNearbyPlayersDisplay(nearbyPlayers);

        // 添加更新时间戳
        this.updateTimestamp();
    }

    updateTopScoresDisplay(topScores) {
        const container = document.getElementById('top-scores');
        container.innerHTML = topScores.map((entry, index) => `
            <div class="leaderboard-entry ${index < 3 ? 'top-three' : ''}">
                <span class="rank">${entry.rank}</span>
                <img src="${entry.userAvatar}" class="avatar" />
                <span class="name">${entry.userName}</span>
                <span class="score">${entry.score.toLocaleString()}</span>
            </div>
        `).join('');
    }

    updateMyRankDisplay(myScore) {
        const container = document.getElementById('my-rank');
        if (myScore.rank > 0) {
            container.innerHTML = `
                <div class="my-ranking">
                    <span class="label">我的排名:</span>
                    <span class="rank">#${myScore.rank}</span>
                    <span class="score">${myScore.score.toLocaleString()}</span>
                </div>
            `;
        } else {
            container.innerHTML = '<div class="no-ranking">暂无排名</div>';
        }
    }

    updateTimestamp() {
        const timestamp = document.getElementById('last-update');
        timestamp.textContent = `最后更新: ${new Date().toLocaleTimeString()}`;
    }

    handleUpdateError() {
        const errorElement = document.getElementById('update-error');
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }
}

// 页面可见性变化时的优化
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // 页面变为可见时，立即更新一次
        realTimeLeaderboard.updateLeaderboard();
    }
});
"""
            }
        },
        "best_practices": {
            "title": "排行榜最佳实践",
            "practices": [
                {
                    "category": "性能优化",
                    "items": [
                        "合理设置更新频率，避免过于频繁的API调用",
                        "使用分页加载大量排行榜数据",
                        "缓存排行榜数据，减少重复请求",
                        "在页面不可见时暂停自动刷新"
                    ]
                },
                {
                    "category": "用户体验",
                    "items": [
                        "提供清晰的排名变化反馈",
                        "突出显示当前用户在排行榜中的位置",
                        "显示与其他玩家的分数差距",
                        "提供激励性的目标设定（如超越下一名）"
                    ]
                },
                {
                    "category": "错误处理",
                    "items": [
                        "网络错误时本地缓存分数，稍后重试",
                        "提供离线模式的基本排行榜功能",
                        "添加重试机制处理临时性错误",
                        "友好显示加载状态和错误信息"
                    ]
                },
                {
                    "category": "安全性",
                    "items": [
                        "在客户端验证分数的合理性",
                        "避免在短时间内提交大量分数",
                        "使用extraData记录关键游戏信息用于验证",
                        "实现防作弊机制和异常检测"
                    ]
                }
            ]
        },
        "error_codes": {
            "common_errors": [
                {
                    "code": "NETWORK_ERROR",
                    "description": "网络连接错误",
                    "solution": "检查网络连接，实现重试机制"
                },
                {
                    "code": "INVALID_LEADERBOARD_ID",
                    "description": "排行榜ID无效",
                    "solution": "检查排行榜ID是否正确配置"
                },
                {
                    "code": "SCORE_VALIDATION_FAILED",
                    "description": "分数验证失败",
                    "solution": "确保分数值合法，检查extraData格式"
                },
                {
                    "code": "RATE_LIMIT_EXCEEDED",
                    "description": "请求频率超限",
                    "solution": "减少请求频率，添加防抖机制"
                },
                {
                    "code": "USER_NOT_LOGGED_IN",
                    "description": "用户未登录",
                    "solution": "确保用户已登录TapTap账号"
                }
            ]
        }
    }
}

# 排行榜搜索索引
LEADERBOARD_SEARCH_INDEX = {
    "keywords": {
        "排行榜": ["leaderboard_system"],
        "排名": ["leaderboard_system"],
        "分数": ["leaderboard_system"],
        "提交": ["leaderboard_system"],
        "查询": ["leaderboard_system"],
        "竞争": ["leaderboard_system"],
        "榜单": ["leaderboard_system"],
        "附近": ["leaderboard_system"],
        "实时": ["leaderboard_system"],
        "批量": ["leaderboard_system"]
    },
    "methods": {
        "openLeaderboard": "打开排行榜页面",
        "submitScores": "批量提交分数",
        "loadLeaderboardScores": "加载排行榜数据",
        "loadCurrentPlayerLeaderboardScore": "获取当前用户排名",
        "loadPlayerCenteredScores": "查询附近玩家分数"
    }
}