import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const IMAGES_CONTAINER_CLASS = 'images';
const ITEM_CONTENT_CLASS = 'item-content';

describeManualTest('Common', 'PopupAndNotificationsOverview', { width: 900, height: 600 }, () => {
  test('PopupAndNotificationsOverview', async ({ page }) => {
    await page.locator(`.${IMAGES_CONTAINER_CLASS} .${ITEM_CONTENT_CLASS}`).first().click();
    await testScreenshot(page, 'common_dialogs_and_notifications_overview_popup.png');
  });
});
