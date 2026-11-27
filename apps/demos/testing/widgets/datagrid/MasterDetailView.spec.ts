import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'MasterDetailView', { width: 900, height: 600 }, () => {
  test('MasterDetailView', async ({ page }) => {
    await page.locator('.dx-datagrid-rowsview')
      .locator('.dx-row:not(.dx-master-detail-row)')
      .nth(1)
      .locator('.dx-command-expand')
      .click();

    await testScreenshot(page, 'datagrid_master_detail_view_2_desktop.png');
  });
});
