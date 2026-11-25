import { test } from '@playwright/test';
import { describeManualTest, testScreenshot, waitForSettled } from '../../../utils/visual-tests/playwright/manual-test';

const TABS_WRAPPER_CLASS = 'dx-tabs-wrapper';
const TAB_CLASS = 'dx-tab';
const SELECT_BOX_CONTAINER_CLASS = 'select-box-container';
const SELECTBOX_CLASS = 'dx-selectbox';
const SELECTBOX_POPUP_WRAPPER_CLASS = 'dx-selectbox-popup-wrapper';
const LIST_ITEM_CLASS = 'dx-list-item';

describeManualTest('Tabs', 'Selection', { width: 900, height: 1200 }, () => {
  test('Selection', async ({ page }) => {
    await page.locator(`.${TABS_WRAPPER_CLASS} .${TAB_CLASS}`).nth(1).click();

    await testScreenshot(page, 'tabs_second_item_selection.png');

    await page.locator(`.${SELECT_BOX_CONTAINER_CLASS} .${SELECTBOX_CLASS}`).nth(0).click();
    // A selection made while the list is still opening leaves the React MultiView on the previous
    // employee, though the tabs and the select box show the new one.
    await waitForSettled(page);
    await page.locator(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(2).click();

    await testScreenshot(page, 'tabs_third_item_selection.png');
  });
});
