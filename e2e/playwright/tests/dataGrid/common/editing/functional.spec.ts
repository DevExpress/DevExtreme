/* eslint-disable no-param-reassign */
// Grid callbacks (setCellValue, customizeColumns, a store's insert) change their arguments: that is
// their API.
import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import SelectBox from '../../../../models/selectBox';
import { getData } from '../../helpers/generateDataSourceData';
import { getFirstDataRow } from '../../helpers/getFirstDataRow';
import { typeText } from '../../helpers/typeText';

const GRID_SELECTOR = '#container';

const DEFAULT_CONFIG = {
  errorRowEnabled: true,
  dataSource: [{
    id: 1, name: 'Alex', age: 15, lastName: 'John',
  }],
  keyExpr: 'id',
  legacyRendering: false,
};

// Counts a grid event from now on, for steps whose effect nothing on the page shows.
const countEvents = async (
  dataGrid: DataGrid,
  eventName: string,
): Promise<() => Promise<number>> => {
  const counterName = `${eventName}Count`;

  await dataGrid.element.evaluate((element, { name, counter }) => {
    (window as any)[counter] = 0;
    $(element).data('dxDataGrid').on(name, () => {
      (window as any)[counter] += 1;
    });
  }, { name: eventName, counter: counterName });

  return () => dataGrid.page.evaluate((counter) => (window as any)[counter], counterName);
};

// A save that fails validation changes nothing visible, and in row mode it runs on a timer after
// the click or the Enter. Every save attempt raises rowValidating: wait for it, then for the grid.
const trackSaveAttempts = async (
  dataGrid: DataGrid,
): Promise<(action: () => Promise<void>) => Promise<void>> => {
  const getCount = await countEvents(dataGrid, 'rowValidating');

  return async (action) => {
    const count = await getCount();

    await action();
    await expect.poll(getCount).toBeGreaterThan(count);
    await expect.poll(() => dataGrid.isReady()).toBe(true);
  };
};

