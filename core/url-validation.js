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

/**
 * Checks if a URL is restricted (browser internal pages or extension stores).
 * Extensions cannot inject scripts into these pages.
 *
 * @param {string} url - The URL to check
 * @returns {boolean} True if the URL is restricted
 */
export const isRestrictedUrl = (url = '') => {
  if (!url) return false;
  return RESTRICTED_PATTERNS.some(pattern => url.includes(pattern));
};
