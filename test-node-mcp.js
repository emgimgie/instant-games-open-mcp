#!/usr/bin/env node

/**
 * 简单的 Node.js MCP 服务器测试
 */

const path = require('path');

async function testNodeMCP() {
    console.log('🧪 测试 Node.js MCP 服务器');
    console.log('=' .repeat(50));

    // 检查项目结构
    const requiredFiles = [
        'package.json',
        'tsconfig.json',
        'src/server.ts',
        'src/data/authDocs.ts',
        'src/data/cloudSaveDocs.ts',
        'src/data/leaderboardDocs.ts',
        'src/data/sdkDocs.ts',
        'src/tools/authTools.ts',
        'src/tools/cloudSaveTools.ts',
        'src/tools/leaderboardTools.ts',
        'src/tools/sdkTools.ts',
        'bin/taptap-docs-mcp'
    ];

    console.log('📁 检查项目文件...');
    let allExists = true;

    for (const file of requiredFiles) {
        const exists = require('fs').existsSync(file);
        console.log(`   ${exists ? '✅' : '❌'} ${file}`);
        if (!exists) allExists = false;
    }

    if (!allExists) {
        console.log('\n❌ 部分文件缺失');
        return false;
    }

    console.log('\n📦 检查 package.json...');
    try {
        const packageJson = require('./package.json');
        console.log(`   ✅ 包名: ${packageJson.name}`);
        console.log(`   ✅ 版本: ${packageJson.version}`);
        console.log(`   ✅ 主入口: ${packageJson.main}`);
        console.log(`   ✅ 可执行文件: ${Object.keys(packageJson.bin || {}).join(', ')}`);
    } catch (error) {
        console.log(`   ❌ package.json 读取失败: ${error.message}`);
        return false;
    }

    console.log('\n🔧 检查 TypeScript 配置...');
    try {
        const tsConfig = require('./tsconfig.json');
        console.log(`   ✅ 目标: ${tsConfig.compilerOptions.target}`);
        console.log(`   ✅ 模块: ${tsConfig.compilerOptions.module}`);
        console.log(`   ✅ 输出目录: ${tsConfig.compilerOptions.outDir}`);
    } catch (error) {
        console.log(`   ❌ tsconfig.json 读取失败: ${error.message}`);
        return false;
    }

    console.log('\n📚 Node.js MCP 服务器已准备就绪！');
    console.log('\n🚀 下一步操作：');
    console.log('   1. npm install              # 安装依赖');
    console.log('   2. npm run build            # 编译项目');
    console.log('   3. npm start                # 启动服务器');
    console.log('   或者：');
    console.log('   1. ./start-node-mcp.sh      # 一键启动（自动处理依赖和编译）');

    return true;
}

testNodeMCP().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('❌ 测试失败:', error);
    process.exit(1);
});