import * as ircColors from 'irc-colors';
import { log } from '@eeveebot/libeevee';

// Available irc-colors for random selection
const colors = [
  ircColors.red,
  ircColors.green,
  ircColors.yellow,
  ircColors.blue,
  ircColors.purple,
  ircColors.cyan,
  ircColors.white,
  ircColors.gray,
  ircColors.lightgreen,
  ircColors.pink,
  ircColors.lightgray,
].filter((color) => typeof color === 'function');

/**
 * Colorize text only if platform is IRC
 * @param text Text to colorize
 * @param platform Platform identifier
 * @returns Colorized text if platform is IRC, otherwise original text
 */
export function colorizeForPlatform(text: string, platform: string): string {
  log.debug('colorizeForPlatform called', {
    producer: 'emote',
    text: text,
    platform: platform,
  });

  // Only apply colorization for IRC platform
  if (platform === 'irc') {
    try {
      // Pick a random color from the available colors
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const coloredText = randomColor(text);

      log.debug('Successfully colorized text for IRC', {
        producer: 'emote',
        originalText: text,
        coloredText: coloredText,
      });

      return coloredText;
    } catch (error) {
      log.error('Failed to colorize text for IRC', {
        producer: 'emote',
        text: text,
        error: error instanceof Error ? error.message : String(error),
      });
      return text;
    }
  }

  log.debug('Returning original text for non-IRC platform', {
    producer: 'emote',
    text: text,
    platform: platform,
  });

  // Return original text for non-IRC platforms
  return text;
}
