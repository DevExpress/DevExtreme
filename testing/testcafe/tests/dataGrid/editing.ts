/* eslint-disable @typescript-eslint/no-floating-promises */

import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../helpers/createWidget';
import DataGrid, { CLASS } from '../../model/dataGrid';
import SelectBox from '../../model/selectBox';
import { changeTheme } from '../../helpers/changeTheme';
import { Overlay } from '../../model/dataGrid/overlay';

fixture.disablePageReloads`Editing`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => disposeWidgets());

const getGridConfig = (config): Record<string, unknown> => {
  const defaultConfig = {
    errorRowEnabled: true,
    dataSource: [{
      id: 1, name: 'Alex', age: 15, lastName: 'John',
    }],
    keyExpr: 'id',
    legacyRendering: false,
  };

  return config ? { ...defaultConfig, ...config } : defaultConfig;
};

test('Tab key on editor should focus next cell if editing mode is cell', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getDataCell(0, 1).element)
    .pressKey('1 tab')
    .expect(dataGrid.getDataCell(1, 1).isFocused).ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{ name: 'AaAaA', value: 1 }, { name: 'aAaAa', value: 2 }],
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
  columns: [{ dataField: 'name', allowEditing: false }, { dataField: 'value', showEditorAlways: true }],
}));

test('Click should work if a column button set using svg icon (T863635)', async (t) => {
  await t
    .click(Selector('.dx-command-edit-with-icons').nth(0))
    .expect(ClientFunction(() => (window as any).onSvgClickCounter)()).eql(1);
}).before(async () => createWidget('dxDataGrid', {
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

test('Value change on dataGrid row should be fired after clicking on editor (T823431)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const selectBox = new SelectBox('#otherContainer');

  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .typeText(dataGrid.getDataCell(0, 0).element, 'new_value')
    .click(selectBox.dropDownButton)
    .expect(dataGrid.getDataCell(0, 0).element.textContent)
    .eql('new_value');
}).before(async () => Promise.all([
  createWidget('dxDataGrid', {
    dataSource: [{ name: 'old_value', value: 1 }],
    editing: {
      mode: 'batch',
      allowUpdating: true,
      selectTextOnEditStart: true,
      startEditAction: 'click',
    },
  }),
  createWidget('dxSelectBox', {}, false, '#otherContainer'),
]));

test('Async Validation(Row) - Only valid data is saved in a new row', async (t) => {
  const dataGrid = new DataGrid('#container');

  const rowIndex = 0;
  const columnIndex = 0;
  const headerPanel = dataGrid.getHeaderPanel();
  const dataRow = dataGrid.getDataRow(rowIndex);
  const cell0 = dataRow.getDataCell(columnIndex);
  const editor0 = cell0.getEditor();
  const saveButton = dataRow.getCommandCell(3).getButton(0);

  await t
    .click(headerPanel.getAddRowButton())
    .expect(dataRow.isInserted).ok('row is inserted')
    .expect(cell0.isValidationPending)
    .notOk()
    .expect(cell0.isInvalid)
    .notOk()
    .click(saveButton)
    .expect(cell0.isValidationPending)
    .ok()
    .expect(dataRow.isInserted)
    .ok('row is still inserted')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex))
    .eql('invalid')
    .expect(cell0.isInvalid)
    .ok('the first cell is invalid')
    .typeText(editor0.element, '1')
    .click(saveButton)
    .expect(dataRow.isInserted)
    .notOk('row is not in editing mode')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex))
    .notOk('the first cell does not have cached validation result');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
        setTimeout(() => {
          if (params.value === 1) d.resolve(true);
          else d.reject();
        }, 1000);
        return d.promise();
      },
    }],
  }, 'name', 'lastName'],
})));

test('Async Validation(Row) - Only valid data is saved in a modified row', async (t) => {
  const dataGrid = new DataGrid('#container');

  const rowIndex = 0;
  const columnIndex = 0;
  const dataRow = dataGrid.getDataRow(rowIndex);
  const cell0 = dataRow.getDataCell(columnIndex);
  const editor0 = cell0.getEditor();
  const editButton = dataRow.getCommandCell(3).getButton(0);
  const saveButton = dataRow.getCommandCell(3).getButton(0);

  await t
    .click(editButton)
    .selectText(editor0.element, 0, 2)
    .typeText(editor0.element, '3')
    .click(saveButton)
    .expect(cell0.isValidationPending)
    .ok()
    .expect(dataRow.isEdited)
    .ok('first row is still editing')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex))
    .eql('invalid')
    .expect(cell0.isInvalid)
    .ok('the first cell is invalid')
    .selectText(editor0.element, 0, 1)
    .typeText(editor0.element, '1')
    .click(saveButton)
    .expect(dataRow.isEdited)
    .notOk('row is not in editing mode')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex))
    .notOk('the first cell does not have cached validation result');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
        setTimeout(() => {
          if (params.value === 1) d.resolve(true);
          else d.reject();
        }, 1000);
        return d.promise();
      },
    }],
  }, 'name', 'lastName'],
})));

test('Async Validation(Row) - Data is not saved when a dependant cell value becomes invalid', async (t) => {
  const dataGrid = new DataGrid('#container');

  const rowIndex = 0;
  const dataRow = dataGrid.getDataRow(rowIndex);
  const cell0 = dataRow.getDataCell(0);
  const cell1 = dataRow.getDataCell(1);
  const editor0 = cell0.getEditor();
  const editButton = dataRow.getCommandCell(3).getButton(0);
  const saveButton = dataRow.getCommandCell(3).getButton(0);

  await t
    .click(editButton)
    .selectText(editor0.element, 0, 2)
    .typeText(editor0.element, '3')
    .click(saveButton)
    .expect(cell0.isValidationPending)
    .ok()
    .expect(dataRow.isEdited)
    .ok('first row is in editing mode')
    .expect(cell0.isInvalid)
    .ok('the first cell is invalid')
    .expect(cell1.isInvalid)
    .notOk('the second cell is valid')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, 0))
    .eql('invalid')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, 1))
    .eql('valid')
    .selectText(editor0.element, 0, 1)
    .typeText(editor0.element, '1')
    .click(saveButton)
    .expect(dataRow.isEdited)
    .ok('row is in editing mode')
    .expect(cell0.isInvalid)
    .notOk('the first cell is valid')
    .expect(cell1.isInvalid)
    .ok('the second cell is invalid')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, 0))
    .eql('valid')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, 1))
    .eql('invalid');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
})));

