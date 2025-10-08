/**
 * TapTap Minigame Leaderboard Documentation Tools
 * Each LeaderboardManager API has its own dedicated tool
 */

import {
  searchLeaderboardDocs as searchDocs,
  getLeaderboardOverview as getOverview,
  LEADERBOARD_DOCUMENTATION
} from '../data/leaderboardDocs.js';

interface ToolArgs {
  query?: string;
}

/**
 * Get specific API documentation by name
 */
function getAPIDoc(categoryKey: string, apiName: string): string {
  const category = LEADERBOARD_DOCUMENTATION.categories[categoryKey];
  if (!category) {
    return `Category "${categoryKey}" not found`;
  }

  const api = category.apis.find(a => a.name === apiName);
  if (!api) {
    return `API "${apiName}" not found in category "${categoryKey}"`;
  }

  let doc = `# ${api.name}\n\n`;
  doc += `**Method Signature:**\n\`\`\`javascript\n${api.method}\n\`\`\`\n\n`;
  doc += `**Description:** ${api.description}\n\n`;

  if (api.parameters) {
    doc += `## Parameters\n\n`;
    for (const [param, desc] of Object.entries(api.parameters)) {
      doc += `- **\`${param}\`**: ${desc}\n`;
    }
    doc += '\n';
  }

  if (api.returnValue) {
    doc += `## Returns\n\n${api.returnValue}\n\n`;
  }

  doc += `## Code Example\n\n\`\`\`javascript\n${api.example}\n\`\`\`\n`;

  return doc;
}

// ============ Core API Tools (one for each LeaderboardManager API) ============

/**
 * Get documentation for tap.getLeaderboardManager()
 */
async function getLeaderboardManager(): Promise<string> {
  return getAPIDoc('initialization', 'tap.getLeaderboardManager');
}

/**
 * Get documentation for openLeaderboard()
 */
async function openLeaderboard(): Promise<string> {
  return getAPIDoc('display', 'openLeaderboard');
}

/**
 * Get documentation for submitScores()
 */
async function submitScores(): Promise<string> {
  return getAPIDoc('score_submission', 'submitScores');
}

/**
 * Get documentation for loadLeaderboardScores()
 */
async function loadLeaderboardScores(): Promise<string> {
  return getAPIDoc('score_query', 'loadLeaderboardScores');
}

/**
 * Get documentation for loadCurrentPlayerLeaderboardScore()
 */
async function loadCurrentPlayerScore(): Promise<string> {
  return getAPIDoc('score_query', 'loadCurrentPlayerLeaderboardScore');
}

/**
 * Get documentation for loadPlayerCenteredScores()
 */
async function loadPlayerCenteredScores(): Promise<string> {
  return getAPIDoc('score_query', 'loadPlayerCenteredScores');
}

// ============ Helper Tools ============

/**
 * Search leaderboard documentation by keyword
 */
async function searchLeaderboardDocs(args: ToolArgs): Promise<string> {
  const query = args.query?.toLowerCase() || '';

  if (!query) {
    return 'Please provide a search keyword.';
  }

  const results = searchDocs(query);

  if (results.length === 0) {
    return `No results found for "${query}".\n\nTry searching for: initialization, open, submit, load, score, ranking, leaderboard`;
  }

  return `**🏆 Search Results for "${query}"**\n\n` + results.join('\n---\n\n');
}

/**
 * Get complete leaderboard system overview
 */
async function getLeaderboardOverview(): Promise<string> {
  return getOverview();
}

/**
 * Get integration patterns and best practices
 */
async function getLeaderboardPatterns(): Promise<string> {
  const category = LEADERBOARD_DOCUMENTATION.categories['common_scenarios'];
  if (!category) return 'Common scenarios not found';

  let doc = `# ${category.title}\n\n${category.description}\n\n`;

  for (const api of category.apis) {
    doc += `## ${api.name}\n\n`;
    doc += `${api.description}\n\n`;
    doc += `\`\`\`javascript\n${api.example}\n\`\`\`\n\n`;
  }

  return doc;
}

export const leaderboardTools = {
  // Core API tools
  getLeaderboardManager,
  openLeaderboard,
  submitScores,
  loadLeaderboardScores,
  loadCurrentPlayerScore,
  loadPlayerCenteredScores,

  // Helper tools
  searchLeaderboardDocs,
  getLeaderboardOverview,
  getLeaderboardPatterns
};
