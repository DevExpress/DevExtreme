import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'MasterDetailAPI', { width: 900, height: 600 }, () => {
  test('MasterDetailAPI', async ({ page }) => {
    await page.locator('.dx-datagrid-rowsview')
      .locator('.dx-row:not(.dx-master-detail-row)')
      .nth(1)
      .click();

    await testScreenshot(page, 'datagrid_master_detail_api_2_desktop.png');
  });
});
