import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Filtering`
  .page(url(__dirname, '../../../container.html'));

const GRID_CONTAINER = '#container';

test('Data should be filtered if True is selected via the filter method when case sensitivity is enabled', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_CONTAINER);
  await t.expect(dataGrid.isReady()).ok();

  // act
  await dataGrid.apiFilter(['text', '=', 'true']);

  // assert
  await t.expect(dataGrid.isReady()).ok();

  await testScreenshot(t, takeScreenshot, 'filter-method-with-case-sensitive-1.png', { element: dataGrid.element });

  // act
  await dataGrid.apiFilter(['text', '=', 'True']);

  // assert
  await t.expect(dataGrid.isReady()).ok();

  await testScreenshot(t, takeScreenshot, 'filter-method-with-case-sensitive-2.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: {
    store: [
      { ID: 1, text: 'true' },
      { ID: 2, text: 'True' },
    ],
    langParams: {
      locale: 'en-US',
      collatorOptions: {
        sensitivity: 'case',
      },
    },
  },
  keyExpr: 'ID',
  showBorders: true,
}));

test('Data should be filtered if True is selected via the option method when case sensitivity is enabled', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_CONTAINER);

  // assert
  await t.expect(dataGrid.isReady()).ok();

  await testScreenshot(t, takeScreenshot, 'filtering-via-option-method-with-case-sensitive-1.png', { element: dataGrid.element });

  // act
  await dataGrid.option('columns', ['ID', { dataField: 'text', filterValue: 'True' }]);

  // assert
  await t.expect(dataGrid.isReady()).ok();

  await testScreenshot(t, takeScreenshot, 'filtering-via-option-method-with-case-sensitive-2.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: {
    store: [
      { ID: 1, text: 'true' },
      { ID: 2, text: 'True' },
    ],
    langParams: {
      locale: 'en-US',
      collatorOptions: {
        sensitivity: 'case',
      },
    },
  },
  keyExpr: 'ID',
  showBorders: true,
  columns: ['ID', {
    dataField: 'text',
    filterValue: 'true',
  }],
}));
