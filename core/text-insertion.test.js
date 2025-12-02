import { describe, test } from 'vitest';
import { assert } from '../test-utils/assert.js';
import { insertCharAtPosition, calculateNewCursorPosition } from './text-insertion.js';

describe('insertCharAtPosition', () => {
  test('inserting into empty string', () => {
    assert({
      given: 'an empty string and cursor at position 0',
      should: 'insert character at start',
      actual: insertCharAtPosition({ value: '', start: 0, end: 0, char: 'a' }),
      expected: 'a'
    });
  });

  test('inserting at beginning', () => {
    assert({
      given: 'existing text and cursor at position 0',
      should: 'insert character at beginning',
      actual: insertCharAtPosition({ value: 'hello', start: 0, end: 0, char: 'X' }),
      expected: 'Xhello'
    });
  });

  test('inserting in middle', () => {
    assert({
      given: 'cursor in middle of text',
      should: 'insert character at cursor position',
      actual: insertCharAtPosition({ value: 'hello world', start: 5, end: 5, char: ',' }),
      expected: 'hello, world'
    });
  });

  test('inserting at end', () => {
    assert({
      given: 'cursor at end of text',
      should: 'append character',
      actual: insertCharAtPosition({ value: 'hello', start: 5, end: 5, char: '!' }),
      expected: 'hello!'
    });
  });

  test('replacing selection', () => {
    assert({
      given: 'text selection (start !== end)',
      should: 'replace selection with character',
      actual: insertCharAtPosition({ value: 'hello world', start: 0, end: 5, char: 'X' }),
      expected: 'X world'
    });

    assert({
      given: 'entire text selected',
      should: 'replace all text with character',
      actual: insertCharAtPosition({ value: 'hello', start: 0, end: 5, char: 'Y' }),
      expected: 'Y'
    });
  });

  test('special characters', () => {
    assert({
      given: 'a newline character',
      should: 'insert newline',
      actual: insertCharAtPosition({ value: 'line1', start: 5, end: 5, char: '\n' }),
      expected: 'line1\n'
    });

    assert({
      given: 'a tab character',
      should: 'insert tab',
      actual: insertCharAtPosition({ value: 'a', start: 1, end: 1, char: '\t' }),
      expected: 'a\t'
    });
  });
});

describe('calculateNewCursorPosition', () => {
  test('cursor advancement', () => {
    assert({
      given: 'current cursor at position 0',
      should: 'return position 1',
      actual: calculateNewCursorPosition(0),
      expected: 1
    });

    assert({
      given: 'current cursor at position 10',
      should: 'return position 11',
      actual: calculateNewCursorPosition(10),
      expected: 11
    });

    assert({
      given: 'current cursor at position 100',
      should: 'return position 101',
      actual: calculateNewCursorPosition(100),
      expected: 101
    });
  });
});
