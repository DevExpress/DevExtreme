import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe.skip('Editing - cell focus', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  // T1154721
  test('Should allow focus next editor in the same column after save changes with local data source', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      dataSource: [{
        id: 0,
        data: 'A',
      }, {
        id: 1,
        data: 'B',
      }, {
        id: 2,
        data: 'C',
      }],
      editing: {
        allowUpdating: true,
        refreshMode: 'repaint',
        mode: 'cell',
      },
      columns: [{
        dataField: 'data',
        showEditorAlways: true,
      }],
      repaintChangesOnly: true,
    });

    const dataGrid = new DataGrid(page);

    const firstEditor = dataGrid.getDataCell(0, 0).element.locator('.dx-texteditor-input');
    const secondEditor = dataGrid.getDataCell(2, 0).element.locator('.dx-texteditor-input');
    const middleCell = dataGrid.getDataCell(1, 0).element;

    await firstEditor.click();
    await firstEditor.pressSequentially(' AAA');
    await secondEditor.click();
    await secondEditor.pressSequentially(' CCC');
    await middleCell.click();

    const firstCellValue = await firstEditor.inputValue();
    const secondCellValue = await secondEditor.inputValue();

    expect(firstCellValue).toBe('A AAA');
    expect(secondCellValue).toBe('C CCC');
  });

  // T1037019
  test('Should allow focus next editor in the same column after save changes with remote data source', async ({ page }) => {
    await page.route('**/api/data', (route) => {
      route.fulfill({
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify({
          data: [
            { id: 0, data: 'A' },
            { id: 1, data: 'B' },
            { id: 2, data: 'C' },
          ],
        }),
      });
    });

    await page.route('**/api/update', (route) => {
      route.fulfill({
        status: 200,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': '*',
        },
        body: JSON.stringify({}),
      });
    });

    await createWidget(page, 'dxDataGrid', () => ({
      keyExpr: 'id',
      dataSource: (window as any).DevExpress.data.AspNet.createStore({
        key: 'id',
        loadUrl: 'https://api/data',
        updateUrl: 'https://api/update',
      }),
      editing: {
        allowUpdating: true,
        refreshMode: 'repaint',
        mode: 'cell',
      },
      columns: [{
        dataField: 'data',
        showEditorAlways: true,
      }],
      repaintChangesOnly: true,
    }));

    const dataGrid = new DataGrid(page);

    await page.waitForFunction(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      return instance && instance.getVisibleRows().length > 0;
    });

    const firstEditor = dataGrid.getDataCell(0, 0).element.locator('.dx-texteditor-input');
    const secondEditor = dataGrid.getDataCell(2, 0).element.locator('.dx-texteditor-input');
    const middleCell = dataGrid.getDataCell(1, 0).element;

    await firstEditor.click();
    await firstEditor.pressSequentially(' AAA');
    await secondEditor.click();
    await secondEditor.pressSequentially(' CCC');
    await middleCell.click();

    const firstCellValue = await firstEditor.inputValue();
    const secondCellValue = await secondEditor.inputValue();

    expect(firstCellValue).toBe('A AAA');
    expect(secondCellValue).toBe('C CCC');
  });
});
