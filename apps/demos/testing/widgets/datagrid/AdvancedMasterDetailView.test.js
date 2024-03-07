import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

fixture('DataGrid.AdvancedMasterDetailView')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'AdvancedMasterDetailView', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('AdvancedMasterDetailView', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // Navigate to the second page
    await t.click(
      $('.dx-page')
        .nth(1),
    );

    await takeScreenshot('datagrid_advanced_master_detail_view_1_desktop.png');

    // Expand the first master row
    await t.click(
      $('.dx-datagrid-rowsview')
        .find('.dx-row:not(.dx-master-detail-row)')
        .nth(0)
        .find('.dx-command-expand'),
    );

    await t.wait(200);

    await takeScreenshot('datagrid_advanced_master_detail_view_2_desktop.png');

    // Open the Product SelectBox
    await t.click(
      $('.dx-dropdowneditor-field-clickable'),
    );

    await takeScreenshot('datagrid_advanced_master_detail_view_3_desktop.png');

    // Select the second item
    await t.click(
      $('.dx-list-item')
        .nth(1),
    );

    await t.wait(200);

    await takeScreenshot('datagrid_advanced_master_detail_view_4_desktop.png');

    // Navigate to the second page of the details grid
    await t.click(
      $('.dx-master-detail-row .dx-page')
        .nth(1),
    );

    await takeScreenshot('datagrid_advanced_master_detail_view_5_desktop.png');

    // Switch to the second tab
    await t.click(
      $('.dx-tab')
        .nth(1),
    );

    await takeScreenshot('datagrid_advanced_master_detail_view_6_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
