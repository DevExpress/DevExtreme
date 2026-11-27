import { expect, test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const OPTION_CLASS = 'option';
const SELECTBOX_CLASS = 'dx-selectbox';
const SELECTBOX_POPUP_WRAPPER_CLASS = 'dx-selectbox-popup-wrapper';
const LIST_ITEM_CLASS = 'dx-list-item';

describeManualTest('TabPanel', 'Overview', { width: 900, height: 1200 }, () => {
  test('Overview', async ({ page }) => {
    const selectBoxes = page.locator(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`);
    const listItems = page.locator(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}:visible`);

    // The popups of the closed select boxes stay in the DOM, and a closing one stays visible for its
    // animation, so each selection waits for the list to close.
    const selectItem = async (selectBoxIndex: number, itemIndex: number): Promise<void> => {
      await selectBoxes.nth(selectBoxIndex).click();
      await listItems.nth(itemIndex).click();
      await expect(listItems).toHaveCount(0);
    };

    await selectItem(0, 1);

    await testScreenshot(page, 'tabpanel_tabsposition_top.png');

    await selectItem(1, 1);

    await testScreenshot(page, 'tabpanel_stylingmode_primary.png');

    await selectItem(2, 1);

    await testScreenshot(page, 'tabpanel_iconposition_start.png');
  });
});
