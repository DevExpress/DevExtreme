/* eslint-disable @typescript-eslint/no-floating-promises */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { getData } from '../../helpers/generateDataSourceData';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';

fixture.disablePageReloads`Column Fixing`.page(
  url(__dirname, '../../../container.html'),
);

// visual: generic.light
// visual: material.blue
// visual: fluent.blue
safeSizeTest('Fixed columns: Check context menu items', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  await t
    .rightClick(dataGrid.getHeaders().getHeaderRow(0).element)
    .click(dataGrid.getContextMenu().getItemByText('Set Fixed Position'))
    .expect(
      await takeScreenshot('sticky_columns_context_menu_(generic.light).png'),
    )
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
})
  .before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: getData(5, 5),
      width: '100%',
      columnFixing: {
        enabled: true,
      },
    });
  });
