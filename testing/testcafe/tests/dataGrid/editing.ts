import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/testHelper';
import DataGrid from '../../model/dataGrid';
import SelectBox from '../../model/selectBox';

fixture`Editing`
  .page(url(__dirname, '../container.html'));

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

// T905677
test('Rollback changes on a click on a revert button  when startEditAction is dblclick', async (t) => {
  const dataGrid = new DataGrid('#container');
  const dataRow = dataGrid.getDataRow(0);
  const cell0 = dataRow.getDataCell(1);
  const $revertButton = cell0.getRevertButton();

  await t
    .doubleClick(cell0.element)
    .expect(cell0.isEditCell).ok()
    .click(cell0.element.find('.dx-checkbox'))
    .expect($revertButton.exists).ok()
    .click($revertButton)
    .expect($revertButton.exists).notOk()
    .expect(cell0.isEditCell).notOk()
    .expect(dataGrid.apiGetCellValue(0, 1))
    .notOk();
}).before(() => createWidget('dxDataGrid', {
  dataSource: [{ name: 'test', test: false }],
  editing: {
    mode: 'cell',
    allowUpdating: true,
    startEditAction: 'dblClick'
  },
  columns: ['name',
    {
      dataField: 'test',
      dataType: 'boolean',
      showEditorAlways: false
    }
  ]
}));
