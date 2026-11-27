import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Stepper', 'StepTemplate', { width: 900, height: 800 }, () => {
  test('Correct focus styles when focusing on the stepper', async ({ page }) => {
    await page.locator('body').click({ position: { x: 10, y: 10 } });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await testScreenshot(page, 'Second stepper is focused.png');

    await page.keyboard.press('Tab');

    await testScreenshot(page, 'Third stepper is focused.png');
  });
});
