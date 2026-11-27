import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'MultipleSorting', { width: 900, height: 600 }, () => {
  test('MultipleSorting', async ({ page }) => {
    const headers = page.locator('.dx-datagrid-headers .dx-datagrid-action');

    await headers.nth(3).click({ modifiers: ['Shift'] });
    await headers.nth(4).click({ modifiers: ['Shift'] });

    await testScreenshot(page, 'datagrid_multiple_sorting_2_desktop.png');

    await headers.nth(5).click();

    await testScreenshot(page, 'datagrid_multiple_sorting_3_desktop.png');

    await headers.nth(5).click({ modifiers: ['Control'] });

    await testScreenshot(page, 'datagrid_multiple_sorting_4_desktop.png');

    await page.locator('.dx-header-row .dx-datagrid-action').nth(0).click({ button: 'right' });

    await testScreenshot(page, 'datagrid_multiple_sorting_5_desktop.png');
  });
});
