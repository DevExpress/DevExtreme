import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Focused row - markup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // TODO: Enable multi-theming testcafe run in the future.
  // visual: generic.light
  // visual: material.blue.light

  test('markup - generic.light', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
        keyExpr: 'id',
        focusedRowEnabled: true,
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
        dataSource: [{
          id: 0,
          dataA: 'dataA_1',
          dataB: 'dataB_1',
          dataC: 'dataC_1',
        }, {
          id: 1,
          dataA: 'dataA_2',
          dataB: 'dataB_2',
          dataC: 'dataC_2',
        }],
        columns: [{
          dataField: 'dataA',
          validationRules: [{ type: 'required' }],
        }, {
          dataField: 'dataB',
          validationRules: [{ type: 'required' }],
        }, {
          dataField: 'dataC',
          validationRules: [{ type: 'required' }],
        }],
      });

      const firstCell = page.locator('.dx-data-row').nth(0).locator('td').nth(0);
    const secondCell = page.locator('.dx-data-row').nth(0).locator('td').nth(1);
    const thirdCell = page.locator('.dx-data-row').nth(0).locator('td').nth(2);

    await (firstCell.element).click();
    await (firstCell.locator('.dx-editor-cell')).fill('TEST');

    await (secondCell.element).click();
    await (secondCell.locator('.dx-editor-cell')).fill(' ');

    await (thirdCell.element).click();

    await testScreenshot(page, 'focused-row_markup.png', { element: page.locator('#container') });
  });
});
