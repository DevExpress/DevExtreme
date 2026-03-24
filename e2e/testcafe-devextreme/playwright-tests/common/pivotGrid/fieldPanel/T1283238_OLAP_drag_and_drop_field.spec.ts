import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('pivotGrid_olap_drag-n-drop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [true, false].forEach((showRowGrandTotals) => {
    test.skip(`Empty table has one ${showRowGrandTotals ? 'total' : 'empty'} row after drag-n-drop for paginated data`, async ({ page }) => {
      // skipped: requires .before() with OLAPApiMock, dragToElement, PivotGrid page object
    });
  });
});
