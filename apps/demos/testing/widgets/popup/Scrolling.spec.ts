import { expect, test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const OVERLAY_WRAPPER_CLASS = 'dx-overlay-wrapper';
const BUTTON_CLASS = 'dx-button';
const TOOLBAR_CLASS = 'dx-toolbar';
const BOTTOM_TOOLBAR_CLASS = 'dx-popup-bottom';

describeManualTest('Popup', 'Scrolling', { width: 900, height: 600 }, () => {
  test('Scrolling', async ({ page }) => {
    await page.locator(`.${BUTTON_CLASS}`).nth(0).click();
    await testScreenshot(page, 'popup with scrollable container.png');

    await page.locator(`.${OVERLAY_WRAPPER_CLASS} .${TOOLBAR_CLASS}.${BOTTOM_TOOLBAR_CLASS} .${BUTTON_CLASS}`).first().click();
    // The closed popup is hidden a moment after its animation; until then its shadow adds to the
    // shadow of the next one.
    await expect(page.locator(`.${OVERLAY_WRAPPER_CLASS} .dx-overlay-content:visible`)).toHaveCount(0);

    await page.locator(`.${BUTTON_CLASS}`).nth(1).click();
    await testScreenshot(page, 'popup with scrollview.png');
  });
});