test('Async Validation(Cell) - Only the last cell should be switched to edit mode', async (t) => {
  const dataGrid = new DataGrid('#container');
  const cell0 = dataGrid.getDataCell(0, 0);
  const cell1 = dataGrid.getDataCell(0, 1);
  const cell2 = dataGrid.getDataCell(0, 2);

  await t
    .click(cell0.element)
    .expect(cell0.isValidationPending).ok()
    .click(cell1.element)
    .expect(cell1.isFocused)
    .notOk('the second cell should not be focused')
    .click(cell2.element)
    .expect(cell0.isValidationPending)
    .notOk('validating is completed')
    .expect(cell2.hasHiddenFocusState)
    .notOk()
    .expect(cell2.isFocused)
    .ok('the third cell should be focused');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
        const d = $.Deferred();
        setTimeout(() => {
          d.resolve(true);
        }, 1000);
        return d.promise();
      },
    }],
  }, 'name', 'lastName'],
})));

test('Async Validation(Cell) - Only valid data is saved in a new row', async (t) => {
  const dataGrid = new DataGrid('#container');

  const rowIndex = 0;
  const columnIndex = 0;
  const headerPanel = dataGrid.getHeaderPanel();
  const dataRow = dataGrid.getDataRow(rowIndex);
  const cell0 = dataRow.getDataCell(columnIndex);
  const editor0 = cell0.getEditor();

  await t
    .click(headerPanel.getAddRowButton())
    .expect(dataRow.isInserted).ok('row is inserted')
    .expect(cell0.isValidationPending)
    .notOk()
    .expect(cell0.isInvalid)
    .notOk()
    .click(cell0.element)
    .pressKey('enter')
    .expect(dataRow.isInserted)
    .ok('row is still inserted')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex))
    .eql('invalid')
    .expect(cell0.isInvalid)
    .ok('the first cell is invalid')
    .click(cell0.element)
    .typeText(editor0.element, '1')
    .pressKey('enter')
    .expect(dataRow.isInserted)
    .notOk('row is not in editing mode')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex))
    .notOk('the first cell does not have cached validation result');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
        setTimeout(() => {
          if (params.value === 1) d.resolve(true);
          else d.reject();
        }, 1000);
        return d.promise();
      },
    }],
  }, 'name', 'lastName'],
})));

test('Async Validation(Cell) - Only valid data is saved in a modified cell', async (t) => {
  const dataGrid = new DataGrid('#container');

  const rowIndex = 0;
  const columnIndex = 0;
  const cell0 = dataGrid.getDataRow(rowIndex).getDataCell(columnIndex);
  const editor0 = cell0.getEditor();

  await t
    .click(cell0.element)
    .expect(cell0.isValidationPending).ok()
    .expect(cell0.isEditCell)
    .ok()
    .expect(cell0.isInvalid)
    .ok()
    .selectText(editor0.element, 0, 2)
    .typeText(editor0.element, '3')
    .pressKey('enter')
    .expect(cell0.isValidationPending)
    .ok()
    .expect(cell0.isEditCell)
    .ok()
    .expect(cell0.isInvalid)
    .ok('the first cell is invalid')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex))
    .eql('invalid')
    .click(cell0.element)
    .selectText(editor0.element, 0, 1)
    .typeText(editor0.element, '1')
    .pressKey('enter')
    .expect(cell0.isValidationPending)
    .ok()
    .expect(cell0.isEditCell)
    .notOk()
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex))
    .notOk('the first cell does not have cached validation result');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
        setTimeout(() => {
          if (params.value === 1) d.resolve(true);
          else d.reject();
        }, 1000);
        return d.promise();
      },
    }],
  }, 'name', 'lastName'],
})));

test('Async Validation(Cell) - Data is not saved when a dependant cell value becomes invalid', async (t) => {
  const dataGrid = new DataGrid('#container');

  const cell0 = dataGrid.getDataCell(0, 0);
  const cell1 = dataGrid.getDataCell(0, 1);
  const editor0 = cell0.getEditor();

  await t
    .click(cell0.element)
    .expect(cell0.isValidationPending).ok()
    .expect(cell0.isEditCell)
    .ok()
    .expect(cell0.isInvalid)
    .ok()
    .selectText(editor0.element, 0, 2)
    .typeText(editor0.element, '3')
    .pressKey('enter')
    .expect(cell0.isValidationPending)
    .ok()
    .expect(cell0.isEditCell)
    .ok()
    .expect(cell0.isInvalid)
    .ok('the first cell is invalid')
    .expect(dataGrid.apiGetCellValidationStatus(0, 0))
    .eql('invalid')
    .expect(cell1.isEditCell)
    .notOk()
    .expect(cell1.isInvalid)
    .notOk('the second cell is valid')
    .expect(dataGrid.apiGetCellValidationStatus(0, 1))
    .eql('valid')
    .click(cell0.element)
    .selectText(editor0.element, 0, 1)
    .typeText(editor0.element, '1')
    .pressKey('enter')
    .expect(cell0.isValidationPending)
    .ok()
    .expect(cell0.isEditCell)
    .ok()
    .expect(cell0.isInvalid)
    .notOk('the first cell is valid')
    .expect(dataGrid.apiGetCellValidationStatus(0, 0))
    .eql('valid')
    .expect(cell1.isEditCell)
    .notOk()
    .expect(cell1.isInvalid)
    .ok('the first cell is invalid')
    .expect(dataGrid.apiGetCellValidationStatus(0, 1))
    .eql('invalid');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
})));

