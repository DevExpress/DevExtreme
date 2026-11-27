import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Charts', 'Overview', { width: 900, height: 600 }, () => {
  test('Tooltip', async ({ page }) => {
    const marker = page.locator('.dxc-markers').nth(0).locator('rect').nth(1);

    await marker.hover();
    await testScreenshot(page, 'charts_overview_tooltip.png');
  });
});
