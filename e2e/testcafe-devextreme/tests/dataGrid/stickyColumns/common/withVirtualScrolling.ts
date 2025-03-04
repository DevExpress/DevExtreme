import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { getData } from '../helpers/generateDataSourceData';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Sticky columns - Virtual Scrolling`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('Fixed columns should display correctly when scrolling vertically quickly', async (t) => {
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

  await takeScreenshot('fixed_columns_with_virtual_scrolling_1.png', dataGrid.element);

  // waiting for size update
  await t.wait(3000);

  await takeScreenshot('fixed_columns_with_virtual_scrolling_2.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
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

safeSizeTest('Fixed columns should display correctly when horizontal scrolling', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await dataGrid.scrollTo(t, { x: 10000 });

  await takeScreenshot('fixed_columns_with_horizontal_scrolling.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
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
