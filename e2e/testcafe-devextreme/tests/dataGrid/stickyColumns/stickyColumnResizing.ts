import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import { getData } from '../helpers/generateDataSourceData';
import url from '../../../helpers/getPageUrl';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Resize columns - nextColumn mode`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((rtlEnabled) => {
  safeSizeTest(`Resize first fixed column width with left position (rtlEnabled = ${rtlEnabled})`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const columnIndex = rtlEnabled ? 23 : 1;
    const scrollLeft = rtlEnabled ? -10000 : 10000;

    await t.expect(dataGrid.isReady()).ok();

    // act
    await dataGrid.resizeHeader(columnIndex, 100);

    await takeScreenshot(`resize_first_fixed_column_with_left_position_1_(nextColumn_mode_and_rtl_=_${rtlEnabled}).png`, dataGrid.element);

    // act
    await dataGrid.scrollTo(t, { x: scrollLeft });

    await takeScreenshot(`resize_first_fixed_column_with_left_position_2_(nextColumn_mode_and_rtl_=_${rtlEnabled}).png`, dataGrid.element);

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

  safeSizeTest(`Resize second fixed column width with right position (rtlEnabled = ${rtlEnabled})`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const columnIndex = rtlEnabled ? 0 : 24;
    const scrollLeft = rtlEnabled ? -10000 : 10000;

    await t.expect(dataGrid.isReady()).ok();

    // act
    await dataGrid.resizeHeader(columnIndex, -100);

    await takeScreenshot(`resize_second_fixed_column_with_right_position_1_(nextColumn_mode_and_rtl_=_${rtlEnabled}).png`, dataGrid.element);

    // act
    await dataGrid.scrollTo(t, { x: scrollLeft });

    await takeScreenshot(`resize_second_fixed_column_with_right_position_2_(nextColumn_mode_and_rtl_=_${rtlEnabled}).png`, dataGrid.element);

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

fixture.disablePageReloads`Resize columns - widget mode`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((rtlEnabled) => {
  safeSizeTest(`Resize first fixed column width with left position (rtlEnabled = ${rtlEnabled})`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const columnIndex = rtlEnabled ? 23 : 1;
    const scrollLeft = rtlEnabled ? -10000 : 10000;

    await t.expect(dataGrid.isReady()).ok();

    // act
    await dataGrid.resizeHeader(columnIndex, 100);

    await takeScreenshot(`resize_first_fixed_column_with_left_position_1_(widget_mode_and_rtl_=_${rtlEnabled}).png`, dataGrid.element);

    // act
    await dataGrid.scrollTo(t, { x: scrollLeft });

    await takeScreenshot(`resize_first_fixed_column_with_left_position_2_(widget_mode_and_rtl_=_${rtlEnabled}).png`, dataGrid.element);

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
    columnResizingMode: 'widget',
    customizeColumns: (columns) => {
      columns[5].fixed = true;
      columns[5].fixedPosition = 'left';
      columns[6].fixed = true;
      columns[6].fixedPosition = 'left';
    },
  }));

  safeSizeTest(`Resize second fixed column width with right position (rtlEnabled = ${rtlEnabled})`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const columnIndex = rtlEnabled ? 0 : 24;
    const scrollLeft = rtlEnabled ? -10000 : 10000;

    await t.expect(dataGrid.isReady()).ok();

    // act
    await dataGrid.resizeHeader(columnIndex, -100);

    await takeScreenshot(`resize_second_fixed_column_with_right_position_1_(widget_mode_and_rtl_=_${rtlEnabled}).png`, dataGrid.element);

    // act
    await dataGrid.scrollTo(t, { x: scrollLeft });

    await takeScreenshot(`resize_second_fixed_column_with_right_position_2_(widget_mode_and_rtl_=_${rtlEnabled}).png`, dataGrid.element);

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
    columnResizingMode: 'widget',
    customizeColumns: (columns) => {
      columns[5].fixed = true;
      columns[5].fixedPosition = 'right';
      columns[6].fixed = true;
      columns[6].fixedPosition = 'right';
    },
  }));

  safeSizeTest(`Resize first fixed column width with right position (rtlEnabled = ${rtlEnabled})`, async (t) => {
    // arrange
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const columnIndex = rtlEnabled ? 1 : 23;
    const scrollLeft = rtlEnabled ? -10000 : 10000;

    await t.expect(dataGrid.isReady()).ok();

    // act
    await dataGrid.resizeHeader(columnIndex, -100);

    await takeScreenshot(`resize_first_fixed_column_with_right_position_1_(widget_mode_and_rtl_=_${rtlEnabled}).png`, dataGrid.element);

    // act
    await dataGrid.scrollTo(t, { x: scrollLeft });

    await takeScreenshot(`resize_first_fixed_column_with_right_position_2_(widget_mode_and_rtl_=_${rtlEnabled}).png`, dataGrid.element);

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
    columnResizingMode: 'widget',
    customizeColumns: (columns) => {
      columns[5].fixed = true;
      columns[5].fixedPosition = 'right';
      columns[6].fixed = true;
      columns[6].fixedPosition = 'right';
    },
  }));
});
