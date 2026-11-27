import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

test.describe('Band sticky columns', () => {
  test.use({ browserSize: [900, 800] });

  [false, true].forEach((rtlEnabled) => {
    // T1279722
    test(`Headers and filter row should display correctly after scrolling to the max right position when there is a grouped column (rtl=${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
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
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.scrollTo({ left: rtlEnabled ? 0 : 10000 });

      await testScreenshot(page, `T1279722_band_sticky_columns-headers_with_filter_row_and_grouped_column_(rtl=${rtlEnabled}).png`, { element: dataGrid.element });
    });
  });
});
