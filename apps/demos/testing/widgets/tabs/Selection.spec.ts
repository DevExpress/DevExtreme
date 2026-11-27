import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const TABS_WRAPPER_CLASS = 'dx-tabs-wrapper';
const TAB_CLASS = 'dx-tab';
const SELECT_BOX_CONTAINER_CLASS = 'select-box-container';
const SELECTBOX_CLASS = 'dx-selectbox';
const SELECTBOX_POPUP_WRAPPER_CLASS = 'dx-selectbox-popup-wrapper';
const LIST_ITEM_CLASS = 'dx-list-item';

// In React the MultiView gets the new item a bit later and may not have started to slide when
// the page looks settled.
const expectEmployee = async (page: Page, name: string): Promise<void> => {
  const photos = page.locator('.dx-multiview-item:not(.dx-multiview-item-hidden) .employee-photo');

  await expect.poll(() => photos.evaluateAll((elements) => elements.map((element) => element.getAttribute('alt'))))
    .toEqual([name]);
};

describeManualTest('Tabs', 'Selection', { width: 900, height: 1200 }, () => {
  test('Selection', async ({ page }) => {
    await page.locator(`.${TABS_WRAPPER_CLASS} .${TAB_CLASS}`).nth(1).click();
    await expectEmployee(page, 'Olivia Peyton');

    await testScreenshot(page, 'tabs_second_item_selection.png');

    await page.locator(`.${SELECT_BOX_CONTAINER_CLASS} .${SELECTBOX_CLASS}`).nth(0).click();
    await page.locator(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(2).click();
    await expectEmployee(page, 'Robert Reagan');

    await testScreenshot(page, 'tabs_third_item_selection.png');
  });
});
