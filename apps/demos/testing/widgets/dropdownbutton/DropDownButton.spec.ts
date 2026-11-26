import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
const DROP_DOWN_BUTTON_TOGGLE_CLASS = 'dx-dropdownbutton-toggle';

describeManualTest('DropDownButton', 'Overview', { width: 900, height: 600 }, () => {
  test('Custom Overview Appearance', async ({ page }) => {
    await page.locator(`.${DROP_DOWN_BUTTON_CLASS}`).nth(0).click();

    await testScreenshot(page, 'dropdown_button_overview_custom_static_text.png');

    await page.locator(`.${DROP_DOWN_BUTTON_CLASS}`).nth(0).click();

    await page.locator(`.${DROP_DOWN_BUTTON_TOGGLE_CLASS}`).first().click();

    await testScreenshot(page, 'dropdown_button_overview_custom_button_action.png');
  });
});
