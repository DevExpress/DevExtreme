import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import DataGrid from '../../../model/dataGrid';

fixture`Accessibility bugs`
  .page(url(__dirname, '../../container.html'));

test('T1187314 - DataGrid displays an incorrect row count in "aria-label" if there is no data after filtering', async (t) => {
  const dataGrid = new DataGrid('#container');

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
  filterValue: ['id', '=', '1'],
  scrolling: { mode: 'infinite' },
}));
