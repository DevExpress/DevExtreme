import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const getNumberData = (rowCount: number, colCount: number): Record<string, number>[] => {
  const items: Record<string, number>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, number> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = i + j;
    items.push(item);
  }
  return items;
};

test.describe('FilterRow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Filter row\'s height should be adjusted by content (T1072609)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columns: [{
        dataField: 'Date',
        dataType: 'date',
        width: 140,
        selectedFilterOperation: 'between',
        filterValue: [new Date(2022, 2, 28), new Date(2022, 2, 29)],
      }],
      filterRow: { visible: true },
      wordWrapEnabled: true,
      showBorders: true,
    });

    await testScreenshot(page, 'T1072609.png', { element: page.locator('#container') });
  });

  test('FilterRow range overlay screenshot', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getNumberData(20, 2),
      height: 400,
      showBorders: true,
      filterRow: {
        visible: true,
        applyFilter: 'auto',
      },
      scrolling: {
        showScrollbar: 'never',
      },
    });

    const filterMenuButton = page.locator('.dx-datagrid-filter-row td').nth(1).locator('.dx-menu-item');
    await filterMenuButton.click();

    const betweenItem = page.locator('.dx-menu-item-text').filter({ hasText: 'Between' });
    await betweenItem.click();

    await expect(page.locator('.dx-datagrid-filter-range-overlay')).toBeVisible();

    await testScreenshot(page, 'filter-row-overlay.png');
  });

  test('Focus overlay should be visible in filter row when focusedRowEnabled is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { ID: 1, Field: 'Item 1' },
        { ID: 2, Field: 'Item 2' },
        { ID: 3, Field: 'Item 3' },
      ],
      keyExpr: 'ID',
      focusedRowEnabled: true,
      filterRow: { visible: true },
      showBorders: true,
      columns: ['ID', 'Field'],
    });

    await page.locator('.dx-data-row').first().locator('td').first().click();

    const filterInput = page.locator('.dx-datagrid-filter-row td').nth(1).locator('input');
    await filterInput.click();

    await expect(filterInput).toBeFocused();
    await testScreenshot(page, 'filter-row-focus-overlay.png', { element: page.locator('#container') });
  });

  test('DataGrid - The `between` filter dropdown sticks to the viewport edge during horizontal scrolling (T1280071)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { ID: 1, Text: 'Item 1' },
        { ID: 2, Text: '' },
        { ID: 3, Text: 'Item 3' },
      ],
      keyExpr: 'ID',
      filterRow: {
        visible: true,
      },
      scrolling: {
        useNative: true,
      },
      columnWidth: 400,
      width: 500,
    });

    const filterMenuButton = page.locator('.dx-datagrid-filter-row td').first().locator('.dx-menu-item');
    await filterMenuButton.click();

    const betweenItem = page.locator('.dx-menu-item-text').filter({ hasText: 'Between' });
    await betweenItem.click();

    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo({ x: 999 }));

    await testScreenshot(page, 'filter-row-filter-range-hide-on-scroll.png');
  });
});
