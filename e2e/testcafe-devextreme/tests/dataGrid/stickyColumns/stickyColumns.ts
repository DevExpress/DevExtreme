import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import { getData } from '../helpers/generateDataSourceData';
import url from '../../../helpers/getPageUrl';

const DATA_GRID_SELECTOR = '#container';

fixture`FixedColumns`
  .page(url(__dirname, '../container.html'));

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
  });
});
