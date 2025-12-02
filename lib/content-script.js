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
    return `Key${char.toUpperCase()}`;
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

  const insertCharIntoInput = (element, char) => {
    const start = element.selectionStart ?? 0;
    const end = element.selectionEnd ?? 0;
    const value = element.value || '';

    element.value = value.substring(0, start) + char + value.substring(end);
    element.selectionStart = element.selectionEnd = start + 1;
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

  // === TYPING SIMULATION ===

  /**
   * Types a single character into the active element.
   * Dispatches keyboard events and the INPUT event for React compatibility.
   */
  const typeCharacter = (char) => {
    const element = document.activeElement;
    if (!element) return;

    const options = createKeyboardEventOptions(char);

    // Dispatch keyboard events
    element.dispatchEvent(new KeyboardEvent('keydown', options));
    element.dispatchEvent(new KeyboardEvent('keypress', options));

    // Insert the character based on element type
    if (isInputElement(element)) {
      insertCharIntoInput(element, char);
      // CRITICAL: Dispatch input event for React/Vue/Angular compatibility
      element.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (isContentEditable(element)) {
      insertCharIntoContentEditable(char);
      // CRITICAL: Dispatch input event for React/Vue/Angular compatibility
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Dispatch keyup event
    element.dispatchEvent(new KeyboardEvent('keyup', options));
  };

  /**
   * Simulates typing text character by character with a delay.
   *
   * @param {string} text - Text to type
   * @param {number} delay - Milliseconds between characters (default: 10)
   */
  const simulateTyping = (text, delay = 10) => {
    if (!text) return;

    for (let i = 0; i < text.length; i++) {
      setTimeout(() => {
        typeCharacter(text[i]);
      }, i * delay);
    }

    console.log(`[PasteAnyway] Typing ${text.length} characters`);
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
    typeCharacter
  };

  console.log('[PasteAnyway] Content script loaded');
})();
