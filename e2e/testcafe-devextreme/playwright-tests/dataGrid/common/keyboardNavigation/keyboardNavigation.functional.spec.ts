import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Keyboard Navigation - common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Changing keyboardNavigation options should not invalidate the entire content (T1197829)', async ({ page }) => {
    // TODO: Playwright migration - renderTableCounter is 7 instead of expected 9
    await page.evaluate(() => {
      (window as any).invalidateCounter = 0;
      (window as any).renderTableCounter = 0;
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(5)].map((_, index) => ({ id: index, text: `item ${index}` })),
      keyExpr: 'id',
      columns: [
        { dataField: 'id' },
        { dataField: 'text' },
      ],
      focusedRowEnabled: true,
      keyboardNavigation: {
        editOnKeyPress: true,
        enterKeyAction: 'startEdit',
        enterKeyDirection: 'column',
      },
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      onFocusedRowChanging(e) {
        if ((e.newRowIndex + 1) % 2 === 0) {
          e.component.option('keyboardNavigation.enterKeyAction', 'moveFocus');
        } else {
          e.component.option('keyboardNavigation.enterKeyAction', 'startEdit');
        }
      },
      onInitialized(e) {
        const dataGrid: any = e.component;
        const rowsView = dataGrid.getView('rowsView');
        // eslint-disable-next-line no-underscore-dangle
        const defaultInvalidate = rowsView._invalidate;
        // eslint-disable-next-line no-underscore-dangle
        dataGrid.getView('rowsView')._invalidate = (...args) => {
          ((window as any).invalidateCounter as number) += 1;
          return defaultInvalidate.apply(rowsView, args);
        };

        // eslint-disable-next-line no-underscore-dangle
        const defaultRenderTable = rowsView._renderTable;
        // eslint-disable-next-line no-underscore-dangle
        dataGrid.getView('rowsView')._renderTable = (...args) => {
          ((window as any).renderTableCounter as number) += 1;
          return defaultRenderTable.apply(rowsView, args);
        };
      },
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    const invalidateCount1 = await page.evaluate(() => (window as any).invalidateCounter);
    expect(invalidateCount1).toBe(0);
    const renderTableCount1 = await page.evaluate(() => (window as any).renderTableCounter);
    expect(renderTableCount1).toBe(2);

    await page.locator('.dx-data-row').nth(1).locator('td').nth(1).click();

    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');

    await page.locator('.dx-data-row').nth(1).locator('td').nth(1).click();

    await page.keyboard.press('Tab');

    const invalidateCount2 = await page.evaluate(() => (window as any).invalidateCounter);
    expect(invalidateCount2).toBe(0);
    const renderTableCount2 = await page.evaluate(() => (window as any).renderTableCounter);
    expect(renderTableCount2).toBe(9);
  });

  test('Cell should not highlighted after editing another cell when startEditAction: dblClick and editing.mode: batch', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { name: 'Alex', phone: '555555', room: 1 },
        { name: 'Dan', phone: '553355', room: 2 },
      ],
      columns: ['name', 'phone', 'room'],
      editing: {
        mode: 'batch',
        allowUpdating: true,
        startEditAction: 'dblClick',
      },
    });

    const dataGrid = new DataGrid(page);

    const cell01 = dataGrid.getDataCell(0, 1);
    const cell11 = dataGrid.getDataCell(1, 1);

    const isFocused = async (cell: ReturnType<typeof dataGrid.getDataCell>) => cell.element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );

    expect(await isFocused(cell01)).toBe(false);
    expect(await isFocused(cell11)).toBe(false);

    await cell11.element.dblclick();
    expect(await isFocused(cell01)).toBe(false);
    expect(await isFocused(cell11)).toBe(true);

    await cell01.element.click();
    expect(await isFocused(cell01)).toBe(false);
    expect(await isFocused(cell11)).toBe(false);
    const isEditCell11 = await cell11.element.evaluate((el) => el.classList.contains('dx-editor-cell'));
    expect(isEditCell11).toBe(false);
  });

  test('Cell should highlighted after editing another cell when startEditAction is "dblClick" and editing mode is "cell"', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { name: 'Alex', phone: '555555', room: 1 },
        { name: 'Dan', phone: '553355', room: 2 },
      ],
      columns: ['name', 'phone', 'room'],
      editing: {
        mode: 'cell',
        allowUpdating: true,
        startEditAction: 'dblClick',
      },
      onFocusedCellChanging: (e: any) => { e.isHighlighted = true; },
    });

    const dataGrid = new DataGrid(page);

    const cell01 = dataGrid.getDataCell(0, 1);
    const cell11 = dataGrid.getDataCell(1, 1);

    const isFocused = async (cell: ReturnType<typeof dataGrid.getDataCell>) => cell.element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );

    expect(await isFocused(cell01)).toBe(false);
    expect(await isFocused(cell11)).toBe(false);

    await cell11.element.dblclick();
    expect(await isFocused(cell01)).toBe(false);
    expect(await isFocused(cell11)).toBe(true);

    await cell01.element.click();
    expect(await isFocused(cell01)).toBe(true);
    expect(await isFocused(cell11)).toBe(false);
    const isEditCell11 = await cell11.element.evaluate((el) => el.classList.contains('dx-editor-cell'));
    expect(isEditCell11).toBe(false);
  });

  test('Row should not be focused by "focusedRowIndex" after change "pageIndex" by pager if "autoNavigateToFocused" row is false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0, c0: 'c0_0' },
        { id: 1, c0: 'c0_1' },
        { id: 2, c0: 'c0_2' },
        { id: 3, c0: 'c0_3' },
      ],
      keyExpr: 'id',
      focusedRowEnabled: true,
      autoNavigateToFocusedRow: false,
      focusedRowIndex: 1,
      paging: {
        pageSize: 2,
      },
    });

    const dataGrid = new DataGrid(page);

    const isFocusedRow = await dataGrid.getDataRow(1).element.evaluate(
      (el) => el.classList.contains('dx-row-focused'),
    );
    expect(isFocusedRow).toBe(true);

    const pagerPage2 = page.locator('.dx-page').filter({ hasText: '2' });
    await pagerPage2.click();
    const selected = await pagerPage2.evaluate((el) => el.classList.contains('dx-selection'));
    expect(selected).toBe(true);

    const focusedRows = await page.locator('.dx-row-focused').count();
    expect(focusedRows).toBe(0);
  });

  test('Cell should be highlighted after editing another cell when startEditAction is \'dblClick\' and \'batch\' edit mode if isHighlighted is set to true in onFocusedCellChanging (T836391)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { name: 'Alex', phone: '555555', room: 1 },
        { name: 'Dan', phone: '553355', room: 2 },
      ],
      columns: ['name', 'phone', 'room'],
      editing: {
        mode: 'batch',
        allowUpdating: true,
        startEditAction: 'dblClick',
      },
      onFocusedCellChanging: (e: any) => { e.isHighlighted = true; },
    });

    const dataGrid = new DataGrid(page);

    const cell0 = dataGrid.getDataCell(0, 0);
    const cell1 = dataGrid.getDataCell(0, 1);

    const isFocused = async (cell: ReturnType<typeof dataGrid.getDataCell>) => cell.element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );

    expect(await isFocused(cell0)).toBe(false);
    expect(await isFocused(cell1)).toBe(false);

    await cell0.element.dblclick();
    expect(await isFocused(cell0)).toBe(true);
    const isEditCell0 = await cell0.element.evaluate((el) => el.classList.contains('dx-editor-cell'));
    expect(isEditCell0).toBe(true);

    await cell1.element.click();
    expect(await isFocused(cell1)).toBe(true);
    expect(await isFocused(cell0)).toBe(false);
    const isEditCell0After = await cell0.element.evaluate((el) => el.classList.contains('dx-editor-cell'));
    expect(isEditCell0After).toBe(false);
  });

  test('Previous navigation elements should not have "tabindex" if navigation action is "click" (T870120)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 4, c0: 'c0_4', c1: 'c1_4' },
        { id: 5, c0: 'c0_5', c1: 'c1_5' },
        { id: 6, c0: 'c0_6', c1: 'c1_6' },
      ],
      tabIndex: 111,
    });

    const dataGrid = new DataGrid(page);

    for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
      for (let colIndex = 0; colIndex < 3; colIndex += 1) {
        const cell = dataGrid.getDataCell(rowIndex, colIndex);
        await cell.element.click();

        const isFocused = await cell.element.evaluate((el) => document.activeElement === el);
        expect(isFocused).toBe(true);

        const tabindex = await cell.element.getAttribute('tabindex');
        expect(tabindex).toBe('111');
      }
    }
  });

  test('The first group row should be expanded when the Enter key is pressed (T869799)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { name: 'Alex', phone: '555555' },
      ],
      columns: [{
        dataField: 'name',
        groupIndex: 0,
      }, 'phone'],
      grouping: {
        autoExpandAll: false,
      },
    });

    const dataGrid = new DataGrid(page);

    const firstGroupRow = dataGrid.getGroupRow(0);

    const isExpandedBefore = await firstGroupRow.isExpanded();
    expect(isExpandedBefore).toBe(false);

    await dataGrid.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const isFocusedEl = await firstGroupRow.element.evaluate((el) => document.activeElement === el);
    expect(isFocusedEl).toBe(true);

    await page.keyboard.press('Enter');

    const isExpandedAfter = await firstGroupRow.isExpanded();
    expect(isExpandedAfter).toBe(true);

    const isFocusedElAfter = await firstGroupRow.element.evaluate((el) => document.activeElement === el);
    expect(isFocusedElAfter).toBe(true);
  });

  test('Previous navigation elements should not have "tabindex" if navigation action is "tab" (T870120)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 4, c0: 'c0_4', c1: 'c1_4' },
        { id: 5, c0: 'c0_5', c1: 'c1_5' },
        { id: 6, c0: 'c0_6', c1: 'c1_6' },
      ],
      tabIndex: 111,
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.getDataCell(0, 0).element.click();

    for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
      for (let colIndex = 0; colIndex < 3; colIndex += 1) {
        const cell = dataGrid.getDataCell(rowIndex, colIndex);

        const isFocused = await cell.element.evaluate((el) => document.activeElement === el);
        expect(isFocused).toBe(true);

        const tabindex = await cell.element.getAttribute('tabindex');
        expect(tabindex).toBe('111');

        await page.keyboard.press('Tab');
      }
    }
  });

  test('Batch mode - Cells in a new row should be updated on Tab (T898356)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      editing: {
        mode: 'batch',
        allowAdding: true,
      },
      columns: ['a', 'b'],
    });

    const dataGrid = new DataGrid(page);
    const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();
    await addRowButton.click();

    const cell00 = dataGrid.getDataCell(0, 0);
    const cell01 = dataGrid.getDataCell(0, 1);

    const isFocused00 = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00).toBe(true);

    const editor00 = cell00.element.locator('.dx-texteditor-input');
    await editor00.fill('1');
    await page.keyboard.press('Tab');

    const isFocused00After = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00After).toBe(false);

    const cellValue00 = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').cellValue(0, 0));
    expect(cellValue00).toBe('1');

    const isFocused01 = await cell01.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused01).toBe(true);
  });

  test('Cell mode - Cells in a new row should be updated on Tab (T898356)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      editing: {
        mode: 'cell',
        allowAdding: true,
      },
      columns: ['a', 'b'],
    });

    const dataGrid = new DataGrid(page);
    const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();
    await addRowButton.click();

    const cell00 = dataGrid.getDataCell(0, 0);
    const cell01 = dataGrid.getDataCell(0, 1);

    const isFocused00 = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00).toBe(true);

    const editor00 = cell00.element.locator('.dx-texteditor-input');
    await editor00.fill('1');
    await page.keyboard.press('Tab');

    const isFocused00After = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00After).toBe(false);

    const cellValue00 = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').cellValue(0, 0));
    expect(cellValue00).toBe('1');

    const isFocused01 = await cell01.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused01).toBe(true);
  });

  test('Batch mode - Cells in a modified row should be updated on Tab (T898356)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ a: '1', b: '2' }],
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      columns: ['a', 'b'],
    });

    const dataGrid = new DataGrid(page);
    const cell00 = dataGrid.getDataCell(0, 0);
    const cell01 = dataGrid.getDataCell(0, 1);

    await cell00.element.click();

    const isFocused00 = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00).toBe(true);

    const editor00 = cell00.element.locator('.dx-texteditor-input');
    await editor00.fill('11');
    await page.keyboard.press('Tab');

    const cellValue00 = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').cellValue(0, 0));
    expect(cellValue00).toBe('11');

    const isFocused01 = await cell01.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused01).toBe(true);

    const editor01 = cell01.element.locator('.dx-texteditor-input');
    await editor01.fill('22');
    await page.keyboard.press('Tab');

    const cellValue01 = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').cellValue(0, 1));
    expect(cellValue01).toBe('22');
  });

  test('Cell mode - Cells in a modified row should be updated on Tab (T898356)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ a: '1', b: '2' }],
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      columns: ['a', 'b'],
    });

    const dataGrid = new DataGrid(page);
    const cell00 = dataGrid.getDataCell(0, 0);
    const cell01 = dataGrid.getDataCell(0, 1);

    await cell00.element.click();

    const isFocused00 = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00).toBe(true);

    const editor00 = cell00.element.locator('.dx-texteditor-input');
    await editor00.fill('11');
    await page.keyboard.press('Tab');

    const cellValue00 = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').cellValue(0, 0));
    expect(cellValue00).toBe('11');

    const isFocused01 = await cell01.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused01).toBe(true);

    const editor01 = cell01.element.locator('.dx-texteditor-input');
    await editor01.fill('22');
    await page.keyboard.press('Tab');

    const cellValue01 = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').cellValue(0, 1));
    expect(cellValue01).toBe('22');
  });

  test('Row - Focus next cell using tab after adding row if some another row is focused and repaintChangesOnly is false (T1004913, T1036685)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ ID: 1, FirstName: 'John' }],
      keyExpr: 'ID',
      repaintChangesOnly: false,
      editing: {
        mode: 'row',
        allowUpdating: true,
        allowAdding: true,
      },
      focusedRowEnabled: true,
      focusedRowKey: 1,
      columns: ['ID', 'FirstName'],
    });

    const dataGrid = new DataGrid(page);
    const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();
    await addRowButton.click();

    const cell00 = dataGrid.getDataCell(0, 0);
    const isFocused00 = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00).toBe(true);

    await page.keyboard.press('Tab');

    const cell01 = dataGrid.getDataCell(0, 1);
    const isFocused01 = await cell01.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused01).toBe(true);
  });

  test('Cell - Focus next cell using tab after adding row if some another row is focused and repaintChangesOnly is false (T1004913, T1036685)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ ID: 1, FirstName: 'John' }],
      keyExpr: 'ID',
      repaintChangesOnly: false,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
      focusedRowEnabled: true,
      focusedRowKey: 1,
      columns: ['ID', 'FirstName'],
    });

    const dataGrid = new DataGrid(page);
    const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();
    await addRowButton.click();

    const cell00 = dataGrid.getDataCell(0, 0);
    const isFocused00 = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00).toBe(true);

    await page.keyboard.press('Tab');

    const cell01 = dataGrid.getDataCell(0, 1);
    const isFocused01 = await cell01.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused01).toBe(true);
  });

  test('Batch - Focus next cell using tab after adding row if some another row is focused and repaintChangesOnly is false (T1004913, T1036685)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ ID: 1, FirstName: 'John' }],
      keyExpr: 'ID',
      repaintChangesOnly: false,
      editing: {
        mode: 'batch',
        allowUpdating: true,
        allowAdding: true,
      },
      focusedRowEnabled: true,
      focusedRowKey: 1,
      columns: ['ID', 'FirstName'],
    });

    const dataGrid = new DataGrid(page);
    const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();
    await addRowButton.click();

    const cell00 = dataGrid.getDataCell(0, 0);
    const isFocused00 = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00).toBe(true);

    await page.keyboard.press('Tab');

    const cell01 = dataGrid.getDataCell(0, 1);
    const isFocused01 = await cell01.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused01).toBe(true);
  });

  test('Grid should get focus when the focus method is called (T955678)', async ({ page }) => {
    await page.evaluate(() => {
      $('<div id="mycontainer">').prependTo('body');
    });

    await createWidget(page, 'dxButton', {
      text: 'Focus',
      onClick() {
        ($('#container') as any).dxDataGrid('instance').focus();
      },
    }, '#mycontainer');

    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }],
      keyExpr: 'id',
      focusedRowEnabled: true,
    });

    const dataGrid = new DataGrid(page);

    const focusButton = page.locator('#mycontainer .dx-button');
    await focusButton.click();

    const row0 = dataGrid.getDataRow(0);
    const isRow0Focused = await row0.element.evaluate((el) => document.activeElement === el);
    expect(isRow0Focused).toBe(true);
    const isFocusedRow0 = await row0.element.evaluate((el) => el.classList.contains('dx-row-focused'));
    expect(isFocusedRow0).toBe(true);

    await page.keyboard.press('ArrowDown');

    const row1 = dataGrid.getDataRow(1);
    const isRow1Focused = await row1.element.evaluate((el) => document.activeElement === el);
    expect(isRow1Focused).toBe(true);
    const isFocusedRow1 = await row1.element.evaluate((el) => el.classList.contains('dx-row-focused'));
    expect(isFocusedRow1).toBe(true);

    await page.evaluate(() => {
      $('#mycontainer').remove();
    });
  });

  test('New mode. A cell should be focused when the PageDown/Up key is pressed (T898324)', async ({ page }) => {
    const items: Array<Record<string, unknown>> = [];
    for (let i = 0; i < 100; i += 1) {
      items.push({ ID: i + 1, Name: `Name ${i + 1}`, Description: `Description ${i + 1}` });
    }

    await createWidget(page, 'dxDataGrid', {
      dataSource: items,
      keyExpr: 'ID',
      height: 300,
      scrolling: {
        mode: 'virtual',
      },
      columns: ['Name', 'Description'],
      onFocusedCellChanging(e: any) {
        e.isHighlighted = true;
      },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getDataCell(0, 0).element.click();

    const isFocused00 = await dataGrid.getDataCell(0, 0).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isFocused00).toBe(true);

    const focusedRowIndex0 = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').option('focusedRowIndex'));
    expect(focusedRowIndex0).toBe(0);
    const focusedColIndex0 = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').option('focusedColumnIndex'));
    expect(focusedColIndex0).toBe(0);

    await page.keyboard.press('PageDown');

    const focusedRowIndexAfterDown = await page.evaluate(
      () => ($('#container') as any).dxDataGrid('instance').option('focusedRowIndex'),
    );
    expect(focusedRowIndexAfterDown).toBeGreaterThanOrEqual(5);
    const focusedColIndexAfterDown = await page.evaluate(
      () => ($('#container') as any).dxDataGrid('instance').option('focusedColumnIndex'),
    );
    expect(focusedColIndexAfterDown).toBe(0);

    await page.keyboard.press('PageUp');

    const focusedRowIndexAfterUp = await page.evaluate(
      () => ($('#container') as any).dxDataGrid('instance').option('focusedRowIndex'),
    );
    expect(focusedRowIndexAfterUp).toBe(0);
    const focusedColIndexAfterUp = await page.evaluate(
      () => ($('#container') as any).dxDataGrid('instance').option('focusedColumnIndex'),
    );
    expect(focusedColIndexAfterUp).toBe(0);
  });
});
