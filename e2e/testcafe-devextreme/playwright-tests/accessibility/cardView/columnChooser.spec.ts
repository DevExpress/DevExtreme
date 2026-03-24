import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - CardView columnChooser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('select mode', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columnChooser: { enabled: true, mode: 'select', height: 400, width: 400 },
      columns: [
        { dataField: 'Column 1', visible: false },
        { dataField: 'Column 2' },
        { dataField: 'Column 4' },
      ],
    });
    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').showColumnChooser();
    });
    await a11yCheck(page, {}, '#container');
  });

  test('dragAndDrop mode', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columnChooser: { enabled: true, mode: 'dragAndDrop', height: 400, width: 400 },
      columns: [
        { dataField: 'Column 1', visible: false },
        { dataField: 'Column 4', visible: false },
      ],
    });
    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').showColumnChooser();
    });
    await a11yCheck(page, {}, '#container');
  });

  test('cardView with opened columnChooser', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: Array.from({ length: 50 }, (_, i) => ({ value: `value_${i}` })),
      columnChooser: { enabled: true },
      columns: [{ dataField: 'value' }],
    });
    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').showColumnChooser();
    });
    await a11yCheck(page, {}, '#container');
  });
});
