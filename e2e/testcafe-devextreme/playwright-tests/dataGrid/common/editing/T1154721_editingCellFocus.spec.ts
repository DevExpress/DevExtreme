import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Editing - cell focus', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

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

  test('Should allow focus next editor in the same column after save changes with repaintChangesOnly and refreshMode repaint', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      dataSource: [{
        id: 0,
        data: 'X',
      }, {
        id: 1,
        data: 'Y',
      }, {
        id: 2,
        data: 'Z',
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
    const lastEditor = dataGrid.getDataCell(2, 0).element.locator('.dx-texteditor-input');
    const middleCell = dataGrid.getDataCell(1, 0).element;

    await firstEditor.click();
    await firstEditor.pressSequentially(' XX');
    await lastEditor.click();
    await lastEditor.pressSequentially(' ZZ');
    await middleCell.click();

    const firstValue = await firstEditor.inputValue();
    const lastValue = await lastEditor.inputValue();

    expect(firstValue).toBe('X XX');
    expect(lastValue).toBe('Z ZZ');
  });
});
