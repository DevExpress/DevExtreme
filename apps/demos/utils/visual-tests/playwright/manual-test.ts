import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import {
  FRAMEWORKS,
  globalReadFrom,
  settings,
  shouldRunTestAtIndex,
  shouldRunTestExplicitlyInternal,
  updateConfig,
} from '../matrix-test-core';
import { getScreenshotName } from '../helpers/theme-utils';
import { getTestGlobalsScriptPath } from '../test-globals-bundle';
import { mockApi } from './api-mocks';
import { BASE_URL, THEME } from './const';
import {
  getVendorVizWidgets, openDemo, prepareDemoPage, runTestCode, trackPageActivity,
} from './demo-page';

interface Viewport { width: number; height: number }

const DEMOS_ROOT = join(__dirname, '..', '..', '..', 'Demos');

// Tests are selected by name with --grep, so the command line holds no demo masks.
updateConfig({ explicitTestArgs: [], verbose: false });

const framework: string = FRAMEWORKS[settings.targetFramework ?? 'jquery'];

const testGlobalsPath = getTestGlobalsScriptPath(framework);
const testGlobals = testGlobalsPath ? readFileSync(testGlobalsPath, 'utf8') : null;
const vendorVizWidgets = getVendorVizWidgets(framework);

// Styles the TestCafe run added to some demos, by demo name.
const getDemoStyles = (demo: string): string => {
  switch (demo) {
    case 'EditorAppearanceVariants':
      return '.dx-toast-wrapper { display: none !important; }';
    case 'VirtualScrolling':
    case 'StatePersistence':
      return '.dx-scrollable-scroll { visibility: visible !important; }';
    default:
      return '';
  }
};

// Appended, unlike the common test styles, which are prepended, so that a demo style overrides
// them; an init script, so that it survives a test that reloads the page.
const appendDemoStyles = (css: string): void => {
  const append = (): void => {
    const style = document.createElement('style');

    style.textContent = css;
    document.head.append(style);
  };

  if (document.head) {
    append();
    return;
  }

  const observer = new MutationObserver(() => {
    if (document.head) {
      observer.disconnect();
      append();
    }
  });

  observer.observe(document, { childList: true, subtree: true });
};

// A job takes a part of the tests by a hash of the demo, so the split does not depend on the
// order in which a worker loads the test files.
const getShardIndex = (name: string): number => Array
  .from(name)
  .reduce((hash, char) => (Math.imul(hash, 31) + char.charCodeAt(0)) | 0, 7) >>> 0;

// TestCafe waited for the requests an action had started; a screenshot here waits until the page
// has settled: no pending request, no script animation, no visible load panel.
const settlers = new WeakMap<Page, () => Promise<void>>();

async function openManualDemo(page: Page, widget: string, demo: string): Promise<void> {
  const demoDir = join(DEMOS_ROOT, widget, demo);
  const url = `${BASE_URL}/apps/demos/Demos/${widget}/${demo}/${framework}/`;
  const clientScript = globalReadFrom(demoDir, 'client-script.js', null);
  const testCode = globalReadFrom(demoDir, 'test-code.js', null);
  const demoStyles = getDemoStyles(demo);
  const waitForIdle = trackPageActivity(page);

  settlers.set(page, waitForIdle);

  await mockApi(page);
  await prepareDemoPage(page, url, THEME, clientScript, testGlobals, vendorVizWidgets);

  if (demoStyles) {
    await page.addInitScript({ content: `(${appendDemoStyles.toString()})(${JSON.stringify(demoStyles)});` });
  }

  await openDemo(page, url, waitForIdle);

  if (testCode) {
    await runTestCode(page, testCode);
  }

  await waitForIdle();

  // The TestCafe run hovered the corner of the page before each test.
  await page.mouse.move(1, 1);
}

// Registers the tests of one demo in the framework of the job (CONSTEL) and opens the demo before
// each test in a window of the given size.
export function describeManualTest(
  widget: string,
  demo: string,
  viewport: Viewport,
  body: () => void,
): void {
  const name = `${widget}-${demo}`;

  if (!existsSync(join(DEMOS_ROOT, widget, demo, framework))
    || !shouldRunTestAtIndex(getShardIndex(name))
    || (settings.explicitTests && !shouldRunTestExplicitlyInternal(framework, widget, demo))) {
    return;
  }

  test.describe(framework, () => {
    test.describe(name, () => {
      test.use({ viewport });

      test.beforeEach(async ({ page }) => {
        await openManualDemo(page, widget, demo);
      });

      body();
    });
  });
}

