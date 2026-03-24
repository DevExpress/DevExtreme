import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

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

export async function testScreenshot(
  page: Page,
  screenshotName: string,
  options?: {
    element?: Locator | string | null;
    theme?: string;
    shouldTestInCompact?: boolean;
  },
): Promise<void> {
  const {
    element,
    theme,
    shouldTestInCompact = false,
  } = options ?? {};

  if (theme) {
    await changeTheme(page, theme);
  }

  const locator = typeof element === 'string'
    ? page.locator(element)
    : element ?? page.locator('#container');

  await expect(locator).toHaveScreenshot([getScreenshotName(screenshotName, theme)]);

  if (shouldTestInCompact) {
    const themeName = (theme ?? process.env.theme) ?? defaultThemeName;
    await changeTheme(page, `${themeName}.compact`);

    await expect(locator).toHaveScreenshot(
      [getScreenshotName(screenshotName, `${themeName}.compact`)],
    );
  }

  if (theme || shouldTestInCompact) {
    await changeTheme(page, process.env.theme ?? defaultThemeName);
  }
}
