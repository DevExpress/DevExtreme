import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture
  .disablePageReloads`Keyboard Navigation - Column Reordering`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test('reorder column when right arrow is pressed', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

  await t
    .click(firstHeaderCell.element)
    .pressKey('ctrl+right');

  await takeScreenshot(
    'reorder_column_to_right',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
  });
});

test('reorder column when left arrow is pressed', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const lastHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(lastHeaderCell.element)
    .pressKey('ctrl+left');

  await takeScreenshot(
    'reorder_column_to_left',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
  });
});