test.describe('Editing.Functional', () => {
  test('Focused cell should be switched to the editing mode after onSaving\'s promise is resolved (T1190566)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => {
      (window as any).deferred = $.Deferred();

      return {
        dataSource: [
          { id: 1, field1: 'value1' },
          { id: 2, field1: 'value2' },
          { id: 3, field1: 'value3' },
          { id: 4, field1: 'value4' },
        ],
        keyExpr: 'id',
        showBorders: true,
        columns: ['field1'],
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
        onSaving(e) {
          e.promise = (window as any).deferred;
        },
      };
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const cell = dataGrid.getDataCell(0, 0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await cell.element.click();
    await typeText(cell.getEditor().element, 'new_value');
    await page.keyboard.press('Tab');
    // The grid moves the focus asynchronously and drops a Tab pressed before it is done.
    await dataGrid.getDataCell(1, 0).expectFocusVisible();
    await page.keyboard.press('Tab');
    await page.evaluate(() => (window as any).deferred.resolve());

    await dataGrid.getDataCell(2, 0).expectEditCell();
  });

  // T1190566
  test('DataGrid - The "Cannot read properties of undefined error" occurs when using Tab while saving a promise', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => {
      (window as any).deferred = $.Deferred();

      return {
        dataSource: [
          { id: 1, field1: 'value1' },
          { id: 2, field1: 'value2' },
          { id: 3, field1: 'value3' },
          { id: 4, field1: 'value4' },
        ],
        keyExpr: 'id',
        showBorders: true,
        columns: ['field1'],
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
        onSaving(e) {
          e.promise = (window as any).deferred;
        },
      };
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const cell = dataGrid.getDataCell(0, 0);
    const getSavingCount = await countEvents(dataGrid, 'saving');

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await cell.element.click();
    await typeText(cell.getEditor().element, 'new_value');
    await page.keyboard.press('Enter');
    // The Tabs are meant to come while the save waits for its promise.
    await expect.poll(getSavingCount).toBe(1);
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await page.keyboard.press('Tab');
    await dataGrid.getDataCell(1, 0).expectFocusVisible();
    await page.keyboard.press('Tab');
    await dataGrid.getDataCell(2, 0).expectFocusVisible();

    await page.evaluate(() => (window as any).deferred.resolve());

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await dataGrid.getDataCell(2, 0).expectFocusVisible();
  });

  test('Tab key on editor should focus next cell if editing mode is cell', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ name: 'AaAaA', value: 1 }, { name: 'aAaAa', value: 2 }],
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      columns: [{ dataField: 'name', allowEditing: false }, { dataField: 'value', showEditorAlways: true }],
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 1).element.click();
    await page.keyboard.press('1');
    await page.keyboard.press('Tab');

    await dataGrid.getDataCell(1, 1).expectFocusVisible();
  });

  test('Click should work if a column button set using svg icon (T863635)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{ value: 1 }],
      columns: [{
        type: 'buttons',
        width: 110,
        buttons: [
          {
            hint: 'svg icon',
            icon: '<svg id="svg-icon"><circle cx="15" cy="15" r="14" /> </svg>',
            onClick: (): void => {
              const global = window as Window & typeof globalThis & { onSvgClickCounter: number };
              if (!global.onSvgClickCounter) {
                global.onSvgClickCounter = 0;
              }
              global.onSvgClickCounter += 1;
            },
          }],
      }],
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await page.locator('#svg-icon').locator('..').click();

    await expect.poll(() => page.evaluate(() => (window as any).onSvgClickCounter)).toBe(1);
  });

  test('Value change on dataGrid row should be fired after clicking on editor (T823431)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ name: 'old_value', value: 1 }],
      editing: {
        mode: 'batch',
        allowUpdating: true,
        selectTextOnEditStart: true,
        startEditAction: 'click',
      },
    });
    await createWidget(page, 'dxSelectBox', {}, '#otherContainer');

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const selectBox = new SelectBox(page, '#otherContainer');
    const cell = dataGrid.getDataCell(0, 0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await cell.element.click();
    // The editor opens with its text selected (selectTextOnEditStart), so the typing replaces it.
    await typeText(cell.getEditor().element, 'new_value', { replace: true });
    await selectBox.dropDownButton.click();

    await expect(cell.element).toHaveText('new_value');
  });

  test('Async Validation(Row) - Only valid data is saved in a new row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'row',
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params): JQueryPromise<unknown> {
            const d = $.Deferred();
            // The validation answers late, like a server: the test checks the pending state.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
      }, 'name', 'lastName'],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const rowIndex = 0;
    const columnIndex = 0;

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getHeaderPanel().getAddRowButton().click();

    const dataRow = getFirstDataRow(dataGrid);
    const cell0 = dataRow.getDataCell(columnIndex);
    const editor0 = cell0.getEditor();
    const saveButton = dataRow.getCommandCell(3).getButton(0);

    await dataRow.expectInserted();
    // Adding a row ends with the focus in its first editor.
    await expect(editor0.element).toBeFocused();
    await expect(cell0.getPendingIndicator()).not.toBeAttached();
    await cell0.expectInvalid(false);

    await saveButton.click();

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex)).toBe('invalid');
    await dataRow.expectInserted();
    await cell0.expectInvalid();

    await typeText(editor0.element, '1');
    await saveButton.click();

    await dataRow.expectInserted(false);
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex)).toBeFalsy();
  });

  test('Async Validation(Row) - Only valid data is saved in a modified row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params): JQueryPromise<unknown> {
            const d = $.Deferred();
            // The validation answers late, like a server: the test checks the pending state.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
      }, 'name', 'lastName'],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const rowIndex = 0;
    const columnIndex = 0;
    const dataRow = dataGrid.getDataRow(rowIndex);
    const cell0 = dataRow.getDataCell(columnIndex);
    const editor0 = cell0.getEditor();
    const commandCell = dataRow.getCommandCell(3);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await commandCell.getButton(0).click();
    await typeText(editor0.element, '3', { replace: true });
    await commandCell.getButton(0).click();

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex)).toBe('invalid');
    await dataRow.expectEdited();
    await cell0.expectInvalid();

    await typeText(editor0.element, '1', { replace: true });
    await commandCell.getButton(0).click();

    await dataRow.expectEdited(false);
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex)).toBeFalsy();
  });

  test('Async Validation(Row) - Data is not saved when a dependant cell value becomes invalid', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params): JQueryPromise<unknown> {
            const d = $.Deferred();
            // The validation answers late, like a server: the test checks the pending state.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
        setCellValue(rowData, value): void {
          rowData.age = value;
          if (value === 1) {
            rowData.name = '';
          }
        },
      }, {
        dataField: 'name',
        validationRules: [{ type: 'required' }],
      }, 'lastName'],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const rowIndex = 0;
    const dataRow = dataGrid.getDataRow(rowIndex);
    const cell0 = dataRow.getDataCell(0);
    const cell1 = dataRow.getDataCell(1);
    const editor0 = cell0.getEditor();
    const commandCell = dataRow.getCommandCell(3);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await commandCell.getButton(0).click();
    await typeText(editor0.element, '3', { replace: true });
    await commandCell.getButton(0).click();

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, 0)).toBe('invalid');
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, 1)).toBe('valid');
    await dataRow.expectEdited();
    await cell0.expectInvalid();
    await cell1.expectInvalid(false);

    await typeText(editor0.element, '1', { replace: true });
    await commandCell.getButton(0).click();

    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, 0)).toBe('valid');
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, 1)).toBe('invalid');
    await dataRow.expectEdited();
    await cell0.expectInvalid(false);
    await cell1.expectInvalid();
  });

  test('Async Validation(Cell) - Only the last cell should be switched to edit mode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => {
      (window as any).deferred = $.Deferred();

      return {
        ...defaults,
        editing: {
          mode: 'cell',
          allowUpdating: true,
          allowAdding: true,
        },
        columns: [{
          dataField: 'age',
          validationRules: [{
            type: 'async',
            validationCallback(): JQueryPromise<unknown> {
              return (window as any).deferred.promise();
            },
          }],
        }, 'name', 'lastName'],
      };
    }, GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const cell0 = dataGrid.getDataCell(0, 0);
    const cell1 = dataGrid.getDataCell(0, 1);
    const cell2 = dataGrid.getDataCell(0, 2);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await cell0.element.click();
    await expect(cell0.getPendingIndicator()).toBeAttached();
    await cell1.element.click();
    await cell1.expectFocusVisible(false);
    await cell2.element.click();

    await page.evaluate(() => (window as any).deferred.resolve(true));

    await expect(cell0.getPendingIndicator()).not.toBeAttached();
    await cell2.expectFocusVisible();
    await cell2.expectFocusHidden(false);
  });

  test('Async Validation(Cell) - Only valid data is saved in a new row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'cell',
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params): JQueryPromise<unknown> {
            const d = $.Deferred();
            // The validation answers late, like a server: the test checks the pending state.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
      }, 'name', 'lastName'],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const rowIndex = 0;
    const columnIndex = 0;

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getHeaderPanel().getAddRowButton().click();

    const dataRow = getFirstDataRow(dataGrid);
    const cell0 = dataRow.getDataCell(columnIndex);
    const editor0 = cell0.getEditor();

    await dataRow.expectInserted();
    // Adding a row ends with the focus in its first editor.
    await expect(editor0.element).toBeFocused();
    await expect(cell0.getPendingIndicator()).not.toBeAttached();
    await cell0.expectInvalid(false);

    await cell0.element.click();
    await page.keyboard.press('Enter');

    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex)).toBe('invalid');
    await dataRow.expectInserted();
    await cell0.expectInvalid();

    await cell0.element.click();
    await typeText(editor0.element, '1');
    await page.keyboard.press('Enter');

    await dataRow.expectInserted(false);
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex)).toBeFalsy();
  });

  test('Async Validation(Cell) - Only valid data is saved in a modified cell', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params): JQueryPromise<unknown> {
            const d = $.Deferred();
            // The validation answers late, like a server: the test checks the pending state.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
      }, 'name', 'lastName'],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const rowIndex = 0;
    const columnIndex = 0;
    const cell0 = dataGrid.getDataRow(rowIndex).getDataCell(columnIndex);
    const editor0 = cell0.getEditor();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await cell0.element.click();

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await cell0.expectEditCell();
    await cell0.expectInvalid();

    await typeText(editor0.element, '3', { replace: true });
    await page.keyboard.press('Enter');

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex)).toBe('invalid');
    await cell0.expectEditCell();
    await cell0.expectInvalid();

    await cell0.element.click();
    await typeText(editor0.element, '1', { replace: true });
    await page.keyboard.press('Enter');

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await cell0.expectEditCell(false);
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex)).toBeFalsy();
  });

  test('Async Validation(Cell) - Data is not saved when a dependant cell value becomes invalid', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params): JQueryPromise<unknown> {
            const d = $.Deferred();
            // The validation answers late, like a server: the test checks the pending state.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
        setCellValue(rowData, value): void {
          rowData.age = value;
          if (value === 1) {
            rowData.name = '';
          }
        },
      }, {
        dataField: 'name',
        validationRules: [{ type: 'required' }],
      }, 'lastName'],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const cell0 = dataGrid.getDataCell(0, 0);
    const cell1 = dataGrid.getDataCell(0, 1);
    const editor0 = cell0.getEditor();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await cell0.element.click();

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await cell0.expectEditCell();
    await cell0.expectInvalid();

    await typeText(editor0.element, '3', { replace: true });
    await page.keyboard.press('Enter');

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(0, 0)).toBe('invalid');
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(0, 1)).toBe('valid');
    await cell0.expectEditCell();
    await cell0.expectInvalid();
    await cell1.expectEditCell(false);
    await cell1.expectInvalid(false);

    await cell0.element.click();
    await typeText(editor0.element, '1', { replace: true });
    await page.keyboard.press('Enter');

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(0, 0)).toBe('valid');
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(0, 1)).toBe('invalid');
    await cell0.expectEditCell();
    await cell0.expectInvalid(false);
    await cell1.expectEditCell(false);
    await cell1.expectInvalid();
  });

  test('Cell mode(setCellValue) with async validation - The value of an invalid dependent cell should be updated in a new row(T872751)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
        setCellValue: (rowData, value): void => {
          rowData.age = value;
          rowData.name = 'testb';
        },
      }, {
        dataField: 'name',
        validationRules: [{
          type: 'async',
          validationCallback(): JQueryPromise<unknown> {
            const d = $.Deferred();
            // The validation answers late, like a server.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              d.resolve(false);
            }, 50);
            return d.promise();
          },
        }],
      }, 'lastName'],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiAddRow();

    const dataRow = getFirstDataRow(dataGrid);

    await dataRow.expectInserted();
    await typeText(dataRow.getDataCell(0).getEditor().element, '123');
    await page.keyboard.press('Enter');

    await dataRow.getDataCell(1).expectInvalid();
    await expect(dataRow.getDataCell(1).element).toHaveText('testb');
  });

  test('Cell mode(setCellValue) with async validation - The value of an invalid dependent cell should be updated in a modified row(T872751)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
        setCellValue: (rowData, value): void => {
          rowData.age = value;
          rowData.name = 'testb';
        },
      }, {
        dataField: 'name',
        validationRules: [{
          type: 'async',
          validationCallback(): JQueryPromise<unknown> {
            const d = $.Deferred();
            // The validation answers late, like a server.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              d.resolve(false);
            }, 50);
            return d.promise();
          },
        }],
      }, 'lastName'],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiEditCell(0, 0);

    await typeText(dataGrid.getDataCell(0, 0).getEditor().element, '123');
    await page.keyboard.press('Enter');

    await dataGrid.getDataCell(0, 1).expectInvalid();
    await expect(dataGrid.getDataCell(0, 1).element).toHaveText('testb');
  });

  test('Cell mode(calculateCellValue) with async validation - The value of an invalid dependent cell should be updated in a new row(T872751)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
      }, {
        dataField: 'name',
        calculateCellValue: (rowData): string | undefined => (rowData.age ? `${rowData.age}b` : undefined),
        validationRules: [{
          type: 'async',
          validationCallback(): JQueryPromise<unknown> {
            const d = $.Deferred();
            // The validation answers late, like a server.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              d.resolve(false);
            }, 50);
            return d.promise();
          },
        }],
      }, 'lastName'],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiAddRow();

    const dataRow = getFirstDataRow(dataGrid);

    await dataRow.expectInserted();
    await typeText(dataRow.getDataCell(0).getEditor().element, '123');
    await page.keyboard.press('Enter');

    await dataRow.getDataCell(1).expectInvalid();
    await expect(dataRow.getDataCell(1).element).toHaveText('123b');
  });

  test('Cell mode(calculateCellValue) with async validation - The value of an invalid dependent cell should be updated in a modified row(T872751)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
      }, {
        dataField: 'name',
        calculateCellValue: (rowData): string | undefined => (rowData.age ? `${rowData.age}b` : undefined),
        validationRules: [{
          type: 'async',
          validationCallback(): JQueryPromise<unknown> {
            const d = $.Deferred();
            // The validation answers late, like a server.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              d.resolve(false);
            }, 50);
            return d.promise();
          },
        }],
      }, 'lastName'],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiEditCell(0, 0);

    await typeText(dataGrid.getDataCell(0, 0).getEditor().element, '123');
    await page.keyboard.press('Enter');

    await dataGrid.getDataCell(0, 1).expectInvalid();
    await expect(dataGrid.getDataCell(0, 1).element).toHaveText('15123b');
  });

  test('Async Validation(Batch) - Only valid data is saved in a new row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'batch',
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params): JQueryPromise<unknown> {
            const d = $.Deferred();
            // The validation answers late, like a server: the test checks the pending state.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
      }, 'name', 'lastName'],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const rowIndex = 0;
    const columnIndex = 0;
    const headerPanel = dataGrid.getHeaderPanel();
    const saveButton = headerPanel.getSaveButton();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await headerPanel.getAddRowButton().click();

    const dataRow = getFirstDataRow(dataGrid);
    const cell0 = dataRow.getDataCell(columnIndex);
    const editor0 = cell0.getEditor();

    await dataRow.expectInserted();
    // Adding a row ends with the focus in its first editor.
    await expect(editor0.element).toBeFocused();
    await expect(cell0.getPendingIndicator()).not.toBeAttached();
    await cell0.expectInvalid(false);

    await cell0.element.click();
    await saveButton.click();

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await cell0.expectModified();
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex)).toBe('invalid');
    await dataRow.expectInserted();
    await cell0.expectInvalid();

    await cell0.element.click();
    await typeText(editor0.element, '1');
    await page.keyboard.press('Enter');

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await cell0.expectModified();

    await saveButton.click();

    await dataRow.expectInserted(false);
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex)).toBeFalsy();
  });

  test('Async Validation(Batch) - Only valid data is saved in a modified cell', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params): JQueryPromise<unknown> {
            const d = $.Deferred();
            // The validation answers late, like a server: the test checks the pending state.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
      }, 'name', 'lastName'],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const rowIndex = 0;
    const columnIndex = 0;
    const saveButton = dataGrid.getHeaderPanel().getSaveButton();
    const cell0 = dataGrid.getDataRow(rowIndex).getDataCell(columnIndex);
    const editor0 = cell0.getEditor();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await cell0.element.click();

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await cell0.expectEditCell();
    await cell0.expectInvalid();

    await typeText(editor0.element, '3', { replace: true });
    await page.keyboard.press('Enter');

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await cell0.expectModified();

    await saveButton.click();

    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex)).toBe('invalid');
    await cell0.expectInvalid();

    await cell0.element.click();

    await cell0.expectEditCell();

    await typeText(editor0.element, '1', { replace: true });
    await page.keyboard.press('Enter');

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await cell0.expectModified();

    await saveButton.click();

    await cell0.expectEditCell(false);
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex)).toBeFalsy();
  });

  test('Async Validation(Batch) - Data is not saved when a dependant cell value becomes invalid', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params): JQueryPromise<unknown> {
            const d = $.Deferred();
            // The validation answers late, like a server: the test checks the pending state.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
        setCellValue(rowData, value): void {
          rowData.age = value;
          if (value === 1) {
            rowData.name = '';
          }
        },
      }, {
        dataField: 'name',
        validationRules: [{ type: 'required' }],
      }, 'lastName'],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const rowIndex = 0;
    const saveButton = dataGrid.getHeaderPanel().getSaveButton();
    const cell0 = dataGrid.getDataRow(rowIndex).getDataCell(0);
    const cell1 = dataGrid.getDataRow(rowIndex).getDataCell(1);
    const editor0 = cell0.getEditor();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await cell0.element.click();

    await cell0.expectEditCell();
    await expect(cell0.getPendingIndicator()).toBeAttached();
    await cell0.expectInvalid();

    await typeText(editor0.element, '3', { replace: true });
    await page.keyboard.press('Enter');

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await cell0.expectModified();

    await saveButton.click();

    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, 0)).toBe('invalid');
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, 1)).toBe('valid');
    await cell0.expectEditCell(false);
    await cell0.expectInvalid();
    await cell1.expectEditCell(false);
    await cell1.expectInvalid(false);

    await cell0.element.click();
    await typeText(editor0.element, '1', { replace: true });
    await page.keyboard.press('Enter');

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await cell0.expectModified();
    await cell1.expectModified();

    await saveButton.click();

    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, 0)).toBe('valid');
    await expect.poll(() => dataGrid.apiGetCellValidationStatus(rowIndex, 1)).toBe('invalid');
    await cell0.expectModified();
    await cell0.expectEditCell(false);
    await cell0.expectInvalid(false);
    await cell1.expectModified();
    await cell1.expectEditCell(false);
    await cell1.expectInvalid();
  });

  test('Async Validation(Batch) - Data is not saved when a cell with async setCellValue is invalid', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'batch',
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params): JQueryPromise<unknown> {
            const d = $.Deferred();
            // The validation answers late, like a server: the test checks the pending state.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
        setCellValue(rowData, value): JQueryPromise<unknown> {
          const d = $.Deferred();
          // The value is set late, like a server answers.
          // eslint-disable-next-line no-restricted-syntax
          setTimeout(() => {
            rowData.age = value;
            d.resolve();
          }, 1200);
          return d.promise();
        },
      }, 'name', 'lastName'],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const headerPanel = dataGrid.getHeaderPanel();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await headerPanel.getAddRowButton().click();

    const dataRow = getFirstDataRow(dataGrid);
    const cell0 = dataRow.getDataCell(0);
    const editor0 = cell0.getEditor();

    await dataRow.expectInserted();
    // Adding a row ends with the focus in its first editor.
    await expect(editor0.element).toBeFocused();
    await expect(cell0.getPendingIndicator()).not.toBeAttached();
    await cell0.expectInvalid(false);

    await cell0.element.click();
    await typeText(editor0.element, '123');
    await page.keyboard.press('Enter');
    await headerPanel.getSaveButton().click();

    await expect(cell0.getPendingIndicator()).toBeAttached();
    await expect(cell0.getPendingIndicator()).not.toBeAttached();
    await cell0.expectInvalid();
    await cell0.expectModified();
    await dataRow.expectInserted();
  });

  test('Validation(Row) - Unmodified data cell should be marked as invalid when a neighboring cell is modified (reevaluate=false) (T880238)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      columns: ['age', {
        dataField: 'name',
        validationRules: [{
          type: 'custom',
          validationCallback(params): boolean {
            return params.data.age >= 10;
          },
        }],
      }],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const dataRow = dataGrid.getDataRow(0);
    const cell0 = dataRow.getDataCell(0);
    const editor0 = cell0.getEditor();
    const cell1 = dataRow.getDataCell(1);
    const commandCell = dataRow.getCommandCell(2);
    const saveAttempt = await trackSaveAttempts(dataGrid);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await commandCell.getButton(0).click();

    await expect(editor0.element).toBeAttached();
    await cell1.expectInvalid(false);

    await editor0.element.click();
    await typeText(editor0.element, '3', { replace: true });
    await page.keyboard.press('Enter');

    await cell1.expectInvalid();

    await saveAttempt(() => commandCell.getButton(0).click());

    await cell1.expectInvalid();

    await editor0.element.click();
    await typeText(editor0.element, '10', { replace: true });
    await saveAttempt(() => page.keyboard.press('Enter'));

    await cell1.expectInvalid();

    await saveAttempt(() => commandCell.getButton(0).click());

    await cell1.expectInvalid();
    await dataRow.expectEdited();
  });

  test('Validation(Row) - Unmodified data cell should be marked as invalid when a neighboring cell is modified (reevaluate=true) (T880238)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      columns: ['age', {
        dataField: 'name',
        validationRules: [{
          type: 'custom',
          reevaluate: true,
          validationCallback(params): boolean {
            return params.data.age >= 10;
          },
        }],
      }],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const dataRow = dataGrid.getDataRow(0);
    const cell0 = dataRow.getDataCell(0);
    const editor0 = cell0.getEditor();
    const cell1 = dataRow.getDataCell(1);
    const commandCell = dataRow.getCommandCell(2);
    const saveAttempt = await trackSaveAttempts(dataGrid);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await commandCell.getButton(0).click();

    await expect(editor0.element).toBeAttached();
    await cell1.expectInvalid(false);

    await editor0.element.click();
    await typeText(editor0.element, '3', { replace: true });
    await page.keyboard.press('Enter');

    await cell1.expectInvalid();

    await saveAttempt(() => commandCell.getButton(0).click());

    await cell1.expectInvalid();

    await editor0.element.click();
    await typeText(editor0.element, '10', { replace: true });
    await page.keyboard.press('Enter');

    await cell1.expectInvalid(false);
    await dataRow.expectEdited(false);
  });

  test('Validation(Cell) - Unmodified data cell should be marked as invalid when a neighboring cell is modified (reevaluate=false) (T880238)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      columns: ['age', {
        dataField: 'name',
        validationRules: [{
          type: 'custom',
          validationCallback(params): boolean {
            return params.data.age >= 10;
          },
        }],
      }],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const dataRow = dataGrid.getDataRow(0);
    const cell0 = dataRow.getDataCell(0);
    const editor0 = cell0.getEditor();
    const cell1 = dataRow.getDataCell(1);
    const saveAttempt = await trackSaveAttempts(dataGrid);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await cell0.element.click();

    await expect(editor0.element).toBeAttached();
    await cell1.expectInvalid(false);

    await editor0.element.click();
    await typeText(editor0.element, '3', { replace: true });
    await page.keyboard.press('Enter');

    await cell1.expectInvalid();
    await cell0.expectEditCell();

    await typeText(editor0.element, '10', { replace: true });
    await saveAttempt(() => page.keyboard.press('Enter'));

    await cell1.expectInvalid();
    await cell0.expectEditCell();
  });

  test('Validation(Cell) - Unmodified data cell should be marked as invalid when a neighboring cell is modified (reevaluate=true) (T880238)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      columns: ['age', {
        dataField: 'name',
        validationRules: [{
          type: 'custom',
          reevaluate: true,
          validationCallback(params): boolean {
            return params.data.age >= 10;
          },
        }],
      }],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const dataRow = dataGrid.getDataRow(0);
    const cell0 = dataRow.getDataCell(0);
    const editor0 = cell0.getEditor();
    const cell1 = dataRow.getDataCell(1);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await cell0.element.click();

    await expect(editor0.element).toBeAttached();
    await cell1.expectInvalid(false);

    await editor0.element.click();
    await typeText(editor0.element, '3', { replace: true });
    await page.keyboard.press('Enter');

    await cell1.expectInvalid();
    await cell0.expectEditCell();

    await typeText(editor0.element, '10', { replace: true });
    await page.keyboard.press('Enter');

    await cell1.expectInvalid(false);
    await cell0.expectEditCell(false);
  });

  [false, true].forEach((reevaluate) => {
    test(`Validation(Batch) - Unmodified data cell should be marked as invalid when a neighboring cell is modified (reevaluate=${reevaluate}) (T880238)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', ({ defaults, reevaluateRule }) => ({
        ...defaults,
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
        columns: ['age', {
          dataField: 'name',
          validationRules: [{
            type: 'custom',
            reevaluate: reevaluateRule,
            validationCallback(params): boolean {
              return params.data.age >= 10;
            },
          }],
        }],
      }), GRID_SELECTOR, { arg: { defaults: DEFAULT_CONFIG, reevaluateRule: reevaluate } });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      const saveButton = dataGrid.getHeaderPanel().getSaveButton();
      const dataRow = dataGrid.getDataRow(0);
      const cell0 = dataRow.getDataCell(0);
      const editor0 = cell0.getEditor();
      const cell1 = dataRow.getDataCell(1);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await cell0.element.click();

      await expect(editor0.element).toBeAttached();
      await cell1.expectInvalid(false);

      await editor0.element.click();
      await typeText(editor0.element, '3', { replace: true });
      await page.keyboard.press('Enter');

      await cell0.expectModified();
      await cell1.expectInvalid(false);

      await saveButton.click();

      await cell1.expectInvalid();
      await cell0.expectModified();

      await cell0.element.click();

      await expect(editor0.element).toBeAttached();

      await typeText(editor0.element, '10', { replace: true });
      await page.keyboard.press('Enter');

      await cell1.expectInvalid(false);
      await cell0.expectModified();

      await saveButton.click();

      await cell0.expectModified(false);
      await cell1.expectInvalid(false);
      await cell0.expectEditCell(false);
    });
  });

  test('Validation(Batch) - Unmodified data cell with enabled showEditorAlways should be marked as invalid when a neighboring cell is modified (T878218)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      keyExpr: 'id',
      dataSource: [
        { id: 1, name: '', lastName: '' },
        { id: 2, name: '', lastName: '' },
      ],
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      columns: ['name', {
        dataField: 'lastName',
        showEditorAlways: true,
        validationRules: [{
          type: 'custom',
          reevaluate: true,
          validationCallback: (params): boolean => params.data.name.length <= 0,
        }],
      }],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const dataRow0 = dataGrid.getDataRow(0);
    const dataRow1 = dataGrid.getDataRow(1);
    const cell00 = dataRow0.getDataCell(0);
    const cell01 = dataRow0.getDataCell(1);
    const cell10 = dataRow1.getDataCell(0);
    const cell11 = dataRow1.getDataCell(1);
    const editor10 = cell10.getEditor();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await cell10.element.click();

    await expect(editor10.element).toBeAttached();
    await cell11.expectInvalid(false);

    await editor10.element.click();
    await typeText(editor10.element, 'test');
    await page.keyboard.press('Enter');

    await cell11.expectInvalid();
    await cell10.expectModified();

    // The focus moves to the clicked cell, for some cells a moment later: the checks after it see
    // the click handled.
    await cell00.element.click();

    await cell00.expectFocusVisible();
    await cell11.expectInvalid();
    await cell10.expectModified();

    await cell01.element.click();

    await cell01.expectFocusVisible();
    await cell11.expectInvalid();
    await cell10.expectModified();

    await cell11.element.click();

    await cell11.expectFocusVisible();
    await cell11.expectInvalid();
    await expect(cell11.getInvalidMessage()).toBeAttached();
    await cell10.expectModified();

    await cell10.element.click();

    await cell10.expectFocusVisible();
    await cell11.expectInvalid();
    await cell10.expectModified();
  });

  test('Async Validation(Batch) - Validation frame should be rendered when a neighboring cell is modified with showEditorAlways and repaintChangesOnly enabled (T906094)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (defaults) => ({
      ...defaults,
      dataSource: [{ id: 1, name: '', lastName: '' }],
      keyExpr: 'id',
      repaintChangesOnly: true,
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      columns: [{
        dataField: 'name',
      }, {
        dataField: 'lastName',
        showEditorAlways: true,
        validationRules: [{
          type: 'async',
          message: 'Invalid value',
          validationCallback(params): JQueryPromise<unknown> {
            const d = $.Deferred();
            // The validation answers late, like a server: the test checks the pending state.
            // eslint-disable-next-line no-restricted-syntax
            setTimeout(() => {
              d.resolve(params.data.name.length < 2);
            }, 1000);
            return d.promise();
          },
        }],
      }],
    }), GRID_SELECTOR, { arg: DEFAULT_CONFIG });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const cancelButton = dataGrid.getHeaderPanel().getCancelButton();
    const dataRow = dataGrid.getDataRow(0);
    const cell0 = dataRow.getDataCell(0);
    const cell1 = dataRow.getDataCell(1);
    const editor0 = cell0.getEditor();
    const editor1 = cell1.getEditor();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await cell0.element.click();

    await cell0.expectFocusVisible();
    await expect(editor0.element).toBeAttached();

    await typeText(editor0.element, 'test');
    await page.keyboard.press('Enter');

    await expect(cell1.getPendingIndicator()).toBeAttached();
    await cell0.expectModified();
    await cell0.expectFocusVisible();
    await cell1.expectInvalid();

    await cancelButton.click();

    await cell0.expectModified(false);
    await cell0.expectFocusVisible(false);
    await cell1.expectInvalid(false);
    await expect(cell1.getPendingIndicator()).not.toBeAttached();

    await cell0.element.click();

    await cell0.expectFocusVisible();
    await expect(editor0.element).toBeAttached();

    await typeText(editor0.element, 'test');
    await page.keyboard.press('Enter');

    await expect(cell1.getPendingIndicator()).toBeAttached();
    await cell0.expectModified();
    await cell0.expectFocusVisible();
    await cell1.expectInvalid();
    await expect(editor1.element).toBeAttached();

    await editor1.element.click();

    await expect(cell1.getPendingIndicator()).toBeAttached();
    await cell1.expectInvalid();
    await expect(cell1.getInvalidMessage()).toBeAttached();
    await cell1.expectFocusVisible();
    await cell0.expectFocusVisible(false);
    await cell0.expectModified();

    await cell0.element.click();

    await expect(editor0.element).toBeAttached();

    await typeText(editor0.element, 't', { replace: true });
    await page.keyboard.press('Enter');

    await expect(cell1.getPendingIndicator()).toBeAttached();
    await cell1.expectInvalid(false);
  });

  // T905677
  test('Rollback changes on a click on a revert button  when startEditAction is dblclick', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ name: 'test', test: false }],
      editing: {
        mode: 'cell',
        allowUpdating: true,
        startEditAction: 'dblClick',
      },
      columns: ['name',
        {
          dataField: 'test',
          dataType: 'boolean',
          showEditorAlways: false,
        },
      ],
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const cell0 = dataGrid.getDataRow(0).getDataCell(1);
    const revertButton = dataGrid.getRevertButton();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await cell0.element.dblclick();

    await cell0.expectEditCell();

    await cell0.getCheckbox().click();

    await expect(revertButton).toBeAttached();

    await revertButton.click();

    await expect(revertButton).not.toBeAttached();
    await cell0.expectEditCell(false);
    await expect.poll(() => dataGrid.apiGetCellValue(0, 1)).toBeFalsy();
  });

  test('Row - Redundant validation messages should not be rendered in a detail grid when focused row is enabled (T950174)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{ id: 1, field: 'field' }],
      keyExpr: 'id',
      loadingTimeout: null,
      masterDetail: {
        enabled: true,
        template(): any {
          return ($('<div id="detailContainer">') as any).dxDataGrid({
            dataSource: [],
            keyExpr: 'id',
            focusedRowEnabled: true,
            columns: [
              {
                dataField: 'id',
                validationRules: [
                  { type: 'required' },
                ],
              },
              {
                dataField: 'field',
                validationRules: [
                  { type: 'required' },
                ],
              }],
            editing: {
              mode: 'row',
              allowAdding: true,
              allowUpdating: true,
            },
          });
        },
      },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const detailGrid = new DataGrid(page, '#detailContainer');
    const overlay = dataGrid.getOverlay();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataRow(0).getCommandCell(0).element.click();
    await detailGrid.getHeaderPanel().getAddRowButton().click();
    await detailGrid.getDataRow(0).getCommandCell(2).getButton(0).click();
    await detailGrid.getDataCell(0, 0).element.click();

    // The message moves to the clicked cell a moment after the click: count once it is there.
    await expect(detailGrid.getDataCell(0, 0).getInvalidMessage()).toBeAttached();
    await expect(overlay.getInvalidMessage()).toHaveCount(1);

    await detailGrid.getDataCell(0, 1).element.click();

    await expect(detailGrid.getDataCell(0, 1).getInvalidMessage()).toBeAttached();
    await expect(overlay.getInvalidMessage()).toHaveCount(1);

    await detailGrid.getDataCell(0, 0).element.click();

    await expect(detailGrid.getDataCell(0, 0).getInvalidMessage()).toBeAttached();
    await expect(overlay.getInvalidMessage()).toHaveCount(1);
  });

  test('Cell - Redundant validation messages should not be rendered in a detail grid when focused row is enabled (T950174)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{ id: 1, field: 'field' }],
      keyExpr: 'id',
      loadingTimeout: null,
      masterDetail: {
        enabled: true,
        template(): any {
          return ($('<div id="detailContainer">') as any).dxDataGrid({
            dataSource: [],
            keyExpr: 'id',
            focusedRowEnabled: true,
            columns: [
              {
                dataField: 'id',
                validationRules: [
                  { type: 'required' },
                ],
              },
              {
                dataField: 'field',
                validationRules: [
                  { type: 'required' },
                ],
              }],
            editing: {
              mode: 'cell',
              allowAdding: true,
              allowUpdating: true,
            },
          });
        },
      },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const detailGrid = new DataGrid(page, '#detailContainer');
    const overlay = dataGrid.getOverlay();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataRow(0).getCommandCell(0).element.click();
    await detailGrid.getHeaderPanel().getAddRowButton().click();
    await detailGrid.getHeaderPanel().element.click();

    // The message moves to the clicked cell a moment after the click: count once it is there.
    await expect(detailGrid.getDataCell(0, 0).getInvalidMessage()).toBeAttached();
    await expect(overlay.getInvalidMessage()).toHaveCount(1);
    await expect(overlay.getRevertTooltip()).toHaveCount(1);

    await detailGrid.getDataCell(0, 1).element.click();

    await expect(detailGrid.getDataCell(0, 1).getInvalidMessage()).toBeAttached();
    await expect(overlay.getInvalidMessage()).toHaveCount(1);
    await expect(overlay.getRevertTooltip()).toHaveCount(1);

    await detailGrid.getDataCell(0, 0).element.click();

    await expect(detailGrid.getDataCell(0, 0).getInvalidMessage()).toBeAttached();
    await expect(overlay.getInvalidMessage()).toHaveCount(1);
    await expect(overlay.getRevertTooltip()).toHaveCount(1);
  });

  test('Batch - Redundant validation messages should not be rendered in a detail grid when focused row is enabled (T950174)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{ id: 1, field: 'field' }],
      keyExpr: 'id',
      loadingTimeout: null,
      masterDetail: {
        enabled: true,
        template(): any {
          return ($('<div id="detailContainer">') as any).dxDataGrid({
            dataSource: [],
            keyExpr: 'id',
            focusedRowEnabled: true,
            columns: [
              {
                dataField: 'id',
                validationRules: [
                  { type: 'required' },
                ],
              },
              {
                dataField: 'field',
                validationRules: [
                  { type: 'required' },
                ],
              }],
            editing: {
              mode: 'batch',
              allowAdding: true,
              allowUpdating: true,
            },
          });
        },
      },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const detailGrid = new DataGrid(page, '#detailContainer');
    const overlay = dataGrid.getOverlay();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataRow(0).getCommandCell(0).element.click();
    await detailGrid.getHeaderPanel().getAddRowButton().click();
    await detailGrid.getHeaderPanel().getSaveButton().click();
    await detailGrid.getDataCell(0, 0).element.click();

    // The message moves to the clicked cell a moment after the click: count once it is there.
    await expect(detailGrid.getDataCell(0, 0).getInvalidMessage()).toBeAttached();
    await expect(overlay.getInvalidMessage()).toHaveCount(1);

    await detailGrid.getDataCell(0, 1).element.click();

    await expect(detailGrid.getDataCell(0, 1).getInvalidMessage()).toBeAttached();
    await expect(overlay.getInvalidMessage()).toHaveCount(1);

    await detailGrid.getDataCell(0, 0).element.click();

    await expect(detailGrid.getDataCell(0, 0).getInvalidMessage()).toBeAttached();
    await expect(overlay.getInvalidMessage()).toHaveCount(1);
  });

  test('The "Cannot read property "brokenRules" of undefined" error occurs T978286', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        ID: 1,
        LastName: 'Heart',
        Active: false,
      }, {
        ID: 1,
        LastName: 'Broken',
        Active: false,
      }],
      keyExpr: 'ID',
      editing: {
        allowUpdating: true,
        mode: 'cell',
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const lastName0 = dataGrid.getDataCell(0, 1);
    const active1 = dataGrid.getDataCell(1, 2);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await lastName0.element.click();
    await typeText(lastName0.getEditor().element, '1');
    await active1.element.click();
    await lastName0.element.click();
  });

  (['Cell', 'Batch'] as const).forEach((editMode) => {
    test(`${editMode} - Edit cell should be focused correclty when showEditorAlways is enabled (T976141)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (mode) => ({
        dataSource: [
          { id: 1, field: 'field' },
          { id: 2, field: 'field' },
          { id: 3, field: 'field' },
        ],
        keyExpr: 'id',
        editing: {
          mode,
          allowUpdating: true,
        },
        loadingTimeout: null,
        customizeColumns(columns) {
          columns.forEach((col) => {
            col.showEditorAlways = true;
          });
        },
      }), GRID_SELECTOR, { arg: editMode.toLowerCase() as Lowercase<typeof editMode> });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      // direct order
      for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
        for (let colIndex = 0; colIndex < 2; colIndex += 1) {
          const currentCell = dataGrid.getDataCell(rowIndex, colIndex);

          await currentCell.getEditor().element.click();

          await currentCell.expectFocusVisible();
          await expect(currentCell.getEditor().element).toBeFocused();
        }
      }

      // reverse order
      for (let rowIndex = 2; rowIndex >= 0; rowIndex -= 1) {
        for (let colIndex = 1; colIndex >= 0; colIndex -= 1) {
          const currentCell = dataGrid.getDataCell(rowIndex, colIndex);

          await currentCell.getEditor().element.click();

          await currentCell.expectFocusVisible();
          await expect(currentCell.getEditor().element).toBeFocused();
        }
      }
    });
  });

  (['Batch', 'Cell'] as const).forEach((editMode) => {
    test(`${editMode} - Cell value should not be reset when a checkbox in a neigboring cell is clicked (T1023809)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          { id: 1, field1: 'test', field2: true },
        ],
        keyExpr: 'id',
        columns: ['field1', 'field2'],
        editing: {
          mode: editMode.toLowerCase() as Lowercase<typeof editMode>,
          allowUpdating: true,
        },
      });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      const firstCell = dataGrid.getDataCell(0, 0);
      const secondCell = dataGrid.getDataCell(0, 1);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await firstCell.element.click();

      await firstCell.expectEditCell();
      await firstCell.expectFocusVisible();
      await expect(firstCell.getEditor().element).toBeFocused();

      await typeText(firstCell.getEditor().element, '123', { replace: true });
      await secondCell.getEditor().element.click();

      await expect.poll(() => dataGrid.apiGetCellValue(0, 0)).toBe('123');
    });
  });

  test('Component sends unexpected filtering request after inserting a new row if focusedRowEnabled is true and key set in data source (T1181477)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => {
      const dataSourceCore = [
        { ID: 1, Name: 'Name 1' },
        { ID: 2, Name: 'Name 2' },
        { ID: 3, Name: 'Name 3' },
      ];

      // The API answers late, like a server.
      /* eslint-disable no-restricted-syntax */
      const sampleAPI = {
        load() {
          const data = dataSourceCore;
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(data);
            }, 100);
          });
        },
        totalCount() {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(dataSourceCore.length);
            }, 100);
          });
        },
        insert(values) {
          return new Promise((resolve) => {
            setTimeout(() => {
              const newID = dataSourceCore.length + 1;
              values.ID = newID;
              dataSourceCore.push(values);
              resolve(newID);
            }, 100);
          });
        },
      };
      /* eslint-enable no-restricted-syntax */

      const store = new (window as any).DevExpress.data.CustomStore({
        key: 'ID',
        load(o) {
          if (o.filter) {
            $('#otherContainer').append('Fail');
          }

          return Promise.all([sampleAPI.load(), sampleAPI.totalCount()]).then((res) => ({
            data: res[0],
            totalCount: res[1],
          }));
        },
        insert(values) {
          return sampleAPI.insert(values);
        },
      });

      return {
        dataSource: store,
        showBorders: true,
        focusedRowEnabled: true,
        autoNavigateToFocusedRow: true,
        editing: {
          allowAdding: true,
        },
        remoteOperations: true,
      };
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getHeaderPanel().getAddRowButton().click();

    const newRow = getFirstDataRow(dataGrid);

    await newRow.expectInserted();
    await newRow.getCommandCell(2).getSaveButton().click();

    await expect(dataGrid.getDataCell(3, 1).element).toBeAttached();
    await expect(dataGrid.getDataCell(3, 1).element).not.toContainText('Name 3');

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect(page.locator('#otherContainer')).toHaveText('');
  });

  test('Component sends unexpected filtering request after inserting a new row if focusedRowEnabled is true and key set on event (T1181477)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => {
      const dataSourceCore = [
        { ID: 1, Name: 'Name 1' },
        { ID: 2, Name: 'Name 2' },
        { ID: 3, Name: 'Name 3' },
      ];

      const sampleAPI = new (window as any).DevExpress.data.ArrayStore(dataSourceCore);

      const store = new (window as any).DevExpress.data.CustomStore({
        key: 'ID',
        load(o) {
          if (o.filter) {
            $('#otherContainer').append('Fail');
          }

          return Promise.all([sampleAPI.load(), sampleAPI.totalCount()]).then((res) => ({
            data: res[0],
            totalCount: res[1],
          }));
        },
        insert(values) {
          return sampleAPI.insert(values);
        },
      });

      return {
        dataSource: store,
        showBorders: true,
        focusedRowEnabled: true,
        autoNavigateToFocusedRow: true,
        editing: {
          allowAdding: true,
        },
        onInitNewRow(e) {
          e.promise = new Promise((resolve) => {
            const newId = dataSourceCore.length + 1;
            e.data.ID = newId;
            resolve(undefined);
          });
        },
        remoteOperations: true,
      };
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getHeaderPanel().getAddRowButton().click();

    const newRow = getFirstDataRow(dataGrid);

    await newRow.expectInserted();
    await newRow.getCommandCell(2).getSaveButton().click();

    await expect(dataGrid.getDataCell(3, 1).element).toBeAttached();
    await expect(dataGrid.getDataCell(3, 1).element).not.toContainText('Name 3');

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect(page.locator('#otherContainer')).toHaveText('');
  });

  // T1194439
  test('Focus behavior should be correct when editing cells', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [...new Array(10)].map((_, i) => ({
        ID: i + 1,
        CompanyName: `company name ${i + 1}`,
        City: `city ${i + 1}`,
      })),
      keyExpr: 'ID',
      columns: [{
        dataField: 'CompanyName',
        showEditorAlways: true,
      }, {
        caption: 'City',
        calculateCellValue(rowData) { return rowData.City; },
        allowEditing: false,
      }],
      showBorders: true,
      editing: {
        allowUpdating: true,
        mode: 'batch',
      },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    for (let i = 0; i < 10; i += 1) {
      const cell = dataGrid.getDataCell(i, 0);

      await cell.element.click();

      await cell.expectEditCell();
      await cell.expectFocusVisible();

      await typeText(cell.getEditor().element, `new_value ${i}`);
    }
  });

  // T1291087
  test('The editCellTemplate template should not be called after clicking on a cell in another row and column', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => {
      (window as any).editCellTemplateCallArgs = [];

      return {
        dataSource: [
          {
            ID: 1, Column1: 'a', Column2: 'b', Column3: 'c',
          },
          {
            ID: 2, Column1: 'd', Column2: 'e', Column3: 'f',
          },
          {
            ID: 3, Column1: 'g', Column2: 'h', Column3: 'i',
          },
        ],
        keyExpr: 'ID',
        columns: [{
          dataField: 'Column1',
          editCellTemplate(_, cellInfo) {
            (window as any).editCellTemplateCallArgs.push(cellInfo.column.dataField);

            return ($('<div>') as any).dxTextBox({
              value: cellInfo.value,
              onValueChanged: (args) => cellInfo.setValue(args.value),
            });
          },
        }, 'Column2', 'Column3'],
        showBorders: true,
        editing: { mode: 'batch', allowUpdating: true },
      };
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const firstCellOfFirstRow = dataGrid.getDataCell(0, 0);
    const secondCellOfSecondRow = dataGrid.getDataCell(1, 1);
    // editCellTemplate is called only once, for the first column only.
    const expectEditCellTemplateCallArgs = (): Promise<void> => expect.poll(
      () => page.evaluate(() => (window as any).editCellTemplateCallArgs),
    ).toEqual(['Column1']);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await firstCellOfFirstRow.element.click();

    await firstCellOfFirstRow.expectEditCell();
    await expect(firstCellOfFirstRow.getEditor().element).toBeFocused();
    await expectEditCellTemplateCallArgs();

    await secondCellOfSecondRow.element.click();

    await secondCellOfSecondRow.expectEditCell();
    await expect(secondCellOfSecondRow.getEditor().element).toBeFocused();
    await expectEditCellTemplateCallArgs();
  });

  // T1291087
  test('The onEditorPreparing event should be called once after clicking on a cell in another row and column', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => {
      (window as any).onEditorPreparingCallArgs = [];

      return {
        dataSource: [
          {
            ID: 1, Column1: 'a', Column2: 'b', Column3: 'c',
          },
          {
            ID: 2, Column1: 'd', Column2: 'e', Column3: 'f',
          },
          {
            ID: 3, Column1: 'g', Column2: 'h', Column3: 'i',
          },
        ],
        keyExpr: 'ID',
        columns: ['Column1', 'Column2', 'Column3'],
        showBorders: true,
        editing: { mode: 'batch', allowUpdating: true },
        onEditorPreparing(e) {
          (window as any).onEditorPreparingCallArgs.push({
            dataField: e.dataField,
            rowIndex: e.row?.rowIndex,
          });
        },
      };
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const firstCellOfFirstRow = dataGrid.getDataCell(0, 0);
    const secondCellOfSecondRow = dataGrid.getDataCell(1, 1);
    const getCallArgs = (): Promise<unknown[]> => page.evaluate(
      () => (window as any).onEditorPreparingCallArgs,
    );
    const expectOnEditorPreparingCallArgs = async (
      expectedCallCount: number,
      expectedArgs: unknown,
    ): Promise<void> => {
      await expect.poll(getCallArgs).toHaveLength(expectedCallCount);
      expect((await getCallArgs())[expectedCallCount - 1]).toEqual(expectedArgs);
    };

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await firstCellOfFirstRow.element.click();

    await firstCellOfFirstRow.expectEditCell();
    await expect(firstCellOfFirstRow.getEditor().element).toBeFocused();
    await expectOnEditorPreparingCallArgs(1, { dataField: 'Column1', rowIndex: 0 });

    await secondCellOfSecondRow.element.click();

    await secondCellOfSecondRow.expectEditCell();
    await expect(secondCellOfSecondRow.getEditor().element).toBeFocused();
    await expectOnEditorPreparingCallArgs(2, { dataField: 'Column2', rowIndex: 1 });
  });

  test('Adding rows to a second page should work correctly when initial row values ​​are specified in the onInitNewRow method (T1274123)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => {
      const myData = new Array(30).fill(null).map((_, index) => ({ id: index + 1, text: `item ${index + 1}` }));
      const myStore = new (window as any).DevExpress.data.ArrayStore({
        key: 'id',
        data: myData,
      });

      return {
        // @ts-expect-error CustomStore options as the data source, which the types don't allow
        dataSource: {
          key: 'id',
          load(loadOptions) {
            return myStore.load(loadOptions);
          },
          totalCount() {
            return myStore.totalCount();
          },
          insert(values) {
            if (values.id === 0) {
              values.id = myData.length + 1;
            }

            return myStore.insert(values);
          },
        },
        columns: ['id', 'text'],
        showBorders: true,
        editing: {
          mode: 'popup',
          allowAdding: true,
        },
        onInitNewRow(e) {
          e.data.id = 0;
          e.data.text = 'test';
        },
        height: 300,
      };
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const editPopup = dataGrid.getEditPopup();
    const addAndSaveData = async (): Promise<void> => {
      await dataGrid.apiAddRow();

      await expect.poll(() => editPopup.isVisible()).toBe(true);

      await dataGrid.apiSaveEditData();

      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await expect.poll(() => editPopup.isVisible()).toBe(false);
    };

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiPageIndex(1);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(async () => (await dataGrid.apiGetVisibleRows()).length).toBe(10);
    await expect(dataGrid.getDataCell(20, 0).element).toHaveText('21');

    await addAndSaveData();
    await addAndSaveData();

    const visibleRows = await dataGrid.apiGetVisibleRows();

    expect(visibleRows.length).toBe(12);
    expect(visibleRows[10].key).toBe(31);
    expect(visibleRows[11].key).toBe(32);
  });
});

test.describe('Editing - ShowEditorAlways', () => {
  test('Cells should be focused correctly on click when cell editing mode is used with enabled showEditorAlways (T1037019)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => {
      const myStore = new (window as any).DevExpress.data.ArrayStore({
        key: 'ID',
        data: [
          { ID: 1, Name: 'Name 1' },
          { ID: 2, Name: 'Name 2' },
          { ID: 3, Name: 'Name 3' },
        ],
      });

      (window as any).myStore = myStore;

      // The store answers late, like a server.
      /* eslint-disable no-restricted-syntax */
      return {
        // @ts-expect-error CustomStore options as the data source, which the types don't allow
        dataSource: {
          key: 'ID',
          load(loadOptions) {
            return new Promise((resolve) => {
              setTimeout(() => {
                myStore.load(loadOptions).done((data) => {
                  resolve(data);
                });
              }, 100);
            });
          },
          update(key, values) {
            return new Promise((resolve) => {
              setTimeout(() => {
                myStore.update(key, values).done(() => {
                  resolve(key);
                });
              }, 100);
            });
          },
          totalCount(loadOptions) {
            return myStore.totalCount(loadOptions);
          },
        },
        keyExpr: 'ID',
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
        columns: [{
          dataField: 'Name',
          showEditorAlways: true,
        }],
      };
      /* eslint-enable no-restricted-syntax */
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const getEditor = (rowIndex: number) => dataGrid.getDataCell(rowIndex, 0).getEditor().element;
    const getStoredName = (id: number): Promise<string> => page.evaluate(async (key) => {
      const item = await (window as any).myStore.byKey(key);

      return item.Name;
    }, id);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await getEditor(0).click();

    await dataGrid.getDataCell(0, 0).expectFocusVisible();
    await expect(getEditor(0)).toBeFocused();

    await typeText(getEditor(0), '1');
    await getEditor(1).click();

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect.poll(() => getStoredName(1)).toBe('Name 11');

    await expect.poll(() => dataGrid.apiGetCellValue(0, 0)).toBe('Name 11');
    await dataGrid.getDataCell(1, 0).expectFocusVisible();
    await expect(getEditor(1)).toBeFocused();

    await typeText(getEditor(1), '2');
    await getEditor(2).click();

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect.poll(() => getStoredName(2)).toBe('Name 22');

    await expect.poll(() => dataGrid.apiGetCellValue(1, 0)).toBe('Name 22');
    await dataGrid.getDataCell(2, 0).expectFocusVisible();
    await expect(getEditor(2)).toBeFocused();
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await typeText(getEditor(2), '3');
    await getEditor(1).click();

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect.poll(() => getStoredName(3)).toBe('Name 33');

    await expect.poll(() => dataGrid.apiGetCellValue(2, 0)).toBe('Name 33');
    await dataGrid.getDataCell(1, 0).expectFocusVisible();
    await expect(getEditor(1)).toBeFocused();

    await typeText(getEditor(1), '2');
    await getEditor(0).click();

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect.poll(() => getStoredName(2)).toBe('Name 222');

    await expect.poll(() => dataGrid.apiGetCellValue(1, 0)).toBe('Name 222');
    await dataGrid.getDataCell(0, 0).expectFocusVisible();
    await expect(getEditor(0)).toBeFocused();
  });

  // T1165529
  [
    false,
    true,
  ].forEach((remoteOperations) => {
    test(`Empty rows should not appear after rows are updated in batch editing mode when paging and validation are enabled and remoteOperations=${remoteOperations}`, async ({ page }) => {
      const data = getData(10, 4);

      await createWidget(page, 'dxDataGrid', ({ items, remote }) => ({
        dataSource: items,
        keyExpr: 'field_0',
        paging: {
          pageSize: 5,
        },
        remoteOperations: remote,
        editing: {
          allowUpdating: true,
          mode: 'batch',
        },
        columns: [
          {
            dataField: 'field_0',
            validationRules: [
              {
                type: 'custom',
                validationCallback: (options) => options.value !== 'val_5_0',
              },
            ],
          },
          'field_1',
          'field_2',
          'field_3',
        ],
      }), GRID_SELECTOR, { arg: { items: data, remote: remoteOperations } });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      // Inject the changes only after the grid has finished its initial load. Setting
      // editing.changes for off-page rows before the store data is cached leaves their oldData
      // unresolved, so their validators are never created (T1165529) and the invalid row is
      // skipped: the grid then renders one row fewer.
      const columnToModify = 'field_1';
      const changes = await dataGrid.option('editing.changes');

      data.map((e) => e.field_0).forEach((key) => {
        const editData = changes.find(
          (change) => change.type === 'update' && change.key === key,
        );
        if (editData) {
          editData.data[columnToModify] = 'EEEEEE';
        } else {
          changes.push({
            type: 'update',
            key,
            data: { [columnToModify]: 'EEEEEE' },
          });
        }
      });
      await dataGrid.option('editing.changes', changes);

      await dataGrid.getHeaderPanel().getSaveButton().click();

      await expect(dataGrid.getDataRows()).toHaveCount(remoteOperations ? 5 : 6);
      await expect(dataGrid.getDataCell(0, 0).element).toHaveText(remoteOperations ? 'val_0_0' : 'val_5_0');
    });
  });
});
