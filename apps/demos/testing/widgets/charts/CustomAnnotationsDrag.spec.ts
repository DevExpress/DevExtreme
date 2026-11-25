import { test } from '@playwright/test';
import { describeManualTest, drag, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Charts', 'CustomAnnotations', { width: 900, height: 600 }, () => {
  test('CustomAnnotations. Drag', async ({ page }) => {
    await drag(page, page.locator('#chart .dxc-annotations g').nth(0), 90, 40);
    await testScreenshot(page, 'annotations_drag.png');
  });
});
