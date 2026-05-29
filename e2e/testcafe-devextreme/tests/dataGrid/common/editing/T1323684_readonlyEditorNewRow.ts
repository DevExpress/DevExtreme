import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { GridsEditMode } from 'devextreme/ui/data_grid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Editing - showEditorAlways cell in new row should be editable (T1323684)`
  .page(url(__dirname, '../../../container.html'));

const READONLY_CLASS = 'dx-datagrid-readonly';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';

(['cell', 'batch'] as GridsEditMode[]).forEach((mode) => {
  test(`showEditorAlways editor should be editable in a new row when allowUpdating is false, ${mode} mode`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();

    await t.click(addRowButton);

    const newRow = dataGrid.getDataRow(0);
    await t.expect(newRow.isInserted).ok();

    const cell = dataGrid.getDataCell(0, 1);
    const editor = cell.getEditor();

    await t
      .expect(cell.element.hasClass(READONLY_CLASS))
      .notOk('showEditorAlways cell in new row should not have readonly class')
      .expect(cell.element.hasClass(CELL_FOCUS_DISABLED_CLASS))
      .notOk('showEditorAlways cell in new row should not have cell-focus-disabled class');

    await t
      .click(editor.element)
      .expect(cell.isFocused)
      .ok('showEditorAlways cell should be focused after click')
      .expect(editor.element.focused)
      .ok('editor should be focused after click')
      .typeText(editor.element, 'test value', { replace: true })
      .expect(editor.element.value)
      .eql('test value');
  }).before(async () => createWidget('dxDataGrid', {
    keyExpr: 'ID',
    dataSource: [
      { ID: 1, FirstName: 'John', LastName: 'Heart' },
      { ID: 2, FirstName: 'Olivia', LastName: 'Peyton' },
    ],
    showBorders: true,
    editing: {
      mode,
      allowUpdating: false,
      allowAdding: true,
    },
    columns: [
      'LastName',
      { dataField: 'FirstName', showEditorAlways: true },
    ],
  }));

  test(`Boolean editor should be editable in a new row when allowUpdating is false, ${mode} mode`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();

    await t.click(addRowButton);

    const newRow = dataGrid.getDataRow(0);
    await t.expect(newRow.isInserted).ok();

    const booleanCell = dataGrid.getDataCell(0, 1);

    await t
      .expect(booleanCell.element.hasClass(READONLY_CLASS))
      .notOk('boolean cell in new row should not have readonly class');

    await t
      .click(booleanCell.element)
      .click(booleanCell.getCheckbox())
      .expect(booleanCell.getEditor().isChecked())
      .ok('checkbox in new row should be checked after click in it');
  }).before(async () => createWidget('dxDataGrid', {
    keyExpr: 'ID',
    dataSource: [
      { ID: 1, Name: 'John', Active: false },
      { ID: 2, Name: 'Olivia', Active: true },
    ],
    showBorders: true,
    editing: {
      mode,
      allowUpdating: false,
      allowAdding: true,
    },
    columns: [
      'Name',
      { dataField: 'Active', dataType: 'boolean' },
    ],
  }));

  test(`showEditorAlways editor in existing rows should remain readonly when allowUpdating is false, ${mode} mode`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const existingCell = dataGrid.getDataCell(0, 1);

    await t
      .expect(existingCell.element.hasClass(READONLY_CLASS))
      .ok('showEditorAlways cell in existing row should have readonly class when allowUpdating is false');

    await t
      .click(existingCell.getEditor().element)
      .expect(existingCell.element.hasClass(READONLY_CLASS))
      .ok('showEditorAlways cell in existing row should remain readonly after click');
  }).before(async () => createWidget('dxDataGrid', {
    keyExpr: 'ID',
    dataSource: [
      { ID: 1, FirstName: 'John', LastName: 'Heart' },
      { ID: 2, FirstName: 'Olivia', LastName: 'Peyton' },
    ],
    showBorders: true,
    editing: {
      mode,
      allowUpdating: false,
      allowAdding: true,
    },
    columns: [
      'LastName',
      { dataField: 'FirstName', showEditorAlways: true },
    ],
  }));
});

test('showEditorAlways editor should be editable in a new row when allowUpdating is a function returning false, cell mode', async (t) => {
  const dataGrid = new DataGrid('#container');
  const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();

  await t.click(addRowButton);

  const newRow = dataGrid.getDataRow(0);
  await t.expect(newRow.isInserted).ok();

  const cell = dataGrid.getDataCell(0, 1);
  const editor = cell.getEditor();

  await t
    .expect(cell.element.hasClass(READONLY_CLASS))
    .notOk('showEditorAlways cell in new row should not have readonly class')
    .expect(cell.element.hasClass(CELL_FOCUS_DISABLED_CLASS))
    .notOk('showEditorAlways cell in new row should not have cell-focus-disabled class');

  await t
    .click(editor.element)
    .expect(cell.isFocused)
    .ok('showEditorAlways cell should be focused after click')
    .expect(editor.element.focused)
    .ok('editor should be focused after click')
    .typeText(editor.element, 'test value', { replace: true })
    .expect(editor.element.value)
    .eql('test value');
}).before(async () => createWidget('dxDataGrid', {
  keyExpr: 'ID',
  dataSource: [
    { ID: 1, FirstName: 'John', LastName: 'Heart' },
    { ID: 2, FirstName: 'Olivia', LastName: 'Peyton' },
  ],
  showBorders: true,
  editing: {
    mode: 'cell' as GridsEditMode,
    allowUpdating: () => false,
    allowAdding: true,
  },
  columns: [
    'LastName',
    { dataField: 'FirstName', showEditorAlways: true },
  ],
}));