test('Cell mode(setCellValue) with async validation - The value of an invalid dependent cell should be updated in a new row(T872751)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await dataGrid.apiAddRow();

  await t
    .typeText(dataGrid.getDataCell(0, 0).getEditor().element, '123')
    .pressKey('enter')
    .expect(dataGrid.getDataCell(0, 1).isInvalid)
    .ok()
    .expect(dataGrid.getDataCell(0, 1).element.textContent)
    .eql('testb');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
        setTimeout(() => {
          d.resolve(false);
        }, 50);
        return d.promise();
      },
    }],
  }, 'lastName'],
})));

test('Cell mode(setCellValue) with async validation - The value of an invalid dependent cell should be updated in a modified row(T872751)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await dataGrid.apiEditCell(0, 0);

  await t
    .typeText(dataGrid.getDataCell(0, 0).getEditor().element, '123')
    .pressKey('enter')
    .expect(dataGrid.getDataCell(0, 1).isInvalid)
    .ok()
    .expect(dataGrid.getDataCell(0, 1).element.textContent)
    .eql('testb');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
        setTimeout(() => {
          d.resolve(false);
        }, 50);
        return d.promise();
      },
    }],
  }, 'lastName'],
})));

test('Cell mode(calculateCellValue) with async validation - The value of an invalid dependent cell should be updated in a new row(T872751)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await dataGrid.apiAddRow();

  await t
    .typeText(dataGrid.getDataCell(0, 0).getEditor().element, '123')
    .pressKey('enter')
    .expect(dataGrid.getDataCell(0, 1).isInvalid)
    .ok()
    .expect(dataGrid.getDataCell(0, 1).element.textContent)
    .eql('123b');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
        setTimeout(() => {
          d.resolve(false);
        }, 50);
        return d.promise();
      },
    }],
  }, 'lastName'],
})));

test('Cell mode(calculateCellValue) with async validation - The value of an invalid dependent cell should be updated in a modified row(T872751)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.apiEditCell(0, 0);

  await t
    .typeText(dataGrid.getDataCell(0, 0).getEditor().element, '123')
    .pressKey('enter')
    .expect(dataGrid.getDataCell(0, 1).isInvalid)
    .ok()
    .expect(dataGrid.getDataCell(0, 1).element.textContent)
    .eql('15123b');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
        setTimeout(() => {
          d.resolve(false);
        }, 50);
        return d.promise();
      },
    }],
  }, 'lastName'],
})));

test('Async Validation(Batch) - Only valid data is saved in a new row', async (t) => {
  const dataGrid = new DataGrid('#container');

  const rowIndex = 0;
  const columnIndex = 0;
  const headerPanel = dataGrid.getHeaderPanel();
  const saveButton = headerPanel.getSaveButton();
  const dataRow = dataGrid.getDataRow(rowIndex);
  const cell0 = dataRow.getDataCell(columnIndex);
  const editor0 = cell0.getEditor();

  await t
    .click(headerPanel.getAddRowButton())
    .expect(dataRow.isInserted).ok('row is inserted')
    .expect(cell0.isValidationPending)
    .notOk()
    .expect(cell0.isInvalid)
    .notOk()
    .click(cell0.element)
    .click(saveButton)
    .expect(cell0.isValidationPending)
    .ok()
    .expect(cell0.isModified)
    .ok()
    .expect(dataRow.isInserted)
    .ok('row is still inserted')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex))
    .eql('invalid')
    .expect(cell0.isInvalid)
    .ok('the first cell is invalid')
    .click(cell0.element)
    .typeText(editor0.element, '1')
    .pressKey('enter')
    .expect(cell0.isValidationPending)
    .ok()
    .expect(cell0.isModified)
    .ok()
    .click(saveButton)
    .expect(dataRow.isInserted)
    .notOk('row is not in editing mode')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex))
    .notOk('the first cell does not have cached validation result');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
        setTimeout(() => {
          if (params.value === 1) d.resolve(true);
          else d.reject();
        }, 1000);
        return d.promise();
      },
    }],
  }, 'name', 'lastName'],
})));

test('Async Validation(Batch) - Only valid data is saved in a modified cell', async (t) => {
  const dataGrid = new DataGrid('#container');

  const rowIndex = 0;
  const columnIndex = 0;
  const headerPanel = dataGrid.getHeaderPanel();
  const saveButton = headerPanel.getSaveButton();
  const cell0 = dataGrid.getDataRow(rowIndex).getDataCell(columnIndex);
  const editor0 = cell0.getEditor();

  await t
    .click(cell0.element)
    .expect(cell0.isValidationPending).ok()
    .expect(cell0.isEditCell)
    .ok()
    .expect(cell0.isInvalid)
    .ok()
    .selectText(editor0.element, 0, 2)
    .typeText(editor0.element, '3')
    .pressKey('enter')
    .expect(cell0.isValidationPending)
    .ok()
    .expect(cell0.isModified)
    .ok()
    .click(saveButton)
    .expect(cell0.isInvalid)
    .ok('the first cell is invalid')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex))
    .eql('invalid')
    .click(cell0.element)
    .expect(cell0.isEditCell)
    .ok()
    .selectText(editor0.element, 0, 1)
    .typeText(editor0.element, '1')
    .pressKey('enter')
    .expect(cell0.isValidationPending)
    .ok()
    .expect(cell0.isModified)
    .ok()
    .click(saveButton)
    .expect(cell0.isEditCell)
    .notOk()
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, columnIndex))
    .notOk('the first cell does not have cached validation result');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
        setTimeout(() => {
          if (params.value === 1) d.resolve(true);
          else d.reject();
        }, 1000);
        return d.promise();
      },
    }],
  }, 'name', 'lastName'],
})));

