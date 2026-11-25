import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('SelectBox', 'Grouping', { width: 900, height: 600 }, () => {
  test('Grouping', async ({ page }) => {
    const selectBoxes = page.locator('.dx-selectbox');

    await selectBoxes.nth(0).click();

    await testScreenshot(page, 'selectbox_groupeditems_first_opened.png');

    await selectBoxes.nth(0).click();
    await selectBoxes.nth(1).click();

    await testScreenshot(page, 'selectbox_groupeditems_second_opened.png');

    await selectBoxes.nth(1).click();
    await selectBoxes.nth(2).click();

    await testScreenshot(page, 'selectbox_groupeditems_third_opened.png');
  });
});
