import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

fixture('DataGrid.MasterDetailView')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'MasterDetailView', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('MasterDetailView', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click(
      $('.dx-datagrid-rowsview')
        .find('.dx-row:not(.dx-master-detail-row)')
        .nth(1)
        .find('.dx-command-expand'),
    );

    await takeScreenshot('datagrid_master_detail_view_2_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
