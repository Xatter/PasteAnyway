import { describe, test } from 'vitest';
import { assert } from '../test-utils/assert.js';
import { createKeyboardEventOptions, createKeyEventSequence } from './keyboard-events.js';

describe('createKeyboardEventOptions', () => {
  test('lowercase letters', () => {
    assert({
      given: 'a lowercase letter "a"',
      should: 'create correct event options',
      actual: createKeyboardEventOptions('a'),
      expected: {
        key: 'a',
        code: 'KeyA',
        charCode: 97,
        keyCode: 97,
        which: 97,
        bubbles: true
      }
    });

    assert({
      given: 'a lowercase letter "z"',
      should: 'create correct event options',
      actual: createKeyboardEventOptions('z'),
      expected: {
        key: 'z',
        code: 'KeyZ',
        charCode: 122,
        keyCode: 122,
        which: 122,
        bubbles: true
      }
    });
  });

  test('uppercase letters', () => {
    assert({
      given: 'an uppercase letter "A"',
      should: 'create correct event options with uppercase key',
      actual: createKeyboardEventOptions('A'),
      expected: {
        key: 'A',
        code: 'KeyA',
        charCode: 65,
        keyCode: 65,
        which: 65,
        bubbles: true
      }
    });
  });

  test('numeric characters', () => {
    assert({
      given: 'a digit "5"',
      should: 'create event options with Digit code',
      actual: createKeyboardEventOptions('5'),
      expected: {
        key: '5',
        code: 'Digit5',
        charCode: 53,
        keyCode: 53,
        which: 53,
        bubbles: true
      }
    });

    assert({
      given: 'a digit "0"',
      should: 'create event options with Digit code',
      actual: createKeyboardEventOptions('0'),
      expected: {
        key: '0',
        code: 'Digit0',
        charCode: 48,
        keyCode: 48,
        which: 48,
        bubbles: true
      }
    });
  });

  test('special characters', () => {
    assert({
      given: 'a space character',
      should: 'create event options with Space code',
      actual: createKeyboardEventOptions(' '),
      expected: {
        key: ' ',
        code: 'Space',
        charCode: 32,
        keyCode: 32,
        which: 32,
        bubbles: true
      }
    });

    assert({
      given: 'a newline character',
      should: 'create event options with Enter code',
      actual: createKeyboardEventOptions('\n'),
      expected: {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
        keyCode: 13,
        which: 13,
        bubbles: true
      }
    });

    assert({
      given: 'a tab character',
      should: 'create event options with Tab code',
      actual: createKeyboardEventOptions('\t'),
      expected: {
        key: 'Tab',
        code: 'Tab',
        charCode: 9,
        keyCode: 9,
        which: 9,
        bubbles: true
      }
    });
  });

  test('punctuation', () => {
    assert({
      given: 'an exclamation mark',
      should: 'create event options',
      actual: createKeyboardEventOptions('!'),
      expected: {
        key: '!',
        code: 'Digit1',
        charCode: 33,
        keyCode: 33,
        which: 33,
        bubbles: true
      }
    });

    assert({
      given: 'a period',
      should: 'create event options',
      actual: createKeyboardEventOptions('.'),
      expected: {
        key: '.',
        code: 'Period',
        charCode: 46,
        keyCode: 46,
        which: 46,
        bubbles: true
      }
    });
  });
});

describe('createKeyEventSequence', () => {
  test('returns three events in correct order', () => {
    const sequence = createKeyEventSequence('a');

    assert({
      given: 'a character',
      should: 'return array of 3 events',
      actual: sequence.length,
      expected: 3
    });

    assert({
      given: 'a character',
      should: 'have keydown as first event type',
      actual: sequence[0].type,
      expected: 'keydown'
    });

    assert({
      given: 'a character',
      should: 'have keypress as second event type',
      actual: sequence[1].type,
      expected: 'keypress'
    });

    assert({
      given: 'a character',
      should: 'have keyup as third event type',
      actual: sequence[2].type,
      expected: 'keyup'
    });
  });

  test('all events have correct key', () => {
    const sequence = createKeyEventSequence('x');

    assert({
      given: 'a character "x"',
      should: 'have correct key on all events',
      actual: sequence.every(e => e.key === 'x'),
      expected: true
    });
  });
});
