import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const defaultDataSource = [
  { ID: 1, OrderNumber: 35703, OrderDate: '2014-04-10', SaleAmount: 11800, TotalAmount: 12175, Employee: 'Harv Mudd' },
  { ID: 4, OrderNumber: 35711, OrderDate: '2014-01-12', SaleAmount: 16050, TotalAmount: 16550, Employee: 'Jim Packard' },
  { ID: 5, OrderNumber: 35714, OrderDate: '2014-01-22', SaleAmount: 14750, TotalAmount: 15250, Employee: 'Harv Mudd' },
  { ID: 7, OrderNumber: 35983, OrderDate: '2014-02-07', SaleAmount: 3725, TotalAmount: 3850, Employee: 'Todd Hoffman' },
];

const defaultColumns = [
  { dataField: 'OrderNumber', width: 130, fixed: true, fixedPosition: 'left' },
  { dataField: 'OrderDate', dataType: 'date' },
  { dataField: 'Employee' },
  { dataField: 'SaleAmount', width: 160, alignment: 'right', format: 'currency' },
  { dataField: 'TotalAmount', width: 160, alignment: 'right', format: 'currency', fixed: true, fixedPosition: 'right' },
];

const masterDetailLoremText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

test.describe('FixedColumns - MasterDetail', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Sticky columns with master-detail', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 700,
      height: 500,
      dataSource: defaultDataSource,
      columnAutoWidth: true,
      keyExpr: 'ID',
      columns: defaultColumns,
      masterDetail: {
        enabled: true,
        template(container: any) {
          $(container).text(masterDetailLoremText);
        },
      },
    });

    expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    const dataGrid = new DataGrid(page);
    await dataGrid.apiExpandRow(1);

    await testScreenshot(page, 'masterdetail-scroll-begin.png', { element: page.locator('#container') });

    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: 100 });
    await testScreenshot(page, 'masterdetail-scroll-center.png', { element: page.locator('#container') });

    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: 10000 });
    await testScreenshot(page, 'masterdetail-scroll-end.png', { element: page.locator('#container') });
  });

  test('Master detail resizing', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 700,
      height: 500,
      dataSource: defaultDataSource,
      columnAutoWidth: true,
      keyExpr: 'ID',
      columns: defaultColumns,
      masterDetail: {
        enabled: true,
        template(container: any) {
          $(container).text(masterDetailLoremText);
        },
      },
    });

    expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    const dataGrid = new DataGrid(page);
    await dataGrid.apiExpandRow(1);

    await testScreenshot(page, 'masterdetail-before-resize.png', { element: page.locator('#container') });

    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').option('width', 500));

    await testScreenshot(page, 'masterdetail-after-resize.png', { element: page.locator('#container') });
  });
});
