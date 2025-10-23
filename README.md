# TapTap Open API MCP Server

> Model Context Protocol (MCP) server for **TapTap Minigame & H5 Games** - Leaderboard documentation and management APIs with **OAuth 2.0 zero-config authentication**.

🔐 **Zero-Config OAuth** | 📚 **Complete Docs** | 🎯 **Modular Architecture** | 🌍 **Minigame & H5**

## Features

### 🔐 Zero-Config OAuth Authentication

- **No manual token configuration needed!**
- Device Code Flow - Scan QR code to authorize
- Auto-save token to `~/.config/taptap-minigame/token.json`
- Works in Cursor, Claude Code, VSCode
- Lazy loading - Server starts instantly, auth triggered when needed

### 📖 Complete API Documentation

6 LeaderboardManager APIs with detailed docs:
- `tap.getLeaderboardManager()` - Initialize leaderboard
- `submitScores()` - Submit player scores
- `openLeaderboard()` - Display leaderboard UI
- `loadLeaderboardScores()` - Fetch leaderboard data
- `loadCurrentPlayerLeaderboardScore()` - Get player's rank
- `loadPlayerCenteredScores()` - Load nearby players

**⚠️ CRITICAL: NO SDK installation needed!**
- `tap` is a global object (like `window`)
- No `npm install` required
- No imports needed

### ⚙️ Server-side Management

- **Create Leaderboards** - Server-side leaderboard creation
- **List Leaderboards** - Query existing leaderboards
- **Auto ID Management** - Auto-fetch developer_id, app_id, miniapp_id
- **Complete Integration Guide** - Step-by-step workflow

### 🎯 Modular Architecture

- **10 Tools** - Unified entry points for AI
- **7 Resources** - Detailed API documentation
- **Modular Design** - Easy to add new features (cloud save, share, etc.)
- **Fully Compatible** - Claude Code ✅, VSCode ✅, Cursor ✅

## Quick Start

### Installation

```bash
npm install -g minigame-open-mcp
```

Or use directly with npx (no installation needed):

```bash
npx minigame-open-mcp
```

### Configuration

#### For Claude Code / VSCode / Cursor (Zero-Config with OAuth)

**Recommended**: Use OAuth Device Code Flow - No manual token configuration needed!

Add to `.mcp.json` in your project:

```json
{
  "mcpServers": {
    "taptap-minigame": {
      "command": "npx",
      "args": ["-y", "@mikoto_zero/minigame-open-mcp@beta"],
      "env": {
        "TDS_MCP_ENV": "production"
      }
    }
  }
}
```

**First use**:
1. Server starts instantly
2. When you use authenticated tools, you'll get a QR code link
3. Scan with TapTap App to authorize
4. Call `complete_oauth_authorization` tool
5. Token auto-saved, future uses automatic!

**Manual token configuration** (Optional):

If you prefer to configure manually:

```json
{
  "mcpServers": {
    "taptap-minigame": {
      "command": "npx",
      "args": ["@mikoto_zero/minigame-open-mcp@beta"],
      "env": {
        "TDS_MCP_MAC_TOKEN": "{\"kid\":\"your_kid\",\"token_type\":\"mac\",\"mac_key\":\"your_key\",\"mac_algorithm\":\"hmac-sha-1\"}",
        "TDS_MCP_ENV": "production",
        "TAPTAP_MINIGAME_MCP_VERBOSE": "false"
      }
    }
  }
}
```

#### For OpenHands

```json
{
  "mcpServers": {
    "taptap-minigame": {
      "command": "npx",
      "args": ["@mikoto_zero/minigame-open-mcp"],
      "env": {
        "TDS_MCP_MAC_TOKEN": "${CURRENT_USER_MAC_TOKEN}",
        "TDS_MCP_CLIENT_ID": "your_client_id",
        "TDS_MCP_CLIENT_TOKEN": "your_client_secret",
        "TDS_MCP_PROJECT_PATH": "${CURRENT_PROJECT_PATH}",
        "TAPTAP_MINIGAME_MCP_VERBOSE": "false"
      }
    }
  }
}
```

### Environment Variables

**For OAuth (Recommended - Zero Config):**
- ✅ No environment variables required!
- Token auto-saved to `~/.config/taptap-minigame/token.json`

**For Manual Configuration (Optional):**
- `TDS_MCP_MAC_TOKEN` - MAC Token in JSON format (optional, use OAuth if not set)
- `TDS_MCP_CLIENT_ID` - Client ID (has default value, override if needed)
- `TDS_MCP_CLIENT_TOKEN` - Signing key (has default value, override if needed)

**Optional:**
- `TDS_MCP_ENV` - Environment: `production` (default) or `rnd`
- `TDS_MCP_PROJECT_PATH` - Project path for local caching
- `TAPTAP_MINIGAME_MCP_VERBOSE` - Detailed logging: `true` or `false` (default)

**Debugging:**

Enable detailed logging to see all tool calls, HTTP requests/responses:

```bash
export TAPTAP_MINIGAME_MCP_VERBOSE=true
npm start
```

The verbose mode logs:
- 📥 Tool call inputs and outputs
- 📤 HTTP request headers and body
- 📥 HTTP response status and data
- 🔒 Sensitive data automatically masked

## Usage

### Scenario 1: Getting Started with Leaderboards

