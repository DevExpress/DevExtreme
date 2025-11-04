import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';
import { createWidget } from '../../../../helpers/createWidget';
import { getData } from '../../helpers/generateDataSourceData';
import url from '../../../../helpers/getPageUrl';
import { borderConfigs } from '../helpers/testMatrixConfig';
import { testScreenshot } from '../../../../helpers/themeUtils';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`FixedColumns`
  .page(url(__dirname, '../../../container.html'));

borderConfigs.forEach(({ showColumnLines, showBorders }) => {
  [true, false].forEach((rtlEnabled) => {
    safeSizeTest(`Sticky column + Band sticky column + Sticky column: sticky positions (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await testScreenshot(t, takeScreenshot, `band-columns-1-(case-8)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await testScreenshot(t, takeScreenshot, `band-columns-2-(case-8)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showColumnLines,
      showBorders,
      rtlEnabled,
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

    safeSizeTest(`Sticky column + Band sticky column + Sticky column: left positions (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await testScreenshot(t, takeScreenshot, `band-columns-1-(case-9)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await testScreenshot(t, takeScreenshot, `band-columns-2-(case-9)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showColumnLines,
      showBorders,
      rtlEnabled,
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

    safeSizeTest(`Sticky column + Band sticky column + Sticky column: right positions (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await testScreenshot(t, takeScreenshot, `band-columns-1-(case-10)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await testScreenshot(t, takeScreenshot, `band-columns-2-(case-10)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showColumnLines,
      showBorders,
      rtlEnabled,
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

    safeSizeTest(`Band sticky column with left position + Sticky column with sticky position (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await testScreenshot(t, takeScreenshot, `band-columns-1-(case-11)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await testScreenshot(t, takeScreenshot, `band-columns-2-(case-11)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showColumnLines,
      showBorders,
      rtlEnabled,
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

    safeSizeTest(`Sticky column with sticky position + Band sticky column with right position (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await testScreenshot(t, takeScreenshot, `band-columns-1-(case-12)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await testScreenshot(t, takeScreenshot, `band-columns-2-(case-12)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showColumnLines,
      showBorders,
      rtlEnabled,
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

    safeSizeTest(`Sticky column with left position + Band sticky column with sticky position (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await testScreenshot(t, takeScreenshot, `band-columns-1-(case-13)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await testScreenshot(t, takeScreenshot, `band-columns-2-(case-13)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showColumnLines,
      showBorders,
      rtlEnabled,
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

    safeSizeTest(`Band sticky column with sticky position + Sticky column with right position (showColumnLines = ${showColumnLines}, showBorders = ${showBorders})`, async (t) => {
      // arrange
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.expect(dataGrid.isReady()).ok();

      await testScreenshot(t, takeScreenshot, `band-columns-1-(case-14)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      // act
      await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });

      await testScreenshot(t, takeScreenshot, `band-columns-2-(case-14)(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled}).png`, { element: dataGrid.element });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1000, 800]).before(async () => createWidget('dxDataGrid', {
      dataSource: getData(5, 25),
      width: 984,
      showColumnLines,
      showBorders,
      rtlEnabled,
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
