import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import pkg from './package.json';

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'inject-app-version',
      transformIndexHtml(html) {
        return html.replace(/%APP_VERSION%/g, pkg.version);
      },
    },
  ],
  // no build.lib here — this is an APP build (emits index.html)
  build: {
    assetsInlineLimit: 0,
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
