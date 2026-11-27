import { defineConfig } from '@playwright/test';
import { isMaterial } from './utils/visual-tests/helpers/theme-utils';
import {
  BASE_URL, CSP, SERVER_PORT, THEME, VIEWPORT,
} from './utils/visual-tests/playwright/const';

// Dates are shown and mock data is built in the time zone of the machine, so it is pinned to the
// zone of the CI agent, for the page (timezoneId) and for the mocks.
const TIMEZONE = 'UTC';

process.env.TZ = TIMEZONE;

// The CI agent and the container draw the same pixels and are judged exactly. A run on the host is
// lenient: another OS rasterises text differently, so its comparison proves nothing anyway.
const rendersLikeCI = !!process.env.CI || !!process.env.DX_CONTAINER;

const screenshotBudget = rendersLikeCI
  ? { maxDiffPixels: 0, threshold: 0 }
  : { maxDiffPixelRatio: 0.05, threshold: 0.2 };

// The flags pin the rendering pipeline so screenshots stay comparable between runs.
const chromeArgs = [
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
];

// Material keeps font hinting and subpixel positioning: its text is unstable without them.
if (!isMaterial(THEME)) {
  chromeArgs.push('--font-render-hinting=none', '--disable-font-subpixel-positioning');
}

export default defineConfig({
  testDir: './testing',
  testMatch: CSP ? 'csp.spec.ts' : ['common.spec.ts', 'widgets/**/*.spec.ts'],
  // The etalons lie next to the test: testing/etalons for the demo pages, testing/widgets/<widget>/etalons for the widget tests.
  snapshotPathTemplate: '{testDir}/{testFileDir}/etalons/{arg}{ext}',
  outputDir: './testing/artifacts/playwright/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CONCURRENCY ? Number(process.env.CONCURRENCY) : undefined,
  reporter: process.env.CI
    ? [['list'], ['blob', { outputDir: './testing/artifacts/playwright/blob-report' }]]
    : [['list']],
  timeout: 60000,
  expect: {
    timeout: 5000,
    toHaveScreenshot: screenshotBudget,
  },
  use: {
    baseURL: BASE_URL,
    timezoneId: TIMEZONE,
    channel: 'chrome',
    headless: true,
    viewport: VIEWPORT,
    launchOptions: {
      args: chromeArgs,
      // Playwright hides scrollbars in headless by default, which changes the page layout.
      ignoreDefaultArgs: ['--hide-scrollbars'],
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `node ./utils/visual-tests/playwright/serve.js ${SERVER_PORT}${CSP ? ' --csp' : ''}`,
    url: `${BASE_URL}/apps/demos/index.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
