import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'BatchEditing', { width: 900, height: 600 }, () => {
  test('BatchEditing', async ({ page }) => {
    const cells = page.locator('.dx-datagrid-rowsview').locator('td');

    await cells.nth(1).click();
    await testScreenshot(page, 'datagrid_batch_editing_2_desktop.png');

    const input = page.locator('.dx-datagrid-rowsview').locator('input').nth(0);

    await input.fill('');
    await input.pressSequentially('Bob');
    await page.keyboard.press('Enter');
    await testScreenshot(page, 'datagrid_batch_editing_3_desktop.png');

    await page.locator('.dx-icon-edit-button-save').first().click();
    await testScreenshot(page, 'datagrid_batch_editing_4_desktop.png');

    await cells.nth(4).click();
    await page.locator('.dx-dropdowneditor-icon').nth(0).click();
    await page.locator('.dx-list-item').nth(0).click();
    await page.locator('body').click({ position: { x: 0, y: 0 } });
    await testScreenshot(page, 'datagrid_batch_editing_5_desktop.png');

    await page.locator('.dx-icon-edit-button-cancel').first().click();
    await testScreenshot(page, 'datagrid_batch_editing_6_desktop.png');
  });
});
