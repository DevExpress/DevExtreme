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
];

const FONT_RENDERING_CHROMIUM_ARGS = [
  '--font-render-hinting=none',
  '--disable-font-subpixel-positioning',
];

// Applied for Material theme only.
// --disable-lcd-text: disables LCD/ClearType subpixel colour antialiasing on
//   coloured glyphs (Roboto headings, links). TestCafe screenshots use grayscale
//   antialiasing; without this flag Playwright renders coloured fringes that
//   differ from the etalons.
// --force-color-profile=srgb: locks Chrome to sRGB so coloured elements
//   (sliders, icons, links) render at the same hue as TestCafe etalons,
//   regardless of the CI machine's ICC display profile.
const MATERIAL_CHROMIUM_ARGS = [
  '--disable-lcd-text',
  '--force-color-profile=srgb',
];

function isMaterialTheme(theme = process.env.THEME || ''): boolean {
  return theme.includes('material');
}

function getDefaultChromiumArgs(theme = process.env.THEME || ''): string[] {
  if (isMaterialTheme(theme)) {
    return [...DEFAULT_CHROMIUM_ARGS, ...MATERIAL_CHROMIUM_ARGS];
  }

  return [
    ...DEFAULT_CHROMIUM_ARGS,
    ...FONT_RENDERING_CHROMIUM_ARGS,
  ];
}

function normalizeBrowserArgs(browserArgs: string[], theme = process.env.THEME || ''): string[] {
  if (!isMaterialTheme(theme)) {
    return browserArgs;
  }

  const filtered = browserArgs.filter((arg) => !FONT_RENDERING_CHROMIUM_ARGS.includes(arg));
  const missing = MATERIAL_CHROMIUM_ARGS.filter((arg) => !filtered.includes(arg));
  return [...filtered, ...missing];
}

// CDPScreenshotNewSurface (Chrome ≥132) changes how CDP takes screenshots and
// produces different Roboto/Material text antialiasing vs. TestCafe etalons.
// When PLAYWRIGHT_LEGACY_SCREENSHOT=1 is set, disable it so captures match.
function applyLegacyScreenshot(args: string[]): string[] {
  if (process.env.PLAYWRIGHT_LEGACY_SCREENSHOT !== '1') {
    return args;
  }

  return args.map((arg) => (arg.startsWith('--disable-features=')
    ? `${arg},CDPScreenshotNewSurface`
    : arg));
}

function parseBrowserArgs(browserEnv = ''): string[] {
  const browserArgs = browserEnv
    .split(/\s+/)
    .map((value) => value.replace(/^"|"$/g, ''))
    .filter((value) => value.startsWith('--'));

  return applyLegacyScreenshot(normalizeBrowserArgs(
    browserArgs.length ? browserArgs : getDefaultChromiumArgs(),
  ));
}

function parseHeadless(browserEnv = ''): boolean {
  if (!browserEnv) {
    return true;
  }

  return browserEnv.includes('headless');
}

function isAccessibilityStrategy(strategy = process.env.STRATEGY || ''): boolean {
  return strategy === 'accessibility';
}

function getViewport(strategy = process.env.STRATEGY || ''): { width: number; height: number } {
  return isAccessibilityStrategy(strategy)
    ? { width: 1200, height: 800 }
    : { width: 1000, height: 800 };
}

const strategy = process.env.STRATEGY || 'screenshots';
const workers = (process.env.CONCURRENCY && Number(process.env.CONCURRENCY)) || 1;
const browserEnv = process.env.BROWSERS || '';

export default defineConfig({
  testDir: './utils/visual-tests/playwright',
  testMatch: 'common-screenshots.spec.ts',
  timeout: 3 * 60 * 1000,
  fullyParallel: true,
  workers,
  retries: process.env.TCQUARANTINE ? 0 : 0, // 2 : 0
  forbidOnly: Boolean(process.env.CI || process.env.CI_ENV),
  outputDir: `./testing/artifacts/playwright-common-${strategy}`,
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
    viewport: getViewport(strategy),
    deviceScaleFactor: 1,
    actionTimeout: 10000,
    navigationTimeout: 10000,
    launchOptions: {
      args: parseBrowserArgs(browserEnv),
    },
  },
});
