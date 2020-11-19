import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';
import SelectBox from '../../model/selectBox';

fixture.disablePageReloads`Editing`
  .page(url(__dirname, '../container.html'))
  .afterEach(() => disposeWidgets());

const getGridConfig = (config) => {
  const defaultConfig = {
    errorRowEnabled: true,
    dataSource: {
      asyncLoadEnabled: false,
      store: [{ name: 'Alex', age: 15, lastName: 'John' }],
      paginate: true,
    },
    legacyRendering: false,
  };

  return config ? ({ ...defaultConfig, ...config }) : defaultConfig;
};

const getElementCount = (gridInstance: DataGrid, elementSelector: string): Promise<number> => {
  const { getGridInstance } = gridInstance;
  return ClientFunction(
    () => (getGridInstance() as any).element().find(elementSelector).length,
    { dependencies: { getGridInstance, elementSelector } },
  )();
};

test('Tab key on editor should focus next cell if editing mode is cell', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getDataCell(0, 1).element)
    .pressKey('1 tab')
    .expect(dataGrid.getDataCell(1, 1).isFocused).ok();
}).before(() => createWidget('dxDataGrid', {
  dataSource: [{ name: 'AaAaA', value: 1 }, { name: 'aAaAa', value: 2 }],
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
  columns: [{ dataField: 'name', allowEditing: false }, { dataField: 'value', showEditorAlways: true }],
}));

