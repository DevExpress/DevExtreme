import type { Page } from '@playwright/test';

export const waitFont = (page: Page): Promise<void> => page.evaluate(
  () => (window as any).DevExpress.ui.themes.waitWebFont('Item123somevalu*op ', 400),
);
