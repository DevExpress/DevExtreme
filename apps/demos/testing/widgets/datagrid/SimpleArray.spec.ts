import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'SimpleArray', { width: 900, height: 600 }, () => {
  test('SimpleArray', async ({ page }) => {
    await page.locator('.dx-datagrid-headers .dx-datagrid-action').nth(1).click({ button: 'right' });

    await testScreenshot(page, 'datagrid_simple_array_1_desktop.png');

    await page.locator('.dx-menu-item').nth(1).click();

    await testScreenshot(page, 'datagrid_simple_array_2_desktop.png');
  });
});
