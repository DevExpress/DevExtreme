import { expect, test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const LOOKUP_CLASS = 'dx-lookup';
const POPUP_CONTENT = '.dx-lookup-popup-wrapper .dx-overlay-content';

describeManualTest('Lookup', 'Basics', { width: 900, height: 600 }, () => {
  test('Custom Lookup Appearance', async ({ page }) => {
    const popups = page.locator(`${POPUP_CONTENT}:visible`);

    await page.locator(`.${LOOKUP_CLASS}`).nth(0).click();

    await testScreenshot(page, 'lookup_simple_popup.png');

    // The popup covers the other lookup.
    await page.keyboard.press('Escape');
    await expect(popups).toHaveCount(0);

    await page.locator(`.${LOOKUP_CLASS}`).nth(1).click();

    await testScreenshot(page, 'lookup_templates_custom_appearance.png');
  });
});
