import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'RecordPaging', { width: 900, height: 600 }, () => {
  test('RecordPaging', async ({ page }) => {
    await page.locator('.dx-page-size').filter({ hasText: '5' }).first().click();
    await testScreenshot(page, 'datagrid_record_paging_2_desktop.png');

    await page.locator('.dx-page').last().click();
    await testScreenshot(page, 'datagrid_record_paging_3_desktop.png');
  });
});
