import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from '../../../model/dataGrid';

fixture.disablePageReloads`No Data`
  .page(url(__dirname, '../../container.html'));

const GRID_CONTAINER = '#container';

test('The noDataText element should be centered (T1178289)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_CONTAINER);

  await dataGrid.option('dataSource', []);

  await t
    .expect(await takeScreenshot('grid-no-data-text-position.png', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columns: ['column1', 'column2', 'column3', 'column4', 'column5'],
    showBorders: true,
    columnMinWidth: 200,
    width: 600,
    stateStoring: {
      enabled: true,
      storageKey: 'testStorageKey',
    },
  });
});
