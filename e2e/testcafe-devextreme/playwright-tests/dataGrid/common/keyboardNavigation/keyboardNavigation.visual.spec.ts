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

test.describe('Keyboard Navigation.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // Quick navigation through grid cells via Home and End keys

  test('Focus the last cell in the row that contains focus when pressing the End key', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 7),
      columnWidth: 100,
      height: 500,
      width: 800,
      showBorders: true,
      scrolling: {
        showScrollbar: 'never',
      },
    });

    // arrange
      expect(await page.locator('.dx-datagrid').first().isVisible());
      await t.ok();

    // act
    await (page.locator('.dx-data-row').nth(0).locator('td').nth(0)).click();
    await page.keyboard.press('end');

    await testScreenshot(page, 'focus_last_cell_in_row_that_contains_focus_when_pressing_End_key.png', { element: page.locator('#container') });

    // assert
  });
});
