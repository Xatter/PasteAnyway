/**
 * Default delay between characters in milliseconds.
 */
const DEFAULT_DELAY = 10;

/**
 * Creates a schedule for typing characters with delays.
 * Each character gets an incrementing delay based on its position.
 *
 * @param {string} text - The text to create a schedule for
 * @param {number} delay - Milliseconds between each character (default: 10)
 * @returns {Array<{char: string, delay: number}>} Schedule of characters with delays
 */
export const createTypingSchedule = (text, delay = DEFAULT_DELAY) =>
  text.split('').map((char, i) => ({
    char,
    delay: i * delay
  }));
