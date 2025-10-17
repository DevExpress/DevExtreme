import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { defaultConfig } from '../helpers/data';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Sticky columns - Multi Row Header Columns`
  .page(url(__dirname, '../../../container.html'));

// visual: generic.light
// visual: material.blue.light
// visual: fluent.blue.light
safeSizeTest(`The multi row header columns should have vertical borders when a column is fixed (generic.light theme) (T1282595)`, async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await takeScreenshot(`multi_row_header_columns_(generic.light).png`, dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800])
  .before(async () => {
    await createWidget('dxDataGrid', {
      ...defaultConfig,
      columns: [
        {
          dataField: 'ID',
          fixed: true,
        },
        {
          caption: 'Order',
          columns: [
            'OrderNumber',
            'OrderDate',
          ],
        },
        'SaleAmount',
        'Terms',
      ],
      showBorders: true,
    });
  });
