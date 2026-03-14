import chalk from 'chalk';

// Available chalk colors for random selection
const colors = [
  chalk.red,
  chalk.green,
  chalk.yellow,
  chalk.blue,
  chalk.magenta,
  chalk.cyan,
  chalk.white,
  chalk.gray,
  chalk.redBright,
  chalk.greenBright,
  chalk.yellowBright,
  chalk.blueBright,
  chalk.magentaBright,
  chalk.cyanBright,
  chalk.whiteBright,
];

/**
 * Colorize text only if platform is IRC
 * @param text Text to colorize
 * @param platform Platform identifier
 * @returns Colorized text if platform is IRC, otherwise original text
 */
export function colorizeForPlatform(text: string, platform: string): string {
  // Only apply colorization for IRC platform
  if (platform.toLowerCase() === 'irc') {
    // Pick a random color from the available colors
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return randomColor(text);
  }
  
  // Return original text for non-IRC platforms
  return text;
}