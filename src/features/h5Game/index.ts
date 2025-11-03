/**
 * H5 Game Module
 * Manages H5 game upload, creation, and management on TapTap platform
 */

import type { FeatureModule } from '../../core/types/index.js';
import { h5GameTools } from './tools.js';

export const h5GameModule: FeatureModule = {
  name: 'h5Game',
  tools: h5GameTools,
  resources: [], // No resources for H5 game module
};
