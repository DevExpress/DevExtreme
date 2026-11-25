import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DropDownBox', 'MultipleSelection', { width: 900, height: 600 }, () => {
  test('MultipleSelection', async ({ page }) => {
    const DROP_DOWN_BOX_CLASS = 'dx-dropdownbox';
    const dropDownBoxes = page.locator(`.${DROP_DOWN_BOX_CLASS}`);

    await dropDownBoxes.nth(0).click();

    await testScreenshot(page, 'dropdownbox_multiple_selection_treebox.png');

    await dropDownBoxes.nth(0).click();

    await dropDownBoxes.nth(1).click();
    // Whether the checkbox of the opened grid gets the focus style depends on the framework rendering
    // it; the TestCafe etalon masked it. The shot is about the selection, so nothing keeps the focus.
    await page.evaluate(() => { (document.activeElement as HTMLElement | null)?.blur(); });

    await testScreenshot(page, 'dropdownbox_multiple_selection_gridbox.png');
  });
});
