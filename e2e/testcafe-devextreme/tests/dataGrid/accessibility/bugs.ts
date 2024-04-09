import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import DataGrid from 'devextreme-testcafe-models/dataGrid';

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
