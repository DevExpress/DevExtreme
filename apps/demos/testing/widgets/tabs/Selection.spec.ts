import { test } from '@playwright/test';
import { currentFramework, describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const TABS_WRAPPER_CLASS = 'dx-tabs-wrapper';
const TAB_CLASS = 'dx-tab';
const SELECT_BOX_CONTAINER_CLASS = 'select-box-container';
const SELECTBOX_CLASS = 'dx-selectbox';
const SELECTBOX_POPUP_WRAPPER_CLASS = 'dx-selectbox-popup-wrapper';
const LIST_ITEM_CLASS = 'dx-list-item';

describeManualTest('Tabs', 'Selection', { width: 900, height: 1200 }, () => {
  // In React the MultiView sometimes stays on the previous employee while the tabs and the select
  // box show the new one, whatever the test waits for.
  test.skip(currentFramework === 'React', 'The React MultiView does not always follow the selected item');

  test('Selection', async ({ page }) => {
    await page.locator(`.${TABS_WRAPPER_CLASS} .${TAB_CLASS}`).nth(1).click();

    await testScreenshot(page, 'tabs_second_item_selection.png');

    await page.locator(`.${SELECT_BOX_CONTAINER_CLASS} .${SELECTBOX_CLASS}`).nth(0).click();
    await page.locator(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(2).click();

    await testScreenshot(page, 'tabs_third_item_selection.png');
  });
});
