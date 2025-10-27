// an old version base vite config
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { extname, relative, resolve } from 'path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import dts from 'vite-plugin-dts';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), dts({ include: ['lib'] }), libInjectCss()],
  build: {
    copyPublicDir: false,
    cssCodeSplit: true,
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      input: Object.fromEntries(
        glob
          .sync('lib/**/*.{ts,tsx}', {
            ignore: ['lib/**/*.d.ts'],
          })
          .map((file) => [
            relative('lib', file.slice(0, file.length - extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ]),
      ),
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      },
    },
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
