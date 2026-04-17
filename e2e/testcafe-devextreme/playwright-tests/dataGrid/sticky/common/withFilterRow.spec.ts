import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const defaultDataSource = [
  { ID: 1, OrderNumber: 35703, OrderDate: '2014-04-10', SaleAmount: 11800, TotalAmount: 12175, Employee: 'Harv Mudd', CustomerStoreCity: 'Los Angeles', CustomerStoreState: 'California' },
  { ID: 4, OrderNumber: 35711, OrderDate: '2014-01-12', SaleAmount: 16050, TotalAmount: 16550, Employee: 'Jim Packard', CustomerStoreCity: 'San Jose', CustomerStoreState: 'California' },
  { ID: 5, OrderNumber: 35714, OrderDate: '2014-01-22', SaleAmount: 14750, TotalAmount: 15250, Employee: 'Harv Mudd', CustomerStoreCity: 'Las Vegas', CustomerStoreState: 'Nevada' },
];

const defaultColumns = [
  { dataField: 'OrderNumber', width: 130, fixed: true, fixedPosition: 'left' },
  { dataField: 'OrderDate', dataType: 'date' },
  { dataField: 'Employee' },
  { dataField: 'CustomerStoreCity', caption: 'City' },
  { dataField: 'CustomerStoreState', caption: 'State' },
  { dataField: 'SaleAmount', width: 160, alignment: 'right', format: 'currency' },
  { dataField: 'TotalAmount', width: 160, alignment: 'right', format: 'currency', fixed: true, fixedPosition: 'right' },
];

test.describe('Sticky columns - Filter row', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 800 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Filter row with sticky columns (generic.light theme)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 700,
      height: 500,
      dataSource: defaultDataSource,
      columnAutoWidth: true,
      keyExpr: 'ID',
      columns: defaultColumns,
      filterRow: {
        visible: true,
      },
    });

    expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await page.locator('.dx-datagrid-filter-row td').nth(1).click();

    await testScreenshot(page, 'filter_row_with_sticky_columns_1.png', { element: page.locator('#container') });

    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: 10000 });

    await testScreenshot(page, 'filter_row_with_sticky_columns_2.png', { element: page.locator('#container') });
  });

  test('Filter row with sticky columns when there are band columns and showColumnHeaders = false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 700,
      height: 500,
      dataSource: defaultDataSource,
      columnAutoWidth: true,
      keyExpr: 'ID',
      columns: defaultColumns,
      filterRow: {
        visible: true,
      },
      showColumnHeaders: false,
      customizeColumns(columns: any[]) {
        columns.push({
          caption: 'Band column',
          columns: ['CustomerStoreCity', 'CustomerStoreState'],
        });
      },
    });

    expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await page.locator('.dx-datagrid-filter-row td').nth(1).click();

    await testScreenshot(page, 'filter_row_with_sticky_and_band_columns_1_(showColumnHeaders_=_false).png', { element: page.locator('#container') });

    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: 10000 });

    await testScreenshot(page, 'filter_row_with_sticky_and_band_columns_2_(showColumnHeaders_=_false).png', { element: page.locator('#container') });
  });
});
