import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

test.describe.skip('Header Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const GRID_CONTAINER = '#container';

  test('HeaderFilter popup screenshot', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 2),
      height: 400,
      showBorders: true,
      headerFilter: {
        visible: true,
      },
    });

    const filterIcon = page.locator('.dx-header-row').nth(0).locator('td').nth(0).locator('.dx-header-filter');
    await filterIcon.click();

    await expect(page.locator('.dx-header-filter-menu')).toBeVisible();

    await testScreenshot(page, 'header-filter-popup.png', { element: page.locator(GRID_CONTAINER) });
  });

  test('HeaderFilter icon should be grayed out after the clearFilter call (T1193648)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        ID: 1,
        Name: 'A',
      }, {
        ID: 2,
        Name: 'B',
      }],
      keyExpr: 'ID',
      showBorders: true,
      headerFilter: { visible: true },
      filterRow: { visible: true },
      columns: [{
        dataField: 'Name',
        filterValues: ['A'],
        filterValue: 'A',
      }],
      height: 140,
    });

    await page.evaluate(() => {
      ($('#container') as any).dxDataGrid('instance').clearFilter();
    });

    await testScreenshot(page, 'header-filter-icon-clear-filter.png', { element: page.locator(GRID_CONTAINER) });
  });

  test('The header filter should fit inside the viewport if the grid is scrolled horizontally (T1156848)', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      columns: ['Column1', 'Column2'],
      columnWidth: 250,
      width: 400,
      height: 400,
      headerFilter: { visible: true },
    });

    await dataGrid.scrollBy({ x: 100 });

    const filterIcon = page.locator('.dx-header-row').nth(0).locator('td').nth(0).locator('.dx-header-filter');
    await filterIcon.click();

    await testScreenshot(page, 'grid-header-filter-popup-T1156848.png', { element: page.locator(GRID_CONTAINER) });
  });

  test('DataGrid - Column Header filter does not properly work if the column caption contains double quotes (T1251768)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 1),
      headerFilter: {
        visible: true,
      },
      columns: [
        {
          dataField: 'Position',
          caption: '"סה"כ שולם"',
        },
        'FirstName',
      ],
    });

    const filterIcon = page.locator('.dx-header-row').nth(0).locator('td').nth(0).locator('.dx-header-filter');
    await filterIcon.click();

    await testScreenshot(page, 'T1251768-header-filter-double-quotes.png', { element: page.locator(GRID_CONTAINER) });
  });

  test('Data should be filtered if True is selected in the header filter when case sensitive is enabled (T1273020)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        store: [
          { ID: 1, text: 'true' },
          { ID: 2, text: 'True' },
        ],
        langParams: {
          locale: 'en-US',
          collatorOptions: {
            sensitivity: 'case',
          },
        },
      },
      keyExpr: 'ID',
      showBorders: true,
      headerFilter: { visible: true },
    });

    const filterIcon = page.locator('.dx-header-row').nth(0).locator('td').nth(1).locator('.dx-header-filter');
    const listItems = page.locator('.dx-header-filter-menu .dx-list-item');
    const okButton = page.locator('.dx-header-filter-menu .dx-button').first();

    await filterIcon.click();
    await listItems.nth(0).click();
    await okButton.click();

    await testScreenshot(page, 'T1273020-header-filter-with-case-sensitive-1.png', { element: page.locator(GRID_CONTAINER) });

    await filterIcon.click();
    await listItems.nth(0).click();
    await listItems.nth(1).click();
    await okButton.click();

    await testScreenshot(page, 'T1273020-header-filter-with-case-sensitive-2.png', { element: page.locator(GRID_CONTAINER) });
  });

  test.skip('Data should be filtered if (Blank) is selected in the header filter (T1257261)', async ({ page }) => {
    // TODO: Playwright migration - TestCafe API remnants (headerCell.getFilterIcon, new HeaderFilter, t.click)
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { ID: 1, Text: 'Item 1' },
        { ID: 2, Text: '' },
        { ID: 3, Text: 'Item 3' },
      ],
      keyExpr: 'ID',
      showBorders: true,
      remoteOperations: true,
      headerFilter: { visible: true },
      filterRow: { visible: true },
      filterPanel: { visible: true },
    });

    const result: string[] = [];
      const headerCell = page.locator('.dx-header-row').nth(0).locator('td').nth(1);
    const dataCell = page.locator('.dx-data-row').nth(0).locator('td').nth(0);
    const filterIconElement = headerCell.getFilterIcon();
    const headerFilter = new HeaderFilter();
    const buttons = headerFilter.getButtons();
    const list = headerFilter.getList();

    await (filterIconElement).click();
    await (list.getItem(1).element).click() // Select second item with value 'Item 1';
    await (buttons.nth(0)).click(); // Click OK;

    result[0] = await dataCell.element().innerText;

    await (filterIconElement).click();
    await (list.getItem(1).element).click() // Deselect second item with value 'Item 1';
    await (list.getItem(0).element).click() // Select second item with value '(Blanks)';
    await (buttons.nth(0)).click(); // Click OK;

    result[1] = await dataCell.element().innerText;

    expect(await result[0]).toBe('1')
      .expect(result[1]).toBe('2');
  });
});
