import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/Test/setup.ts',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.tsx'],
      exclude: [
        'node_modules/',
        '**/*.test.tsx',
        '**/*.spec.tsx',
        'src/tests/setup.ts'
      ]
    }
  }
});
