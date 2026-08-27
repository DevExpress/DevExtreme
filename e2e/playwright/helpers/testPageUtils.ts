import type { Page } from '@playwright/test';
import { DEFAULT_THEME, TEST_PAGE_URL } from './const';

export async function openTestPage(page: Page): Promise<void> {
  await page.goto(TEST_PAGE_URL);
  await page.waitForFunction(() => !!(window as any).DevExpress);
}

export async function changeTheme(page: Page, themeName: string): Promise<void> {
  await page.evaluate(async (theme) => {
    const { themes } = (window as any).DevExpress.ui;

    if (themes.current() === theme) {
      return;
    }

    await new Promise<void>((resolve) => {
      themes.ready(resolve);
      themes.current(theme);
    });
  }, themeName);
}

export async function getCurrentTheme(page: Page): Promise<string> {
  const theme = await page.evaluate(() => (window as any).DevExpress?.ui.themes.current());

  return theme ?? DEFAULT_THEME;
}

export async function resetPageState(page: Page): Promise<void> {
  await page.evaluate(() => {
    if (document.activeElement && document.activeElement !== document.body) {
      (document.activeElement as HTMLElement).blur();
    }

    window.getSelection()?.removeAllRanges();
  });

  await page.mouse.move(1, 1);
}
