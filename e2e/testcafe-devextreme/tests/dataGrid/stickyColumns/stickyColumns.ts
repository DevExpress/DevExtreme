import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { ClientFunction, Selector } from 'testcafe';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import { getData } from '../helpers/generateDataSourceData';
import url from '../../../helpers/getPageUrl';
import { changeTheme } from '../../../helpers/changeTheme';
import { Themes } from '../../../helpers/themes';
import { defaultConfig } from './data';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`FixedColumns`
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

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`left-position-1(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`left-position-2(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [900, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 884,
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

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`right-position-1(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`right-position-2(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [900, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 884,
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

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`left-right-positions-1(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`left-right-positions-2(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [900, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 884,
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

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`left-right-sticky-positions-1(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`left-right-sticky-positions-2(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
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

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`sticky-position-1-(case-1)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`sticky-position-2-(case-1)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
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

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`sticky-position-1-(case-2)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`sticky-position-2-(case-2)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
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

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`sticky-position-1-(case-3)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`sticky-position-2-(case-3)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rowAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
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

    safeSizeTest(`Band sticky columns: left and right positions (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-1)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-1)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns.push({
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'left',
          columns: [{
            caption: 'Nested band column 1',
            columns: [
              { dataField: 'field_11', name: 'child_1' },
              { dataField: 'field_12', name: 'child_2' },
            ],
          }, { dataField: 'field_13', name: 'child_3' }, {
            caption: 'Nested band column 2',
            columns: [
              { dataField: 'field_14', name: 'child_4' },
              { dataField: 'field_15', name: 'child_5' },
            ],
          }],
        }, {
          caption: 'Band column 2',
          fixed: true,
          fixedPosition: 'right',
          columns: [
            { dataField: 'field_16', name: 'child_6' },
            {
              caption: 'Nested band column 3',
              columns: [
                { dataField: 'field_17', name: 'child_7' },
                { dataField: 'field_18', name: 'child_8' },
              ],
            },
            { dataField: 'field_19', name: 'child_9' },
          ],
        });
      },
    }));

    safeSizeTest(`Band sticky columns: left positions (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-2)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-2)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns.push({
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'left',
          columns: [{
            caption: 'Nested band column 1',
            columns: [
              { dataField: 'field_11', name: 'child_1' },
              { dataField: 'field_12', name: 'child_2' },
            ],
          }, { dataField: 'field_13', name: 'child_3' }, {
            caption: 'Nested band column 2',
            columns: [
              { dataField: 'field_14', name: 'child_4' },
              { dataField: 'field_15', name: 'child_5' },
            ],
          }],
        }, {
          caption: 'Band column 2',
          fixed: true,
          fixedPosition: 'left',
          columns: [
            { dataField: 'field_16', name: 'child_6' },
            {
              caption: 'Nested band column 3',
              columns: [
                { dataField: 'field_17', name: 'child_7' },
                { dataField: 'field_18', name: 'child_8' },
              ],
            },
            { dataField: 'field_19', name: 'child_9' },
          ],
        });
      },
    }));

    safeSizeTest(`Band sticky columns: right positions (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-3)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-3)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns.push({
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'right',
          columns: [{
            caption: 'Nested band column 1',
            columns: [
              { dataField: 'field_11', name: 'child_1' },
              { dataField: 'field_12', name: 'child_2' },
            ],
          }, { dataField: 'field_13', name: 'child_3' }, {
            caption: 'Nested band column 2',
            columns: [
              { dataField: 'field_14', name: 'child_4' },
              { dataField: 'field_15', name: 'child_5' },
            ],
          }],
        }, {
          caption: 'Band column 2',
          fixed: true,
          fixedPosition: 'right',
          columns: [
            { dataField: 'field_16', name: 'child_6' },
            {
              caption: 'Nested band column 3',
              columns: [
                { dataField: 'field_17', name: 'child_7' },
                { dataField: 'field_18', name: 'child_8' },
              ],
            },
            { dataField: 'field_19', name: 'child_9' },
          ],
        });
      },
    }));

    safeSizeTest(`Band sticky column with left position and unfixed band column (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-4)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-4)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns.push({
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'left',
          columns: [{
            caption: 'Nested band column 1',
            columns: [
              { dataField: 'field_11', name: 'child_1' },
              { dataField: 'field_12', name: 'child_2' },
            ],
          }, { dataField: 'field_13', name: 'child_3' }, {
            caption: 'Nested band column 2',
            columns: [
              { dataField: 'field_14', name: 'child_4' },
              { dataField: 'field_15', name: 'child_5' },
            ],
          }],
        }, {
          caption: 'Band column 2',
          columns: [
            { dataField: 'field_16', name: 'child_6' },
            {
              caption: 'Nested band column 3',
              columns: [
                { dataField: 'field_17', name: 'child_7' },
                { dataField: 'field_18', name: 'child_8' },
              ],
            },
            { dataField: 'field_19', name: 'child_9' },
          ],
        });
      },
    }));

    safeSizeTest(`Band sticky column with right position and unfixed band column (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-5)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-5)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns.push({
          caption: 'Band column 1',
          columns: [{
            caption: 'Nested band column 1',
            columns: [
              { dataField: 'field_11', name: 'child_1' },
              { dataField: 'field_12', name: 'child_2' },
            ],
          }, { dataField: 'field_13', name: 'child_3' }, {
            caption: 'Nested band column 2',
            columns: [
              { dataField: 'field_14', name: 'child_4' },
              { dataField: 'field_15', name: 'child_5' },
            ],
          }],
        }, {
          caption: 'Band column 2',
          fixed: true,
          fixedPosition: 'right',
          columns: [
            { dataField: 'field_16', name: 'child_6' },
            {
              caption: 'Nested band column 3',
              columns: [
                { dataField: 'field_17', name: 'child_7' },
                { dataField: 'field_18', name: 'child_8' },
              ],
            },
            { dataField: 'field_19', name: 'child_9' },
          ],
        });
      },
    }));

    safeSizeTest(`Adjacent band sticky columns: sticky positions (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-6)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-6)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns.splice(2, 0, {
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'sticky',
          columns: [{
            caption: 'Nested band column 1',
            columns: [
              { dataField: 'field_11', name: 'child_1' },
              { dataField: 'field_12', name: 'child_2' },
            ],
          }, { dataField: 'field_13', name: 'child_3' }, {
            caption: 'Nested band column 2',
            columns: [
              { dataField: 'field_14', name: 'child_4' },
              { dataField: 'field_15', name: 'child_5' },
            ],
          }],
        });
        columns.splice(3, 0, {
          caption: 'Band column 2',
          fixed: true,
          fixedPosition: 'sticky',
          columns: [
            { dataField: 'field_16', name: 'child_6' },
            {
              caption: 'Nested band column 3',
              columns: [
                { dataField: 'field_17', name: 'child_7' },
                { dataField: 'field_18', name: 'child_8' },
              ],
            },
            { dataField: 'field_19', name: 'child_9' },
          ],
        });
      },
    }));

    safeSizeTest(`First and last band sticky columns: sticky positions (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-7)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-7)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns.unshift({
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'sticky',
          columns: [{
            caption: 'Nested band column 1',
            columns: [
              { dataField: 'field_11', name: 'child_1' },
              { dataField: 'field_12', name: 'child_2' },
            ],
          }, { dataField: 'field_13', name: 'child_3' }, {
            caption: 'Nested band column 2',
            columns: [
              { dataField: 'field_14', name: 'child_4' },
              { dataField: 'field_15', name: 'child_5' },
            ],
          }],
        });
        columns.push({
          caption: 'Band column 2',
          fixed: true,
          fixedPosition: 'sticky',
          columns: [
            { dataField: 'field_16', name: 'child_6' },
            {
              caption: 'Nested band column 3',
              columns: [
                { dataField: 'field_17', name: 'child_7' },
                { dataField: 'field_18', name: 'child_8' },
              ],
            },
            { dataField: 'field_19', name: 'child_9' },
          ],
        });
      },
    }));

    safeSizeTest(`Sticky column + Band sticky column + Sticky column: sticky positions (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-8)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-8)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns[1].fixed = true;
        columns[1].fixedPosition = 'sticky';

        columns.splice(2, 0, {
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'sticky',
          columns: [{
            caption: 'Nested band column 1',
            columns: [
              { dataField: 'field_11', name: 'child_1' },
              { dataField: 'field_12', name: 'child_2' },
            ],
          }, { dataField: 'field_13', name: 'child_3' }, {
            caption: 'Nested band column 2',
            columns: [
              { dataField: 'field_14', name: 'child_4' },
              { dataField: 'field_15', name: 'child_5' },
            ],
          }],
        });

        columns[3].fixed = true;
        columns[3].fixedPosition = 'sticky';
      },
    }));

    safeSizeTest(`Sticky column + Band sticky column + Sticky column: left positions (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-9)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-9)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns[1].fixed = true;
        columns[1].fixedPosition = 'left';

        columns.splice(2, 0, {
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'left',
          columns: [{
            caption: 'Nested band column 1',
            columns: [
              { dataField: 'field_11', name: 'child_1' },
              { dataField: 'field_12', name: 'child_2' },
            ],
          }, { dataField: 'field_13', name: 'child_3' }, {
            caption: 'Nested band column 2',
            columns: [
              { dataField: 'field_14', name: 'child_4' },
              { dataField: 'field_15', name: 'child_5' },
            ],
          }],
        });

        columns[3].fixed = true;
        columns[3].fixedPosition = 'left';
      },
    }));

    safeSizeTest(`Sticky column + Band sticky column + Sticky column: right positions (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-10)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-10)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns[1].fixed = true;
        columns[1].fixedPosition = 'right';

        columns.splice(2, 0, {
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'right',
          columns: [{
            caption: 'Nested band column 1',
            columns: [
              { dataField: 'field_11', name: 'child_1' },
              { dataField: 'field_12', name: 'child_2' },
            ],
          }, { dataField: 'field_13', name: 'child_3' }, {
            caption: 'Nested band column 2',
            columns: [
              { dataField: 'field_14', name: 'child_4' },
              { dataField: 'field_15', name: 'child_5' },
            ],
          }],
        });

        columns[3].fixed = true;
        columns[3].fixedPosition = 'right';
      },
    }));

    safeSizeTest(`Band sticky column with left position + Sticky column with sticky position (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-11)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-11)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns.splice(1, 0, {
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'left',
          columns: [{
            caption: 'Nested band column 1',
            columns: [
              { dataField: 'field_11', name: 'child_1' },
              { dataField: 'field_12', name: 'child_2' },
            ],
          }, { dataField: 'field_13', name: 'child_3' }, {
            caption: 'Nested band column 2',
            columns: [
              { dataField: 'field_14', name: 'child_4' },
              { dataField: 'field_15', name: 'child_5' },
            ],
          }],
        });

        columns[0].fixed = true;
        columns[0].fixedPosition = 'sticky';
      },
    }));

    safeSizeTest(`Sticky column with sticky position + Band sticky column with right position (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-12)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-12)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns.splice(columns.length - 1, 0, {
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'right',
          columns: [{
            caption: 'Nested band column 1',
            columns: [
              { dataField: 'field_11', name: 'child_1' },
              { dataField: 'field_12', name: 'child_2' },
            ],
          }, { dataField: 'field_13', name: 'child_3' }, {
            caption: 'Nested band column 2',
            columns: [
              { dataField: 'field_14', name: 'child_4' },
              { dataField: 'field_15', name: 'child_5' },
            ],
          }],
        });

        columns[columns.length - 1].fixed = true;
        columns[columns.length - 1].fixedPosition = 'sticky';
      },
    }));

    safeSizeTest(`Sticky column with left position + Band sticky column with sticky position (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-13)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-13)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns[0].fixed = true;
        columns[0].fixedPosition = 'left';

        columns.splice(1, 0, {
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'sticky',
          columns: [{
            caption: 'Nested band column 1',
            columns: [
              { dataField: 'field_11', name: 'child_1' },
              { dataField: 'field_12', name: 'child_2' },
            ],
          }, { dataField: 'field_13', name: 'child_3' }, {
            caption: 'Nested band column 2',
            columns: [
              { dataField: 'field_14', name: 'child_4' },
              { dataField: 'field_15', name: 'child_5' },
            ],
          }],
        });
      },
    }));

    safeSizeTest(`Band sticky column with sticky position + Sticky column with right position (showRowLines = ${showRowLines}, showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-14)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-14)(rLines_=_${showRowLines}_cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}_rAlt_=_${rowAlternationEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showRowLines,
      showColumnLines,
      showBorders,
      rtlEnabled,
      rowAlternationEnabled,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns.splice(columns.length - 1, 0, {
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'sticky',
          columns: [{
            caption: 'Nested band column 1',
            columns: [
              { dataField: 'field_11', name: 'child_1' },
              { dataField: 'field_12', name: 'child_2' },
            ],
          }, { dataField: 'field_13', name: 'child_3' }, {
            caption: 'Nested band column 2',
            columns: [
              { dataField: 'field_14', name: 'child_4' },
              { dataField: 'field_15', name: 'child_5' },
            ],
          }],
        });

        columns[columns.length - 1].fixed = true;
        columns[columns.length - 1].fixedPosition = 'right';
      },
    }));
  });
});

