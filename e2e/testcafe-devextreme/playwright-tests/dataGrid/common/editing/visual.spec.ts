import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
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
  const encodedIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIwcHgiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iIzAwMDAwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KCTxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIC8+DQo8L3N2Zz4NCg==';

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
        setCellValue(rowData, value) {
          rowData.Name = value;
        },
      }],
      // @ts-expect-error private option
      templatesRenderAsynchronously: true,
    });

      // act
    await (dataGrid.getFormItemEditor(0)).fill('new');
    await (dataGrid.getEditForm().saveButton).click();

    // assert
    await testScreenshot(page, 'grid-form-editing-T1193894.png', { element: page.locator('#container') });
  });
});
