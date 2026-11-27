import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'PopupEditing', { width: 900, height: 600 }, () => {
  test('PopupEditing', async ({ page }) => {
    const overlayContent = page.locator('.dx-overlay-content').first();

    await testScreenshot(page, 'datagrid_popup_editing_1_desktop.png');

    await page.locator('.dx-link-edit').nth(0).click();

    await testScreenshot(page, 'datagrid_popup_editing_2_desktop.png', overlayContent);

    await page.locator('.dx-popup-content .dx-scrollable-container').first()
      .evaluate((element, [x, y]) => element.scrollBy(x, y), [0, 1000]);

    await testScreenshot(page, 'datagrid_popup_editing_3_desktop.png', overlayContent);
  });
});
