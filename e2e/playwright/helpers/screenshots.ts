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

const expectScreenshot = async (
  page: Page,
  locator: Locator | null,
  name: string,
): Promise<void> => {
  if (!locator) {
    await expect(page).toHaveScreenshot([name], { clip: await viewportClip(page) });
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
