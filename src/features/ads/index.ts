/**
 * Ads Feature Module
 * Provides tools and resources for TapTap Ads APIs (Rewarded Video, Interstitial, Banner)
 * Tools and resources use enhanced descriptions to guide AI to use local docs instead of web search
 */

import type { FeatureModule } from '../../core/types/index.js';

// Import from ads module
import { adsTools_Registration } from './tools.js';
import { adsResources } from './resources.js';

/**
 * Ads Module Definition
 * Provides both tools and resources with enhanced descriptions
 * Tools are prioritized - AI should use tools instead of searching the web
 * Resources provide additional documentation access
 */
export const adsModule: FeatureModule = {
  name: 'ads',

  // Tools with explicit "DO NOT search the web" instructions
  // AI should call these tools instead of searching the internet
  tools: adsTools_Registration.map((tool) => ({
    definition: tool.definition,
    handler: tool.handler,
    requiresAuth: false, // Ads tools don't require authentication (pure documentation)
  })),

  // Resources with their handlers (unified format)
  // Enhanced descriptions help AI discover and prioritize these resources
  resources: adsResources,
};
