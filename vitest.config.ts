import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  build: {
    sourcemap: true,
    exclude: ['**/*']
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/Test/setupTest.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.tsx'],
      exclude: [
        'node_modules/',
        '**/*.test.tsx',
        '**/*.spec.tsx',
        'src/setup.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
