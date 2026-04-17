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

  test('Update cell value, mode: batch, repaintChangesOnly: true, useKeyboard: false, useMask: false', async ({ page }) => {
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
        mode: 'batch',
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
          calculateCellValue: (data: any) => data.number && data.number + 1,
          setCellValue: (newData: any, value: any) => { newData.number = value - 1; },
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

  test('Update calculated cell value, mode: cell, repaintChangesOnly: true, useKeyboard: false, useMask:false', async ({ page }) => {
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
          calculateCellValue: (data: any) => (data as { number: number }).number + 1,
          setCellValue: (newData: any, value: any) => { newData.number = value - 1; },
        },
      ],
    });

    const dataGrid = new DataGrid(page);
    const calculatedCell = dataGrid.getDataCell(0, 5);

    await calculatedCell.element.click();

    const editor = calculatedCell.element.locator('.dx-texteditor-input');
    await editor.fill('9');
    await page.keyboard.press('Tab');

    const numberCellValue = await dataGrid.apiGetCellValue(0, 1);
    expect(numberCellValue).toBe(8);

    const calculatedCellValue = await dataGrid.apiGetCellValue(0, 5);
    expect(calculatedCellValue).toBe(9);
  });

  test('Update calculated cell value, mode: batch, repaintChangesOnly: false, useKeyboard: false, useMask:false', async ({ page }) => {
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
      repaintChangesOnly: false,
      editing: {
        mode: 'batch',
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
          calculateCellValue: (data: any) => (data as { number: number }).number + 1,
          setCellValue: (newData: any, value: any) => { newData.number = value - 1; },
        },
      ],
    });

    const dataGrid = new DataGrid(page);
    const calculatedCell = dataGrid.getDataCell(0, 5);

    await calculatedCell.element.click();

    const editor = calculatedCell.element.locator('.dx-texteditor-input');
    await editor.fill('9');
    await page.keyboard.press('Tab');

    const saveButton = dataGrid.getHeaderPanel().getSaveButton();
    await saveButton.click({ position: { x: 5, y: 5 } });

    const numberCellValue = await dataGrid.apiGetCellValue(0, 1);
    expect(numberCellValue).toBe(8);

    const calculatedCellValue = await dataGrid.apiGetCellValue(0, 5);
    expect(calculatedCellValue).toBe(9);
  });

  test('Update cell value and focus next cell, mode: cell, repaintChangesOnly: false, useKeyboard: false', async ({ page }) => {
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
        mode: 'cell',
        allowUpdating: true,
      },
      columns: [
        { dataField: 'text' },
        {
          dataField: 'calculated',
          calculateCellValue: (data: any) => (data as { number: number }).number + 1,
          setCellValue: (newData: any, value: any) => { newData.number = value - 1; },
        },
      ],
    });

    const dataGrid = new DataGrid(page);
    const textCell = dataGrid.getDataCell(0, 0);
    const calculatedCell = dataGrid.getDataCell(0, 1);

    await textCell.element.click();

    const textEditor = textCell.element.locator('.dx-texteditor-input');
    await textEditor.fill('xxxx');

    await calculatedCell.element.click();

    const textValue = await dataGrid.apiGetCellValue(0, 0);
    expect(textValue).toBe('xxxx');
  });

  test('Update cell value and focus next cell, mode: batch, repaintChangesOnly: false, useKeyboard: false', async ({ page }) => {
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
        mode: 'batch',
        allowUpdating: true,
      },
      columns: [
        { dataField: 'text' },
        {
          dataField: 'calculated',
          calculateCellValue: (data: any) => (data as { number: number }).number + 1,
          setCellValue: (newData: any, value: any) => { newData.number = value - 1; },
        },
      ],
    });

    const dataGrid = new DataGrid(page);
    const textCell = dataGrid.getDataCell(0, 0);
    const calculatedCell = dataGrid.getDataCell(0, 1);

    await textCell.element.click();

    const textEditor = textCell.element.locator('.dx-texteditor-input');
    await textEditor.fill('xxxx');

    await calculatedCell.element.click();

    const isModified = await textCell.element.evaluate((el) => el.classList.contains('dx-cell-modified'));
    expect(isModified).toBe(true);
  });

  test.skip('Update cell value, mode: row, repaintChangesOnly: false, useKeyboard: false, useMask: false', async ({ page }) => {
    // TODO: Playwright migration - fill() does not trigger DevExtreme editor value change event
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
