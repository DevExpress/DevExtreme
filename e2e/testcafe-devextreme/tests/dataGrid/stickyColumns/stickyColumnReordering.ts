import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import { getData } from '../helpers/generateDataSourceData';
import url from '../../../helpers/getPageUrl';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Reorder columns`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('Move left fixed column to the right', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // act
  await t.drag(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element, 400, 0);

  await takeScreenshot('move_left_fixed_column_to_right.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 800]).before(async () => createWidget('dxDataGrid', {
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

safeSizeTest('Move right fixed column to the left', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // act
  await t.drag(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(24).element, -400, 0);

  await takeScreenshot('move_right_fixed_column_to_left.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 800]).before(async () => createWidget('dxDataGrid', {
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

safeSizeTest('Move fixed column with fixedPosition = \'sticky\' to the right', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // act
  await t.drag(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(5).element, 200, 0);

  await takeScreenshot('move_fixed_column_with_sticky_position_to_right.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 800]).before(async () => createWidget('dxDataGrid', {
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

safeSizeTest('Move left fixed band column to the right', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // act
  await t.drag(dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0).element, 500, 0);

  await takeScreenshot('move_left_fixed_band_column_to_right.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 800]).before(async () => createWidget('dxDataGrid', {
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

safeSizeTest('Move right fixed band column to the left', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // act
  await t.drag(dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(3).element, -500, 0);

  await takeScreenshot('move_right_fixed_band_column_to_left.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 800]).before(async () => createWidget('dxDataGrid', {
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

safeSizeTest('Move fixed band column with fixedPosition=\'sticky\' to the right', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // act
  await t.drag(dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0).element, 400, 0);

  await takeScreenshot('move_fixed_band_column_with_sticky_position_to_right.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 800]).before(async () => createWidget('dxDataGrid', {
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