test('Async Validation(Batch) - Data is not saved when a dependant cell value becomes invalid', async (t) => {
  const dataGrid = new DataGrid('#container');

  const rowIndex = 0;
  const headerPanel = dataGrid.getHeaderPanel();
  const saveButton = headerPanel.getSaveButton();
  const cell0 = dataGrid.getDataRow(rowIndex).getDataCell(0);
  const cell1 = dataGrid.getDataRow(rowIndex).getDataCell(1);
  const editor0 = cell0.getEditor();

  await t
    .click(cell0.element)
    .expect(cell0.isEditCell).ok()
    .expect(cell0.isValidationPending)
    .ok()
    .expect(cell0.isInvalid)
    .ok()
    .selectText(editor0.element, 0, 2)
    .typeText(editor0.element, '3')
    .pressKey('enter')
    .expect(cell0.isValidationPending)
    .ok()
    .expect(cell0.isModified)
    .ok()
    .click(saveButton)
    .expect(cell0.isEditCell)
    .notOk()
    .expect(cell0.isInvalid)
    .ok('the first cell is invalid')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, 0))
    .eql('invalid')
    .expect(cell1.isEditCell)
    .notOk()
    .expect(cell1.isInvalid)
    .notOk('the second cell is valid')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, 1))
    .eql('valid')
    .click(cell0.element)
    .selectText(editor0.element, 0, 1)
    .typeText(editor0.element, '1')
    .pressKey('enter')
    .expect(cell0.isValidationPending)
    .ok()
    .expect(cell0.isModified)
    .ok()
    .expect(cell1.isModified)
    .ok()
    .click(saveButton)
    .expect(cell0.isModified)
    .ok()
    .expect(cell0.isEditCell)
    .notOk()
    .expect(cell0.isInvalid)
    .notOk('the first cell is valid')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, 0))
    .eql('valid')
    .expect(cell1.isModified)
    .ok()
    .expect(cell1.isEditCell)
    .notOk()
    .expect(cell1.isInvalid)
    .ok('the first cell is invalid')
    .expect(dataGrid.apiGetCellValidationStatus(rowIndex, 1))
    .eql('invalid');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
})));

test('Async Validation(Batch) - Data is not saved when a cell with async setCellValue is invalid', async (t) => {
  const dataGrid = new DataGrid('#container');

  const rowIndex = 0;
  const columnIndex = 0;
  const headerPanel = dataGrid.getHeaderPanel();
  const saveButton = headerPanel.getSaveButton();
  const dataRow = dataGrid.getDataRow(rowIndex);
  const cell0 = dataRow.getDataCell(columnIndex);
  const editor0 = cell0.getEditor();

  await t
    .click(headerPanel.getAddRowButton())
    .expect(dataRow.isInserted).ok('row is inserted')
    .expect(cell0.isValidationPending)
    .notOk()
    .expect(cell0.isInvalid)
    .notOk()
    .click(cell0.element)
    .typeText(editor0.element, '123')
    .pressKey('enter')
    .click(saveButton)
    .expect(cell0.isValidationPending)
    .ok()
    .expect(cell0.isValidationPending)
    .notOk()
    .expect(cell0.isInvalid)
    .ok()
    .expect(cell0.isModified)
    .ok()
    .expect(dataRow.isInserted)
    .ok('row is in editing mode');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
        setTimeout(() => {
          if (params.value === 1) d.resolve(true);
          else d.reject();
        }, 1000);
        return d.promise();
      },
    }],
    setCellValue(rowData, value): JQueryPromise<unknown> {
      const d = $.Deferred();
      setTimeout(() => {
        rowData.age = value;
        d.resolve();
      }, 1200);
      return d.promise();
    },
  }, 'name', 'lastName'],
})));

test('Validation(Row) - Unmodified data cell should be marked as invalid when a neighboring cell is modified (reevaluate=false) (T880238)', async (t) => {
  const dataGrid = new DataGrid('#container');

  const dataRow = dataGrid.getDataRow(0);
  const cell0 = dataRow.getDataCell(0);
  const editor0 = cell0.getEditor();
  const cell1 = dataRow.getDataCell(1);
  const commandCell = dataRow.getCommandCell(2);

  await t
    .click(commandCell.getButton(0))

    .expect(cell1.isInvalid).notOk()
    .expect(editor0.element.exists)
    .ok()

    .click(editor0.element)
    .selectText(editor0.element, 0, 2)
    .typeText(editor0.element, '3')
    .pressKey('enter')

    .expect(cell1.isInvalid)
    .ok()

    .click(commandCell.getButton(0))

    .expect(cell1.isInvalid)
    .ok()

    .click(editor0.element)
    .selectText(editor0.element, 0, 1)
    .typeText(editor0.element, '10')
    .pressKey('enter')

    .expect(cell1.isInvalid)
    .ok()

    .click(commandCell.getButton(0))

    .expect(cell1.isInvalid)
    .ok('the second cell is marked as invalid')
    .expect(dataRow.isEdited)
    .ok('row is still in editing mode');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
})));

test('Validation(Row) - Unmodified data cell should be marked as invalid when a neighboring cell is modified (reevaluate=true) (T880238)', async (t) => {
  const dataGrid = new DataGrid('#container');

  const dataRow = dataGrid.getDataRow(0);
  const cell0 = dataRow.getDataCell(0);
  const editor0 = cell0.getEditor();
  const cell1 = dataRow.getDataCell(1);
  const commandCell = dataRow.getCommandCell(2);

  await t
    .click(commandCell.getButton(0))

    .expect(cell1.isInvalid).notOk()
    .expect(editor0.element.exists)
    .ok()

    .click(editor0.element)
    .selectText(editor0.element, 0, 2)
    .typeText(editor0.element, '3')
    .pressKey('enter')

    .expect(cell1.isInvalid)
    .ok()

    .click(commandCell.getButton(0))

    .expect(cell1.isInvalid)
    .ok()

    .click(editor0.element)
    .selectText(editor0.element, 0, 1)
    .typeText(editor0.element, '10')
    .pressKey('enter')

    .expect(cell1.isInvalid)
    .notOk('cell is not marked as invalid')
    .expect(dataRow.isEdited)
    .notOk('row is not in editing mode');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
})));

