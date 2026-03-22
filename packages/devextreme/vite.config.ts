import path from 'path';
import { defineConfig } from 'vite';
import devextremeInferno from './build/vite-plugin-devextreme';
import demoHtmlPlugin from './build/vite-plugin-demo-html';

export default defineConfig({
  root: './playground',
  base: './',
  plugins: [devextremeInferno(), demoHtmlPlugin()],
  esbuild: false,
  server: {
    port: 3000,
    fs: {
      allow: ['..', '.', '../..'],
    },
    hmr: true,
  },
  resolve: {
    alias: {
      'core': path.resolve(__dirname, './js/core'),
      'common': path.resolve(__dirname, './js/common'),
      'data': path.resolve(__dirname, './js/data'),
      'ui': path.resolve(__dirname, './js/ui'),
      '@js': path.resolve(__dirname, './js'),
      '@ts': path.resolve(__dirname, './js/__internal'),
      '__internal': path.resolve(__dirname, './js/__internal'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/playground'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        catalog: path.resolve(__dirname, 'playground/index.html'),
        'demo-init': path.resolve(__dirname, 'playground/demo-init.ts'),
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === 'demo-init' ? 'demo-init.js' : 'assets/[name]-[hash].js',
      },
    },
  },
});
