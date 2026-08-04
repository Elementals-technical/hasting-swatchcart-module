import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import pkg from './package.json';

const externalPackages = [
  '@reduxjs/toolkit',
  '@radix-ui/react-accordion',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-dialog',
  '@radix-ui/react-label',
  '@radix-ui/react-popover',
  '@radix-ui/react-slider',
  '@radix-ui/react-slot',
  '@radix-ui/react-tooltip',
  'clsx',
  'lucide-react',
  'react',
  'react-dom',
  'react-markdown',
  'react-redux',
  'rehype-raw',
  'tailwind-merge',
];

const isExternal = (id: string) =>
  externalPackages.some((pkg) => id === pkg || id.startsWith(`${pkg}/`));

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    tailwindcss(),
    dts({
      entryRoot: 'lib',
      outDir: 'dist',
      insertTypesEntry: true,
      include: ['lib/**/*.ts', 'lib/**/*.tsx', 'lib/main.ts'],
    }),
    libInjectCss(),
  ],
  build: {
    copyPublicDir: false,
    cssCodeSplit: true,
    cssMinify: false,
    assetsInlineLimit: 0,
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'cjs' ? 'main.cjs' : 'main.js'),
    },
    rollupOptions: {
      external: isExternal,
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/index.css';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    sourcemap: true,
  },
});
