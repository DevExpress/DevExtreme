import { expect, test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const OPTION_CLASS = 'option';
const SELECTBOX_CLASS = 'dx-selectbox';
const SELECTBOX_POPUP_WRAPPER_CLASS = 'dx-selectbox-popup-wrapper';
const LIST_ITEM_CLASS = 'dx-list-item';
const CHECKBOX_CLASS = 'dx-checkbox';

describeManualTest('Tabs', 'Overview', { width: 900, height: 1200 }, () => {
  test('Overview', async ({ page }) => {
    const selectBoxes = page.locator(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`);
    const checkBoxes = page.locator(`.${OPTION_CLASS} .${CHECKBOX_CLASS}`);
    const listItems = page.locator(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}:visible`);

    // A closing popup stays visible for its animation, and its items would be taken for the ones of
    // the next select box, so each selection waits for the list to close.
    const selectItem = async (selectBoxIndex: number, itemIndex: number): Promise<void> => {
      await selectBoxes.nth(selectBoxIndex).click();
      await listItems.nth(itemIndex).click();
      await expect(listItems).toHaveCount(0);
    };

    await selectItem(0, 1);

    await testScreenshot(page, 'tabs_orientation_vertical.png');

    await selectItem(1, 1);

    await testScreenshot(page, 'tabs_stylingmode_secondary.png');

    await selectItem(2, 2);

    await testScreenshot(page, 'tabs_iconposition_end.png');

    await checkBoxes.nth(3).click();

    await testScreenshot(page, 'tabs_rtlenabled_true.png');

    await checkBoxes.nth(3).click();
    await selectItem(0, 0);

    await checkBoxes.nth(0).click();

    await testScreenshot(page, 'tabs_shownavbuttons_true.png');

    await checkBoxes.nth(2).click();
    await selectItem(0, 1);

    await testScreenshot(page, 'tabs_orientation_vertical_without_strict_class.png');

    await selectItem(0, 0);

    await testScreenshot(page, 'tabs_orientation_horizontal_with_strict_class.png');
  });
});
