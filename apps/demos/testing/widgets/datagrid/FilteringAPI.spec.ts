import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'FilteringAPI', { width: 900, height: 600 }, () => {
  test('FilteringAPI', async ({ page }) => {
    await page.locator('.dx-selectbox-container').first().click();
    await page.locator('.dx-list-item').nth(1).click();

    await testScreenshot(page, 'datagrid_filtering_API_2_desktop.png');
  });
});
