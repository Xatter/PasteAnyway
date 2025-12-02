import { vi, beforeEach } from 'vitest';
import { createChromeMock } from './chrome-mock.js';

// Global chrome mock for browser extension APIs
globalThis.chrome = createChromeMock();

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
