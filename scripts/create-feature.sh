#!/bin/bash

# 快速创建新功能的脚手架脚本
# 用法: ./scripts/create-feature.sh cloud-save "Cloud Save"

FEATURE_KEY=$1  # 例如: cloud-save
FEATURE_NAME=$2  # 例如: Cloud Save

if [ -z "$FEATURE_KEY" ] || [ -z "$FEATURE_NAME" ]; then
  echo "用法: ./scripts/create-feature.sh <feature-key> <feature-name>"
  echo "示例: ./scripts/create-feature.sh cloud-save \"Cloud Save\""
  exit 1
fi

# 转换为驼峰命名
CAMEL_CASE=$(echo $FEATURE_KEY | sed -r 's/(^|-)([a-z])/\U\2/g')  # cloudSave
PASCAL_CASE=$(echo $CAMEL_CASE | sed 's/^./\U&/')  # CloudSave

echo "🚀 创建新功能: $FEATURE_NAME"
echo "   Key: $FEATURE_KEY"
echo "   CamelCase: $CAMEL_CASE"
echo "   PascalCase: $PASCAL_CASE"
echo ""

# 1. 创建文档数据文件
echo "📝 创建 src/data/${CAMEL_CASE}Docs.ts"
cat > src/data/${CAMEL_CASE}Docs.ts << EOF
/**
 * TapTap $FEATURE_NAME API Documentation
 */

export interface ${PASCAL_CASE}API {
  name: string;
  method: string;
  description: string;
  parameters?: Record<string, string>;
  returnValue?: string;
  example: string;
}

export const ${CAMEL_CASE.toUpperCase()}_DOCUMENTATION = {
  title: "TapTap $FEATURE_NAME API (Minigame & H5)",
  description: \`Complete $FEATURE_NAME functionality...

⚠️ IMPORTANT:
- NO npm packages or SDK installation required
- Use global 'tap' object
- Works in TapTap Minigame AND H5 environments\`,

  apis: [
    // TODO: 添加 API 定义
  ]
};

export function get${PASCAL_CASE}Overview(): string {
  // TODO: 实现概览函数
  return \`# \${${CAMEL_CASE.toUpperCase()}_DOCUMENTATION.title}\n\n...\`;
}
EOF

# 2. 创建工具函数
echo "🔧 创建 src/tools/${CAMEL_CASE}Tools.ts"
cat > src/tools/${CAMEL_CASE}Tools.ts << EOF
/**
 * $FEATURE_NAME Tools
 */

import { ${CAMEL_CASE.toUpperCase()}_DOCUMENTATION, get${PASCAL_CASE}Overview } from '../data/${CAMEL_CASE}Docs.js';

// TODO: 实现各个 API 的文档获取函数

/**
 * Get integration workflow
 */
export async function get${PASCAL_CASE}IntegrationWorkflow(): Promise<string> {
  return \`# $FEATURE_NAME 完整接入工作流

## ⚠️ 关键原则：客户端无需安装 SDK

...

## 📚 需要详细 API 文档？

- **docs://$FEATURE_KEY/api/xxx** - 某个 API 详细文档
- **docs://$FEATURE_KEY/overview** - 完整概览
  \`;
}

export const ${CAMEL_CASE}Tools = {
  get${PASCAL_CASE}Overview,
  get${PASCAL_CASE}IntegrationWorkflow
  // TODO: 添加更多工具函数
};
EOF

# 3. 创建 API 调用层
echo "🌐 创建 src/network/${CAMEL_CASE}Api.ts"
cat > src/network/${CAMEL_CASE}Api.ts << EOF
/**
 * $FEATURE_NAME API Calls
 */

import { HttpClient } from './httpClient.js';

// TODO: 定义接口和实现 API 调用
EOF

# 4. 创建业务处理器
echo "⚙️  创建 src/handlers/${CAMEL_CASE}Handlers.ts"
cat > src/handlers/${CAMEL_CASE}Handlers.ts << EOF
/**
 * $FEATURE_NAME Handlers
 */

export interface HandlerContext {
  projectPath?: string;
  macToken?: any;
}

// TODO: 实现业务逻辑处理器
EOF

echo ""
echo "✅ 文件创建完成！"
echo ""
echo "📋 下一步："
echo "1. 实现 src/data/${CAMEL_CASE}Docs.ts 中的文档内容"
echo "2. 实现 src/tools/${CAMEL_CASE}Tools.ts 中的工具函数"
echo "3. 实现 src/network/${CAMEL_CASE}Api.ts 中的 API 调用"
echo "4. 实现 src/handlers/${CAMEL_CASE}Handlers.ts 中的业务逻辑"
echo "5. 在 src/config/toolDefinitions.ts 中注册 Tools"
echo "6. 在 src/config/resourceDefinitions.ts 中注册 Resources"
echo "7. 在 src/server.ts 中注册处理器"
echo "8. 编译测试: npm run build"
echo ""
echo "📖 参考: CONTRIBUTING.md"
