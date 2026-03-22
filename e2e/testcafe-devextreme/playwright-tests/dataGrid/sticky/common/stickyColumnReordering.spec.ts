import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Reorder columns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('Move left fixed column to the right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 25),
      columnAutoWidth: true,
      allowColumnReordering: true,
      columnWidth: 100,
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'left';
      },
    });

    // arrange
      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    // act
    await t.drag(page.locator('.dx-header-row').nth(0).locator('td').nth(0), 400, 0);

    await testScreenshot(page, 'move_left_fixed_column_to_right.png', { element: page.locator('#container') });

    // assert
  });
});
