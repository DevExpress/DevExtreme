import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Column reordering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('The column reordering should work correctly when there is a fixed column with zero width', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 800,
      dataSource: [
        {
          field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
        },
      ],
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      columns: [
        {
          dataField: 'field1',
          fixed: true,
          width: 200,
        }, {
          name: 'fake',
          fixed: true,
          width: 0.01,
        }, {
          dataField: 'field2',
          width: 200,
        }, {
          dataField: 'field3',
          width: 200,
        }, {
          dataField: 'field4',
          width: 200,
        },
      ],
      allowColumnReordering: true,
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    const columnsBefore = await dataGrid.apiGetVisibleColumns();

    await dataGrid.moveHeader(2, 200, 0, true);
    await dataGrid.dropHeader(2);

    const columnsAfter = await dataGrid.apiGetVisibleColumns();
    expect(columnsAfter.length).toBe(columnsBefore.length);
  });
});
