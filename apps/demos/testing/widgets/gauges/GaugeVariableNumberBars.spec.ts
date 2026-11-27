import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Gauges', 'VariableNumberOfBars', { width: 900, height: 600 }, () => {
  test('Bars visibility changing', async ({ page }) => {
    const checkBoxes = page.locator('.dx-checkbox-icon');

    await checkBoxes.nth(2).click();
    await checkBoxes.nth(3).click();

    await testScreenshot(page, 'bargauge_hide_bars.png', '#gauge');

    await checkBoxes.nth(2).click();
    await checkBoxes.nth(3).click();

    await testScreenshot(page, 'bargauge_show_bars.png', '#gauge');
  });
});
