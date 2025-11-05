import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { getData } from '../../helpers/generateDataSourceData';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';
import { testScreenshot } from '../../../../helpers/themeUtils';

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
    .click(dataGrid.getContextMenu().getItemByText('Set Fixed Position'));
  await testScreenshot(t, takeScreenshot, 'sticky_columns_context_menu.png');
  await t
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
