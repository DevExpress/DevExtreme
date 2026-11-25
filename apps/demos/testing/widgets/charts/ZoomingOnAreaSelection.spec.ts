import { test } from '@playwright/test';
import { describeManualTest, drag, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Charts', 'AreaSelectionZooming', { width: 900, height: 600 }, () => {
  test('AreaSelectionZooming. Drag', async ({ page }) => {
    await drag(page, page.locator('.dxc-series circle').nth(7), 600, 200);
    await testScreenshot(page, 'zooming_by_selection.png');

    await page.locator('#reset-zoom').click();
    await testScreenshot(page, 'reset_zooming_by_selection.png');
  });
});
