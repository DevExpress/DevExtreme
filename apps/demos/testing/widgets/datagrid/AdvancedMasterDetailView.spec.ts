import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'AdvancedMasterDetailView', { width: 900, height: 600 }, () => {
  test('AdvancedMasterDetailView', async ({ page }) => {
    // Navigate to the second page
    await page.locator('.dx-page').nth(1).click();

    await testScreenshot(page, 'datagrid_advanced_master_detail_view_1_desktop.png');

    // Expand the first master row
    await page.locator('.dx-datagrid-rowsview')
      .locator('.dx-row:not(.dx-master-detail-row)')
      .nth(0)
      .locator('.dx-command-expand')
      .click();

    await testScreenshot(page, 'datagrid_advanced_master_detail_view_2_desktop.png');

    // Open the Product SelectBox
    await page.locator('.dx-dropdowneditor-field-clickable').first().click();

    await testScreenshot(page, 'datagrid_advanced_master_detail_view_3_desktop.png');

    // Select the second item
    await page.locator('.dx-list-item').nth(1).click();

    await testScreenshot(page, 'datagrid_advanced_master_detail_view_4_desktop.png');

    // Navigate to the second page of the details grid
    await page.locator('.dx-master-detail-row .dx-page').nth(1).click();

    await testScreenshot(page, 'datagrid_advanced_master_detail_view_5_desktop.png');

    // Switch to the second tab
    await page.locator('.dx-tab').nth(1).click();

    await testScreenshot(page, 'datagrid_advanced_master_detail_view_6_desktop.png');
  });
});
