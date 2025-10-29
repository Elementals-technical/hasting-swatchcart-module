import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ✅ REQUIRED for Tailwind v4
    dts({
      entryRoot: 'lib',
      outDir: 'dist',
      insertTypesEntry: true,
      include: ['lib/**/*.ts', 'lib/**/*.tsx', 'lib/main.ts'],
    }),
    libInjectCss(), // ✅ auto inject CSS into final JS bundle
  ],

  build: {
    copyPublicDir: false,
    cssCodeSplit: true,
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'cjs' ? 'main.cjs' : 'main.js'),
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-redux',
        '@reduxjs/toolkit',
        'react/jsx-runtime',
      ],
      output: {
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
