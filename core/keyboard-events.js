/**
 * Maps special characters to their keyboard code names.
 */
const SPECIAL_CHAR_CODES = {
  ' ': 'Space',
  '\n': 'Enter',
  '\r': 'Enter',
  '\t': 'Tab'
};

/**
 * Maps special characters to their key names.
 */
const SPECIAL_CHAR_KEYS = {
  '\n': 'Enter',
  '\r': 'Enter',
  '\t': 'Tab'
};

/**
 * Maps special characters to their char codes for keyCode/which.
 * Newline should use Enter's code (13), not literal newline (10).
 */
const SPECIAL_CHAR_KEYCODES = {
  '\n': 13,
  '\r': 13,
  '\t': 9
};

/**
 * Determines the keyboard code for a character.
 * @param {string} char - Single character
 * @returns {string} The keyboard code (e.g., 'KeyA', 'Digit5', 'Space')
 */
const getKeyCode = (char) => {
  // Special characters
  if (SPECIAL_CHAR_CODES[char]) {
    return SPECIAL_CHAR_CODES[char];
  }

  // Digits
  if (/[0-9]/.test(char)) {
    return `Digit${char}`;
  }

  // Letters
  if (/[a-zA-Z]/.test(char)) {
    return `Key${char.toUpperCase()}`;
  }

  // Common punctuation
  if (char === '.') return 'Period';
  if (char === ',') return 'Comma';
  if (char === '!') return 'Digit1'; // Shift+1
  if (char === '@') return 'Digit2'; // Shift+2
  if (char === '#') return 'Digit3'; // Shift+3
  if (char === '$') return 'Digit4'; // Shift+4
  if (char === '%') return 'Digit5'; // Shift+5

  // Fallback for other characters
  return `Key${char.toUpperCase()}`;
};

/**
 * Creates keyboard event options for a character.
 * These options can be passed to new KeyboardEvent().
 *
 * @param {string} char - Single character to create event options for
 * @returns {Object} Keyboard event init options
 */
export const createKeyboardEventOptions = (char) => {
  const charCode = SPECIAL_CHAR_KEYCODES[char] ?? char.charCodeAt(0);
  const key = SPECIAL_CHAR_KEYS[char] ?? char;

  return {
    key,
    code: getKeyCode(char),
    charCode,
    keyCode: charCode,
    which: charCode,
    bubbles: true
  };
};

/**
 * Creates a sequence of keyboard events (keydown, keypress, keyup) for a character.
 *
 * @param {string} char - Single character
 * @returns {KeyboardEvent[]} Array of [keydown, keypress, keyup] events
 */
export const createKeyEventSequence = (char) => {
  const options = createKeyboardEventOptions(char);

  return [
    new KeyboardEvent('keydown', options),
    new KeyboardEvent('keypress', options),
    new KeyboardEvent('keyup', options)
  ];
};
