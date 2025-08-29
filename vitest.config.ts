import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '*.config.*',
        'scripts/',
        'public/',
      ],
    },
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}', 'tests/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    setupFiles: ['./tests/setup.ts'],
  },
});