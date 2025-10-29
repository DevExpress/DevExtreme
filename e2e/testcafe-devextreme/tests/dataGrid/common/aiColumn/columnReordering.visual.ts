import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Ai Column.ColumnReordering`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test('The draggable AI column should display correctly', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.moveHeader(0, 100, 5, true);

  // assert
  await t.expect(dataGrid.getDraggableHeader().visible).ok();

  await takeScreenshot('datagrid__ai-column__dragging.png', dataGrid.element);

  // act
  await dataGrid.dropHeader(0);

  // assert
  await t
    .expect(dataGrid.getDraggableHeader().visible)
    .notOk()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  allowColumnReordering: true,
  columnWidth: 125,
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAiColumn',
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));
