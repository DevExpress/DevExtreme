import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const GRID_SELECTOR = '#container';

  );

  test('Validation popup screenshot', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 2),
      height: 400,
      showBorders: true,
      columns: [{
        dataField: 'field_0',
        validationRules: [{ type: 'required' }],
      }, {
        dataField: 'field_1',
        validationRules: [{ type: 'required' }],
      }],
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
    });

      await t.maximizeWindow();
      await (page.locator('.dx-data-row').nth(0).locator('td').nth(0)).click();
      await page.keyboard.press('ctrl+a backspace enter');

    // act
    await testScreenshot(page, 'validation-popup.png', { element: page.locator('#container') });

    // assert
    expect(await dataGrid.getRevertTooltip().exists);
    await t.ok();
    expect(await dataGrid.getInvalidMessageTooltip().exists);
    await t.ok();
    expect(await compareResults.isValid());
    await t.ok(compareResults.errorMessages());
  });
});
