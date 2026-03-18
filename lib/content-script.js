/**
 * PasteAnyway Content Script
 *
 * This script is injected into pages to simulate typing and bypass paste restrictions.
 * It's self-contained (IIFE) to avoid polluting the global scope.
 */
(function() {
  'use strict';

  // === KEYBOARD EVENT HELPERS ===

  const SPECIAL_CHAR_CODES = {
    ' ': 'Space',
    '\n': 'Enter',
    '\r': 'Enter',
    '\t': 'Tab'
  };

  const SPECIAL_CHAR_KEYS = {
    '\n': 'Enter',
    '\r': 'Enter',
    '\t': 'Tab'
  };

  const SPECIAL_CHAR_KEYCODES = {
    '\n': 13,
    '\r': 13,
    '\t': 9
  };

  const getKeyCode = (char) => {
    if (SPECIAL_CHAR_CODES[char]) return SPECIAL_CHAR_CODES[char];
    if (/[0-9]/.test(char)) return `Digit${char}`;
    if (/[a-zA-Z]/.test(char)) return `Key${char.toUpperCase()}`;
    if (char === '.') return 'Period';
    if (char === ',') return 'Comma';
    return 'Unidentified';
  };

  const createKeyboardEventOptions = (char) => {
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

  // === DOM HELPERS ===

  const isInputElement = (element) =>
    element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA');

  const isContentEditable = (element) =>
    element && element.isContentEditable;

  /**
   * Try to insert text using execCommand first (triggers trusted events).
   * Returns true if successful, false if we need to fall back.
   */
  const tryExecCommand = (char) => {
    try {
      // execCommand('insertText') triggers proper beforeinput/input events
      // and is treated as more "trusted" by some frameworks
      const result = document.execCommand('insertText', false, char);
      return result;
    } catch (e) {
      return false;
    }
  };

  const insertCharIntoInput = (element, char) => {
    let start, end;
    try {
      start = element.selectionStart ?? 0;
      end = element.selectionEnd ?? 0;
    } catch {
      // Some input types (number, date, etc.) don't support selection
      element.value = (element.value || '') + char;
      return;
    }
    const value = element.value || '';
    element.value = value.substring(0, start) + char + value.substring(end);

    try {
      element.selectionStart = element.selectionEnd = start + char.length;
    } catch {
      // Ignore if setting selection fails too
    }
  };

  const insertCharIntoContentEditable = (char) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const textNode = document.createTextNode(char);

    range.deleteContents();
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  /**
   * Dispatches a proper InputEvent with inputType for framework compatibility.
   */
  const dispatchInputEvent = (element, char) => {
    // Try InputEvent first (modern browsers, better framework support)
    try {
      element.dispatchEvent(new InputEvent('input', {
        bubbles: true,
        cancelable: false,
        inputType: 'insertText',
        data: char
      }));
    } catch (e) {
      // Fallback to generic Event for older browsers
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  // === EVENT INTERCEPTOR HELPERS ===

  /**
   * Check if the event interceptor is available (injected at document_start)
   */
  const hasInterceptor = () => {
    return window.__pasteAnywayInterceptor && window.__pasteAnywayInterceptor.isActive;
  };

  /**
   * Disable paste-blocking handlers on an element using the interceptor.
   * Returns the number of handlers disabled, or 0 if interceptor not available.
   */
  const disablePasteBlockers = (element) => {
    if (!hasInterceptor()) {
      console.log('[PasteAnyway] Event interceptor not available (page may have loaded before extension)');
      return 0;
    }

    const count = window.__pasteAnywayInterceptor.disableHandlersForElement(element);
    if (count > 0) {
      console.log(`[PasteAnyway] Disabled ${count} paste-blocking handler(s)`);
    }
    return count;
  };

  /**
   * Get info about tracked handlers (for debugging)
   */
  const getHandlerInfo = () => {
    if (!hasInterceptor()) {
      return { available: false };
    }
    return {
      available: true,
      ...window.__pasteAnywayInterceptor.getTrackedHandlers()
    };
  };

  // === TYPING SIMULATION ===

  let pendingTimeouts = [];

  /**
   * Types a single character into the active element.
   * Uses execCommand when possible for better trust level, falls back to manual insertion.
   * Dispatches keyboard events and proper InputEvent for framework compatibility.
   */
  const typeCharacter = (char) => {
    const element = document.activeElement;
    if (!element) return;

    const options = createKeyboardEventOptions(char);

    // Dispatch keyboard events
    element.dispatchEvent(new KeyboardEvent('keydown', options));
    element.dispatchEvent(new KeyboardEvent('keypress', options));

    // Try execCommand first - it triggers trusted events and works better with some sites
    const execCommandWorked = tryExecCommand(char);

    if (!execCommandWorked) {
      // Fallback to manual insertion
      if (isInputElement(element)) {
        insertCharIntoInput(element, char);
        dispatchInputEvent(element, char);
      } else if (isContentEditable(element)) {
        insertCharIntoContentEditable(char);
        dispatchInputEvent(element, char);
      }
    }

    // Dispatch keyup event
    element.dispatchEvent(new KeyboardEvent('keyup', options));
  };

  /**
   * Simulates typing text character by character with a delay.
   * Automatically disables paste-blocking handlers before typing.
   *
   * @param {string} text - Text to type
   * @param {number} delay - Milliseconds between characters (default: 10)
   */
  const simulateTyping = (text, delay = 10) => {
    // Cancel any in-progress typing
    pendingTimeouts.forEach(id => clearTimeout(id));
    pendingTimeouts = [];

    if (!text) return;

    const element = document.activeElement;
    if (element) {
      // Disable any paste-blocking handlers on this element before typing
      disablePasteBlockers(element);
    }

    // Normalize CRLF and bare CR to LF to avoid double newlines from Windows clipboard
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Use spread to correctly iterate over Unicode code points (emoji / surrogate pairs)
    const chars = [...text];
    for (let i = 0; i < chars.length; i++) {
      const id = setTimeout(() => {
        typeCharacter(chars[i]);
      }, i * delay);
      pendingTimeouts.push(id);
    }

    console.log(`[PasteAnyway] Typing ${chars.length} characters`);
  };

  /**
   * Reads from clipboard and simulates typing the content.
   * Returns a promise that resolves with the number of characters typed.
   */
  const pasteFromClipboard = () => {
    return navigator.clipboard.readText()
      .then(text => {
        if (text) {
          simulateTyping(text);
          return text.length;
        }
        return 0;
      })
      .catch(error => {
        console.error('[PasteAnyway] Clipboard access error:', error);
        alert('Unable to access clipboard. Make sure you\'ve granted clipboard permission.');
        return 0;
      });
  };

  // === EXPOSE API ===

  // Expose functions for executeScript access
  window.__pasteAnyway = {
    simulateTyping,
    pasteFromClipboard,
    typeCharacter,
    disablePasteBlockers,
    getHandlerInfo
  };

  console.log('[PasteAnyway] Content script loaded (with execCommand and interceptor support)');
})();