test('Validation(Cell) - Unmodified data cell should be marked as invalid when a neighboring cell is modified (reevaluate=false) (T880238)', async (t) => {
  const dataGrid = new DataGrid('#container');

  const dataRow = dataGrid.getDataRow(0);
  const cell0 = dataRow.getDataCell(0);
  const editor0 = cell0.getEditor();
  const cell1 = dataRow.getDataCell(1);

  await t
    .click(cell0.element)

    .expect(cell1.isInvalid).notOk()
    .expect(editor0.element.exists)
    .ok()

    .click(editor0.element)
    .selectText(editor0.element, 0, 2)
    .typeText(editor0.element, '3')
    .pressKey('enter')

    .expect(cell1.isInvalid)
    .ok()
    .expect(cell0.isEditCell)
    .ok()

    .selectText(editor0.element, 0, 1)
    .typeText(editor0.element, '10')
    .pressKey('enter')

    .expect(cell1.isInvalid)
    .ok('the second cell is still invalid')
    .expect(cell0.isEditCell)
    .ok('the first cell is still in editing mode');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
})));

test('Validation(Cell) - Unmodified data cell should be marked as invalid when a neighboring cell is modified (reevaluate=true) (T880238)', async (t) => {
  const dataGrid = new DataGrid('#container');

  const dataRow = dataGrid.getDataRow(0);
  const cell0 = dataRow.getDataCell(0);
  const editor0 = cell0.getEditor();
  const cell1 = dataRow.getDataCell(1);

  await t
    .click(cell0.element)

    .expect(cell1.isInvalid).notOk()
    .expect(editor0.element.exists)
    .ok()

    .click(editor0.element)
    .selectText(editor0.element, 0, 2)
    .typeText(editor0.element, '3')
    .pressKey('enter')

    .expect(cell1.isInvalid)
    .ok()
    .expect(cell0.isEditCell)
    .ok()

    .selectText(editor0.element, 0, 1)
    .typeText(editor0.element, '10')
    .pressKey('enter')

    .expect(cell1.isInvalid)
    .notOk('the second cell is notmarked as invalid')
    .expect(cell0.isEditCell)
    .notOk('the first cell is not in editing mode');
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
})));

[false, true].forEach((reevaluate) => {
  test(`Validation(Batch) - Unmodified data cell should be marked as invalid when a neighboring cell is modified (reevaluate=${reevaluate}) (T880238)`, async (t) => {
    const dataGrid = new DataGrid('#container');

    const saveButton = dataGrid.getHeaderPanel().getSaveButton();
    const dataRow = dataGrid.getDataRow(0);
    const cell0 = dataRow.getDataCell(0);
    const editor0 = cell0.getEditor();
    const cell1 = dataRow.getDataCell(1);

    await t
      .click(cell0.element)

      .expect(cell1.isInvalid).notOk()
      .expect(editor0.element.exists)
      .ok()

      .click(editor0.element)
      .selectText(editor0.element, 0, 2)
      .typeText(editor0.element, '3')
      .pressKey('enter')

      .expect(cell1.isInvalid)
      .notOk()
      .expect(cell0.isModified)
      .ok()

      .click(saveButton)

      .expect(cell1.isInvalid)
      .ok()
      .expect(cell0.isModified)
      .ok()

      .click(cell0.element)

      .expect(editor0.element.exists)
      .ok()

      .selectText(editor0.element, 0, 1)
      .typeText(editor0.element, '10')
      .pressKey('enter')

      .expect(cell1.isInvalid)
      .notOk()
      .expect(cell0.isModified)
      .ok()

      .click(saveButton)

      .expect(cell1.isInvalid)
      .notOk('the second cell is not marked as invalid')
      .expect(cell0.isModified)
      .notOk('the first cell is not marked as modified')
      .expect(cell0.isEditCell)
      .notOk('the first cell is not in editing mode');
  }).before(async () => createWidget('dxDataGrid', getGridConfig({
    editing: {
      mode: 'batch',
      allowUpdating: true,
    },
    columns: ['age', {
      dataField: 'name',
      validationRules: [{
        type: 'custom',
        reevaluate,
        validationCallback(params): boolean {
          return params.data.age >= 10;
        },
      }],
    }],
  })));
});

test('Validation(Batch) - Unmodified data cell with enabled showEditorAlways should be marked as invalid when a neighboring cell is modified (T878218)', async (t) => {
  const dataGrid = new DataGrid('#container');

  const dataRow0 = dataGrid.getDataRow(0);
  const dataRow1 = dataGrid.getDataRow(1);
  const cell00 = dataRow0.getDataCell(0);
  const cell01 = dataRow0.getDataCell(1);
  const cell10 = dataRow1.getDataCell(0);
  const cell11 = dataRow1.getDataCell(1);
  const editor10 = cell10.getEditor();

  await t
    .click(cell10.element)

    .expect(cell11.isInvalid).notOk()
    .expect(editor10.element.exists)
    .ok()

    .click(editor10.element)
    .typeText(editor10.element, 'test')
    .pressKey('enter')

    .expect(cell11.isInvalid)
    .ok()
    .expect(cell10.isModified)
    .ok()

    .click(cell00.element)

    .expect(cell11.isInvalid)
    .ok()
    .expect(cell10.isModified)
    .ok()

    .click(cell01.element)

    .expect(cell11.isInvalid)
    .ok()
    .expect(cell10.isModified)
    .ok()

    .click(cell11.element)

    .expect(cell11.isInvalid)
    .ok()
    .expect(cell11.hasInvalidMessage)
    .ok()
    .expect(cell10.isModified)
    .ok()

    .click(cell10.element)

    .expect(cell11.isInvalid)
    .ok()
    .expect(cell10.isModified)
    .ok();
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
})));

