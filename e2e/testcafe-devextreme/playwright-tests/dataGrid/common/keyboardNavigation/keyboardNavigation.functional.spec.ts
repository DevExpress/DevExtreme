import { test, expect } from '@playwright/test';
import { createWidget, DataGrid, addFocusableElementBefore } from '../../../../playwright-helpers';
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

  test('Navigation via the Tab key should work when cellRender/cellComponent is used (T1207684)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0, text: 'item 0' },
        { id: 1, text: 'item 1' },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id' },
        { dataField: 'text', allowSorting: false },
      ],
    });

    await page.evaluate(() => {
      const dg = ($('#container') as any).dxDataGrid('instance');
      dg.getView('rowsView')._templatesCache = {};
      dg._getTemplate = () => ({
        render(options: any) {
          setTimeout(() => {
            options.deferred?.resolve();
          }, 100);
        },
      });
      dg.repaint();
    });

    await page.waitForTimeout(300);

    const dataGrid = new DataGrid(page);
    const headerCell = dataGrid.getHeaders().getHeaderCell(0, 1);
    await headerCell.click();
    await page.keyboard.press('Tab');

    const isCell00Focused = await dataGrid.getDataCell(0, 0).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isCell00Focused).toBe(true);
  });

  test('Cell should be focused after Enter key press if enterKeyDirection is "none" and enterKeyAction is "moveFocus"', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 200,
      width: 200,
      dataSource: [
        { id: 0 },
        { id: 1 },
      ],
      editing: {
        mode: 'batch',
        allowUpdating: true,
        allowDeleting: true,
      },
      keyboardNavigation: {
        enterKeyAction: 'moveFocus',
        enterKeyDirection: 'none',
      },
    });

    const dataGrid = new DataGrid(page);
    const dataCell = dataGrid.getDataCell(0, 0);

    await dataCell.element.click();
    await page.keyboard.press('Escape');

    const isFocused1 = await dataCell.element.evaluate((el) => document.activeElement === el);
    expect(isFocused1).toBe(true);

    await page.keyboard.press('Enter');
    const isFocused2 = await dataCell.element.evaluate((el) => document.activeElement === el);
    expect(isFocused2).toBe(true);

    await page.keyboard.press('Enter');
    const isFocused3 = await dataCell.element.evaluate((el) => document.activeElement === el);
    expect(isFocused3).toBe(true);
  });

  test('Horizontal moving by keydown if scrolling.columnRenderingMode: virtual', async ({ page }) => {
    const generateData = (rowCount: number, columnCount: number): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];
      for (let i = 0; i < rowCount; i += 1) {
        const item: Record<string, unknown> = {};
        for (let j = 0; j < columnCount; j += 1) {
          item[`field${j}`] = `${i}-${j}`;
        }
        items.push(item);
      }
      return items;
    };

    await createWidget(page, 'dxDataGrid', {
      width: 300,
      dataSource: generateData(2, 20),
      columnWidth: 90,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
      paging: {
        enabled: false,
      },
      onFocusedCellChanging: (e: any) => { e.isHighlighted = true; },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getDataCell(0, 0).element.click();

    for (let i = 0; i < 5; i += 1) {
      await page.keyboard.press('ArrowRight');
    }

    const cell5Focused = await dataGrid.getDataCell(0, 5).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(cell5Focused).toBe(true);

    for (let i = 0; i < 3; i += 1) {
      await page.keyboard.press('ArrowLeft');
    }

    const cell2Focused = await dataGrid.getDataCell(0, 2).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(cell2Focused).toBe(true);
  });

  test('Vertical moving by keydown if scrolling.mode: virtual, scrolling.rowRenderingMode: virtual', async ({ page }) => {
    const generateData = (rowCount: number, columnCount: number): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];
      for (let i = 0; i < rowCount; i += 1) {
        const item: Record<string, unknown> = {};
        for (let j = 0; j < columnCount; j += 1) {
          item[`field${j}`] = `${i}-${j}`;
        }
        items.push(item);
      }
      return items;
    };

    await createWidget(page, 'dxDataGrid', {
      width: 300,
      height: 200,
      dataSource: generateData(20, 2),
      columnWidth: 100,
      scrolling: {
        mode: 'virtual',
        rowRenderingMode: 'virtual',
      },
      paging: {
        enabled: false,
      },
      onFocusedCellChanging: (e: any) => { e.isHighlighted = true; },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getDataCell(0, 0).element.click();

    for (let i = 0; i < 5; i += 1) {
      await page.keyboard.press('ArrowDown');
    }

    const focusedRowIndex = await page.evaluate(
      () => ($('#container') as any).dxDataGrid('instance').option('focusedRowIndex'),
    );
    expect(focusedRowIndex).toBe(5);

    for (let i = 0; i < 3; i += 1) {
      await page.keyboard.press('ArrowUp');
    }

    const focusedRowIndexAfter = await page.evaluate(
      () => ($('#container') as any).dxDataGrid('instance').option('focusedRowIndex'),
    );
    expect(focusedRowIndexAfter).toBe(2);
  });

  test('Cells should be focused after saving data when filter is applied and cell mode is used (T1029906)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'aaa' },
        { id: 2, name: 'aba' },
        { id: 3, name: 'baa' },
        { id: 4, name: 'bca' },
        { id: 5, name: 'acd' },
      ],
      keyExpr: 'id',
      columns: [{
        dataField: 'name',
        filterValue: 'a',
      }],
      filterRow: {
        visible: true,
        applyFilter: 'auto',
      },
      keyboardNavigation: {
        enterKeyAction: 'moveFocus',
        enterKeyDirection: 'column',
        editOnKeyPress: true,
      },
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      onFocusedCellChanging: (e: any) => { e.isHighlighted = true; },
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.getDataCell(0, 0).element.click();

    const isCell00Focused = await dataGrid.getDataCell(0, 0).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isCell00Focused).toBe(true);

    const hasEditor = await dataGrid.getDataCell(0, 0).element.locator('.dx-texteditor-input').count();
    expect(hasEditor).toBeGreaterThan(0);

    await page.keyboard.press('Escape');

    const isCell00FocusedAfterEsc = await dataGrid.getDataCell(0, 0).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isCell00FocusedAfterEsc).toBe(true);

    const hasEditorAfterEsc = await dataGrid.getDataCell(0, 0).element.locator('.dx-texteditor-input').count();
    expect(hasEditorAfterEsc).toBe(0);

    await page.keyboard.press('ArrowDown');

    const isCell10Focused = await dataGrid.getDataCell(1, 0).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isCell10Focused).toBe(true);
  });

  test('Empty row should lose focus on Tab (T941246)', async ({ page }) => {
    await page.evaluate(() => {
      $('<input id="myinput1">').prependTo('body');
      $('<input id="myinput2">').appendTo('body');
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      columns: ['id'],
    });

    const dataGrid = new DataGrid(page);
    const headerCell = dataGrid.getHeaders().getHeaderCell(0, 0);

    const myInput1 = page.locator('#myinput1');
    await myInput1.click();

    const isInput1Focused = await myInput1.evaluate((el) => document.activeElement === el);
    expect(isInput1Focused).toBe(true);

    await page.keyboard.press('Tab');
    const isHeaderFocused = await headerCell.evaluate(
      (el) => document.activeElement === el,
    );
    expect(isHeaderFocused).toBe(true);

    await page.keyboard.press('Tab');
    const rowsViewFocused = await page.evaluate(() => {
      const rowsView = document.querySelector('.dx-datagrid-rowsview');
      return rowsView ? document.activeElement === rowsView : false;
    });
    expect(rowsViewFocused).toBe(true);

    await page.keyboard.press('Tab');
    const myInput2 = page.locator('#myinput2');
    const isInput2Focused = await myInput2.evaluate((el) => document.activeElement === el);
    expect(isInput2Focused).toBe(true);

    await page.evaluate(() => {
      $('#myinput1').remove();
      $('#myinput2').remove();
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

  test('Next cell should be focused immediately on a single Enter key press if showEditorAlways is enabled in cell mode (T1196539)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { name: 'Alex', phone: '555555', room: 1 },
        { name: 'Dan', phone: '553355', room: 2 },
        { name: 'Joe', phone: '335533', room: 3 },
      ],
      columns: [{
        dataField: 'name',
        showEditorAlways: true,
      }, 'phone', 'room'],
      editing: {
        mode: 'cell',
        allowUpdating: true,
        selectTextOnEditStart: true,
      },
      keyboardNavigation: {
        enterKeyAction: 'startEdit',
        enterKeyDirection: 'column',
      },
      repaintChangesOnly: true,
    });

    const dataGrid = new DataGrid(page);
    const editor00 = dataGrid.getDataCell(0, 0).element.locator('.dx-texteditor-input');
    await editor00.click();
    await editor00.fill('test');
    await page.keyboard.press('Enter');

    await page.waitForFunction(() => {
      const rows = document.querySelectorAll('.dx-datagrid-rowsview .dx-data-row');
      return rows.length >= 2 && rows[1].querySelector('td')?.classList.contains('dx-focused');
    });

    const isFocusedRow1 = await dataGrid.getDataCell(1, 0).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isFocusedRow1).toBe(true);

    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    await page.keyboard.press('Enter');

    await page.waitForFunction(() => {
      const rows = document.querySelectorAll('.dx-datagrid-rowsview .dx-data-row');
      return rows.length >= 3 && rows[2].querySelector('td')?.classList.contains('dx-focused');
    });

    const isFocusedRow2 = await dataGrid.getDataCell(2, 0).element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isFocusedRow2).toBe(true);
  });

  test('TextArea should be focused on editing start', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0, name: 'Alex' },
        { id: 1, name: 'Bob' },
      ],
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      columns: [
        {
          dataField: 'name',
          editCellTemplate: (cell: any) => $(cell).append($('<textarea class="text-area-1" />')),
        },
        { dataField: 'phone' },
        { dataField: 'room' },
      ],
    });

    const editLink = page.locator('.dx-data-row').nth(1).locator('.dx-link-edit').first();
    await editLink.click();

    const dataGrid = new DataGrid(page);
    const isEditCell = await dataGrid.getDataCell(1, 0).element.evaluate(
      (el) => el.classList.contains('dx-editor-cell'),
    );
    expect(isEditCell).toBe(true);

    const textArea = page.locator('.text-area-1').first();
    await expect(textArea).toBeFocused();
  });

  test('Batch mode - Cells in a new row should be updated on Shift+Tab (T898356)', async ({ page }) => {
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

    const cell01 = dataGrid.getDataCell(0, 1);
    await cell01.element.click();

    const editor01 = cell01.element.locator('.dx-texteditor-input');
    await editor01.fill('2');
    await page.keyboard.press('Shift+Tab');

    const isFocused01After = await cell01.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused01After).toBe(false);

    const cellValue01 = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').cellValue(0, 1));
    expect(cellValue01).toBe('2');

    const cell00 = dataGrid.getDataCell(0, 0);
    const isFocused00 = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00).toBe(true);

    const editor00 = cell00.element.locator('.dx-texteditor-input');
    await editor00.fill('1');
    await page.keyboard.press('Shift+Tab');

    const isFocused00After = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00After).toBe(false);

    const cellValue00 = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').cellValue(0, 0));
    expect(cellValue00).toBe('1');
  });

  test('Cell mode - Cells in a new row should be updated on Shift+Tab (T898356)', async ({ page }) => {
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

    const cell01 = dataGrid.getDataCell(0, 1);
    await cell01.element.click();

    const editor01 = cell01.element.locator('.dx-texteditor-input');
    await editor01.fill('2');
    await page.keyboard.press('Shift+Tab');

    const isFocused01After = await cell01.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused01After).toBe(false);

    const cellValue01 = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').cellValue(0, 1));
    expect(cellValue01).toBe('2');

    const cell00 = dataGrid.getDataCell(0, 0);
    const isFocused00 = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00).toBe(true);

    const editor00 = cell00.element.locator('.dx-texteditor-input');
    await editor00.fill('1');
    await page.keyboard.press('Shift+Tab');

    const isFocused00After = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00After).toBe(false);

    const cellValue00 = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').cellValue(0, 0));
    expect(cellValue00).toBe('1');
  });

  test('Batch mode - Cells in a modified row should be updated on Shift+Tab (T898356)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ a: '1', b: '2' }],
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      columns: ['a', 'b'],
    });

    const dataGrid = new DataGrid(page);
    const cell01 = dataGrid.getDataCell(0, 1);
    await cell01.element.click();

    const editor01 = cell01.element.locator('.dx-texteditor-input');
    await editor01.fill('22');
    await page.keyboard.press('Shift+Tab');

    const isFocused01After = await cell01.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused01After).toBe(false);

    const cellValue01 = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').cellValue(0, 1));
    expect(cellValue01).toBe('22');

    const cell00 = dataGrid.getDataCell(0, 0);
    const isFocused00 = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00).toBe(true);

    const editor00 = cell00.element.locator('.dx-texteditor-input');
    await editor00.fill('11');
    await page.keyboard.press('Shift+Tab');

    const isFocused00After = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00After).toBe(false);

    const cellValue00 = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').cellValue(0, 0));
    expect(cellValue00).toBe('11');
  });

  test('Cell mode - Cells in a modified row should be updated on Shift+Tab (T898356)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ a: '1', b: '2' }],
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      columns: ['a', 'b'],
    });

    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.id = 'focusable-before';
      btn.textContent = 'Before';
      const container = document.getElementById('container');
      container?.parentNode?.insertBefore(btn, container);
    });

    const dataGrid = new DataGrid(page);
    const cell01 = dataGrid.getDataCell(0, 1);
    await cell01.element.click();

    const editor01 = cell01.element.locator('.dx-texteditor-input');
    await editor01.fill('22');
    await page.keyboard.press('Shift+Tab');

    const isFocused01After = await cell01.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused01After).toBe(false);

    const cellValue01 = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').cellValue(0, 1));
    expect(cellValue01).toBe('22');

    const cell00 = dataGrid.getDataCell(0, 0);
    const isFocused00 = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00).toBe(true);

    const editor00 = cell00.element.locator('.dx-texteditor-input');
    await editor00.fill('11');
    await page.keyboard.press('Shift+Tab');

    const isFocused00After = await cell00.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused00After).toBe(false);

    const cellValue00 = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').cellValue(0, 0));
    expect(cellValue00).toBe('11');

    await page.evaluate(() => {
      document.getElementById('focusable-before')?.remove();
    });
  });

  test('Tab key on the focused group row should be handled by default behavior (T833621)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 400,
      dataSource: [
        { id: 0, c0: 'Test00 resize', c1: 'Test10' },
        { id: 1, c0: 'Test01 resize', c1: 'Test11' },
        { id: 1, c0: 'Test01 resize', c1: 'Test12' },
        { id: 1, c0: 'Test01 resize', c1: 'Test10' },
        { id: 1, c0: 'Test01 resize', c1: 'Test11' },
        { id: 1, c0: 'Test01 resize', c1: 'Test12' },
        { id: 1, c0: 'Test01 resize', c1: 'Test10' },
      ],
      columns: [
        'id',
        'c0',
        {
          dataField: 'c1',
          groupIndex: 0,
          showWhenGrouped: true,
        },
      ],
      paging: {
        pageSize: 2,
      },
      grouping: {
        autoExpandAll: false,
      },
    });

    const groupRow = page.locator('.dx-group-row').nth(1);
    await groupRow.click();

    const hasHiddenFocusState = await groupRow.evaluate(
      (el) => el.classList.contains('dx-cell-focus-disabled'),
    );
    expect(hasHiddenFocusState).toBe(true);

    await page.keyboard.press('Tab');

    const pagerPage0 = page.locator('.dx-page').nth(0);
    const isPagerFocused = await pagerPage0.evaluate((el) => document.activeElement === el);
    expect(isPagerFocused).toBe(true);

    await page.keyboard.press('Shift+Tab');

    const isGroupRowFocused = await groupRow.evaluate((el) => document.activeElement === el);
    expect(isGroupRowFocused).toBe(true);
  });

  test('DataGrid - Scroll bars should not appear when updating edge cell focus overlay position (T812494)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 150,
      width: 200,
      columnAutoWidth: true,
      dataSource: [
        { c0: 'c0_0', c1: 'c1_0' },
        { c0: 'c0_1', c1: 'c1_1' },
      ],
      scrolling: {
        useNative: true,
      },
      columns: [
        'c0',
        { dataField: 'c1', width: 50 },
      ],
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getDataCell(0, 0).element.click();

    const isFocused00 = await dataGrid.getDataCell(0, 0).element.evaluate(
      (el) => document.activeElement === el,
    );
    expect(isFocused00).toBe(true);

    await page.keyboard.press('Tab');

    const isFocused01 = await dataGrid.getDataCell(0, 1).element.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isFocused01).toBe(true);

    await page.keyboard.press('Tab');

    const isFocused10 = await dataGrid.getDataCell(1, 0).element.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isFocused10).toBe(true);

    const scrollbarWidth = await page.evaluate(() => {
      const container = document.querySelector('.dx-datagrid-rowsview .dx-scrollable-container') as HTMLElement | null;
      return container ? container.offsetWidth - container.clientWidth : 0;
    });
    expect(scrollbarWidth).toBe(0);
  });

  test('Moving by Tab key if scrolling.columnRenderingMode: virtual, editing.mode: cell', async ({ page }) => {
    const generateData = (rowCount: number, columnCount: number): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];
      for (let i = 0; i < rowCount; i += 1) {
        const item: Record<string, unknown> = {};
        for (let j = 0; j < columnCount; j += 1) {
          item[`field${j}`] = `${i}-${j}`;
        }
        items.push(item);
      }
      return items;
    };

    await createWidget(page, 'dxDataGrid', {
      width: 300,
      columnWidth: 70,
      dataSource: generateData(2, 10),
      scrolling: {
        columnRenderingMode: 'virtual',
        useNative: false,
      },
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      paging: {
        enabled: false,
      },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getDataCell(0, 0).element.click();

    for (let columnIndex = 1; columnIndex < 4; columnIndex += 1) {
      await page.keyboard.press('Tab');
      const cellEl = dataGrid.getDataCell(0, columnIndex).element;
      await cellEl.waitFor({ state: 'visible' });
      const isFocused = await cellEl.evaluate(
        (el) => el.classList.contains('dx-focused'),
      );
      expect(isFocused).toBe(true);
    }

    for (let columnIndex = 2; columnIndex >= 1; columnIndex -= 1) {
      await page.keyboard.press('Shift+Tab');
      await page.waitForFunction((expected) => {
        const focused = document.querySelector('.dx-datagrid-rowsview .dx-focused');
        if (!focused) return false;
        const cells = Array.from(document.querySelectorAll('.dx-datagrid-rowsview .dx-data-row:first-child td'));
        return cells.indexOf(focused) === expected;
      }, columnIndex);
      const isFocused = await page.evaluate((colIdx) => {
        const cells = Array.from(document.querySelectorAll('.dx-datagrid-rowsview .dx-data-row:first-child td'));
        const focused = document.querySelector('.dx-datagrid-rowsview .dx-focused');
        return focused ? cells.indexOf(focused) === colIdx : false;
      }, columnIndex);
      expect(isFocused).toBe(true);
    }
  });

  test('Moving by Tab key if scrolling.columnRenderingMode: virtual, editing.mode: batch', async ({ page }) => {
    const generateData = (rowCount: number, columnCount: number): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];
      for (let i = 0; i < rowCount; i += 1) {
        const item: Record<string, unknown> = {};
        for (let j = 0; j < columnCount; j += 1) {
          item[`field${j}`] = `${i}-${j}`;
        }
        items.push(item);
      }
      return items;
    };

    await createWidget(page, 'dxDataGrid', {
      width: 300,
      columnWidth: 70,
      dataSource: generateData(2, 10),
      scrolling: {
        columnRenderingMode: 'virtual',
        useNative: false,
      },
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      paging: {
        enabled: false,
      },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getDataCell(0, 0).element.click();

    for (let columnIndex = 1; columnIndex < 4; columnIndex += 1) {
      await page.keyboard.press('Tab');
      const cellEl = dataGrid.getDataCell(0, columnIndex).element;
      await cellEl.waitFor({ state: 'visible' });
      const isFocused = await cellEl.evaluate(
        (el) => el.classList.contains('dx-focused'),
      );
      expect(isFocused).toBe(true);
    }

    for (let columnIndex = 2; columnIndex >= 0; columnIndex -= 1) {
      await page.keyboard.press('Shift+Tab');
      await page.evaluate((expected) => new Promise<void>((resolve, reject) => {
        const instance = ($('#container') as any).dxDataGrid('instance');
        let attempts = 0;
        const check = () => {
          if (instance.option('focusedColumnIndex') === expected) {
            resolve();
          } else if (attempts++ > 20) {
            reject(new Error(`focusedColumnIndex never reached ${expected}`));
          } else {
            setTimeout(check, 50);
          }
        };
        check();
      }), columnIndex);
      const focusedColIndex = await page.evaluate(
        () => ($('#container') as any).dxDataGrid('instance').option('focusedColumnIndex'),
      );
      expect(focusedColIndex).toBe(columnIndex);
    }
  });

  test('DataGrid - An exception should not throw after pressing the space key in an empty grid with virtual scrolling and row selection enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      keyExpr: 'Test',
      columns: ['Test'],
      showBorders: true,
      scrolling: {
        mode: 'virtual',
      },
      selection: {
        mode: 'single',
      },
    });

    const dataGrid = new DataGrid(page);
    const headerCell = dataGrid.getHeaders().getHeaderCell(0, 0);
    await headerCell.click();
    await page.keyboard.press('Tab');

    let threwError = false;
    page.once('pageerror', () => { threwError = true; });

    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    expect(threwError).toBe(false);
  });

  test('Window should not be scrolled after clicking on freespace row (T1104035)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1 }, { id: 2 }],
      keyExpr: 'id',
      height: 1500,
    });

    const scrollBefore = await page.evaluate(() => window.pageYOffset);
    expect(scrollBefore).toBe(0);

    await page.evaluate(() => {
      ($('.dx-freespace-row td') as any).trigger('click');
    });

    await page.waitForTimeout(100);

    const scrollAfter = await page.evaluate(() => window.pageYOffset);
    expect(scrollAfter).toBe(0);
  });

  test('Select views by Ctrl+Down and Ctrl+Up keys', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 300,
      dataSource: [
        { name: 'Alex', c0: 'c0_0' },
        { name: 'Ben', c0: 'c0_1' },
        { name: 'Dan', c0: 'c0_2' },
        { name: 'John', c0: 'c0_3' },
      ],
      keyExpr: 'name',
      editing: {
        allowUpdating: true,
        allowDeleting: true,
        selectTextOnEditStart: true,
        useIcons: true,
      },
      headerFilter: { visible: true },
      filterPanel: { visible: true },
      filterRow: { visible: true },
      pager: {
        allowedPageSizes: [1, 2],
        showPageSizeSelector: true,
        showNavigationButtons: true,
      },
      paging: {
        pageSize: 2,
      },
      focusedRowEnabled: true,
    });

    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.id = 'focusable-start';
      btn.textContent = 'Focus Start';
      const container = document.getElementById('container');
      container?.parentNode?.insertBefore(btn, container);
    });

    const headers = page.locator('.dx-datagrid-headers');
    const filterRowEl = headers.locator('.dx-datagrid-filter-row');

    await page.locator('#focusable-start').click();
    await page.keyboard.press('Tab');

    const isHeadersFocused = await headers.evaluate((el) => el.contains(document.activeElement));
    expect(isHeadersFocused).toBe(true);

    await page.keyboard.press('Control+ArrowDown');

    const filterInputFocused = await filterRowEl.evaluate((el) => el.contains(document.activeElement));
    expect(filterInputFocused).toBe(true);

    await page.keyboard.press('Control+ArrowDown');

    const rowsViewFocused = await page.locator('.dx-datagrid-rowsview').evaluate(
      (el) => el.contains(document.activeElement) || document.activeElement === el,
    );
    expect(rowsViewFocused).toBe(true);

    await page.keyboard.press('Control+ArrowUp');

    const filterInputFocusedAfterUp = await filterRowEl.evaluate((el) => el.contains(document.activeElement));
    expect(filterInputFocusedAfterUp).toBe(true);

    await page.keyboard.press('Control+ArrowUp');

    const isHeadersFocusedAfterUp = await headers.evaluate((el) => el.contains(document.activeElement));
    expect(isHeadersFocusedAfterUp).toBe(true);

    await page.evaluate(() => {
      document.getElementById('focusable-start')?.remove();
    });
  });

  test('Keyboard navigation behavior should be changed after changing the keyboardNavigation.enabled option', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { field0: '0-0', field1: '0-1', field2: '0-2' },
        { field0: '1-0', field1: '1-1', field2: '1-2' },
      ],
      columns: ['field0', 'field1', 'field2'],
    });

    const dataGrid = new DataGrid(page);
    const cell00 = dataGrid.getDataCell(0, 0);
    const cell01 = dataGrid.getDataCell(0, 1);

    await cell00.element.click();
    await page.keyboard.press('Tab');

    await cell01.element.waitFor({ state: 'visible' });
    await page.waitForFunction(() => {
      const cells = document.querySelectorAll('.dx-datagrid-rowsview .dx-data-row:first-child td');
      return cells.length >= 2 && cells[1].classList.contains('dx-focused');
    });
    const isFocused01 = await cell01.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused01).toBe(true);

    await page.evaluate(() => {
      ($('#container') as any).dxDataGrid('instance').option('keyboardNavigation.enabled', false);
    });

    await cell00.element.click();
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    const isFocused01AfterDisable = await cell01.element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isFocused01AfterDisable).toBe(false);

    await page.evaluate(() => {
      ($('#container') as any).dxDataGrid('instance').option('keyboardNavigation.enabled', true);
    });

    await cell00.element.click();
    await page.keyboard.press('Tab');

    await page.waitForFunction(() => {
      const cells = document.querySelectorAll('.dx-datagrid-rowsview .dx-data-row:first-child td');
      return cells.length >= 2 && cells[1].classList.contains('dx-focused');
    });
    const isFocused01AfterEnable = await cell01.element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isFocused01AfterEnable).toBe(true);
  });

  test('Lookup editor should update cell value on down or up key when cell is focused by tab or shift+tab (T1036028)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        id: 1, field1: 'a', field2: '1', field3: 'b',
      }],
      keyExpr: 'id',
      columns: ['field1',
        {
          dataField: 'field2',
          lookup: {
            dataSource: [
              { id: '1' },
              { id: '2' },
            ],
            displayExpr: 'id',
            valueExpr: 'id',
          },
        },
        'field3'],
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
    });

    const dataGrid = new DataGrid(page);

    const editButton = dataGrid.getDataRow(0).element.locator('.dx-command-edit .dx-link-edit');
    await editButton.click();

    await expect(dataGrid.getDataRow(0).element).toHaveClass(/dx-edit-row/);

    const cell00 = dataGrid.getDataCell(0, 0);
    await expect(cell00.element).toHaveClass(/dx-focused/);

    await page.keyboard.press('Tab');

    const cell01 = dataGrid.getDataCell(0, 1);
    await expect(cell01.element).toHaveClass(/dx-focused/);
    expect(await dataGrid.apiGetCellValue(0, 1)).toBe('1');

    await page.keyboard.press('ArrowDown');
    expect(await dataGrid.apiGetCellValue(0, 1)).toBe('2');

    await page.keyboard.press('Tab');

    const cell02 = dataGrid.getDataCell(0, 2);
    await expect(cell02.element).toHaveClass(/dx-focused/);

    await page.keyboard.press('Shift+Tab');

    await expect(cell01.element).toHaveClass(/dx-focused/);
    expect(await dataGrid.apiGetCellValue(0, 1)).toBe('2');

    await page.keyboard.press('ArrowUp');
    expect(await dataGrid.apiGetCellValue(0, 1)).toBe('1');
  });

  test('Checkbox value is changed properly on tab when the batch editing mode and focused row are enabled (T1059412)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      columns: [
        {
          dataField: 'id',
          allowEditing: false,
        },
        {
          dataField: 'checked',
          dataType: 'boolean',
        },
      ],
      dataSource: [
        {
          id: 1,
          checked: false,
        },
      ],
      editing: {
        allowAdding: true,
        allowUpdating: true,
        mode: 'batch',
      },
      focusedRowEnabled: true,
      keyboardNavigation: {
        editOnKeyPress: true,
      },
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.getHeaderPanel().getAddRowButton().click();

    const insertedRow = dataGrid.getDataRow(0);
    await expect(insertedRow.element).toHaveClass(/dx-row-inserted/);

    const cell01 = dataGrid.getDataCell(0, 1);
    await expect(cell01.element).toHaveClass(/dx-focused/);

    await page.keyboard.press('ArrowRight');

    const cell11 = dataGrid.getDataCell(1, 1);
    await expect(cell11.element).toHaveClass(/dx-focused/);

    await page.keyboard.press('Space');
    expect(await dataGrid.apiGetCellValue(1, 1)).toBeTruthy();
    await expect(cell11.element).toHaveClass(/dx-focused/);

    await page.keyboard.press('Space');
    expect(await dataGrid.apiGetCellValue(1, 1)).toBeFalsy();
    await expect(cell11.element).toHaveClass(/dx-focused/);

    await page.keyboard.press('Space');
    expect(await dataGrid.apiGetCellValue(1, 1)).toBeTruthy();
    await expect(cell11.element).toHaveClass(/dx-focused/);
  });

  test('DataGrid - focusedRowIndex is -1 when the first data cell is focused with the keyboard (T1175896)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ field_0: 'val_0_0', field_1: 'val_0_1' }],
      keyExpr: 'field_0',
      showBorders: true,
      searchPanel: {
        visible: true,
      },
      onKeyDown(e: any) {
        const eventKey = e.event?.key?.toLowerCase?.();
        if (eventKey === 'enter') {
          const focusedRowIndex = e.component.option('focusedRowIndex');
          ($('#otherContainer') as any).text(focusedRowIndex);
        }
      },
    });

    await page.locator('.dx-datagrid-search-panel input').click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    const result = await page.locator('#otherContainer').textContent();
    expect(result).toBe('0');
  });

  test('DataGrid - onFocusedCellChanged parameters should be correct when focusing the first cell (T1282664)', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).focusedEventsTestData = [];
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ field_0: 'val_0_0', field_1: 'val_0_1' }],
      keyExpr: 'field_0',
      showBorders: true,
      searchPanel: {
        visible: true,
      },
      onFocusedCellChanged(e: any) {
        (window as any).focusedEventsTestData.push({ name: 'onFocusedCellChanged', args: e });
      },
    });

    await page.locator('.dx-datagrid-search-panel input').click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const firstDataCell = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(0);
    await expect(firstDataCell).toBeFocused();

    const events: any[] = await page.evaluate(() => (window as any).focusedEventsTestData);
    expect(events.length).toBeGreaterThan(0);
    const lastEvent = events[events.length - 1];
    expect(lastEvent.args.columnIndex).toBe(0);
    expect(lastEvent.args.rowIndex).toBe(0);
    expect(lastEvent.args.row.data.field_0).toBe('val_0_0');
  });

  test('DataGrid - Cell focus in edit mode does not work correctly if a cell has a disabled editor (T1177434)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      onEditorPreparing(e: any) {
        if (e.dataField === 'field_1') { e.editorOptions.disabled = true; }
      },
      dataSource: Array.from({ length: 3 }, (_, i) => ({
        field_0: `val_${i}_0`,
        field_1: `val_${i}_1`,
        field_2: `val_${i}_2`,
      })),
      showBorders: true,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
        allowDeleting: true,
      },
      selection: {
        mode: 'multiple',
      },
      toolbar: {
        items: [
          {
            name: 'addRowButton',
            showText: 'always',
          },
        ],
      },
    });

    const dataGrid = new DataGrid(page);
    const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();
    await addRowButton.click();
    await page.keyboard.press('Tab');

    const focusedEl = page.locator(':focus');
    await expect(focusedEl).toHaveAttribute('aria-colindex', '3');
  });

  test('Focus second cell (via click) -> tab navigation when focusedRowEnabled is true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        {
          id: 0, field1: 'test1', field2: 'test2', field3: 'test3',
        },
        {
          id: 1, field1: 'test4', field2: 'test5', field3: 'test6',
        },
      ],
      keyExpr: 'id',
      focusedRowEnabled: true,
      columns: [{
        dataField: 'field1',
        cellTemplate() {
          return ($('<div />') as any).dxDropDownButton({
            text: 'Action',
          });
        },
      }, 'field2', 'field3'],
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.getDataCell(0, 1).element.click();
    await expect(page.locator('.dx-data-row[aria-rowindex="1"]')).toHaveClass(/dx-row-focused/);

    await page.keyboard.press('Tab');
    await expect(dataGrid.getDataCell(0, 2).element).toHaveClass(/dx-focused/);
  });

  test('Keyboard navigation should work after opening-closing master-detail', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
      ],
      keyExpr: 'id',
      masterDetail: {
        enabled: true,
      },
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.getDataRow(0).getCommandCell(0).element.click();
    await dataGrid.getDataRow(0).getCommandCell(0).element.click();

    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1).element.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await expect(dataGrid.getDataCell(0, 1).element).toHaveClass(/dx-focused/);

    await page.keyboard.press('ArrowDown');
    await expect(dataGrid.getDataCell(1, 1).element).toHaveClass(/dx-focused/);

    await page.keyboard.press('ArrowDown');
    await expect(dataGrid.getDataCell(2, 1).element).toHaveClass(/dx-focused/);

    await page.keyboard.press('ArrowDown');
    await expect(dataGrid.getDataCell(3, 1).element).toHaveClass(/dx-focused/);
  });

  test('TreeList/DataGrid - Focus indicator is not visible when the Toolbar includes a DropDownButton item (T1225005)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: Array.from({ length: 5 }, (_, i) => ({
        field_0: `val_${i}_0`,
        field_1: `val_${i}_1`,
        field_2: `val_${i}_2`,
      })),
      toolbar: {
        items: [
          {
            widget: 'dxDropDownButton',
            location: 'before',
            options: {
              text: 'Clear Batch',
              items: [
                { text: 'Delete All Lines' },
                { text: 'Zero All Values' },
              ],
            },
          },
        ],
      },
      keyExpr: 'field_0',
      showBorders: true,
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1).element.click();
    await page.keyboard.press('Tab');

    await expect(dataGrid.getFocusOverlay()).toBeVisible();
  });

  test('Enter key should not trigger other function besides the function assigned on the clicked button', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        {
          ID: 1,
          Prefix: 'Mr.',
          FirstName: 'John',
        },
      ],
      keyExpr: 'ID',
      columns: ['Prefix', 'FirstName'],
      masterDetail: {
        enabled: true,
        template(container: any) {
          const buttonContainer = $('<div>')
            .addClass('button-container')
            .appendTo(container);

          $('<button>')
            .text('Edit')
            .attr('id', 'editButton')
            .on('click', () => {
              $('#otherContainer').text('first button');
            })
            .appendTo(buttonContainer);

          $('<button>')
            .text('Focus me and press Enter')
            .on('click', () => {
              $('#otherContainer').text('second button');
            })
            .appendTo(buttonContainer);
        },
      },
    }));

    const dataGrid = new DataGrid(page);
    await dataGrid.getDataCell(0, 0).element.click();

    await page.locator('#editButton').click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    const message = await page.locator('#otherContainer').textContent();
    expect(message).toBe('second button');
  });

  test('DataGrid - Data rows are skipped during Tab navigation if the first column is hidden via hidingPriority (T1228477)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: Array.from({ length: 3 }, (_, i) => ({
        field_0: `val_${i}_0`,
        field_1: `val_${i}_1`,
        field_2: `val_${i}_2`,
        field_3: `val_${i}_3`,
        field_4: `val_${i}_4`,
      })),
      keyExpr: 'field_0',
      columns: [{
        dataField: 'field_0',
        hidingPriority: 0,
      }, {
        dataField: 'field_1',
        hidingPriority: 1,
      }, 'field_2', 'field_3', 'field_4'],
      showBorders: true,
      width: 300,
    });

    const dataGrid = new DataGrid(page);
    const cell02 = dataGrid.getDataCell(0, 2);
    await expect(cell02.element).toHaveAttribute('tabindex', '0');
  });

  test('Cancel button in the last column cannot be focused via the Tab key (T1248987)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'ID',
      dataSource: [
        {
          ID: 1,
          FirstName: 'John',
        },
      ],
      showBorders: true,
      editing: {
        allowAdding: true,
        mode: 'row',
        editRowKey: 1,
      },
      columnFixing: {
        enabled: true,
      },
      columns: [
        'FirstName',
      ],
    });

    const dataGrid = new DataGrid(page);
    const inputCell = dataGrid.getDataCell(0, 0).element;

    await inputCell.click();
    await page.keyboard.press('Tab');

    const saveButton = dataGrid.getFixedDataRow(0).getCommandCell(1).getButton(0);
    await expect(saveButton).toBeFocused();

    await page.keyboard.press('Tab');
    const cancelButton = dataGrid.getFixedDataRow(0).getCommandCell(1).getButton(1);
    await expect(cancelButton).toBeFocused();
  });

  test('The expand cell should not lose focus on expanding a master row (T892203)', async ({ page }) => {

    await createWidget(page, 'dxDataGrid', {
      showBorders: true,
      keyExpr: 'id',
      dataSource: [{ id: 1 }, { id: 2 }],
      masterDetail: {
        enabled: true,
      },
    });

    const dataGrid = new DataGrid(page);

    await addFocusableElementBefore(page, '#container');

    const headerCell01 = dataGrid.getHeaders().getHeaderCell(0, 1);
    const cell00 = dataGrid.getDataRow(0).element.locator('td').first();
    const cell01 = dataGrid.getDataCell(0, 1);
    const cell10 = dataGrid.getDataRow(1).element.locator('td').first();
    const cell11 = dataGrid.getDataCell(1, 1);

    const isCellFocused = async (locator: ReturnType<typeof dataGrid.getDataCell>) => locator.element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );

    await page.locator('#focusable-start').click();
    await page.keyboard.press('Tab');
    await expect(headerCell01).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(cell00).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(cell00).toBeFocused();

    const isExpanded = await dataGrid.getDataRow(0).element.evaluate((el) => el.getAttribute('aria-expanded') === 'true');
    expect(isExpanded).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isCellFocused(cell01)).toBe(true);

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await expect(cell10).toBeFocused();

    await page.keyboard.press('Tab');
    expect(await isCellFocused(cell11)).toBe(true);

    await page.keyboard.press('Shift+Tab');
    await expect(cell10).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    await expect(cell00).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(cell00).toBeFocused();

    const isCollapsed = await dataGrid.getDataRow(0).element.evaluate((el) => el.getAttribute('aria-expanded') !== 'true');
    expect(isCollapsed).toBe(true);
  });

  test('The row edit mode - Tab navigation through interactive elements in an editable cell when editCellTemplate is set', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      width: 800,
      dataSource: [
        {
          id: 0, field1: 'test1', field2: 'test2', field3: 'test3',
        },
      ],
      keyExpr: 'id',
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      columns: [
        'field1',
        {
          dataField: 'field2',
          editCellTemplate: (cellElement: any) => {
            $('<input type="button" value="My button" />')
              .addClass('my-button')
              .appendTo(cellElement);
            $('<input type="text"/>')
              .addClass('my-editor')
              .appendTo(cellElement);
          },
        },
        'field3',
      ],
    }));

    const dataGrid = new DataGrid(page);

    await dataGrid.apiEditRow(0);

    const dataCell0 = dataGrid.getDataCell(0, 0);
    await dataCell0.element.click();

    const isEditCell0 = await dataCell0.element.evaluate((el) => el.classList.contains('dx-editor-cell'));
    expect(isEditCell0).toBe(true);
    const isFocused0 = await dataCell0.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused0).toBe(true);

    await page.keyboard.press('Tab');
    await expect(page.locator('#container .my-button')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('#container .my-editor')).toBeFocused();

    await page.keyboard.press('Tab');
    const dataCell2 = dataGrid.getDataCell(0, 2);
    const isEditCell2 = await dataCell2.element.evaluate((el) => el.classList.contains('dx-editor-cell'));
    expect(isEditCell2).toBe(true);
    const isFocused2 = await dataCell2.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused2).toBe(true);
  });

  test('The row edit mode - Shift + Tab navigation through interactive elements in an editable cell when editCellTemplate is set', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      width: 800,
      dataSource: [
        {
          id: 0, field1: 'test1', field2: 'test2', field3: 'test3',
        },
      ],
      keyExpr: 'id',
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      columns: [
        'field1',
        {
          dataField: 'field2',
          editCellTemplate: (cellElement: any) => {
            $('<input type="button" value="My button" />')
              .addClass('my-button')
              .appendTo(cellElement);
            $('<input type="text"/>')
              .addClass('my-editor')
              .appendTo(cellElement);
          },
        },
        'field3',
      ],
    }));

    const dataGrid = new DataGrid(page);

    await dataGrid.apiEditRow(0);

    const dataCell2 = dataGrid.getDataCell(0, 2);
    await dataCell2.element.click();

    const isEditCell2 = await dataCell2.element.evaluate((el) => el.classList.contains('dx-editor-cell'));
    expect(isEditCell2).toBe(true);
    const isFocused2 = await dataCell2.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused2).toBe(true);

    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#container .my-editor')).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#container .my-button')).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    const dataCell0 = dataGrid.getDataCell(0, 0);
    const isEditCell0 = await dataCell0.element.evaluate((el) => el.classList.contains('dx-editor-cell'));
    expect(isEditCell0).toBe(true);
    const isFocused0 = await dataCell0.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused0).toBe(true);
  });

  test('The batch edit mode - Tab navigation through interactive elements in an editable cell when editCellTemplate is set', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      width: 800,
      dataSource: [
        {
          id: 0, field1: 'test1', field2: 'test2', field3: 'test3',
        },
      ],
      keyExpr: 'id',
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      columns: [
        'field1',
        {
          dataField: 'field2',
          editCellTemplate: (cellElement: any) => {
            $('<input type="button" value="My button" />')
              .addClass('my-button')
              .appendTo(cellElement);
            $('<input type="text"/>')
              .addClass('my-editor')
              .appendTo(cellElement);
          },
        },
        'field3',
      ],
    }));

    const dataGrid = new DataGrid(page);
    const dataCell0 = dataGrid.getDataCell(0, 0);

    await dataCell0.element.click();

    const isEditCell0 = await dataCell0.element.evaluate((el) => el.classList.contains('dx-editor-cell'));
    expect(isEditCell0).toBe(true);
    const isFocused0 = await dataCell0.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused0).toBe(true);

    await page.keyboard.press('Tab');
    await expect(page.locator('#container .my-button')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('#container .my-editor')).toBeFocused();

    await page.keyboard.press('Tab');
    const dataCell2 = dataGrid.getDataCell(0, 2);
    const isEditCell2 = await dataCell2.element.evaluate((el) => el.classList.contains('dx-editor-cell'));
    expect(isEditCell2).toBe(true);
    const isFocused2 = await dataCell2.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused2).toBe(true);
  });

  test('The batch edit mode - Shift + Tab navigation through interactive elements in an editable cell when editCellTemplate is set', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      width: 800,
      dataSource: [
        {
          id: 0, field1: 'test1', field2: 'test2', field3: 'test3',
        },
      ],
      keyExpr: 'id',
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      columns: [
        'field1',
        {
          dataField: 'field2',
          editCellTemplate: (cellElement: any) => {
            $('<input type="button" value="My button" />')
              .addClass('my-button')
              .appendTo(cellElement);
            $('<input type="text"/>')
              .addClass('my-editor')
              .appendTo(cellElement);
          },
        },
        'field3',
      ],
    }));

    const dataGrid = new DataGrid(page);
    const dataCell2 = dataGrid.getDataCell(0, 2);

    await dataCell2.element.click();

    const isEditCell2 = await dataCell2.element.evaluate((el) => el.classList.contains('dx-editor-cell'));
    expect(isEditCell2).toBe(true);
    const isFocused2 = await dataCell2.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused2).toBe(true);

    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#container .my-button')).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    const dataCell0 = dataGrid.getDataCell(0, 0);
    const isEditCell0 = await dataCell0.element.evaluate((el) => el.classList.contains('dx-editor-cell'));
    expect(isEditCell0).toBe(true);
    const isFocused0 = await dataCell0.element.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused0).toBe(true);
  });

  test('DataGrid - Cell focus works incorrectly if the command column has a disabled native button element (T1179207)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        { field_0: 'val_0_0', field_1: 'val_0_1' },
        { field_0: 'val_1_0', field_1: 'val_1_1' },
      ],
      showBorders: true,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowDeleting: true,
      },
      columns: ['field_0', 'field_1', {
        type: 'buttons',
        buttons: [{
          template() {
            return $('<button>').text('Edit');
          },
        }, {
          template() {
            return $('<button>').attr({ disabled: true }).text('Delete');
          },
        }],
      }],
    }));

    await addFocusableElementBefore(page, '#container');
    await page.locator('#focusable-start').click();

    for (let i = 0; i < 7; i++) {
      await page.keyboard.press('Tab');
    }

    const focusedTag = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
    expect(focusedTag).toBe('td');

    const focusedAriaColindex = await page.evaluate(() => document.activeElement?.getAttribute('aria-colindex'));
    expect(focusedAriaColindex).toBe('1');
  });

  test('DataGrid - The onKeyDown event should be called once for group panel', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).onKeyDownCallCount = 0;
    });

    await createWidget(page, 'dxDataGrid', () => {
      const items: Record<string, string>[] = [];
      for (let i = 0; i < 5; i++) {
        const item: Record<string, string> = {};
        for (let j = 0; j < 5; j++) item[`field_${j}`] = `val_${i}_${j}`;
        items.push(item);
      }
      return {
        dataSource: items,
        showBorders: true,
        onKeyDown() {
          (window as any).onKeyDownCallCount += 1;
        },
        groupPanel: {
          visible: true,
        },
        columns: [
          { dataField: 'field_0', groupIndex: 0 },
          { dataField: 'field_1', groupIndex: 1 },
          'field_2',
          'field_3',
          'field_4',
        ],
      };
    });

    const dataGrid = new DataGrid(page);
    const firstGroupedColumn = dataGrid.getGroupPanel().locator('.dx-group-panel-item').first();

    await firstGroupedColumn.click();
    await page.keyboard.press('Tab');

    const callCount = await page.evaluate(() => (window as any).onKeyDownCallCount);
    expect(callCount).toBe(1);

    await page.evaluate(() => {
      delete (window as any).onKeyDownCallCount;
    });
  });

  test('DataGrid - The onKeyDown event should be called once for headers', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).onKeyDownCallCount = 0;
    });

    await createWidget(page, 'dxDataGrid', () => {
      const items: Record<string, string>[] = [];
      for (let i = 0; i < 5; i++) {
        const item: Record<string, string> = {};
        for (let j = 0; j < 5; j++) item[`field_${j}`] = `val_${i}_${j}`;
        items.push(item);
      }
      return {
        dataSource: items,
        showBorders: true,
        onKeyDown() {
          (window as any).onKeyDownCallCount += 1;
        },
      };
    });

    const dataGrid = new DataGrid(page);
    const firstHeader = dataGrid.getHeaders().getHeaderRow(0).locator('td').first();

    await firstHeader.click();
    await page.keyboard.press('Tab');

    const callCount = await page.evaluate(() => (window as any).onKeyDownCallCount);
    expect(callCount).toBe(1);

    await page.evaluate(() => {
      delete (window as any).onKeyDownCallCount;
    });
  });

  test('Multiple DataGrids - Ctrl+Up/Down from filter row should focus data row in the same grid', async ({ page }) => {
    const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
      const items: Record<string, string>[] = [];
      for (let i = 0; i < rowCount; i++) {
        const item: Record<string, string> = {};
        for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
        items.push(item);
      }
      return items;
    };

    const getDataGridProps = () => ({
      dataSource: getData(5, 2),
      columns: ['field_0', 'field_1'],
      filterRow: { visible: true },
    });

    await createWidget(page, 'dxDataGrid', getDataGridProps());
    await createWidget(page, 'dxDataGrid', getDataGridProps(), '#otherContainer');

    const firstGrid = new DataGrid(page, '#container');
    const secondGrid = new DataGrid(page, '#otherContainer');

    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());
    await page.waitForFunction(() => ($('#otherContainer') as any).dxDataGrid('instance').isReady());

    const secondGridDataCell = secondGrid.getDataCell(0, 0);
    const secondGridFilterInput = secondGrid.getFilterCell(0).locator('.dx-texteditor-input');
    const firstGridDataCell = firstGrid.getDataCell(0, 0);
    const firstGridFilterInput = firstGrid.getFilterCell(0).locator('.dx-texteditor-input');

    await secondGridDataCell.element.click();
    await page.keyboard.press('Control+ArrowUp');

    await expect(secondGridFilterInput).toBeFocused();

    const firstGridFilterFocused = await firstGridFilterInput.evaluate((el) => document.activeElement === el);
    expect(firstGridFilterFocused).toBe(false);

    await page.keyboard.press('Control+ArrowDown');
    await expect(secondGridDataCell.element).toBeFocused();

    const firstGridDataFocused = await firstGridDataCell.element.evaluate((el) => document.activeElement === el);
    expect(firstGridDataFocused).toBe(false);
  });

  test('All rows should be focused on arrow-up/down when virtual scrolling enabled with group summary (T1014612)', async ({ page }) => {

    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' },
      ],
      keyExpr: 'id',
      grouping: {
        autoExpandAll: true,
      },
      scrolling: {
        mode: 'virtual',
      },
      summary: {
        groupItems: [{
          column: 'id',
          summaryType: 'count',
          showInGroupFooter: true,
        }],
      },
      columns: ['id', {
        dataField: 'name',
        groupIndex: 0,
      }],
    });

    const dataGrid = new DataGrid(page);
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    await addFocusableElementBefore(page, '#container');

    await page.locator('#focusable-start').click();
    await page.keyboard.press('Tab');

    await expect(dataGrid.getHeaders().getHeaderRow(0).locator('td').nth(1)).toBeFocused();

    await page.keyboard.press('Tab');

    const groupRow0 = dataGrid.getGroupRow(0);
    const isGroupRow0Focused = await groupRow0.element.evaluate((el) => document.activeElement === el);
    expect(isGroupRow0Focused).toBe(true);

    await page.keyboard.press('ArrowDown');

    const dataCell11Focused = await dataGrid.getDataCell(1, 1).element.evaluate((el) => document.activeElement === el);
    expect(dataCell11Focused).toBe(true);

    await page.keyboard.press('ArrowDown');

    const groupFooterFocused = await dataGrid.getGroupFooterRow().evaluate((el) => document.activeElement === el);
    expect(groupFooterFocused).toBe(true);

    await page.keyboard.press('ArrowDown');

    const groupRow1 = dataGrid.getGroupRow(1);
    const isGroupRow1Focused = await groupRow1.element.evaluate((el) => document.activeElement === el);
    expect(isGroupRow1Focused).toBe(true);

    await page.keyboard.press('ArrowDown');

    const dataCell41Focused = await dataGrid.getDataCell(4, 1).element.evaluate((el) => document.activeElement === el);
    expect(dataCell41Focused).toBe(true);

    await page.keyboard.press('ArrowUp');

    const groupRow1FocusedAfterUp = await groupRow1.element.evaluate((el) => document.activeElement === el);
    expect(groupRow1FocusedAfterUp).toBe(true);

    await page.keyboard.press('ArrowUp');

    const groupFooterFocusedAfterUp = await dataGrid.getGroupFooterRow().evaluate((el) => document.activeElement === el);
    expect(groupFooterFocusedAfterUp).toBe(true);

    await page.keyboard.press('ArrowUp');

    const dataCell11FocusedAfterUp = await dataGrid.getDataCell(1, 1).element.evaluate((el) => document.activeElement === el);
    expect(dataCell11FocusedAfterUp).toBe(true);

    await page.keyboard.press('ArrowUp');

    const groupRow0FocusedAfterUp = await groupRow0.element.evaluate((el) => document.activeElement === el);
    expect(groupRow0FocusedAfterUp).toBe(true);
  });
});
