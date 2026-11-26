import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';

const GRID_SELECTOR = '#container';

test.describe('Keyboard Navigation - editOnKeyPress', () => {
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollBy({ top: 10000 });

    await dataGrid.getDataCell(49, 1).element.click();
    await page.keyboard.press('Enter');

    await expect(dataGrid.getDataCell(49, 1).getEditor().element).toBeFocused();
  });

  test('editing.allowUpdating callback should receive correct row on tab key on first cell with virtual scrolling (T1290811)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [...new Array(50)].map((_, i) => ({
        id: i,
        data: `Row ${i}`,
      })),
      keyExpr: 'id',
      columns: ['id', 'data'],
      editing: {
        mode: 'cell',
        allowUpdating: (e) => {
          (window as any).eventRowKeys ??= [];
          (window as any).eventRowKeys.push(e.row?.key);
          return true;
        },
      },
      scrolling: {
        mode: 'virtual',
      },
      height: 300,
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollBy({ top: 10000 });

    await dataGrid.getDataCell(49, 0).element.click();
    await expect(dataGrid.getDataCell(49, 0).getEditor().element).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(dataGrid.getDataCell(49, 1).getEditor().element).toBeFocused();

    const eventRowKeys = await page.evaluate(() => (window as any).eventRowKeys);
    const uniqueRowKeys = [...new Set(eventRowKeys)];

    expect(uniqueRowKeys).toEqual([49]);
  });

  test('editing.allowUpdating callback should receive correct row on tab key on last cell with virtual scrolling (T1290811)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [...new Array(50)].map((_, i) => ({
        id: i,
        data: `Row ${i}`,
      })),
      keyExpr: 'id',
      columns: ['id', 'data'],
      editing: {
        mode: 'cell',
        allowUpdating: (e) => {
          (window as any).eventRowKeys ??= [];
          (window as any).eventRowKeys.push(e.row?.key);
          return true;
        },
      },
      scrolling: {
        mode: 'virtual',
      },
      height: 300,
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollBy({ top: 10000 });

    await dataGrid.getDataCell(48, 1).element.click();
    await expect(dataGrid.getDataCell(48, 1).getEditor().element).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(dataGrid.getDataCell(49, 0).getEditor().element).toBeFocused();

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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const cell = dataGrid.getDataCell(0, 0);

    await cell.element.click();
    await page.keyboard.press('-');
    await expect(cell.getEditor().element).toBeFocused();
    await page.keyboard.press('1');
    await page.keyboard.press('Enter');

    await expect(dataGrid.getDataCell(0, 0).element).toHaveText('-1');
  });
});
