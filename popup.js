/**
 * PasteAnyway Popup Script
 *
 * Handles the popup UI for manually entering text to paste.
 */

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    pasteText: document.getElementById('pasteText'),
    sendButton: document.getElementById('sendButton'),
    status: document.getElementById('status')
  };

  // Auto-focus the textarea when popup opens
  elements.pasteText.focus();

  /**
   * Browser-specific restricted URL patterns.
   * Extensions cannot run on these pages for security reasons.
   */
  const RESTRICTED_PATTERNS = [
    'chrome://', 'chrome-extension://', 'chrome.google.com/webstore',
    'about:', 'moz-extension://', 'addons.mozilla.org',
    'edge://', 'microsoftedge.microsoft.com/addons'
  ];

  const isRestrictedUrl = (url = '') =>
    url ? RESTRICTED_PATTERNS.some(p => url.includes(p)) : false;

  /**
   * Updates the status message.
   */
  const updateStatus = (message) => {
    elements.status.textContent = message;
  };

  /**
   * Injects the content script and simulates typing the text.
   */
  const sendTextToPage = async (text) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (isRestrictedUrl(tab.url)) {
      throw new Error('Cannot paste on browser internal pages.');
    }

    // First inject the content script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['lib/content-script.js']
    });

    // Then call simulateTyping with the text
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (textToType) => window.__pasteAnyway.simulateTyping(textToType),
      args: [text]
    });
  };

  // Handle send button click
  elements.sendButton.addEventListener('click', async () => {
    const text = elements.pasteText.value;

    if (!text) {
      updateStatus('Please enter some text first.');
      return;
    }

    updateStatus('Sending text...');

    try {
      await sendTextToPage(text);
      updateStatus('Text sent successfully!');
    } catch (error) {
      updateStatus('Error: ' + error.message);
    }
  });
});
