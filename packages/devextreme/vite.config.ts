import path from 'path';
import { defineConfig } from 'vite';
import devextremeInferno from './build/vite-plugin-devextreme';
import demoHtmlPlugin from './build/vite-plugin-demo-html';

export default defineConfig({
  root: './playground',
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
});
