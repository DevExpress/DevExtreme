import path from 'path';
import { defineConfig } from 'vite';
import devextremeVitePlugin from './build/vite-plugin-devextreme';

export default defineConfig({
  root: './playground',
  plugins: [devextremeVitePlugin()],
  esbuild: false,
  server: {
    port: 3000,
    fs: {
      allow: ['..', '.', '../..'],
    },
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
