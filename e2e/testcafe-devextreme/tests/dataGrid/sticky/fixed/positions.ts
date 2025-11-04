import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../../helpers/createWidget';
import { getData } from '../../helpers/generateDataSourceData';
import url from '../../../../helpers/getPageUrl';
import { borderConfigs } from '../helpers/testMatrixConfig';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`FixedColumns`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

borderConfigs.forEach(({ showColumnLines, showBorders }) => {
  [true, false].forEach((rtlEnabled) => {
    test.meta({ browserSize: [900, 800] })(`Sticky columns with left position (showColumnLines = ${showColumnLines}, showBorders = ${showBorders}, rtlEnabled = ${rtlEnabled})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await testScreenshot(t, takeScreenshot, `left-position-1(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await testScreenshot(t, takeScreenshot, `left-position-2(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 884,
      showColumnLines,
      showBorders,
      rtlEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';
      },
    }));

    test.meta({ browserSize: [900, 800] })(`Sticky columns with right position (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await testScreenshot(t, takeScreenshot, `right-position-1(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await testScreenshot(t, takeScreenshot, `right-position-2(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 884,
      showColumnLines,
      showBorders,
      rtlEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'right';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'right';
      },
    }));

    test.meta({ browserSize: [900, 800] })(`Sticky columns with left and right positions (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await testScreenshot(t, takeScreenshot, `left-right-positions-1(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await testScreenshot(t, takeScreenshot, `left-right-positions-2(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 884,
      showColumnLines,
      showBorders,
      rtlEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'right';
        columns[8].fixed = true;
        columns[8].fixedPosition = 'right';
      },
    }));

    test.meta({ browserSize: [1000, 800] })(`Sticky columns with left, right and sticky positions (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await testScreenshot(t, takeScreenshot, `left-right-sticky-positions-1(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await testScreenshot(t, takeScreenshot, `left-right-sticky-positions-2(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showColumnLines,
      showBorders,
      rtlEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns[2].fixed = true;
        columns[2].fixedPosition = 'left';
        columns[3].fixed = true;
        columns[3].fixedPosition = 'left';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'sticky';
        columns[8].fixed = true;
        columns[8].fixedPosition = 'sticky';
        columns[9].fixed = true;
        columns[9].fixedPosition = 'sticky';
        columns[12].fixed = true;
        columns[12].fixedPosition = 'sticky';
        columns[15].fixed = true;
        columns[15].fixedPosition = 'right';
        columns[16].fixed = true;
        columns[16].fixedPosition = 'right';
      },
    }));

    test.meta({ browserSize: [1000, 800] })(`Sticky columns with sticky position (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await testScreenshot(t, takeScreenshot, `sticky-position-1-(case-1)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await testScreenshot(t, takeScreenshot, `sticky-position-2-(case-1)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showColumnLines,
      showBorders,
      rtlEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns[7].fixed = true;
        columns[7].fixedPosition = 'sticky';
        columns[8].fixed = true;
        columns[8].fixedPosition = 'sticky';
        columns[9].fixed = true;
        columns[9].fixedPosition = 'sticky';
        columns[12].fixed = true;
        columns[12].fixedPosition = 'sticky';
      },
    }));

    test.meta({ browserSize: [1000, 800] })(`Sticky columns with sticky position when first and last cells are sticky (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await testScreenshot(t, takeScreenshot, `sticky-position-1-(case-2)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await testScreenshot(t, takeScreenshot, `sticky-position-2-(case-2)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showColumnLines,
      showBorders,
      rtlEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns[0].fixed = true;
        columns[0].fixedPosition = 'sticky';
        columns[1].fixed = true;
        columns[1].fixedPosition = 'sticky';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'sticky';
        columns[8].fixed = true;
        columns[8].fixedPosition = 'sticky';
        columns[9].fixed = true;
        columns[9].fixedPosition = 'sticky';
        columns[columns.length - 2].fixed = true;
        columns[columns.length - 2].fixedPosition = 'sticky';
        columns[columns.length - 1].fixed = true;
        columns[columns.length - 1].fixedPosition = 'sticky';
      },
    }));

    test.meta({ browserSize: [1000, 800] })(`Sticky columns with sticky position when first and last cells are fixed on left and right respectively (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await testScreenshot(t, takeScreenshot, `sticky-position-1-(case-3)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await testScreenshot(t, takeScreenshot, `sticky-position-2-(case-3)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showColumnLines,
      showBorders,
      rtlEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns[0].fixed = true;
        columns[0].fixedPosition = 'left';
        columns[1].fixed = true;
        columns[1].fixedPosition = 'sticky';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'sticky';
        columns[8].fixed = true;
        columns[8].fixedPosition = 'sticky';
        columns[9].fixed = true;
        columns[9].fixedPosition = 'sticky';
        columns[columns.length - 2].fixed = true;
        columns[columns.length - 2].fixedPosition = 'sticky';
        columns[columns.length - 1].fixed = true;
        columns[columns.length - 1].fixedPosition = 'right';
      },
    }));
  });
});
