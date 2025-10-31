import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Ai Column.ColumnReordering.Visual`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test('The draggable AI column should display correctly', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.moveHeader(0, 100, 5, true);

  // assert
  // @ts-expect-error ts-error
  await t.expect(dataGrid.getDraggableHeader().visible).ok();

  await testScreenshot(t, takeScreenshot, 'datagrid__ai-column__dragging.png', { element: dataGrid.element });

  // act
  // @ts-expect-error ts-error
  await dataGrid.dropHeader(0);

  // assert
  await t
    // @ts-expect-error ts-error
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
  columnWidth: 200,
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
