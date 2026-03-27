import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const defaultConfig = {
  width: 700,
  height: 500,
  dataSource: [{
    ID: 1, OrderNumber: 35703, OrderDate: '2014-04-10', SaleAmount: 11800,
    Terms: '15 Days', TotalAmount: 12175, CustomerStoreState: 'California',
    CustomerStoreCity: 'Los Angeles', Employee: 'Harv Mudd',
  }, {
    ID: 4, OrderNumber: 35711, OrderDate: '2014-01-12', SaleAmount: 16050,
    Terms: '15 Days', TotalAmount: 16550, CustomerStoreState: 'California',
    CustomerStoreCity: 'San Jose', Employee: 'Jim Packard',
  }, {
    ID: 5, OrderNumber: 35714, OrderDate: '2014-01-22', SaleAmount: 14750,
    Terms: '15 Days', TotalAmount: 15250, CustomerStoreState: 'Nevada',
    CustomerStoreCity: 'Las Vegas', Employee: 'Harv Mudd',
  }, {
    ID: 7, OrderNumber: 35983, OrderDate: '2014-02-07', SaleAmount: 3725,
    Terms: '15 Days', TotalAmount: 3850, CustomerStoreState: 'Colorado',
    CustomerStoreCity: 'Denver', Employee: 'Todd Hoffman',
  }],
  columnAutoWidth: true,
  keyExpr: 'ID',
  columns: [{
    dataField: 'OrderNumber',
    width: 130,
    caption: 'Invoice Number',
    fixed: true,
    fixedPosition: 'left',
  }, {
    dataField: 'OrderDate',
    dataType: 'date',
  }, {
    dataField: 'Employee',
  }, {
    caption: 'City',
    dataField: 'CustomerStoreCity',
  }, {
    caption: 'State',
    dataField: 'CustomerStoreState',
  }, {
    dataField: 'SaleAmount',
    width: 160,
    alignment: 'right',
    format: 'currency',
  }, {
    dataField: 'TotalAmount',
    width: 160,
    alignment: 'right',
    format: 'currency',
    fixed: true,
    fixedPosition: 'right',
  }],
};

test.describe('Sticky columns - Multi Row Header Columns', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 800 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  // visual: generic.light
  // visual: material.blue.light
  // visual: fluent.blue.light
  test('The multi row header columns should have vertical borders when a column is fixed (generic.light theme) (T1282595)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      ...defaultConfig,
      columns: [
        {
          dataField: 'ID',
          fixed: true,
        },
        {
          caption: 'Order',
          columns: [
            'OrderNumber',
            'OrderDate',
          ],
        },
        'SaleAmount',
        'Terms',
      ],
      showBorders: true,
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    await testScreenshot(page, 'multi_row_header_columns.png', { element: page.locator('#container') });
  });
});
