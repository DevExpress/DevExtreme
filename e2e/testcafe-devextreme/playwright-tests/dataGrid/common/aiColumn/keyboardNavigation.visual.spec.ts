import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Ai Column.KeyboardNavigation.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test.skip('Check keyboard navigation for AI column', async ({ page }) => {
    // TODO: Playwright migration - TestCafe API remnants (element.click, element.focused, getAIDropDownButton, t.ok)
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
        { id: 2, name: 'Name 2', value: 20 },
        { id: 3, name: 'Name 3', value: 30 },
      ],
      keyExpr: 'id',
      allowColumnReordering: true,
      columnWidth: 200,
      columns: [
        { dataField: 'id', caption: 'ID' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myAiColumn',
        },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
      ],
    });

    // arrange
      const headerRow = page.locator('.dx-header-row').nth(0);
    expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    // act
    await (headerRow.locator('td').nth(0).element).click();
    await page.keyboard.press('tab');

    // assert
    expect(await headerRow.locator('.dx-command-edit').nth(1).element.focused).toBeTruthy();

    // act
    await page.keyboard.press('tab');

    // assert
    expect(await headerRow.locator('.dx-command-edit').nth(1).getAIDropDownButton().isFocused).toBeTruthy();

    await testScreenshot(page, 'datagrid__ai-column__focused-dropdown-button.png', { element: page.locator('#container') });

    // act
    await page.keyboard.press('tab');

    // assert
    expect(await headerRow.locator('td').nth(2).isFocused);
    await t.ok();
    expect(await compareResults.isValid());
    await t.ok(compareResults.errorMessages());
  });
});