test('Async Validation(Batch) - Validation frame should be rendered when a neighboring cell is modified with showEditorAlways and repaintChangesOnly enabled (T906094)', async (t) => {
  const dataGrid = new DataGrid('#container');

  const headerPanel = dataGrid.getHeaderPanel();
  const cancelButton = headerPanel.getCancelButton();
  const dataRow = dataGrid.getDataRow(0);
  const cell0 = dataRow.getDataCell(0);
  const cell1 = dataRow.getDataCell(1);
  const editor0 = cell0.getEditor();
  const editor1 = cell1.getEditor();

  await t
    .click(cell0.element)
    .expect(cell0.isFocused)
    .ok()
    .expect(editor0.element.exists)
    .ok()
    .typeText(editor0.element, 'test')
    .pressKey('enter')
    .expect(cell1.isValidationPending)
    .ok()
    .expect(cell0.isModified)
    .ok()
    .expect(cell0.isFocused)
    .ok()
    .expect(cell1.isInvalid)
    .ok()
    .click(cancelButton)
    .expect(cell0.isModified)
    .notOk()
    .expect(cell0.isFocused)
    .notOk()
    .expect(cell1.isInvalid)
    .notOk()
    .expect(cell1.isValidationPending)
    .notOk()
    .click(cell0.element)
    .expect(cell0.isFocused)
    .ok()
    .expect(editor0.element.exists)
    .ok()
    .typeText(editor0.element, 'test')
    .pressKey('enter')
    .expect(cell1.isValidationPending)
    .ok()
    .expect(cell0.isModified)
    .ok()
    .expect(cell0.isFocused)
    .ok()
    .expect(cell1.isInvalid)
    .ok()
    .expect(editor1.element.exists)
    .ok()
    .click(editor1.element)
    .expect(cell1.isValidationPending)
    .ok()
    .expect(cell1.isInvalid)
    .ok()
    .expect(cell1.hasInvalidMessage)
    .ok()
    .expect(cell1.isFocused)
    .ok()
    .expect(cell0.isFocused)
    .notOk()
    .expect(cell0.isModified)
    .ok()
    .click(cell0.element)
    .expect(editor0.element.exists)
    .ok()
    .selectText(editor0.element, 0, 4)
    .typeText(editor0.element, 't')
    .pressKey('enter')
    .expect(cell1.isValidationPending)
    .ok()
    .expect(cell1.isInvalid)
    .notOk();
}).before(async () => createWidget('dxDataGrid', getGridConfig({
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
        setTimeout(() => {
          d.resolve(params.data.name.length < 2);
        }, 1000);
        return d.promise();
      },
    }],
  }],
})));

// T905677
test('Rollback changes on a click on a revert button  when startEditAction is dblclick', async (t) => {
  const dataGrid = new DataGrid('#container');
  const dataRow = dataGrid.getDataRow(0);
  const cell0 = dataRow.getDataCell(1);
  const $revertButton = dataGrid.getRevertButton();

  await t
    .doubleClick(cell0.element)
    .expect(cell0.isEditCell)
    .ok()
    .click(cell0.getCheckbox())
    .expect($revertButton.exists)
    .ok()
    .click($revertButton)
    .expect($revertButton.exists)
    .notOk()
    .expect(cell0.isEditCell)
    .notOk()
    .expect(dataGrid.apiGetCellValue(0, 1))
    .notOk();
}).before(async () => createWidget('dxDataGrid', {
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
}));

