/**
 * DC Current App Feature Module
 */

import type { FeatureModule } from '../../core/types/index.js';
import { dcCurrentAppTools } from './tools.js';

/**
 * Current-app scoped DC capability module.
 */
export const dcCurrentAppModule: FeatureModule = {
  name: 'dcCurrentApp',
  tools: dcCurrentAppTools,
  resources: [],
};
