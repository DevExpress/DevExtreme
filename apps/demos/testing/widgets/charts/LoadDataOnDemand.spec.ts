import { test } from '@playwright/test';
import { describeManualTest, drag, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Charts', 'LoadDataOnDemand', { width: 900, height: 600 }, () => {
  test('LoadDataOnDemand', async ({ page }) => {
    await drag(page, page.locator('#chart svg').first(), 20, 0);
    await testScreenshot(page, 'charts_drag.png');
  });
});
