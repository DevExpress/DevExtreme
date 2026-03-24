import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Editing.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('The E0110 should not occur when editing a column with setCellValue in form mode (T1193894)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        ID: 1,
        Name: 'test',
      }],
      keyExpr: 'ID',
      editing: {
        mode: 'form',
        allowUpdating: true,
        editRowKey: 1,
      },
      columns: [{
        dataField: 'Name',
        setCellValue(rowData: any, value: any) {
          rowData.Name = value;
        },
      }],
      // @ts-expect-error private option
      templatesRenderAsynchronously: true,
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.getFormItemEditor(0).fill('new');
    await dataGrid.getEditForm().saveButton.click();

    await testScreenshot(page, 'grid-form-editing-T1193894.png', { element: page.locator('#container') });
  });
});
