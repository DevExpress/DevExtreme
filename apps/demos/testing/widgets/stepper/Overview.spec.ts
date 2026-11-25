import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const ORIENTATION_BUTTON_GROUP_ID = 'orientation';
const NAVIGATION_MODE_BUTTON_GROUP_ID = 'navigationMode';
const RTL_MODE_CHECK_BOX_ID = 'rtlMode';
const SELECT_ON_FOCUS_CHECK_BOX_ID = 'selectOnFocus';

describeManualTest('Stepper', 'Overview', { width: 900, height: 800 }, () => {
  test('Stepper Overview Appearance', async ({ page }) => {
    const rtlModeCheckBox = page.locator(`#${RTL_MODE_CHECK_BOX_ID}`);
    const orientationButtons = page.locator(`#${ORIENTATION_BUTTON_GROUP_ID} .dx-button`);
    const navigationModeButtons = page.locator(`#${NAVIGATION_MODE_BUTTON_GROUP_ID} .dx-button`);

    await rtlModeCheckBox.click();

    await testScreenshot(page, 'Stepper overview rtl=true, orientation=horizontal.png');

    await orientationButtons.nth(1).click();

    await testScreenshot(page, 'Stepper overview rtl=true, orientation=vertical.png');

    await rtlModeCheckBox.click();
    await orientationButtons.nth(0).click();

    await navigationModeButtons.nth(1).click();
    await navigationModeButtons.nth(0).click();

    await page.locator(`#${SELECT_ON_FOCUS_CHECK_BOX_ID}`).click();

    await testScreenshot(page, 'Stepper overview selectOnFocus=false.png');
  });
});
