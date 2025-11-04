import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Ai Column.ColumnResizing.Visual`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test('Resize AI Column when wordWrapEnabled is true', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  await testScreenshot(t, takeScreenshot, 'datagrid__ai-column__column-resizing(wordWrapEnabled=true)-1.png', { element: dataGrid.element });

  // act
  await dataGrid.resizeHeader(1, -150);

  await testScreenshot(t, takeScreenshot, 'datagrid__ai-column__column-resizing(wordWrapEnabled=true)-2.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  allowColumnResizing: true,
  wordWrapEnabled: true,
  columnWidth: 100,
  columns: [
    {
      type: 'ai',
      caption: 'AI Column AI Column',
      width: 250,
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));
