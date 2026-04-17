import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage, DataGrid } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe.skip('Focused row - markup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

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

    await firstCell.click();
    await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      instance.cellValue(0, 0, 'TEST');
    });

    await secondCell.click();
    await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      instance.cellValue(0, 1, ' ');
    });

    await thirdCell.click();

    await testScreenshot(page, 'focused-row_markup.png', { element: page.locator('#container') });
  });

  test('Invalid cells in a focused row should have the correct background color (T1197268) - generic.light', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      focusedRowEnabled: true,
      editing: {
        allowAdding: true,
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
      }, 'dataB', 'dataC'],
    });

    const dataGrid = new DataGrid(page, '#container');
    await dataGrid.apiAddRow();
    await dataGrid.apiSaveEditData();

    await testScreenshot(page, 'focused-row-invalid-cells.png', { element: page.locator('#container') });
  });

  test('Link should not have background color in generic.light (T1282624)', async ({ page }) => {
    await insertStylesheetRulesToPage(page, '#container tr.dx-row-focused td { background-color: red }');

    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0, text: 'text_1' },
        { id: 1, text: 'text_2' },
        { id: 2, text: 'text_3' },
      ],
      focusedRowEnabled: true,
      editing: {
        allowDeleting: true,
        useIcons: false,
      },
      focusedRowKey: 1,
      keyExpr: 'id',
    });

    await testScreenshot(page, 'focused-row-link-background.png', { element: page.locator('#container') });
  });
});
