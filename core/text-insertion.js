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
 * @returns {number} New cursor position (always start + 1)
 */
export const calculateNewCursorPosition = (start) => start + 1;
