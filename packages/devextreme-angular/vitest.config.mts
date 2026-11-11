import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { playwright } from '@vitest/browser-playwright';
import puppeteer from 'puppeteer';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);
const rootDir = path.dirname(fileURLToPath(import.meta.url));
const fesmDir = path.resolve(rootDir, 'npm/dist/fesm2022');

const resolveBuiltPackage = (): Plugin => ({
  name: 'resolve-built-devextreme-angular',
  enforce: 'pre',
  resolveId(source) {
    if (source !== 'devextreme-angular' && !source.startsWith('devextreme-angular/')) {
      return null;
    }

    return path.join(fesmDir, `${source.replace(/\//g, '-')}.mjs`);
  },
});

export default defineConfig(async () => ({
  plugins: [resolveBuiltPackage()],
  resolve: {
    alias: {
      stream: require.resolve('stream-browserify'),
    },
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  test: {
    name: 'client',
    globals: true,
    include: ['tests/src/**/*.spec.ts'],
    exclude: [
      'tests/src/zone-modes/**',
      'tests/src/**/ssr-components.spec.ts',
      'tests/src/**/hydration.spec.ts',
    ],
    setupFiles: ['tests/vitest/setup.client.ts'],
    restoreMocks: true,
    testTimeout: 60000,
    hookTimeout: 60000,
    reporters: ['default', 'junit'],
    outputFile: { junit: 'test-results.xml' },
    browser: {
      enabled: true,
      headless: true,
      screenshotFailures: false,
      provider: playwright({
        launchOptions: {
          executablePath: await puppeteer.executablePath(),
          args: [
            '--enable-features=MeasureMemory',
            '--js-flags=--expose-gc',
            '--no-sandbox',
            '--disable-gpu',
            '--enable-precise-memory-info',
          ],
        },
      }),
      instances: [{ browser: 'chromium' }],
    },
  },
}));
