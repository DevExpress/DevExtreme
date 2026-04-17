import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

// TODO: import defaultConfig from sticky helpers or inline the data

test.describe('Sticky columns - Row Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 800 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const defaultDataSource = [
    { ID: 1, OrderNumber: 35703, OrderDate: '2014-04-10', SaleAmount: 11800, TotalAmount: 12175, Employee: 'Harv Mudd' },
    { ID: 4, OrderNumber: 35711, OrderDate: '2014-01-12', SaleAmount: 16050, TotalAmount: 16550, Employee: 'Jim Packard' },
    { ID: 5, OrderNumber: 35714, OrderDate: '2014-01-22', SaleAmount: 14750, TotalAmount: 15250, Employee: 'Harv Mudd' },
    { ID: 7, OrderNumber: 35983, OrderDate: '2014-02-07', SaleAmount: 3725, TotalAmount: 3850, Employee: 'Todd Hoffman' },
    { ID: 9, OrderNumber: 36987, OrderDate: '2014-03-11', SaleAmount: 14200, TotalAmount: 14800, Employee: 'Clark Morgan' },
  ];

  const defaultColumns = [
    { dataField: 'OrderNumber', width: 130, fixed: true, fixedPosition: 'left' },
    { dataField: 'OrderDate', dataType: 'date' },
    { dataField: 'Employee' },
    { dataField: 'SaleAmount', width: 160, alignment: 'right', format: 'currency' },
    { dataField: 'TotalAmount', width: 160, alignment: 'right', format: 'currency', fixed: true, fixedPosition: 'right' },
  ];

  test('The selected row should be displayed correctly when there are sticky columns (generic.light theme)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 700,
      height: 500,
      dataSource: defaultDataSource,
      columnAutoWidth: true,
      keyExpr: 'ID',
      columns: defaultColumns,
      selection: {
        mode: 'multiple',
      },
      selectedRowKeys: [4],
    });

    expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await testScreenshot(page, 'row_selection_with_sticky_columns_1.png', { element: page.locator('#container') });

    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: 10000 });

    await testScreenshot(page, 'row_selection_with_sticky_columns_2.png', { element: page.locator('#container') });
  });
});
