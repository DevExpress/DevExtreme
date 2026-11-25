import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('TagBox', 'Grouping', { width: 900, height: 600 }, () => {
  test('Grouping', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Alt+ArrowDown');

    await testScreenshot(page, 'tagbox_groupeditems_first_opened.png');

    await page.keyboard.press('Escape');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Alt+ArrowDown');

    await testScreenshot(page, 'tagbox_groupeditems_second_opened.png');

    await page.keyboard.press('Escape');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Alt+ArrowDown');

    await testScreenshot(page, 'tagbox_groupeditems_third_opened.png');
  });
});
