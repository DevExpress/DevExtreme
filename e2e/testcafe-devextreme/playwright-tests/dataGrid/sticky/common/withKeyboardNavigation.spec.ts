import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const defaultColumns = [
  { dataField: 'OrderNumber', width: 130, caption: 'Invoice Number', fixed: true, fixedPosition: 'left' },
  { dataField: 'OrderDate', dataType: 'date' },
  { dataField: 'Employee' },
  { caption: 'City', dataField: 'CustomerStoreCity' },
  { caption: 'State', dataField: 'CustomerStoreState' },
  { dataField: 'SaleAmount', width: 160, alignment: 'right', format: 'currency' },
  { dataField: 'TotalAmount', width: 160, alignment: 'right', format: 'currency', fixed: true, fixedPosition: 'right' },
];

const defaultDataSource = [
  { ID: 1, OrderNumber: 35703, OrderDate: '2014-04-10', SaleAmount: 11800, TotalAmount: 12175, CustomerStoreState: 'California', CustomerStoreCity: 'Los Angeles', Employee: 'Harv Mudd' },
  { ID: 4, OrderNumber: 35711, OrderDate: '2014-01-12', SaleAmount: 16050, TotalAmount: 16550, CustomerStoreState: 'California', CustomerStoreCity: 'San Jose', Employee: 'Jim Packard' },
  { ID: 5, OrderNumber: 35714, OrderDate: '2014-01-22', SaleAmount: 14750, TotalAmount: 15250, CustomerStoreState: 'Nevada', CustomerStoreCity: 'Las Vegas', Employee: 'Harv Mudd' },
];

const createDefaultGrid = (page: any, extraOptions: Record<string, unknown> = {}) => createWidget(page, 'dxDataGrid', {
  width: 700,
  height: 500,
  dataSource: defaultDataSource,
  columnAutoWidth: true,
  keyExpr: 'ID',
  columns: defaultColumns,
  ...extraOptions,
});

