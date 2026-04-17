import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe.skip('Keyboard Navigation - editOnKeyPress', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Editing should start by pressing enter after scrolling content with scrolling.mode=virtual', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(50)].map((_, i) => ({
        data1: i * 2,
        data2: i * 2 + 1,
      })),
      columns: [
        'data1',
        'data2',
      ],
      editing: {
        allowUpdating: true,
      },
      scrolling: {
        mode: 'virtual',
      },
      height: 300,
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollBy({ y: 10000 }));
    await page.waitForTimeout(300);

    const dataGrid = new DataGrid(page);
    const lastDataCell = dataGrid.getDataCell(49, 1);
    await lastDataCell.element.click();
    await page.keyboard.press('Enter');

    await expect(lastDataCell.element).toHaveClass(/dx-editor-cell/);
  });

  test('editing.allowUpdating callback should receive correct row on tab key on first cell with virtual scrolling (T1290811)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(50)].map((_, i) => ({
        id: i,
        data: `Row ${i}`,
      })),
      keyExpr: 'id',
      columns: ['id', 'data'],
      editing: {
        mode: 'cell',
        allowUpdating: (e: any) => {
          (window as any).eventRowKeys ??= [];
          (window as any).eventRowKeys.push(e.row?.key);
          return true;
        },
      },
      scrolling: {
        mode: 'virtual',
      },
      height: 300,
    });

    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollBy(opts), { y: 10000 });

    const lastRow = page.locator('.dx-data-row').last();
    await lastRow.locator('td').nth(0).click();

    const firstCellEditorFocused = await lastRow.locator('td').nth(0).locator('.dx-texteditor-input').evaluate(
      (el) => document.activeElement === el,
    );
    expect(firstCellEditorFocused).toBe(true);

    await page.keyboard.press('Tab');

    const secondCellEditorFocused = await lastRow.locator('td').nth(1).locator('.dx-texteditor-input').evaluate(
      (el) => document.activeElement === el,
    );
    expect(secondCellEditorFocused).toBe(true);

    const eventRowKeys = await page.evaluate(() => (window as any).eventRowKeys);
    const uniqueRowKeys = [...new Set(eventRowKeys)];
    expect(uniqueRowKeys).toEqual([49]);
  });

  test('editing.allowUpdating callback should receive correct row on tab key on last cell with virtual scrolling (T1290811)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(50)].map((_, i) => ({
        id: i,
        data: `Row ${i}`,
      })),
      keyExpr: 'id',
      columns: ['id', 'data'],
      editing: {
        mode: 'cell',
        allowUpdating: (e: any) => {
          (window as any).eventRowKeys ??= [];
          (window as any).eventRowKeys.push(e.row?.key);
          return true;
        },
      },
      scrolling: {
        mode: 'virtual',
      },
      height: 300,
    });

    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollBy(opts), { y: 10000 });

    const lastRows = page.locator('.dx-data-row');
    const lastRowCount = await lastRows.count();
    const secondToLastRow = lastRows.nth(lastRowCount - 2);
    await secondToLastRow.locator('td').nth(1).click();

    const secondToLastCellEditorFocused = await secondToLastRow.locator('td').nth(1).locator('.dx-texteditor-input').evaluate(
      (el) => document.activeElement === el,
    );
    expect(secondToLastCellEditorFocused).toBe(true);

    await page.keyboard.press('Tab');

    const lastRow = lastRows.last();
    const lastRowFirstCellEditorFocused = await lastRow.locator('td').nth(0).locator('.dx-texteditor-input').evaluate(
      (el) => document.activeElement === el,
    );
    expect(lastRowFirstCellEditorFocused).toBe(true);

    const eventRowKeys = await page.evaluate(() => (window as any).eventRowKeys);
    const uniqueRowKeys = [...new Set(eventRowKeys)];
    expect(uniqueRowKeys).toEqual([48, 49]);
  });

  test('DataGrid should not remove the minus symbol when editing started (T1201166)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: undefined, text: '1' },
        { id: 2, text: '2' },
        { id: 3, text: '3' },
      ],
      columns: [{
        dataField: 'id',
        dataType: 'number',
        editorOptions: {
          format: { type: 'decimal' },
        },
      },
      'text',
      ],
      editing: {
        allowUpdating: true,
        selectTextOnEditStart: true,
        mode: 'batch',
        startEditAction: 'dblClick',
      },
      keyboardNavigation: {
        editOnKeyPress: true,
        enterKeyAction: 'moveFocus',
        enterKeyDirection: 'column',
      },
    });

    const dataGrid = new DataGrid(page);
    const cell = dataGrid.getDataCell(0, 0);

    await cell.element.click();
    await page.keyboard.press('-');
    await page.keyboard.press('1');
    await page.keyboard.press('Enter');

    const cellText = await cell.element.innerText();
    expect(cellText.trim()).toBe('-1');
  });
});
