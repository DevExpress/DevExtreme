import { defineConfig } from '@playwright/test';

const CHROME_FLAGS = [
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
];

export default defineConfig({
  testDir: './playwright-tests',
  outputDir: './playwright-results',
  snapshotDir: './playwright-tests',
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/etalons/{arg}{ext}',

  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      threshold: 0.2,
      animations: 'disabled',
    },
  },

  use: {
    viewport: { width: 1200, height: 800 },
    screenshot: 'off',
    trace: 'off',
    launchOptions: {
      args: CHROME_FLAGS,
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],

  reporter: [['html', { open: 'never' }]],
});
