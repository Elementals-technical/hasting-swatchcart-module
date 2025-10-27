import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // no build.lib here — this is an APP build (emits index.html)
  build: {
    copyPublicDir: true, // if you have /public
    cssCodeSplit: true,
    outDir: 'dist',
  },
  server: {
    host: true,
    allowedHosts: ['.ondigitalocean.app'],
  },
  preview: {
    host: true,
    allowedHosts: ['.ondigitalocean.app'],
  },
});
