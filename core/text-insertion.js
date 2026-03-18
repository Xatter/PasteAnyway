/**
 * Inserts a character into a string at a given position, optionally replacing a selection.
 * This is a pure function that handles the string manipulation for input fields.
 *
 * @param {Object} params
 * @param {string} params.value - The current input value
 * @param {number} params.start - Selection start position
 * @param {number} params.end - Selection end position
 * @param {string} params.char - Character to insert
 * @returns {string} New value with character inserted
 */
export const insertCharAtPosition = ({ value, start, end, char }) =>
  value.substring(0, start) + char + value.substring(end);

/**
 * Calculates the new cursor position after inserting a character.
 *
 * @param {number} start - Current cursor start position
 * @param {string} [char] - The character that was inserted (used to determine UTF-16 length)
 * @returns {number} New cursor position (start + char's UTF-16 length, or start + 1 if no char)
 */
export const calculateNewCursorPosition = (start, char) => start + (char ? char.length : 1);
