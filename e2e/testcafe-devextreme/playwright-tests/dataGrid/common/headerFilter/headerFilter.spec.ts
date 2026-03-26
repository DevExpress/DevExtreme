import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
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

test.describe('Header Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const GRID_CONTAINER = '#container';

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
