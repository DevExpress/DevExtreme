import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Editing - showEditorAlways cell in new row should be editable (T1323684)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  (['cell', 'batch'] as const).forEach((mode) => {
    test.skip(`showEditorAlways editor should be editable in a new row when allowUpdating is false, ${mode} mode`, async ({ page }) => {
      // TODO: requires TestCafe page object conversion (getAddRowButton, isInserted, etc.)
    });
  });
});
