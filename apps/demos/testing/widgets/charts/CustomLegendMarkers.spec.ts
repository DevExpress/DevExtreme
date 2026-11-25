import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Charts', 'LegendMarkersCustomization', { width: 900, height: 600 }, () => {
  test('LegendMarkersCustomization', async ({ page }) => {
    await page.locator('.dxl-marker').nth(1).hover();
    await testScreenshot(page, 'charts_custom_legend_marker.png', page.locator('.dxc-legend').first());
  });
});
