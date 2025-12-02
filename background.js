/**
 * PasteAnyway Background Script
 *
 * Handles context menu creation and script injection.
 */

// === CONSTANTS ===

const BADGE_ERROR_COLOR = '#F44336';
const BADGE_CLEAR_DELAY = 3000;

/**
 * Browser-specific restricted URL patterns.
 * Extensions cannot run on these pages for security reasons.
 */
const RESTRICTED_PATTERNS = [
  // Chrome
  'chrome://',
  'chrome-extension://',
  'chrome.google.com/webstore',
  // Firefox
  'about:',
  'moz-extension://',
  'addons.mozilla.org',
  // Edge
  'edge://',
  'microsoftedge.microsoft.com/addons'
];

// === HELPER FUNCTIONS ===

/**
 * Checks if a URL is restricted (browser internal pages or extension stores).
 */
const isRestrictedUrl = (url = '') => {
  if (!url) return false;
  return RESTRICTED_PATTERNS.some(pattern => url.includes(pattern));
};

/**
 * Shows an error badge on the extension icon.
 */
const showErrorBadge = () => {
  chrome.action.setBadgeText({ text: '!' });
  chrome.action.setBadgeBackgroundColor({ color: BADGE_ERROR_COLOR });

  setTimeout(() => {
    chrome.action.setBadgeText({ text: '' });
  }, BADGE_CLEAR_DELAY);
};

/**
 * Injects the content script and triggers paste from clipboard.
 */
const injectAndPaste = async (tabId) => {
  // First inject the content script
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ['lib/content-script.js']
  });

  // Then call the pasteFromClipboard function
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => window.__pasteAnyway.pasteFromClipboard()
  });
};

// === EVENT HANDLERS ===

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'paste-anyway',
    title: 'Paste Anyway',
    contexts: ['editable']
  });
  console.log('[PasteAnyway] Context menu created');
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'paste-anyway') return;

  console.log('[PasteAnyway] Context menu clicked');

  // Check for restricted pages
  if (isRestrictedUrl(tab.url)) {
    showErrorBadge();
    console.log('[PasteAnyway] Cannot run on restricted page:', tab.url);
    return;
  }

  // Inject and execute
  injectAndPaste(tab.id).catch(error => {
    console.error('[PasteAnyway] Error:', error);
  });
});
