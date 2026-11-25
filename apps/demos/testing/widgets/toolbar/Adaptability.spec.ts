import { test } from '@playwright/test';
import { describeManualTest, drag, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const RESIZABLE_HANDLE_RIGHT_CLASS = 'dx-resizable-handle-right';
const CHECKBOX_CLASS = 'dx-checkbox';
const OPTIONS_CONTAINER_CLASS = 'options-container';
const TOOLBAR_CLASS = 'dx-toolbar';
const DROP_DOWN_MENU_BUTTON_CLASS = 'dx-dropdownmenu-button';

describeManualTest('Toolbar', 'Adaptability', { width: 900, height: 600 }, () => {
  test('Adaptability', async ({ page }) => {
    await drag(page, page.locator(`.${RESIZABLE_HANDLE_RIGHT_CLASS}`), -400, 0);
    await testScreenshot(page, 'toolbar_multiline_mode_minimize.png');

    await page.locator(`.${OPTIONS_CONTAINER_CLASS} .${CHECKBOX_CLASS}`).click();
    await testScreenshot(page, 'toolbar_singleline_mode_init.png');

    await page.locator(`.${TOOLBAR_CLASS} .${DROP_DOWN_MENU_BUTTON_CLASS}`).click();
    await testScreenshot(page, 'toolbar_singleline_mode_menu_open.png');
  });
});
