import * as ircColors from 'irc-colors';

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
  ircColors.lightyellow,
  ircColors.lightblue,
  ircColors.pink,
  ircColors.lightgray,
];

/**
 * Colorize text only if platform is IRC
 * @param text Text to colorize
 * @param platform Platform identifier
 * @returns Colorized text if platform is IRC, otherwise original text
 */
export function colorizeForPlatform(text: string, platform: string): string {
  // Only apply colorization for IRC platform
  if (platform === 'irc') {
    // Pick a random color from the available colors
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return randomColor(text);
  }

  // Return original text for non-IRC platforms
  return text;
}