test.describe('Fixed Columns - keyboard navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Headers navigation by Tab key when there are fixed columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        {
          field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
        },
      ],
      columns: [
        { dataField: 'field1', fixed: true },
        { dataField: 'field2' },
        { dataField: 'field3' },
        { dataField: 'field4', fixed: true, fixedPosition: 'right' },
      ],
      keyboardNavigation: {
        enabled: true,
      },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.focus();

    const headerRow = dataGrid.getHeaderRow();
    const firstHeaderCell = headerRow.locator('td').nth(0);

    await firstHeaderCell.click();
    await expect(firstHeaderCell).toBeFocused();

    await page.keyboard.press('Tab');

    const secondHeaderCell = headerRow.locator('td').nth(1);
    await expect(secondHeaderCell).toBeFocused();

    await page.keyboard.press('Tab');

    const thirdHeaderCell = headerRow.locator('td').nth(2);
    await expect(thirdHeaderCell).toBeFocused();

    await page.keyboard.press('Tab');

    const fourthHeaderCell = headerRow.locator('td').nth(3);
    await expect(fourthHeaderCell).toBeFocused();
  });

  test('Headers navigation by Shift and Tab keys when there are fixed columns', async ({ page }) => {
    await createDefaultGrid(page, {
      width: 625,
      customizeColumns: (columns: any[]) => {
        columns[4].width = 125;
        columns[4].fixed = true;
        columns[4].fixedPosition = 'sticky';
      },
    });

    const dataGrid = new DataGrid(page);
    const headerRow = dataGrid.getHeaders();

    const lastHeaderCell = headerRow.getHeaderCell(0, 6);
    await lastHeaderCell.click();

    const isLastFocused = await lastHeaderCell.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isLastFocused).toBe(true);

    await page.keyboard.press('Shift+Tab');

    const cell5 = headerRow.getHeaderCell(0, 5);
    const isCell5Focused = await cell5.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isCell5Focused).toBe(true);

    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');

    const cell0 = headerRow.getHeaderCell(0, 0);
    const isCell0Focused = await cell0.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isCell0Focused).toBe(true);
  });

  test('Data cells navigation by Tab key when there are fixed columns', async ({ page }) => {
    await createDefaultGrid(page, {
      width: 600,
      customizeColumns: (columns: any[]) => {
        columns[4].width = 125;
        columns[4].fixed = true;
        columns[4].fixedPosition = 'sticky';
      },
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.getDataCell(0, 0).element.click();

    const isCell0Focused = await dataGrid.getDataCell(0, 0).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isCell0Focused).toBe(true);

    await page.keyboard.press('Tab');
    const isCell1Focused = await dataGrid.getDataCell(0, 1).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isCell1Focused).toBe(true);

    await page.keyboard.press('Tab');
    const isCell2Focused = await dataGrid.getDataCell(0, 2).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isCell2Focused).toBe(true);

    await page.keyboard.press('Tab');
    const isCell3Focused = await dataGrid.getDataCell(0, 3).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isCell3Focused).toBe(true);

    await page.keyboard.press('Tab');
    const isCell4Focused = await dataGrid.getDataCell(0, 4).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isCell4Focused).toBe(true);

    await page.keyboard.press('Tab');
    const isCell5Focused = await dataGrid.getDataCell(0, 5).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isCell5Focused).toBe(true);

    await page.keyboard.press('Tab');
    const isCell6Focused = await dataGrid.getDataCell(0, 6).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isCell6Focused).toBe(true);
  });

  test('Data cells navigation by Shift and Tab keys when there are fixed columns', async ({ page }) => {
    await createDefaultGrid(page, {
      width: 625,
      customizeColumns: (columns: any[]) => {
        columns[4].width = 125;
        columns[4].fixed = true;
        columns[4].fixedPosition = 'sticky';
      },
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.getDataCell(0, 6).element.click();

    const isCell6Focused = await dataGrid.getDataCell(0, 6).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isCell6Focused).toBe(true);

    await page.keyboard.press('Shift+Tab');
    const isCell5Focused = await dataGrid.getDataCell(0, 5).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isCell5Focused).toBe(true);

    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');

    const isCell1Focused = await dataGrid.getDataCell(0, 1).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isCell1Focused).toBe(true);

    await page.keyboard.press('Shift+Tab');
    const isCell0Focused = await dataGrid.getDataCell(0, 0).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isCell0Focused).toBe(true);
  });

  test('Headers navigation by Tab key when there are fixed columns and adaptability is enabled', async ({ page }) => {
    await createDefaultGrid(page, {
      width: 650,
      columnWidth: 150,
      customizeColumns: (columns: any[]) => {
        columns[4].width = 125;
        columns[4].fixed = true;
        columns[4].fixedPosition = 'sticky';
        columns[5].hidingPriority = 0;
      },
    });

    const dataGrid = new DataGrid(page);
    const headerRow = dataGrid.getHeaders();

    const firstHeaderCell = headerRow.getHeaderCell(0, 0);
    await firstHeaderCell.click();

    const isFirstFocused = await firstHeaderCell.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isFirstFocused).toBe(true);

    await page.keyboard.press('Tab');
    const isCell1Focused = await headerRow.getHeaderCell(0, 1).evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isCell1Focused).toBe(true);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const isCell4Focused = await headerRow.getHeaderCell(0, 4).evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isCell4Focused).toBe(true);
  });

  test('Headers navigation by Shift and Tab keys when there are fixed columns and adaptability is enabled', async ({ page }) => {
    await createDefaultGrid(page, {
      width: 650,
      columnWidth: 150,
      customizeColumns: (columns: any[]) => {
        columns[4].width = 125;
        columns[4].fixed = true;
        columns[4].fixedPosition = 'sticky';
        columns[5].hidingPriority = 0;
      },
    });

    const dataGrid = new DataGrid(page);
    const headerRow = dataGrid.getHeaders();

    const lastHeaderCell = headerRow.getHeaderCell(0, 6);
    await lastHeaderCell.click();

    const isLastFocused = await lastHeaderCell.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isLastFocused).toBe(true);

    await page.keyboard.press('Shift+Tab');

    const cell4 = headerRow.getHeaderCell(0, 4);
    const isCell4Focused = await cell4.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isCell4Focused).toBe(true);

    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');

    const cell0 = headerRow.getHeaderCell(0, 0);
    const isCell0Focused = await cell0.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isCell0Focused).toBe(true);
  });

  test('Band headers navigation by Tab key when there are fixed columns', async ({ page }) => {
    await createDefaultGrid(page, {
      width: 600,
      customizeColumns: (columns: any[]) => {
        columns[3] = {
          caption: 'Band columns',
          columns: [{ dataField: 'CustomerStoreCity', width: 150 }],
        };
      },
    });

    const dataGrid = new DataGrid(page);
    const headerRow = dataGrid.getHeaders();

    const firstHeaderCell = headerRow.getHeaderCell(0, 0);
    await firstHeaderCell.click();

    const isFirstFocused = await firstHeaderCell.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isFirstFocused).toBe(true);

    for (let i = 1; i <= 6; i += 1) {
      await page.keyboard.press('Tab');
      const cell = headerRow.getHeaderCell(0, i);
      const isFocused = await cell.evaluate(
        (el) => el.classList.contains('dx-focused') || document.activeElement === el,
      );
      expect(isFocused).toBe(true);
    }

    await page.keyboard.press('Tab');
    const secondRowFirstCell = headerRow.getHeaderCell(1, 0);
    const isSecondRowFocused = await secondRowFirstCell.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isSecondRowFocused).toBe(true);
  });

  test('Band headers navigation by Shift and Tab key when there are fixed columns', async ({ page }) => {
    await createDefaultGrid(page, {
      width: 550,
      columnWidth: 200,
      customizeColumns: (columns: any[]) => {
        columns[5] = {
          caption: 'Band columns',
          columns: [{ dataField: 'SaleAmount', width: 150 }],
        };
      },
    });

    const dataGrid = new DataGrid(page);
    const headerRow = dataGrid.getHeaders();

    await dataGrid.getDataCell(0, 0).element.click();
    await page.keyboard.press('Shift+Tab');

    const secondRowFirstCell = headerRow.getHeaderCell(1, 0);
    const isSecondRowFocused = await secondRowFirstCell.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isSecondRowFocused).toBe(true);

    await page.keyboard.press('Shift+Tab');
    const cell6 = headerRow.getHeaderCell(0, 6);
    const isCell6Focused = await cell6.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isCell6Focused).toBe(true);
  });
});
