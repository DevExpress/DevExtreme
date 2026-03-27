import { defineConfig, expect } from '@playwright/test';

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return false;
  const aKeys = Object.keys(a as object).sort();
  const bKeys = Object.keys(b as object).sort();
  if (aKeys.join(',') !== bKeys.join(',')) return false;
  return aKeys.every((k) => deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
}

expect.extend({
  eql(received: unknown, expected: unknown) {
    const pass = deepEqual(received, expected);
    return {
      pass,
      message: () => pass
        ? `Expected values not to be deeply equal.\nReceived: ${JSON.stringify(received)}`
        : `Expected values to be deeply equal.\nReceived: ${JSON.stringify(received)}\nExpected: ${JSON.stringify(expected)}`,
    };
  },
  within(received: unknown, min: number, max: number) {
    const num = received as number;
    const pass = num >= min && num <= max;
    return {
      pass,
      message: () => pass
        ? `Expected ${num} not to be within [${min}, ${max}]`
        : `Expected ${num} to be within [${min}, ${max}]`,
    };
  },
});

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Module = require('module');
  const cfgReq = Module.createRequire(__filename);
  const testPkgPath = cfgReq.resolve('@playwright/test').replace('/index.js', '');
  const testReq = Module.createRequire(testPkgPath + '/package.json');
  const playPkgPath = testReq.resolve('playwright').replace('/index.js', '');
  const playReq = Module.createRequire(playPkgPath + '/package.json');
  const corePkgPath = playReq.resolve('playwright-core').replace('/index.js', '');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require('path');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Page } = require(path.join(corePkgPath, 'lib', 'client', 'page.js'));

  (Page.prototype as Record<string, unknown>).expect = function(value: unknown) {
    return {
      within: (min: number, max: number) => {
        const num = value as number;
        if (num < min || num > max) {
          throw new Error(`Expected ${num} to be within [${min}, ${max}]`);
        }
      },
      ok: () => {
        if (!value) {
          throw new Error(`Expected value to be truthy, got: ${value}`);
        }
      },
      eql: (expected: unknown) => {
        if (!deepEqual(value, expected)) {
          throw new Error(
            `Expected values to be deeply equal.\nReceived: ${JSON.stringify(value)}\nExpected: ${JSON.stringify(expected)}`,
          );
        }
      },
    };
  };
} catch {
  // Ignore if playwright-core is not accessible in this context
}

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
  '--disable-features=PaintHolding,OverlayScrollbar',
  '--js-flags=--random-seed=2147483647',
  '--font-render-hinting=none',
  '--disable-font-subpixel-positioning',
];

export default defineConfig({
  testDir: './playwright-tests',
  outputDir: './playwright-results',
  snapshotDir: './tests',
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/etalons/{arg}{ext}',

  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.07,
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
      ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
        ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
        : {}),
    },
    bypassCSP: true,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        ...(process.env.CI ? { channel: 'chrome' } : {}),
      },
    },
    {
      name: 'chromium-1185',
      use: {
        browserName: 'chromium',
        ...(process.env.CI ? { channel: 'chrome' } : {}),
        viewport: { width: 1185, height: 800 },
      },
    },
  ],

  reporter: [['html', { open: 'never' }]],
});
