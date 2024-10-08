import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { defaultConfig } from './data';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Sticky columns - Adaptability`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((rtlEnabled) => {
  safeSizeTest(`Sticky columns with adaptive detail row (rtlEnabled = ${rtlEnabled})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const scrollLeft = rtlEnabled ? -10000 : 10000;

    await dataGrid.apiExpandAdaptiveDetailRow(1);

    await takeScreenshot(`adaptability_sticky_columns_with_adaptive_detail_row_1_(rtlEnabled_=_${rtlEnabled}).png`, dataGrid.element);

    await dataGrid.scrollTo(t, { x: scrollLeft });

    await takeScreenshot(`adaptability_sticky_columns_with_adaptive_detail_row_2_(rtlEnabled_=_${rtlEnabled}).png`, dataGrid.element);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [900, 800]).before(async () => createWidget('dxDataGrid', {
    ...defaultConfig,
    width: 800,
    rtlEnabled,
    customizeColumns(columns) {
      columns.forEach((column, index) => {
        if (index < 3) {
          column.hidingPriority = index;
        }

        column.width = 200;
      });
    },
    columnHidingEnabled: true,
  }));

  safeSizeTest(`Sticky columns with sticky positions (rtlEnabled = ${rtlEnabled})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await takeScreenshot(`adaptability_sticky_columns_with_sticky_positions_1_(rtlEnabled_=_${rtlEnabled}).png`, dataGrid.element);

    await dataGrid.scrollTo(t, { x: 10000 });

    await takeScreenshot(`adaptability_sticky_columns_with_sticky_positions_2_(rtlEnabled_=_${rtlEnabled}).png`, dataGrid.element);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [900, 800]).before(async () => createWidget('dxDataGrid', {
    ...defaultConfig,
    width: 800,
    rtlEnabled,
    customizeColumns(columns) {
      let hidingPriority = 0;

      columns.forEach((column, index) => {
        if (index === 1 || index === 4) {
          column.fixed = true;
          column.fixedPosition = 'sticky';
        } else {
          column.fixed = false;

          if (index < 3) {
            column.hidingPriority = hidingPriority;
            hidingPriority += 1;
          }
        }
        column.width = 200;
      });
    },
    columnHidingEnabled: true,
  }));
});

safeSizeTest('Sticky columns with sticky positions when columnHidingEnabled = false and columns have hidingPriority', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await takeScreenshot('adaptability_sticky_columns_with_sticky_positions_and_hiding_priority_1.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 10000 });

  await takeScreenshot('adaptability_sticky_columns_with_sticky_positions_and_hiding_priority_2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  width: 800,
  customizeColumns(columns) {
    let hidingPriority = 0;

    columns.forEach((column, index) => {
      if (index === 1 || index === 4) {
        column.fixed = true;
        column.fixedPosition = 'sticky';
      } else {
        column.fixed = false;

        if (index < 3) {
          column.hidingPriority = hidingPriority;
          hidingPriority += 1;
        }
      }
      column.width = 200;
    });
  },
  columnHidingEnabled: false,
}));
