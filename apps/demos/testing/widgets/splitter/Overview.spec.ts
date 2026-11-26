import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const PANE_CONTENT_CLASS = 'dx-splitter-item-content';

describeManualTest('Splitter', 'Overview', { width: 900, height: 800 }, () => {
  test('Correct Focus styles on every Item Panes', async ({ page }) => {
    await page.locator(`.${PANE_CONTENT_CLASS}`).nth(0).click();

    await testScreenshot(page, 'Splitter_Focused_Left_Pane.png');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await testScreenshot(page, 'Splitter_Focused_Central_Pane.png');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await testScreenshot(page, 'Splitter_Focused_Nested_Left_Pane.png');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await testScreenshot(page, 'Splitter_Focused_Nested_Central_Pane.png');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await testScreenshot(page, 'Splitter_Focused_Nested_Right_Pane.png');

    await page.keyboard.press('Tab');

    await testScreenshot(page, 'Splitter_Focused_Right_Pane.png');
  });
});
