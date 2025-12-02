import { expect } from 'vitest';

/**
 * Riteway-style assertion helper that answers the 5 questions:
 * 1. What is the unit under test? (describe block)
 * 2. What is the expected behavior? (given + should)
 * 3. What is the actual output? (actual)
 * 4. What is the expected output? (expected)
 * 5. How can we find the bug? (clear given/should makes this obvious)
 */
export const assert = ({ given, should, actual, expected }) => {
  const message = `Given ${given}, should ${should}`;
  expect(actual, message).toEqual(expected);
};
