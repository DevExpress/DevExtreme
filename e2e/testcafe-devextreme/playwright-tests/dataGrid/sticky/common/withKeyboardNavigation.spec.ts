import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
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

  const navigateToNextCell = async (t, $headerCell) => {
    // act
    await t
      .pressKey('tab');

    // assert
    await t
      .expect($headerCell.isFocused)
      .ok();
  };

  const navigateToPrevCell = async (t, $headerCell) => {
    // act
    await t
      .pressKey('shift+tab');

    // assert
    await t
      .expect($headerCell.isFocused)
      .ok();
  };

  );

  test('Headers navigation by Tab key when there are fixed columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      ...defaultConfig,
      width: 600,
      customizeColumns(columns) {
        columns[4].width = 125;
        columns[4].fixed = true;
        columns[4].fixedPosition = 'sticky';
      },
    });

    // arrange
      const headers = page.locator('.dx-header-row');
    const headerRow = headers.getHeaderRow(0);

    expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    // act
    await (headerRow.locator('td').nth(0).element).click();

    // assert
    expect(await headerRow.locator('td').nth(0).isFocused);
    await t.ok();

    // act
    await navigateToNextCell(t, headerRow.locator('td').nth(1));
    await navigateToNextCell(t, headerRow.locator('td').nth(2));
    await navigateToNextCell(t, headerRow.locator('td').nth(3));

    await testScreenshot(page, 'fixed_columns_headers_navigation_by_tab_1.png', { element: page.locator('#container') });

    // act
    await navigateToNextCell(t, headerRow.locator('td').nth(4));
    await navigateToNextCell(t, headerRow.locator('td').nth(5));

    await testScreenshot(page, 'fixed_columns_headers_navigation_by_tab_2.png', { element: page.locator('#container') });

    // act
    await navigateToNextCell(t, headerRow.locator('td').nth(6));

    // assert
  });
});
