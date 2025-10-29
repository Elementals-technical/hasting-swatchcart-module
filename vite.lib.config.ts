import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: 'lib', // take types from lib/**
      outDir: 'dist', // emit d.ts into dist/** mirroring structure
      insertTypesEntry: true, // creates dist/main.d.ts
    }),
  ],
  build: {
    copyPublicDir: false,
    cssCodeSplit: true, // or false if you want a single JS with CSS injected
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es'], // add 'cjs' if you also need CommonJS
      fileName: 'main', // dist/main.js
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        dir: 'dist',
        format: 'es',
        entryFileNames: '[name].js', // main.js
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name][extname]',
        preserveModules: true, // keep file-per-module
        preserveModulesRoot: 'lib', // strip "lib/" prefix -> dist/components/...
      },
    },
  },
});
