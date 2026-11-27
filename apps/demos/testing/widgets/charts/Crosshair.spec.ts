import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Charts', 'Crosshair', { width: 900, height: 600 }, () => {
  test('Chart.Crosshair', async ({ page }) => {
    const point = page.locator('.dxc-series').nth(1).locator('circle').nth(1);

    // TestCafe moved the mouse to the point and acted on whatever was on top there (here the transparent trackers over the SVG), so the actionability check is skipped.
    await point.hover({ force: true });
    await testScreenshot(page, 'charts_crosshair.png');
  });
});
