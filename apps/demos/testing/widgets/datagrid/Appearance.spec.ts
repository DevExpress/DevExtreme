import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'Appearance', { width: 900, height: 600 }, () => {
  test('Appearance', async ({ page }) => {
    const checkBoxIcons = page.locator('.dx-checkbox-icon');

    await checkBoxIcons.nth(0).click();
    await testScreenshot(page, 'datagrid_appearance_2_desktop.png');

    await checkBoxIcons.nth(1).click();
    await testScreenshot(page, 'datagrid_appearance_3_desktop.png');

    await checkBoxIcons.nth(3).click();
    await testScreenshot(page, 'datagrid_appearance_4_desktop.png');

    await checkBoxIcons.nth(0).click();
    await testScreenshot(page, 'datagrid_appearance_5_desktop.png');
  });
});
