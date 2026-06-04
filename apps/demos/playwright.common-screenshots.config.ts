/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from '@playwright/test';

const DEFAULT_CHROMIUM_ARGS = [
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--disable-partial-raster',
  '--disable-skia-runtime-opts',
  '--run-all-compositor-stages-before-draw',
  '--disable-new-content-rendering-timeout',
  '--disable-threaded-animation',
  '--disable-threaded-scrolling',
  '--disable-checker-imaging',
  '--disable-image-animation-resync',
  '--use-gl=swiftshader',
  '--disable-features=PaintHolding',
  '--js-flags=--random-seed=2147483647',
  '--font-render-hinting=none',
  '--disable-font-subpixel-positioning',
];

function parseBrowserArgs(browserEnv = ''): string[] {
  const browserArgs = browserEnv
    .split(/\s+/)
    .map((value) => value.replace(/^"|"$/g, ''))
    .filter((value) => value.startsWith('--'));

  return browserArgs.length ? browserArgs : DEFAULT_CHROMIUM_ARGS;
}

function parseHeadless(browserEnv = ''): boolean {
  if (!browserEnv) {
    return true;
  }

  return browserEnv.includes('headless');
}

const workers = (process.env.CONCURRENCY && Number(process.env.CONCURRENCY)) || 1;
const browserEnv = process.env.BROWSERS || '';

export default defineConfig({
  testDir: './utils/visual-tests/playwright',
  testMatch: 'common-screenshots.spec.ts',
  timeout: 3 * 60 * 1000,
  fullyParallel: true,
  workers,
  retries: process.env.TCQUARANTINE ? 2 : 0,
  forbidOnly: Boolean(process.env.CI || process.env.CI_ENV),
  outputDir: './testing/artifacts/playwright-common-screenshots',
  reporter: process.env.CI || process.env.CI_ENV
    ? [
      ['list'],
      ['html', { open: 'never', outputFolder: './testing/artifacts/playwright-report' }],
    ]
    : 'list',
  use: {
    browserName: 'chromium',
    channel: process.env.PLAYWRIGHT_CHROMIUM_CHANNEL || 'chrome',
    headless: parseHeadless(browserEnv),
    viewport: { width: 1000, height: 800 },
    deviceScaleFactor: 1,
    actionTimeout: 10000,
    navigationTimeout: 10000,
    launchOptions: {
      args: parseBrowserArgs(browserEnv),
    },
  },
});
