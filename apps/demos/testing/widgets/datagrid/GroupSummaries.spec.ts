import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'GroupSummaries', { width: 900, height: 600 }, () => {
  test('GroupSummaries', async ({ page }) => {
    await page.locator('.dx-page').last().click();
    await page.locator('body').click({ position: { x: 0, y: 0 } });

    await testScreenshot(page, 'datagrid_group_summaries_2_desktop.png');
  });
});
