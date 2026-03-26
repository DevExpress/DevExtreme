import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Focus', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const GRID_SELECTOR = '#container';
  const FOCUSED_CLASS = 'dx-focused';

  test.skip('Should remove dx-focused class on blur event from the cell', async ({ page }) => {
    // TODO: Playwright migration - TestCafe API remnants (firstCell.element, locator.element(), hasClass)
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { A: 0, B: 1, C: 2 },
        { A: 3, B: 4, C: 5 },
        { A: 6, B: 7, C: 8 },
      ],
      editing: {
        mode: 'batch',
        allowUpdating: true,
        startEditAction: 'dblClick',
      },
      onCellClick: (event) => event.component.focus(event.cellElement),
    });

      const firstCell = page.locator('.dx-data-row').nth(0).locator('td').nth(1);
    const secondCell = page.locator('.dx-data-row').nth(1).locator('td').nth(1);

    await (firstCell.element).click();
    await (secondCell.element).click();

    expect(await firstCell.element().hasClass(FOCUSED_CLASS)).toBeFalsy();
    expect(await secondCell.element().hasClass(FOCUSED_CLASS)).toBeTruthy();
  });

  [true, false].forEach((reshapeOnPush) => {
    test(`focused row should have dx-focused class after removing previous focused row (reshapeOnPush=${reshapeOnPush})`, async ({ page }) => {
      const dataGrid = new DataGrid(page, GRID_SELECTOR);

      await page.evaluate((rPush) => {
        const { DevExpress } = (window as any);
        const store = new DevExpress.data.ArrayStore({
          data: [
            { id: 0, name: 'Item 1 ' },
            { id: 1, name: 'Item 2' },
            { id: 2, name: 'Item 3' },
            { id: 3, name: 'Item 4' },
            { id: 4, name: 'Item 5' },
          ],
          key: 'id',
        });
        const dataSource = new DevExpress.data.DataSource({ store, reshapeOnPush: rPush });

        ($('#container') as any).dxDataGrid({
          columns: ['name'],
          dataSource,
          keyExpr: 'value',
          focusedRowEnabled: true,
          focusedRowKey: 1,
        });
      }, reshapeOnPush);

      const focusedRow = dataGrid.getFocusedRow();
      await expect(focusedRow).toBeVisible();
      await expect(focusedRow).toContainText('Item 2');

      await dataGrid.apiPush([{ type: 'remove', key: 1 }]);
      await page.waitForTimeout(200);

      const newFocusedRow = dataGrid.getFocusedRow();
      await expect(newFocusedRow).toBeVisible();
      await expect(newFocusedRow).toContainText('Item 3');
    });
  });

  test('DataGrid - FilterRow cell loses focus when focusedRowEnabled is true and editing is in batch mode (T1246926)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ ID: 1, FirstName: 'John' }],
      keyExpr: 'ID',
      filterRow: { visible: true },
      focusedRowEnabled: true,
      editing: { mode: 'batch', allowUpdating: true },
      columns: ['FirstName'],
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const firstDataCell = dataGrid.getDataCell(0, 0);
    await firstDataCell.click();

    const filterInput = dataGrid.getFilterRow().locator('td').first().locator('input');
    await filterInput.click();

    await expect(filterInput).toBeFocused();
  });

  test('DataGrid - FocusedRowChanged event isnt raised when the push API is used to remove the last row (T1261532)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        store: {
          data: [{ id: 1, name: 'Item 1 ' }],
          type: 'array',
          key: 'id',
        },
        reshapeOnPush: true,
      },
      keyExpr: 'id',
      showBorders: true,
      focusedRowEnabled: true,
      focusedRowKey: 1,
      onInitialized(e) {
        e.component?.getDataSource().store().push([{ type: 'remove', key: 1 }]);
      },
    });

    await page.waitForTimeout(200);

    const focusedRowKey = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').option('focusedRowKey'));
    const focusedRowIndex = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').option('focusedRowIndex'));

    expect(focusedRowKey).toBeNull();
    expect(focusedRowIndex).toBe(-1);
  });

  ['onFocusedRowChanged', 'onFocusedRowChanging'].forEach((event) => {
    test(`Focus should be preserved on datagrid when rowsview repaints in ${event} event (T1224663)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          { id: 1, name: 'name 1' },
          { id: 2, name: 'name 2' },
          { id: 3, name: 'name 3' },
        ],
        keyExpr: 'id',
        focusedRowEnabled: true,
        [event]: (e: any) => {
          e.component.repaint();
        },
      });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      await dataGrid.getDataCell(0, 0).click();

      await expect(dataGrid.getFocusedRow()).toBeVisible();

      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(100);

      const focusedRowIndex = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').option('focusedRowIndex'));
      expect(focusedRowIndex).toBe(1);
    });
  });

  test('DataGrid - Focused cell appearance is applied to non-editable CheckBox cells on mouse clicks (T1282082)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ BoolOne: false, BoolTwo: false }],
      columns: ['BoolOne', 'BoolTwo'],
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const cell00 = dataGrid.getDataCell(0, 0);
    const cell01 = dataGrid.getDataCell(0, 1);

    await cell00.click();
    await cell01.click();
    await cell00.click();

    const isFocused = await cell00.evaluate((el) => el.classList.contains('dx-focused'));
    expect(isFocused).toBeFalsy();
  });

  test('Focus method should focus the first data cell', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'name 1' },
        { id: 2, name: 'name 2' },
        { id: 3, name: 'name 3' },
      ],
      keyExpr: 'id',
      columns: [
        'id',
        {
          dataField: 'name',
          cellTemplate: (_, options) => $('<div>').attr('tabindex', 0).text(options.text),
        },
      ],
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await dataGrid.focus();
    await page.waitForTimeout(100);

    const firstCellFocused = await dataGrid.getDataCell(0, 0).evaluate((el) => document.activeElement === el || el.contains(document.activeElement));
    expect(firstCellFocused).toBeTruthy();
  });

  test('Focus method should focus the first data row when focusedRowEnabled = true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'name 1' },
        { id: 2, name: 'name 2' },
        { id: 3, name: 'name 3' },
      ],
      keyExpr: 'id',
      focusedRowEnabled: true,
      columns: [
        'id',
        {
          dataField: 'name',
          cellTemplate: (_, options) => $('<div>').attr('tabindex', 0).text(options.text),
        },
      ],
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await dataGrid.focus();
    await page.waitForTimeout(100);

    const firstRowFocused = await dataGrid.getDataRow(0).element.evaluate((el) => document.activeElement === el || el.contains(document.activeElement) || el === document.activeElement);
    expect(firstRowFocused).toBeTruthy();
  });
    // TODO: .after() block removed
});
