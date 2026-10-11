import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static frontend only — no backend, no proxy. Everything runs in the browser.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: { outDir: 'dist', sourcemap: false },
});
