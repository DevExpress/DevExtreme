import { test, expect } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'Toolbar', { width: 900, height: 600 }, () => {
  test('Toolbar', async ({ page }) => {
    const menuButton = page.locator('.dx-toolbar').locator('.dx-toolbar-menu-container').locator('.dx-button')
      .first();
    const menuItems = page.locator('.dx-overlay-wrapper').locator('.dx-list-item');

    await testScreenshot(page, 'toolbar_customization_wide.png');

    await page.setViewportSize({ width: 490, height: 600 });
    await menuButton.click();
    // The opened menu usually focuses its first item a moment after it shows, but not always; the
    // item is focused here, so that every run shows the same.
    await menuItems.locator('.dx-button').filter({ hasText: 'Collapse All' }).focus();

    await testScreenshot(page, 'toolbar_customization_medium.png');

    await page.locator('body').click({ position: { x: 0, y: 0 } });
    await page.setViewportSize({ width: 320, height: 600 });
    await menuButton.click();
    await expect(menuItems).toHaveCount(4);

    await testScreenshot(page, 'toolbar_customization_thin.png');
  });
});
