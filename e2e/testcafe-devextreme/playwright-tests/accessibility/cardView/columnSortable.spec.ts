import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - CardView columnSortable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('column sortable accessibility check', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      allowColumnReordering: true,
      columnChooser: { enabled: true },
      headerFilter: { visible: true },
      columns: [{
        dataField: 'test',
        allowReordering: true,
        sortOrder: 'asc',
      }],
    });
    await a11yCheck(page, { rules: { 'color-contrast': { enabled: false } } }, '#container');
  });
});
