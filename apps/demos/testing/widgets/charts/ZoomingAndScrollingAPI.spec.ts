import { test } from '@playwright/test';
import { describeManualTest, drag, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Charts', 'ZoomingAndScrollingAPI', { width: 900, height: 600 }, () => {
  test('ZoomingAndScrollingAPI. RangeSelector drag', async ({ page }) => {
    await drag(page, page.locator('.slider').nth(0), 500, 0, { offsetX: 10, offsetY: 10 });

    await testScreenshot(page, 'range_selector_slider_drag.png');

    const areaTracker = page.locator('.area-tracker').first();
    const box = await areaTracker.boundingBox();

    // TestCafe clicked at offsetX 400 and the vertical center.
    await areaTracker.click({ position: { x: 400, y: (box?.height ?? 0) / 2 } });

    await testScreenshot(page, 'range_selector_click_to_empty_place.png');
  });
});
