import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { getVisualClip, getLocatorScrollClip } from './screenshotUtils';

const defaultThemeName = 'fluent.blue.light';

export const getThemePostfix = (theme?: string): string => {
  const themeName = (theme ?? process.env.theme) ?? defaultThemeName;
  return ` (${themeName})`;
};

export const getFullThemeName = (): string => process.env.theme ?? defaultThemeName;

export const isMaterial = (): boolean => getFullThemeName().startsWith('material');

export const isFluent = (): boolean => getFullThemeName().startsWith('fluent');

export const isMaterialBased = (): boolean => isMaterial() || isFluent();

export async function changeTheme(page: Page, themeName: string): Promise<void> {
  await page.evaluate((theme) => new Promise<void>((resolve) => {
    (window as any).DevExpress.ui.themes.ready(resolve);
    (window as any).DevExpress.ui.themes.current(theme);
  }), themeName);
}

export async function getCurrentTheme(page: Page): Promise<string> {
  return page.evaluate(() => (window as any).DevExpress?.ui.themes.current());
}

const getScreenshotName = (baseName: string, theme?: string): string => {
  const themePostfix = getThemePostfix(theme);
  return baseName.endsWith('.png')
    ? baseName.replace('.png', `${themePostfix}.png`)
    : `${baseName}${themePostfix}.png`;
};

async function takePageScreenshot(
  page: Page,
  name: string,
  screenshotOptions?: { maxDiffPixelRatio?: number },
): Promise<void> {
  const viewport = page.viewportSize() ?? { width: 1200, height: 800 };
  const htmlOffsetWidth = await page.evaluate(() => document.documentElement.offsetWidth);
  const width = Math.min(htmlOffsetWidth, viewport.width);
  const clip = { x: 0, y: 0, width, height: viewport.height };
  await expect(page).toHaveScreenshot([name], { maxDiffPixelRatio: 0.20, clip, ...screenshotOptions });
}

async function takeElementScreenshot(
  page: Page,
  element: Locator | string,
  name: string,
  screenshotOptions?: { maxDiffPixelRatio?: number },
): Promise<void> {
  const locator = typeof element === 'string' ? page.locator(element) : element;
  const selector = typeof element === 'string' ? element : null;

  const clip = selector
    ? await getVisualClip(page, selector)
    : await getLocatorScrollClip(locator);

  if (clip) {
    await expect(page).toHaveScreenshot([name], { maxDiffPixelRatio: 0.15, clip, ...screenshotOptions });
  } else {
    await expect(locator).toHaveScreenshot([name], { maxDiffPixelRatio: 0.15, ...screenshotOptions });
  }
}

async function simulateTestCafeScrollbar(page: Page): Promise<boolean> {
  const viewport = page.viewportSize();
  if (viewport && viewport.width !== 1200) return false;

  return page.evaluate(() => {
    const hasOverflow = document.body.scrollHeight > window.innerHeight;
    if (hasOverflow && !document.documentElement.style.paddingRight) {
      document.documentElement.style.paddingRight = '15px';
      document.documentElement.style.boxSizing = 'border-box';
      return true;
    }
    return false;
  });
}

async function removeSimulatedScrollbar(page: Page): Promise<void> {
  await page.evaluate(() => {
    document.documentElement.style.paddingRight = '';
    document.documentElement.style.boxSizing = '';
  });
}

async function takeScreenshotForTarget(
  page: Page,
  element: Locator | string | null | undefined,
  name: string,
  screenshotOptions?: { maxDiffPixelRatio?: number },
): Promise<void> {
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    const licenseEls = document.querySelectorAll('dx-license');
    licenseEls.forEach((el) => {
      const btn = el.querySelector('div[style*="cursor: pointer"]') as HTMLElement | null;
      if (btn) btn.click();
    });
  });

  const addedPadding = await simulateTestCafeScrollbar(page);
  if (addedPadding) {
    await page.evaluate(() => new Promise<void>((resolve) => {
      window.dispatchEvent(new Event('resize'));
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    }));
  }

  try {
    if (element === undefined || element === null) {
      await takePageScreenshot(page, name, screenshotOptions);
    } else {
      await takeElementScreenshot(page, element, name, screenshotOptions);
    }
  } finally {
    if (addedPadding) {
      await removeSimulatedScrollbar(page);
    }
  }
}

export async function testScreenshot(
  page: Page,
  screenshotName: string,
  options?: {
    element?: Locator | string | null;
    theme?: string;
    shouldTestInCompact?: boolean;
    maxDiffPixelRatio?: number;
  },
): Promise<void> {
  const {
    element,
    theme,
    shouldTestInCompact = false,
    maxDiffPixelRatio,
  } = options ?? {};

  const screenshotOptions = maxDiffPixelRatio !== undefined ? { maxDiffPixelRatio } : undefined;

  if (theme) {
    await changeTheme(page, theme);
  }

  await takeScreenshotForTarget(page, element, getScreenshotName(screenshotName, theme), screenshotOptions);

  if (shouldTestInCompact) {
    const themeName = (theme ?? process.env.theme) ?? defaultThemeName;
    await changeTheme(page, `${themeName}.compact`);
    await takeScreenshotForTarget(page, element, getScreenshotName(screenshotName, `${themeName}.compact`), screenshotOptions);
  }

  if (theme || shouldTestInCompact) {
    await changeTheme(page, process.env.theme ?? defaultThemeName);
  }
}
