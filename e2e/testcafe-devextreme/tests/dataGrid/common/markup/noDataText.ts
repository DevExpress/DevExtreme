import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`No Data`
  .page(url(__dirname, '../../../container.html'));

const GRID_CONTAINER = '#container';

test('The noDataText element should be centered (T1178289)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_CONTAINER);

  await dataGrid.option('dataSource', []);

  await testScreenshot(t, takeScreenshot, 'grid-no-data-text-position.png', { element: dataGrid.element });
  await t
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
