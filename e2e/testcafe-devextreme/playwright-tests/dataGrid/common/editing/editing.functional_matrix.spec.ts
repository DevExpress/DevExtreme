import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Editing.FunctionalMatrix', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Update cell value, mode: cell, repaintChangesOnly: true, useKeyboard: false, useMask: false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      dataSource: [
        {
          id: 1, text: 'text 1', number: 1, date: '2020-10-27', boolean: false, lookup: 1,
        },
        {
          id: 2, text: 'text 2', number: 2, date: '2020-10-28', boolean: true, lookup: 2,
        },
      ],
      repaintChangesOnly: true,
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      columns: [
        { dataField: 'text' },
        { dataField: 'number' },
        { dataField: 'date', dataType: 'date' },
        {
          dataField: 'lookup',
          lookup: {
            dataSource: [{ id: 1, text: 'lookup 1' }, { id: 2, text: 'lookup 2' }],
            valueExpr: 'id',
            displayExpr: 'text',
          },
        },
        { dataField: 'boolean', dataType: 'boolean' },
        {
          dataField: 'calculated',
          calculateCellValue: (data) => data.number && -data.number + 1,
        },
      ],
    });

    const dataGrid = new DataGrid(page);
    const cell = dataGrid.getDataCell(0, 0);

    await cell.element.click();

    const editor = cell.element.locator('.dx-texteditor-input');
    await editor.fill('xxxx');
    await page.keyboard.press('Tab');

    const cellValue = await dataGrid.apiGetCellValue(0, 0);
    expect(cellValue).toBe('xxxx');
  });

  test('Update cell value, mode: row, repaintChangesOnly: false, useKeyboard: false, useMask: false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      dataSource: [
        {
          id: 1, text: 'text 1', number: 1,
        },
        {
          id: 2, text: 'text 2', number: 2,
        },
      ],
      repaintChangesOnly: false,
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      columns: [
        { dataField: 'text' },
        { dataField: 'number' },
      ],
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.apiEditRow(0);

    const editor = dataGrid.getDataCell(0, 0).element.locator('.dx-texteditor-input');
    await editor.fill('xxxx');

    await dataGrid.apiSaveEditData();

    const cellValue = await dataGrid.apiGetCellValue(0, 0);
    expect(cellValue).toBe('xxxx');
  });
});
