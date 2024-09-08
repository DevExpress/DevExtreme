import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import { getData } from '../helpers/generateDataSourceData';
import url from '../../../helpers/getPageUrl';

const DATA_GRID_SELECTOR = '#container';

fixture`Resize columns - nextColumn mode`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((rtlEnabled) => {
  safeSizeTest(`Increase first fixed column width with left position (rtlEnabled = ${rtlEnabled})`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const columnIndex = rtlEnabled ? 24 : 0;

    // act
    await dataGrid.resizeHeader(columnIndex, 100);

    await takeScreenshot(`increase_first_fixed_column_with_left_position_1_(rtl_=_${rtlEnabled}).png`, dataGrid.element);

    // act
    await dataGrid.scrollTo(t, { x: 10000 });

    await takeScreenshot(`increase_first_fixed_column_with_left_position_2_(rtl_=_${rtlEnabled}).png`, dataGrid.element);

    // assert
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [900, 800]).before(async () => createWidget('dxDataGrid', {
    dataSource: getData(5, 25),
    rtlEnabled,
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnWidth: 200,
    columnResizingMode: 'nextColumn',
    customizeColumns: (columns) => {
      columns[5].fixed = true;
      columns[5].fixedPosition = 'left';
      columns[6].fixed = true;
      columns[6].fixedPosition = 'left';
    },
  }));

  safeSizeTest(`Decrease first fixed column width with left position (rtlEnabled = ${rtlEnabled})`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const columnIndex = rtlEnabled ? 24 : 0;

    // act
    await dataGrid.resizeHeader(columnIndex, -100);

    await takeScreenshot(`decrease_first_fixed_column_with_left_position_1_(rtl_=_${rtlEnabled}).png`, dataGrid.element);

    // act
    await dataGrid.scrollTo(t, { x: 10000 });

    await takeScreenshot(`decrease_first_fixed_column_with_left_position_2_(rtl_=_${rtlEnabled}).png`, dataGrid.element);

    // assert
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [900, 800]).before(async () => createWidget('dxDataGrid', {
    dataSource: getData(5, 25),
    rtlEnabled,
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnWidth: 200,
    columnResizingMode: 'nextColumn',
    customizeColumns: (columns) => {
      columns[5].fixed = true;
      columns[5].fixedPosition = 'left';
      columns[6].fixed = true;
      columns[6].fixedPosition = 'left';
    },
  }));

  safeSizeTest(`Increase first fixed column width with right position (rtlEnabled = ${rtlEnabled})`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const columnIndex = rtlEnabled ? 1 : 23;

    // act
    await dataGrid.resizeHeader(columnIndex, 100);

    await takeScreenshot(`increase_first_fixed_column_with_right_position_1_(rtl_=_${rtlEnabled}).png`, dataGrid.element);

    // act
    await dataGrid.scrollTo(t, { x: 10000 });

    await takeScreenshot(`increase_first_fixed_column_with_right_position_2_(rtl_=_${rtlEnabled}).png`, dataGrid.element);

    // assert
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [900, 800]).before(async () => createWidget('dxDataGrid', {
    dataSource: getData(5, 25),
    rtlEnabled,
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnWidth: 200,
    columnResizingMode: 'nextColumn',
    customizeColumns: (columns) => {
      columns[5].fixed = true;
      columns[5].fixedPosition = 'right';
      columns[6].fixed = true;
      columns[6].fixedPosition = 'right';
    },
  }));

  safeSizeTest(`Decrease first fixed column width with right position (rtlEnabled = ${rtlEnabled})`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const columnIndex = rtlEnabled ? 1 : 23;

    // act
    await dataGrid.resizeHeader(columnIndex, -100);

    await takeScreenshot(`decrease_first_fixed_column_with_right_position_1_(rtl_=_${rtlEnabled}).png`, dataGrid.element);

    // act
    await dataGrid.scrollTo(t, { x: 10000 });

    await takeScreenshot(`decrease_first_fixed_column_with_right_position_2_(rtl_=_${rtlEnabled}).png`, dataGrid.element);

    // assert
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [900, 800]).before(async () => createWidget('dxDataGrid', {
    dataSource: getData(5, 25),
    rtlEnabled,
    columnAutoWidth: true,
    allowColumnResizing: true,
    columnWidth: 200,
    columnResizingMode: 'nextColumn',
    customizeColumns: (columns) => {
      columns[5].fixed = true;
      columns[5].fixedPosition = 'right';
      columns[6].fixed = true;
      columns[6].fixedPosition = 'right';
    },
  }));
});
