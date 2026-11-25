import { test, expect } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'AIPoweredDetailView', { width: 900, height: 600 }, () => {
  test('AIPoweredDetailView', async ({ page }) => {
    await page.locator('.dx-datagrid-rowsview')
      .locator('.dx-row:not(.dx-master-detail-row)')
      .nth(1)
      .locator('.dx-command-expand')
      .click();

    await expect(page.locator('.dx-chat-suggestions')).toBeVisible();

    await testScreenshot(page, 'datagrid_ai_powered_detail_view_2_desktop.png', '.input-container');
  });
});
