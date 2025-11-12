/**
 * Vibrate Tools Definitions and Handlers
 * Unified definitions and handlers (no more manual sync required!)
 */

import type { ToolRegistration, HandlerContext } from '../../core/types/index.js';

// Import from this module
import { vibrateTools as vibrateDocTools } from './docTools.js';

/**
 * Vibrate Tools
 * Each tool combines its definition and handler in one place
 */
export const vibrateTools: ToolRegistration[] = [
  // 🎯 Integration Guide
  {
    definition: {
      name: 'get_vibrate_integration_guide',
      description: '⭐ READ THIS FIRST when user wants to integrate/接入/setup/add vibrate功能. Returns complete step-by-step workflow. CRITICAL: Emphasizes NO SDK installation - tap is global object. Call this BEFORE making any implementation plans.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async (args, context) => {
      return vibrateDocTools.getIntegrationWorkflow();
    }
  },

  // 📚 Documentation Tools
  {
    definition: {
      name: 'get_vibrate_short_doc',
      description: 'Get complete documentation for tap.vibrateShort() API - short vibration (15ms) with intensity levels (heavy, medium, light)',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async (args, context) => {
      return vibrateDocTools.getVibrateShort();
    }
  },

  {
    definition: {
      name: 'get_vibrate_long_doc',
      description: 'Get complete documentation for tap.vibrateLong() API - long vibration (400ms)',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async (args, context) => {
      return vibrateDocTools.getVibrateLong();
    }
  },

  {
    definition: {
      name: 'get_vibrate_overview',
      description: 'Get complete overview of all Vibrate APIs and features',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async (args, context) => {
      return vibrateDocTools.getVibrateOverview();
    }
  },

  {
    definition: {
      name: 'get_vibrate_patterns',
      description: 'Get common usage patterns and best practices for vibrate APIs',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async (args, context) => {
      return vibrateDocTools.getVibratePatterns();
    }
  },

  {
    definition: {
      name: 'search_vibrate_docs',
      description: 'Search vibrate documentation by keyword',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search keyword'
          }
        }
      }
    },
    handler: async (args: { query?: string }, context) => {
      return vibrateDocTools.searchVibrateDocs(args);
    }
  },

  // 💡 Usage Examples (these are documentation/guide tools, not API calls)
  {
    definition: {
      name: 'get_vibrate_usage_examples',
      description: 'Get practical code examples for using vibrate APIs in games - button clicks, achievements, error feedback, etc.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    handler: async (args, context) => {
      return vibrateDocTools.getQuickStartGuide();
    }
  },

  // 🎯 Code Generation Tool - Generate vibrateShort code with type parameter
  {
    definition: {
      name: 'generate_vibrate_short_code',
      description: 'Generate code example for tap.vibrateShort() with type parameter. Can recommend type based on scenario (error/button/success) or use specified type. Returns ready-to-use code with error handling.',
      inputSchema: {
        type: 'object',
        properties: {
          scenario: {
            type: 'string',
            description: 'Usage scenario (e.g., "button click", "error feedback", "success", "achievement"). Will auto-recommend type if provided.'
          },
          type: {
            type: 'string',
            enum: ['heavy', 'medium', 'light'],
            description: 'Vibration intensity type. If not provided, will be recommended based on scenario.'
          },
          style: {
            type: 'string',
            enum: ['promise', 'callback'],
            description: 'Code style: "promise" (async/await, recommended) or "callback" (traditional callback style). Default: "promise"'
          }
        }
      }
    },
    handler: async (args: {
      scenario?: string;
      type?: 'heavy' | 'medium' | 'light';
      style?: 'promise' | 'callback';
    }, context) => {
      return vibrateDocTools.generateVibrateShortCode(args);
    }
  }
];
