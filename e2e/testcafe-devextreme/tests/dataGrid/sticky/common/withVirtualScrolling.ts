import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { getData } from '../../helpers/generateDataSourceData';
import { testScreenshot } from '../../../../helpers/themeUtils';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Sticky columns - Virtual Scrolling`
  .page(url(__dirname, '../../../container.html'));

test.meta({ browserSize: [1000, 800] })('Fixed columns should display correctly when scrolling vertically quickly', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await dataGrid.scrollTo(t, { y: 500 });
  await t.wait(100);
  await dataGrid.scrollTo(t, { y: 1000 });
  await t.wait(100);
  await dataGrid.scrollTo(t, { y: 1500 });
  await t.wait(100);

  await testScreenshot(t, takeScreenshot, 'fixed_columns_with_virtual_scrolling_1.png', { element: dataGrid.element });

  // waiting for size update
  await t.wait(3000);

  await testScreenshot(t, takeScreenshot, 'fixed_columns_with_virtual_scrolling_2.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(400, 15),
  height: 700,
  columnWidth: 100,
  showColumnLines: true,
  scrolling: {
    mode: 'virtual',
    // @ts-expect-error private option
    updateTimeout: 3000,
  },
  customizeColumns(columns) {
    columns[0].fixed = true;

    columns[1].fixed = true;
    columns[1].fixedPosition = 'right';
    columns[2].fixed = true;
    columns[2].fixedPosition = 'right';
  },
}));

test.meta({ browserSize: [800, 800] })('Fixed columns should display correctly when horizontal scrolling', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await dataGrid.scrollTo(t, { x: 10000 });

  await testScreenshot(t, takeScreenshot, 'fixed_columns_with_horizontal_scrolling.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(400, 15),
  height: 700,
  columnWidth: 100,
  showColumnLines: true,
  scrolling: {
    mode: 'virtual',
  },
  customizeColumns(columns) {
    columns[0].fixed = true;
    columns[1].fixed = true;
    columns[2].fixed = true;

    columns[13].fixed = true;
    columns[13].fixedPosition = 'sticky';
  },
}));
