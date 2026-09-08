import { defineConfig } from '@playwright/test';
import type { TestOptions } from './fixtures';
import {
  DEFAULT_BROWSER_SIZE, DEFAULT_THEME, readEnv, SERVER_PORT, TEST_PAGE_URL,
} from './helpers/const';

const baseURL = `http://localhost:${SERVER_PORT}`;
const [width, height] = DEFAULT_BROWSER_SIZE;

// The TestCafe run changed the clock of the whole agent, so a "new Date(2015, 1, 9, 8)" written in
// a test meant that hour in the job's timezone. Only the browser context takes TIMEZONE here, so
// the process is pointed at it as well — before any test file builds a date.
process.env.TZ = readEnv(process.env.TIMEZONE, 'GMT');

// The pixel budget is asymmetric on purpose: CI is the source of truth and the etalons are
// generated there, a local run only says whether the change is in the right ballpark.
const screenshotBudget = process.env.CI
  ? { maxDiffPixelRatio: 0.001, threshold: 0.1 }
  : { maxDiffPixelRatio: 0.05, threshold: 0.2 };

export default defineConfig<TestOptions>({
  testDir: './tests',
  snapshotPathTemplate: '{testDir}/{testFileDir}/etalons/{arg}{ext}',
  outputDir: './artifacts/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 8 : 4,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never', outputFolder: './artifacts/playwright-report' }]]
    : [['list']],
  timeout: 60000,
  expect: {
    timeout: 5000,
    toHaveScreenshot: screenshotBudget,
  },
  use: {
    theme: readEnv(process.env.THEME, DEFAULT_THEME),
    // The TestCafe run changes the machine timezone on the CI agent; the browser context
    // takes it per run instead, so the same agent can serve any timezone job.
    timezoneId: readEnv(process.env.TIMEZONE, 'GMT'),
    baseURL,
    channel: 'chrome',
    headless: true,
    viewport: { width, height },
    launchOptions: {
      // The same flags the TestCafe runner passes as the "chrome:devextreme-shr2" alias:
      // they pin the rendering pipeline so screenshots stay comparable between runs.
      args: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
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
      ],
      // Playwright hides scrollbars in headless by default, which changes the page layout.
      ignoreDefaultArgs: ['--hide-scrollbars'],
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `node ./serve.mjs --port=${SERVER_PORT}`,
    url: `${baseURL}${TEST_PAGE_URL}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
