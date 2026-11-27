import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'RowEditing', { width: 900, height: 600 }, () => {
  test('RowEditing', async ({ page }) => {
    const input = page.locator('.dx-datagrid-rowsview').locator('input').nth(1);

    await page.locator('.dx-link-edit').nth(0).click();

    await testScreenshot(page, 'datagrid_row_editing_and_editing_events_2_desktop.png');

    await input.fill('');
    await input.pressSequentially('Bob');

    await testScreenshot(page, 'datagrid_row_editing_and_editing_events_3_desktop.png');

    await page.locator('.dx-link-save').nth(0).click();

    await testScreenshot(page, 'datagrid_row_editing_and_editing_events_4_desktop.png');

    await page.locator('#clear').click();
    await page.locator('.dx-icon-edit-button-addrow').first().click();

    await testScreenshot(page, 'datagrid_row_editing_and_editing_events_5_desktop.png');

    await input.fill('');
    await input.pressSequentially('Bob');
    await page.locator('.dx-link-save').nth(0).click();

    await testScreenshot(page, 'datagrid_row_editing_and_editing_events_6_desktop.png');

    await page.locator('#clear').click();
    await page.locator('.dx-link-delete').nth(2).click();

    await testScreenshot(page, 'datagrid_row_editing_and_editing_events_7_desktop.png');

    await page.locator('.dx-dialog-buttons').locator('.dx-dialog-button').nth(0).click();

    await testScreenshot(page, 'datagrid_row_editing_and_editing_events_8_desktop.png');
  });
});
