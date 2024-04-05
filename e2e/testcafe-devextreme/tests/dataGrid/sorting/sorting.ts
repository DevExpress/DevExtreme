import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import DataGrid from 'devextreme-testcafe-models/dataGrid';

fixture.disablePageReloads`Sorting`
  .page(url(__dirname, '../../container.html'));

test('Filter expression should be valid when sortingMethod, remoteOperations, and autoNavigateToFocusedRow are specified (T1200546)', async (t) => {
  const dataGrid = new DataGrid('#container');
  // assert
  await t
    .expect(dataGrid.dataRows.count)
    .eql(6)
    .expect(dataGrid.getErrorRow().exists)
    .eql(false);
}).before(async () => createWidget('dxDataGrid', () => {
  const sampleData = Array.from({ length: 20 }, (_, i) => ({ ID: i + 1, Name: `Name ${i + 1}` }));
  const sampleAPI = new (window as any).DevExpress.data.ArrayStore(sampleData);
  const store = new (window as any).DevExpress.data.CustomStore({
    key: 'ID',
    load(o) {
      if (o.filter && typeof o.filter[0] === 'function') {
        return Promise.reject();
      }
      return Promise.all([sampleAPI.load(o), sampleAPI.totalCount(o)]).then((res) => ({
        data: res[0],
        totalCount: res[1],
      }));
    },
  });
  return {
    dataSource: store,
    remoteOperations: true,
    columns: ['ID', {
      dataField: 'Name',
      sortOrder: 'asc',
      sortingMethod() {
        return 1;
      },
    }],
    paging: { pageSize: 5 },
    scrolling: { mode: 'virtual' },
    height: 200,
    showBorders: true,
    focusedRowEnabled: true,
    focusedRowKey: 18,
    autoNavigateToFocusedRow: true,
  };
}));
