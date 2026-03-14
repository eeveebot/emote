import * as ircColors from 'irc-colors';
import { log } from '@eeveebot/libeevee';

// Available irc-colors for random selection
// Using a more defensive approach to avoid runtime errors
const colors: ((text: string) => string)[] = [];

// Handle both ES module and CommonJS imports
const ircColorsObj =
  (ircColors as unknown as { default?: typeof ircColors }).default || ircColors;

// Only include the colors we know exist and are safe to use
const safeColors = [
  'red',
  'green',
  'yellow',
  'blue',
  'purple',
  'cyan',
  'white',
  'gray',
  'lightgreen',
  'pink',
  'lightgray',
] as const;

for (const colorName of safeColors) {
  // Use bracket notation to access color functions
  const colorFunc = ircColorsObj[colorName];
  if (typeof colorFunc === 'function') {
    colors.push(colorFunc);
  }
}

// Fallback to prevent empty array
if (colors.length === 0) {
  colors.push((text: string) => text);
}

// Debug logging
log.debug('Initialized IRC colors', {
  producer: 'emote',
  colorCount: colors.length,
});

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
