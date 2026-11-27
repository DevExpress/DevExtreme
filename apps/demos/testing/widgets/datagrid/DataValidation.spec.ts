import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'DataValidation', { width: 900, height: 600 }, () => {
  test('DataValidation', async ({ page }) => {
    const addRowButton = page.locator('.dx-icon-edit-button-addrow').first();

    await addRowButton.click();
    await addRowButton.click();
    await page.locator('.dx-datagrid-save-button').first().click();
    await testScreenshot(page, 'datagrid_data_validation_2_desktop.png');

    await page.locator('.dx-datagrid-cancel-button').first().click();
    await testScreenshot(page, 'datagrid_data_validation_3_desktop.png');

    const cell = page.locator('.dx-datagrid-rowsview').locator('td').nth(3);
    const input = cell.locator('input').nth(0);

    await cell.click();
    await input.fill('');
    await input.pressSequentially('12345');
    await page.locator('body').click({ position: { x: 0, y: 0 } });
    await testScreenshot(page, 'datagrid_data_validation_4_desktop.png');

    await cell.click();
    await testScreenshot(page, 'datagrid_data_validation_5_desktop.png');
  });
});