const resolveLocator = (page: Page, element?: Locator | string): Locator | null => {
  if (typeof element === 'string') {
    return page.locator(element);
  }

  return element ?? null;
};

// TestCafe shot an element that outgrows the viewport by scrolling its start into view and taking
// the part of it that was on screen; the Playwright element screenshot would stitch the whole
// element instead.
const clipToViewport = async (
  page: Page,
  locator: Locator,
): Promise<{ x: number; y: number; width: number; height: number } | null> => {
  const box = await locator.boundingBox();

  if (!box) {
    return null;
  }

  const viewport = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  }));

  if (box.width <= viewport.width && box.height <= viewport.height) {
    return null;
  }

  await locator.evaluate((element) => {
    element.scrollIntoView({ block: 'start', inline: 'start' });
  });

  const scrolled = await locator.boundingBox() ?? box;
  const x = Math.max(scrolled.x, 0);
  const y = Math.max(scrolled.y, 0);

  return {
    x,
    y,
    width: Math.min(scrolled.width, viewport.width - x),
    height: Math.min(scrolled.height, viewport.height - y),
  };
};

// Fixes the current date of the page after the demo has opened, through the MockDate every page gets.
// The page and the tests run in the same time zone, so the time stamp means the same date there.
export async function mockDate(page: Page, date: Date): Promise<void> {
  await page.evaluate((time) => {
    (window as unknown as { MockDate: { set: (value: number) => void } }).MockDate.set(time);
  }, date.getTime());
}

// Waits until the page has settled after an action. TestCafe acted slowly enough that a widget had
// finished re-rendering before the next action; Playwright may act in the middle of it.
export async function waitForSettled(page: Page): Promise<void> {
  await settlers.get(page)?.();
}

// Compares the viewport, or the given element, with "<name> (<theme>).png" in the etalons folder
// next to the test. `mask` covers elements whose look is not stable, with a reason in the test.
export async function testScreenshot(
  page: Page,
  screenshotName: string,
  element?: Locator | string,
  { mask }: { mask?: Locator[] } = {},
): Promise<void> {
  const name = getScreenshotName(screenshotName, THEME);
  const locator = resolveLocator(page, element);

  await waitForSettled(page);

  if (!locator) {
    await expect(page).toHaveScreenshot([name], { mask });
    return;
  }

  const clip = await clipToViewport(page, locator);

  if (clip) {
    await expect(page).toHaveScreenshot([name], { clip, mask });
    return;
  }

  await expect(locator).toHaveScreenshot([name], { mask });
}

interface DragOptions {
  // The point to press, from the left top corner of the element; a negative value counts from the
  // right or bottom edge, as in TestCafe. The center by default.
  offsetX?: number;
  offsetY?: number;
  steps?: number;
}

const DRAG_STEPS = 10;

const pointWithin = async (
  locator: Locator,
  offsetX?: number,
  offsetY?: number,
): Promise<{ x: number; y: number }> => {
  await locator.scrollIntoViewIfNeeded();

  const box = await locator.boundingBox();

  if (!box) {
    throw new Error(`${locator.toString()} has no box to point at`);
  }

  const within = (size: number, offset?: number): number => {
    if (offset === undefined) {
      return size / 2;
    }

    return offset < 0 ? size + offset : offset;
  };

  return {
    x: Math.round(box.x + within(box.width, offsetX)),
    y: Math.round(box.y + within(box.height, offsetY)),
  };
};

// Drags the element by the given distance with the mouse, as TestCafe's t.drag did.
export async function drag(
  page: Page,
  locator: Locator,
  deltaX: number,
  deltaY: number,
  { offsetX, offsetY, steps = DRAG_STEPS }: DragOptions = {},
): Promise<void> {
  const start = await pointWithin(locator, offsetX, offsetY);

  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + deltaX, start.y + deltaY, { steps });
  await page.mouse.up();
}

// Drags the element onto the center of the target, as TestCafe's t.dragToElement did.
export async function dragToElement(
  page: Page,
  locator: Locator,
  target: Locator,
  { offsetX, offsetY, steps = DRAG_STEPS }: DragOptions = {},
): Promise<void> {
  const start = await pointWithin(locator, offsetX, offsetY);

  await page.mouse.move(start.x, start.y);
  await page.mouse.down();

  const end = await pointWithin(target);

  await page.mouse.move(end.x, end.y, { steps });
  await page.mouse.up();
}
