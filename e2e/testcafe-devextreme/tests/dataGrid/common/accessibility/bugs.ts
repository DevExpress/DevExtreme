import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { getData } from '../../helpers/generateDataSourceData';

fixture.disablePageReloads`Accessibility bugs`
  .page(url(__dirname, '../../../container.html'));

test('T1187314 - DataGrid displays an incorrect row count in "aria-label" if there is no data after filtering', async (t) => {
  const dataGrid = new DataGrid('#container');

  await dataGrid.apiFilter(['id', '=', '1']);
  await t
    .expect(dataGrid.getContainer().getAttribute('aria-label'))
    .eql('Data grid with 0 rows and 2 columns');
}).before(async () => createWidget('dxDataGrid', {
  keyExpr: 'id',
  dataSource: [{
    id: 0,
    data: 'A',
  }],
  filterRow: { visible: true },
  scrolling: { mode: 'infinite' },
}));

test('DataGrid - The \'aria-label\' attribute value is "Show filter options for column \'undefined\' for the header filter icon in grouped fields (T1205784)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .expect(dataGrid.getGroupPanel().getHeader(0).getFilterButton().getAttribute('aria-label'))
    .eql('Show filter options for column \'Id\'');
}).before(async () => createWidget('dxDataGrid', {
  keyExpr: 'id',
  dataSource: [{
    id: 0,
    data: 'A',
  }],
  groupPanel: {
    visible: true,
  },
  headerFilter: {
    visible: true,
  },
  columns: [
    'data',
    {
      dataField: 'id',
      groupIndex: 0,
    },
  ],
}));

test('DataGrid - NVDA reads column information twice (T1286287)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const dataCell = dataGrid.getDataCell(1, 1).element;

  await dataGrid.isReady();
  await t
    .expect(dataCell.hasAttribute('aria-describedby'))
    .notOk();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(5, 5),
  keyExpr: 'field_0',
}));

test('T1296376 - DataGrid - TextArea doesn\'t have the aria-invalid attribute when it is the editor', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const dataCell = dataGrid.getDataCell(0, 0);

  // act
  await t
    .click(dataCell.element)
    .pressKey('ctrl+a backspace ctrl+enter');

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(dataCell.getEditor().element.getAttribute('aria-invalid'))
    .eql('true');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, text: 'value' },
  ],
  keyExpr: 'id',
  columns: [{
    dataField: 'text',
    validationRules: [{ type: 'required' }],
  }],
  editing: {
    mode: 'cell',
    allowUpdating: true,
  },
  onEditorPreparing(e) {
    e.editorName = 'dxTextArea';
  },
}));
