import type { GridsEditMode } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../../helpers/const';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import { changeTheme } from '../../../../../helpers/testPageUtils';
import DataGrid from '../../../../../models/dataGrid';
import { clickWithOffset } from '../../../helpers/clickWithOffset';
import { typeText } from '../../../helpers/typeText';

test.describe('Focused row', () => {
  test('onFocusedRowChanged event should fire once after changing focusedRowKey if paging.enabled = false (T755722)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        { name: 'Alex', phone: '111111', room: 6 },
        { name: 'Dan', phone: '2222222', room: 5 },
        { name: 'Ben', phone: '333333', room: 4 },
      ],
      keyExpr: 'name',
      focusedRowEnabled: true,
      focusedRowIndex: 1,
      paging: {
        enabled: false,
      },
      onFocusedRowChanged: () => {
        const global = window as Window & typeof globalThis
        & { onFocusedRowChangedCounter: number };
        if (!global.onFocusedRowChangedCounter) {
          global.onFocusedRowChangedCounter = 0;
        }
        global.onFocusedRowChangedCounter += 1;
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const getFocusedRowChangedCounter = (): Promise<number> => page.evaluate(
      () => (window as any).onFocusedRowChangedCounter,
    );

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(getFocusedRowChangedCounter).toBe(1);

    await dataGrid.option('focusedRowKey', 'Ben');

    await expect(dataGrid.getFocusedRow().element).toBeAttached();
    await expect.poll(getFocusedRowChangedCounter).toBe(2);
  });

  test('Form - Focused row should not be reset after editing a row (T851400)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 5, c0: 'c0_0' },
        { id: 6, c0: 'c0_1' },
      ],
      keyExpr: 'id',
      focusedRowEnabled: true,
      focusedRowKey: 6,
      editing: {
        mode: 'form',
        allowUpdating: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const dataRow0 = dataGrid.getDataRow(0);
    const dataRow1 = dataGrid.getDataRow(1);
    const editForm = dataGrid.getEditForm();
    const editor = editForm.getItem('c0');

    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);
    await dataRow1.getCommandCell(2).getButton(0).click();
    await expect(editForm.element).toBeAttached();
    await editForm.cancelButton.click();
    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

    await dataRow1.getCommandCell(2).getButton(0).click();
    await expect(editForm.element).toBeAttached();
    await editor.click();
    await typeText(editor, 'test');
    await editForm.saveButton.click();
    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

    await dataRow0.getCommandCell(2).getButton(0).click();
    await expect(editForm.element).toBeAttached();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);
    await editForm.cancelButton.click();
    await dataRow0.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);

    await dataRow0.getCommandCell(2).getButton(0).click();
    await expect(editForm.element).toBeAttached();
    await editor.click();
    await typeText(editor, 'test');
    await editForm.saveButton.click();
    await dataRow0.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);
  });

  test('Popup - Focused row should not be reset after editing a row (T879627)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 5, c0: 'c0_0' },
        { id: 6, c0: 'c0_1' },
      ],
      keyExpr: 'id',
      focusedRowEnabled: true,
      focusedRowKey: 6,
      editing: {
        mode: 'popup',
        allowUpdating: true,
        popup: {
          animation: undefined,
        },
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const dataRow0 = dataGrid.getDataRow(0);
    const dataRow1 = dataGrid.getDataRow(1);
    const popupEditForm = dataGrid.getPopupEditForm();
    const editor = popupEditForm.getItem('c0');

    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);
    await dataRow1.getCommandCell(2).getButton(0).click();
    await expect(popupEditForm.element).toBeVisible();
    await popupEditForm.cancelButton.click();
    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

    await dataRow1.getCommandCell(2).getButton(0).click();
    await expect(popupEditForm.element).toBeVisible();
    await editor.click();
    await typeText(editor, 'test');
    await popupEditForm.saveButton.click();
    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

    await dataRow0.getCommandCell(2).getButton(0).click();
    await expect(popupEditForm.element).toBeVisible();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);
    await popupEditForm.cancelButton.click();
    await dataRow0.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);

    await dataRow0.getCommandCell(2).getButton(0).click();
    await expect(popupEditForm.element).toBeVisible();
    await editor.click();
    await typeText(editor, 'test');
    await popupEditForm.saveButton.click();
    await dataRow0.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);
  });

  (['Form', 'Popup'] as const).forEach((mode) => {
    test(`${mode} - Focused row should not be reset after editing a row by API (T879627)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          { id: 5, c0: 'c0_0' },
          { id: 6, c0: 'c0_1' },
        ],
        keyExpr: 'id',
        focusedRowEnabled: true,
        focusedRowKey: 6,
        editing: {
          mode: mode.toLowerCase() as GridsEditMode,
          allowUpdating: true,
          popup: {
            animation: null as any,
          },
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      const dataRow1 = dataGrid.getDataRow(1);

      await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);
      await dataRow1.expectFocusedRow();

      await dataGrid.apiEditRow(1);

      await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

      await dataGrid.apiCancelEditData();

      await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

      await dataGrid.apiEditRow(0);

      await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

      await dataGrid.apiSaveEditData();

      await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);
    });
  });

  test('Row - Focused row should not be reset after editing a row (T879627)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 5, c0: 'c0_0' },
        { id: 6, c0: 'c0_1' },
      ],
      keyExpr: 'id',
      focusedRowEnabled: true,
      focusedRowKey: 6,
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const dataRow0 = dataGrid.getDataRow(0);
    const dataRow1 = dataGrid.getDataRow(1);

    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);
    await dataRow1.getCommandCell(2).getButton(0).click();
    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);
    await dataRow1.getCommandCell(2).getButton(1).click();
    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

    let editor = dataRow1.getDataCell(1).getEditor();

    await dataRow1.getCommandCell(2).getButton(0).click();
    await editor.element.click();
    await typeText(editor.element, 'test');
    await dataRow1.getCommandCell(2).getButton(0).click();
    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

    await dataRow0.getCommandCell(2).getButton(0).click();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);
    await dataRow0.getCommandCell(2).getButton(1).click();
    await dataRow0.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);

    editor = dataRow0.getDataCell(1).getEditor();

    await dataRow0.getCommandCell(2).getButton(0).click();
    await editor.element.click();
    await typeText(editor.element, 'test');
    await dataRow0.getCommandCell(2).getButton(0).click();
    await dataRow0.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);
  });

  test('Row - Focused row should be reset after editing a row by API (T879627)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 5, c0: 'c0_0' },
        { id: 6, c0: 'c0_1' },
      ],
      keyExpr: 'id',
      focusedRowEnabled: true,
      focusedRowKey: 6,
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    const dataRow1 = dataGrid.getDataRow(1);

    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);
    await dataRow1.expectFocusedRow();

    await dataGrid.apiEditRow(1);

    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

    await dataGrid.apiCancelEditData();

    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

    await dataGrid.apiEditRow(0);

    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);

    await dataGrid.apiSaveEditData();

    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);
  });

  test('Cell - Focused row should not be reset after editing a cell (T879627)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 5, c0: 'c0_0' },
        { id: 6, c0: 'c0_1' },
      ],
      keyExpr: 'id',
      focusedRowEnabled: true,
      focusedRowKey: 6,
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const dataRow0 = dataGrid.getDataRow(0);
    const dataRow1 = dataGrid.getDataRow(1);
    const dataCell01 = dataRow0.getDataCell(1);
    const dataCell11 = dataRow1.getDataCell(1);

    let editor = dataCell11.getEditor();

    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);
    await dataCell11.element.click();
    await expect(editor.element).toBeAttached();
    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);
    await page.keyboard.press('Escape');
    await expect(editor.element).not.toBeAttached();
    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

    await dataCell11.element.click();
    await expect(editor.element).toBeAttached();
    await editor.element.click();
    await typeText(editor.element, 'test');
    await page.keyboard.press('Enter');
    await expect(editor.element).not.toBeAttached();
    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

    editor = dataCell01.getEditor();

    await dataCell01.element.click();
    await expect(editor.element).toBeAttached();
    await dataRow0.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);
    await page.keyboard.press('Escape');
    await dataRow0.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);

    await dataCell01.element.click();
    await expect(editor.element).toBeAttached();
    await editor.element.click();
    await typeText(editor.element, 'test');
    await page.keyboard.press('Enter');
    await expect(editor.element).not.toBeAttached();
    await dataRow0.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);
  });

  test('Batch - Focused row should not be reset after editing a cell (T879627)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 5, c0: 'c0_0' },
        { id: 6, c0: 'c0_1' },
      ],
      keyExpr: 'id',
      focusedRowEnabled: true,
      focusedRowKey: 6,
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const saveButton = dataGrid.getHeaderPanel().getSaveButton();
    const dataRow0 = dataGrid.getDataRow(0);
    const dataRow1 = dataGrid.getDataRow(1);
    const dataCell01 = dataRow0.getDataCell(1);
    const dataCell11 = dataRow1.getDataCell(1);

    let editor = dataCell11.getEditor();

    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);
    await dataCell11.element.click();
    await expect(editor.element).toBeAttached();
    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);
    await page.keyboard.press('Escape');
    await expect(editor.element).not.toBeAttached();
    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

    await dataCell11.element.click();
    await expect(editor.element).toBeAttached();
    await editor.element.click();
    await typeText(editor.element, 'test');
    await page.keyboard.press('Enter');
    await expect(editor.element).not.toBeAttached();
    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);
    await saveButton.click();
    await dataRow1.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

    editor = dataCell01.getEditor();

    await dataCell01.element.click();
    await expect(editor.element).toBeAttached();
    await dataRow0.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);
    await page.keyboard.press('Escape');
    await dataRow0.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);

    await dataCell01.element.click();
    await expect(editor.element).toBeAttached();
    await editor.element.click();
    await typeText(editor.element, 'test');
    await page.keyboard.press('Enter');
    await expect(editor.element).not.toBeAttached();
    await dataRow0.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);
    await saveButton.click();
    await dataRow0.expectFocusedRow();
    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(5);
  });

  (['Cell', 'Batch'] as const).forEach((mode) => {
    test(`${mode} - Focused row should not be reset after editing a cell by API (T879627)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          { id: 5, c0: 'c0_0' },
          { id: 6, c0: 'c0_1' },
        ],
        keyExpr: 'id',
        focusedRowEnabled: true,
        focusedRowKey: 6,
        editing: {
          mode: mode.toLowerCase() as GridsEditMode,
          allowUpdating: true,
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      const dataRow1 = dataGrid.getDataRow(1);

      await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);
      await dataRow1.expectFocusedRow();

      await dataGrid.apiEditCell(1, 1);

      await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

      await dataGrid.apiCancelEditData();

      await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

      await dataGrid.apiEditCell(0, 1);

      await dataGrid.apiCellValue(0, 1, 'test');

      await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);

      await dataGrid.apiSaveEditData();

      await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(6);
    });
  });

  test('Focused row should not fire onFocusedRowChanging, onFocusedRowChanged events on scrolling if scrolling.mode and rowRenderingMode are virtual', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => {
      const data = ((): Record<string, unknown>[] => {
        const result: { id: number; c0: string; c1: string }[] = [];

        for (let i = 0; i < 200; i += 1) {
          result.push({ id: i, c0: 'c0', c1: `c1_${i % 20}` });
        }

        return result;
      })();

      return {
        height: 300,
        keyExpr: 'id',
        dataSource: data,
        focusedRowEnabled: true,
        focusedRowKey: 1,
        editing: {
          allowAdding: true,
          allowUpdating: true,
          mode: 'form',
        },
        masterDetail: {
          enabled: true,
          template: (container): any => {
            const nestedGridContainer = $('<div>') as any;
            nestedGridContainer.appendTo(container);
            nestedGridContainer.dxDataGrid({
              height: 500,
              keyExpr: 'id',
              dataSource: data,
              editing: {
                allowAdding: true,
                allowUpdating: true,
                mode: 'batch',
              },
            });
          },
        },
        columns: [
          'id',
          'c0',
          {
            dataField: 'c1',
            groupIndex: 0,
          },
        ],
        paging: {
          pageSize: 5,
        },
        scrolling: {
          mode: 'virtual',
          rowRenderingMode: 'virtual',
        },
        onFocusedRowChanging: (): void => {
          const global = window as Window & typeof globalThis
          & { focusedRowChanging_Counter: number };
          if (!global.focusedRowChanging_Counter) {
            global.focusedRowChanging_Counter = 0;
          }
          global.focusedRowChanging_Counter += 1;
        },
        onFocusedRowChanged: (): void => {
          const global = window as Window & typeof globalThis
          & { focusedRowChanged_Counter: number };
          if (!global.focusedRowChanged_Counter) {
            global.focusedRowChanged_Counter = 0;
          }
          global.focusedRowChanged_Counter += 1;
        },
      };
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const getCounter = (name: string): Promise<number | undefined> => page.evaluate(
      (counterName) => (window as any)[counterName],
      name,
    );
    // The grid takes the scroll at once but can render the rows of the new position a moment later,
    // and a render is where the events would fire.
    const scrollTo = async (top: number): Promise<void> => {
      const topRowKey = await dataGrid.apiGetTopVisibleRowKey();

      await dataGrid.scrollTo({ top });
      await expect.poll(() => dataGrid.apiGetTopVisibleRowKey()).not.toEqual(topRowKey);
      await expect.poll(() => dataGrid.isViewportRowsRenderPending()).toBe(false);
    };

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(dataGrid.getFocusedRow().element).toBeAttached();

    await scrollTo(2000);

    await expect.poll(() => getCounter('focusedRowChanging_Counter')).toBe(undefined);
    await expect.poll(() => getCounter('focusedRowChanged_Counter')).toBe(1);

    await scrollTo(0);

    await expect.poll(() => getCounter('focusedRowChanging_Counter')).toBe(undefined);
    await expect.poll(() => getCounter('focusedRowChanged_Counter')).toBe(1);
  });

  test('Scrolling should work if scrolling.mode and rowRenderingMode are virtual row is focused (T907192)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 200,
      width: 200,
      keyExpr: 'id',
      dataSource: new Array(100).fill(null).map((_, index) => ({ id: index + 1 })),
      focusedRowEnabled: true,
      focusedRowKey: 1,
      columns: ['id'],
      scrolling: {
        mode: 'virtual',
        rowRenderingMode: 'virtual',
        showScrollbar: 'always',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(dataGrid.getFocusedRow().element).toBeAttached();
    await clickWithOffset(dataGrid.element, 195, 180);
    await expect(dataGrid.getFocusedRow().element).not.toBeAttached();
  });

  test('Scrolling should not occured after deleting via push API if scrolling.mode is virtual (T930434)', async ({ page }) => {
    await page.evaluate(() => {
      $('<button>').text('Delete').on('click', () => {
        const { widget } = window as any;
        const focusedRowKey = widget.option('focusedRowKey');
        widget.option('focusedRowKey', undefined);
        widget.getDataSource().store().push([{ type: 'remove', key: focusedRowKey }]);
      }).prependTo('body');
    });
    await createWidget(page, 'dxDataGrid', {
      height: 200,
      width: 200,
      dataSource: {
        store: {
          type: 'array',
          key: 'id',
          data: new Array(20).fill(null).map((_, index) => ({ id: index + 1 })),
        },
        pushAggregationTimeout: 0,
      },
      focusedRowEnabled: true,
      focusedRowKey: 10,
      columns: ['id'],
      scrolling: {
        mode: 'virtual',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const deleteButton = page.getByRole('button', { name: 'Delete' });
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(dataGrid.getFocusedRow().element).toBeAttached();
    await expect.poll(() => dataGrid.getScrollTop()).toBeGreaterThan(0);

    const scrollTop = await dataGrid.getScrollTop();

    await deleteButton.click();
    await dataGrid.getDataCell(9, 0).element.click();
    await deleteButton.click();
    await expect.poll(() => dataGrid.getScrollTop()).toBe(scrollTop);
  });

  (['virtual', 'infinite'] as const).forEach((scrollingMode) => {
    test(`Row should be focused after reloading the data source (scrolling.mode is ${scrollingMode}) (T1022502)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        height: 2000,
        dataSource: new Array(30).fill(null).map((_, index) => ({
          ID: index + 1,
          Name: `Name ${index + 1}`,
        })),
        keyExpr: 'ID',
        focusedRowEnabled: true,
        focusedRowIndex: 20,
        scrolling: {
          mode: scrollingMode,
          useNative: false,
          // @ts-expect-error private option
          prerenderedRowCount: 10,
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      const reloadDataSource = (): Promise<void> => page.evaluate(
        () => (window as any).widget.getDataSource().reload(),
      );
      const getVisibleRowCount = async (): Promise<number> => (
        await dataGrid.apiGetVisibleRows()
      ).length;

      await expect.poll(getVisibleRowCount).toBe(30);
      await dataGrid.getDataRow(20).expectFocusedRow();

      await reloadDataSource();

      await expect.poll(getVisibleRowCount).toBe(30);
      await dataGrid.getDataRow(20).expectFocusedRow();
    });
  });

  test('Scroll should not change focused row if focus method is called inside onContentReady (T1047794)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      height: 400,
      dataSource: new Array(30).fill(null).map((_, index) => ({
        ID: index + 1,
        Name: `Name ${index + 1}`,
      })),
      keyExpr: 'ID',
      focusedRowEnabled: true,
      onContentReady(e) {
        e.component.focus();
      },
      scrolling: {
        mode: 'virtual',
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(1);
    await dataGrid.getDataRow(0).expectFocusedRow();

    await dataGrid.scrollTo({ top: 200 });
    await dataGrid.scrollTo({ top: 0 });

    await expect.poll(() => dataGrid.option('focusedRowKey')).toBe(1);
    await dataGrid.getDataRow(0).expectFocusedRow();
  });

  test('Focused row should be shown after reloading the page (T1058983)', async ({ page, theme }) => {
    const createDataGrid = (): Promise<void> => createWidget(page, 'dxDataGrid', () => ({
      dataSource: new Array(100).fill(null).map((_, index) => ({
        ID: index + 1,
        Name: `Name ${index + 1}`,
      })),
      keyExpr: 'ID',
      height: 500,
      stateStoring: {
        enabled: true,
        type: 'custom',
        customSave: (state) => {
          localStorage.setItem('mystate', JSON.stringify(state));
        },
        customLoad: () => {
          const state = localStorage.getItem('mystate');

          return state ? JSON.parse(state) : state;
        },
      },
      scrolling: {
        mode: 'virtual',
      },
      focusedRowEnabled: true,
      focusedRowKey: 90,
    }));

    await createDataGrid();

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(() => dataGrid.isFocusedRowInViewport()).toBe(true);

    await dataGrid.scrollTo({ top: 0 });

    // The simulated scrollable (Linux) reports -0 at the top, which toBe(0) rejects.
    await expect.poll(() => dataGrid.getScrollTop()).toBeCloseTo(0);

    await page.reload();
    await page.waitForFunction(() => !!(window as any).DevExpress);
    // A reload drops the theme the fixture applied.
    await changeTheme(page, theme);
    await createDataGrid();
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(() => dataGrid.isFocusedRowInViewport()).toBe(true);
  });

  test('It is possible to focus row that was added via push method if previously row with same index was focused (T1202646)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        store: {
          type: 'array',
          data: [{ value: 1 }],
        },
        reshapeOnPush: true,
      },
      keyExpr: 'value',
      repaintChangesOnly: true,
      focusedRowEnabled: true,
      columns: [
        {
          dataField: 'value',
          sortOrder: 'desc',
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataRow(0).element.click();

    await dataGrid.getDataRow(0).expectFocusedRow();

    await page.evaluate(() => {
      const grid = ($('#container') as any).dxDataGrid('instance');
      grid.getDataSource().store().push([{
        type: 'insert',
        data: { value: 2 },
      }]);
    });

    await expect(dataGrid.getDataRow(0).element).toHaveText('2');

    await dataGrid.getDataRow(0).element.click();

    await dataGrid.getDataRow(0).expectFocusedRow();
  });

  [null, undefined, -1, 'test'].forEach((groupValue) => {
    test(`Group should expand when focusedRowKey is set - group: ${groupValue}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          { id: 1, group: groupValue, name: 'Item 1' },
          { id: 2, group: groupValue, name: 'Item 2' },
          { id: 3, group: 'A', name: 'Item 3' },
          { id: 4, group: 'A', name: 'Item 4' },
        ],
        keyExpr: 'id',
        grouping: {
          autoExpandAll: false,
        },
        columns: [
          { dataField: 'id' },
          { dataField: 'group', groupIndex: 0 },
          { dataField: 'name' },
        ],
        height: 400,
        focusedRowEnabled: true,
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.apiOption('focusedRowKey', 1);

      await testScreenshot(page, `focused-row_under_group=${groupValue}.png`, { element: dataGrid.element });
    });
  });

  test('Group should expand when focusedRowKey is set and data items have \'items\' property', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        {
          id: 1, group: 'A', name: 'Item 1', items: 1,
        },
        {
          id: 2, group: 'A', name: 'Item 2', items: 2,
        },
      ],
      keyExpr: 'id',
      grouping: {
        autoExpandAll: false,
      },
      columns: [
        { dataField: 'id' },
        { dataField: 'group', groupIndex: 0 },
        { dataField: 'name' },
        { dataField: 'items' },
      ],
      height: 400,
      focusedRowEnabled: true,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.apiOption('focusedRowKey', 1);

    await testScreenshot(page, 'focused-row_under_group_when_data-items_have_items-property.png', { element: dataGrid.element });
  });

  [false, true].forEach((useNative) => {
    test(`navigateToRow method should scroll to the focused row after new rows are added via the push method when scrolling.mode is virtual and scrolling.useNative is ${useNative} (T1307127)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (native) => ({
        dataSource: new Array(500).fill(null).map((_, index) => ({
          id: index + 1,
          firstName: `First${index + 1}`,
          lastName: `Last${index + 1}`,
        })),
        keyExpr: 'id',
        height: 400,
        repaintChangesOnly: true,
        focusedRowEnabled: true,
        scrolling: {
          mode: 'virtual',
          useNative: native,
        },
        columns: [
          { dataField: 'firstName', width: 150 },
          { dataField: 'lastName', width: 150 },
        ],
        onContentReady(e) {
          const key = (window as any).keyToNavigateTo;

          if (key !== undefined) {
            (window as any).keyToNavigateTo = undefined;
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            e.component.navigateToRow(key);
          }
        },
      }), DEFAULT_SELECTOR, { arg: useNative });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const changes: { type: string; data: Record<string, unknown> }[] = new Array(50)
        .fill(null)
        .map((_, index) => ({
          type: 'insert',
          data: { id: 501 + index, firstName: `First${501 + index}`, lastName: `Last${501 + index}` },
        }));

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.apiNavigateToRow(81);

      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await expect.poll(() => dataGrid.apiGetTopVisibleRowKey()).toBe(81);

      await dataGrid.getDataCell(80, 0).element.click();

      await expect.poll(() => dataGrid.apiOption('focusedRowKey')).toBe(81);

      await dataGrid.scrollTo({ top: 0 });

      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await expect.poll(() => dataGrid.apiGetTopVisibleRowKey()).toBe(1);

      await page.evaluate(() => {
        (window as any).keyToNavigateTo = 81;
      });
      await dataGrid.apiPush(changes);

      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await expect.poll(() => dataGrid.apiTotalCount()).toBe(550);
      await expect.poll(() => dataGrid.apiGetTopVisibleRowKey()).toBe(81);
    });
  });
});
