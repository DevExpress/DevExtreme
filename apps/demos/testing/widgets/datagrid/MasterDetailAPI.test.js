import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

fixture('DataGrid.MasterDetailAPI')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'MasterDetailAPI', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('MasterDetailAPI', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click(
      $('.dx-datagrid-rowsview')
        .find('.dx-row:not(.dx-master-detail-row)')
        .nth(1),
    );

    await takeScreenshot('datagrid_master_detail_api_2_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
