import { randomColorForPlatform } from '@eeveebot/libeevee';

/**
 * Colorize text with a random IRC color (IRC only).
 */
export function colorizeForPlatform(text: string, platform: string): string {
  return randomColorForPlatform(text, platform);
}
