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

  test('dispatches InputEvent with correct inputType and data', () => {
    const events = [];
    input.addEventListener('input', (e) => events.push({
      type: e.constructor.name,
      inputType: e.inputType,
      data: e.data
    }));

    window.__pasteAnyway.simulateTyping('a');
    vi.advanceTimersByTime(10);

    assert({
      given: 'typing a character',
      should: 'dispatch InputEvent with insertText type',
      actual: events[0].inputType,
      expected: 'insertText'
    });

    assert({
      given: 'typing character "a"',
      should: 'include the character as data',
      actual: events[0].data,
      expected: 'a'
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

describe('concurrent simulateTyping calls', () => {
  let input;

  beforeEach(() => {
    vi.useFakeTimers();
    const scriptContent = fs.readFileSync(path.join(__dirname, 'content-script.js'), 'utf8');
    eval(scriptContent);

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

  test('second call cancels first', () => {
    window.__pasteAnyway.simulateTyping('abc');
    // Immediately call again before first completes
    window.__pasteAnyway.simulateTyping('xy');
    vi.advanceTimersByTime(100);

    assert({
      given: 'two rapid simulateTyping calls',
      should: 'only contain text from the second call',
      actual: input.value,
      expected: 'xy'
    });
  });

  test('second call after partial completion of first', () => {
    window.__pasteAnyway.simulateTyping('abcd');
    vi.advanceTimersByTime(15); // Let first 2 chars through (0ms and 10ms)

    window.__pasteAnyway.simulateTyping('XY');
    vi.advanceTimersByTime(100); // Let everything complete

    assert({
      given: 'second call after first partially completed',
      should: 'have first two chars from first call plus second call',
      actual: input.value,
      expected: 'abXY'
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

  test('handles non-ASCII characters', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    window.__pasteAnyway.simulateTyping('café');
    vi.advanceTimersByTime(40);

    assert({
      given: 'text with accented characters',
      should: 'insert all characters correctly',
      actual: input.value,
      expected: 'café'
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

  test('handles single emoji character', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    window.__pasteAnyway.simulateTyping('😀');
    vi.advanceTimersByTime(10);

    assert({
      given: 'a single emoji',
      should: 'insert the full emoji into the input',
      actual: input.value,
      expected: '😀'
    });

    document.body.removeChild(input);
  });

  test('handles emoji mixed with ASCII characters', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    window.__pasteAnyway.simulateTyping('a😀b');
    vi.advanceTimersByTime(30);

    assert({
      given: 'text with emoji between ASCII characters',
      should: 'insert all characters correctly',
      actual: input.value,
      expected: 'a😀b'
    });

    document.body.removeChild(input);
  });

  test('normalizes CRLF line endings to LF in textarea', () => {
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.focus();

    window.__pasteAnyway.simulateTyping('line1\r\nline2');
    vi.advanceTimersByTime(120);

    assert({
      given: 'text with CRLF line endings from Windows clipboard',
      should: 'normalize to LF and produce a single newline',
      actual: textarea.value,
      expected: 'line1\nline2'
    });

    document.body.removeChild(textarea);
  });

  test('normalizes bare CR to LF in textarea', () => {
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.focus();

    window.__pasteAnyway.simulateTyping('a\rb');
    vi.advanceTimersByTime(30);

    assert({
      given: 'text with bare CR line ending',
      should: 'normalize to LF',
      actual: textarea.value,
      expected: 'a\nb'
    });

    document.body.removeChild(textarea);
  });
});

describe('simulateTyping with non-text input types', () => {
  let input;

  beforeEach(() => {
    vi.useFakeTimers();

    const scriptContent = fs.readFileSync(
      path.join(__dirname, 'content-script.js'),
      'utf8'
    );
    eval(scriptContent);

    input = document.createElement('input');
    input.type = 'text'; // jsdom doesn't enforce real number behavior
    document.body.appendChild(input);
    input.focus();

    // Simulate the browser behavior for type="number": selectionStart throws
    Object.defineProperty(input, 'selectionStart', {
      get() { throw new DOMException('not supported'); },
      configurable: true
    });
    Object.defineProperty(input, 'selectionEnd', {
      get() { throw new DOMException('not supported'); },
      configurable: true
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.removeChild(input);
    delete window.__pasteAnyway;
  });

  test('does not crash when selectionStart throws', () => {
    window.__pasteAnyway.simulateTyping('5');
    vi.advanceTimersByTime(10);

    assert({
      given: 'an input where selectionStart throws (e.g. type="number")',
      should: 'not crash and append the character to the value',
      actual: input.value,
      expected: '5'
    });
  });

  test('appends multiple characters to end of value', () => {
    window.__pasteAnyway.simulateTyping('42');
    vi.advanceTimersByTime(20);

    assert({
      given: 'an input where selectionStart throws and multiple chars typed',
      should: 'append all characters to the value',
      actual: input.value,
      expected: '42'
    });
  });

  test('appends to existing value', () => {
    input.value = '10';

    window.__pasteAnyway.simulateTyping('0');
    vi.advanceTimersByTime(10);

    assert({
      given: 'an input with existing value where selectionStart throws',
      should: 'append the character to the existing value',
      actual: input.value,
      expected: '100'
    });
  });

  test('dispatches input event even when selection is unsupported', () => {
    const inputEvents = [];
    input.addEventListener('input', () => inputEvents.push('input'));

    window.__pasteAnyway.simulateTyping('5');
    vi.advanceTimersByTime(10);

    assert({
      given: 'an input where selectionStart throws',
      should: 'still dispatch input events for framework compatibility',
      actual: inputEvents.length,
      expected: 1
    });
  });
});
