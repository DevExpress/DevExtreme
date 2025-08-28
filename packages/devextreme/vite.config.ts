import path from 'path';
import { defineConfig } from 'vite';
import inferno from 'vite-plugin-inferno'

export default defineConfig(() => {
  return {
    root: './playground',
    plugins: [inferno()],
    server: {
      port: 3000,
      fs: {
        allow: ['..', '.', './testing', '../..']
      },
      hmr: true
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
      }
    },
    esbuild: {
    jsxFactory: 'Inferno.createVNode',
    jsxFragment: 'Inferno.Fragment',
  }
  };
});
