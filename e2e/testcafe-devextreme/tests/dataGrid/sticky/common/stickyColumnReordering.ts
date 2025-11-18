import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import { getData } from '../../helpers/generateDataSourceData';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Reorder columns`
  .page(url(__dirname, '../../../container.html'));

test.meta({ browserSize: [1000, 800] })('Move left fixed column to the right', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.drag(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element, 400, 0);

  await testScreenshot(t, takeScreenshot, 'move_left_fixed_column_to_right.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(5, 25),
  columnAutoWidth: true,
  allowColumnReordering: true,
  columnWidth: 100,
  customizeColumns: (columns) => {
    columns[5].fixed = true;
    columns[5].fixedPosition = 'left';
    columns[6].fixed = true;
    columns[6].fixedPosition = 'left';
    columns[7].fixed = true;
    columns[7].fixedPosition = 'left';
  },
}));

test.meta({ browserSize: [1000, 800] })('Move right fixed column to the left', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.drag(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(24).element, -400, 0);

  // TODO: issue will be fixed in the card 7Mct6tJU
  await dataGrid.scrollTo(t, { x: 0 });

  await testScreenshot(t, takeScreenshot, 'move_right_fixed_column_to_left.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(5, 25),
  columnAutoWidth: true,
  allowColumnReordering: true,
  columnWidth: 100,
  customizeColumns: (columns) => {
    columns[5].fixed = true;
    columns[5].fixedPosition = 'right';
    columns[6].fixed = true;
    columns[6].fixedPosition = 'right';
    columns[7].fixed = true;
    columns[7].fixedPosition = 'right';
  },
}));

test.meta({ browserSize: [1000, 800] })('Move fixed column with fixedPosition = \'sticky\' to the right', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t
    .drag(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(5).element, 200, 0, { speed: 0.5 })
    .wait(100);

  await testScreenshot(t, takeScreenshot, 'move_fixed_column_with_sticky_position_to_right.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(5, 25),
  columnAutoWidth: true,
  allowColumnReordering: true,
  columnWidth: 100,
  customizeColumns: (columns) => {
    columns[5].fixed = true;
    columns[5].fixedPosition = 'left';
    columns[6].fixed = true;
    columns[6].fixedPosition = 'left';

    columns[3].fixed = true;
    columns[3].fixedPosition = 'sticky';

    columns[15].fixed = true;
    columns[15].fixedPosition = 'right';
    columns[17].fixed = true;
    columns[17].fixedPosition = 'right';
  },
}));

test.meta({ browserSize: [1000, 800] })('Move left fixed band column to the right', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.drag(dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0).element, 500, 0);

  await testScreenshot(t, takeScreenshot, 'move_left_fixed_band_column_to_right.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(5, 25),
  columnAutoWidth: true,
  allowColumnReordering: true,
  columnWidth: 100,
  customizeColumns: (columns) => {
    columns.push({
      caption: 'Band column 1',
      fixed: true,
      fixedPosition: 'left',
      columns: ['field_1', 'field_2'],
    }, {
      caption: 'Band column 2',
      fixed: true,
      fixedPosition: 'left',
      columns: ['field_3', 'field_4'],
    });
  },
}));

test.meta({ browserSize: [1000, 800] })('Move right fixed band column to the left', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.drag(dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(3).element, -500, 0);

  // TODO: issue will be fixed in the card 7Mct6tJU
  await dataGrid.scrollTo(t, { x: 0 });

  await testScreenshot(t, takeScreenshot, 'move_right_fixed_band_column_to_left.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(5, 25),
  columnAutoWidth: true,
  allowColumnReordering: true,
  columnWidth: 100,
  customizeColumns: (columns) => {
    columns.push({
      caption: 'Band column 1',
      fixed: true,
      fixedPosition: 'right',
      columns: ['field_1', 'field_2'],
    }, {
      caption: 'Band column 2',
      fixed: true,
      fixedPosition: 'right',
      columns: ['field_3', 'field_4'],
    });
  },
}));

test.meta({ browserSize: [1000, 800] })('Move fixed band column with fixedPosition=\'sticky\' to the right', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.drag(dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0).element, 400, 0);

  await testScreenshot(t, takeScreenshot, 'move_fixed_band_column_with_sticky_position_to_right.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(5, 25),
  columnAutoWidth: true,
  allowColumnReordering: true,
  columnWidth: 100,
  customizeColumns: (columns) => {
    columns.splice(3, 0, {
      caption: 'Band column 1',
      fixed: true,
      fixedPosition: 'sticky',
      columns: ['field_1', 'field_2'],
    });
  },
}));

// visual: generic.light
// visual: material.blue.light
// visual: fluent.blue.light
test.meta({ browserSize: [1000, 800] })('Check the draggable source column while moving the fixed column on the right side (generic.light theme)', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await dataGrid.moveHeader(24, -200, 5, true);

  await testScreenshot(t, takeScreenshot, 'draggable_source_column_with_fixed_columns.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: getData(5, 25),
    columnAutoWidth: true,
    allowColumnReordering: true,
    columnWidth: 100,
    customizeColumns: (columns) => {
      columns[5].fixed = true;
      columns[5].fixedPosition = 'right';
      columns[6].fixed = true;
      columns[6].fixedPosition = 'right';
      columns[7].fixed = true;
      columns[7].fixedPosition = 'right';
    },
  });
});