```
User: "I want to integrate leaderboards into my game"

AI Agent calls: get_integration_guide

Returns: Complete step-by-step workflow
✅ Emphasizes NO SDK installation
✅ Step 1: Check/create server-side leaderboard
✅ Step 2: Client code (using global tap object)
✅ Step 3: Testing checklist
✅ Lists all Resources for detailed API docs
```

### Scenario 2: Get Implementation Code

```
User: "How do I submit scores to the leaderboard?"

AI Agent calls: submit_scores

System returns:
✅ Method signature: leaderboardManager.submitScores(scores, callback)
✅ Parameter documentation
✅ Complete code example
✅ Error handling guide
```

### Scenario 3: Create a Leaderboard

```
User: "Create a weekly high score leaderboard"

AI Agent calls: create_leaderboard
{
  title: "Weekly High Score",
  period_type: 1,
  score_type: 0,
  score_order: 1,
  calc_type: 0
}

System:
✅ Auto-fetches developer_id and app_id
✅ Creates leaderboard
✅ Returns leaderboard_id
✅ Caches for future use
```

## Available Tools (14 total)

### Core API Documentation Tools (6)
- `get_leaderboard_manager`
- `open_leaderboard`
- `submit_scores`
- `load_leaderboard_scores`
- `load_current_player_score`
- `load_player_centered_scores`

### Management Tools (2)
- `create_leaderboard` - Create new leaderboards
- `list_leaderboards` - Query existing leaderboards

### Helper Tools (3)
- `search_leaderboard_docs` - Search documentation
- `get_leaderboard_overview` - System overview
- `get_leaderboard_patterns` - Best practices

### System Tools (2)
- `check_environment` - Environment check
- `start_leaderboard_integration` - Workflow guidance

### User Data Tool (1)
- `get_user_leaderboard_scores` - Query user scores (requires token)

## Technical Details

### Request Signing

All server-side API requests use HMAC-SHA256 signing:

```
Signature = HMAC-SHA256(
  method + "\n" +
  url + "\n" +
  x-tap-headers + "\n" +
  body + "\n",
  TDS_MCP_CLIENT_TOKEN
)
```

### Auto ID Management

Developer ID and App ID are automatically managed:

1. First call to management tools triggers `/level/v1/list` API
2. Selects first developer and first app
3. Caches to `~/.config/taptap-minigame/app.json`
4. Subsequent calls use cached values
5. No manual ID input needed

### Multi-Environment Support

- **Production** (default): `https://agent.tapapis.cn`
- **RND**: `https://agent.api.xdrnd.cn`

Switch via `TDS_MCP_ENV` environment variable.

## Requirements

- Node.js >= 16.0.0
- Valid TapTap user token
- Client ID and secret for API access

## API Reference

Based on TapTap official documentation:
- https://developer.taptap.cn/minigameapidoc/dev/api/open-api/leaderboard/

## License

MIT

## Links

- [TapTap Developer Portal](https://developer.taptap.cn/)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [Issues](https://github.com/taptap/taptap-minigame-mcp-server/issues)

## 🏗️ Architecture

### Modular Design

v1.2.0-beta introduces a **fully modular architecture** where each feature is self-contained:

```
src/
├── features/              # Feature modules (self-contained)
│   └── leaderboard/      # All leaderboard code in one place
│       ├── index.ts      # Module definition & registration
│       ├── tools.ts      # Tools definitions + handlers
│       ├── resources.ts  # Resources definitions + handlers
│       ├── docs.ts       # Documentation content
│       ├── docTools.ts   # Documentation tools
│       ├── handlers.ts   # Business logic
│       └── api.ts        # API calls
│
├── core/                  # Shared core functionality
│   ├── auth/             # OAuth Device Code Flow
│   ├── network/          # HTTP Client
│   ├── handlers/         # Common handlers
│   ├── utils/            # Cache, logger
│   └── types/            # Type definitions
│
└── server.ts              # Main server (auto-registration)
```

**Adding new features**:
```typescript
// 1. Copy template
cp -r src/features/leaderboard src/features/cloudSave

// 2. Modify content in features/cloudSave/

// 3. Import in server.ts
import { cloudSaveModule } from './features/cloudSave/index.js';
const allModules = [leaderboardModule, cloudSaveModule];

// Done! Auto-registered ✅
```

## 📚 Documentation

- **README.md** - This file (user guide)
- **CLAUDE.md** - Claude Code integration guide
- **CONTRIBUTING.md** - Developer guide for adding features
- **ARCHITECTURE.md** - Detailed architecture documentation
- **CHANGELOG.md** - Version history

## 🤝 Contributing

Want to add new features (cloud save, share, etc.)?

See **CONTRIBUTING.md** for:
- Step-by-step guide
- Code structure
- Design principles
- Quick start script: `./scripts/create-feature.sh`

## 📖 Resources

- **Official API Docs**: https://developer.taptap.cn/minigameapidoc/dev/api/open-api/leaderboard/
- **MCP Specification**: https://modelcontextprotocol.io/
- **npm Package**: [@mikoto_zero/minigame-open-mcp](https://www.npmjs.com/package/@mikoto_zero/minigame-open-mcp)

## 📊 Versions

- **latest (v1.1.4)**: Tools-only stable version (17 tools)
- **beta (v1.2.0-beta.11)**: Modular architecture with OAuth (10 tools + 7 resources)

## 📄 License

MIT
