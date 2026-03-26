import { test, expect } from '@playwright/test';
import { createWidget, insertStylesheetRulesToPage } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Filter Builder Scrolling Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  // T1273328 > T1294239
  test.skip('FilterBuilder - The field drop-down closes with the page scroll', async ({ page }) => {

    await insertStylesheetRulesToPage(page, '#container {height: 150px; overflow: scroll;}');

    await createWidget(page, 'dxFilterBuilder', {
      fields,
      value: filter,
    });

    const filterBuilder = page.locator('#container');

    await filterBuilder.isReady();

    await page.click(filterBuilder.getItem('operation'))
      .scrollIntoView(filterBuilder.getItem('operation', 4));

    await expect(FilterBuilder.getPopupTreeView().exists).notOk();

    });
});
