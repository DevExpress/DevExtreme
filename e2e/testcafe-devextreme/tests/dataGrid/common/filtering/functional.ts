import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Filtering`
  .page(url(__dirname, '../../../container.html'));

const GRID_CONTAINER = '#container';

// T1311818
test('Don\'t calculate additional filter when filtering column list is empty', async (t) => {
  // arrange
  const dataGrid = new DataGrid(GRID_CONTAINER);
  await t.expect(dataGrid.isReady()).ok();
  const consoleMessages = await t.getBrowserConsoleMessages();

  // act
  await dataGrid.option({
    columns: [
      { dataField: 'id', caption: 'ID', dataType: 'number' },
      { dataField: 'name', caption: 'Name', dataType: 'string' },
    ],
    dataSource: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ],
  });

  // assert
  await t.expect(dataGrid.isReady()).ok();

  // act
  await dataGrid.option({
    columns: [],
    dataSource: undefined,
  });

  // assert
  await t
    .expect(consoleMessages.error.every((msg) => !msg.includes('E1047')))
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  keyExpr: 'id',
  filterValue: ['id', '>=', 1],
  dataSource: null,
  columns: [],
  showBorders: true,
}));
