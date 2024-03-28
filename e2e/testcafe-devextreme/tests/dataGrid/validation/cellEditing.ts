import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from 'devextreme-testcafe-models/dataGrid';

fixture.disablePageReloads`Validation`
  .page(url(__dirname, '../../container.html'));

test('Navigation with tab without saving should not throw an error', async (t) => {
  const grid = new DataGrid('#container');

  await t.click(grid.getDataCell(0, 0).element);

  const editor = grid.getDataCell(0, 0).getEditor();

  await t.typeText(editor.element, '123');
  await t.pressKey('tab');

  await t.expect(true).ok('no errors');
}).before(() => createWidget('dxDataGrid', {
  dataSource: [{
    id: 1,
    col2: 30,
    col3: 240,
  },
  {
    id: 2,
    col2: 15,
    col3: 120,
  }],
  keyExpr: 'id',
  repaintChangesOnly: true,
  columnAutoWidth: true,
  showBorders: true,
  paging: {
    enabled: false,
  },
  editing: {
    mode: 'cell',
    allowUpdating: true,
    allowAdding: true,
  },
  columns: [{
    dataField: 'col2',
    validationRules: [{ type: 'required' }],
  }, {
    dataField: 'col3',
    validationRules: [{ type: 'required' }],
  }],
}));
