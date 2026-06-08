import { defineConfig } from '@playwright/test';

const DEFAULT_CHROMIUM_ARGS = [
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--window-size=1200,800',
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

function applyLegacyScreenshot(args: string[]): string[] {
  if (process.env.PLAYWRIGHT_LEGACY_SCREENSHOT !== '1') {
    return args;
  }

  if (!args.some((arg) => arg.startsWith('--disable-features='))) {
    return [
      ...args,
      '--disable-features=CDPScreenshotNewSurface',
    ];
  }

  return args.map((arg) => (arg.startsWith('--disable-features=')
    ? `${arg},CDPScreenshotNewSurface`
    : arg));
}

const DEFAULT_WORKERS = 4;

function getWorkers(): number {
  const rawValue = process.env.CONCURRENCY
    ?? process.env.PLAYWRIGHT_COMPONENT_CONCURRENCY
    ?? DEFAULT_WORKERS;
  const value = Number(rawValue);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_WORKERS;
}

function normalizeBrowserArgs(): string[] {
  const browser = process.env.BROWSERS ?? 'chrome:devextreme-shr2';

  if (browser.includes('chrome:devextreme-shr2')) {
    return applyLegacyScreenshot(DEFAULT_CHROMIUM_ARGS);
  }

  return applyLegacyScreenshot(browser
    .split(/\s+/)
    .filter((arg) => arg.startsWith('--')));
}

function parseHeadless(browserEnv = process.env.BROWSERS ?? ''): boolean {
  if (!browserEnv) {
    return true;
  }

  return browserEnv.includes('headless')
    || browserEnv.includes('chrome:devextreme-shr2')
    || browserEnv.includes('chrome:docker');
}

export default defineConfig({
  testDir: './playwright',
  testMatch: ['component-tests.spec.ts'],
  outputDir: './artifacts/playwright-test-results',
  timeout: 120_000,
  expect: {
    timeout: 5_000,
  },
  workers: getWorkers(),
  retries: process.env.TCQUARANTINE ? 0 : 0, // 2 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: {
    browserName: 'chromium',
    channel: process.env.PLAYWRIGHT_CHROMIUM_CHANNEL ?? 'chrome',
    headless: parseHeadless(),
    viewport: { width: 1200, height: 800 },
    deviceScaleFactor: 1,
    actionTimeout: 15_000,
    navigationTimeout: 15_000,
    launchOptions: {
      args: normalizeBrowserArgs(),
    },
  },
});
