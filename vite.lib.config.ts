// work styles import | don't work client import

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { libInjectCss } from 'vite-plugin-lib-inject-css';
// import { extname, relative, resolve } from 'path';
// import { fileURLToPath } from 'node:url';
// import { glob } from 'glob';
// import dts from 'vite-plugin-dts';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), dts({ include: ['lib'] }), libInjectCss()],
//   build: {
//     copyPublicDir: false,
//     cssCodeSplit: true,
//     lib: {
//       entry: resolve(__dirname, 'lib/main.ts'),
//       formats: ['es'],
//     },
//     rollupOptions: {
//       external: ['react', 'react/jsx-runtime'],
//       input: Object.fromEntries(
//         glob
//           .sync('lib/**/*.{ts,tsx}', {
//             ignore: ['lib/**/*.d.ts'],
//           })
//           .map((file) => [
//             // The name of the entry point
//             // lib/nested/foo.ts becomes nested/foo
//             relative('lib', file.slice(0, file.length - extname(file).length)),
//             // The absolute path to the entry file
//             // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
//             fileURLToPath(new URL(file, import.meta.url)),
//           ]),
//       ),
//       output: {
//         assetFileNames: 'assets/[name][extname]',
//         entryFileNames: '[name].js',
//       },
//     },
//   },
// });

// vite.lib.config.ts
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import dts from 'vite-plugin-dts';
// import { libInjectCss } from 'vite-plugin-lib-inject-css';
// import { resolve } from 'path';

// export default defineConfig({
//   plugins: [
//     react(),
//     dts({
//       entryRoot: 'lib',
//       outDir: 'dist',
//       insertTypesEntry: true,
//       include: ['lib/**/*.ts', 'lib/**/*.tsx', 'lib/main.ts'],
//     }),
//     libInjectCss(),
//   ],
//   css: {}, // tailwind v3 via postcss OR v4 via @tailwindcss/vite in app build is fine
//   build: {
//     copyPublicDir: false,
//     cssCodeSplit: true, // keep CSS as dist/assets/*.css
//     lib: {
//       entry: resolve(__dirname, 'lib/main.ts'),
//       formats: ['es', 'cjs'],
//       fileName: (format) => (format === 'cjs' ? 'main.cjs' : 'main.js'),
//     },
//     rollupOptions: {
//       // do NOT bundle these – avoid duplicate React/Redux
//       external: [
//         'react',
//         'react-dom',
//         'react/jsx-runtime',
//         'react-redux',
//         '@reduxjs/toolkit',
//       ],
//       output: {
//         // No glob multi-entry. Let lib/main.ts be the public surface.
//         assetFileNames: 'assets/[name][extname]',
//       },
//     },
//   },
// });

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
