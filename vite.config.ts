import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        // Alias points at project root (not src). Documented in CURRENT_STATE.md.
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR can be disabled via DISABLE_HMR=true (agent/edit sessions).
      hmr: process.env.DISABLE_HMR !== 'true',
      // Lecture PDFs/docx under development data often lock on Windows (EBUSY) if watched.
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : {
              ignored: [
                '**/development data/**',
                '**/development data/**/**',
              ],
            },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    },
  };
});
