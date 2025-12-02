import { describe, test } from 'vitest';
import { assert } from '../test-utils/assert.js';
import { isRestrictedUrl } from './url-validation.js';

describe('isRestrictedUrl', () => {
  test('Chrome restricted URLs', () => {
    assert({
      given: 'a chrome:// protocol URL',
      should: 'return true (restricted)',
      actual: isRestrictedUrl('chrome://settings'),
      expected: true
    });

    assert({
      given: 'Chrome Web Store URL',
      should: 'return true (restricted)',
      actual: isRestrictedUrl('https://chrome.google.com/webstore/detail/xyz'),
      expected: true
    });

    assert({
      given: 'chrome-extension:// URL',
      should: 'return true (restricted)',
      actual: isRestrictedUrl('chrome-extension://abc123/popup.html'),
      expected: true
    });
  });

  test('Firefox restricted URLs', () => {
    assert({
      given: 'an about: protocol URL',
      should: 'return true (restricted)',
      actual: isRestrictedUrl('about:config'),
      expected: true
    });

    assert({
      given: 'a moz-extension:// URL',
      should: 'return true (restricted)',
      actual: isRestrictedUrl('moz-extension://abc123/popup.html'),
      expected: true
    });

    assert({
      given: 'Firefox Add-ons Store URL',
      should: 'return true (restricted)',
      actual: isRestrictedUrl('https://addons.mozilla.org/en-US/firefox/addon/xyz'),
      expected: true
    });
  });

  test('Edge restricted URLs', () => {
    assert({
      given: 'an edge:// protocol URL',
      should: 'return true (restricted)',
      actual: isRestrictedUrl('edge://settings'),
      expected: true
    });

    assert({
      given: 'Edge Add-ons Store URL',
      should: 'return true (restricted)',
      actual: isRestrictedUrl('https://microsoftedge.microsoft.com/addons/detail/xyz'),
      expected: true
    });
  });

  test('regular URLs (not restricted)', () => {
    assert({
      given: 'a regular HTTPS URL',
      should: 'return false (allowed)',
      actual: isRestrictedUrl('https://example.com'),
      expected: false
    });

    assert({
      given: 'a URL containing "chrome" but not restricted',
      should: 'return false (allowed)',
      actual: isRestrictedUrl('https://chromebook-tips.com'),
      expected: false
    });

    assert({
      given: 'an HTTP URL',
      should: 'return false (allowed)',
      actual: isRestrictedUrl('http://localhost:3000'),
      expected: false
    });

    assert({
      given: 'a file:// URL',
      should: 'return false (allowed)',
      actual: isRestrictedUrl('file:///Users/test/index.html'),
      expected: false
    });
  });

  test('edge cases', () => {
    assert({
      given: 'an empty string',
      should: 'return false',
      actual: isRestrictedUrl(''),
      expected: false
    });

    assert({
      given: 'undefined',
      should: 'return false',
      actual: isRestrictedUrl(undefined),
      expected: false
    });

    assert({
      given: 'null',
      should: 'return false',
      actual: isRestrictedUrl(null),
      expected: false
    });
  });
});
