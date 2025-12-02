import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['**/*.test.js'],
    setupFiles: ['./test-utils/setup.js']
  }
});
