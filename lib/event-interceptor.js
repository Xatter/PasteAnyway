/**
 * Event Interceptor for PasteAnyway
 *
 * This script runs in the page's MAIN world at document_start,
 * before other page scripts execute. It monkey-patches addEventListener
 * to track clipboard event handlers so we can disable them later.
 */
(function() {
  'use strict';

  // Storage for tracked handlers
  const trackedHandlers = {
    paste: [],
    copy: [],
    cut: []
  };

  const TRACKED_EVENTS = Object.keys(trackedHandlers);

  // Store original methods
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const originalRemoveEventListener = EventTarget.prototype.removeEventListener;

  /**
   * Wrapped addEventListener that tracks clipboard event handlers
   */
  EventTarget.prototype.addEventListener = function(type, handler, options) {
    if (TRACKED_EVENTS.includes(type) && handler) {
      trackedHandlers[type].push({
        element: this,
        handler: handler,
        options: options
      });
    }
    return originalAddEventListener.call(this, type, handler, options);
  };

  /**
   * Wrapped removeEventListener that updates our tracking
   */
  EventTarget.prototype.removeEventListener = function(type, handler, options) {
    if (TRACKED_EVENTS.includes(type)) {
      const handlers = trackedHandlers[type];
      const index = handlers.findIndex(h => h.element === this && h.handler === handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
    return originalRemoveEventListener.call(this, type, handler, options);
  };

  /**
   * Disable all tracked clipboard handlers for a specific element
   * Returns the count of disabled handlers
   */
  const disableHandlersForElement = (element) => {
    let count = 0;

    TRACKED_EVENTS.forEach(eventType => {
      const handlers = trackedHandlers[eventType];

      // Find handlers for this element or its ancestors (for delegated handlers)
      for (let i = handlers.length - 1; i >= 0; i--) {
        const entry = handlers[i];
        if (entry.element === element ||
            entry.element === document ||
            entry.element === window ||
            (entry.element && entry.element.contains && entry.element.contains(element))) {

          // Remove the handler
          originalRemoveEventListener.call(entry.element, eventType, entry.handler, entry.options);
          handlers.splice(i, 1);
          count++;
        }
      }
    });

    // Also clear inline handlers
    if (element.onpaste) { element.onpaste = null; count++; }
    if (element.oncopy) { element.oncopy = null; count++; }
    if (element.oncut) { element.oncut = null; count++; }

    return count;
  };

  /**
   * Get info about tracked handlers (for debugging)
   */
  const getTrackedHandlers = () => {
    return {
      paste: trackedHandlers.paste.length,
      copy: trackedHandlers.copy.length,
      cut: trackedHandlers.cut.length,
      total: trackedHandlers.paste.length + trackedHandlers.copy.length + trackedHandlers.cut.length
    };
  };

  /**
   * Disable ALL tracked clipboard handlers globally
   */
  const disableAllHandlers = () => {
    let count = 0;

    TRACKED_EVENTS.forEach(eventType => {
      const handlers = trackedHandlers[eventType];

      while (handlers.length > 0) {
        const entry = handlers.pop();
        originalRemoveEventListener.call(entry.element, eventType, entry.handler, entry.options);
        count++;
      }
    });

    return count;
  };

  // Expose API for content script to call
  window.__pasteAnywayInterceptor = {
    disableHandlersForElement,
    disableAllHandlers,
    getTrackedHandlers,
    isActive: true
  };

  console.log('[PasteAnyway] Event interceptor installed');
})();
