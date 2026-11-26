import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'MultipleRecordSelectionAPI', { width: 900, height: 600 }, () => {
  test('MultipleRecordSelectionAPI', async ({ page }) => {
    const rows = page.locator('.dx-datagrid-rowsview tr');

    await page.locator('.dx-selectbox-container').nth(0).click();
    await page.locator('.dx-list-item').nth(2).click();
    await page.locator('body').click({ position: { x: 0, y: 0 } });

    await testScreenshot(page, 'datagrid_multiple_record_selection_and_API_2_desktop.png');

    await page.locator('[aria-label="Clear Selection"]').first().click();

    await testScreenshot(page, 'datagrid_multiple_record_selection_and_API_3_desktop.png');

    await page.locator('.dx-checkbox-icon').nth(0).click();

    await testScreenshot(page, 'datagrid_multiple_record_selection_and_API_4_desktop.png');

    await page.locator('.dx-checkbox-icon').nth(0).click();

    await testScreenshot(page, 'datagrid_multiple_record_selection_and_API_5_desktop.png');

    await rows.nth(1).click();

    await testScreenshot(page, 'datagrid_multiple_record_selection_and_API_6_desktop.png');

    await rows.nth(6).click({ modifiers: ['Shift'] });

    await testScreenshot(page, 'datagrid_multiple_record_selection_and_API_7_desktop.png');
  });
});
