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

const allSpecs = 'tests/src/**/*.spec.ts';
const serverSpecs = 'tests/src/server/**/*.spec.ts';
const hydrationSpec = 'tests/src/server/hydration.spec.ts';
const serverOnlySpecs = ['tests/src/**/ssr-components.spec.ts', 'tests/src/**/hydration.spec.ts'];

const environments: { name: string; setup: string; include: string[]; exclude?: string[] }[] = [
  {
    name: 'client',
    setup: 'client',
    include: [allSpecs],
    exclude: ['tests/src/zone-modes/**', ...serverOnlySpecs],
  },
  {
    name: 'server', setup: 'server', include: [serverSpecs], exclude: [hydrationSpec],
  },
  { name: 'hydration', setup: 'server', include: [hydrationSpec] },
  { name: 'zone', setup: 'client', include: ['tests/src/zone-modes/**/*.spec.ts'] },
  {
    name: 'zoneless', setup: 'zoneless', include: [allSpecs], exclude: serverOnlySpecs,
  },
  {
    name: 'server-zoneless', setup: 'server-zoneless', include: [serverSpecs], exclude: [hydrationSpec],
  },
  { name: 'hydration-zoneless', setup: 'server-zoneless', include: [hydrationSpec] },
];

export default defineConfig(async () => ({
  plugins: [resolveBuiltPackage()],
  oxc: {
    decorator: {
      legacy: true,
      emitDecoratorMetadata: true,
    },
  },
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
    projects: environments.map(({ name, setup, include, exclude }) => ({
      extends: true,
      test: {
        name,
        include,
        exclude: exclude ?? [],
        setupFiles: [`tests/vitest/setup.${setup}.ts`],
      },
    })),
    globals: true,
    fileParallelism: false,
    restoreMocks: true,
    fakeTimers: {
      toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'],
    },
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
            '--disable-dev-shm-usage',
            '--enable-precise-memory-info',
          ],
        },
      }),
      instances: [{ browser: 'chromium' }],
    },
  },
}));
