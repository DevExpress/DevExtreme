import DataGrid from '../../model/dataGrid';
import CheckBox from '../../model/checkBox';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';

fixture`Selection`
  .page(url(__dirname, '../container.html'));

test('selectAll state should be correct after unselect item if refresh(true) is called inside onSelectionChanged (T1048081)', async (t) => {
  const dataGrid = new DataGrid('#container');

  const firstRowSelectionCheckBox = new CheckBox(dataGrid.getDataCell(0, 0).getEditor().element);
  const selectAllCheckBox = new CheckBox(
    dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).getEditor().element,
  );

  // act
  await t.click(firstRowSelectionCheckBox.element);

  // assert
  await t
    .expect(await selectAllCheckBox.option('value')).eql(undefined)
    .expect(await firstRowSelectionCheckBox.option('value')).eql(false);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
  ],
  keyExpr: 'id',
  selectedRowKeys: [1, 2],
  paging: {
    pageSize: 3,
  },
  selection: {
    mode: 'multiple',
  },
  onSelectionChanged(e) {
    e.component.refresh(true);
  },
}));
