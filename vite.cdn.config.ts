// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import dts from 'vite-plugin-dts';
// import { resolve } from 'path';

// export default defineConfig({
//   plugins: [
//     react(),
//     dts({
//       insertTypesEntry: true,
//     }),
//   ],
//   define: {
//     'process.env.NODE_ENV': JSON.stringify('production'),
//     global: 'window',
//   },
//   build: {
//     lib: {
//       entry: resolve(__dirname, 'lib/main.ts'),
//       name: 'SwatchModule',
//       formats: ['es'],
//       fileName: () => 'main.js',
//     },
//     rollupOptions: {
//       external: [], // ⚠️ Must be empty (for CDN)
//     },
//     outDir: 'dist/cdn/',
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  base: './', // ✅ Ensures assets & fonts resolve correctly for CDN paths

  plugins: [
    react(),
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
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'SwatchModule',
      formats: ['es'], // CDN uses ESM
      fileName: () => 'main.js',
    },

    // ✅ Bundle EVERYTHING, including React/Redux. No externals for CDN.
    rollupOptions: {
      external: [], // keep empty for CDN
    },

    cssCodeSplit: true, // ✅ Guarantees CSS is emitted separately
    assetsDir: 'assets', // ✅ Fonts go to dist/cdn/assets/

    outDir: 'dist/cdn',
    emptyOutDir: true,
  },
});
