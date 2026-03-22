import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('CardView - ColumnChooser.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test("column chooser in 'select' mode", async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columnChooser: {
        enabled: true,
        mode: 'select',
        height: 400,
        width: 400,
        search: { enabled: true },
        selection: { allowSelectAll: true },
      },
      columns: [
        { dataField: 'Column 1', visible: false },
        { dataField: 'Column 2', allowHiding: false },
        { dataField: 'Column 3', showInColumnChooser: false },
        { dataField: 'Column 4' },
      ],
    });

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').showColumnChooser();
    });

    await testScreenshot(page, 'card-view_column-chooser_select_mode.png', {
      element: page.locator('.dx-cardview-column-chooser .dx-overlay-content'),
    });
  });

  test("column chooser in 'dragAndDrop' mode", async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columnChooser: {
        enabled: true,
        mode: 'dragAndDrop',
        height: 400,
        width: 400,
        search: { enabled: true },
      },
      columns: [
        { dataField: 'Column 1', visible: false },
        { dataField: 'Column 2', visible: false, allowHiding: false },
        { dataField: 'Column 3', visible: false, showInColumnChooser: false },
        { dataField: 'Column 4', visible: false },
      ],
    });

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').showColumnChooser();
    });

    await testScreenshot(page, 'card-view_column-chooser_drag_mode.png', {
      element: page.locator('.dx-cardview-column-chooser .dx-overlay-content'),
    });
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

    await testScreenshot(page, 'card-view_with_opened_column-chooser.png', {
      element: page.locator('#container'),
    });
  });
});
