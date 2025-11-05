import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Band sticky columns`
  .page(url(__dirname, '../../../container.html'));

[false, true].forEach((rtlEnabled) => {
  // T1279722
  safeSizeTest(`Headers and filter row should display correctly after scrolling to the max right position when there is a grouped column (rtl=${rtlEnabled})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t.expect(dataGrid.isReady()).ok();

    await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });
    await testScreenshot(t, takeScreenshot, `T1279722_band_sticky_columns-headers_with_filter_row_and_grouped_column_(rtl=${rtlEnabled}).png`, { element: dataGrid.element });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [900, 800]).before(async () => createWidget('dxDataGrid', {
    dataSource: [
      {
        field0: 1, field1: 1, field2: 1, field3: 1, field4: 1, field5: 1, field6: 1, field7: 1,
      },
    ],
    keyExpr: 'field0',
    width: 500,
    columnWidth: 100,
    columns: [{
      dataField: 'field0',
      fixed: true,
      fixedPosition: rtlEnabled ? 'right' : 'left',
    }, {
      caption: 'Band',
      fixed: true,
      fixedPosition: rtlEnabled ? 'right' : 'left',
      columns: [{
        dataField: 'field1',
        groupIndex: 0,
      }, 'field2'],
    }, 'field3', 'field4', 'field5', 'field6', 'field7'],
    showBorders: true,
    filterRow: { visible: true },
    rtlEnabled,
  }));
});
