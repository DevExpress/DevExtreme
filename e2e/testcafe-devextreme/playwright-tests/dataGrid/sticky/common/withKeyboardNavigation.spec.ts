import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Fixed Columns - keyboard navigation', () => {
  test.beforeEach(async ({ page }) => {
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
});
