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

// No element means the whole viewport, the way the TestCafe comparer read a missing element.
const resolveTarget = (
  page: Page,
  element: Locator | string | null | undefined,
): Locator | Page => {
  if (typeof element === 'string') {
    return page.locator(element);
  }

  return element ?? page;
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

  const target = resolveTarget(page, element);

  await expect(target).toHaveScreenshot([getScreenshotName(screenshotName, theme)]);

  if (shouldTestInCompact) {
    const themeName = theme ?? getFullThemeName();

    await changeTheme(page, `${themeName}.compact`);
    await compactCallBack?.();

    await expect(target).toHaveScreenshot([getScreenshotName(screenshotName, `${themeName}.compact`)]);
  }

  if (theme || shouldTestInCompact) {
    await changeTheme(page, getFullThemeName());
  }
}
