import { defineConfig } from 'vitest/config';

export default defineConfig({
  ssr: {
    noExternal: ['devextreme', 'devextreme-angular'],
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/dist/server/*.spec.js'],
    exclude: [
      '**/node_modules/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
    ],
    setupFiles: ['tests/src/server/vitest.setup.ts'],
  },
});
