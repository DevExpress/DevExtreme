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
    {
      id: 0,
      A: 'A_0',
      B: 0,
    },
    {
      id: 1,
      A: 'A_1',
      B: 1,
    },
    {
      id: 2,
      A: 'A_2',
      B: 2,
    },
  ];

  const lookUpDataSource = [
    {
      id: 0,
      text: 'Lookup_value_0',
    },
    {
      id: 1,
      text: 'Lookup_value_1',
    },
    {
      id: 2,
      text: 'Lookup_value_2',
    },
  ];

  const columns = [
    {
      dataField: 'A',
    },
    {
      dataField: 'B',
      lookup: {
        dataSource: lookUpDataSource,
        valueExpr: 'id',
        displayExpr: 'text',
      },
    },
  ];

  const nestedColumns = [
    {
      dataField: 'A',
    },
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

  const changeDataGridColumnsReactWay = ClientFunction(() => {
    const dataGridWidget = ($(`${GRID_CONTAINER}`) as any).dxDataGrid('instance');

    dataGridWidget.beginUpdate();

    dataGridWidget.option('columns[1].dataField', undefined);
    dataGridWidget.option('columns[1].lookup', undefined);
    dataGridWidget.option('columns[1].columns', nestedColumns[1].columns);
    dataGridWidget.option('columns[1].name', nestedColumns[1].name);
    dataGridWidget.option('columns[1].caption', nestedColumns[1].caption);

    dataGridWidget.endUpdate();
  }, { dependencies: { GRID_CONTAINER, nestedColumns } });

  test('Should change usual columns to band columns without error in React (T1213679)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
        dataSource: [...dataSource],
        columns: [...columns],
        keyExpr: 'id',
        showBorders: true,
      });

      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await testScreenshot(page, 'band-columns_before-runtime-update.png', { element: page.locator('#container') });

    await changeDataGridColumnsReactWay();

    await testScreenshot(page, 'band-columns_after-runtime-update.png', { element: page.locator('#container') });
  });
});
