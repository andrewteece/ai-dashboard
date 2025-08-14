// vitest.config.ts
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/*.test.{ts,tsx}', 'src/app/**'],
      thresholds: {
        lines: 60,
        statements: 60,
        branches: 50,
        functions: 60,
      },
    },
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
