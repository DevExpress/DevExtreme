import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { defaultConfig } from '../helpers/data';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Sticky columns - Filter row`
  .page(url(__dirname, '../../../container.html'));

// visual: generic.light
// visual: material.blue.light
// visual: fluent.blue.light
safeSizeTest('Filter row with sticky columns (generic.light theme)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getHeaders().getFilterRow().getFilterCell(1).element);

  await takeScreenshot('filter_row_with_sticky_columns_1_(generic.light).png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 10000 });

  await takeScreenshot('filter_row_with_sticky_columns_2_(generic.light).png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800])
  .before(async () => {
    await createWidget('dxDataGrid', {
      ...defaultConfig,
      filterRow: {
        visible: true,
      },
    });
  });

safeSizeTest('Filter row with sticky columns when there are band columns and showColumnHeaders = false', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await t.click(dataGrid.getHeaders().getFilterRow().getFilterCell(1).element);

  await takeScreenshot('filter_row_with_sticky_and_band_columns_1_(showColumnHeaders_=_false).png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 10000 });

  await takeScreenshot('filter_row_with_sticky_and_band_columns_2_(showColumnHeaders_=_false).png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800])
  .before(async () => createWidget('dxDataGrid', {
    ...defaultConfig,
    filterRow: {
      visible: true,
    },
    showColumnHeaders: false,
    customizeColumns(columns) {
      columns.push({
        caption: 'Band column',
        columns: ['CustomerStoreCity', 'CustomerStoreState'],
      });
    },
  }));
