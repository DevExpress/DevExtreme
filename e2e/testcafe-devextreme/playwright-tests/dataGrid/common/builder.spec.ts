import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Filter Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Field menu should be opened on field click if window scroll exists (T852701)', async ({ page }) => {
    const filter = [] as any[];
    const fields = [] as any[];

    for (let i = 1; i <= 50; i += 1) {
      if (i > 1) {
        filter.push('or');
      }
      const name = `Test${i}`;
      filter.push([name, '=', 'Test']);
      fields.push({ dataField: name });
    }

    await createWidget(page, 'dxFilterBuilder', {
      fields,
      value: filter,
    });

    await page.evaluate(() => window.scrollTo(0, 10000));

    const lastFieldButton = page.locator('.dx-filterbuilder-item-field').last();
    await lastFieldButton.click();

    const popupTreeView = page.locator('.dx-treeview.dx-widget');
    await expect(popupTreeView).toBeVisible();
  });
});
