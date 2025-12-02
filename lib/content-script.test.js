import { describe, test, beforeEach, afterEach, vi } from 'vitest';
import { assert } from '../test-utils/assert.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('content-script integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    // Load and execute the content script in the test environment
    const scriptContent = fs.readFileSync(
      path.join(__dirname, 'content-script.js'),
      'utf8'
    );
    eval(scriptContent);
  });

  afterEach(() => {
    vi.useRealTimers();
    delete window.__pasteAnyway;
  });

  test('exposes __pasteAnyway API', () => {
    assert({
      given: 'content script loaded',
      should: 'expose simulateTyping function',
      actual: typeof window.__pasteAnyway.simulateTyping,
      expected: 'function'
    });

    assert({
      given: 'content script loaded',
      should: 'expose pasteFromClipboard function',
      actual: typeof window.__pasteAnyway.pasteFromClipboard,
      expected: 'function'
    });

    assert({
      given: 'content script loaded',
      should: 'expose typeCharacter function',
      actual: typeof window.__pasteAnyway.typeCharacter,
      expected: 'function'
    });
  });
});

describe('simulateTyping with INPUT elements', () => {
  let input;

  beforeEach(() => {
    vi.useFakeTimers();

    // Load and execute the content script
    const scriptContent = fs.readFileSync(
      path.join(__dirname, 'content-script.js'),
      'utf8'
    );
    eval(scriptContent);

    // Create and focus an input element
    input = document.createElement('input');
    input.type = 'text';
    document.body.appendChild(input);
    input.focus();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.removeChild(input);
    delete window.__pasteAnyway;
  });

  test('types single character into input', () => {
    window.__pasteAnyway.simulateTyping('a');
    vi.advanceTimersByTime(10);

    assert({
      given: 'typing single character "a" into input',
      should: 'insert the character',
      actual: input.value,
      expected: 'a'
    });
  });

  test('types multiple characters into input', () => {
    window.__pasteAnyway.simulateTyping('hello');
    vi.advanceTimersByTime(50); // 5 chars * 10ms

    assert({
      given: 'typing "hello" into input',
      should: 'insert all characters',
      actual: input.value,
      expected: 'hello'
    });
  });

  test('dispatches input event for React compatibility', () => {
    const inputEvents = [];
    input.addEventListener('input', () => inputEvents.push('input'));

    window.__pasteAnyway.simulateTyping('ab');
    vi.advanceTimersByTime(20);

    assert({
      given: 'typing 2 characters',
      should: 'dispatch input event for each character',
      actual: inputEvents.length,
      expected: 2
    });
  });

  test('dispatches keyboard events in correct order', () => {
    const events = [];
    input.addEventListener('keydown', () => events.push('keydown'));
    input.addEventListener('keypress', () => events.push('keypress'));
    input.addEventListener('keyup', () => events.push('keyup'));

    window.__pasteAnyway.simulateTyping('x');
    vi.advanceTimersByTime(10);

    assert({
      given: 'typing single character',
      should: 'dispatch keydown, keypress, keyup in order',
      actual: events,
      expected: ['keydown', 'keypress', 'keyup']
    });
  });
});

describe('simulateTyping with TEXTAREA elements', () => {
  let textarea;

  beforeEach(() => {
    vi.useFakeTimers();

    const scriptContent = fs.readFileSync(
      path.join(__dirname, 'content-script.js'),
      'utf8'
    );
    eval(scriptContent);

    textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.focus();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.removeChild(textarea);
    delete window.__pasteAnyway;
  });

  test('types into textarea', () => {
    window.__pasteAnyway.simulateTyping('multi\nline');
    vi.advanceTimersByTime(100);

    assert({
      given: 'typing multiline text into textarea',
      should: 'insert text with newline',
      actual: textarea.value,
      expected: 'multi\nline'
    });
  });

  test('inserts at cursor position', () => {
    textarea.value = 'hello world';
    textarea.selectionStart = 5;
    textarea.selectionEnd = 5;

    window.__pasteAnyway.simulateTyping(',');
    vi.advanceTimersByTime(10);

    assert({
      given: 'cursor in middle of existing text',
      should: 'insert at cursor position',
      actual: textarea.value,
      expected: 'hello, world'
    });
  });
});

// NOTE: contentEditable tests are skipped in jsdom because it doesn't fully
// implement the Selection API. These work correctly in real browsers.
// See: https://github.com/jsdom/jsdom/issues/317
describe.skip('simulateTyping with contentEditable elements (requires real browser)', () => {
  let div;

  beforeEach(() => {
    vi.useFakeTimers();

    const scriptContent = fs.readFileSync(
      path.join(__dirname, 'content-script.js'),
      'utf8'
    );
    eval(scriptContent);

    div = document.createElement('div');
    div.contentEditable = 'true';
    document.body.appendChild(div);
    div.focus();

    // Set up initial selection/range
    const range = document.createRange();
    range.selectNodeContents(div);
    range.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.removeChild(div);
    delete window.__pasteAnyway;
  });

  test('types into contentEditable', () => {
    window.__pasteAnyway.simulateTyping('test');
    vi.advanceTimersByTime(40);

    assert({
      given: 'typing into contentEditable div',
      should: 'insert text content',
      actual: div.textContent,
      expected: 'test'
    });
  });

  test('dispatches input event for contentEditable', () => {
    const inputEvents = [];
    div.addEventListener('input', () => inputEvents.push('input'));

    window.__pasteAnyway.simulateTyping('ab');
    vi.advanceTimersByTime(20);

    assert({
      given: 'typing into contentEditable',
      should: 'dispatch input events',
      actual: inputEvents.length,
      expected: 2
    });
  });
});

describe('edge cases', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    const scriptContent = fs.readFileSync(
      path.join(__dirname, 'content-script.js'),
      'utf8'
    );
    eval(scriptContent);
  });

  afterEach(() => {
    vi.useRealTimers();
    delete window.__pasteAnyway;
  });

  test('handles empty string', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    // Should not throw
    window.__pasteAnyway.simulateTyping('');
    vi.advanceTimersByTime(10);

    assert({
      given: 'empty string input',
      should: 'not throw and leave input empty',
      actual: input.value,
      expected: ''
    });

    document.body.removeChild(input);
  });

  test('handles special characters', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    window.__pasteAnyway.simulateTyping('a\tb');
    vi.advanceTimersByTime(30);

    assert({
      given: 'text with tab character',
      should: 'insert tab',
      actual: input.value,
      expected: 'a\tb'
    });

    document.body.removeChild(input);
  });
});
