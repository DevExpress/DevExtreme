import type { GridsEditMode } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import TextBox from '../../../../models/textBox';

test.describe('Focus', () => {
  test('Should remove dx-focused class on blur event from the cell', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
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
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    const firstCell = dataGrid.getDataCell(0, 1);
    const secondCell = dataGrid.getDataCell(1, 1);

    await firstCell.element.click();
    await secondCell.element.click();

    await firstCell.expectFocusVisible(false);
    await secondCell.expectFocusVisible();
  });

  [true, false].forEach((reshapeOnPush) => {
    test(`focused row should have dx-focused class after removing previous focused row (reshapeOnPush=${reshapeOnPush})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (reshape) => {
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

        const dataSource = new DevExpress.data.DataSource({ store, reshapeOnPush: reshape });

        return {
          columns: ['name'],
          dataSource,
          keyExpr: 'value',
          focusedRowEnabled: true,
          focusedRowKey: 1,
        };
      }, DEFAULT_SELECTOR, { arg: reshapeOnPush });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await dataGrid.getDataRow(1).expectFocusedRow();
      await expect(dataGrid.getDataRow(1).element).toHaveText('Item 2');

      await dataGrid.apiPush([{
        type: 'remove',
        key: 1,
      }]);

      // The push renders a moment later: the row is still the removed one until then.
      await expect(dataGrid.getDataRow(1).element).toHaveText('Item 3');
      await dataGrid.getDataRow(1).expectFocusedRow();
    });

    // T1233973
    test(`DataGrid should restore focused row by index after row removed via push API' (reshapeOnPush=${reshapeOnPush})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (reshape) => {
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
        const dataSource = new DevExpress.data.DataSource({ store, reshapeOnPush: reshape });

        return {
          columns: ['name'],
          dataSource,
          keyExpr: 'id',
          focusedRowEnabled: true,
          focusedRowKey: 2,
          onFocusedRowChanged: () => {
            const global = window as Window & typeof globalThis
            & { onFocusedRowChangedCounter: number };

            if (!global.onFocusedRowChangedCounter) {
              global.onFocusedRowChangedCounter = 0;
            }
            global.onFocusedRowChangedCounter += 1;
          },
        };
      }, DEFAULT_SELECTOR, { arg: reshapeOnPush });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const getFocusedRowChangedCounter = (): Promise<number> => page.evaluate(
        () => (window as any).onFocusedRowChangedCounter,
      );

      await dataGrid.getDataRow(2).expectFocusedRow();
      await expect(dataGrid.getDataRow(2).element).toHaveText('Item 3');
      await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(2);
      await expect.poll(getFocusedRowChangedCounter).toBe(1);

      await dataGrid.apiPush([{
        type: 'remove',
        key: 2,
      }]);

      // The push renders a moment later: the row is still the removed one until then.
      await expect(dataGrid.getDataRow(2).element).toHaveText('Item 4');
      await dataGrid.getDataRow(2).expectFocusedRow();
      await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(3);
      await expect.poll(getFocusedRowChangedCounter).toBe(2);
    });
  });

  test('DataGrid - FilterRow cell loses focus when focusedRowEnabled is true and editing is in batch mode (T1246926)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        {
          ID: 1,
          FirstName: 'John',
        },
      ],
      keyExpr: 'ID',
      filterRow: {
        visible: true,
      },
      focusedRowEnabled: true,
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      columns: ['FirstName'],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterEditor = dataGrid.getFilterEditor(0, TextBox).input;

    await dataGrid.getDataCell(0, 0).element.click();
    await filterEditor.click();

    await expect(filterEditor).toBeFocused();
  });

  (['infinite', 'virtual'] as const).forEach((scrollingMode) => {
    test(`Only the initially focused row should be focused while scrolling in ${scrollingMode} mode`, async ({ page }) => {
      await page.evaluate(() => {
        (window as any).myStore = new (window as any).DevExpress.data.ArrayStore({
          key: 'id',
          data: new Array(40).fill(null).map((_, index) => ({ id: index + 1, text: `item ${index + 1}` })),
        });
      });

      await createWidget(page, 'dxDataGrid', (mode) => ({
        dataSource: {
          key: 'id',
          load(loadOptions) {
            return new Promise((resolve) => {
              // The store answers late, like a server: the scrolling outruns the loading.
              // eslint-disable-next-line no-restricted-syntax
              setTimeout(() => {
                (window as any).myStore.load(loadOptions).done((data) => {
                  resolve(data);
                });
              }, 300);
            });
          },
          totalCount(loadOptions) {
            return (window as any).myStore.totalCount(loadOptions);
          },
        } as any,
        height: 450,
        remoteOperations: true,
        scrolling: {
          mode,
        },
        showBorders: true,
        focusedRowEnabled: true,
        focusedRowKey: 1,
      }), DEFAULT_SELECTOR, { arg: scrollingMode });

      const grid = new DataGrid(page, DEFAULT_SELECTOR);

      await grid.getDataRow(0).expectFocusedRow();

      await grid.scrollBy({ top: 200 });
      await grid.scrollBy({ top: 200 });
      await grid.scrollTo({ top: 0 });
      // The scrolling has started loading the next page: check the rows it renders.
      await expect.poll(() => grid.isReady()).toBe(true);

      await grid.getDataRow(0).expectFocusedRow();
      await expect(grid.getFocusedRow().element).toHaveCount(1);
    });
  });

  test('DataGrid - FocusedRowChanged event isnt raised when the push API is used to remove the last row (T1261532)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: {
        store: {
          data: [
            {
              id: 1,
              name: 'Item 1 ',
            },
          ],
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
    }));

    const grid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => grid.option('focusedRowKey')).toBe(null);
    await expect.poll(() => grid.option('focusedRowIndex')).toBe(-1);
  });

  ['onFocusedRowChanged', 'onFocusedRowChanging'].forEach((event) => {
    test(`Focus should be preserved on datagrid when rowsview repaints in ${event} event (T1224663)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (eventName) => ({
        dataSource: [
          { id: 1, name: 'name 1' },
          { id: 2, name: 'name 2' },
          { id: 3, name: 'name 3' },
        ],
        keyExpr: 'id',
        focusedRowEnabled: true,
        [eventName]: (e) => {
          e.component.repaint();
        },
      }), DEFAULT_SELECTOR, { arg: event });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await dataGrid.getDataCell(0, 0).element.click();
      await dataGrid.getDataRow(0).expectFocusedRow();

      await page.keyboard.press('ArrowDown');
      await dataGrid.getDataRow(1).expectFocusedRow();
    });
  });

  test('DataGrid - Focused cell appearance is applied to non-editable CheckBox cells on mouse clicks (T1282082)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { BoolOne: false, BoolTwo: false },
      ],
      columns: [
        'BoolOne',
        'BoolTwo',
      ],
    });

    const grid = new DataGrid(page, DEFAULT_SELECTOR);

    await grid.getDataCell(0, 0).element.click();
    await grid.getDataCell(0, 1).element.click();
    await grid.getDataCell(0, 0).element.click();

    await grid.getDataCell(0, 0).expectFocusVisible(false);
  });

  // T1293309
  test('Focus method should focus the first data cell', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
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
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.focus();

    await expect(dataGrid.getDataCell(0, 0).element).toBeFocused();
  });

  // T1293309
  test('Focus method should focus the first data row when focusedRowEnabled = true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
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
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.focus();

    await expect(dataGrid.getDataRow(0).element).toBeFocused();
  });

  (['batch', 'cell'] as GridsEditMode[]).forEach((editMode) => {
    // T1331376
    test(`Tab should focus the next cell after editing a cell by API when focusedRowEnabled (editing.mode=${editMode})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          { ID: 1, FirstName: 'John', LastName: 'Heart' },
          { ID: 2, FirstName: 'Olivia', LastName: 'Peyton' },
        ],
        keyExpr: 'ID',
        focusedRowEnabled: true,
        editing: {
          mode: editMode,
          allowUpdating: true,
        },
        columns: ['FirstName', 'LastName'],
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.apiEditCell(0, 0);

      await expect(dataGrid.getDataCell(0, 0).getEditor().element).toBeFocused();

      await page.keyboard.press('Tab');

      await dataGrid.getDataCell(0, 1).expectEditCell();
      await expect(dataGrid.getDataCell(0, 1).getEditor().element).toBeFocused();
    });
  });
});