test('Row - Redundant validation messages should not be rendered in a detail grid when focused row is enabled (T950174)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const detailGrid = new DataGrid('#detailContainer');
  const overlay = dataGrid.getOverlay();

  // act
  await t
    .click(dataGrid.getDataRow(0).getCommandCell(0).element)
    .click(detailGrid.getHeaderPanel().getAddRowButton())
    .click(detailGrid.getDataRow(0).getCommandCell(2).getButton(0))
    .click(detailGrid.getDataCell(0, 0).element);

  // assert
  await t
    .expect(overlay.getInvalidMessage().count).eql(1);

  // act
  await t
    .click(detailGrid.getDataCell(0, 1).element);

  // assert
  await t
    .expect(overlay.getInvalidMessage().count).eql(1);

  // act
  await t
    .click(detailGrid.getDataCell(0, 0).element);

  // assert
  await t
    .expect(overlay.getInvalidMessage().count).eql(1);
}).before(async () => createWidget('dxDataGrid', {
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

test('Cell - Redundant validation messages should not be rendered in a detail grid when focused row is enabled (T950174)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const detailGrid = new DataGrid('#detailContainer');
  const overlay = dataGrid.getOverlay();

  // act
  await t
    .click(dataGrid.getDataRow(0).getCommandCell(0).element)
    .click(detailGrid.getHeaderPanel().getAddRowButton())
    .click(detailGrid.getHeaderPanel().element);

  // assert
  await t
    .expect(overlay.getInvalidMessage().count).eql(1)
    .expect(overlay.getRevertTooltip().count).eql(1);

  // act
  await t
    .click(detailGrid.getDataCell(0, 1).element);

  // assert
  await t
    .expect(overlay.getInvalidMessage().count).eql(1)
    .expect(overlay.getRevertTooltip().count).eql(1);

  // act
  await t
    .click(detailGrid.getDataCell(0, 0).element);

  // assert
  await t
    .expect(overlay.getInvalidMessage().count).eql(1)
    .expect(overlay.getRevertTooltip().count).eql(1);
}).before(async () => createWidget('dxDataGrid', {
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

test('Batch - Redundant validation messages should not be rendered in a detail grid when focused row is enabled (T950174)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const detailGrid = new DataGrid('#detailContainer');
  const overlay = dataGrid.getOverlay();

  // act
  await t
    .click(dataGrid.getDataRow(0).getCommandCell(0).element)
    .click(detailGrid.getHeaderPanel().getAddRowButton())
    .click(detailGrid.getHeaderPanel().getSaveButton())
    .click(detailGrid.getDataCell(0, 0).element);

  // assert
  await t
    .expect(overlay.getInvalidMessage().count).eql(1);

  // act
  await t
    .click(detailGrid.getDataCell(0, 1).element);

  // assert
  await t
    .expect(overlay.getInvalidMessage().count).eql(1);

  // act
  await t
    .click(detailGrid.getDataCell(0, 0).element);

  // assert
  await t
    .expect(overlay.getInvalidMessage().count).eql(1);
}).before(async () => createWidget('dxDataGrid', {
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

test('Checkbox has ink ripple in material theme inside editing popup (T977287)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const overlay = new Overlay();

  // act
  await t
    .click(dataGrid.getDataRow(0).getCommandCell(1).getButton(0))
    .wait(1000)
    .click(overlay.getPopupCheckbox());

  // assert
  await t
    .expect(await takeScreenshot('grid-popup-editing-checkbox.png', overlay.content))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('material.blue.light');
  return createWidget('dxDataGrid', {
    dataSource: [{
      ID: 1,
      LastName: 'Heart',
    }],
    keyExpr: 'ID',
    editing: {
      allowUpdating: true,
      mode: 'popup',
      form: {
        items: [{
          dataField: 'checkbox',
          editorType: 'dxCheckBox',
        }],
      },
    },
    columns: ['LastName'],
  });
}).after(async () => {
  await disposeWidgets();
  await changeTheme('generic.light');
});

test('DataGrid inside editing popup should have synchronized columns (T1059401)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  // act
  await t
    .click(dataGrid.getDataRow(0).getCommandCell(1).getButton(0));

  const overlay = new Overlay();

  const popupDataGridSelector = overlay.content.find(`.${CLASS.dataGrid}`);
  const popupDataGrid = new DataGrid(popupDataGridSelector);

  await t
    .expect(popupDataGrid.getDataRow(0).element.exists)
    .ok();

  // assert
  await t
    .expect(await takeScreenshot('grid-popup-editing-grid.png', overlay.content))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('material.blue.light');
  return createWidget('dxDataGrid', {
    dataSource: [{
      ID: 1,
    }],
    keyExpr: 'ID',
    editing: {
      allowUpdating: true,
      mode: 'popup',
      form: {
        colCount: 1,
        items: [{
          template() {
            return ($('<div>') as any).dxDataGrid({
              showColumnLines: true,
              dataSource: [{
                ID: 1,
                FirstName: 'John',
                LastName: 'Heart',
              }],
              height: 200,
              editing: {
                allowUpdating: true,
                allowDeleting: true,
              },
            });
          },
        }],
      },
    },
  });
}).after(async () => {
  await disposeWidgets();
  await changeTheme('generic.light');
});

test('DataGrid adaptive text should have correct paddings (T1062084)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // act
  await t
    .click(dataGrid.getDataRow(0).getCommandCell(4).getAdaptiveButton());

  await t
    .dispatchEvent(dataGrid.getFormItemElement(0), 'focus');

  await t
    .typeText(dataGrid.getFormItemEditor(0), '1');

  await t
    .pressKey('enter');

  await t
    .dispatchEvent(dataGrid.getFormItemElement(2), 'focus');

  await t
    .typeText(dataGrid.getFormItemEditor(2), '0');

  await t
    .pressKey('enter');

  // assert
  await t
    .expect(await takeScreenshot('grid-adaptive-item-text.png', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('material.blue.light');
  return createWidget('dxDataGrid', {
    width: 400,
    dataSource: [{
      OrderNumber: 35703,
      SaleAmount: 11800,
      OrderDate: '2014/04/10',
      Employee: 'Harv Mudd',
    }],
    keyExpr: 'OrderNumber',
    columnHidingEnabled: true,
    editing: {
      allowUpdating: true,
      mode: 'batch',
    },
    columns: [{
      dataField: 'OrderNumber',
      caption: 'Invoice Number',
      width: 300,
    }, {
      dataField: 'Employee',
    }, {
      dataField: 'OrderDate',
      dataType: 'date',
    }, {
      dataField: 'SaleAmount',
      validationRules: [{ type: 'range', max: 100000 }],
      format: 'currency',
    }],
  });
}).after(async () => {
  await disposeWidgets();
  await changeTheme('generic.light');
});

test('The "Cannot read property "brokenRules" of undefined" error occurs T978286', async (t) => {
  const dataGrid = new DataGrid('#container');
  const lastName0 = dataGrid.getDataCell(0, 1);
  const active1 = dataGrid.getDataCell(1, 2);
  await t
    .click(lastName0.element)
    .typeText(lastName0.getEditor().element, '1')
    .click(active1.element)
    .click(lastName0.element);
}).before(async () => createWidget('dxDataGrid', {
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
}));

['Cell', 'Batch'].forEach((editMode) => {
  test(`${editMode} - Edit cell should be focused correclty when showEditorAlways is enabled (T976141)`, async (t) => {
    const dataGrid = new DataGrid('#container');

    // direct order
    for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
      for (let colIndex = 0; colIndex < 2; colIndex += 1) {
        const currentCell = dataGrid.getDataCell(rowIndex, colIndex);
        // act
        await t
          .click(currentCell.getEditor().element);

        // assert
        await t
          .expect(currentCell.isFocused).ok()
          .expect(currentCell.getEditor().element.focused).ok();
      }
    }

    // reverse order
    for (let rowIndex = 2; rowIndex >= 0; rowIndex -= 1) {
      for (let colIndex = 1; colIndex >= 0; colIndex -= 1) {
        const currentCell = dataGrid.getDataCell(rowIndex, colIndex);
        // act
        await t
          .click(currentCell.getEditor().element);

        // assert
        await t
          .expect(currentCell.isFocused).ok()
          .expect(currentCell.getEditor().element.focused).ok();
      }
    }
  }).before(async () => createWidget('dxDataGrid', {
    dataSource: [
      { id: 1, field: 'field' },
      { id: 2, field: 'field' },
      { id: 3, field: 'field' },
    ],
    keyExpr: 'id',
    editing: {
      mode: editMode.toLowerCase(),
      allowUpdating: true,
    },
    loadingTimeout: null,
    customizeColumns(columns) {
      columns.forEach((col) => {
        col.showEditorAlways = true;
      });
    },
  }));
});

['Batch', 'Cell'].forEach((editMode) => {
  test(`${editMode} - Cell value should not be reset when a checkbox in a neigboring cell is clicked (T1023809)`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const firstCell = dataGrid.getDataCell(0, 0);
    const secondCell = dataGrid.getDataCell(0, 1);

    // act
    await t
      .click(firstCell.element);

    // assert
    await t
      .expect(firstCell.isEditCell).ok()
      .expect(firstCell.isFocused).ok()
      .expect(firstCell.getEditor().element.focused)
      .ok();

    // act
    await t
      .typeText(firstCell.getEditor().element, '123', { replace: true })
      .click(secondCell.getEditor().element);

    // assert
    await t
      .expect(dataGrid.apiGetCellValue(0, 0)).eql('123');
  }).before(async () => createWidget('dxDataGrid', {
    dataSource: [
      { id: 1, field1: 'test', field2: true },
    ],
    keyExpr: 'id',
    columns: ['field1', 'field2'],
    editing: {
      mode: editMode.toLowerCase(),
      allowUpdating: true,
    },
  }));
});

test('Cells should be focused correctly on click when cell editing mode is used with enabled showEditorAlways (T1037019)', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await t
    .click(dataGrid.getDataCell(0, 0).getEditor().element);

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 0).isFocused)
    .ok()
    .expect(dataGrid.getDataCell(0, 0).getEditor().element.focused)
    .ok();

  // act
  await t
    .typeText(dataGrid.getDataCell(0, 0).getEditor().element, '1')
    .click(dataGrid.getDataCell(1, 0).getEditor().element);

  // assert
  await t
    .expect(dataGrid.apiGetCellValue(0, 0))
    .eql('Name 11')
    .expect(dataGrid.getDataCell(1, 0).isFocused)
    .ok()
    .expect(dataGrid.getDataCell(1, 0).getEditor().element.focused)
    .ok();

  // act
  await t
    .typeText(dataGrid.getDataCell(1, 0).getEditor().element, '2')
    .click(dataGrid.getDataCell(2, 0).getEditor().element);

  // assert
  await t
    .expect(dataGrid.apiGetCellValue(1, 0))
    .eql('Name 22')
    .expect(dataGrid.getDataCell(2, 0).isFocused)
    .ok()
    .expect(dataGrid.getDataCell(2, 0).getEditor().element.focused)
    .ok();

  // act
  await t
    .typeText(dataGrid.getDataCell(2, 0).getEditor().element, '3')
    .click(dataGrid.getDataCell(1, 0).getEditor().element);

  // assert
  await t
    .expect(dataGrid.apiGetCellValue(2, 0))
    .eql('Name 33')
    .expect(dataGrid.getDataCell(1, 0).isFocused)
    .ok()
    .expect(dataGrid.getDataCell(1, 0).getEditor().element.focused)
    .ok();

  // act
  await t
    .typeText(dataGrid.getDataCell(1, 0).getEditor().element, '2')
    .click(dataGrid.getDataCell(0, 0).getEditor().element);

  // assert
  await t
    .expect(dataGrid.apiGetCellValue(1, 0))
    .eql('Name 222')
    .expect(dataGrid.getDataCell(0, 0).isFocused)
    .ok()
    .expect(dataGrid.getDataCell(0, 0).getEditor().element.focused)
    .ok();
}).before(async () => {
  const initStore = ClientFunction(() => {
    (window as any).myStore = new (window as any).DevExpress.data.ArrayStore({
      key: 'ID',
      data: [
        { ID: 1, Name: 'Name 1' },
        { ID: 2, Name: 'Name 2' },
        { ID: 3, Name: 'Name 3' },
      ],
    });
  });

  await initStore();

  return createWidget('dxDataGrid', {
    dataSource: {
      key: 'ID',
      load(loadOptions) {
        return new Promise((resolve) => {
          setTimeout(() => {
            (window as any).myStore.load(loadOptions).done((data) => {
              resolve(data);
            });
          }, 100);
        });
      },
      update(key, values) {
        return new Promise((resolve) => {
          setTimeout(() => {
            (window as any).myStore.update(key, values).done(() => {
              resolve(key);
            });
          }, 100);
        });
      },
      totalCount(loadOptions) {
        return (window as any).myStore.totalCount(loadOptions);
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
  });
}).after(async () => {
  await disposeWidgets();
  await ClientFunction(() => {
    delete (window as any).myStore;
  })();
});

// T1130497
test('The first cell of the last row should be focused when newRowPosition = last and editing.mode = cell', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const headerPanel = dataGrid.getHeaderPanel();

  await t
    .click(headerPanel.getAddRowButton())
    .expect(dataGrid.getDataRow(3).isInserted).ok('row is inserted')
    .expect(await takeScreenshot('grid-cell-edit-mode-and-new-row-position-last.png', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{ name: 'AaAaA', value: 1 }, { name: 'aAaAa', value: 2 }, { name: 'BbBb', value: 3 }],
  editing: {
    mode: 'cell',
    allowUpdating: true,
    allowAdding: true,
    newRowPosition: 'last',
  },
}));
