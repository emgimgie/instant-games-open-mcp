/**
 * Vibrate Handlers
 * Note: Vibrate APIs are client-side only, no server-side API calls needed
 * These handlers provide usage guidance and code examples
 */

import type { HandlerContext } from '../../core/types/index.js';
import { vibrateTools } from './docTools.js';

/**
 * Get vibrateShort usage guide
 * This is a client-side API, so we just return documentation
 */
export async function getVibrateShortGuide(
  _args: {},
  _context: HandlerContext
): Promise<string> {
  return await vibrateTools.getVibrateShort();
}

/**
 * Get vibrateLong usage guide
 * This is a client-side API, so we just return documentation
 */
export async function getVibrateLongGuide(
  _args: {},
  _context: HandlerContext
): Promise<string> {
  return await vibrateTools.getVibrateLong();
}
