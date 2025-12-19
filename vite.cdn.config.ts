import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './',

  plugins: [
    react(),
    tailwindcss(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
    }),
  ],

  define: {
    global: 'window',
    'process.env.NODE_ENV': JSON.stringify('production'),
  },

  build: {
    cssMinify: false,
    assetsInlineLimit: 0,
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'SwatchModule',
      formats: ['es'], // CDN uses ESM
      fileName: () => 'main.js',
    },

    rollupOptions: {
      external: [], // keep empty for CDN
    },

    cssCodeSplit: true,
    assetsDir: 'assets',
    outDir: 'dist/cdn',
    emptyOutDir: true,
  },
});
