/**
 * Vibrate Feature Module
 * All vibrate-related Tools, Resources, and Handlers in one place
 */

import type { FeatureModule } from '../../core/types/index.js';

// Import from vibrate module
import { vibrateTools } from './tools.js';
import { vibrateResources } from './resources.js';

/**
 * Vibrate Module Definition
 */
export const vibrateModule: FeatureModule = {
  name: 'vibrate',

  // All Tools with their handlers (unified format)
  tools: vibrateTools.map(tool => ({
    definition: tool.definition,
    handler: tool.handler,
    // Vibrate APIs are client-side only, no auth needed
    // Add tool names to the array below if any future tools require auth
    requiresAuth: ([] as string[]).includes(tool.definition.name)
  })),

  // All Resources with their handlers (unified format)
  resources: vibrateResources
};
