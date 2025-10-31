import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import { getData } from '../../helpers/generateDataSourceData';
import url from '../../../../helpers/getPageUrl';
import { borderConfigs } from '../helpers/testMatrixConfig';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`FixedColumns`
  .page(url(__dirname, '../../../container.html'));

borderConfigs.forEach(({ showColumnLines, showBorders }) => {
  [true, false].forEach((rtlEnabled) => {
    test.meta({ browserSize: [1000, 800] })(`Band sticky columns: left and right positions (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-1)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-1)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, dataGrid.element);

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

    test.meta({ browserSize: [1000, 800] })(`Band sticky columns: left positions (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-2)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-2)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, dataGrid.element);

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

    test.meta({ browserSize: [1000, 800] })(`Band sticky columns: right positions (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-3)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-3)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, dataGrid.element);

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

    test.meta({ browserSize: [1000, 800] })(`Band sticky column with left position and unfixed band column (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-4)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-4)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, dataGrid.element);

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

    test.meta({ browserSize: [1000, 800] })(`Band sticky column with right position and unfixed band column (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-5)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-5)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, dataGrid.element);

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

    test.meta({ browserSize: [1000, 800] })(`Adjacent band sticky columns: sticky positions (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-6)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-6)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, dataGrid.element);

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

    test.meta({ browserSize: [1000, 800] })(`First and last band sticky columns: sticky positions (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`band-columns-1-(case-7)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, dataGrid.element);

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await takeScreenshot(`band-columns-2-(case-7)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, dataGrid.element);

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
  });
});
