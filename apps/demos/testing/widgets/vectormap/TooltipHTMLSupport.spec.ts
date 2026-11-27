import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('VectorMap', 'TooltipsCustomization', { width: 900, height: 700 }, () => {
  test('Tooltip', async ({ page }) => {
    const label = page.locator('#vector-map tspan').filter({ hasText: /^Canada$/ }).first();

    // TestCafe moved the mouse to the point and acted on whatever was on top there (here the transparent trackers over the SVG), so the actionability check is skipped.
    await label.hover({ force: true });
    await testScreenshot(page, 'vectormap_tooltip.png');
  });
});
