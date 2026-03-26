import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Band columns: runtime change', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const GRID_CONTAINER = '#container';

  const dataSource = [
    { id: 0, A: 'A_0', B: 0 },
    { id: 1, A: 'A_1', B: 1 },
    { id: 2, A: 'A_2', B: 2 },
  ];

  const lookUpDataSource = [
    { id: 0, text: 'Lookup_value_0' },
    { id: 1, text: 'Lookup_value_1' },
    { id: 2, text: 'Lookup_value_2' },
  ];

  const nestedColumns = [
    { dataField: 'A' },
    {
      name: 'Nested',
      caption: 'Nested',
      columns: [
        {
          dataField: 'B',
          lookup: {
            dataSource: lookUpDataSource,
            valueExpr: 'id',
            displayExpr: 'text',
          },
        },
      ],
    },
  ];

  test.skip('Should change usual columns to band columns without error in React (T1213679)', async ({ page }) => {
    // TODO: Playwright migration - screenshot mismatch
    await createWidget(page, 'dxDataGrid', {
      dataSource: [...dataSource],
      columns: [
        { dataField: 'A' },
        {
          dataField: 'B',
          lookup: {
            dataSource: lookUpDataSource,
            valueExpr: 'id',
            displayExpr: 'text',
          },
        },
      ],
      keyExpr: 'id',
      showBorders: true,
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    await testScreenshot(page, 'band-columns_before-runtime-update.png', { element: page.locator('#container') });

    await page.evaluate(({ gridContainer, nested }) => {
      const dataGridWidget = ($(gridContainer) as any).dxDataGrid('instance');

      dataGridWidget.beginUpdate();

      dataGridWidget.option('columns[1].dataField', undefined);
      dataGridWidget.option('columns[1].lookup', undefined);
      dataGridWidget.option('columns[1].columns', nested[1].columns);
      dataGridWidget.option('columns[1].name', nested[1].name);
      dataGridWidget.option('columns[1].caption', nested[1].caption);

      dataGridWidget.endUpdate();
    }, { gridContainer: GRID_CONTAINER, nested: nestedColumns });

    await testScreenshot(page, 'band-columns_after-runtime-update.png', { element: page.locator('#container') });
  });
});