test('Click should work if a column button set using svg icon (T863635)', async (t) => {
  await t
    .click('#svg-icon')
    .expect(ClientFunction(() => (window as any).onSvgClickCounter)()).eql(1);
}).before(() => createWidget('dxDataGrid', {
  dataSource: [{ value: 1 }],
  columns: [{
    type: 'buttons',
    width: 110,
    buttons: [
      {
        hint: 'svg icon',
        icon: '<svg id="svg-icon"><circle cx="15" cy="15" r="14" /> </svg>',
        onClick: () => {
          const global = window as any;
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
}).before(() => Promise.all([
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'row',
    allowAdding: true,
  },
  columns: [{
    dataField: 'age',
    validationRules: [{
      type: 'async',
      validationCallback(params) {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'row',
    allowUpdating: true,
  },
  columns: [{
    dataField: 'age',
    validationRules: [{
      type: 'async',
      validationCallback(params) {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'row',
    allowUpdating: true,
  },
  columns: [{
    dataField: 'age',
    validationRules: [{
      type: 'async',
      validationCallback(params) {
        const d = $.Deferred();
        setTimeout(() => {
          if (params.value === 1) d.resolve(true);
          else d.reject();
        }, 1000);
        return d.promise();
      },
    }],
    setCellValue(rowData, value) {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'cell',
    allowUpdating: true,
    allowAdding: true,
  },
  columns: [{
    dataField: 'age',
    validationRules: [{
      type: 'async',
      validationCallback() {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'cell',
    allowAdding: true,
  },
  columns: [{
    dataField: 'age',
    validationRules: [{
      type: 'async',
      validationCallback(params) {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
  columns: [{
    dataField: 'age',
    validationRules: [{
      type: 'async',
      validationCallback(params) {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
  columns: [{
    dataField: 'age',
    validationRules: [{
      type: 'async',
      validationCallback(params) {
        const d = $.Deferred();
        setTimeout(() => {
          if (params.value === 1) d.resolve(true);
          else d.reject();
        }, 1000);
        return d.promise();
      },
    }],
    setCellValue(rowData, value) {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'cell',
    allowUpdating: true,
    allowAdding: true,
  },
  columns: [{
    dataField: 'age',
    setCellValue: (rowData, value) => {
      rowData.age = value;
      rowData.name = 'testb';
    },
  }, {
    dataField: 'name',
    validationRules: [{
      type: 'async',
      validationCallback() {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'cell',
    allowUpdating: true,
    allowAdding: true,
  },
  columns: [{
    dataField: 'age',
    setCellValue: (rowData, value) => {
      rowData.age = value;
      rowData.name = 'testb';
    },
  }, {
    dataField: 'name',
    validationRules: [{
      type: 'async',
      validationCallback() {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'cell',
    allowUpdating: true,
    allowAdding: true,
  },
  columns: [{
    dataField: 'age',
  }, {
    dataField: 'name',
    calculateCellValue: (rowData) => (rowData.age ? `${rowData.age}b` : undefined),
    validationRules: [{
      type: 'async',
      validationCallback() {
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

  await dataGrid.apiEditCell(0, 0);

  await t
    .typeText(dataGrid.getDataCell(0, 0).getEditor().element, '123')
    .pressKey('enter')
    .expect(dataGrid.getDataCell(0, 1).isInvalid)
    .ok()
    .expect(dataGrid.getDataCell(0, 1).element.textContent)
    .eql('15123b');
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'cell',
    allowUpdating: true,
    allowAdding: true,
  },
  columns: [{
    dataField: 'age',
  }, {
    dataField: 'name',
    calculateCellValue: (rowData) => (rowData.age ? `${rowData.age}b` : undefined),
    validationRules: [{
      type: 'async',
      validationCallback() {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'batch',
    allowAdding: true,
  },
  columns: [{
    dataField: 'age',
    validationRules: [{
      type: 'async',
      validationCallback(params) {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'batch',
    allowUpdating: true,
  },
  columns: [{
    dataField: 'age',
    validationRules: [{
      type: 'async',
      validationCallback(params) {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'batch',
    allowUpdating: true,
  },
  columns: [{
    dataField: 'age',
    validationRules: [{
      type: 'async',
      validationCallback(params) {
        const d = $.Deferred();
        setTimeout(() => {
          if (params.value === 1) d.resolve(true);
          else d.reject();
        }, 1000);
        return d.promise();
      },
    }],
    setCellValue(rowData, value) {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'batch',
    allowAdding: true,
  },
  columns: [{
    dataField: 'age',
    validationRules: [{
      type: 'async',
      validationCallback(params) {
        const d = $.Deferred();
        setTimeout(() => {
          if (params.value === 1) d.resolve(true);
          else d.reject();
        }, 1000);
        return d.promise();
      },
    }],
    setCellValue(rowData, value) {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'row',
    allowUpdating: true,
  },
  columns: ['age', {
    dataField: 'name',
    validationRules: [{
      type: 'custom',
      validationCallback(params) {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'row',
    allowUpdating: true,
  },
  columns: ['age', {
    dataField: 'name',
    validationRules: [{
      type: 'custom',
      reevaluate: true,
      validationCallback(params) {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
  columns: ['age', {
    dataField: 'name',
    validationRules: [{
      type: 'custom',
      validationCallback(params) {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
  columns: ['age', {
    dataField: 'name',
    validationRules: [{
      type: 'custom',
      reevaluate: true,
      validationCallback(params) {
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
  }).before(() => createWidget('dxDataGrid', getGridConfig({
    editing: {
      mode: 'batch',
      allowUpdating: true,
    },
    columns: ['age', {
      dataField: 'name',
      validationRules: [{
        type: 'custom',
        reevaluate,
        validationCallback(params) {
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
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
      validationCallback: (params) => params.data.name.length <= 0,
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
}).before(() => createWidget('dxDataGrid', getGridConfig({
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
      validationCallback(params) {
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
  const $revertButton = cell0.getRevertButton();

  await t
    .doubleClick(cell0.element)
    .expect(cell0.isEditCell)
    .ok()
    .click(cell0.element.find('.dx-checkbox'))
    .expect($revertButton.exists)
    .ok()
    .click($revertButton)
    .expect($revertButton.exists)
    .notOk()
    .expect(cell0.isEditCell)
    .notOk()
    .expect(dataGrid.apiGetCellValue(0, 1))
    .notOk();
}).before(() => createWidget('dxDataGrid', {
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

  // act
  await t
    .click(dataGrid.getDataRow(0).getCommandCell(0).element)
    .click(detailGrid.getHeaderPanel().getAddRowButton())
    .click(detailGrid.getDataRow(0).getCommandCell(2).getButton(0))
    .click(detailGrid.getDataCell(0, 0).element);

  // assert
  await t
    .expect(await getElementCount(dataGrid, '.dx-overlay-wrapper.dx-invalid-message')).eql(1);

  // act
  await t
    .click(detailGrid.getDataCell(0, 1).element);

  // assert
  await t
    .expect(await getElementCount(dataGrid, '.dx-overlay-wrapper.dx-invalid-message')).eql(1);

  // act
  await t
    .click(detailGrid.getDataCell(0, 0).element);

  // assert
  await t
    .expect(await getElementCount(dataGrid, '.dx-overlay-wrapper.dx-invalid-message')).eql(1);
}).before(() => createWidget('dxDataGrid', {
  dataSource: [{ id: 1, field: 'field' }],
  keyExpr: 'id',
  loadingTimeout: undefined,
  masterDetail: {
    enabled: true,
    template() {
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

  // act
  await t
    .click(dataGrid.getDataRow(0).getCommandCell(0).element)
    .click(detailGrid.getHeaderPanel().getAddRowButton())
    .click(detailGrid.getHeaderPanel().element);

  // assert
  await t
    .expect(await getElementCount(dataGrid, '.dx-overlay-wrapper.dx-invalid-message')).eql(1)
    .expect(await getElementCount(dataGrid, '.dx-overlay-wrapper.dx-datagrid-revert-tooltip')).eql(1);

  // act
  await t
    .click(detailGrid.getDataCell(0, 1).element);

  // assert
  await t
    .expect(await getElementCount(dataGrid, '.dx-overlay-wrapper.dx-invalid-message')).eql(1)
    .expect(await getElementCount(dataGrid, '.dx-overlay-wrapper.dx-datagrid-revert-tooltip')).eql(1);

  // act
  await t
    .click(detailGrid.getDataCell(0, 0).element);

  // assert
  await t
    .expect(await getElementCount(dataGrid, '.dx-overlay-wrapper.dx-invalid-message')).eql(1)
    .expect(await getElementCount(dataGrid, '.dx-overlay-wrapper.dx-datagrid-revert-tooltip')).eql(1);
}).before(() => createWidget('dxDataGrid', {
  dataSource: [{ id: 1, field: 'field' }],
  keyExpr: 'id',
  loadingTimeout: undefined,
  masterDetail: {
    enabled: true,
    template() {
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

  // act
  await t
    .click(dataGrid.getDataRow(0).getCommandCell(0).element)
    .click(detailGrid.getHeaderPanel().getAddRowButton())
    .click(detailGrid.getHeaderPanel().getSaveButton())
    .click(detailGrid.getDataCell(0, 0).element);

  // assert
  await t
    .expect(await getElementCount(dataGrid, '.dx-overlay-wrapper.dx-invalid-message')).eql(1);

  // act
  await t
    .click(detailGrid.getDataCell(0, 1).element);

  // assert
  await t
    .expect(await getElementCount(dataGrid, '.dx-overlay-wrapper.dx-invalid-message')).eql(1);

  // act
  await t
    .click(detailGrid.getDataCell(0, 0).element);

  // assert
  await t
    .expect(await getElementCount(dataGrid, '.dx-overlay-wrapper.dx-invalid-message')).eql(1);
}).before(() => createWidget('dxDataGrid', {
  dataSource: [{ id: 1, field: 'field' }],
  keyExpr: 'id',
  loadingTimeout: undefined,
  masterDetail: {
    enabled: true,
    template() {
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