safeSizeTest('The simulated scrollbar should display correctly when there are sticky columns', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scrollbarVerticalThumbTrack = dataGrid.getScrollBarThumbTrack('horizontal');

  await t.expect(dataGrid.isReady()).ok();

  await t.hover(scrollbarVerticalThumbTrack);
  await takeScreenshot('simulated_scrollbar_with_sticky_columns_1.png', dataGrid.element);

  // act
  await t
    .drag(scrollbarVerticalThumbTrack, 600, 0)
    .wait(1000);

  await takeScreenshot('simulated_scrollbar_with_sticky_columns_2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 800]).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(5, 25),
  width: 984,
  columnAutoWidth: true,
  scrolling: {
    useNative: false,
  },
  customizeColumns: (columns) => {
    columns[5].fixed = true;
    columns[5].fixedPosition = 'left';
    columns[6].fixed = true;
    columns[6].fixedPosition = 'left';

    columns[8].fixed = true;
    columns[8].fixedPosition = 'right';
    columns[9].fixed = true;
    columns[9].fixedPosition = 'right';
  },
}));

[
  Themes.genericLight,
  Themes.materialBlue,
  Themes.fluentBlue,
  Themes.genericGreenMist,
].forEach((theme) => {
  safeSizeTest(`Header hover should display correctly when there are fixed columns (${theme} theme)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(13);

    await t.expect(dataGrid.isReady()).ok();

    await t.hover(headerCell.element);

    await t.expect(headerCell.isHovered()).ok();

    await takeScreenshot(`datagrid_header_hover_with_fixed_columns_(${theme}).png`, dataGrid.element);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [900, 800])
    .before(async () => {
      await changeTheme(theme);
      await createWidget('dxDataGrid', {
        dataSource: getData(20, 15),
        columnWidth: 100,
        columnAutoWidth: true,
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'left';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'left';

          columns[8].fixed = true;
          columns[8].fixedPosition = 'right';
          columns[9].fixed = true;
          columns[9].fixedPosition = 'right';
        },
      });
    })
    .after(async (t) => {
      await t.hover(Selector('body'));
      await changeTheme(Themes.genericLight);
    });

  safeSizeTest(`Row hover should display correctly when there are fixed columns (${theme} theme)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const dataRow = dataGrid.getDataRow(1);

    await t.expect(dataGrid.isReady()).ok();

    await t.hover(dataRow.element);

    await t.expect(dataRow.isHovered).ok();

    await takeScreenshot(`datagrid_row_hover_with_fixed_columns_(${theme}).png`, dataGrid.element);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [900, 800])
    .before(async () => {
      await changeTheme(theme);
      await createWidget('dxDataGrid', {
        dataSource: getData(20, 15),
        columnWidth: 100,
        columnAutoWidth: true,
        hoverStateEnabled: true,
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'left';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'left';

          columns[8].fixed = true;
          columns[8].fixedPosition = 'right';
          columns[9].fixed = true;
          columns[9].fixedPosition = 'right';
        },
      });
    })
    .after(async (t) => {
      await t.hover(Selector('body'));
      await changeTheme(Themes.genericLight);
    });

  safeSizeTest(`Alternating rows should display correctly when there are fixed columns (${theme} theme)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t.expect(dataGrid.isReady()).ok();

    await takeScreenshot(`datagrid_row_alt_with_fixed_columns_(${theme}).png`, dataGrid.element);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [900, 800])
    .before(async () => {
      await changeTheme(theme);
      await createWidget('dxDataGrid', {
        dataSource: getData(20, 15),
        columnWidth: 100,
        columnAutoWidth: true,
        rowAlternationEnabled: true,
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'left';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'left';

          columns[8].fixed = true;
          columns[8].fixedPosition = 'right';
          columns[9].fixed = true;
          columns[9].fixedPosition = 'right';
        },
      });
    })
    .after(async () => {
      await changeTheme(Themes.genericLight);
    });
});

[
  Themes.genericLight,
  Themes.materialBlue,
  Themes.fluentBlue,
].forEach((theme) => {
  [0.9, 1.25, 1.5].forEach((zoom) => {
    safeSizeTest(`Fixed columns should display correctly at ${zoom * 100}% zoom (${theme} theme)`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`fixed_columns_with_${zoom * 100}%_zoom_(${theme}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [900, 800])
      .before(async () => {
        await ClientFunction((zoomValue: number) => {
          $('body').css('zoom', zoomValue);
        })(zoom);
        await changeTheme(theme);
        await createWidget('dxDataGrid', {
          dataSource: getData(20, 15),
          columnWidth: 100,
          columnAutoWidth: true,
          customizeColumns: (columns) => {
            columns[5].fixed = true;
            columns[5].fixedPosition = 'left';
            columns[6].fixed = true;
            columns[6].fixedPosition = 'left';

            columns[8].fixed = true;
            columns[8].fixedPosition = 'right';
            columns[9].fixed = true;
            columns[9].fixedPosition = 'right';
          },
        });
      })
      .after(async () => {
        await ClientFunction(() => {
          $('body').css('zoom', '');
        })();
        await changeTheme(Themes.genericLight);
      });
  });
});

safeSizeTest('The grid should display correctly when there is no data and there are fixed columns (T1269088)', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  await takeScreenshot('T1269088_grid_with_fixed_columns_and_without_data.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  dataSource: [],
}));
