import { vi } from 'vitest';

/**
 * Creates a mock of the Chrome extension APIs for testing.
 * Firefox polyfills chrome.* APIs, so this works for both browsers.
 */
export const createChromeMock = () => ({
  runtime: {
    onInstalled: {
      addListener: vi.fn()
    }
  },
  contextMenus: {
    create: vi.fn(),
    onClicked: {
      addListener: vi.fn()
    }
  },
  tabs: {
    query: vi.fn(() => Promise.resolve([]))
  },
  scripting: {
    executeScript: vi.fn(() => Promise.resolve())
  },
  action: {
    setBadgeText: vi.fn(),
    setBadgeBackgroundColor: vi.fn()
  },
  storage: {
    local: {
      get: vi.fn(() => Promise.resolve({})),
      set: vi.fn(() => Promise.resolve())
    }
  }
});
