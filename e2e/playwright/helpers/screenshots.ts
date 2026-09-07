import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { getFullThemeName, getThemePostfix } from './themeUtils';
import { changeTheme } from './testPageUtils';

export interface ScreenshotOptions {
  element?: Locator | string | null;
  theme?: string;
  shouldTestInCompact?: boolean;
  compactCallBack?: () => Promise<unknown>;
  themeChanged?: () => Promise<unknown>;
}

// The etalons carry the theme in their file name — the same convention the TestCafe run uses,
// so the existing "<name> (fluent.blue.light).png" files are reused as is.
const getScreenshotName = (baseName: string, theme?: string): string => {
  const themePostfix = getThemePostfix(theme);

  return baseName.endsWith('.png')
    ? baseName.replace('.png', `${themePostfix}.png`)
    : `${baseName}${themePostfix}.png`;
};

const resolveLocator = (
  page: Page,
  element: Locator | string | null | undefined,
): Locator | null => {
  if (typeof element === 'string') {
    return page.locator(element);
  }

  return element ?? null;
};

// The page screenshot is clipped to the layout viewport: Playwright would otherwise include the
// scrollbar, which TestCafe left out, and every full-page etalon would have to be re-recorded.
const viewportClip = async (page: Page): Promise<{
  x: number; y: number; width: number; height: number;
}> => page.evaluate(() => ({
  x: 0,
  y: 0,
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
}));

// TestCafe shot an element that outgrows the viewport by scrolling its start into view and taking
// the part of it that was on screen; the Playwright element screenshot would instead stitch the
// whole element, which no existing etalon matches. Only such an element takes this path — one that
// fits is shot as it always was.
const clippedToViewport = async (
  page: Page,
  locator: Locator,
): Promise<{ x: number; y: number; width: number; height: number } | null> => {
  const box = await locator.boundingBox();

  if (!box) {
    return null;
  }

  const viewport = await viewportClip(page);

  if (box.width <= viewport.width && box.height <= viewport.height) {
    return null;
  }

  // The clip has to stay inside the viewport: a full-page capture widens the viewport to the whole
  // document, the scrollbar goes away, and a widget that fills its container re-lays out to the
  // wider space — the shot would show a layout the page never had.
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

const expectScreenshot = async (
  page: Page,
  locator: Locator | null,
  name: string,
): Promise<void> => {
  if (!locator) {
    await expect(page).toHaveScreenshot([name], { clip: await viewportClip(page) });
    return;
  }

  const clip = await clippedToViewport(page, locator);

  if (clip) {
    await expect(page).toHaveScreenshot([name], { clip });
    return;
  }

  await expect(locator).toHaveScreenshot([name]);
};

export async function testScreenshot(
  page: Page,
  screenshotName: string,
  options?: ScreenshotOptions,
): Promise<void> {
  const {
    element,
    theme,
    shouldTestInCompact = false,
    compactCallBack,
    themeChanged,
  } = options ?? {};

  if (theme) {
    await changeTheme(page, theme);
    await themeChanged?.();
  }

  // No element means the whole viewport, the way the TestCafe comparer read a missing element.
  const target = resolveLocator(page, element);

  await expectScreenshot(page, target, getScreenshotName(screenshotName, theme));

  if (shouldTestInCompact) {
    // The theme of a "- compact" job already ends with the suffix; appending it twice would ask
    // for a theme that does not exist.
    const compactTheme = `${(theme ?? getFullThemeName()).replace(/\.compact$/, '')}.compact`;

    await changeTheme(page, compactTheme);
    await compactCallBack?.();

    await expectScreenshot(page, target, getScreenshotName(screenshotName, compactTheme));
  }

  if (theme || shouldTestInCompact) {
    await changeTheme(page, getFullThemeName());
  }
}
