/**
 * Injector for Event Interceptor
 *
 * This content script runs at document_start and injects the event
 * interceptor into the page's main world by creating a script element.
 * This ensures the interceptor runs before any page scripts.
 */
(function() {
  'use strict';

  // Get the URL of the interceptor script
  const scriptUrl = chrome.runtime.getURL('lib/event-interceptor.js');

  // Create and inject script element
  const script = document.createElement('script');
  script.src = scriptUrl;
  script.onload = function() {
    this.remove(); // Clean up after execution
  };

  // Inject as early as possible
  (document.head || document.documentElement).appendChild(script);
})();
