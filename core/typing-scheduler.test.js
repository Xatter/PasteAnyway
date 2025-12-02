import { describe, test } from 'vitest';
import { assert } from '../test-utils/assert.js';
import { createTypingSchedule } from './typing-scheduler.js';

describe('createTypingSchedule', () => {
  test('default delay', () => {
    assert({
      given: 'a short string with default delay',
      should: 'create schedule with 10ms incremental delays',
      actual: createTypingSchedule('ab'),
      expected: [
        { char: 'a', delay: 0 },
        { char: 'b', delay: 10 }
      ]
    });

    assert({
      given: 'a 3-character string',
      should: 'create schedule with correct delays',
      actual: createTypingSchedule('xyz'),
      expected: [
        { char: 'x', delay: 0 },
        { char: 'y', delay: 10 },
        { char: 'z', delay: 20 }
      ]
    });
  });

  test('custom delay', () => {
    assert({
      given: 'custom delay value of 50ms',
      should: 'apply custom delay multiplier',
      actual: createTypingSchedule('abc', 50),
      expected: [
        { char: 'a', delay: 0 },
        { char: 'b', delay: 50 },
        { char: 'c', delay: 100 }
      ]
    });

    assert({
      given: 'zero delay',
      should: 'have all delays as 0',
      actual: createTypingSchedule('ab', 0),
      expected: [
        { char: 'a', delay: 0 },
        { char: 'b', delay: 0 }
      ]
    });
  });

  test('edge cases', () => {
    assert({
      given: 'empty string',
      should: 'return empty schedule',
      actual: createTypingSchedule(''),
      expected: []
    });

    assert({
      given: 'single character',
      should: 'return single entry with delay 0',
      actual: createTypingSchedule('X'),
      expected: [{ char: 'X', delay: 0 }]
    });
  });

  test('special characters', () => {
    assert({
      given: 'string with spaces and newlines',
      should: 'include special characters in schedule',
      actual: createTypingSchedule('a b'),
      expected: [
        { char: 'a', delay: 0 },
        { char: ' ', delay: 10 },
        { char: 'b', delay: 20 }
      ]
    });
  });
});
