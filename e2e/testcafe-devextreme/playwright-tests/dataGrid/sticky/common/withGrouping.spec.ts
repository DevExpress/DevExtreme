import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('FixedColumns - Grouping', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const defaultDataSource = [
    {
      ID: 1, OrderNumber: 35703, OrderDate: '2014-04-10', SaleAmount: 11800,
      Terms: '15 Days', TotalAmount: 12175, CustomerStoreState: 'California',
      CustomerStoreCity: 'Los Angeles', Employee: 'Harv Mudd',
    },
    {
      ID: 4, OrderNumber: 35711, OrderDate: '2014-01-12', SaleAmount: 16050,
      Terms: '15 Days', TotalAmount: 16550, CustomerStoreState: 'California',
      CustomerStoreCity: 'San Jose', Employee: 'Jim Packard',
    },
    {
      ID: 5, OrderNumber: 35714, OrderDate: '2014-01-22', SaleAmount: 14750,
      Terms: '15 Days', TotalAmount: 15250, CustomerStoreState: 'Nevada',
      CustomerStoreCity: 'Las Vegas', Employee: 'Harv Mudd',
    },
    {
      ID: 7, OrderNumber: 35983, OrderDate: '2014-02-07', SaleAmount: 3725,
      Terms: '15 Days', TotalAmount: 3850, CustomerStoreState: 'Colorado',
      CustomerStoreCity: 'Denver', Employee: 'Todd Hoffman',
    },
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

  [false, true].forEach((rtlEnabled) => {
    test(`Sticky columns with grouping & summary (rtl=${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          {
            field1: 'test1', field2: 'test2', field3: 'group1', field4: 'test4', amount: 100,
          },
          {
            field1: 'test5', field2: 'test6', field3: 'group1', field4: 'test8', amount: 200,
          },
          {
            field1: 'test9', field2: 'test10', field3: 'group2', field4: 'test12', amount: 300,
          },
        ],
        rtlEnabled,
        columns: [
          { dataField: 'field1', fixed: true },
          { dataField: 'field2' },
          { dataField: 'field3', groupIndex: 0 },
          { dataField: 'field4' },
          { dataField: 'amount' },
        ],
        summary: {
          groupItems: [{
            column: 'amount',
            summaryType: 'sum',
            showInGroupFooter: false,
            alignByColumn: true,
          }],
        },
      });

      const dataGrid = new DataGrid(page);
      await expect(dataGrid.getContainer()).toBeVisible();

      const groupRow = dataGrid.getGroupRow(0);
      await expect(groupRow.element).toBeVisible();

      await testScreenshot(page, `sticky-columns-grouping-summary-rtl-${rtlEnabled}.png`, {
        element: '#container',
      });
    });
  });

  test('Sticky columns with grouping & summary (multiple groups)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 700,
      height: 500,
      dataSource: defaultDataSource,
      columnAutoWidth: true,
      keyExpr: 'ID',
      columns: defaultColumns,
      customizeColumns(columns: any[]) {
        columns[2].groupIndex = 0;
        columns[3].groupIndex = 1;
        columns[4].groupIndex = 2;
      },
      summary: {
        groupItems: [{
          column: 'OrderNumber',
          summaryType: 'count',
          displayFormat: '{0} orders',
        }, {
          column: 'TotalAmount',
          summaryType: 'sum',
          valueFormat: 'currency',
          displayFormat: 'Total: {0}',
          showInGroupFooter: true,
        }],
        totalItems: [{
          column: 'OrderNumber',
          summaryType: 'count',
          displayFormat: '{0} orders',
        }],
      },
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await testScreenshot(page, 'grouping-multiple-scroll-begin.png', { element: page.locator('#container') });

    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo({ x: 100 }));
    await testScreenshot(page, 'grouping-multiple-scroll-center.png', { element: page.locator('#container') });

    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo({ x: 10000 }));
    await testScreenshot(page, 'grouping-multiple-scroll-end.png', { element: page.locator('#container') });
  });

  test('Sticky columns with grouping - overflow of group cell', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 700,
      height: 500,
      dataSource: defaultDataSource,
      columnAutoWidth: true,
      keyExpr: 'ID',
      columns: defaultColumns,
      customizeColumns(columns: any[]) {
        columns[2].groupIndex = 0;
      },
      summary: {
        groupItems: [{
          column: 'OrderDate',
          summaryType: 'count',
          alignByColumn: true,
        }],
      },
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await testScreenshot(page, 'grouping-overflow-cell.png', { element: page.locator('#container') });
  });

  test('DataGrid - Group row content is scrolled if repaintChangesOnly is enabled and the grid has a fixed column (T1286077)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 700,
      height: 500,
      dataSource: defaultDataSource,
      columnAutoWidth: false,
      keyExpr: 'ID',
      columns: defaultColumns,
      customizeColumns(columns: any[]) {
        columns[2].groupIndex = 0;
      },
      columnWidth: 200,
      repaintChangesOnly: true,
      grouping: {
        autoExpandAll: false,
      },
      scrolling: {
        showScrollbar: 'never',
      },
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    const groupPanelToggle = page.locator('.dx-group-row').first().locator('td').first();
    await groupPanelToggle.click();

    await expect(page.locator('.dx-group-row').first()).toBeVisible();
    const isExpanded = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').isRowExpanded(($('#container') as any).dxDataGrid('instance').getKeyByRowIndex(0)));
    expect(isExpanded).toBeTruthy();

    await groupPanelToggle.click();

    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo({ x: 1000 }));

    await testScreenshot(page, 'group_row_scrolling_all_collapsed_fixed_columns.png', { element: page.locator('#container') });
  });

  [false, true].forEach((rtlEnabled) => {
    test(`DataGrid - Group summaries are shown over sticky columns on a horizontal scroll - intersection (rtl=${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        width: 700,
        height: 500,
        dataSource: defaultDataSource,
        columnAutoWidth: true,
        keyExpr: 'ID',
        columns: defaultColumns,
        rtlEnabled,
        customizeColumns(columns: any[]) {
          columns[2].groupIndex = 0;
          columns[1].visible = false;
          columns[3].width = 200;
        },
        summary: {
          groupItems: [{
            column: 'OrderNumber',
            summaryType: 'count',
            displayFormat: '{0} orders',
          }, {
            column: 'TotalAmount',
            summaryType: 'sum',
            valueFormat: 'currency',
            displayFormat: 'Total: {0}',
            showInGroupFooter: true,
          }],
          totalItems: [{
            column: 'OrderNumber',
            summaryType: 'count',
            displayFormat: '{0} orders',
          }],
        },
      });

      const dataGrid = new DataGrid(page);
      await expect(dataGrid.getContainer()).toBeVisible();

      await testScreenshot(page, `grouping-scroll-total_summary_intersection-rtl=${rtlEnabled}.png`, { element: page.locator('#container') });
    });
  });

  [false, true].forEach((rtlEnabled) => {
    test(`DataGrid - Group summaries are shown over sticky columns on a horizontal scroll (rtl=${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        width: 700,
        height: 500,
        dataSource: defaultDataSource,
        columnAutoWidth: true,
        keyExpr: 'ID',
        columns: defaultColumns,
        rtlEnabled,
        customizeColumns(columns: any[]) {
          columns[2].groupIndex = 0;
          columns[1].visible = false;
          columns[4].width = 150;
        },
        summary: {
          groupItems: [{
            column: 'OrderNumber',
            summaryType: 'count',
            displayFormat: '{0} orders',
          }, {
            column: 'TotalAmount',
            summaryType: 'sum',
            valueFormat: 'currency',
            displayFormat: 'Total: {0}',
            showInGroupFooter: true,
          }],
          totalItems: [{
            column: 'SaleAmount',
            summaryType: 'max',
            valueFormat: 'currency',
            displayFormat: 'MAXMAXMAXMAX: {0}',
          }],
        },
      });

      const dataGrid = new DataGrid(page);
      await expect(dataGrid.getContainer()).toBeVisible();

      await testScreenshot(page, `grouping-scroll-total_summary-rtl=${rtlEnabled}.png`, { element: page.locator('#container') });
    });
  });
});
