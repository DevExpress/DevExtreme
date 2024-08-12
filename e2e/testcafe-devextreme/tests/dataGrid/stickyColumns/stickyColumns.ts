import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import { getData } from '../helpers/generateDataSourceData';
import url from '../../../helpers/getPageUrl';

const DATA_GRID_SELECTOR = '#container';

fixture`FixedColumns`
  .page(url(__dirname, '../../container.html'));

const borderConfigs = [
  {
    showRowLines: true,
    showColumnLines: true,
    showBorders: true,
  }, {
    showRowLines: false,
    showColumnLines: true,
    showBorders: true,
  }, {
    showRowLines: false,
    showColumnLines: false,
    showBorders: true,
  }, {
    showRowLines: false,
    showColumnLines: false,
    showBorders: false,
  }, {
    showRowLines: true,
    showColumnLines: false,
    showBorders: true,
  }, {
    showRowLines: true,
    showColumnLines: false,
    showBorders: false,
  }, {
    showRowLines: true,
    showColumnLines: true,
    showBorders: false,
  }, {
    showRowLines: false,
    showColumnLines: true,
    showBorders: false,
  },
];

const rtlAndRowAltConfigs = [
  {
    rtlEnabled: true,
    rowAlternationEnabled: true,
  }, {
    rtlEnabled: false,
    rowAlternationEnabled: true,
  }, {
    rtlEnabled: false,
    rowAlternationEnabled: false,
  }, {
    rtlEnabled: true,
    rowAlternationEnabled: false,
  },
];

borderConfigs.forEach(({ showRowLines, showColumnLines, showBorders }) => {
  rtlAndRowAltConfigs.forEach(({ rtlEnabled, rowAlternationEnabled }) => {
    safeSizeTest(`Sticky columns with left position (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders}, rtlEnabled = ${rtlEnabled}, rowAlternationEnabled = ${rowAlternationEnabled})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await takeScreenshot(`left-position-1(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`left-position-2(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [900, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';
      },
    }));

    safeSizeTest(`Sticky columns with right position (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await takeScreenshot(`right-position-1(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`right-position-2(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [900, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'right';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'right';
      },
    }));

    safeSizeTest(`Sticky columns with left and right positions (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await takeScreenshot(`left-right-positions-1(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`left-right-positions-2(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [900, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
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

    safeSizeTest(`Sticky columns with left, right and sticky positions (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await takeScreenshot(`left-right-sticky-positions-1(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`left-right-sticky-positions-2(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
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

    safeSizeTest(`Sticky columns with sticky position (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await takeScreenshot(`sticky-position-1-(case-1)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`sticky-position-2-(case-1)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
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

    safeSizeTest(`Sticky columns with sticky position when first and last cells are sticky (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await takeScreenshot(`sticky-position-1-(case-2)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`sticky-position-2-(case-2)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
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

    safeSizeTest(`Sticky columns with sticky position when first and last cells are fixed on left and right respectively (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await takeScreenshot(`sticky-position-1-(case-3)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`sticky-position-2-(case-3)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
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
