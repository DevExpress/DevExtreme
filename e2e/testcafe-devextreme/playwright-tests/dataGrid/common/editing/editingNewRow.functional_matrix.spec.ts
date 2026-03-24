import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Editing.NewRow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Update cell value in new row, mode: cell, repaintChangesOnly: true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      dataSource: [
        { id: 1, text: 'text 1', number: 1 },
        { id: 2, text: 'text 2', number: 2 },
      ],
      repaintChangesOnly: true,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
      columns: [
        { dataField: 'text' },
        { dataField: 'number' },
        {
          dataField: 'calculated',
          calculateCellValue: (data) => data.number && -data.number + 1,
        },
      ],
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.apiAddRow();

    const newRowCell = dataGrid.getDataCell(0, 0);
    await newRowCell.element.click();

    const editor = newRowCell.element.locator('.dx-texteditor-input');
    await editor.fill('new text');
    await page.keyboard.press('Tab');

    const cellValue = await dataGrid.apiGetCellValue(0, 0);
    expect(cellValue).toBe('new text');
  });

  test('Update calculated cell value in new row, mode: cell, repaintChangesOnly: true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      dataSource: [
        { id: 1, text: 'text 1', number: 1 },
        { id: 2, text: 'text 2', number: 2 },
      ],
      repaintChangesOnly: true,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
      columns: [
        { dataField: 'text' },
        { dataField: 'number' },
        {
          dataField: 'calculated',
          calculateCellValue: (data) => data.number && -data.number + 1,
        },
      ],
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.apiAddRow();

    const numberCell = dataGrid.getDataCell(0, 1);
    await numberCell.element.click();

    const editor = numberCell.element.locator('.dx-texteditor-input');
    await editor.fill('5');
    await page.keyboard.press('Tab');

    const calculatedValue = await dataGrid.apiGetCellValue(0, 2);
    expect(calculatedValue).toBe(-4);
  });
});
