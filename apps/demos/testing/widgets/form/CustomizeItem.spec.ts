import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Form', 'ItemCustomization', { width: 900, height: 800 }, () => {
  test('ItemCustomization', async ({ page }) => {
    const helpedInfo = page.locator('#helpedInfo');
    const box = await helpedInfo.boundingBox();

    // TestCafe hovered at { offsetX: -1, offsetY: -1 }: one pixel in from the right bottom corner.
    await helpedInfo.hover({
      position: box ? { x: box.width - 1, y: box.height - 1 } : undefined,
    });

    await testScreenshot(page, 'form_customize_item_label_tooltip.png', '.dx-form');
  });
});
